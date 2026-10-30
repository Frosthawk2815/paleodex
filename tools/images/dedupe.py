"""Make sure no picture is shown for more than one species.

A species without its own Wikipedia article falls back to the genus article's picture, so every
species in that genus would get the same photo (all four Allosaurus species once showed the same
mount). For each picture used by several species this keeps it for one species: the one named in
the file name, otherwise the genus's main species (the one listed first in PaleoDex). The others
get a different picture from their articles whose file name names that species, or none.

A species left without a picture is recorded in decisions.json as {"vote": "no", "leaveBlank": true,
"note": "duplicate of ..."} so the shared picture is not offered again.

Usage (from the project root), before approve.py and export_candidates.py:
    python3 -I tools/images/dedupe.py            # fix candidates.json and decisions.json
    python3 -I tools/images/dedupe.py --check    # only list duplicates
"""

import importlib.util
import json
import re
import sys
import urllib.parse
from collections import defaultdict

HERE = __file__.rsplit('/', 1)[0]
spec = importlib.util.spec_from_file_location('find_alternatives', f'{HERE}/find_alternatives.py')
alt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(alt)
fetch = alt.fetch

GOOD = {'fossil', 'restoration', 'skeletal'}

# Shared pictures whose rightful species is known but not named in the file name.
OWNERS = {
    'Tyrannosaurus_Rex_Jane.jpg': 'nanotyrannus-lethaeus',  # Jane is the type of N. lethaeus
    'Torvosaurus_Museum_of_Ancient_Life_2.jpg': 'torvosaurus-tanneri',
    'Texas_Alioramus.jpg': 'alioramus-altai',
}


def norm(s):
    return re.sub(r'[^a-z]', '', s.lower())


def main():
    candidates = json.load(open(f'{HERE}/candidates.json'))
    decisions = json.load(open(f'{HERE}/decisions.json'))
    species_list = json.load(open(f'{HERE}/species.json'))
    species = {s['id']: s for s in species_list}
    order = {s['id']: i for i, s in enumerate(species_list)}

    by_file = defaultdict(list)
    for sid, c in candidates.items():
        by_file[c['file']].append(sid)
    groups = {f: sids for f, sids in by_file.items() if len(sids) > 1}
    print(f'{len(groups)} pictures shared by more than one species')
    if '--check' in sys.argv:
        for f, sids in sorted(groups.items()):
            print(f'  {f}: {", ".join(sorted(sids))}')
        return

    def owner(f, sids):
        if OWNERS.get(f) in sids:
            return OWNERS[f]
        name = norm(f)
        named = [s for s in sids if norm(species.get(s, {}).get('name', '').partition(' ')[2]) in name]
        pool = named or [s for s in sids if candidates[s].get('scope') == 'species'] or sids
        return min(pool, key=lambda s: order.get(s, 10**6))

    losers = {}
    for f, sids in groups.items():
        keep = owner(f, sids)
        for s in sids:
            if s != keep:
                losers[s] = keep

    # Look for a picture that names the species itself (genus + epithet in the file name).
    titles = lambda sid: list(dict.fromkeys([species[sid]['name'], species[sid]['name'].split(' ')[0]])) if sid in species else []
    imgs = alt.article_images(sorted({t for sid in losers for t in titles(sid)})) if losers else {}
    info = fetch.file_info(sorted({f for fs in imgs.values() for f in fs})) if imgs else {}
    used = {c['file'] for sid, c in candidates.items() if sid not in losers}

    replaced, blank = [], []
    for sid, keep in sorted(losers.items()):
        old = candidates[sid]['file']
        g, _, e = species.get(sid, {}).get('name', '').partition(' ')
        options = []
        for t in titles(sid):
            for f in imgs.get(t, []):
                d = info.get(f)
                if f in used or not d or not d['thumb'] or not fetch.FREE_LICENSE.search(d['license'] or ''):
                    continue
                if not (norm(g) in norm(f) and e and norm(e) in norm(f)):
                    continue
                k = fetch.kind_of(d['text'])
                if k in GOOD:
                    options.append((alt.PREFERENCE[k], f, t, d, k))
        if options:
            _, f, t, d, k = min(options, key=lambda o: o[0])
            entry = {x: d[x] for x in ('thumb', 'width', 'height', 'artist', 'license', 'licenseUrl', 'source')}
            entry.update({'file': f, 'article': 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(t.replace(' ', '_')),
                          'scope': 'species', 'kind': k})
            candidates[sid] = entry
            used.add(f)
            replaced.append(sid)
        else:
            del candidates[sid]
            prev = decisions.get(sid, {})
            decisions[sid] = {'vote': 'no', 'file': old, 'leaveBlank': True, 'note': f'duplicate of {keep}',
                              'rejectedFiles': sorted(set(prev.get('rejectedFiles', [])) | {old})}
            blank.append(sid)

    json.dump(dict(sorted(candidates.items())), open(f'{HERE}/candidates.json', 'w'), indent=1, ensure_ascii=False)
    json.dump(dict(sorted(decisions.items())), open(f'{HERE}/decisions.json', 'w'), indent=1, ensure_ascii=False)
    print(f'{len(replaced)} given their own picture (waiting for review): {", ".join(replaced)}')
    print(f'{len(blank)} left without a picture: {", ".join(blank)}')


if __name__ == '__main__':
    main()
