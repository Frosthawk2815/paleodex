"""Corrects the ancient maps where a fossil site falls on the wrong surface.

The PALEOMAP PaleoDEMs (5-million-year snapshots at about 1 degree) miss some shallow inland seas
and smooth away small islands and coastlines. Where a fossil site with a marine setting is drawn on
land, or a site with a land setting is drawn in the sea, this script edits the map:

  - Two inland seas the maps leave out are drawn by hand (see HAND_SEAS): the Boreal (Clearwater)
    Sea that reached northern Alberta in the late Aptian, and the Eromanga Sea that flooded inland
    Australia in the Aptian and Albian.
  - Every other site gets a small local patch: for a marine site, a patch of shallow sea joined to
    the nearest open water by a channel; for a land site, a patch of land joined to the nearest
    shore if one is close, or else a small island.

Patches are drawn where the site was at the map's age and cut from the land of whichever plates lie
there, so they move with the continents like the rest of the map.

Usage, after build.py (which would otherwise overwrite these edits):
  npx -y esbuild@0.24.0 tools/globe-data/check_sites.ts --bundle --platform=node --tsconfig=tsconfig.json \\
      --outfile=/tmp/check_sites.js && node /tmp/check_sites.js > /tmp/bad_sites.json
  node /tmp/check_sites.js --all > /tmp/all_sites.json
  python3 tools/globe-data/corrections.py /tmp/bad_sites.json /tmp/all_sites.json
Run the check again afterwards: it should list nothing.
"""

import base64
import json
import math
import os
import struct
import sys

from shapely.geometry import LineString, Point, Polygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEO = os.path.join(ROOT, 'src', 'data', 'globe', 'paleogeography.json')
ROT = os.path.join(ROOT, 'src', 'data', 'globe', 'rotations.json')
DEG = math.pi / 180

# Inland seas missing from the maps, in present-day coordinates on one plate.
HAND_SEAS = [
    {
        # Late Aptian to early Albian transgression of the Arctic (Boreal) Sea down the Mackenzie
        # valley into north-eastern British Columbia and northern Alberta (Clearwater, Moosebar and
        # Loon River formations), reaching about 54 degrees north.
        'name': 'Boreal (Clearwater) Sea',
        'plate': 101,
        'ages': [110.0, 115.0],
        'ring': [(-137, 69.5), (-128, 69.8), (-120, 69), (-114, 64), (-110, 60.5), (-108.3, 58.5), (-108.5, 56), (-110, 54.2),
                 (-113.5, 53.8), (-117.5, 54.6), (-120.5, 56.5), (-123, 59), (-126, 63), (-131, 66.5), (-135, 68)],
    },
    {
        # The Eromanga Sea over the Eromanga and Carpentaria basins (Doncaster, Toolebuc, Allaru and
        # Mackunda formations), open to the north through the Gulf of Carpentaria, about 120-99 Ma.
        'name': 'Eromanga Sea',
        'plate': 801,
        'ages': [100.0, 105.0, 110.0, 115.0, 120.0],
        'ring': [(138.5, -12), (142, -11), (143.5, -15), (144.5, -19), (147, -22), (148.5, -25.5), (148, -28),
                 (145, -29.5), (141, -29.5), (137.5, -29), (135, -27), (134.5, -24), (136, -21), (137.5, -18),
                 (137.8, -15)],
    },
]
# Sites closer together than the map can show get smaller patches, so one site's patch does not
# cover a neighbour: New Egypt (marine) is about 50 km from Kinkora amber (a forest) in New Jersey.
PATCH_RADIUS = {'new-egypt': 0.25}
HAND_SEA_SITES = {'clearwater', 'allaru', 'allaru-mudstone', 'mackunda', 'mackunda-formation', 'toolebuc', 'toolebuc-formation'}

# --- Plate rotations, as in src/lib/plates.ts -----------------------------------------------------

ROTATIONS = json.load(open(ROT))


def from_pole(lat, lon, angle):
    la, lo, h = lat * DEG, lon * DEG, angle * DEG / 2
    s = math.sin(h)
    return (math.cos(h), s * math.cos(la) * math.cos(lo), s * math.cos(la) * math.sin(lo), s * math.sin(la))


def multiply(a, b):
    return (
        a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
        a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
        a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
    )


def slerp(a, b, t):
    dot = sum(x * y for x, y in zip(a, b))
    if dot < 0:
        dot, b = -dot, tuple(-x for x in b)
    if dot > 0.9999995:
        q = tuple(x + t * (y - x) for x, y in zip(a, b))
        n = math.sqrt(sum(x * x for x in q))
        return tuple(x / n for x in q)
    th = math.acos(dot)
    s = math.sin(th)
    wa, wb = math.sin((1 - t) * th) / s, math.sin(t * th) / s
    return tuple(wa * x + wb * y for x, y in zip(a, b))


