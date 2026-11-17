// Bone War rules: a turn-based card battle between two players, kept as plain data so the same
// state can drive a game against the computer or be sent between two phones.
//
// Each player has 20 HP, a deck of up to 30 cards and a hand of up to 5. A turn has two actions:
//   play a card from the hand face down, into the front line (6 slots, the question line) or the
//     backline (3 slots, the player line; extinction cards only go in the front line);
//   move a backline card to the front line (never back);
//   challenge an opponent's front-line card: answer a question about it at its star level, made
//     easier by the attack of your backline. Right: the card is removed and its owner loses 2 HP.
//     Wrong: it stays, and trying again draws a new question;
//   strike with a backline card when the opponent's front line is empty: its attack wears down the
//     opponent's defence for the turn (their best backline defence) and the rest is damage. A
//     card can't strike on the turn it was played;
//   swim with a backline card (once per card): reveal that many of the opponent's face-down cards.
// Playing an extinction card makes the opponent answer its question at once. Wrong: every species
// they have in play that the extinction wiped out is removed. Right: the player who played it must
// answer a saving question, or lose their own.
// Answer time is 20 seconds, plus your backline's speed, minus the opponent's. At the end of a turn
// the player draws two cards (up to five in hand).

import { cardFor, type Card } from '@/lib/bone-war';
import type { Difficulty } from '@/lib/quiz';

export const START_HP = 20;
// HP a player loses when the opponent knocks out one of their front-line cards with a right answer.
export const KNOCK_DAMAGE = 2;
export const FRONT = 6;
export const BACK = 3;
export const ACTIONS = 2;
export const BASE_SECONDS = 20;
export const MIN_SECONDS = 5;

// playedTurn: the turn number it was played on (it can't strike until a later turn).
export type GCard = { uid: string; key: string; stars: number; seen: boolean; swimUsed?: boolean; playedTurn?: number };
export type PlayerState = {
  name: string;
  hp: number;
  deck: GCard[];
  hand: GCard[];
  front: (GCard | null)[];
  back: (GCard | null)[];
  // Defence left to soak up strikes this turn.
  shield: number;
  // HP lost this turn (shown to both players as −x next to the health bar).
  hit?: number;
};
export type Pending = {
  // Who answers, about which card, why, and at what level and time limit.
  answerer: 0 | 1;
  card: GCard;
  purpose: 'challenge' | 'extinction' | 'saving';
  level: Difficulty;
  seconds: number;
  // For a challenge: the slot of the challenged card. For extinction and saving: the event.
  slot?: number;
  extinction?: string;
  // Who played the extinction card.
  player?: 0 | 1;
};
export type GameState = {
  players: [PlayerState, PlayerState];
  turn: 0 | 1;
  actions: number;
  pending: Pending | null;
  winner: 0 | 1 | null;
  // True when the game is over (winner null means a draw).
  over: boolean;
  // Turns left once both decks have run out; then the higher HP wins.
  finalTurns: number | null;
  // Counts turns from 1.
  round: number;
  log: string[];
  seq: number;
};

export type Action =
  | { type: 'play'; hand: number; row: 'front' | 'back'; slot: number }
  | { type: 'advance'; from: number; to: number }
  | { type: 'challenge'; slot: number }
  | { type: 'strike'; slot: number }
  | { type: 'swim'; slot: number }
  | { type: 'answer'; correct: boolean }
  | { type: 'end' }
  // Give up: the other player wins.
  | { type: 'forfeit' };

const shuffle = <T,>(xs: T[], rnd: () => number): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

export const cardOf = (g: GCard): Card | null => cardFor(g.key, g.stars);
// Extinction cards, including the Humans card.
export const isExtinctionCard = (g: GCard) => cardOf(g)?.kind === 'extinction';
const stat = (g: GCard | null, k: 'attack' | 'defence' | 'speed' | 'swim') => {
  const c = g ? cardOf(g) : null;
  return c && c.kind === 'species' ? c.stats[k] : 0;
};
export const backTotal = (p: PlayerState, k: 'attack' | 'defence' | 'speed' | 'swim') => p.back.reduce((n, g) => n + stat(g, k), 0);
export const backMax = (p: PlayerState, k: 'attack' | 'defence' | 'speed' | 'swim') => Math.max(0, ...p.back.map((g) => stat(g, k)));

