import { EVENTS, type HistoryEvent } from '@/data/events';
import { yearToMa } from '@/lib/time';

// Events are shown from the moment they happen until today (all are in the Anthropocene so far).
export function eventVisible(e: HistoryEvent, timeMa: number): boolean {
  return timeMa <= yearToMa(e.year);
}

export function eventsOnMoon(timeMa: number): HistoryEvent[] {
  return EVENTS.filter((e) => e.points.some((p) => p.body === 'moon') && eventVisible(e, timeMa));
}

export function eventTimeMa(e: HistoryEvent): number {
  return yearToMa(e.year);
}

// A moment just after the event (about a month), so its markers are showing.
export function justAfterMa(e: HistoryEvent): number {
  return yearToMa(e.year + 0.08);
}
