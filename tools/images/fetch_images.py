"""Find a freely licensed picture for every species, with its artist, license and source.

For each species it looks up the English Wikipedia article for the binomial (falling back to the
genus), takes the article's lead image if it is freely licensed, and reads the file's credit
details from Wikimedia Commons. Only Creative Commons and public-domain images are kept.

Usage (from the project root):
    python3 -I tools/images/fetch_images.py tools/images/species.json src/data/images.json

Existing entries in the output are kept unless --refresh is given, so it can be re-run to fill gaps.
"""

import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request

API = 'https://en.wikipedia.org/w/api.php'
USER_AGENT = 'PaleoDex/1.0 (educational app; https://github.com/Frosthawk2815/paleodex)'
THUMB_WIDTH = 800
BATCH = 50

FREE_LICENSE = re.compile(r'^(cc0|cc[ -]by|public domain|pd\b|no restrictions)', re.I)
SKELETAL = re.compile(r'skeletal', re.I)
RESTORATION = re.compile(
    r'restoration|reconstruction|reconstructed|life ?size model|paleoart|palaeoart|illustration|drawing|painting|'
    r'artist|render|sculpture|\bmodel\b|diorama|statue|\bNT\b|\bdinoart\b',
    re.I,
)
FOSSIL = re.compile(
    r'skeleton|skull|fossil|holotype|paratype|specimen|\bmount|\bcast\b|bones?\b|mandible|jaw|cranium|tooth|teeth|'
    r'vertebra|femur|shell|impression|slab|museum|amber',
    re.I,
)


def api(params):
    params = {**params, 'format': 'json', 'formatversion': '2'}
    url = API + '?' + urllib.parse.urlencode(params)
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # network hiccup or rate limit: back off and retry
            wait = 2 ** attempt
            print(f'  retry in {wait}s ({e})', file=sys.stderr)
            time.sleep(wait)
    raise RuntimeError('API kept failing: ' + url)


def strip_html(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    s = html.unescape(s)
    return re.sub(r'\s+', ' ', s).strip()


def lead_images(titles):
    """Map each requested title to (resolved article title, lead image file name or None)."""
    out = {}
    for i in range(0, len(titles), BATCH):
        chunk = titles[i : i + BATCH]
        data = api({'action': 'query', 'prop': 'pageimages', 'piprop': 'name', 'pilicense': 'free', 'redirects': 1, 'titles': '|'.join(chunk)})
        q = data.get('query', {})
        hop = {}
        for n in q.get('normalized', []):
            hop[n['from']] = n['to']
        redirects = {r['from']: r['to'] for r in q.get('redirects', [])}
        pages = {p['title']: p for p in q.get('pages', [])}
        for t in chunk:
            r = hop.get(t, t)
            r = redirects.get(r, r)
            p = pages.get(r)
            if p and not p.get('missing'):
                out[t] = (r, p.get('pageimage'))
            else:
                out[t] = (None, None)
        time.sleep(0.5)
    return out


def file_info(files):
    """Credit details and an 800 px thumbnail for each file name."""
    out = {}
    for i in range(0, len(files), BATCH):
        chunk = files[i : i + BATCH]
        data = api({
            'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': THUMB_WIDTH,
            'titles': '|'.join('File:' + f for f in chunk),
        })
        q = data.get('query', {})
        norm = {n['to']: n['from'] for n in q.get('normalized', [])}
        for p in q.get('pages', []):
            ii = (p.get('imageinfo') or [None])[0]
            if not ii:
                continue
            name = norm.get(p['title'], p['title'])[len('File:') :]
            m = ii.get('extmetadata', {})
            get = lambda k: strip_html((m.get(k) or {}).get('value', ''))
            out[name.replace(' ', '_')] = {
                'thumb': ii.get('thumburl') or ii.get('url'),
                'width': ii.get('thumbwidth') or ii.get('width'),
                'height': ii.get('thumbheight') or ii.get('height'),
                'source': ii.get('descriptionurl'),
                'artist': get('Artist') or get('Credit') or 'Unknown author',
                'license': get('LicenseShortName'),
                'licenseUrl': (m.get('LicenseUrl') or {}).get('value'),
                'text': ' '.join([name, get('ObjectName'), get('ImageDescription')]),
            }
        time.sleep(0.5)
    return out


def kind_of(text):
    if SKELETAL.search(text):
        return 'skeletal'
    if RESTORATION.search(text):
        return 'restoration'
    if FOSSIL.search(text):
        return 'fossil'
    return None


def main():
    src, dst = sys.argv[1], sys.argv[2]
    refresh = '--refresh' in sys.argv
    species = json.load(open(src))
    try:
        images = {} if refresh else json.load(open(dst))
    except FileNotFoundError:
        images = {}
    todo = [s for s in species if s['id'] not in images]
    print(f'{len(species)} species, {len(todo)} to look up')

    # 1. Lead image of the species article, then of the genus article.
    binomials = sorted({s['name'] for s in todo})
    genera = sorted({s['name'].split(' ')[0] for s in todo})
    by_title = lead_images(binomials)
    by_title.update({g: v for g, v in lead_images(genera).items() if g not in by_title})

    picks = {}
    for s in todo:
        genus = s['name'].split(' ')[0]
        article, image = by_title.get(s['name'], (None, None))
        scope = 'species'
        # A binomial that redirects to a page other than its own (usually the genus) shows the genus.
        if article and article != s['name']:
            scope = 'genus'
        if not image:
            article, image = by_title.get(genus, (None, None))
            scope = 'genus'
        if image:
            picks[s['id']] = (image.replace(' ', '_'), article, scope)

    # 2. Credits for each picked file; keep only freely licensed ones.
    info = file_info(sorted({f for f, _, _ in picks.values()}))
    skipped = []
    for sid, (f, article, scope) in picks.items():
        d = info.get(f)
        if not d or not d['license'] or not FREE_LICENSE.search(d['license']) or not d['thumb']:
            skipped.append((sid, f, d and d['license']))
            continue
        entry = {k: d[k] for k in ('thumb', 'width', 'height', 'artist', 'license', 'licenseUrl', 'source')}
        entry['file'] = f
        entry['article'] = 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(article.replace(' ', '_'))
        entry['scope'] = scope
        k = kind_of(d['text'])
        if k:
            entry['kind'] = k
        images[sid] = entry

    json.dump(dict(sorted(images.items())), open(dst, 'w'), indent=1, ensure_ascii=False)
    missing = [s['id'] for s in species if s['id'] not in images]
    print(f'{len(images)} species have a picture; {len(missing)} without; {len(skipped)} skipped for licence')
    for sid, f, lic in skipped[:40]:
        print(f'  skipped {sid}: {f} ({lic})')


if __name__ == '__main__':
    main()
