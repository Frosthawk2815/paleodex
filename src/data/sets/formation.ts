import type { PointIconKind } from '@/components/point-icon';
import type { HistoryEvent, InvertebrateNote } from '@/data/events';
import { yearToMa } from '@/lib/time';

// "Today" for present-day locations: the Anthropocene, from about 1950.
export const PRESENT_FROM = yearToMa(1950);

type FormationSpec = {
  id: string;
  title: string;
  // Short name for the globe labels, e.g. "Morrison" → "Morrison (forming)" / "Morrison today".
  short: string;
  dateText: string;
  placeText: string;
  // Present-day position and its PALEOMAP plate (found with pygplates' PlatePartitioner).
  lon: number;
  lat: number;
  plate: number;
  // When it was laid down (millions of years ago); its past marker shows in this window.
  fromMa: number;
  toMa: number;
  // Where the "where it formed" jump lands (defaults to the middle of the window).
  jumpMa?: number;
  // The setting at the time.
  icon: PointIconKind;
  zoom?: number;
  summary: string[];
  facts: { label: string; value: string }[];
  invertebrates?: InvertebrateNote[];
  groupNotes?: InvertebrateNote[];
  keywords: string[];
};

function whenText(t: number): string {
  if (t < 1) return `${Math.round(t * 1000).toLocaleString('en-US')},000 years ago`;
  return `${t >= 10 ? Math.round(t) : Number(t.toFixed(1))} million years ago`;
}

// A rock formation (or fossil bed) with two markers: where it was laid down, riding on its plate
// while it formed, and where its rocks are today (a pickaxe).
export function formation(f: FormationSpec): HistoryEvent {
  const jumpMa = f.jumpMa ?? (f.fromMa + f.toMa) / 2;
  const zoom = f.zoom ?? 4;
  return {
    id: f.id,
    kind: 'Rock formation',
    title: f.title,
    dateText: f.dateText,
    placeText: f.placeText,
    points: [
      {
        body: 'earth',
        lon: f.lon,
        lat: f.lat,
        plate: f.plate,
        label: `${f.short} (forming)`,
        fromMa: f.fromMa,
        toMa: f.toMa,
        jumpMa,
        jumpLabel: `Where it formed, about ${whenText(jumpMa)}`,
        zoom,
        icon: f.icon,
      },
      {
        body: 'earth',
        lon: f.lon,
        lat: f.lat,
        plate: f.plate,
        label: `${f.short} today`,
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom,
        icon: 'pickaxe',
      },
    ],
    summary: f.summary,
    facts: f.facts,
    invertebrates: f.invertebrates,
    groupNotes: f.groupNotes,
    keywords: [...f.keywords, 'formation', 'fossil'],
  };
}
