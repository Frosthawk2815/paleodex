// Where modern species lived over time (range outlines), and where the last one was seen alive.
// Modern species aren't tied to rock formations; their ranges are drawn over the globe instead.
// Built by tools/globe-data/build_ranges.py from tools/globe-data/ranges-spec.json.

import { geoCentroid } from 'd3-geo';

import rangeData from '@/data/globe/ranges.json';
import { decodeLonLatRing, type Polygon } from '@/lib/geography';
import { yearToMa } from '@/lib/time';

export type RangePhase = { fromMa: number; toMa: number; label: string; polygons: string[][] };
// Where the last one was seen alive. The skull marker sits at the centre of `country`.
export type LastSeen = { country: string; lon: number; lat: number; ma: number; year?: number; text: string };
export type Range = { phases: RangePhase[]; lastSeen?: LastSeen };

type RawLastSeen = Omit<LastSeen, 'year'> & { year?: number | null };
// A phase may borrow another phase's outline (by index) instead of storing a copy.
type RawPhase = Omit<RangePhase, 'polygons'> & { polygons?: string[][]; sameAs?: number };
const RAW = rangeData as unknown as Record<string, { phases: RawPhase[]; lastSeen?: RawLastSeen }>;

const resolvePhases = (phases: RawPhase[]): RangePhase[] =>
  phases.map(({ sameAs, polygons, ...p }) => ({ ...p, polygons: polygons ?? phases[sameAs ?? 0].polygons ?? [] }));

// Calendar years are converted here so they line up exactly with the timeline's "today".
export const RANGES: Record<string, Range> = Object.fromEntries(
  Object.entries(RAW).map(([id, raw]) => {
    const r = { ...raw, phases: resolvePhases(raw.phases) };
    if (!r.lastSeen) return [id, { phases: r.phases }];
    const { year, ...rest } = r.lastSeen;
    const lastSeen: LastSeen = year != null ? { ...rest, year, ma: yearToMa(year) } : rest;
    // The last phase ends when the last one died.
    const phases = r.phases.map((p, i) => (i === r.phases.length - 1 ? { ...p, toMa: lastSeen.ma } : p));
    return [id, { phases, lastSeen }];
  }),
);

export const rangeOf = (id: string): Range | undefined => RANGES[id];

// Species whose spread or introduction into new places helped cause other species' extinctions.
// While one of their ranges is shown, the globe keeps showing extinction markers.
export const EXTINCTION_DRIVERS = new Set([
  'homo-sapiens',
  'rattus-rattus', // black rat: island birds, bats and lizards worldwide
  'rattus-norvegicus', // brown rat: island birds and mammals
  'vulpes-vulpes', // red fox: Australia's small mammals
  'sus-scrofa', // wild and feral pigs: island birds and reptiles
  'mustela-erminea', // stoat: New Zealand birds
]);

const inWindow = (t: number, from: number, to: number) => t <= from && (to === 0 ? t >= 0 : t > to);

// The index of the range phase showing at `timeMa`, or -1 if the species wasn't alive then.
export const phaseIndexAt = (r: Range, timeMa: number) => r.phases.findIndex((p) => inWindow(timeMa, p.fromMa, p.toMa));

const decoded = new Map<RangePhase, Polygon[]>();

// A phase's outline as GeoJSON-style polygons ([lon, lat] rings).
export function phasePolygons(p: RangePhase): Polygon[] {
  let polys = decoded.get(p);
  if (!polys) {
    polys = p.polygons.map((rings) => rings.map(decodeLonLatRing));
    decoded.set(p, polys);
  }
  return polys;
}

// Somewhere near the middle of a phase's range, to turn the globe to.
export const phaseCentre = (p: RangePhase): [number, number] =>
  geoCentroid({ type: 'MultiPolygon', coordinates: phasePolygons(p) });

// The time to jump to for a phase: the middle of it (on a log scale for long phases), or today
// for a range that runs up to the present.
export const phaseJumpMa = (p: RangePhase) => (p.toMa > 0 ? Math.sqrt(p.fromMa * p.toMa) : 0);

// The time to jump to for a last sighting: just before it, while the skull marker still shows.
export const lastSeenJumpMa = (l: LastSeen) => (l.year !== undefined ? yearToMa(l.year - 2) : l.ma * 1.05);

// Skull markers show for a while before the last sighting (from twice as long ago, so the window
// scales with the timeline), then disappear at that date. They always show for a selected species
// during its last phase.
export function visibleSkulls(timeMa: number, selectedId?: string): { id: string; lastSeen: LastSeen }[] {
  return Object.entries(RANGES).flatMap(([id, r]) => {
    const l = r.lastSeen;
    if (!l) return [];
    const from = id === selectedId ? Math.max(r.phases[r.phases.length - 1].fromMa, l.ma * 2) : l.ma * 2;
    return inWindow(timeMa, from, l.ma) ? [{ id, lastSeen: l }] : [];
  });
}
