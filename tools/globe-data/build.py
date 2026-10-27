"""Builds the globe data in src/data/globe/ from the Merdith et al. (2021) plate model.

The app reconstructs continents on the device, so this script only exports:
  - coastlines.json: present-day coastline polygons with their plate ID and valid time
  - coastlines-detailed.json: the same at higher detail, used when zoomed in close
  - rotations.json:  the plate rotation model, trimmed to the last ~600 million years

Model: Merdith, A.S., et al. (2021). Extending full-plate tectonic models into deep time:
Linking the Neoproterozoic and the Phanerozoic. Earth-Science Reviews, 214, 103477.
Files: rotation 1000_0_rotfile_Merdith_et_al.rot, coastlines shapes_coastlines_Merdith_et_al_v2.gpmlz,
as distributed in https://github.com/GPlates/gplates-web-service (django/GWS/data/deprecated/MODELS/MERDITH2021).

Usage (needs `pip install pygplates`):
  python tools/globe-data/build.py <model-dir> src/data/globe
"""

import json
import math
import os
import sys

import pygplates

MAX_TIME = 600.0  # Ma; a little older than the Cambrian so interpolation has a bracket
# (simplification tolerance in degrees, smallest island kept in steradians)
LEVELS = {
    'coastlines.json': (0.25, 2e-5),  # ~28 km detail, islands over ~800 km²
    'coastlines-detailed.json': (0.08, 5e-6),  # ~9 km detail, islands over ~200 km²
}
SCALE = 100  # coordinates stored as integers in hundredths of a degree


def to_xyz(lat, lon):
    la, lo = math.radians(lat), math.radians(lon)
    return (math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la))


def angle_to_great_circle(p, a, b):
    # Angular distance from p to the great circle through a and b.
    n = (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
    nn = math.sqrt(sum(c * c for c in n))
    if nn < 1e-12:
        return math.acos(max(-1.0, min(1.0, sum(x * y for x, y in zip(p, a)))))
    return abs(math.asin(max(-1.0, min(1.0, sum(x * y for x, y in zip(p, n)) / nn))))


def simplify(points, tol):
    # Douglas-Peucker on the sphere, for a closed ring of (lat, lon) points.
    xyz = [to_xyz(*p) for p in points]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        i, j = stack.pop()
        best, idx = 0.0, -1
        for k in range(i + 1, j):
            d = angle_to_great_circle(xyz[k], xyz[i], xyz[j])
            if d > best:
                best, idx = d, k
        if idx >= 0 and best > tol:
            keep[idx] = True
            stack += [(i, idx), (idx, j)]
    return [p for p, k in zip(points, keep) if k]


def export_coastlines(path, tolerance_deg, min_area_sr):
    features = []
    total_points = 0
    for f in pygplates.FeatureCollection(path):
        begin, end = f.get_valid_time()
        if end >= MAX_TIME:
            continue
        plate = f.get_reconstruction_plate_id()
        for g in f.get_geometries():
            if not isinstance(g, pygplates.PolygonOnSphere) or g.get_area() < min_area_sr:
                continue
            # The globe renderer (d3-geo) expects exterior rings to run clockwise.
            if g.get_orientation() == pygplates.PolygonOnSphere.Orientation.counter_clockwise:
                g = pygplates.PolygonOnSphere(list(reversed(g.get_points())))
            pts = g.to_lat_lon_list()
            pts = simplify(pts + [pts[0]], math.radians(tolerance_deg))[:-1]
            if len(pts) < 3:
                continue
            flat = []
            for lat, lon in pts:
                flat += [round(lon * SCALE), round(lat * SCALE)]
            total_points += len(pts)
            features.append(
                {
                    'p': plate,
                    'b': None if math.isinf(begin) else round(begin, 3),
                    'e': 0 if math.isinf(end) else round(end, 3),
                    'r': flat,
                }
            )
    return features, total_points


def export_rotations(path):
    # PLATES4 rotation file: moving_plate time lat lon angle fixed_plate ! comment
    sequences = {}
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
            if moving == 999:  # comment lines
                continue
            key = (moving, fixed)
            if not order or order[-1][0] != key:
                order.append([key, []])
            order[-1][1].append([time, lat, lon, angle])
    out = {}
    for (moving, fixed), samples in order:
        # Keep samples up to the first one older than MAX_TIME.
        trimmed = []
        for s in samples:
            trimmed.append(s)
            if s[0] > MAX_TIME:
                break
        if trimmed[0][0] > MAX_TIME:
            continue
        out.setdefault(str(moving), []).append({'f': fixed, 's': trimmed})
    return out


def main():
    model_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    coast_path = os.path.join(model_dir, 'shapes_coastlines_Merdith_et_al_v2.gpmlz')
    for name, (tolerance, min_area) in LEVELS.items():
        features, n = export_coastlines(coast_path, tolerance, min_area)
        with open(os.path.join(out_dir, name), 'w') as fh:
            json.dump(features, fh, separators=(',', ':'))
        print(f'{name}: {len(features)} polygons, {n} points')
    rotations = export_rotations(os.path.join(model_dir, '1000_0_rotfile_Merdith_et_al.rot'))
    with open(os.path.join(out_dir, 'rotations.json'), 'w') as fh:
        json.dump(rotations, fh, separators=(',', ':'))
    print(f'rotations.json: {len(rotations)} moving plates')


if __name__ == '__main__':
    main()
