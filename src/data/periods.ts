// Ages come from the ICS International Chronostratigraphic Chart (version 2026-06).
// "Ma" means millions of years ago. Colours are the official ICS chart colours.

export type Era = 'Paleozoic' | 'Mesozoic' | 'Cenozoic';

export type Period = {
  id: string;
  name: string;
  era: Era;
  startMa: number;
  endMa: number; // 0 = present day
  color: string;
  tagline: string;
  summary: string;
  highlights: string[];
  ending: string;
};

export const ERAS: { name: Era; blurb: string }[] = [
  { name: 'Paleozoic', blurb: 'Ancient life: from the first animals to the first forests' },
  { name: 'Mesozoic', blurb: 'Middle life: the age of reptiles and dinosaurs' },
  { name: 'Cenozoic', blurb: 'Recent life: the age of mammals' },
];

export const PERIODS: Period[] = [
  {
    id: 'cambrian',
    name: 'Cambrian',
    era: 'Paleozoic',
    startMa: 538.8,
    endMa: 486.85,
    color: '#7FA056',
    tagline: 'The explosion of animal life',
    summary:
      'Life was almost entirely in the sea. In a geologically short burst known as the Cambrian explosion, most of the major animal groups alive today appear in the fossil record.',
    highlights: [
      'Trilobites spread through the oceans and became the signature fossil of the era',
      'Anomalocaris, a metre-long predator with grasping limbs, hunted the seafloor',
      'Early chordates such as Pikaia hint at the ancestors of all vertebrates',
      'Exceptional fossil sites like the Burgess Shale (Canada) and Chengjiang (China) preserve soft bodies',
    ],
    ending: 'A series of extinction pulses hit trilobites and reef builders hard, closing the period.',
  },
  {
    id: 'ordovician',
    name: 'Ordovician',
    era: 'Paleozoic',
    startMa: 486.85,
    endMa: 443.1,
    color: '#009270',
    tagline: 'Seas full of new life',
    summary:
      'Warm, shallow seas covered much of the continents. Marine diversity multiplied in the Great Ordovician Biodiversification Event, and the first plants crept onto land.',
    highlights: [
      'Giant straight-shelled nautiloids were the top predators',
      'Jawless fish became more common',
      'Graptolites drifted in huge numbers and are used to date rocks today',
      'Simple plants related to liverworts began colonising land',
    ],
    ending:
      'An ice age over the southern supercontinent Gondwana drained shallow seas, causing one of the "Big Five" mass extinctions. Around 85% of marine species died out.',
  },
  {
    id: 'silurian',
    name: 'Silurian',
    era: 'Paleozoic',
    startMa: 443.1,
    endMa: 419.62,
    color: '#B3E1B6',
    tagline: 'Life gains a foothold on land',
    summary:
      'Melting ice raised sea levels and life recovered. Reefs flourished, jawed fish spread, and the first vascular plants and land animals appeared.',
    highlights: [
      'Cooksonia, one of the earliest plants with water-carrying tissue, grew a few centimetres tall',
      'Jawed fish diversified, a key step towards all later vertebrates',
      'Sea scorpions (eurypterids) grew to over two metres long',
      'Millipede-like arthropods were among the first animals to live on land',
    ],
    ending: 'No major extinction marks its end; the boundary is defined by changes in graptolite species.',
  },
  {
    id: 'devonian',
    name: 'Devonian',
    era: 'Paleozoic',
    startMa: 419.62,
    endMa: 358.86,
    color: '#CB8C37',
    tagline: 'The Age of Fishes',
    summary:
      'Fish diversified dramatically, the first forests grew, and four-limbed vertebrates (tetrapods) took their first steps.',
    highlights: [
      'Dunkleosteus, an armoured placoderm fish up to several metres long, had bony blades for jaws',
      'Tiktaalik, a fish with wrist-like fins, shows the transition from water to land',
      'Archaeopteris formed some of the first true forests',
      'Ammonoids appeared and would thrive for over 300 million years',
    ],
    ending:
      'A series of crises, including the Kellwasser and Hangenberg events, collapsed reef ecosystems in another "Big Five" mass extinction.',
  },
  {
    id: 'carboniferous',
    name: 'Carboniferous',
    era: 'Paleozoic',
    startMa: 358.86,
    endMa: 298.9,
    color: '#67A599',
    tagline: 'Coal swamps and giant insects',
    summary:
      'Vast swamp forests covered the tropics. Their buried remains became much of the coal mined today, which gave the period its name.',
    highlights: [
      'Tree-sized club mosses like Lepidodendron grew up to 30 metres tall',
      'High oxygen levels supported giants such as Meganeura, a griffinfly with a 70 cm wingspan',
      'Arthropleura, a millipede relative, grew over two metres long',
      'The first amniotes (animals that lay shelled eggs), such as Hylonomus, appeared',
    ],
    ending:
      'As the climate cooled and dried, the rainforests collapsed into isolated patches, and the continents kept merging into Pangaea.',
  },
  {
    id: 'permian',
    name: 'Permian',
    era: 'Paleozoic',
    startMa: 298.9,
    endMa: 251.902,
    color: '#F04028',
    tagline: 'One supercontinent, then the Great Dying',
    summary:
      'All major landmasses were joined as Pangaea, with harsh, dry interiors. Synapsids, the group that later gave rise to mammals, dominated life on land.',
    highlights: [
      'Dimetrodon, a sail-backed synapsid, was a top predator early in the period',
      'Gorgonopsians, sabre-toothed predators, hunted later in the period',
      'Conifers and seed ferns spread across drier landscapes',
    ],
    ending:
      'The end-Permian extinction, the worst in Earth’s history, was likely triggered by the Siberian Traps eruptions. Most marine species and around 70% of land vertebrate species vanished.',
  },
  {
    id: 'triassic',
    name: 'Triassic',
    era: 'Mesozoic',
    startMa: 251.902,
    endMa: 201.4,
    color: '#812B92',
    tagline: 'Recovery and the first dinosaurs',
    summary:
      'Life slowly rebuilt after the Great Dying. By the late Triassic the first dinosaurs, pterosaurs and mammal relatives had appeared.',
    highlights: [
      'Lystrosaurus, a stocky plant-eater, was one of the most common land animals early on',
      'Early dinosaurs like Eoraptor and Herrerasaurus appeared around 230 million years ago',
      'Pterosaurs became the first vertebrates to fly',
      'Ichthyosaurs, dolphin-shaped marine reptiles, ruled the seas',
    ],
    ending:
      'Massive volcanism as Pangaea began to split caused the end-Triassic extinction, clearing the way for dinosaurs to dominate.',
  },
  {
    id: 'jurassic',
    name: 'Jurassic',
    era: 'Mesozoic',
    startMa: 201.4,
    endMa: 143.1,
    color: '#34B2C9',
    tagline: 'Dinosaurs rule the land',
    summary:
      'Pangaea broke apart and the Atlantic Ocean began to open. Dinosaurs became the dominant land animals, and the first birds took flight.',
    highlights: [
      'Giant sauropods such as Brachiosaurus and Diplodocus were the largest land animals of their time',
      'Stegosaurus and the predator Allosaurus lived in what is now North America',
      'Archaeopteryx, around 150 million years old, links dinosaurs and birds',
      'Plesiosaurs and ichthyosaurs hunted in the seas',
    ],
    ending: 'No major mass extinction marks the boundary with the Cretaceous.',
  },
  {
    id: 'cretaceous',
    name: 'Cretaceous',
    era: 'Mesozoic',
    startMa: 143.1,
    endMa: 66.0,
    color: '#7FC64E',
    tagline: 'Flowers, giants and an asteroid',
    summary:
      'The longest period of the Phanerozoic. Flowering plants appeared and spread, sea levels were high, and dinosaurs reached their greatest variety. Its name comes from the Latin for chalk.',
    highlights: [
      'Tyrannosaurus rex and Triceratops lived at the very end of the period',
      'Flowering plants spread rapidly alongside pollinating insects',
      'Mosasaurs, huge marine lizards, were the top ocean predators',
      'Tiny plankton shells built the chalk cliffs of Dover',
    ],
    ending:
      'An asteroid struck Chicxulub, Mexico, 66 million years ago. About three-quarters of species died out, including all non-bird dinosaurs.',
  },
  {
    id: 'paleogene',
    name: 'Paleogene',
    era: 'Cenozoic',
    startMa: 66.0,
    endMa: 23.04,
    color: '#FD9A52',
    tagline: 'Mammals take over',
    summary:
      'With the dinosaurs gone, mammals diversified rapidly into the open niches. The climate started hot, then cooled as ice began forming on Antarctica.',
    highlights: [
      'Early primates and the ancestors of horses, elephants and whales appeared',
      'Whales evolved from land mammals: Pakicetus walked, Basilosaurus swam',
      'Giant flightless "terror birds" were top predators in South America',
      'A sudden warming spike 56 million years ago (the PETM) is studied as a guide to climate change',
    ],
    ending: 'No mass extinction; the period closed as the climate continued to cool.',
  },
  {
    id: 'neogene',
    name: 'Neogene',
    era: 'Cenozoic',
    startMa: 23.04,
    endMa: 2.58,
    color: '#FFE619',
    tagline: 'Grasslands and the first hominins',
    summary:
      'Grasslands spread across the continents and many modern mammal groups took shape. In Africa, the human lineage split from that of chimpanzees.',
    highlights: [
      'Megalodon, a shark estimated at 15 metres or more, patrolled the oceans',
      'Horses and other grazers adapted to open grasslands',
      'Early hominins appeared, and Australopithecus ("Lucy") walked upright about 3.2 million years ago',
      'The Isthmus of Panama joined the Americas, triggering the Great American Interchange',
    ],
    ending: 'Ice sheets began to grow across the Northern Hemisphere, starting the ice ages.',
  },
  {
    id: 'quaternary',
    name: 'Quaternary',
    era: 'Cenozoic',
    startMa: 2.58,
    endMa: 0,
    color: '#F9F97F',
    tagline: 'Ice ages and humans',
    summary:
      'The current period, defined by repeated glacial cycles. It includes the Pleistocene ice ages and the warmer Holocene, which began 11,700 years ago.',
    highlights: [
      'Woolly mammoths, sabre-toothed cats and giant ground sloths roamed the ice-age world',
      'Homo sapiens appeared in Africa around 300,000 years ago',
      'Humans spread across every continent except Antarctica',
      'Farming began around 12,000 to 10,000 years ago',
    ],
    ending: 'Still ongoing. We are living in it.',
  },
];

