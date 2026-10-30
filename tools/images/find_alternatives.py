"""Find a different picture for species whose current candidate the owner rejected.

For each rejected species it lists the pictures in its Wikipedia article (and the genus article),
keeps freely licensed ones named after the genus (not maps, diagrams, logos or other animals),
skips files already rejected,
and offers the best remaining one (a life restoration, then a skeletal, then a fossil photo).
The new picture replaces the candidate, so the review screen asks about it.

Usage (from the project root):
    python3 -I tools/images/find_alternatives.py
"""

import importlib.util
import json
import re
import urllib.parse

HERE = __file__.rsplit('/', 1)[0]
spec = importlib.util.spec_from_file_location('fetch_images', f'{HERE}/fetch_images.py')
fetch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fetch)

PICTURE = re.compile(r'\.(jpe?g|png|tiff?|webp)$', re.I)
NOT_A_PICTURE = re.compile(
    r'map|distribution|range|locality|logo|icon|symbol|flag|cladogram|phylogen|timeline|stratigraph|chart|diagram|'
    r'graph|silhouette|scale|size[ _]comparison|commons-|wiki|stub|question|edit|disambig|signature|stamp|coin',
    re.I,
)
PREFERENCE = {'restoration': 0, 'skeletal': 1, 'fossil': 2, None: 3}


def article_images(titles):
    """Picture files used on each article (following redirects)."""
    out = {}
    for i in range(0, len(titles), fetch.BATCH):
        chunk = titles[i : i + fetch.BATCH]
        data = fetch.api({'action': 'query', 'prop': 'images', 'imlimit': 'max', 'redirects': 1, 'titles': '|'.join(chunk)})
        q = data.get('query', {})
        redirects = {r['from']: r['to'] for r in q.get('redirects', [])}
        norm = {n['from']: n['to'] for n in q.get('normalized', [])}
        pages = {p['title']: p for p in q.get('pages', [])}
        for t in chunk:
            r = redirects.get(norm.get(t, t), norm.get(t, t))
            files = [im['title'][len('File:') :].replace(' ', '_') for im in pages.get(r, {}).get('images', [])]
            out[t] = [f for f in files if PICTURE.search(f) and not NOT_A_PICTURE.search(f)]
    return out


def main():
    candidates = json.load(open(f'{HERE}/candidates.json'))
    decisions = json.load(open(f'{HERE}/decisions.json'))
    species = {s['id']: s for s in json.load(open(f'{HERE}/species.json'))}
    # Rejected and not yet replaced, unless the owner asked to leave it without a picture (a replacement found to be unsuitable is removed, so a species
    # with no candidate but a 'no' answer is looked at again).
    rejected = [sid for sid, d in decisions.items() if d.get('vote') == 'no' and not d.get('leaveBlank') and (sid not in candidates or d.get('file') == candidates[sid]['file'])]
    print(f'{len(rejected)} rejected pictures to replace')
    if not rejected:
        return

    def titles_for(sid):
        t = [urllib.parse.unquote(candidates[sid]['article'].rsplit('/wiki/', 1)[-1]).replace('_', ' ')] if sid in candidates else []
        name = species.get(sid, {}).get('name')
        if name:
            t += [name, name.split(' ')[0]]
        return list(dict.fromkeys(t))

    images = article_images(sorted({t for sid in rejected for t in titles_for(sid)}))
    info = fetch.file_info(sorted({f for fs in images.values() for f in fs}))

    genus_of = lambda sid: species.get(sid, {}).get('name', '').split(' ')[0] or '?'
    epithets = {}
    for sp in species.values():
        g, _, e = sp['name'].partition(' ')
        if e:
            epithets.setdefault(g.lower(), set()).add(e.lower())

    def named_after(sid, f):
        # The genus must start a word (so Eosimias is not taken for Simias), and the file must not
        # name a different species of the same genus that has its own entry (Homo sapiens is not
        # a Neanderthal).
        name = f.lower().replace(' ', '_')
        g = genus_of(sid).lower()
        if not re.search(r'(^|[^a-z])' + re.escape(g), name):
            return False
        own = species.get(sid, {}).get('name', '').partition(' ')[2].lower()
        return not any(re.search(re.escape(g) + r'[_,]+' + re.escape(e), name) for e in epithets.get(g, set()) - {own})
    found, none = 0, []
    for sid in rejected:
        tried = set(decisions[sid].get('rejectedFiles', [])) | {decisions[sid]['file']}
        options = []
        for t in titles_for(sid):
            for f in images.get(t, []):
                d = info.get(f)
                if f in tried or not d or not d['thumb'] or not fetch.FREE_LICENSE.search(d['license'] or ''):
                    continue
                # Articles also show other animals (galleries, size charts, relatives), so only
                # accept files named after this genus.
                if not named_after(sid, f):
                    continue
                options.append((PREFERENCE[fetch.kind_of(d['text'])], f, t, d))
        if not options:
            none.append(sid)
            continue
        _, f, title, d = min(options, key=lambda o: o[0])
        entry = {k: d[k] for k in ('thumb', 'width', 'height', 'artist', 'license', 'licenseUrl', 'source')}
        genus = species.get(sid, {}).get('name', '').split(' ')[0]
        entry.update({'file': f, 'article': 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')), 'scope': 'genus' if title == genus else 'species'})
        k = fetch.kind_of(d['text'])
        if k:
            entry['kind'] = k
        decisions[sid]['rejectedFiles'] = sorted(tried)
        candidates[sid] = entry
        found += 1

    json.dump(dict(sorted(candidates.items())), open(f'{HERE}/candidates.json', 'w'), indent=1, ensure_ascii=False)
    json.dump(dict(sorted(decisions.items())), open(f'{HERE}/decisions.json', 'w'), indent=1, ensure_ascii=False)
    print(f'{found} new pictures offered; no other picture found for {len(none)}: {", ".join(none)}')


if __name__ == '__main__':
    main()
