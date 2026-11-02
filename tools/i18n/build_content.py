"""Build the translated page text: tools/i18n/content/<lang>/*.json -> src/i18n/content/<lang>.json.

Each source file maps a page key ("species:tyrannosaurus-rex", "period:cambrian") to the fields it
translates, shaped like the English in tools/i18n/content/en.json (made by export_content.ts).
Lists must keep the same length and order, as each item replaces the English one in place.

Every field is checked against the English: the page and field must exist, and every number in the
English must appear in the translation (thousands separators and decimal marks may differ), so a
translation can't quietly change a date, size or count. Problems are listed; with --strict they
stop the build.

    python3 -I tools/i18n/build_content.py es fr de pt ga zh ja hi ru
"""

import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EN = json.load(open(os.path.join(HERE, 'content', 'en.json'), encoding='utf-8'))
OUT = os.path.join(HERE, '..', '..', 'src', 'i18n', 'content')

# Numbers as bare digit strings ("11,700" and "11.700" -> "11700"); a lone digit is ignored, as
# small numbers are often written as words.
NUM = re.compile(r'\d+(?:[.,   ]\d+)*')


def numbers(text):
    return sorted(n for n in (re.sub(r'\D', '', m) for m in NUM.findall(text)) if len(n) > 1)


def check(lang, key, path, en, tr, problems):
    if isinstance(en, str):
        if not isinstance(tr, str) or not tr.strip():
            problems.append(f'{lang} {key} {path}: expected text')
            return
        missing = [n for n in numbers(en) if n not in numbers(tr)]
        if missing:
            problems.append(f'{lang} {key} {path}: numbers {missing} missing from "{tr[:90]}"')
    elif isinstance(en, list):
        if not isinstance(tr, list) or len(tr) != len(en):
            problems.append(f'{lang} {key} {path}: expected a list of {len(en)}')
            return
        for i, (a, b) in enumerate(zip(en, tr)):
            check(lang, key, f'{path}[{i}]', a, b, problems)
    elif isinstance(en, dict):
        if not isinstance(tr, dict):
            problems.append(f'{lang} {key} {path}: expected fields')
            return
        for f, v in tr.items():
            if f not in en:
                problems.append(f'{lang} {key} {path}.{f}: no such field in English')
            else:
                check(lang, key, f'{path}.{f}', en[f], v, problems)


def main():
    langs = [a for a in sys.argv[1:] if not a.startswith('--')]
    strict = '--strict' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    problems = []
    for lang in langs:
        merged = {}
        for path in sorted(glob.glob(os.path.join(HERE, 'content', lang, '*.json'))):
            for key, fields in json.load(open(path, encoding='utf-8')).items():
                if key not in EN:
                    problems.append(f'{lang} {key}: no such page ({os.path.basename(path)})')
                    continue
                check(lang, key, '', EN[key], fields, problems)
                merged.setdefault(key, {}).update(fields)
        with open(os.path.join(OUT, f'{lang}.json'), 'w', encoding='utf-8') as f:
            json.dump(dict(sorted(merged.items())), f, ensure_ascii=False, separators=(',', ':'))
        print(f'{lang}: {len(merged)} pages translated of {len(EN)}')
    for p in problems:
        print('  !', p)
    if strict and problems:
        sys.exit(1)


main()
