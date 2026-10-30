"""Data for placing the user's own places (birthplace, home) on the globe through time.

  src/data/globe/plate-grid.json  the PALEOMAP plate under each half-degree cell today, so any
                                  point can ride its plate back through time; each row is
                                  run-length encoded as [plate, count, plate, count, ...]
  src/data/cities.json            towns and cities to choose a birthplace or home from:
                                  [name, region, country, lat, lon], from Natural Earth's
                                  populated places (public domain)

Usage (needs pygplates, rasterio, scipy, numpy):
  python build_user_lookup.py PALEOMAP_PlatePolygons.gpmlz PALEOMAP_PlateModel.rot \\
      ne_10m_populated_places_simple.geojson
"""
import json
import sys
from pathlib import Path

import pygplates
import rasterio.features
from rasterio.transform import from_origin
from scipy.ndimage import distance_transform_edt

ROOT = Path(__file__).resolve().parents[2]
RES = 0.5


def plate_grid(polygons_path, rotation_path):
    polygons = pygplates.FeatureCollection(polygons_path)
    model = pygplates.RotationModel(rotation_path)
    reconstructed = []
    pygplates.reconstruct(polygons, model, reconstructed, 0, anchor_plate_id=0)
    wrapper = pygplates.DateLineWrapper()
    shapes = []
    for r in reconstructed:
        g = r.get_reconstructed_geometry()
        if not isinstance(g, pygplates.PolygonOnSphere):
            continue
        plate = r.get_feature().get_reconstruction_plate_id()
        for w in wrapper.wrap(g):
            ring = [(p.get_longitude(), p.get_latitude()) for p in w.get_exterior_points()]
            if len(ring) >= 3:
                shapes.append(({'type': 'Polygon', 'coordinates': [ring]}, plate))
    h, w = int(180 / RES), int(360 / RES)
    raster = rasterio.features.rasterize(shapes, out_shape=(h, w), transform=from_origin(-180, 90, RES, RES), fill=0, dtype='int32')
    if (raster == 0).any():
        idx = distance_transform_edt(raster == 0, return_distances=False, return_indices=True)
        raster = raster[tuple(idx)]
    rows = []
    for row in raster.tolist():
        rle, prev, n = [], row[0], 0
        for v in row:
            if v == prev:
                n += 1
            else:
                rle += [prev, n]
                prev, n = v, 1
        rows.append(rle + [prev, n])
    return {'res': RES, 'rows': rows}


def cities(path):
    out = []
    for f in json.load(open(path))['features']:
        p = f['properties']
        out.append([p['name'], p.get('adm1name') or '', p.get('adm0name') or '', round(p['latitude'], 2), round(p['longitude'], 2), p.get('pop_max') or 0])
    # Biggest first, so searches list the likeliest match at the top.
    out.sort(key=lambda c: -c[5])
    return [c[:5] for c in out]


def main():
    polygons, rotations, places = sys.argv[1:4]
    grid = plate_grid(polygons, rotations)
    (ROOT / 'src/data/globe/plate-grid.json').write_text(json.dumps(grid, separators=(',', ':')))
    (ROOT / 'src/data/cities.json').write_text(json.dumps(cities(places), ensure_ascii=False, separators=(',', ':')))
    print('cells', sum(len(r) for r in grid['rows']) // 2, 'runs')


main()
