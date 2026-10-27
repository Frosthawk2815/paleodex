"""Builds the globe data in src/data/globe/.

Outputs
  paleogeography.json  land and shallow-sea polygons through time
  rotations.json       the PALEOMAP plate rotation model, trimmed to the last ~600 million years
  sealevel.json        global sea level for the Quaternary, one value per thousand years

Sources (all CC BY 4.0 or public domain)
  - Land and sea: Scotese, C.R. & Wright, N. (2018) PALEOMAP Paleodigital Elevation Models
    (PaleoDEMS) for the Phanerozoic. https://doi.org/10.5281/zenodo.5460860
    (the 6 arc-minute netCDF files, one per 5 million years from 0 to 540 Ma)
  - Plates: PALEOMAP Global Plate Model v2d3 (Scotese 2016), the model the PaleoDEMs were built on.
    PALEOMAP_PlateModel.rot and PALEOMAP_PlatePolygons.gpmlz, as distributed in
    https://github.com/GPlates/gplates-web-service (django/GWS/data/deprecated/MODELS/PALEOMAP).
  - Sea level 0-798 ka: Spratt, R.M. & Lisiecki, L.E. (2016) A Late Pleistocene sea level stack.
    Climate of the Past 12, 1079-1092 (NOAA Paleoclimatology: spratt2016.txt, long PC1).
  - Sea level 798 ka-3 Ma: Bintanja, R. & van de Wal, R.S.W. (2008) North American ice-sheet dynamics
    and the onset of 100,000-year glacial cycles. Nature 454, 869-872 (NOAA: bintanja2008.txt).

How it works
  Each PaleoDEM is a map of elevation in "paleo" coordinates for its age. Cells above sea level
  are land; cells down to -200 m are shallow sea. Each region is split by the tectonic plate it sat
  on at that age, then rotated back to present-day coordinates. The app rotates the pieces
  forward to any time, so continents move smoothly and coastlines change every 5 million years.

  The Quaternary (last 2.58 million years) uses the modern map instead, at four sea levels chosen
  from the sea-level curve. The modern PaleoDEM stores depth in 40 m steps: 0 covers roughly
  0 to -40 m (e.g. Dogger Bank), -40 covers -40 to -80 m and -80 covers -80 to -120 m.
  Low-lying land is stored as 40, so land is anything above 20 m.

Usage (needs pygplates, netCDF4, numpy, scipy, rasterio, shapely)
  python tools/globe-data/build.py <paleodem-6min-dir> <paleomap-model-dir> <sealevel-dir> src/data/globe
"""

import base64
import glob
import json
import math
import os
import re
import struct
import sys

import netCDF4
import numpy as np
import pygplates
import rasterio.features
from rasterio.transform import from_origin
from scipy.ndimage import distance_transform_edt
from shapely.geometry import shape
from shapely.geometry.polygon import orient

MAX_TIME = 600.0
QUATERNARY_MA = 2.58

# Deep time: land at 0.5° (the PaleoDEMs were drawn at 1°), shallow sea at 1°.
LAND_RES = 0.5
SHELF_RES = 1.0
# Quaternary: the modern map is genuinely detailed, so use 0.2° for land.
QUAT_LAND_RES = 0.2
QUAT_SHELF_RES = 0.5

# Quaternary sea-level steps: (lowest sea level the step is used for, land threshold on the DEM).
# A depth class is treated as exposed once sea level is 20 m below its value.
QUATERNARY_LEVELS = [
    (-20, 20),  # today's coastline
    (-60, -20),  # 0 class exposed: Dogger Bank, much of the southern North Sea, Sunda shallows
    (-100, -60),  # -40 class exposed: English Channel, Bering Strait, most of the Sunda Shelf
    (-999, -100),  # -80 class exposed: last glacial maximum, about -120 m
]


def load_dem(path):
    d = netCDF4.Dataset(path)
    lat = d['latitude'][:]
    z = d['z'][:].filled(-9999).astype(np.float32)
    if lat[0] < lat[-1]:
        z = z[::-1]
    return z[:1800, :3600]  # 0.1° cells, rows from 90°N, columns from 180°W


