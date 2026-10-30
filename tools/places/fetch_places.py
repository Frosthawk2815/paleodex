"""Look up each museum and zoo in places_list.py on English Wikipedia: its coordinates, and for zoos
the accrediting association its article names. Writes src/data/places.json and prints anything
that was dropped, for review.

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
from places_list import LIMIT, MUSEUMS, TIERS, ZOOS  # noqa: E402

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


def get(params, tries=6):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                return json.load(r)
        except Exception as e:  # rate limits and network blips: wait and retry
            wait = 60 * (i + 1)
            print(f'  retry in {wait}s ({e})', file=sys.stderr)
            time.sleep(wait)
    raise SystemExit('Wikipedia did not answer')


CACHE = Path(__file__).parent / 'cache.json'


def lookup(titles):
    """Coordinates and article text for each title, cached in cache.json so a run that is cut off
    by rate limits can pick up where it stopped."""
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    todo = [t for t in titles if t not in cache]
    for i in range(0, len(todo), 8):
        batch = todo[i:i + 8]
        d = get({'action': 'query', 'titles': '|'.join(batch), 'prop': 'coordinates|revisions', 'rvprop': 'content',
                 'rvslots': 'main', 'redirects': 1, 'colimit': 'max', 'coprimary': 'primary'})
        q = d['query']
        back = {t: t for t in batch}
        for m in q.get('normalized', []) + q.get('redirects', []):
            for k, v in list(back.items()):
                if v == m['from']:
                    back[k] = m['to']
        pages = {p['title']: p for p in q['pages']}
        for t in batch:
            p = pages.get(back[t])
            if not p or p.get('missing'):
                cache[t] = None
                continue
            text = p.get('revisions', [{}])[0].get('slots', {}).get('main', {}).get('content', '')
            co = (p.get('coordinates') or [None])[0]
            cache[t] = {'title': p['title'], 'coords': co, 'text': text}
        CACHE.write_text(json.dumps(cache))
        print(f'  {min(i + 8, len(todo))}/{len(todo)} looked up', file=sys.stderr, flush=True)
        time.sleep(12)
    return {t: cache.get(t) for t in titles}


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
            if not p:
                dropped.append((kind, country, title, 'no article'))
                continue
            if not p['coords']:
                dropped.append((kind, country, title, 'no coordinates'))
                continue
            note = None
            if kind == 'zoo':
                found = [name for name, pat in ACCREDITATION if re.search(pat, p['text'])]
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
