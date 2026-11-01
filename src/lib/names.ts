// What a species' scientific name means, from name-meanings.ts.

import type { Species } from '@/data/life';
import { GENUS_MEANINGS, meaningNote, meaningText, SPECIES_MEANINGS } from '@/data/name-meanings';

export type NameMeaning = { genus: string; genusMeaning?: string; epithet?: string; epithetMeaning?: string; notes: string[] };

export function nameMeaning(s: Species): NameMeaning | null {
  const [genus = '', ...rest] = s.name.split(' ');
  const g = GENUS_MEANINGS[genus];
  const e = SPECIES_MEANINGS[s.id];
  if (!g && !e) return null;
  return {
    genus,
    genusMeaning: g ? meaningText(g) : undefined,
    epithet: rest.length ? rest.join(' ') : undefined,
    epithetMeaning: e ? meaningText(e) : undefined,
    notes: [g && meaningNote(g), e && meaningNote(e)].filter((n): n is string => !!n),
  };
}

// "Tyrannosaurus: “tyrant lizard”; rex: “king”"
export function nameMeaningText(m: NameMeaning): string {
  const parts: string[] = [];
  if (m.genusMeaning) parts.push(`${m.genus}: “${m.genusMeaning}”`);
  if (m.epithet && m.epithetMeaning) parts.push(`${m.epithet}: “${m.epithetMeaning}”`);
  return parts.join('; ');
}
