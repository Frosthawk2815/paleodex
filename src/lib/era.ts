// Whether a page is about the ancient past or the modern world, for the mixed paper theme: old
// parchment for prehistoric life, a notebook for living animals and recorded history.

import { createContext } from 'react';

import type { HistoryEvent } from '@/data/events';
import type { Species } from '@/data/life';
import { speciesInClade } from '@/lib/life';
import { rangeOf } from '@/lib/ranges';

export type Era = 'ancient' | 'modern';

// Set by the page being shown; null for menus and other screens.
export const PageEra = createContext<Era | null>(null);

// Living today, or lost in the last few centuries (the dodo, the thylacine).
export function isModernSpecies(s: Species): boolean {
  const r = rangeOf(s.id);
  if (!r) return false;
  if (r.lastSeen) return (r.lastSeen.year ?? -Infinity) >= 1500;
  return r.phases[r.phases.length - 1]?.toMa === 0;
}

export const speciesEra = (s: Species): Era => (isModernSpecies(s) ? 'modern' : 'ancient');

// A group is modern if most of its species are.
export function cladeEra(id: string): Era {
  const all = speciesInClade(id);
  const modern = all.filter(isModernSpecies).length;
  return all.length > 0 && modern * 2 > all.length ? 'modern' : 'ancient';
}

// Rock formations are ancient; events within the last 10,000 years (the Moon landing) are modern.
export function eventEra(e: HistoryEvent): Era {
  if (e.kind === 'Rock formation') return 'ancient';
  return Math.min(...e.points.map((p) => p.fromMa)) < 0.01 ? 'modern' : 'ancient';
}
