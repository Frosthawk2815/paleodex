import type { PointIconKind } from '@/components/point-icon';
import { SETS } from '@/data/sets';
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
  // Marker artwork: the setting at the time (e.g. 'swamp', 'dunes'), a pickaxe for rocks
  // as they are today, or a flag (the default).
  icon?: PointIconKind;
};

// Invertebrates are described at the formation, not as species, in three tiers:
//   superstar   a notable step in invertebrate evolution (e.g. giant Carboniferous insects)
//   microceleb  a short explainer about a well-known group, naming examples
//   pleb        just a mention that they were there
export type InvertebrateNote = { tier: 'superstar' | 'microceleb' | 'pleb'; title: string; text: string };

// Who made a trackway, and how sure scientists are.
export type Trackmaker = { id: string; certainty: 'known' | 'likely' | 'possible'; note: string };

export type HistoryEvent = {
  id: string;
  kind: string;
  title: string;
  dateText: string;
  placeText: string;
  points: EventPoint[];
  summary: string[];
  facts: { label: string; value: string }[];
  invertebrates?: InvertebrateNote[];
  // Very species-rich vertebrate groups (bats, rodents and the like), noted in the same three
  // tiers as invertebrates rather than given species entries.
  groupNotes?: InvertebrateNote[];
  // For trackways: the species that made the prints, if known.
  trackmakers?: Trackmaker[];
  // Extra words the search should match.
  keywords: string[];
};

const APOLLO_11_YEAR = 1969 + (201 - 1) / 365; // 20 July 1969
// "Today" for present-day locations: the Anthropocene, from about 1950.
const PRESENT_FROM = yearToMa(1950);

