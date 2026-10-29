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
counts = {}
for vote in ('yes', 'no', 'outdated'):
    m = re.search(rf'^{vote}:(.*)$', text, re.MULTILINE)
    ids = [i.strip() for i in m.group(1).split(',') if i.strip()] if m else []
    counts[vote] = len(ids)
    for sid in ids:
        if vote == 'outdated':
            decisions[sid] = {'vote': 'no', 'note': 'Outdated restoration; find a newer picture.'}
        else:
            decisions[sid] = {'vote': vote}
json.dump(dict(sorted(decisions.items())), open(f'{HERE}/decisions.json', 'w'), indent=1, ensure_ascii=False)
print('Imported', counts)
subprocess.run([sys.executable, '-I', f'{HERE}/approve.py'], check=True)
