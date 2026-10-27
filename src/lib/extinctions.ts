import { IMPACT_MA } from '@/lib/impact';

export type Cause = 'sun' | 'ice' | 'anoxia' | 'volcano' | 'asteroid';

export type Extinction = {
  id: string;
  name: string;
  // Boundary abbreviation shown on the timeline (e.g. P/T = Permian/Triassic).
  short: string;
  ma: number;
  cause: Cause;
  causeText: string;
  bigFive: boolean;
};

// The Big Five mass extinctions (the Late Devonian as its two pulses), plus the end-Cambrian.
// Ages are the ICS boundaries the events mark.
export const EXTINCTIONS: Extinction[] = [
  {
    id: 'end-cambrian',
    name: 'End-Cambrian extinctions',
    short: 'Є/O',
    ma: 486.85,
    cause: 'sun',
    causeText: 'not one of the Big Five',
    bigFive: false,
  },
  {
    id: 'end-ordovician',
    name: 'End-Ordovician extinction',
    short: 'O/S',
    ma: 445.2,
    cause: 'ice',
    causeText: 'ice age and falling sea levels',
    bigFive: true,
  },
  {
    id: 'kellwasser',
    name: 'Late Devonian extinction (Kellwasser)',
    short: 'F/F',
    ma: 372.15,
    cause: 'anoxia',
    causeText: 'oxygen-starved oceans',
    bigFive: true,
  },
  {
    id: 'hangenberg',
    name: 'Late Devonian extinction (Hangenberg)',
    short: 'D/C',
    ma: 358.86,
    cause: 'anoxia',
    causeText: 'oxygen-starved oceans',
    bigFive: true,
  },
  {
    id: 'end-permian',
    name: 'End-Permian extinction',
    short: 'P/T',
    ma: 251.902,
    cause: 'volcano',
    causeText: 'Siberian Traps eruptions',
    bigFive: true,
  },
  {
    id: 'end-triassic',
    name: 'End-Triassic extinction',
    short: 'T/J',
    ma: 201.4,
    cause: 'volcano',
    causeText: 'Central Atlantic eruptions',
    bigFive: true,
  },
  {
    id: 'k-pg',
    name: 'K/Pg extinction',
    short: 'K/Pg',
    ma: IMPACT_MA,
    cause: 'asteroid',
    causeText: 'Chicxulub asteroid impact',
    bigFive: true,
  },
];

// How far before each boundary the timeline lands, and the header shows the event.
export const EVENT_LEAD_MA = 0.3;
const WINDOW_MA = 0.6;

// The extinction whose boundary `timeMa` is just before, if any.
export function extinctionAt(timeMa: number): Extinction | undefined {
  return EXTINCTIONS.find((e) => timeMa >= e.ma && timeMa <= e.ma + WINDOW_MA);
}
