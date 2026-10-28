import { yearToMa } from '@/lib/time';

// Points of interest on the globe or the Moon. Selecting one opens an information section.
// An event can have several points, e.g. where a rock formation was laid down and where it is
// today. Each point has its own time window and can be jumped to from the information section.

export type EventPoint = {
  body: 'earth' | 'moon';
  // Present-day position. Points on Earth ride on `plate`, so in the past they move with it.
  lon: number;
  lat: number;
  plate?: number;
  label: string;
  // Shown while the timeline is between these times (millions of years ago, older first).
  fromMa: number;
  toMa: number;
  // Where the "jump" button lands, and its wording.
  jumpMa: number;
  jumpLabel: string;
  // How close the globe zooms when jumping here (Earth points).
  zoom?: number;
};

export type HistoryEvent = {
  id: string;
  kind: string;
  title: string;
  dateText: string;
  placeText: string;
  points: EventPoint[];
  summary: string[];
  facts: { label: string; value: string }[];
  // Extra words the search should match.
  keywords: string[];
};

const APOLLO_11_YEAR = 1969 + (201 - 1) / 365; // 20 July 1969
// "Today" for present-day locations: the Anthropocene, from about 1950.
const PRESENT_FROM = yearToMa(1950);

export const EVENTS: HistoryEvent[] = [
  {
    id: 'apollo-11',
    kind: 'Event',
    title: 'Apollo 11 Moon landing',
    dateText: '20 July 1969',
    placeText: 'Tranquility Base, Sea of Tranquillity (Mare Tranquillitatis), the Moon',
    points: [
      {
        body: 'moon',
        lon: 23.47297,
        lat: 0.67408,
        label: 'Apollo 11',
        fromMa: yearToMa(APOLLO_11_YEAR),
        toMa: 0,
        jumpMa: yearToMa(APOLLO_11_YEAR + 0.08),
        jumpLabel: 'Tranquility Base, 1969',
      },
    ],
    summary: [
      'On 20 July 1969 the Apollo 11 lunar module Eagle landed in the Sea of Tranquillity, a broad, flat plain of ancient lava on the Moon’s near side. Neil Armstrong radioed: “Houston, Tranquility Base here. The Eagle has landed.”',
      'About six and a half hours later Armstrong became the first person to step onto the Moon, followed by Buzz Aldrin. Michael Collins stayed in lunar orbit aboard the command module Columbia.',
      'The astronauts left a laser retroreflector on the surface, and it is still in use. Timing laser pulses bounced off it is how scientists measure the Moon drifting away from Earth by about 3.8 cm a year, the rate PaleoDex uses for the Earth–Moon distance.',
    ],
    facts: [
      { label: 'Landed', value: '20 July 1969, 20:17 UTC' },
      { label: 'First step', value: '21 July 1969, 02:56 UTC' },
      { label: 'Crew', value: 'Neil Armstrong, Buzz Aldrin, Michael Collins' },
      { label: 'Landing site', value: '0.67° N, 23.47° E' },
      { label: 'On the surface', value: '21 hours 36 minutes, about 2½ hours of it outside' },
      { label: 'Samples returned', value: '21.5 kg of lunar rock and soil' },
      { label: 'Splashdown', value: '24 July 1969, Pacific Ocean' },
    ],
    keywords: ['moon landing', 'apollo', 'armstrong', 'aldrin', 'collins', 'tranquility', 'tranquillity', 'eagle', 'nasa', 'anthropocene'],
  },
  {
    id: 'hell-creek',
    kind: 'Rock formation',
    title: 'Hell Creek Formation',
    dateText: 'About 68 to 66 million years ago (latest Cretaceous, Maastrichtian)',
    placeText: 'Montana, North Dakota, South Dakota and Wyoming, USA',
    points: [
      {
        // Type area near Jordan, Montana, on the North American plate (101 in PALEOMAP).
        body: 'earth',
        lon: -106.9,
        lat: 47.5,
        plate: 101,
        label: 'Hell Creek (forming)',
        fromMa: 68,
        toMa: 66,
        jumpMa: 66.3,
        jumpLabel: 'Where it formed, 66 million years ago',
        zoom: 4,
      },
      {
        body: 'earth',
        lon: -106.9,
        lat: 47.5,
        plate: 101,
        label: 'Hell Creek today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
      },
    ],
    summary: [
      'The Hell Creek Formation is a layer of sandstones and mudstones laid down by rivers on a warm, humid coastal lowland in the last two million years of the Cretaceous. Rivers flowing east from the young Rocky Mountains spread sand and mud across floodplains, swamps and forests.',
      'It records the final dinosaur ecosystems before the asteroid impact. Tyrannosaurus rex and Triceratops are its most famous residents, alongside Edmontosaurus, Ankylosaurus, Pachycephalosaurus, crocodilians, turtles, early mammals and flowering plants.',
      'The formation ends at the impact. In places the thin boundary clay, rich in iridium from the asteroid, sits right at its top, and the layers above it (the Fort Union Formation) are Paleocene.',
    ],
    facts: [
      { label: 'Age', value: 'About 68 to 66 million years ago' },
      { label: 'Where today', value: 'Montana, North Dakota, South Dakota, Wyoming' },
      { label: 'Named after', value: 'Hell Creek, near Jordan, Montana' },
      { label: 'Named by', value: 'Barnum Brown, 1907' },
      { label: 'Rocks', value: 'Sandstone, mudstone and thin coal (lignite)' },
      { label: 'Famous finds', value: 'The first T. rex skeleton (1902) and “Sue” (1990)' },
    ],
    keywords: [
      'hell creek',
      'formation',
      'montana',
      'dakota',
      'tyrannosaurus',
      'tyrannosaurus rex',
      't. rex',
      't rex',
      'triceratops',
      'edmontosaurus',
      'ankylosaurus',
      'pachycephalosaurus',
      'dinosaur',
      'cretaceous',
      'maastrichtian',
    ],
  },
];
