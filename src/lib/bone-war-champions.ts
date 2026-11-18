// Bone War champions: hard computer opponents, each playing one style with a deck built for it.
// Beating a champion earns its title; beating all five earns Heart of the Cards.

import { type Action, aiMove, cardOf, type GameState, type GCard, isExtinctionCard, legal, levelFor, missChance, type PlayerState } from '@/lib/bone-war-game';
import { DECK_SIZE, type Look } from '@/lib/bone-war';
import { statsOf, extinctionOf } from '@/lib/cards';

export type ChampionStyle = 'aggressive' | 'defensive' | 'speedy' | 'swimmer' | 'mixed';

export type Champion = {
  style: ChampionStyle;
  // The opponent's name on the board.
  name: string;
  // How they play, shown on the menu.
  blurb: string;
  // The title earned by beating them (an id in titles.ts) and its name.
  title: string;
  titleName: string;
  // Their colours: the board above the divider, and their card backs and borders.
  look: Look;
  cardStyle: { back: string; border: string };
};

// Red, green, yellow, blue and black themes.
const RED: Look = { background: '#2A0A0A', card: '#3D1212', text: '#FBE9E7', muted: '#E0A8A0', accent: '#FF5A4E', border: '#7A2020', track: '#4A1818' };
const GREEN: Look = { background: '#0A1F12', card: '#13301D', text: '#E8F5E9', muted: '#A5D6A7', accent: '#66BB6A', border: '#2E5E3A', track: '#1C4027' };
const YELLOW: Look = { background: '#2A2200', card: '#3D3205', text: '#FFFDE7', muted: '#E6D98A', accent: '#FFD600', border: '#6B5A0E', track: '#4A3F0A' };
const BLUE: Look = { background: '#071A2E', card: '#0E2A47', text: '#E3F2FD', muted: '#9EC3E6', accent: '#4FC3F7', border: '#1F4E7A', track: '#16385C' };
const BLACK: Look = { background: '#000000', card: '#141414', text: '#F5F5F5', muted: '#A0A0A0', accent: '#E0E0E0', border: '#3A3A3A', track: '#262626' };

export const CHAMPIONS: Champion[] = [
  { style: 'aggressive', name: 'The Tyrant', blurb: 'Hard-hitting attackers and a thin front line. Expect constant challenges and card attacks.', title: 'tyrant-of-the-cards', titleName: 'Tyrant of the Cards', look: RED, cardStyle: { back: '#8C1C13', border: '#E53935' } },
  { style: 'defensive', name: 'The Aegis', blurb: 'A wall of high-defence cards that shrugs off attacks, and only answers when it can open you up.', title: 'aegis-of-knowledge', titleName: 'Aegis of Knowledge', look: GREEN, cardStyle: { back: '#1B5E20', border: '#81C784' } },
  { style: 'speedy', name: 'The Quicksilver', blurb: 'The fastest backline it can find: your clock runs short and every wrong answer costs you.', title: 'quickest-of-wits', titleName: 'Quickest of Wits', look: YELLOW, cardStyle: { back: '#B28704', border: '#FFEB3B' } },
  { style: 'swimmer', name: 'The Leviathan', blurb: 'Swimmers that reveal your cards and ambush them from the water.', title: 'ruler-of-the-waves', titleName: 'Ruler of the Waves', look: BLUE, cardStyle: { back: '#0D47A1', border: '#29B6F6' } },
  { style: 'mixed', name: 'The Polymath', blurb: 'A bit of everything, and every move used when it counts.', title: 'jack-of-all-trades', titleName: 'Jack of all Trades', look: BLACK, cardStyle: { back: '#0A0A0A', border: '#BDBDBD' } },
];
export const HEART_OF_THE_CARDS = 'heart-of-the-cards';

const stat = (g: GCard | null, k: 'attack' | 'defence' | 'speed' | 'swim') => {
  const c = g ? cardOf(g) : null;
  return c && c.kind === 'species' ? c.stats[k] : 0;
};