def relative(plate, time):
    for seq in ROTATIONS.get(str(plate), []):
        s = seq['s']
        if time < s[0][0] or time > s[-1][0]:
            continue
        for (t0, la0, lo0, a0), (t1, la1, lo1, a1) in zip(s, s[1:]):
            if t0 <= time <= t1:
                f = 0 if t1 == t0 else (time - t0) / (t1 - t0)
                return slerp(from_pole(la0, lo0, a0), from_pole(la1, lo1, a1), f), seq['f']
        if len(s) == 1 and time == s[0][0]:
            return from_pole(s[0][1], s[0][2], s[0][3]), seq['f']
    return None


_rot_cache = {}


def plate_rotation(plate, time, depth=0):
    if plate == 0 or depth > 64:
        return (1.0, 0.0, 0.0, 0.0)
    key = (plate, time)
    if key not in _rot_cache:
        rel = relative(plate, time)
        _rot_cache[key] = multiply(plate_rotation(rel[1], time, depth + 1), rel[0]) if rel else (1.0, 0.0, 0.0, 0.0)
    return _rot_cache[key]


def rotate(q, lon, lat):
    la, lo = lat * DEG, lon * DEG
    x, y, z = math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la)
    w, qx, qy, qz = q
    cx, cy, cz = qy * z - qz * y, qz * x - qx * z, qx * y - qy * x
    x2 = x + 2 * (w * cx + qy * cz - qz * cy)
    y2 = y + 2 * (w * cy + qz * cx - qx * cz)
    z2 = z + 2 * (w * cz + qx * cy - qy * cx)
    return math.atan2(y2, x2) / DEG, math.asin(max(-1, min(1, z2))) / DEG


def inverse(q):
    return (q[0], -q[1], -q[2], -q[3])


# --- Ring encoding, as in build.py and src/lib/geography.ts ----------------------------------------


