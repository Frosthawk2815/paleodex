"""Build the app's translations: tools/i18n/<lang>.txt -> src/i18n/<lang>.json.

Each .txt has one line per English text, "index|translation", where index is the text's position in
keys.json (the English, as written in t('...') calls and the data the app translates). Every line is
checked: placeholders such as {n} must match, and arrows and symbols must be kept.

    python3 -I tools/i18n/build.py es fr de pt zh ja hi ru

When the app gains new text, add it to the END of keys.json (so existing indexes stay put), add a
line for it to each .txt, and rebuild. Anything missing simply shows in English.
"""
import json, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
keys = json.load(open(os.path.join(HERE, 'keys.json'), encoding='utf-8'))
ok = True
for lang in sys.argv[1:]:
    out, seen = {}, set()
    for n, line in enumerate(open(os.path.join(HERE, lang + '.txt'), encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        idx, _, text = line.partition('|')
        i = int(idx)
        if i in seen: print(lang, 'duplicate', i); ok = False
        seen.add(i)
        k = keys[i]
        ph_k, ph_t = sorted(re.findall(r'\{\w+\}', k)), sorted(re.findall(r'\{\w+\}', text))
        if ph_k != ph_t:
            print(f'{lang} {i}: placeholders {ph_k} vs {ph_t}: {text}'); ok = False
        for sym in ['›', '‹', '▲', '▼', '✓', '★', '📍', '📋', '🔒', '⚠️', '👀', '⏳', '🔀', '＋', '☆']:
            if k.count(sym) != text.count(sym):
                print(f'{lang} {i}: symbol {sym} count differs: {text}'); ok = False
        out[k] = text
    missing = [i for i in range(len(keys)) if i not in seen]
    if missing: print(lang, 'missing', missing); ok = False
    json.dump(dict(sorted(out.items())), open(os.path.join(HERE, '..', '..', 'src', 'i18n', f'{lang}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(lang, len(out), 'entries')
sys.exit(0 if ok else 1)
