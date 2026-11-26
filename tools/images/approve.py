"""Add approved pictures from candidates.json to the app (src/data/images.json).

decisions.json holds the owner's review: {species_id: {"vote": "yes" | "no", "file": "...", "note": "..."}}.
Only "yes" pictures are added, so nothing unreviewed is shown.

The app's picture list is updated in place: approved pictures are added (or replace that animal's
picture), and a picture is removed only if the owner voted "no" on that exact file. Pictures added to
the app some other way (by hand, or before the review existed) are always kept, and the file keeps
its order and layout.

Usage (from the project root):
    python3 -I tools/images/approve.py
"""

import json

HERE = __file__.rsplit('/', 1)[0]
APP = 'src/data/images.json'

candidates = json.load(open(f'{HERE}/candidates.json'))
decisions = json.load(open(f'{HERE}/decisions.json'))
raw = open(APP).read()
images = json.loads(raw)

# An answer counts only for the picture it was given for (decisions record the file).
answered = lambda sid: sid in decisions and decisions[sid].get('file', candidates[sid]['file']) == candidates[sid]['file']

added, replaced, removed = [], [], []
for sid, entry in candidates.items():
    if not answered(sid):
        continue
    vote = decisions[sid].get('vote')
    if vote == 'yes' and images.get(sid) != entry:
        (replaced if sid in images else added).append(sid)
        images[sid] = entry
    elif vote == 'no' and sid in images and images[sid].get('file') == entry['file']:
        # The owner turned down this exact picture: take it out.
        removed.append(sid)
        del images[sid]

open(APP, 'w').write(json.dumps(images, indent=1, ensure_ascii=False) + ('\n' if raw.endswith('\n') else ''))
waiting = sum(not answered(sid) for sid in candidates)
print(f'{len(images)} pictures in the app: {len(added)} added, {len(replaced)} updated, {len(removed)} removed; {waiting} candidates waiting for review')
for label, ids in (('added', added), ('updated', replaced), ('removed', removed)):
    if ids:
        print(f'  {label}: {", ".join(ids)}')