// How much a style wants a card in its backline.
const backWant: Record<ChampionStyle, (g: GCard) => number> = {
  aggressive: (g) => stat(g, 'attack') * 3 + stat(g, 'speed'),
  defensive: (g) => stat(g, 'defence') * 3 + stat(g, 'attack'),
  speedy: (g) => stat(g, 'speed') * 3 + stat(g, 'attack'),
  swimmer: (g) => stat(g, 'swim') * 2 + stat(g, 'attack') * 2 + stat(g, 'speed') * 0.5,
  mixed: (g) => stat(g, 'attack') + stat(g, 'defence') + stat(g, 'speed') + stat(g, 'swim'),
};
// The same, from a card's stats, for building the deck.
const deckWant: Record<ChampionStyle, (s: { attack: number; defence: number; speed: number; swim: number }) => number> = {
  aggressive: (s) => s.attack * 3 + s.speed,
  defensive: (s) => s.defence * 3 + s.attack,
  speedy: (s) => s.speed * 3 + s.attack,
  swimmer: (s) => s.swim * 2 + s.attack * 2 + s.speed * 0.5,
  // Cards that are good at everything, plus some of each specialist.
  mixed: (s) => Math.min(s.attack, 2) + Math.min(s.defence, 2) + Math.min(s.speed, 2) + Math.min(s.swim, 2) + (s.attack + s.defence + s.speed + s.swim) * 0.3,
};

const shuffle = <T,>(xs: T[], rnd: () => number): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

// A champion's deck: the best cards for its style from a random selection of species (so each
// match is a little different), at about the player's average stars (one
// above for the less forceful styles), and two extinction cards.
export function championDeck(style: ChampionStyle, playerStars: number, speciesIds: string[], extinctionKeys: string[], rnd: () => number = Math.random): { key: string; stars: number }[] {
  // The two pressure styles are strong enough without harder cards.
  const bonus = style === 'aggressive' || style === 'speedy' ? 0 : 1;
  const stars = Math.max(3, Math.min(5, Math.round(playerStars + bonus)));
  const sample = shuffle(speciesIds, rnd).slice(0, 600);
  // Animals a mass extinction would wipe out are slightly less wanted.
  const ranked = sample
    .map((id) => ({ id, w: deckWant[style](statsOf(id)) + rnd() * 0.5 - (extinctionOf(id) ? 0.3 : 0) }))
    .sort((a, b) => b.w - a.w)
    .slice(0, DECK_SIZE - 2);
  return [...ranked.map((r) => ({ key: `species:${r.id}`, stars })), ...shuffle(extinctionKeys, rnd).slice(0, 2).map((key) => ({ key, stars }))];
}

const victims = (p: PlayerState, ext: string) =>
  [...p.front, ...p.back].filter((g) => {
    const c = g ? cardOf(g) : null;
    return c && c.kind === 'species' && c.extinction === ext;
  }).length;

