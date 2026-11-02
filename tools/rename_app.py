"""Rename the app everywhere a person can see the name.

Usage (from the project root):
    python3 -I tools/rename_app.py "New Name"            # show what would change
    python3 -I tools/rename_app.py "New Name" --apply    # make the changes

What it changes: the app's display name in app.json (home screen, store, app switcher), and every
"PaleoDex" in the app's text, code comments, README, docs and the tools' web user agent.

What it deliberately leaves alone, because changing them would break things:
  - Saved-data keys such as 'paleodex.profile.v1' (lower case): renaming them would wipe every
    user's profile, titles and photos.
  - The Expo slug and project id in app.json: they link the app to its EAS project and builds.
  - The Android package / iOS bundle id (com.frosthawk.paleodex): change these only on purpose with
    --package, and only before the first Play Store upload (after that it is permanent).
  - The GitHub address in the user agent, unless the repository itself is renamed.
"""

import json
import os
import re
import sys

OLD = 'PaleoDex'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'node_modules', '.git', '.expo', 'android', 'ios', 'dist', '__pycache__'}
TEXT_EXT = {'.ts', '.tsx', '.js', '.py', '.sh', '.md', '.json', '.txt'}
# Generated or downloaded data that never shows the name.
SKIP_FILES = {'package-lock.json', 'tools/images/candidates.json', 'tools/images/decisions.json', 'tools/images/.api-cache.json', 'tools/images/species.json', 'tools/rename_app.py'}


def files():
    for base, dirs, names in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for n in names:
            path = os.path.join(base, n)
            rel = os.path.relpath(path, ROOT)
            if os.path.splitext(n)[1] in TEXT_EXT and rel not in SKIP_FILES:
                yield path, rel


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit(__doc__)
    new = args[0].strip()
    apply = '--apply' in sys.argv
    package = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--package=')), None)
    if not new or new == OLD:
        sys.exit('Give a new name different from the current one.')

    total = 0
    for path, rel in files():
        text = open(path, encoding='utf-8').read()
        n = text.count(OLD)
        if rel == 'app.json':
            continue  # handled below, field by field
        if n:
            total += n
            print(f'{n:4}  {rel}')
            if apply:
                # In a web user agent ("PaleoDex/1.0 (...)") the name can't contain spaces.
                text = text.replace(OLD + '/', re.sub(r'\s+', '', new) + '/')
                open(path, 'w', encoding='utf-8').write(text.replace(OLD, new))

    app_path = os.path.join(ROOT, 'app.json')
    app = json.load(open(app_path, encoding='utf-8'))
    expo = app['expo']
    print(f'app.json name: {expo["name"]!r} -> {new!r}')
    expo['name'] = new
    if package:
        if not re.fullmatch(r'[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+', package):
            sys.exit('--package must look like com.yourname.appname (lower case, dots).')
        print(f'android package / iOS bundle id: {expo["android"]["package"]!r} -> {package!r}')
        expo['android']['package'] = package
        expo['ios']['bundleIdentifier'] = package
    # The permission messages people see (photos, location) name the app too. Only the capitalised
    # name is replaced, so the lower-case slug and scheme stay as they are.
    text = json.dumps(app, indent=2, ensure_ascii=False) + '\n'
    print(f'app.json permission messages: {text.count(OLD)} mentions')
    if apply:
        open(app_path, 'w', encoding='utf-8').write(text.replace(OLD, new))
    print(f'\n{total} mentions in other files. ' + ('Changed.' if apply else 'Nothing changed yet: run again with --apply.'))


main()