export function newGame(decks: [{ name: string; cards: { key: string; stars: number }[] }, { name: string; cards: { key: string; stars: number }[] }], rnd: () => number = Math.random): GameState {
  const players = decks.map((d, pi) => {
    const deck = shuffle(
      d.cards.map((c, i) => ({ uid: `${pi}-${i}`, key: c.key, stars: c.stars, seen: false })),
      rnd,
    );
    return { name: d.name, hp: START_HP, deck: deck.slice(5), hand: deck.slice(0, 5), front: Array(FRONT).fill(null), back: Array(BACK).fill(null), shield: 0 };
  }) as [PlayerState, PlayerState];
  const turn = rnd() < 0.5 ? 0 : 1;
  const state: GameState = { players, turn, actions: ACTIONS, pending: null, winner: null, over: false, finalTurns: null, round: 1, log: [], seq: 0 };
  startTurn(state);
  return state;
}

function startTurn(s: GameState) {
  const opp = s.players[1 - s.turn]!;
  // The defender's best backline defence is fresh for each of the attacker's turns.
  opp.shield = backMax(opp, 'defence');
  // The −x from the last round stays up until this player is attacked again.
  opp.hit = 0;
  s.actions = ACTIONS;
}

// Seconds a player gets to answer: 20, plus their backline's speed, minus the opponent's.
export const secondsFor = (s: GameState, answerer: 0 | 1) =>
  Math.max(MIN_SECONDS, BASE_SECONDS + backTotal(s.players[answerer]!, 'speed') - backTotal(s.players[1 - answerer]!, 'speed'));

// The level of a question about a card for an answerer: its stars, made easier by the answerer's
// strongest backline attack.
export const levelFor = (s: GameState, answerer: 0 | 1, card: GCard) => Math.max(1, Math.min(5, card.stars - backMax(s.players[answerer]!, 'attack'))) as Difficulty;

const clone = (s: GameState): GameState => JSON.parse(JSON.stringify(s));
const nameOf = (g: GCard) => {
  const c = cardOf(g);
  return c ? (c.kind === 'species' ? c.species.common || c.species.name : c.event.name) : g.key;
};

// What a player may do now.
export function legal(s: GameState, who: 0 | 1, a: Action): boolean {
  if (s.over) return false;
  if (a.type === 'forfeit') return true;
  if (a.type === 'answer') return !!s.pending && s.pending.answerer === who;
  if (s.pending || s.turn !== who) return false;
  if (a.type === 'end') return true;
  if (s.actions <= 0) return false;
  const me = s.players[who]!;
  const opp = s.players[1 - who]!;
  switch (a.type) {
    case 'play': {
      const g = me.hand[a.hand];
      if (!g) return false;
      const isExtinction = isExtinctionCard(g);
      if (a.row === 'back' && isExtinction) return false;
      const row = a.row === 'front' ? me.front : me.back;
      return a.slot >= 0 && a.slot < row.length && !row[a.slot];
    }
    case 'advance':
      return !!me.back[a.from] && !me.front[a.to] && a.to >= 0 && a.to < FRONT;
    case 'challenge':
      return !!opp.front[a.slot];
    case 'strike':
      return !!me.back[a.slot] && me.back[a.slot]!.playedTurn !== s.round && opp.front.every((x) => !x) && stat(me.back[a.slot]!, 'attack') > 0;
    case 'swim': {
      const g = me.back[a.slot];
      return !!g && !g.swimUsed && stat(g, 'swim') > 0 && [...opp.front, ...opp.back].some((x) => x && !x.seen);
    }
  }
}

