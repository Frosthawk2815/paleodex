// Points of interest on the globe or the Moon. Selecting one opens an information section.
// An event can have more than one point (e.g. a departure and an arrival).

export type EventPoint = {
  body: 'earth' | 'moon';
  lon: number;
  lat: number;
  label: string;
};

export type HistoryEvent = {
  id: string;
  title: string;
  // Decimal calendar year (CE) of the event.
  year: number;
  dateText: string;
  placeText: string;
  points: EventPoint[];
  summary: string[];
  facts: { label: string; value: string }[];
  // Extra words the search should match.
  keywords: string[];
};

export const EVENTS: HistoryEvent[] = [
  {
    id: 'apollo-11',
    title: 'Apollo 11 Moon landing',
    year: 1969 + (201 - 1) / 365, // 20 July 1969
    dateText: '20 July 1969',
    placeText: 'Tranquility Base, Sea of Tranquillity (Mare Tranquillitatis), the Moon',
    points: [{ body: 'moon', lon: 23.47297, lat: 0.67408, label: 'Apollo 11' }],
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
];
