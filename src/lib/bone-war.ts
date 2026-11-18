// Bone War cards: which ones a player owns, and their details.
//
// A card is earned by answering a solo quiz question about a species (or a mass extinction)
// correctly and having it in Favourites. Its stars are the hardest level answered correctly; a
// harder correct answer later upgrades it. There is one card per species.

import { SPECIES, type Species } from '@/data/life';
import { LATE_PLEISTOCENE, type Stats, extinctionOf, statsOf } from '@/lib/cards';
import { EXTINCTIONS, type Extinction } from '@/lib/extinctions';
import type { PageRef, Profile } from '@/lib/profile';

export const DECK_SIZE = 30;
// The smallest deck that can play.
export const MIN_DECK = 10;
export const HAND_SIZE = 5;

export type Card =
  | { key: string; kind: 'species'; id: string; stars: number; species: Species; stats: Stats; extinction: string | null }
  // speciesId: the animal pictured, for the Humans card.
  | { key: string; kind: 'extinction'; id: string; stars: number; event: Extinction; speciesId?: string };

// The Humans card: Homo sapiens plays as an extinction card, wiping out the Ice Age megafauna and
// the animals lost to people since, such as the dodo.
export const HUMANS_EVENT: Extinction = {
  id: LATE_PLEISTOCENE,
  name: 'Humans: extinctions caused by people',
  short: '',
  ma: 0.012,
  cause: 'ice',
  causeText: 'people spreading around the world, and a changing climate',
  bigFive: false,
};

export const cardKeyOf = (page: PageRef) => `${page.kind}:${page.id}`;

// A player's theme colours, shown on their side of the board (and sent to the other phone).
// font and headingFont: the paper theme's fonts, when the player uses it (names from fonts.ts).
export type Look = { background: string; card: string; text: string; muted: string; accent: string; border: string; track: string; font?: string; headingFont?: string };
export const lookOf = (p: Omit<Look, 'font' | 'headingFont'> & { fonts?: { body: string; heading: string } }): Look => ({
  background: p.background,
  card: p.card,
  text: p.text,
  muted: p.muted,
  accent: p.accent,
  border: p.border,
  track: p.track,
  ...(p.fonts ? { font: p.fonts.body, headingFont: p.fonts.heading } : {}),
});
// Colours for an opponent whose theme hasn't arrived yet: a deep red theme.
export const AI_LOOK: Look = { background: '#1E0E0E', card: '#2E1616', text: '#F4E8E0', muted: '#C0A898', accent: '#E0A030', border: '#5A2C2C', track: '#3A2020' };

// The card a quiz question is about, if any.
export function cardKeyForQuestion(q: { speciesId?: string; page?: PageRef }): string | null {
  if (q.speciesId) return `species:${q.speciesId}`;
  if (q.page?.kind === 'extinction') return `extinction:${q.page.id}`;
  return null;
}

export function cardFor(key: string, stars: number): Card | null {
  const [kind, id] = key.split(':') as [string, string];
  if (kind === 'species' && id === 'homo-sapiens') return { key, kind: 'extinction', id: LATE_PLEISTOCENE, stars, event: HUMANS_EVENT, speciesId: id };
  if (kind === 'species') {
    const species = SPECIES.find((s) => s.id === id);
    if (!species) return null;
    return { key, kind, id, stars, species, stats: statsOf(id), extinction: extinctionOf(id) };
  }
  if (kind === 'extinction') {
    const event = EXTINCTIONS.find((e) => e.id === id);
    return event ? { key, kind, id, stars, event } : null;
  }
  return null;
}

// The keys of every card the player owns: earned in a quiz and either in their favourites or kept in
// their deck or a saved loadout (so unfavouriting an animal there doesn't lose its card).
export function ownedKeys(profile: Profile): string[] {
  const keys = [
    ...profile.favourites.filter((f) => f.kind === 'species' || f.kind === 'extinction').map(cardKeyOf),
    ...profile.deck,
    ...(profile.loadouts ?? []).flatMap((l) => l?.deck ?? []),
  ];
  return [...new Set(keys)].filter((k) => !!profile.cards[k]);
}
export const ownsCard = (profile: Profile, key: string) => ownedKeys(profile).includes(key);

// Every card the player owns.
export function ownedCards(profile: Profile): Card[] {
  return ownedKeys(profile).flatMap((key) => {
    const card = cardFor(key, profile.cards[key]!);
    return card ? [card] : [];
  });
}

// The playable deck: the chosen cards the player still owns.
export function deckCards(profile: Profile): Card[] {
  const owned = new Map(ownedCards(profile).map((c) => [c.key, c]));
  return profile.deck.flatMap((k) => (owned.has(k) ? [owned.get(k)!] : []));
}

export const cardName = (c: Card) => (c.kind === 'species' ? c.species.common || c.species.name : c.event.name);
