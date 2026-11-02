"""Merge answers from the in-app picture review into decisions.json, then approve the "yes" ones.

The review screen sends text like:
    PaleoDex picture review (3 answered)
    yes: aardonyx-celestae, ...
    no: ...
    outdated: ...
Save it to a file and run (from the project root):
    python3 -I tools/images/import_review.py answers.txt
"outdated" counts as no, noted so a more up-to-date picture can be looked for.
"""

import json
import re
import subprocess
import sys

HERE = __file__.rsplit('/', 1)[0]
text = open(sys.argv[1], encoding='utf-8').read()
decisions = json.load(open(f'{HERE}/decisions.json'))
candidates = json.load(open(f'{HERE}/candidates.json'))
# Pictures the owner pinned by hand (overrides.json) keep their decision: a review answer may be
# for the picture they replaced, as the answers name the species but not the picture.
# An answer about the pinned picture itself (it was exported for review) does count.
try:
    overrides = json.load(open(f'{HERE}/overrides.json'))
except FileNotFoundError:
    overrides = {}
norm = lambda f: (f or '').replace(' ', '_')
pinned_file = lambda sid: norm(overrides[sid] if isinstance(overrides[sid], str) else overrides[sid].get('file'))
pinned = {sid for sid in overrides if sid not in candidates or pinned_file(sid) != norm(candidates[sid]['file'])}
counts = {}
for vote in ('yes', 'no', 'outdated'):
    m = re.search(rf'^{vote}:(.*)$', text, re.MULTILINE)
    ids = [i.strip() for i in m.group(1).split(',') if i.strip()] if m else []
    counts[vote] = len(ids)
    for sid in ids:
        if sid not in candidates:
            print('  no candidate for', sid)
            continue
        if sid in pinned:
            print('  kept the hand-picked picture for', sid, f'(ignored "{vote}", probably for the picture it replaced)')
            continue
        # Record which picture the answer was for, so a replacement picture is asked about again.
        entry = {'vote': 'no' if vote == 'outdated' else vote, 'file': candidates[sid]['file']}
        if vote == 'outdated':
            entry['note'] = 'Outdated restoration; find a newer picture.'
        decisions[sid] = entry
json.dump(dict(sorted(decisions.items())), open(f'{HERE}/decisions.json', 'w'), indent=1, ensure_ascii=False)
print('Imported', counts)
subprocess.run([sys.executable, '-I', f'{HERE}/approve.py'], check=True)
