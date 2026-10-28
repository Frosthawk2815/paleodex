import type { HistoryEvent, Trackmaker } from '@/data/events';
import { PRESENT_FROM } from '@/data/sets/formation';

type TrackwaySpec = {
  id: string;
  title: string;
  // Short name for the globe labels, e.g. "Laetoli" → "Laetoli (tracks laid)" / "Laetoli tracks".
  short: string;
  // When scientists think the prints were made.
  dateText: string;
  placeText: string;
  // Present-day position and its PALEOMAP plate.
  lon: number;
  lat: number;
  plate: number;
  // When the prints were laid (millions of years ago); the "laid" marker shows in this window.
  fromMa: number;
  toMa: number;
  jumpMa?: number;
  // Hominin tracks get a human footprint on the flag; all others a three-toed print.
  human?: boolean;
  trackmakers?: Trackmaker[];
  zoom?: number;
  summary: string[];
  facts: { label: string; value: string }[];
  keywords: string[];
};

function whenText(t: number): string {
  if (t < 1) return `${Math.round(t * 1000).toLocaleString('en-US')},000 years ago`;
  return `${t >= 10 ? Math.round(t) : Number(t.toFixed(2))} million years ago`;
}

// A fossil trackway: a footprint flag where the prints can be seen today, and another where and
// when they were laid, riding on its plate.
export function trackway(t: TrackwaySpec): HistoryEvent {
  const jumpMa = t.jumpMa ?? (t.fromMa + t.toMa) / 2;
  const zoom = t.zoom ?? 4;
  const icon = t.human ? 'human-track-flag' : 'track-flag';
  return {
    id: t.id,
    kind: 'Trackway',
    title: t.title,
    dateText: t.dateText,
    placeText: t.placeText,
    points: [
      {
        body: 'earth',
        lon: t.lon,
        lat: t.lat,
        plate: t.plate,
        label: `${t.short} (tracks laid)`,
        fromMa: t.fromMa,
        toMa: t.toMa,
        jumpMa,
        jumpLabel: `Where the tracks were laid, about ${whenText(jumpMa)}`,
        zoom,
        icon,
      },
      {
        body: 'earth',
        lon: t.lon,
        lat: t.lat,
        plate: t.plate,
        label: `${t.short} tracks`,
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where the tracks are today',
        zoom,
        icon,
      },
    ],
    summary: t.summary,
    facts: t.facts,
    trackmakers: t.trackmakers,
    keywords: [...t.keywords, 'trackway', 'footprints', 'tracks'],
  };
}
