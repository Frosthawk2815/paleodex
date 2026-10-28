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

// Species tied to an event, e.g. Homo sapiens and the Moon landing.
export const speciesAtEvent = (eventId: string) => SPECIES.filter((s) => s.events?.includes(eventId));

export const eventById = (id: string) => EVENTS.find((e) => e.id === id);

// Trackways a species is known or thought to have made.
export const trackwaysOf = (speciesId: string) => EVENTS.filter((e) => e.trackmakers?.some((t) => t.id === speciesId));

// The family a species is listed under in a formation (the nearest clade marked as a family).
export function familyOf(s: Species): Clade | undefined {
  const path = cladePath(s.clade);
  return [...path].reverse().find((c) => c.family) ?? path[path.length - 1];
}

// The point of a formation for where it was laid down: the one that ends before today.
export const pastPointIndex = (f: HistoryEvent) => Math.max(0, f.points.findIndex((p) => p.toMa > 0));

// The rest of a species' family, closest relatives first (approximate, from `phylo`).
export function relativesOf(s: Species): Species[] {
  const family = familyOf(s);
  if (!family) return [];
  const others = speciesInClade(family.id).filter((o) => o.id !== s.id);
  const p = s.phylo;
  if (p === undefined) return others;
  return others.sort((a, b) => {
    if (a.phylo === undefined || b.phylo === undefined) return (a.phylo === undefined ? 1 : 0) - (b.phylo === undefined ? 1 : 0);
    // Closer relatives share a later branch point (a higher lower-number), then sit nearer on the ladder.
    const branch = Math.min(b.phylo, p) - Math.min(a.phylo, p);
    return branch !== 0 ? branch : Math.abs(a.phylo - p) - Math.abs(b.phylo - p);
  });
}
