// Bone War cards: which ones a player owns, and their details.
//
// A card is earned by answering a quiz question about a species (or a mass extinction) correctly:
// straight away in a wishlist test, or by collecting it from the results of a solo quiz. Its stars
// are the hardest level answered correctly; a harder correct answer later upgrades it. There is one
// card per species.

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

// The two Late Devonian pulses (Kellwasser and Hangenberg) are one Bone War card, which wipes out
// the animals lost in either. Their pages and timeline marks stay separate.
export const LATE_DEVONIAN = 'late-devonian';
const LATE_DEVONIAN_PULSES = ['kellwasser', 'hangenberg'];
export const LATE_DEVONIAN_EVENT: Extinction = {
  id: LATE_DEVONIAN,
  name: 'Late Devonian extinctions',
  short: 'F/F, D/C',
  ma: 372.15,
  cause: 'anoxia',
  causeText: 'oxygen-starved oceans, in two pulses',
  bigFive: true,
};
// The card for an extinction page.
export const extinctionCardId = (id: string) => (LATE_DEVONIAN_PULSES.includes(id) ? LATE_DEVONIAN : id);
// The pages an extinction card stands for (two for the Late Devonian card).
export const extinctionPagesOf = (cardId: string) => (cardId === LATE_DEVONIAN ? LATE_DEVONIAN_PULSES : [cardId]);
// Whether an extinction card wipes out an animal lost in `speciesExtinction`.
export const extinctionHits = (cardId: string, speciesExtinction: string | null) => !!speciesExtinction && extinctionPagesOf(cardId).includes(speciesExtinction);
// Every extinction card's key.
export const EXTINCTION_CARD_KEYS = [...new Set(EXTINCTIONS.map((e) => `extinction:${extinctionCardId(e.id)}`))];
// Older saves kept the two pulses as separate cards.
export const normalCardKey = (key: string) => (key.startsWith('extinction:') ? `extinction:${extinctionCardId(key.slice(11))}` : key);

export const cardKeyOf = (page: PageRef) => (page.kind === 'extinction' ? `extinction:${extinctionCardId(page.id)}` : `${page.kind}:${page.id}`);

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
  if (q.page?.kind === 'extinction') return `extinction:${extinctionCardId(q.page.id)}`;
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
    const event = id === LATE_DEVONIAN ? LATE_DEVONIAN_EVENT : LATE_DEVONIAN_PULSES.includes(id) ? undefined : EXTINCTIONS.find((e) => e.id === id);
    return event ? { key, kind, id, stars, event } : null;
  }
  return null;
}

// The keys of every card the player owns: their collection (and, to be safe, anything in their
// deck or a saved loadout).
export function ownedKeys(profile: Profile): string[] {
  const keys = [...(profile.collection ?? []), ...profile.deck, ...(profile.loadouts ?? []).flatMap((l) => l?.deck ?? [])];
  return [...new Set(keys)].filter((k) => !!profile.cards[k]);
}
export const ownsCard = (profile: Profile, key: string) => ownedKeys(profile).includes(key);

// Whether a saved loadout is the deck (and card colours) in use now.
export const loadoutInUse = (profile: Profile, l: { deck: string[]; cardStyle: { back: string; border: string } }) =>
  l.deck.length === profile.deck.length &&
  l.deck.every((k) => profile.deck.includes(k)) &&
  l.cardStyle.back === profile.cardStyle.back &&
  l.cardStyle.border === profile.cardStyle.border;

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