// A champion's move on its turn.
export function championMove(s: GameState, who: 0 | 1, style: ChampionStyle, rnd: () => number = Math.random): Action {
  // The Leviathan plays the standard computer's swimmer game, with a swimmer's deck.
  if (style === 'swimmer') return aiMove(s, who, rnd);
  const me = s.players[who]!;
  const opp = s.players[1 - who]!;
  const ok = (a: Action) => legal(s, who, a);
  if (s.actions <= 0) return { type: 'end' };
  const strike = me.back
    .map((g, i) => ({ g, i }))
    .filter((x) => ok({ type: 'strike', slot: x.i }))
    .sort((a, b) => stat(b.g, 'attack') - stat(a.g, 'attack'))[0];
  if (strike) return { type: 'strike', slot: strike.i };

  const species = me.hand.map((g, i) => ({ g, i })).filter((x) => !isExtinctionCard(x.g));
  const frontFree = me.front.findIndex((x) => !x);
  const backFree = me.back.findIndex((x) => !x);
  const frontCount = me.front.filter(Boolean).length;
  const backCount = me.back.filter(Boolean).length;
  const best = (f: (g: GCard) => number) => [...species].sort((a, b) => f(b.g) - f(a.g))[0]!.i;
  const guardScore = (g: GCard) => stat(g, 'defence') * 2 + g.stars * 0.3;
  const front = (): Action => ({ type: 'play', hand: best(guardScore), row: 'front', slot: frontFree });
  const back = (): Action => ({ type: 'play', hand: best(backWant[style]), row: 'back', slot: backFree });
  const targets = opp.front.map((g, i) => ({ g, i })).filter((x): x is { g: GCard; i: number } => !!x.g);
  const level = (g: GCard) => levelFor(s, who, g);
  const easiest = () => [...targets].sort((a, b) => level(a.g) - level(b.g))[0]!;
  const fighters = me.back
    .map((g, i) => ({ g, i }))
    .filter((x): x is { g: GCard; i: number } => !!x.g && x.g.playedTurn !== s.round && stat(x.g, 'attack') > 0)
    .sort((a, b) => stat(b.g, 'attack') - stat(a.g, 'attack'));
  const fight = (t: { g: GCard }, risk = 0.25) => fighters.find((f) => stat(f.g, 'attack') > stat(t.g, 'defence') && missChance(f.g, t.g) <= risk);
  const beatable = targets.filter((x) => x.g.seen && fight(x));
  const attackOn = (t: { g: GCard; i: number }): Action => ({ type: 'attack', from: fight(t)!.i, slot: t.i });
  const swimmer = me.back.findIndex((g, i) => g && ok({ type: 'swim', slot: i }));

  const extNeed = style === 'aggressive' ? 1 : 2;
  const ext = me.hand.findIndex((g) => isExtinctionCard(g) && victims(opp, cardOf(g)!.id) >= extNeed);
  if (ext >= 0 && frontFree >= 0) return { type: 'play', hand: ext, row: 'front', slot: frontFree };

  if (style === 'aggressive') {
    if (species.length && frontFree >= 0 && frontCount < 1) return front();
    if (species.length && backFree >= 0 && backCount < 2) return back();
    if (beatable.length) return attackOn(beatable[0]!);
    // A big hitter takes a swing at a face-down card.
    const blind = targets.find((x) => !x.g.seen);
    const top = fighters[0];
    if (blind && top && stat(top.g, 'attack') >= 3 && missChance(top.g, blind.g) === 0 && rnd() < 0.5) return { type: 'attack', from: top.i, slot: blind.i };
    if (targets.length) return { type: 'challenge', slot: easiest().i };
    if (species.length && backFree >= 0) return back();
    if (species.length && frontFree >= 0 && frontCount < 2) return front();
  }
  if (style === 'defensive') {
    if (species.length && frontFree >= 0 && frontCount < 2) return front();
    if (species.length && backFree >= 0 && backCount < 2) return back();
    if (beatable.length && targets.length <= 2) return attackOn(beatable[0]!);
    if (targets.length && targets.length <= s.actions + 1) return beatable.length ? attackOn(beatable[0]!) : { type: 'challenge', slot: easiest().i };
    if (species.length && frontFree >= 0 && frontCount < 4) return front();
    if (species.length && backFree >= 0) return back();
    if (targets.length && level(easiest().g) <= 3) return { type: 'challenge', slot: easiest().i };
    if (targets.length && rnd() < 0.5) return { type: 'challenge', slot: easiest().i };
  }
  if (style === 'speedy') {
    if (species.length && frontFree >= 0 && frontCount < 2) return front();
    if (species.length && backFree >= 0 && backCount < 3) return back();
    if (beatable.length) return attackOn(beatable[0]!);
    if (targets.length && level(easiest().g) <= 3) return { type: 'challenge', slot: easiest().i };
    if (species.length && frontFree >= 0 && frontCount < 3) return front();
    if (targets.length) return { type: 'challenge', slot: easiest().i };
  }
  if (style === 'mixed') {
    if (species.length && frontFree >= 0 && frontCount < 2) return front();
    if (species.length && backFree >= 0 && backCount < 3) return back();
    if (swimmer >= 0 && targets.some((x) => !x.g.seen)) return { type: 'swim', slot: swimmer };
    const tough = beatable.filter((x) => level(x.g) >= 3);
    if (tough.length) return attackOn(tough[0]!);
    const easy = targets.filter((x) => level(x.g) <= 3);
    if (easy.length) return { type: 'challenge', slot: easiest().i };
    if (beatable.length) return attackOn(beatable[0]!);
    if (species.length && frontFree >= 0 && frontCount < 3) return front();
    const spent = me.back.findIndex((g) => g?.swimUsed);
    if (spent >= 0 && frontFree >= 0 && species.some((x) => stat(x.g, 'swim') > 0)) return { type: 'advance', from: spent, to: frontFree };
    if (targets.length) return { type: 'challenge', slot: easiest().i };
  }
  if (species.length && backFree >= 0) return back();
  if (species.length && frontFree >= 0) return front();
  if (targets.length) return { type: 'challenge', slot: easiest().i };
  return { type: 'end' };
}

// How often a champion answers right at each level: a little better than the practice computer.
const CHAMPION_RIGHT = [0.9, 0.8, 0.67, 0.53, 0.41];
export const championAnswers = (level: number, rnd: () => number = Math.random) => rnd() < CHAMPION_RIGHT[level - 1]!;
