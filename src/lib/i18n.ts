// Languages for the app's menus, buttons and screens. English is the source: every piece of text is
// written in English in the code and looked up here, so anything not yet translated simply shows
// in English. Species, formation and event write-ups are not translated yet.
//
// Translations live in src/i18n/<code>.json, keyed by the English text. Placeholders such as {n}
// or {name} are filled in when the text is shown.

import { useCallback } from 'react';

import de from '@/i18n/de.json';
import es from '@/i18n/es.json';
import fr from '@/i18n/fr.json';
import hi from '@/i18n/hi.json';
import ja from '@/i18n/ja.json';
import pt from '@/i18n/pt.json';
import ru from '@/i18n/ru.json';
import zh from '@/i18n/zh.json';
import { useProfile } from '@/lib/profile';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'hi' | 'ru';
export type LanguageSetting = 'system' | Language;

// Each language's name in its own language, then in English.
export const LANGUAGES: { code: Language; name: string; english: string }[] = [
  { code: 'en', name: 'English', english: 'English' },
  { code: 'es', name: 'Español', english: 'Spanish' },
  { code: 'fr', name: 'Français', english: 'French' },
  { code: 'de', name: 'Deutsch', english: 'German' },
  { code: 'pt', name: 'Português', english: 'Portuguese' },
  { code: 'zh', name: '中文（简体）', english: 'Chinese (Simplified)' },
  { code: 'ja', name: '日本語', english: 'Japanese' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi' },
  { code: 'ru', name: 'Русский', english: 'Russian' },
];

const DICTS: Record<Exclude<Language, 'en'>, Record<string, string>> = { es, fr, de, pt, zh, ja, hi, ru };

// The device's language if PaleoDex has it, otherwise English.
export function deviceLanguage(): Language {
  let code = 'en';
  try {
    code = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]!.toLowerCase();
  } catch {
    // Older engines without Intl: stay in English.
  }
  return LANGUAGES.some((l) => l.code === code) ? (code as Language) : 'en';
}

export type Vars = Record<string, string | number>;

// Text in a language, with placeholders filled in. Falls back to the English.
export function translate(lang: Language, text: string, vars?: Vars): string {
  const s = (lang === 'en' ? undefined : DICTS[lang][text]) ?? text;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
}

// The language the user chose, or their device's.
export function useLanguage(): Language {
  const setting = useProfile().profile.settings.language ?? 'system';
  return setting === 'system' ? deviceLanguage() : setting;
}

// t('Play solo'), t('{n} species', { n: 3 }): text in the user's language.
export type T = (text: string, vars?: Vars) => string;
export function useT(): T {
  const lang = useLanguage();
  return useCallback((text: string, vars?: Vars) => translate(lang, text, vars), [lang]);
}