def downsample(z, res):
    k = int(round(res / 0.1))
    return z.reshape(1800 // k, k, 3600 // k, k).mean(axis=(1, 3))


def plate_raster(plate_polygons, rotation_model, age, res):
    """Plate ID for each cell at `age`, from the reconstructed plate polygons."""
    reconstructed = []
    pygplates.reconstruct(plate_polygons, rotation_model, reconstructed, age, anchor_plate_id=0)
    wrapper = pygplates.DateLineWrapper()
    shapes = []
    for r in reconstructed:
        geometry = r.get_reconstructed_geometry()
        if not isinstance(geometry, pygplates.PolygonOnSphere):
            continue
        plate = r.get_feature().get_reconstruction_plate_id()
        for w in wrapper.wrap(geometry):
            ring = [(p.get_longitude(), p.get_latitude()) for p in w.get_exterior_points()]
            if len(ring) >= 3:
                shapes.append(({'type': 'Polygon', 'coordinates': [ring]}, plate))
    h, w = int(180 / res), int(360 / res)
    raster = rasterio.features.rasterize(
        shapes, out_shape=(h, w), transform=from_origin(-180, 90, res, res), fill=0, dtype='int32'
    )
    # Cells no plate polygon covers take the nearest plate.
    if (raster == 0).any():
        idx = distance_transform_edt(raster == 0, return_distances=False, return_indices=True)
        raster = raster[tuple(idx)]
    return raster


def densify(coords, max_step=2.0):
    out = [coords[0]]
    for (x0, y0), (x1, y1) in zip(coords, coords[1:]):
        n = int(math.ceil(max(abs(x1 - x0), abs(y1 - y0)) / max_step))
        for i in range(1, n + 1):
            out.append((x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n))
    return out


def encode_ring(points):
    """Int16 little-endian, hundredths of a degree, first point absolute then deltas; base64."""
    vals = []
    prev = None
    for lon, lat in points:
        x, y = round(lon * 100), round(lat * 100)
        if prev is None:
            vals += [x, y]
        else:
            dx = (x - prev[0] + 18000) % 36000 - 18000  # wrap longitude
            vals += [dx, y - prev[1]]
        prev = (x, y)
    return base64.b64encode(struct.pack(f'<{len(vals)}h', *vals)).decode('ascii')


def polygons(mask, plates, res, rotation_model, age, min_cells=5):
    """Polygons of `mask`, split by plate and rotated to present-day coordinates."""
    labels = np.where(mask, plates, 0).astype('int32')
    out = []
    count = 0
    inverse = {}
    for geom, plate in rasterio.features.shapes(labels, mask=mask, transform=from_origin(-180, 90, res, res)):
        g = shape(geom)
        if g.area < min_cells * res * res:
            continue
        g = g.simplify(res * 0.85, preserve_topology=True)
        if g.is_empty or g.geom_type != 'Polygon':
            continue
        g = orient(g, sign=-1.0)  # exterior clockwise, holes anticlockwise (what d3-geo expects)
        plate = int(plate)
        if plate not in inverse:
            inverse[plate] = rotation_model.get_rotation(age, plate, anchor_plate_id=0).get_inverse()
        rot = inverse[plate]
        rings = []
        for ring in [g.exterior, *g.interiors]:
            coords = list(ring.coords)
            pts = densify(coords)[:-1]
            present = []
            for lon, lat in pts:
                la, lo = (rot * pygplates.PointOnSphere(max(-90.0, min(90.0, lat)), lon)).to_lat_lon()
                present.append((lo, la))
            if len(present) >= 3:
                rings.append(encode_ring(present))
                count += len(present)
        if rings:
            out.append([plate, *rings])
    return out, count


def slice_entry(z, plate_polygons, rotation_model, age, land_res, shelf_res, land_threshold):
    zl = downsample(z, land_res)
    zs = downsample(z, shelf_res)
    land, n1 = polygons(
        zl > land_threshold, plate_raster(plate_polygons, rotation_model, age, land_res), land_res, rotation_model, age
    )
    shelf_mask = (zs > land_threshold - 220) & (zs <= land_threshold)
    shelf, n2 = polygons(
        shelf_mask, plate_raster(plate_polygons, rotation_model, age, shelf_res), shelf_res, rotation_model, age
    )
    return {'land': land, 'shelf': shelf}, n1 + n2


def export_rotations(path):
    # PLATES4 rotation file: moving_plate time lat lon angle fixed_plate ! comment
    order = []
    with open(path, encoding='utf-8', errors='replace') as fh:
        for line in fh:
            parts = line.split('!')[0].split()
            if len(parts) < 6:
                continue
            try:
                moving, time, lat, lon, angle, fixed = (
                    int(parts[0]), float(parts[1]), float(parts[2]),
                    float(parts[3]), float(parts[4]), int(parts[5]),
                )
            except ValueError:
                continue
            if moving == 999:
                continue
            key = (moving, fixed)
            if not order or order[-1][0] != key:
                order.append([key, []])
            order[-1][1].append([time, lat, lon, angle])
    out = {}
    for (moving, fixed), samples in order:
        kept = []
        for s in samples:
            kept.append(s)
            if s[0] > MAX_TIME:
                break
        if kept[-1][0] < 0 or kept[0][0] > MAX_TIME:
            continue
        out.setdefault(str(moving), []).append({'f': fixed, 's': kept})
    return out


def sea_level_curve(sealevel_dir):
    """Global sea level (m) every 1,000 years from today back to 2,580 ka."""
    spratt = {}
    with open(os.path.join(sealevel_dir, 'spratt2016.txt')) as fh:
        for line in fh:
            parts = line.split('\t')
            if parts and re.fullmatch(r'\d+', parts[0].strip()):
                spratt[int(parts[0])] = float(parts[5])  # long PC1
    bintanja = {}
    with open(os.path.join(sealevel_dir, 'bintanja2008.txt')) as fh:
        for line in fh:
            parts = line.split()
            if len(parts) == 9 and re.fullmatch(r'-?\d+(\.\d+)?', parts[0]):
                # Bintanja's column is sea-level lowering (positive = lower), so flip the sign.
                bintanja[round(float(parts[0]) * 10)] = -float(parts[8])
    # The Spratt & Lisiecki stack reads about +9 m at 0 ka; shift it so today is 0 m.
    # That puts the last glacial maximum near -125 m, in line with standard estimates.
    offset = spratt[0]
    spratt = {k: v - offset for k, v in spratt.items()}
    values = []
    for ka in range(0, int(QUATERNARY_MA * 1000) + 1):
        v = spratt.get(ka)
        if v is None or math.isnan(v):
            v = bintanja[ka * 10]
        values.append(round(v, 1))
    return values


def main():
    dem_dir, model_dir, sealevel_dir, out_dir = sys.argv[1:5]
    rotation_model = pygplates.RotationModel(os.path.join(model_dir, 'PALEOMAP_PlateModel.rot'))
    plate_polygons = pygplates.FeatureCollection(os.path.join(model_dir, 'PALEOMAP_PlatePolygons.gpmlz'))

    files = {}
    for p in glob.glob(os.path.join(dem_dir, '*.nc')):
        m = re.search(r'_([0-9.]+)Ma\.nc$', p)
        if m:
            files[float(m.group(1))] = p

    slices = []
    total = 0
    for age in sorted(files):
        if age == 0:
            continue
        entry, n = slice_entry(load_dem(files[age]), plate_polygons, rotation_model, age, LAND_RES, SHELF_RES, 20)
        slices.append({'age': age, **entry})
        total += n
        print(f'{age:>6} Ma: {len(entry["land"])} land, {len(entry["shelf"])} shelf polygons, {n} points', flush=True)

    modern = load_dem(files[0.0])
    quaternary = []
    for min_sea_level, threshold in QUATERNARY_LEVELS:
        entry, n = slice_entry(modern, plate_polygons, rotation_model, 0.0, QUAT_LAND_RES, QUAT_SHELF_RES, threshold)
        quaternary.append({'minSeaLevel': min_sea_level, **entry})
        total += n
        print(f'Quaternary (sea level down to {min_sea_level} m): {n} points', flush=True)

    with open(os.path.join(out_dir, 'paleogeography.json'), 'w') as fh:
        json.dump({'slices': slices, 'quaternary': quaternary}, fh, separators=(',', ':'))
    with open(os.path.join(out_dir, 'rotations.json'), 'w') as fh:
        json.dump(export_rotations(os.path.join(model_dir, 'PALEOMAP_PlateModel.rot')), fh, separators=(',', ':'))
    with open(os.path.join(out_dir, 'sealevel.json'), 'w') as fh:
        json.dump({'stepKa': 1, 'metres': sea_level_curve(sealevel_dir)}, fh, separators=(',', ':'))
    print(f'total points: {total}')


if __name__ == '__main__':
    main()