// Applies an action, returning the new state (or the same one if it isn't allowed).
export function apply(s0: GameState, who: 0 | 1, a: Action, rnd: () => number = Math.random): GameState {
  if (!legal(s0, who, a)) return s0;
  const s = clone(s0);
  s.seq++;
  const me = s.players[who]!;
  const opp = s.players[(1 - who) as 0 | 1]!;
  const other = (1 - who) as 0 | 1;
  const log = (m: string) => s.log.push(m);

  if (a.type === 'forfeit') {
    s.pending = null;
    s.over = true;
    s.winner = other;
    log(`${me.name} forfeited.`);
    return s;
  }

  if (a.type === 'end') {
    // Draw two, up to five in hand; then the other player's turn.
    for (let i = 0; i < 2 && me.hand.length < 5 && me.deck.length; i++) me.hand.push(me.deck.shift()!);
    s.turn = other;
    s.round++;
    startTurn(s);
    // Once both decks are empty, six more turns; then the higher HP wins.
    if (s.finalTurns === null && s.players.every((p) => !p.deck.length)) {
      s.finalTurns = 6;
      log('Both decks are empty: six turns left.');
    } else if (s.finalTurns !== null && --s.finalTurns <= 0) {
      const [a0, a1] = s.players.map((p) => p.hp);
      s.over = true;
      s.winner = a0! > a1! ? 0 : a1! > a0! ? 1 : null;
      log(s.winner === null ? 'Time is up: a draw.' : `Time is up: ${s.players[s.winner]!.name} wins on HP.`);
    }
    log(`${me.name} ended their turn.`);
    checkStuck(s);
    return s;
  }

  if (a.type === 'answer') {
    const p = s.pending!;
    s.pending = null;
    const answerer = s.players[p.answerer]!;
    if (p.purpose === 'challenge') {
      const owner = s.players[(1 - p.answerer) as 0 | 1]!;
      if (a.correct) {
        owner.front[p.slot!] = null;
        owner.hp = Math.max(0, owner.hp - KNOCK_DAMAGE);
        owner.hit = (owner.hit ?? 0) + KNOCK_DAMAGE;
        log(`${answerer.name} answered right, knocked out ${nameOf(p.card)} and took ${KNOCK_DAMAGE} HP.`);
        if (owner.hp <= 0) {
          s.winner = p.answerer;
          s.over = true;
          return s;
        }
      } else {
        const g = owner.front[p.slot!];
        if (g) g.seen = true;
        log(`${answerer.name} got it wrong; ${nameOf(p.card)} stays.`);
      }
    } else if (p.purpose === 'extinction') {
      if (!a.correct) {
        const lost = wipe(answerer, p.extinction!);
        log(`${answerer.name} got it wrong: the ${nameOf(p.card)} wiped out ${lost} of their animals.`);
      } else {
        // The player who played it must now save themselves.
        const player = p.player!;
        s.pending = { ...p, answerer: player, purpose: 'saving', seconds: secondsFor(s, player), level: levelFor(s, player, p.card) };
        log(`${answerer.name} survived the ${nameOf(p.card)}. Now ${s.players[player]!.name} must answer to escape it.`);
      }
    } else if (p.purpose === 'saving') {
      if (!a.correct) {
        const lost = wipe(answerer, p.extinction!);
        log(`It blew back: ${answerer.name} lost ${lost} of their own animals.`);
      } else log(`${answerer.name} escaped the extinction.`);
    }
    checkStuck(s);
    return s;
  }

  s.actions--;
  switch (a.type) {
    case 'play': {
      const g = me.hand.splice(a.hand, 1)[0]!;
      if (isExtinctionCard(g)) {
        // Extinction cards strike at once: the opponent must answer.
        const extinction = cardOf(g)!.id;
        s.pending = { answerer: other, card: g, purpose: 'extinction', level: levelFor(s, other, g), seconds: secondsFor(s, other), extinction, player: who };
        log(`${me.name} played the ${nameOf(g)}!`);
      } else {
        g.playedTurn = s.round;
        (a.row === 'front' ? me.front : me.back)[a.slot] = g;
        log(`${me.name} played a card face down in the ${a.row === 'front' ? 'front line' : 'backline'}.`);
      }
      break;
    }
    case 'advance':
      me.front[a.to] = me.back[a.from]!;
      me.back[a.from] = null;
      log(`${me.name} moved a card up to the front line.`);
      break;
    case 'challenge': {
      const g = opp.front[a.slot]!;
      s.pending = { answerer: who, card: g, purpose: 'challenge', slot: a.slot, level: levelFor(s, who, g), seconds: secondsFor(s, who) };
      break;
    }
    case 'strike': {
      const g = me.back[a.slot]!;
      g.seen = true;
      const power = stat(g, 'attack');
      const blocked = Math.min(opp.shield, power);
      opp.shield -= blocked;
      const damage = power - blocked;
      opp.hp = Math.max(0, opp.hp - damage);
      opp.hit = (opp.hit ?? 0) + damage;
      // How much the defence soaked up isn't said.
      log(damage ? `${nameOf(g)} struck ${opp.name} for ${damage} damage.` : `${nameOf(g)} struck, but ${opp.name}'s defence held.`);
      if (opp.hp <= 0) {
        s.winner = who;
        s.over = true;
      }
      break;
    }
    case 'swim': {
      const g = me.back[a.slot]!;
      g.swimUsed = true;
      const hidden = [...opp.front, ...opp.back].filter((x): x is GCard => !!x && !x.seen);
      const n = stat(g, 'swim');
      for (const x of shuffle(hidden, rnd).slice(0, n)) x.seen = true;
      log(`${nameOf(g)} swam out and revealed ${Math.min(n, hidden.length)} of ${opp.name}'s cards.`);
      break;
    }
  }
  checkStuck(s);
  return s;
}

// Removes every species a player has in play that the extinction wiped out; returns how many.
function wipe(p: PlayerState, extinction: string): number {
  let n = 0;
  for (const row of [p.front, p.back]) {
    row.forEach((g, i) => {
      const c = g ? cardOf(g) : null;
      if (c && c.kind === 'species' && c.extinction === extinction) {
        row[i] = null;
        n++;
      }
    });
  }
  return n;
}