const BASE_EVENTS: HistoryEvent[] = [
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
        icon: 'us-flag',
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
      { label: 'Footprints', value: 'Laid 21 July 1969; with no wind or rain on the Moon, they should last for millions of years unless disturbed' },
    ],
    trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'Neil Armstrong and Buzz Aldrin left the first footprints on another world.' }],
    keywords: ['moon landing', 'apollo', 'armstrong', 'aldrin', 'collins', 'tranquility', 'tranquillity', 'eagle', 'nasa', 'anthropocene', 'footprints', 'trackway'],
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
        // Swampy, Everglades-like lowland of rivers and forests.
        icon: 'swamp',
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
        icon: 'pickaxe',
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
    invertebrates: [
      {
        tier: 'microceleb',
        title: 'Freshwater mussels',
        text: 'Hell Creek’s rivers were lined with beds of freshwater mussels (unionids), relatives of today’s river mussels. Their thick, often ridged shells are common fossils in old channel sands, and many kinds lived side by side, from smooth, rounded shells to heavily sculptured ones such as Plesielliptio and Proparreysia. Like modern mussels they filtered the water and needed clean, flowing rivers.',
      },
      {
        tier: 'microceleb',
        title: 'Leaf miners and leaf chewers',
        text: 'The insects themselves are rarely preserved, but fossil leaves from Hell Creek are covered in their work: holes and bitten edges from chewers, galls, and winding tunnels left by leaf-mining larvae. Many of these feeding marks were made by specialists tied to one kind of plant, and many disappear at the asteroid impact, showing how hard the extinction hit insects and plants together.',
      },
      {
        tier: 'pleb',
        title: 'Snails',
        text: 'Freshwater and land snails.',
      },
    ],
    keywords: [
      'hell creek',
      'formation',
      'montana',
      'dakota',
      'triceratops',
      'edmontosaurus',
      'ankylosaurus',
      'pachycephalosaurus',
      'dinosaur',
      'cretaceous',
      'maastrichtian',
    ],
  },
  {
    id: 'lance',
    kind: 'Rock formation',
    title: 'Lance Formation',
    dateText: 'About 69 to 66 million years ago (latest Cretaceous, Maastrichtian)',
    placeText: 'Eastern Wyoming, with outcrops in South Dakota, USA',
    points: [
      {
        body: 'earth',
        lon: -104.6,
        lat: 43.0,
        plate: 101,
        label: 'Lance (forming)',
        fromMa: 69,
        toMa: 66,
        jumpMa: 66.5,
        jumpLabel: 'Where it formed, about 67 million years ago',
        zoom: 4,
        icon: 'swamp',
      },
      {
        body: 'earth',
        lon: -104.6,
        lat: 43.0,
        plate: 101,
        label: 'Lance today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
        icon: 'pickaxe',
      },
    ],
    summary: [
      'The Lance Formation is a set of river sandstones, mudstones and thin coals in eastern Wyoming, named after Lance Creek in Niobrara County. Like Hell Creek, its near neighbour and twin, it was laid down by rivers on a warm, humid coastal lowland in the last few million years of the Cretaceous.',
      'It is one of the classic dinosaur rock units of North America. In 1889–1892 the collector John Bell Hatcher dug dozens of Triceratops skulls from it, and in 1908 the Sternberg family found the famous Edmontosaurus “mummy” with skin impressions preserved over much of its body. Its rich small fossils include early mammals, lizards, snakes, salamanders and fish.',
    ],
    facts: [
      { label: 'Where today', value: 'Niobrara County, Wyoming, and nearby South Dakota' },
      { label: 'Named after', value: 'Lance Creek, Wyoming' },
      { label: 'Rocks', value: 'River sandstone, mudstone and lignite' },
      { label: 'Famous finds', value: 'Hatcher’s Triceratops skulls; the Edmontosaurus “mummy” (1908)' },
    ],
    keywords: ['lance', 'lance creek', 'wyoming', 'formation', 'cretaceous', 'maastrichtian', 'hatcher', 'mummy'],
  },
  {
    id: 'scollard',
    kind: 'Rock formation',
    title: 'Scollard Formation',
    dateText: 'About 67 to 63 million years ago; its lower part is latest Cretaceous, its upper part Paleocene',
    placeText: 'Red Deer River valley, central Alberta, Canada',
    points: [
      {
        body: 'earth',
        lon: -112.95,
        lat: 51.9,
        plate: 101,
        label: 'Scollard (forming)',
        fromMa: 67,
        toMa: 66,
        jumpMa: 66.5,
        jumpLabel: 'Where it formed, about 66.5 million years ago',
        zoom: 4,
        icon: 'river',
      },
      {
        body: 'earth',
        lon: -112.95,
        lat: 51.9,
        plate: 101,
        label: 'Scollard today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
        icon: 'pickaxe',
      },
    ],
    summary: [
      'The Scollard Formation is a set of river sandstones, mudstones and coal seams exposed along the Red Deer River valley in central Alberta. It spans the end of the Cretaceous: dinosaurs are found in its lower part, and the boundary clay from the asteroid impact lies within it, below coal seams laid down in the Paleocene.',
      'Its latest-Cretaceous rocks hold the northernmost part of the same world as Hell Creek, with Tyrannosaurus rex, Triceratops and Ankylosaurus living on a cooler, wetter floodplain.',
    ],
    facts: [
      { label: 'Where today', value: 'Red Deer River valley, Alberta' },
      { label: 'Rocks', value: 'River sandstone, mudstone and coal' },
      { label: 'Famous for', value: 'The K–Pg boundary and the last dinosaurs of Canada' },
    ],
    keywords: ['scollard', 'alberta', 'red deer river', 'canada', 'formation', 'cretaceous', 'paleocene'],
  },
  {
    id: 'frenchman',
    kind: 'Rock formation',
    title: 'Frenchman Formation',
    dateText: 'About 67 to 66 million years ago (latest Cretaceous, Maastrichtian)',
    placeText: 'Frenchman River valley, southwestern Saskatchewan, Canada',
    points: [
      {
        body: 'earth',
        lon: -108.8,
        lat: 49.5,
        plate: 101,
        label: 'Frenchman (forming)',
        fromMa: 67,
        toMa: 66,
        jumpMa: 66.5,
        jumpLabel: 'Where it formed, about 66.5 million years ago',
        zoom: 4,
        icon: 'river',
      },
      {
        body: 'earth',
        lon: -108.8,
        lat: 49.5,
        plate: 101,
        label: 'Frenchman today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
        icon: 'pickaxe',
      },
    ],
    summary: [
      'The Frenchman Formation is a set of river sandstones and mudstones in southwestern Saskatchewan, around the Frenchman River valley near Eastend. It was laid down by rivers in the last million years or so of the Cretaceous, at the same time as Hell Creek further south.',
      'It is best known for “Scotty”, a Tyrannosaurus rex skeleton found in 1991 that is thought to be the heaviest T. rex known. Triceratops and other Hell Creek dinosaurs are found here too.',
    ],
    facts: [
      { label: 'Where today', value: 'Frenchman River valley, near Eastend, Saskatchewan' },
      { label: 'Rocks', value: 'River sandstone and mudstone' },
      { label: 'Famous finds', value: '“Scotty”, the heaviest known T. rex' },
    ],
    keywords: ['frenchman', 'saskatchewan', 'eastend', 'scotty', 'canada', 'formation', 'cretaceous'],
  },
  {
    id: 'ojo-alamo',
    kind: 'Rock formation',
    title: 'Ojo Alamo Formation',
    dateText: 'Latest Cretaceous to earliest Paleocene; its dinosaur-bearing Naashoibito Member is latest Cretaceous (Maastrichtian)',
    placeText: 'San Juan Basin, New Mexico, USA',
    points: [
      {
        // San Juan Basin, on the Colorado Plateau block (plate 133 in PALEOMAP).
        body: 'earth',
        lon: -108.0,
        lat: 36.2,
        plate: 133,
        label: 'Ojo Alamo (forming)',
        fromMa: 69,
        toMa: 66,
        jumpMa: 67.5,
        jumpLabel: 'Where it formed, about 68 million years ago',
        zoom: 4,
        // Rivers and floodplains.
        icon: 'river',
      },
      {
        body: 'earth',
        lon: -108.0,
        lat: 36.2,
        plate: 133,
        label: 'Ojo Alamo today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
        icon: 'pickaxe',
      },
    ],
    summary: [
      'The Ojo Alamo Formation is a set of river sandstones and mudstones in the San Juan Basin of northwestern New Mexico, named after Ojo Alamo (“cottonwood spring”). Its lower part, the Naashoibito Member, was laid down by rivers crossing a warm floodplain near the end of the Cretaceous, in the southern part of the western North American landmass.',
      'The Naashoibito Member preserves one of the southernmost latest-Cretaceous dinosaur faunas in North America, including Tyrannosaurus rex and the giant long-necked titanosaur Alamosaurus, which is named after the formation.',
      'Above it, the Kimbeto Member was deposited by rivers after the asteroid impact, in the earliest Paleocene.',
    ],
    facts: [
      { label: 'Where today', value: 'San Juan Basin, northwestern New Mexico' },
      { label: 'Parts', value: 'Naashoibito Member (Cretaceous), Kimbeto Member (Paleocene)' },
      { label: 'Rocks', value: 'River sandstone, conglomerate and mudstone' },
      { label: 'Famous finds', value: 'Alamosaurus, Tyrannosaurus rex' },
    ],
    keywords: ['ojo alamo', 'naashoibito', 'kimbeto', 'san juan basin', 'new mexico', 'alamosaurus', 'formation', 'cretaceous', 'paleocene'],
  },
  {
    id: 'nemegt',
    kind: 'Rock formation',
    title: 'Nemegt Formation',
    dateText: 'About 70 million years ago (latest Cretaceous, Maastrichtian)',
    placeText: 'Nemegt Basin, Gobi Desert, southern Mongolia',
    points: [
      {
        // Nemegt Basin, plate 628 in PALEOMAP.
        body: 'earth',
        lon: 100.9,
        lat: 43.6,
        plate: 628,
        label: 'Nemegt (forming)',
        fromMa: 71,
        toMa: 69,
        jumpMa: 70,
        jumpLabel: 'Where it formed, about 70 million years ago',
        zoom: 4,
        // River channels, floodplains and lakes.
        icon: 'river',
      },
      {
        body: 'earth',
        lon: 100.9,
        lat: 43.6,
        plate: 628,
        label: 'Nemegt today',
        fromMa: PRESENT_FROM,
        toMa: 0,
        jumpMa: 0,
        jumpLabel: 'Where it is today',
        zoom: 4,
        icon: 'pickaxe',
      },
    ],
    summary: [
      'The Nemegt Formation is a set of river sandstones and mudstones in the Gobi Desert of southern Mongolia. Unlike the dune deposits beneath it, it was laid down in a wetter time, by rivers winding across floodplains dotted with lakes and woodland.',
      'It holds one of the richest latest-Cretaceous dinosaur faunas in Asia: the tyrannosaurids Tarbosaurus and Alioramus, the duck-billed Saurolophus, the long-armed Deinocheirus and Therizinosaurus, armoured Tarchia, long-necked titanosaurs, and many small feathered dinosaurs, alongside turtles and crocodile relatives.',
      'Soviet expeditions in the 1940s and the Polish–Mongolian expeditions of the 1960s and 70s made it famous, and it is still one of the world’s great dinosaur hunting grounds.',
    ],
    facts: [
      { label: 'Where today', value: 'Nemegt Basin, Ömnögovi Province, Mongolia' },
      { label: 'Rocks', value: 'River sandstone, mudstone and conglomerate' },
      { label: 'Setting', value: 'Rivers, floodplains and lakes' },
      { label: 'Famous finds', value: 'Tarbosaurus, Deinocheirus, Therizinosaurus, Saurolophus' },
    ],
    keywords: ['nemegt', 'gobi', 'mongolia', 'deinocheirus', 'therizinosaurus', 'saurolophus', 'formation', 'cretaceous', 'maastrichtian'],
  },
];

export const EVENTS: HistoryEvent[] = [...BASE_EVENTS, ...SETS.flatMap((d) => d.events ?? [])].map((e) => {
  const extra = SETS.map((d) => d.eventNotes?.[e.id]).filter((n) => n !== undefined);
  if (extra.length === 0) return e;
  return {
    ...e,
    invertebrates: [...(e.invertebrates ?? []), ...extra.flatMap((n) => n.invertebrates ?? [])],
    groupNotes: [...(e.groupNotes ?? []), ...extra.flatMap((n) => n.groupNotes ?? [])],
  };
});