def decode_ring(s):
    """Points as continuous (unwrapped) longitudes and latitudes."""
    b = base64.b64decode(s)
    x = y = 0
    pts = []
    for k in range(len(b) // 4):
        dx, dy = struct.unpack_from('<hh', b, k * 4)
        x += dx
        y += dy
        pts.append((x / 100, y / 100))
    return pts


def encode_ring(points):
    vals = []
    prev = None
    for lon, lat in points:
        x, y = round(lon * 100), round(lat * 100)
        if prev is None:
            x = (x + 18000) % 36000 - 18000
            vals += [x, y]
        else:
            vals += [(x - prev[0] + 18000) % 36000 - 18000, y - prev[1]]
        prev = (x, y)
    return base64.b64encode(struct.pack(f'<{len(vals)}h', *vals)).decode('ascii')


def unwrap(points, centre_lon):
    """Shifts a ring by whole turns so its first point is within 180 degrees of centre_lon."""
    shift = round((centre_lon - points[0][0]) / 360) * 360
    out = []
    prev = None
    for lon, lat in points:
        lon += shift
        if prev is not None:
            lon += round((prev - lon) / 360) * 360
        out.append((lon, lat))
        prev = lon
    return out


def to_shape(rings, centre_lon):
    rings = [unwrap(r, centre_lon) for r in rings]
    if len(rings[0]) < 3:
        return None
    g = Polygon(rings[0], [r for r in rings[1:] if len(r) >= 3])
    return g if g.is_valid else g.buffer(0)


def entries(plate, geom, min_area=0.02):
    out = []
    geoms = [geom] if geom.geom_type == 'Polygon' else list(getattr(geom, 'geoms', []))
    for g in geoms:
        if g.geom_type != 'Polygon' or g.area < min_area:
            continue
        g = orient(g, sign=-1.0)
        rings = [list(g.exterior.coords)[:-1]] + [list(r.coords)[:-1] for r in g.interiors]
        out.append([plate, *[encode_ring(r) for r in rings if len(r) >= 3]])
    return out


# --- Geometry in the map's own time ----------------------------------------------------------------


def ellipse(lon, lat, r, n=28):
    k = 1 / max(0.2, math.cos(lat * DEG))
    return Polygon([(lon + r * k * math.cos(2 * math.pi * i / n), lat + r * math.sin(2 * math.pi * i / n)) for i in range(n)])


def paleo_union(layer, age, centre_lon):
    """The layer's area at `age` in paleo coordinates, near centre_lon."""
    shapes = []
    for plate, *rings in layer:
        q = plate_rotation(plate, age)
        moved = [[rotate(q, lon, lat) for lon, lat in decode_ring(r)] for r in rings]
        g = to_shape(moved, centre_lon)
        if g is not None and not g.is_empty and g.bounds[2] - g.bounds[0] < 350:
            shapes.append(g)
    return unary_union(shapes)


def nearest_outside(area, lon, lat, want_inside, max_r=8.0):
    """Nearest point (searching outwards) that is inside `area` if want_inside, else outside it."""
    k = 1 / max(0.2, math.cos(lat * DEG))
    r = 0.5
    while r <= max_r:
        for i in range(32):
            a = 2 * math.pi * i / 32
            p = Point(lon + r * k * math.cos(a), lat + r * math.sin(a))
            if area.contains(p) == want_inside:
                return p
        r += 0.5
    return None


def local_patch(site, age, land_union, r=1.0):
    """A patch of radius r degrees around the site, joined to the nearest water (or land)."""
    lon, lat = site
    k = 1 / max(0.2, math.cos(lat * DEG))
    half_width = min(0.5, 0.6 * r) * (1 + k) / 2
    if site_want == 'sea':
        target = nearest_outside(land_union, lon, lat, want_inside=False)
        if target is None:
            return ellipse(lon, lat, 1.5 * r)
        line = LineString([(lon, lat), (target.x, target.y)])
        return unary_union([ellipse(lon, lat, r), line.buffer(half_width), ellipse(target.x, target.y, 0.7 * r)])
    target = nearest_outside(land_union, lon, lat, want_inside=True, max_r=3.0)
    if target is None:
        return ellipse(lon, lat, r)
    line = LineString([(lon, lat), (target.x, target.y)])
    return unary_union([ellipse(lon, lat, r), line.buffer(half_width), ellipse(target.x, target.y, 0.5 * r)])


def cut(layer, patch_paleo, age, centre_lon):
    """Removes a paleo-coordinate patch from every polygon in `layer` (each in its own plate frame)."""
    out = []
    changed = 0
    for entry in layer:
        plate, *rings = entry
        inv = inverse(plate_rotation(plate, age))
        patch_ring = [rotate(inv, x, y) for x, y in patch_paleo.exterior.coords[:-1]]
        decoded = [decode_ring(r) for r in rings]
        poly = to_shape(decoded, decoded[0][0][0] if decoded[0] else 0)
        if poly is None or poly.is_empty:
            out.append(entry)
            continue
        cx = poly.centroid.x
        patch = Polygon(unwrap(patch_ring, cx))
        patch = patch if patch.is_valid else patch.buffer(0)
        if not poly.intersects(patch):
            out.append(entry)
            continue
        changed += 1
        out += entries(plate, poly.difference(patch))
    return out, changed


def in_frame(patch_paleo, plate, age):
    inv = inverse(plate_rotation(plate, age))
    g = Polygon([rotate(inv, x, y) for x, y in patch_paleo.exterior.coords[:-1]])
    g = Polygon(unwrap(list(g.exterior.coords)[:-1], g.exterior.coords[0][0]))
    return g if g.is_valid else g.buffer(0)


def main():
    global site_want
    bad = json.load(open(sys.argv[1]))
    # Every land-setting site (from check_sites --all), kept as land when sea patches are cut.
    land_sites = [x for x in json.load(open(sys.argv[2])) if x['want'] == 'land'] if len(sys.argv) > 2 else []
    data = json.load(open(GEO))
    slices = {s['age']: s for s in data['slices']}
    log = []

    # Hand-drawn seas.
    for sea in HAND_SEAS:
        for age in sea['ages']:
            s = slices[age]
            q = plate_rotation(sea['plate'], age)
            ring = [rotate(q, lon, lat) for lon, lat in sea['ring']]
            patch = Polygon(unwrap(ring, ring[0][0]))
            s['land'], n = cut(s['land'], patch, age, patch.centroid.x)
            s['shelf'] += entries(sea['plate'], in_frame(patch, sea['plate'], age))
            log.append(f"{sea['name']} at {age:g} Ma: cut {n} land polygons")

    # Local patches for every other site.
    for site in bad:
        if site['id'] in HAND_SEA_SITES:
            continue
        site_want = site['want']
        plate = site.get('plate') or 0
        ages = sorted({min(slices, key=lambda a: abs(a - t)) for t in (site['ma'], site['from'], site['to'])})
        for age in ages:
            s = slices[age]
            pos = rotate(plate_rotation(plate, age), site['lon'], site['lat'])
            land_union = paleo_union(s['land'], age, pos[0])
            on_land = land_union.contains(Point(pos))
            if (site_want == 'sea') != on_land:
                continue
            patch = local_patch(pos, age, land_union, PATCH_RADIUS.get(site['id'], 1.0))
            if site_want == 'sea':
                keep = [
                    ellipse(*rotate(plate_rotation(o.get('plate') or 0, age), o['lon'], o['lat']), 0.15)
                    for o in land_sites
                    if o['from'] >= age - 2.5 and o['to'] <= age + 2.5 and o['id'] != site['id']
                ]
                if keep:
                    patch = patch.difference(unary_union(keep))
                    patch = max(getattr(patch, 'geoms', [patch]), key=lambda g: g.area)
            if site_want == 'sea':
                s['land'], n = cut(s['land'], patch, age, pos[0])
                s['shelf'] += entries(plate, in_frame(patch, plate, age))
            else:
                n = 0
                s['land'] += entries(plate, in_frame(patch, plate, age))
            log.append(f"{site['title']} ({site_want}) at {age:g} Ma: patch, cut {n} land polygons")

    with open(GEO, 'w') as fh:
        json.dump(data, fh, separators=(',', ':'))
    print('\n'.join(log))


site_want = 'sea'

if __name__ == '__main__':
    main()