export const OLDEST_MA = PERIODS[0].startMa;

// The Anthropocene is a proposed series, not an official one: in 2024 geologists voted
// against adding it to the chart. It is shown as an informal last series of the Quaternary.
export const ANTHROPOCENE = {
  name: 'Anthropocene',
  color: '#9E9E9E',
  rangeLabel: 'c. 1950 CE – present',
  durationLabel: 'about 75 years',
  note: 'A proposed series for the time when human activity became a dominant force on Earth’s geology and climate, starting around 1950. Plutonium fallout from nuclear tests marks it worldwide, and Crawford Lake in Canada was put forward as its reference site. In 2024 geologists voted against making it official, but the name is widely used informally.',
};

export function getPeriod(id: string | undefined): Period | undefined {
  return PERIODS.find((p) => p.id === id);
}

function formatMa(ma: number): string {
  if (ma === 0) return 'present';
  return ma < 10 ? ma.toFixed(2) : ma.toFixed(1);
}

export function rangeLabel(p: Period): string {
  const end = p.endMa === 0 ? 'present' : `${formatMa(p.endMa)} Ma`;
  return `${formatMa(p.startMa)} – ${end}`;
}

export function durationLabel(p: Period): string {
  const my = p.startMa - p.endMa;
  return `${my < 10 ? my.toFixed(1) : Math.round(my)} million years`;
}

// Ages for series and stages keep the chart's own precision. Anything under a
// million years old reads better in years ("11,700 years ago").
function withCommas(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function years(ma: number): string {
  return withCommas(Math.round(ma * 1_000_000));
}

export function spanRange(startMa: number, endMa: number): string {
  if (startMa < 1) {
    return endMa === 0 ? `${years(startMa)} years ago – present` : `${years(startMa)} – ${years(endMa)} years ago`;
  }
  return endMa === 0 ? `${startMa} Ma – present` : `${startMa} – ${endMa} Ma`;
}

export function spanDuration(startMa: number, endMa: number): string {
  const my = startMa - endMa;
  if (my >= 1) {
    const rounded = my >= 10 ? Math.round(my) : Math.round(my * 10) / 10;
    return `${rounded} million years`;
  }
  const yrs = Number((my * 1_000_000).toPrecision(3));
  return `${withCommas(yrs)} years`;
}

// Picks black or white text for readable contrast on a period colour.
export function textOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.18 ? '#111111' : '#FFFFFF';
}
