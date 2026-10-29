"""Copy approved pictures from candidates.json into the app (src/data/images.json).

decisions.json holds the owner's review: {species_id: {"vote": "yes" | "no", "note": "..."}}.
Only "yes" pictures go into the app, so nothing unreviewed is shown.

Usage (from the project root):
    python3 -I tools/images/approve.py
"""

import json

HERE = __file__.rsplit('/', 1)[0]
candidates = json.load(open(f'{HERE}/candidates.json'))
decisions = json.load(open(f'{HERE}/decisions.json'))
approved = {sid: candidates[sid] for sid, d in decisions.items() if d.get('vote') == 'yes' and sid in candidates}
json.dump(dict(sorted(approved.items())), open('src/data/images.json', 'w'), indent=1, ensure_ascii=False)
no = sum(d.get('vote') == 'no' for d in decisions.values())
print(f'{len(approved)} approved pictures in the app; {no} marked no; {len(candidates) - len(approved) - no} not reviewed yet')
