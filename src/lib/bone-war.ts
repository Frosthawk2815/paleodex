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

// Every card the player owns: answered correctly in solo play and in their favourites.
export function ownedCards(profile: Profile): Card[] {
  return profile.favourites.flatMap((f) => {
    const key = cardKeyOf(f);
    const stars = profile.cards[key];
    const card = stars ? cardFor(key, stars) : null;
    return card ? [card] : [];
  });
}

// The playable deck: the chosen cards the player still owns.
export function deckCards(profile: Profile): Card[] {
  const owned = new Map(ownedCards(profile).map((c) => [c.key, c]));
  return profile.deck.flatMap((k) => (owned.has(k) ? [owned.get(k)!] : []));
}

export const cardName = (c: Card) => (c.kind === 'species' ? c.species.common || c.species.name : c.event.name);
