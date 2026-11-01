"""Look up each museum and zoo in places_list.py (by its English Wikipedia article) on Wikidata: its
coordinates, and for zoos the associations it is a member of or accredited by. Writes
src/data/places.json and prints anything that was dropped, for review.

Run: python3 -I tools/places/fetch_places.py
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from places_list import ACCREDITED, HAND, LIMIT, MUSEUMS, TIERS, ZOOS  # noqa: E402

UA = 'PaleoDex/1.0 (educational app; https://github.com/Frosthawk2815/paleodex)'
API = 'https://en.wikipedia.org/w/api.php'

# Accrediting associations, as articles name them.
ACCREDITATION = [
    ('AZA', r'Association of Zoos (and|&) Aquariums|\bAZA\b'),
    ('EAZA', r'European Association of Zoos and Aquaria|\bEAZA\b'),
    ('WAZA', r'World Association of Zoos and Aquariums|\bWAZA\b'),
    ('ZAA', r'Zoo and Aquarium Association|Zoos and Aquaria Association|\bZAA\b'),
    ('BIAZA', r'British and Irish Association of Zoos and Aquariums|\bBIAZA\b'),
    ('CAZA', r"Canada's Accredited Zoos and Aquariums|Canadian Association of Zoos and Aquariums|\bCAZA\b"),
    ('JAZA', r'Japanese Association of Zoos and Aquariums|\bJAZA\b'),
    ('PAAZA', r'Pan-African Association of Zoos and Aquaria|African Association of Zoos and Aquaria|\bPAAZA?B?\b'),
    ('SEAZA', r'South East Asian Zoos (and Aquariums )?Association|\bSEAZA\b'),
    ('CAZG', r'Chinese Association of Zoological Gardens|\bCAZG\b'),
    ('ALPZA', r'\bALPZA\b|Latin American Association of Zoos'),
    ('AZCARM', r'\bAZCARM\b'),
]


def get(params, tries=20):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                return json.load(r)
        except Exception as e:  # rate limits and network blips: wait and retry
            wait = min(600, 120 * (i + 1))
            print(f'  retry in {wait}s ({e})', file=sys.stderr)
            time.sleep(wait)
    raise SystemExit('Wikipedia did not answer')


SPARQL = 'https://query.wikidata.org/sparql'


def sparql(query):
    body = urllib.parse.urlencode({'query': query, 'format': 'json'}).encode()
    for i in range(10):
        try:
            req = urllib.request.Request(SPARQL, data=body, headers={'User-Agent': UA, 'Accept': 'application/sparql-results+json',
                                                                   'Content-Type': 'application/x-www-form-urlencoded'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)['results']['bindings']
        except Exception as e:
            # Wikidata may allow as little as one query a minute.
            print(f'  retry in 70s ({e})', file=sys.stderr)
            time.sleep(70)
    raise SystemExit('Wikidata did not answer')


def lookup(titles):
    """For each article title: its Wikidata coordinates and, as 'text', the names of the
    associations it is a member of (P463) or accredited by (P5514), for the accreditation check."""
    out = {t: None for t in titles}
    # All in one query, as Wikidata may allow only one a minute.
    for i in range(0, len(titles), 250):
        batch = titles[i:i + 250]
        values = ' '.join(json.dumps(t, ensure_ascii=False) + '@en' for t in batch)
        rows = sparql(f"""
SELECT ?title ?coord ?orgLabel ?via WHERE {{
  VALUES ?title {{ {values} }}
  # The English Wikipedia article of that name, or failing that an item with it as its English name.
  {{ ?article schema:about ?item; schema:isPartOf <https://en.wikipedia.org/>; schema:name ?title. BIND("article" AS ?via) }}
  UNION {{ ?item rdfs:label ?title. ?item wdt:P625 []. BIND("label" AS ?via) }}
  OPTIONAL {{ ?item p:P625 ?cs. ?cs ps:P625 ?coord. FILTER NOT EXISTS {{ ?cs wikibase:rank wikibase:DeprecatedRank }} }}
  OPTIONAL {{ ?item wdt:P463|wdt:P5514 ?org. ?org rdfs:label ?orgLabel. FILTER(lang(?orgLabel) = "en") }}
}}""")
        # Rows found through the article come first and win over a match by name.
        rows.sort(key=lambda r: r['via']['value'] != 'article')
        for r in rows:
            t = r['title']['value']
            cur = out.get(t) or {'title': t, 'coords': None, 'text': '', 'via': r['via']['value']}
            if cur['via'] == 'article' and r['via']['value'] == 'label':
                continue
            if 'coord' in r and not cur['coords']:
                lon, lat = re.match(r'Point\(([-\d.eE]+) ([-\d.eE]+)\)', r['coord']['value']).groups()
                cur['coords'] = {'lat': float(lat), 'lon': float(lon)}
            if 'orgLabel' in r:
                cur['text'] += ' | ' + r['orgLabel']['value']
            out[t] = cur
        time.sleep(2)
    return out


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def tier(country):
    return next((t for t, cs in TIERS.items() if country in cs), 'small')


def main():
    pages = lookup([t for _, t in MUSEUMS] + [t for _, t in ZOOS])
    places, dropped, count = [], [], {}
    for kind, items in (('museum', MUSEUMS), ('zoo', ZOOS)):
        for country, title in items:
            p = pages.get(title)
            if title in HAND and not (p and p['coords']):
                name, lat, lon, _qid = HAND[title]
                p = {'title': name, 'coords': {'lat': lat, 'lon': lon}, 'text': ''}
            if not p:
                dropped.append((kind, country, title, 'no article'))
                continue
            if not p['coords']:
                dropped.append((kind, country, title, 'no coordinates'))
                continue
            note = None
            if kind == 'zoo':
                found = [name for name, pat in ACCREDITATION if re.search(pat, p['text'])]
                found += [a.strip() for a in ACCREDITED.get(title, '').split(',') if a.strip() and a.strip() not in found]
                if not found:
                    dropped.append((kind, country, title, 'no accreditation found in article'))
                    continue
                note = ', '.join(found)
            key = (kind, country)
            if count.get(key, 0) >= LIMIT[tier(country)]:
                dropped.append((kind, country, title, 'over the country limit'))
                continue
            count[key] = count.get(key, 0) + 1
            name = re.sub(r'\s*\((zoo|France|Chile|Philippines|Luxembourg|Bulgaria|Belgrade|Oslo|Prague|Bandung|South Korea|United States)\)$', '', p['title'])
            place = {'id': f'{kind}-{slug(name)}', 'kind': kind, 'name': name, 'country': country,
                     'lat': round(p['coords']['lat'], 5), 'lon': round(p['coords']['lon'], 5)}
            if note:
                place['accreditation'] = note
            places.append(place)
    out = ROOT / 'src/data/places.json'
    out.write_text(json.dumps(places, ensure_ascii=False, indent=1) + '\n')
    print(f'{len(places)} places written ({sum(p["kind"] == "museum" for p in places)} museums, '
          f'{sum(p["kind"] == "zoo" for p in places)} zoos)')
    for d in dropped:
        print('DROPPED', *d, sep=' | ')


main()
