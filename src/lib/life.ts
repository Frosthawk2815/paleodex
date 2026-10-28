import { EVENTS, type HistoryEvent } from '@/data/events';
import { type Clade, CLADES, SPECIES, type Species } from '@/data/life';

export const cladeById = (id: string) => CLADES.find((c) => c.id === id);
export const speciesById = (id: string) => SPECIES.find((s) => s.id === id);
export const formationById = (id: string) => EVENTS.find((e) => e.id === id && e.kind === 'Rock formation');

// A clade and the clades above it, from the top (e.g. Dinosauria) down.
export function cladePath(id: string): Clade[] {
  const path: Clade[] = [];
  for (let c = cladeById(id); c; c = c.parent ? cladeById(c.parent) : undefined) path.unshift(c);
  return path;
}

export const childClades = (id: string) => CLADES.filter((c) => c.parent === id);

// Every species in a clade or any clade below it.
export function speciesInClade(id: string): Species[] {
  const ids = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of CLADES) {
      if (c.parent && ids.has(c.parent) && !ids.has(c.id)) {
        ids.add(c.id);
        grew = true;
      }
    }
  }
  return SPECIES.filter((s) => ids.has(s.clade));
}

export const speciesInFormation = (formationId: string) => SPECIES.filter((s) => s.formations.includes(formationId));

// The family a species is listed under in a formation (the nearest clade marked as a family).
export function familyOf(s: Species): Clade | undefined {
  const path = cladePath(s.clade);
  return [...path].reverse().find((c) => c.family) ?? path[path.length - 1];
}

// The point of a formation for where it was laid down: the one that ends before today.
export const pastPointIndex = (f: HistoryEvent) => Math.max(0, f.points.findIndex((p) => p.toMa > 0));
