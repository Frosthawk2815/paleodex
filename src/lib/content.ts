// Translated page text (species, groups, formations, periods, extinctions). The English in the data
// files is the source; each language's translations, built by tools/i18n/build_content.py, replace
// it field by field where they exist, so a page that isn't translated yet stays in English.

import { useMemo } from 'react';

import de from '@/i18n/content/de.json';
import es from '@/i18n/content/es.json';
import fr from '@/i18n/content/fr.json';
import ga from '@/i18n/content/ga.json';
import hi from '@/i18n/content/hi.json';
import ja from '@/i18n/content/ja.json';
import pt from '@/i18n/content/pt.json';
import ru from '@/i18n/content/ru.json';
import zh from '@/i18n/content/zh.json';
import { type Language, useLanguage } from '@/lib/i18n';

type Tree = Record<string, unknown>;
const CONTENT = { es, fr, de, pt, ga, zh, ja, hi, ru } as unknown as Record<Exclude<Language, 'en'>, Record<string, Tree>>;

// Lays a translation over the English: text is replaced, lists item by item, and anything the
// translation doesn't cover (ids, numbers, links) is kept.
function overlay<T>(en: T, tr: unknown): T {
  if (tr === undefined || tr === null) return en;
  if (typeof en === 'string') return (typeof tr === 'string' && tr ? tr : en) as T;
  if (Array.isArray(en)) return (Array.isArray(tr) ? en.map((x, i) => overlay(x, tr[i])) : en) as T;
  if (en && typeof en === 'object' && typeof tr === 'object') {
    const out: Tree = { ...(en as Tree) };
    for (const [k, v] of Object.entries(tr as Tree)) if (k in out) out[k] = overlay(out[k], v);
    return out as T;
  }
  return en;
}

// A page's data with its text in the given language.
export function localize<T extends object>(lang: Language, key: string, data: T): T {
  if (lang === 'en') return data;
  const tr = CONTENT[lang]?.[key];
  if (!tr) return data;
  return overlay(data, tr);
}

// Whether a page has been translated into the language (for a "still in English" note).
export const isTranslated = (lang: Language, key: string) => lang === 'en' || !!CONTENT[lang]?.[key];

// localize() for the user's language, remembered between renders.
export function useLocalized<T extends object>(key: string, data: T): T {
  const lang = useLanguage();
  return useMemo(() => localize(lang, key, data), [lang, key, data]);
}
