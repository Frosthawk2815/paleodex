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

// The points needed to reach each level, and its title.
const LEVELS: { at: number; title: string }[] = [
  { at: 0, title: 'Fossil Finder' },
  { at: 50, title: 'Rock Hound' },
  { at: 150, title: 'Field Assistant' },
  { at: 300, title: 'Bone Digger' },
  { at: 500, title: 'Excavator' },
  { at: 800, title: 'Fossil Preparator' },
  { at: 1200, title: 'Field Leader' },
  { at: 1700, title: 'Curator' },
  { at: 2300, title: 'Palaeontologist' },
  { at: 3000, title: 'Senior Palaeontologist' },
  { at: 4000, title: 'Professor' },
  { at: 5500, title: 'Museum Director' },
  { at: 7500, title: 'Deep Time Explorer' },
  { at: 10000, title: 'Living Legend' },
];

export type Level = { level: number; title: string; points: number; from: number; to: number | null };

// Where a tally sits: its level, and the points at the start of this level and the next.
export function levelOf(points: number): Level {
  let i = 0;
  while (i + 1 < LEVELS.length && points >= LEVELS[i + 1]!.at) i++;
  // Past the last title, every further 3,000 points is another level.
  const last = LEVELS.length - 1;
  if (i === last) {
    const extra = Math.floor((points - LEVELS[last]!.at) / 3000);
    const from = LEVELS[last]!.at + extra * 3000;
    return { level: last + 1 + extra, title: LEVELS[last]!.title, points, from, to: from + 3000 };
  }
  return { level: i + 1, title: LEVELS[i]!.title, points, from: LEVELS[i]!.at, to: LEVELS[i + 1]!.at };
}
