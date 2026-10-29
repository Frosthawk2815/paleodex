import { type EventPoint, EVENTS, type HistoryEvent } from '@/data/events';
import { siteAt } from '@/lib/plates';
import { PERIODS } from '@/data/periods';

// A point shows until its end time, but not at it: e.g. a formation that ends at the impact
// (66.0 Ma) is gone at the boundary, matching how the timeline puts 66.0 Ma in the Paleogene.
export function pointVisible(p: EventPoint, timeMa: number): boolean {
  return timeMa <= p.fromMa && (p.toMa === 0 ? timeMa >= 0 : timeMa > p.toMa);
}

export type VisiblePoint = { event: HistoryEvent; point: EventPoint; index: number };

// Event points showing on a body at a given time.
export function visiblePoints(body: EventPoint['body'], timeMa: number): VisiblePoint[] {
  return EVENTS.flatMap((event) =>
    event.points.flatMap((point, index) => (point.body === body && pointVisible(point, timeMa) ? [{ event, point, index }] : [])),
  );
}

// Where an Earth point was at `timeMa` (lon, lat), moving with its plate.
export function pointPosition(p: EventPoint, timeMa: number): [number, number] {
  return p.plate !== undefined ? siteAt({ lon: p.lon, lat: p.lat, plate: p.plate }, timeMa) : [p.lon, p.lat];
}

// A rock formation's present-day marker (the pickaxe) is tinted with the ICS colour of the period
// its rocks were laid down in (taken at its "where it formed" time). Its past "forming" marker and
// other events keep their own artwork colours.
export function badgeBg(event: HistoryEvent, point: EventPoint): string | undefined {
  if (event.kind !== 'Rock formation' || point.toMa !== 0) return undefined;
  const t = event.points[0]?.jumpMa ?? event.points[0]?.fromMa;
  if (t === undefined) return undefined;
  return PERIODS.find((p) => t <= p.startMa && (p.endMa === 0 ? t >= 0 : t > p.endMa))?.color;
}
