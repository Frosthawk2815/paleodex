"""Copy approved pictures from candidates.json into the app (src/data/images.json).

decisions.json holds the owner's review: {species_id: {"vote": "yes" | "no", "file": "...", "note": "..."}}.
Only "yes" pictures go into the app, so nothing unreviewed is shown.

Usage (from the project root):
    python3 -I tools/images/approve.py
"""

import json

HERE = __file__.rsplit('/', 1)[0]
candidates = json.load(open(f'{HERE}/candidates.json'))
decisions = json.load(open(f'{HERE}/decisions.json'))
# An answer counts only for the picture it was given for (decisions record the file).
answered = lambda sid: sid in decisions and decisions[sid].get('file', candidates[sid]['file']) == candidates[sid]['file']
approved = {sid: candidates[sid] for sid in candidates if answered(sid) and decisions[sid].get('vote') == 'yes'}
json.dump(dict(sorted(approved.items())), open('src/data/images.json', 'w'), indent=1, ensure_ascii=False)
no = sum(answered(sid) and decisions[sid].get('vote') == 'no' for sid in candidates)
print(f'{len(approved)} approved pictures in the app; {no} marked no; {len(candidates) - len(approved) - no} waiting for review')
