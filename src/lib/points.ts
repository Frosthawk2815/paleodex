// Exploration points: every page is worth a hidden number of points, added to the profile's tally
// the first time it is opened. The tally fills a bar towards the next level.

import { EVENTS } from '@/data/events';
import { speciesById } from '@/lib/life';
import type { PageRef } from '@/lib/profile';

export const pageKey = (p: PageRef) => `${p.kind}:${p.id}`;

// How many points a page is worth. Fuller pages and harder-to-find places are worth more.
export function pointsFor(key: string): number {
  const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (kind === 'species') {
    const s = speciesById(id);
    return s ? (s.status === 'full' ? 10 : 5) : 0;
  }
  if (kind === 'clade') return 8;
  const e = EVENTS.find((x) => x.id === id);
  if (!e) return 0;
  return e.kind === 'Rock formation' ? 15 : 20;
}

export const tallyOf = (visited: string[]) => visited.reduce((sum, k) => sum + pointsFor(k), 0);

// The points needed to reach each level, and its title. The whole app is worth about 34,000
// points, so Naturalist means seeing a good part of it.
const LEVELS: { at: number; title: string }[] = [
  { at: 0, title: 'Egg' },
  { at: 100, title: 'Cinephile' },
  { at: 500, title: 'Paleo Enjoyer' },
  { at: 2000, title: 'Deep Digger' },
  { at: 6000, title: 'Savant' },
  { at: 15000, title: 'Naturalist' },
];

// to is null at the top level.
export type Level = { level: number; title: string; points: number; from: number; to: number | null };

// Where a tally sits: its level (from 0), and the points at the start of this level and the next.
export function levelOf(points: number): Level {
  let i = 0;
  while (i + 1 < LEVELS.length && points >= LEVELS[i + 1]!.at) i++;
  return { level: i, title: LEVELS[i]!.title, points, from: LEVELS[i]!.at, to: LEVELS[i + 1]?.at ?? null };
}