// A player with nothing left at all (no cards anywhere) loses.
function checkStuck(s: GameState) {
  if (s.over || s.pending) return;
  s.players.forEach((p, i) => {
    const empty = !p.deck.length && !p.hand.length && p.front.every((x) => !x) && p.back.every((x) => !x);
    if (empty && !s.over) {
      s.winner = (1 - i) as 0 | 1;
      s.over = true;
    }
  });
}

// ---------------------------------------------------------------------------------------------
// The computer opponent

// How often the computer answers right at each level.
const AI_RIGHT = [0.85, 0.72, 0.58, 0.45, 0.33];
export const aiAnswers = (level: Difficulty, rnd: () => number = Math.random) => rnd() < AI_RIGHT[level - 1]!;

const score = (g: GCard) => {
  const c = cardOf(g);
  return c && c.kind === 'species' ? c.stats.attack * 2 + c.stats.defence + c.stats.speed + c.stats.swim * 0.5 : 0;
};

// The computer's next move on its turn.
export function aiMove(s: GameState, who: 0 | 1, rnd: () => number = Math.random): Action {
  const me = s.players[who]!;
  const opp = s.players[1 - who]!;
  const ok = (a: Action) => legal(s, who, a);
  if (s.actions <= 0) return { type: 'end' };
  // Finish them: strike with the strongest backline card when their front line is empty.
  const strikers = me.back.map((g, i) => ({ g, i })).filter((x) => x.g && ok({ type: 'strike', slot: x.i }));
  if (strikers.length) return { type: 'strike', slot: strikers.sort((a, b) => stat(b.g, 'attack') - stat(a.g, 'attack'))[0]!.i };
  const backFree = me.back.findIndex((x) => !x);
  const frontFree0 = me.front.findIndex((x) => !x);
  const species = me.hand.map((g, i) => ({ g, i })).filter((x) => !isExtinctionCard(x.g));
  // Guard first: keep at least two cards in the front line so the opponent can't strike.
  if (frontFree0 >= 0 && species.length && me.front.filter(Boolean).length < 2) {
    const pick = [...species].sort((a, b) => b.g.stars - a.g.stars)[0]!;
    return { type: 'play', hand: pick.i, row: 'front', slot: frontFree0 };
  }
  // Then the backline, strongest animals first.
  if (backFree >= 0 && species.length && me.back.filter(Boolean).length < 2) {
    const best = species.sort((a, b) => score(b.g) - score(a.g))[0]!;
    return { type: 'play', hand: best.i, row: 'back', slot: backFree };
  }
  // Play an extinction card when the opponent has animals it would wipe out.
  const ext = me.hand.findIndex((g) => isExtinctionCard(g) && countVictims(opp, cardOf(g)!.id) >= 2);
  const frontFree = me.front.findIndex((x) => !x);
  if (ext >= 0 && frontFree >= 0 && rnd() < 0.7) return { type: 'play', hand: ext, row: 'front', slot: frontFree };
  // Clear their front line, easiest-looking cards first; always when it would open them up to a strike.
  const targets = opp.front.map((g, i) => ({ g, i })).filter((x) => x.g);
  const readyStriker = me.back.some((g) => g && g.playedTurn !== s.round && stat(g, 'attack') > 0);
  const easiest = () => targets.sort((a, b) => a.g!.stars - b.g!.stars)[0]!.i;
  if (targets.length && ((readyStriker && targets.length <= s.actions + 1) || rnd() < 0.75)) return { type: 'challenge', slot: easiest() };
  // Keep a few cards in the front line as a shield.
  const frontCount = me.front.filter(Boolean).length;
  if (frontFree >= 0 && species.length && frontCount < 3) {
    const pick = species.sort((a, b) => b.g.stars - a.g.stars)[0]!;
    return { type: 'play', hand: pick.i, row: 'front', slot: frontFree };
  }
  if (backFree >= 0 && species.length) return { type: 'play', hand: species[0]!.i, row: 'back', slot: backFree };
  const swimmer = me.back.findIndex((g, i) => g && ok({ type: 'swim', slot: i }));
  if (swimmer >= 0 && rnd() < 0.5) return { type: 'swim', slot: swimmer };
  if (targets.length) return { type: 'challenge', slot: targets[0]!.i };
  return { type: 'end' };
}

const countVictims = (p: PlayerState, extinction: string) =>
  [...p.front, ...p.back].filter((g) => {
    const c = g ? cardOf(g) : null;
    return c && c.kind === 'species' && c.extinction === extinction;
  }).length;

// A deck for the computer: random cards from all of Animal Almanac, around the player's level.
export function aiDeck(size: number, stars: number, keys: string[], rnd: () => number = Math.random): { key: string; stars: number }[] {
  return shuffle(keys, rnd)
    .slice(0, size)
    .map((key) => ({ key, stars: Math.max(1, Math.min(5, Math.round(stars + (rnd() - 0.5) * 2))) }));
}
