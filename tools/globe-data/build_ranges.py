"""Builds src/data/globe/ranges.json: range outlines for modern species and where the last one
was seen alive.

Countries come from Natural Earth (public domain), 1:50m admin-0 countries:
https://github.com/nvkelso/natural-earth-vector (geojson/ne_50m_admin_0_countries.geojson)

Usage (needs shapely):
  python tools/globe-data/build_ranges.py <ne_50m_admin_0_countries.geojson> tools/globe-data/ranges-spec.json src/data/globe/ranges.json
"""

import base64
import json
import math
import struct
import sys
from datetime import date

from shapely.geometry import box, shape
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

SIMPLIFY_DEG = 0.15
MIN_AREA = 0.02  # square degrees; keeps small islands such as Mauritius


def encode_ring(points):
    """Int16 little-endian, hundredths of a degree, first point absolute then deltas; base64."""
    vals, prev = [], None
    for lon, lat in points:
        x, y = round(lon * 100), round(lat * 100)
        if prev is None:
            vals += [x, y]
        else:
            vals += [(x - prev[0] + 18000) % 36000 - 18000, y - prev[1]]
        prev = (x, y)
    return base64.b64encode(struct.pack(f'<{len(vals)}h', *vals)).decode('ascii')


def densify(coords, step=1.0):
    out = [coords[0]]
    for (x0, y0), (x1, y1) in zip(coords, coords[1:]):
        n = max(1, int(math.ceil(max(abs(x1 - x0), abs(y1 - y0)) / step)))
        out += [(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) for i in range(1, n + 1)]
    return out


def region_geometry(r, countries):
    if 'box' in r:
        return box(*r['box'])
    if r.get('world'):
        geoms = [g for name, (cont, g) in countries.items() if cont != 'Antarctica']
    elif 'country' in r:
        geoms = [countries[r['country']][1].intersection(box(*r['bbox']))]
    else:
        names = set(r.get('countries', []))
        conts = set(r.get('continents', []))
        geoms = [g for name, (cont, g) in countries.items() if name in names or cont in conts]
    excluded = set(r.get('exclude', []))
    if excluded:
        geoms = [g for name, (cont, g) in countries.items() if g in geoms and name not in excluded]
    g = unary_union(geoms)
    if 'latMin' in r or 'latMax' in r:
        g = g.intersection(box(-180, r.get('latMin', -90), 180, r.get('latMax', 90)))
    return g


def polygons_of(g):
    if g.is_empty:
        return []
    return [p for p in (g.geoms if hasattr(g, 'geoms') else [g]) if p.geom_type == 'Polygon']


def main():
    countries_path, spec_path, out_path = sys.argv[1:4]
    countries, labels = {}, {}
    for f in json.load(open(countries_path))['features']:
        p = f['properties']
        countries[p['NAME']] = (p['CONTINENT'], shape(f['geometry']).buffer(0))
        labels[p['NAME']] = (p['LABEL_X'], p['LABEL_Y'])

    this_year = date.today().year + date.today().timetuple().tm_yday / 365
    spec = json.load(open(spec_path))
    out = {}
    total = 0
    for sid, s in spec.items():
        if sid.startswith('_'):
            continue
        phases = []
        for ph in s['phases']:
            g = unary_union([region_geometry(r, countries) for r in ph['regions']])
            polys = []
            for poly in polygons_of(g):
                if poly.area < MIN_AREA:
                    continue
                # Small islands get a finer tolerance so they keep their shape.
                poly = poly.simplify(min(SIMPLIFY_DEG, math.sqrt(poly.area) * 0.05), preserve_topology=True)
                if poly.is_empty or poly.geom_type != 'Polygon':
                    continue
                poly = orient(poly, sign=-1.0)  # exterior clockwise for d3-geo
                rings = [encode_ring(densify(list(r.coords))[:-1]) for r in [poly.exterior, *poly.interiors]]
                total += sum(len(r.coords) for r in [poly.exterior, *poly.interiors])
                polys.append(rings)
            phases.append({'fromMa': ph['from'] / 1e6, 'toMa': ph['to'] / 1e6, 'label': ph['label'], 'polygons': polys})
        entry = {'phases': phases}
        if 'lastSeen' in s:
            ls = s['lastSeen']
            years_ago = ls['yearsAgo'] if 'yearsAgo' in ls else this_year - ls['year']
            lon, lat = labels[ls['country']]
            entry['lastSeen'] = {
                'country': ls['country'],
                'lon': lon,
                'lat': lat,
                'ma': years_ago / 1e6,
                'year': ls.get('year'),
                'text': ls['text'],
            }
        out[sid] = entry
    json.dump(out, open(out_path, 'w'), separators=(',', ':'))
    print(f'{len(out)} species, {total} points')


if __name__ == '__main__':
    main()
