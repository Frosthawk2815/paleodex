"""Print the English of the next species pages still untranslated in a language, for translating.

    python3 -I tools/i18n/next_batch.py es 20

Order: the best-known species (the quiz's FAMOUS list) first, then the rest as they appear in the
data, so related species come together and are translated with the same terms.
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
lang, count = sys.argv[1], int(sys.argv[2])
en = json.load(open(os.path.join(HERE, 'content', 'en.json'), encoding='utf-8'))
src = open(os.path.join(ROOT, 'src', 'lib', 'quiz.ts'), encoding='utf-8').read()
start = src.index('const FAMOUS')
famous = ['species:' + s for s in re.findall(r"'([a-z-]+)'", src[start:src.index(']);', start)])]
order = famous + [k for k in en if k.startswith('species:') and k not in famous]
done = set()
for p in glob.glob(os.path.join(HERE, 'content', lang, '*.json')):
    done |= set(json.load(open(p, encoding='utf-8')))
todo = [k for k in order if k not in done]
print(f'# {len(todo)} species left in {lang}', file=sys.stderr)
print('{\n' + ',\n'.join(json.dumps(k) + ': ' + json.dumps(en[k], ensure_ascii=False) for k in todo[:count]) + '\n}')
