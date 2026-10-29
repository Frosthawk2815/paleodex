"""Copy picture candidates into the app for the in-app review screen (src/data/image-candidates.json).

Only the fields the review screen needs are kept. Run after fetching new candidates:
    python3 -I tools/images/export_candidates.py
"""

import json

HERE = __file__.rsplit('/', 1)[0]
KEEP = ('thumb', 'width', 'height', 'artist', 'license', 'licenseUrl', 'source', 'scope', 'kind')
candidates = json.load(open(f'{HERE}/candidates.json'))
out = {sid: {k: c[k] for k in KEEP if c.get(k) is not None} for sid, c in sorted(candidates.items())}
json.dump(out, open('src/data/image-candidates.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(out)} candidates exported')
