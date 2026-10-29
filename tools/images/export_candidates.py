"""Copy pictures waiting for review into the app for the review screen (src/data/image-candidates.json).

Only the fields the review screen needs are kept. Run after fetching new candidates:
    python3 -I tools/images/export_candidates.py
"""

import json

HERE = __file__.rsplit('/', 1)[0]
KEEP = ('thumb', 'width', 'height', 'artist', 'license', 'licenseUrl', 'source', 'scope', 'kind', 'file')
candidates = json.load(open(f'{HERE}/candidates.json'))
decisions = json.load(open(f'{HERE}/decisions.json'))
# Only pictures still waiting for an answer: new species, and new pictures for rejected ones.
pending = {sid: c for sid, c in candidates.items() if decisions.get(sid, {}).get('file') != c['file']}
out = {sid: {k: c[k] for k in KEEP if c.get(k) is not None} for sid, c in sorted(pending.items())}
json.dump(out, open('src/data/image-candidates.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(out)} pictures waiting for review exported')
