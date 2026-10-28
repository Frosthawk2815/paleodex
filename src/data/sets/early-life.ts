// Before the Carboniferous most animals were invertebrates, so these sites are mainly described with
// tiered invertebrate notes; their few vertebrates get species entries as usual.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const EARLY_LIFE: DataSet = {
  events: [
    formation({
      id: 'sirius-passet', title: 'Sirius Passet', short: 'Sirius Passet',
      dateText: 'About 518 million years ago (early Cambrian)', placeText: 'Peary Land, North Greenland',
      lon: -42.2, lat: 82.8, plate: 102, fromMa: 519, toMa: 517, jumpMa: 518, icon: 'sea',
      summary: [
        'A muddy sea floor at the edge of a deeper basin, now one of the most remote fossil sites on Earth, reached only by short summer expeditions. It is about the same age as Chengjiang.',
        'It preserves soft-bodied animals from the first burst of the Cambrian explosion, including armoured slug-like animals, early arthropod relatives and giant predatory worms.',
      ],
      facts: [
        { label: 'Age', value: 'About 518 million years ago' },
        { label: 'Where today', value: 'Peary Land, North Greenland' },
        { label: 'Rocks', value: 'Dark mudstone' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Timorebestia: the “terror beast” worm', text: 'Timorebestia koprii, described in 2024, was a swimming predator over 30 cm long with fins and jaws inside its head, a relative of today’s tiny arrow worms. Its gut holds the remains of the spiny arthropod Isoxys, and it was among the largest swimming predators of its time.' },
        { tier: 'microceleb', title: 'Halkieria', text: 'Halkieria evangelista, a slug-like animal covered in rows of small scales with a shell at each end, whose relationships to molluscs and brachiopods are still debated.' },
        { tier: 'microceleb', title: 'Lobopodians and early arthropods', text: 'Kerygmachela and Pambdelurion, lobopodians with flaps along their sides and grasping front limbs, show steps towards the first arthropods.' },
        { tier: 'pleb', title: 'Trilobites', text: 'Trilobites, including Buenellus.' },
        { tier: 'pleb', title: 'Sponges', text: 'Sponges.' },
      ],
      keywords: ['sirius passet', 'greenland', 'cambrian', 'halkieria', 'timorebestia', 'cambrian explosion'],
    }),
    formation({
      id: 'emu-bay', title: 'Emu Bay Shale', short: 'Emu Bay',
      dateText: 'About 514 million years ago (early Cambrian)', placeText: 'Kangaroo Island, South Australia',
      lon: 137.4, lat: -35.65, plate: 801, fromMa: 515, toMa: 513, jumpMa: 514, icon: 'sea',
      summary: [
        'A shallow sea floor beside an active fault scarp. It is famous for exceptionally preserved eyes and guts of early arthropods.',
      ],
      facts: [
        { label: 'Age', value: 'About 514 million years ago' },
        { label: 'Where today', value: 'Emu Bay, Kangaroo Island, South Australia' },
        { label: 'Rocks', value: 'Shale' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Anomalocaris eyes', text: 'Isolated compound eyes described in 2011, each with more than 16,000 lenses, are thought to belong to Anomalocaris. They show this early top predator had eyesight as sharp as many living insects.' },
        { tier: 'microceleb', title: 'Redlichia rex', text: 'A large trilobite up to about 15 cm long with spiny legs, named in 2020. Injured trilobites in the same rocks suggest it may have attacked other trilobites, even its own kind.' },
        { tier: 'pleb', title: 'Other arthropods', text: 'Isoxys and other small swimming arthropods.' },
      ],
      keywords: ['emu bay', 'kangaroo island', 'australia', 'cambrian', 'anomalocaris', 'eyes', 'redlichia'],
    }),
    formation({
      id: 'wheeler-shale', title: 'Wheeler Shale', short: 'Wheeler',
      dateText: 'About 507 million years ago (middle Cambrian)', placeText: 'House Range, Utah, USA',
      lon: -113.3, lat: 39.3, plate: 132, fromMa: 508, toMa: 505, jumpMa: 507, icon: 'sea',
      summary: [
        'A deep, quiet sea floor at the edge of the North American continent. Commercial quarries here produce more trilobites than anywhere else, and rarer layers hold soft-bodied animals like those of the Burgess Shale.',
      ],
      facts: [
        { label: 'Age', value: 'About 507 million years ago' },
        { label: 'Where today', value: 'Antelope Springs, House Range, Utah' },
        { label: 'Rocks', value: 'Thin-bedded shale and limestone' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Elrathia kingii', text: 'Probably the most collected trilobite in the world, a small, flat trilobite about 2–4 cm long found in huge numbers. Many are preserved complete, as moulted shells or whole animals.' },
        { tier: 'microceleb', title: 'Radiodonts', text: 'Radiodonts, relatives of Anomalocaris, including filter-feeding and sediment-sifting kinds, are known from their frontal appendages and occasional whole bodies.' },
        { tier: 'pleb', title: 'Sponges and brachiopods', text: 'Sponges and brachiopods.' },
      ],
      keywords: ['wheeler shale', 'house range', 'utah', 'cambrian', 'elrathia', 'trilobite'],
    }),
    formation({
      id: 'fezouata', title: 'Fezouata Biota', short: 'Fezouata',
      dateText: 'About 480 to 477 million years ago (Early Ordovician)', placeText: 'Zagora, Morocco',
      lon: -5.8, lat: 30.5, plate: 714, fromMa: 480, toMa: 477, jumpMa: 478, icon: 'sea',
      summary: [
        'Muddy sea floors in a cold, high-latitude sea near the South Pole, now in the Anti-Atlas of Morocco. Found by a local collector, they showed that many Burgess Shale-type animals survived into the Ordovician alongside newer groups.',
      ],
      facts: [
        { label: 'Age', value: 'About 478 million years ago' },
        { label: 'Where today', value: 'Near Zagora, Morocco' },
        { label: 'Rocks', value: 'Shale and siltstone' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Aegirocassis: a giant filter-feeding radiodont', text: 'Aegirocassis benmoulai grew to over 2 m long, the largest radiodont known. Its head appendages were fringed with fine spines for filtering plankton, like a baleen whale, and its body showed two rows of flaps on each side, clues to how arthropod limbs evolved. It is named after Mohamed Ben Moula, who found it.' },
        { tier: 'microceleb', title: 'Marrellomorphs and early horseshoe crab relatives', text: 'Large marrellomorphs with long, swept-back spines, relatives of the Burgess Shale lace crab, and early relatives of horseshoe crabs.' },
        { tier: 'pleb', title: 'Trilobites', text: 'Trilobites.' },
      ],
      keywords: ['fezouata', 'morocco', 'zagora', 'ordovician', 'aegirocassis', 'radiodont'],
    }),
    formation({
      id: 'anzaldo', title: 'Anzaldo Formation', short: 'Anzaldo',
      dateText: 'About 465 to 455 million years ago (Middle to Late Ordovician)', placeText: 'Sacabamba, Cochabamba, Bolivia',
      lon: -66.1, lat: -17.7, plate: 201, fromMa: 465, toMa: 455, jumpMa: 460, icon: 'sea',
      summary: [
        'A shallow sea near the coast of Gondwana where early jawless fish were buried in large numbers, among the oldest well-preserved vertebrates.',
      ],
      facts: [
        { label: 'Age', value: 'About 460 million years ago' },
        { label: 'Where today', value: 'Sacabamba, Bolivia' },
        { label: 'Rocks', value: 'Sandstone and siltstone' },
      ],
      invertebrates: [
        { tier: 'pleb', title: 'Brachiopods and trilobites', text: 'Brachiopods and trilobites.' },
      ],
      keywords: ['anzaldo', 'sacabamba', 'bolivia', 'ordovician', 'sacabambaspis', 'jawless fish'],
    }),
    formation({
      id: 'beechers', title: 'Beecher’s Trilobite Bed', short: 'Beecher’s Bed',
      dateText: 'About 450 million years ago (Late Ordovician)', placeText: 'Near Rome, New York, USA',
      lon: -75.4, lat: 43.2, plate: 101, fromMa: 451, toMa: 449, jumpMa: 450, icon: 'sea',
      summary: [
        'A thin layer of dark shale in the Frankfort Shale where trilobites were replaced by the mineral pyrite (fool’s gold), preserving their legs and antennae. Charles Beecher studied them in the 1890s.',
      ],
      facts: [
        { label: 'Age', value: 'About 450 million years ago' },
        { label: 'Where today', value: 'Oneida County, New York' },
        { label: 'Rocks', value: 'Black shale with pyrite' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Triarthrus with its legs', text: 'Triarthrus eatoni, a small trilobite, is preserved in pyrite with its legs, gills and antennae, which are almost never found. These fossils showed for the first time how trilobite limbs were arranged, and some females preserve eggs.' },
        { tier: 'pleb', title: 'Graptolites', text: 'Graptolites.' },
      ],
      keywords: ['beecher', 'trilobite bed', 'new york', 'ordovician', 'triarthrus', 'pyrite'],
    }),
    formation({
      id: 'herefordshire', title: 'Herefordshire Lagerstätte', short: 'Herefordshire',
      dateText: 'About 430 million years ago (Silurian, Wenlock)', placeText: 'Herefordshire, England',
      lon: -2.9, lat: 52.1, plate: 315, fromMa: 431, toMa: 429, jumpMa: 430, icon: 'ash',
      summary: [
        'Small sea-floor animals buried by volcanic ash and preserved in three dimensions inside hard nodules. They are studied by grinding a nodule away a fraction of a millimetre at a time, photographing each layer and rebuilding the animal on a computer.',
      ],
      facts: [
        { label: 'Age', value: 'About 430 million years ago' },
        { label: 'Where today', value: 'Herefordshire, England (exact site kept confidential)' },
        { label: 'Rocks', value: 'Volcanic ash with calcite nodules' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Aquilonifer: the kite-runner', text: 'Aquilonifer spinosus, a tiny arthropod named in 2016, has smaller animals attached to its body by long threads, like kites on strings. They are probably its young, an unusual form of parental care.' },
        { tier: 'microceleb', title: 'Offacolus', text: 'Offacolus kingi, a tiny early relative of horseshoe crabs and sea spiders.' },
        { tier: 'pleb', title: 'Molluscs, worms and starfish relatives', text: 'Molluscs, worms, sponges and starfish relatives, all a few millimetres to centimetres long.' },
      ],
      keywords: ['herefordshire', 'england', 'silurian', 'aquilonifer', 'offacolus', '3d'],
    }),
    formation({
      id: 'bertie', title: 'Bertie Group (Bertie Waterlime)', short: 'Bertie',
      dateText: 'About 420 million years ago (late Silurian)', placeText: 'Western New York, USA, and Ontario, Canada',
      lon: -78.9, lat: 42.9, plate: 101, fromMa: 421, toMa: 419, jumpMa: 420, icon: 'lagoon',
      summary: [
        'A salty, shallow lagoon where sea scorpions gathered and died in huge numbers, perhaps when they came to moult or mate.',
      ],
      facts: [
        { label: 'Age', value: 'About 420 million years ago' },
        { label: 'Where today', value: 'Near Buffalo, New York, and southern Ontario' },
        { label: 'Rocks', value: 'Dolomite (waterlime)' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Eurypterus remipes', text: 'A sea scorpion about 20 cm long, one of the most common eurypterid fossils, and the state fossil of New York since 1984.' },
        { tier: 'microceleb', title: 'Giant sea scorpions', text: 'Larger predatory sea scorpions such as Acutiramus and Pterygotus, with long grasping claws, some over 1 m long.' },
        { tier: 'pleb', title: 'Other arthropods', text: 'Small crustaceans and horseshoe crab relatives.' },
      ],
      keywords: ['bertie', 'waterlime', 'new york', 'silurian', 'eurypterid', 'sea scorpion'],
    }),
    formation({
      id: 'rhynie', title: 'Rhynie Chert', short: 'Rhynie',
      dateText: 'About 407 million years ago (Early Devonian)', placeText: 'Rhynie, Aberdeenshire, Scotland',
      lon: -2.85, lat: 57.33, plate: 313, fromMa: 408, toMa: 406, jumpMa: 407, icon: 'swamp',
      summary: [
        'Hot springs, like those of Yellowstone, flooded a marshy landscape with silica-rich water that turned plants and small animals into stone in fine detail. It is the best record of one of the first ecosystems on land.',
        'The plants are tiny and simple, without leaves or roots, and the animals are all arthropods: mites, springtails, spider relatives, harvestmen and centipedes.',
      ],
      facts: [
        { label: 'Age', value: 'About 407 million years ago' },
        { label: 'Where today', value: 'Rhynie, Aberdeenshire, Scotland' },
        { label: 'Rocks', value: 'Chert (silica) from hot springs' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Rhyniognatha: insect or centipede?', text: 'Rhyniognatha hirsti, known only from a tiny head with jaws, was long called the oldest insect, possibly even a winged one. A 2017 restudy found it is more likely a centipede-like myriapod. The question is not fully settled.' },
        { tier: 'microceleb', title: 'Eophalangium, the oldest harvestman', text: 'Eophalangium sheari is preserved in such detail that its reproductive organs survive, and it looks very much like living harvestmen (daddy-long-legs).' },
        { tier: 'microceleb', title: 'Rhyniella', text: 'Rhyniella praecursor, a springtail, among the oldest six-legged animals known.' },
        { tier: 'pleb', title: 'Trigonotarbids and mites', text: 'Trigonotarbids (extinct spider relatives), mites and small freshwater crustaceans.' },
      ],
      keywords: ['rhynie', 'chert', 'scotland', 'devonian', 'early land animals', 'rhyniognatha'],
    }),
    formation({
      id: 'hunsruck', title: 'Hunsrück Slate', short: 'Hunsrück',
      dateText: 'About 407 to 400 million years ago (Early Devonian)', placeText: 'Bundenbach, Rhineland-Palatinate, Germany',
      lon: 7.38, lat: 49.83, plate: 315, fromMa: 407, toMa: 400, jumpMa: 405, icon: 'sea',
      summary: [
        'Roofing slate mined since the Middle Ages, in which sea animals were replaced by pyrite. X-ray images reveal soft tissues inside the slabs, and the slate quarries have yielded thousands of starfish and brittle stars.',
      ],
      facts: [
        { label: 'Age', value: 'About 405 million years ago' },
        { label: 'Where today', value: 'Bundenbach and Gemünden, Germany' },
        { label: 'Rocks', value: 'Slate with pyrite' },
      ],
      invertebrates: [
        { tier: 'superstar', title: 'Schinderhannes: a late radiodont', text: 'Schinderhannes bartelsi, described in 2009 from a single specimen, is a radiodont living about 100 million years after the Cambrian, showing that relatives of Anomalocaris survived far longer than once thought.' },
        { tier: 'microceleb', title: 'Starfish and brittle stars', text: 'Many kinds of starfish and brittle stars, often preserved whole.' },
        { tier: 'pleb', title: 'Crinoids and arthropods', text: 'Sea lilies (crinoids), trilobites and other arthropods.' },
      ],
      keywords: ['hunsruck', 'bundenbach', 'slate', 'germany', 'devonian', 'schinderhannes', 'starfish'],
    }),
    formation({
      id: 'achanarras', title: 'Achanarras Fish Bed', short: 'Achanarras',
      dateText: 'About 390 million years ago (Middle Devonian)', placeText: 'Caithness, Scotland',
      lon: -3.6, lat: 58.5, plate: 303, fromMa: 391, toMa: 388, jumpMa: 390, icon: 'lake',
      summary: [
        'The bottom of Lake Orcadie, a huge lake in the Old Red Sandstone continent. Repeated mass deaths of fish, perhaps when the water stagnated, left layers full of complete fish.',
        'The Scottish stonemason and writer Hugh Miller described many of these fish in the 19th century in “The Old Red Sandstone”.',
      ],
      facts: [
        { label: 'Age', value: 'About 390 million years ago' },
        { label: 'Where today', value: 'Achanarras Quarry, Caithness, Scotland' },
        { label: 'Rocks', value: 'Finely layered lake mudstone (flagstone)' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Small crustaceans', text: 'Small crustaceans; invertebrates are rare in these lake beds.' }],
      keywords: ['achanarras', 'caithness', 'scotland', 'old red sandstone', 'devonian', 'hugh miller', 'fish'],
    }),
  ],
  species: [
    { id: 'sacabambaspis-janvieri', name: 'Sacabambaspis janvieri', common: 'Sacabambaspis', clade: 'pteraspidomorphi', status: 'full', ageText: 'About 465 to 455 million years ago', placeText: 'Bolivia', formations: ['anzaldo'],
      summary: ['A jawless fish about 25–35 cm long with a bony head shield, a small, always-open mouth and eyes set at the very front of the head. It probably fed by sucking up small food particles. A cheerful-looking reconstruction became an internet meme in 2023.'],
      facts: [{ label: 'Named', value: 'Pierre-Yves Gagnier, Alain Blieck and Gabriela Rodrigo, 1986' }], keywords: ['sacabambaspis', 'jawless fish', 'ordovician'] },
    { id: 'drepanaspis-gemuendenensis', name: 'Drepanaspis gemuendenensis', common: 'Drepanaspis', clade: 'pteraspidomorphi', status: 'full', ageText: 'About 405 million years ago', placeText: 'Germany', formations: ['hunsruck'],
      summary: ['A flat, broad jawless fish about 35 cm long covered in bony plates, with an upturned mouth, probably living on the sea floor.'],
      facts: [{ label: 'Named', value: 'Schlüter, 1887' }], keywords: ['drepanaspis', 'jawless fish', 'devonian'] },
    { id: 'gemuendina-stuertzi', name: 'Gemuendina stuertzi', common: 'Gemuendina', clade: 'placodermi', status: 'full', ageText: 'About 405 million years ago', placeText: 'Germany', formations: ['hunsruck'],
      summary: ['A flattened placoderm about 25 cm long with wide, wing-like pectoral fins, looking remarkably like a skate or ray, though not related to them.'],
      facts: [{ label: 'Named', value: 'Ramsay Traquair, 1903' }], keywords: ['gemuendina', 'placoderm', 'devonian'] },
    { id: 'dipterus-valenciennesi', name: 'Dipterus valenciennesi', common: 'Dipterus', clade: 'dipnoi', status: 'full', ageText: 'About 390 million years ago', placeText: 'Scotland', formations: ['achanarras'],
      summary: ['An early lungfish about 35 cm long, with tooth plates for crushing food like living lungfish but two back fins rather than one long fin.'],
      facts: [{ label: 'Named', value: 'Sedgwick and Murchison, 1828' }], keywords: ['dipterus', 'lungfish', 'devonian'] },
    { id: 'coccosteus-cuspidatus', name: 'Coccosteus cuspidatus', common: 'Coccosteus', clade: 'placodermi', status: 'full', ageText: 'About 390 million years ago', placeText: 'Scotland', formations: ['achanarras'],
      summary: ['An arthrodire placoderm about 40 cm long, a small relative of Dunkleosteus, with bony blades for teeth.'],
      facts: [{ label: 'Named', value: 'Louis Agassiz, 1841, from Hugh Miller’s material' }], keywords: ['coccosteus', 'placoderm', 'devonian'] },
    { id: 'pterichthyodes-milleri', name: 'Pterichthyodes milleri', common: 'Pterichthyodes', clade: 'placodermi', status: 'full', ageText: 'About 390 million years ago', placeText: 'Scotland', formations: ['achanarras'],
      summary: ['A boxy antiarch placoderm about 20 cm long with jointed, arm-like fins, named after Hugh Miller, who thought it looked like a winged creature.'],
      facts: [{ label: 'Named', value: 'Hugh Miller, 1841 (as Pterichthys); genus by Bleeker, 1859' }], keywords: ['pterichthyodes', 'antiarch', 'placoderm', 'devonian'] },
    { id: 'osteolepis-macrolepidotus', name: 'Osteolepis macrolepidotus', common: 'Osteolepis', clade: 'tetrapodomorpha', status: 'full', ageText: 'About 390 million years ago', placeText: 'Scotland', formations: ['achanarras'],
      summary: ['A lobe-finned fish about 20 cm long covered in shiny, enamel-coated scales, an early member of the line that led to tetrapods.'],
      facts: [{ label: 'Named', value: 'Valenciennes, 1829' }], keywords: ['osteolepis', 'lobe-finned fish', 'devonian'] },
    { id: 'cheirolepis-trailli', name: 'Cheirolepis trailli', common: 'Cheirolepis', clade: 'actinopterygii', status: 'full', ageText: 'About 390 million years ago', placeText: 'Scotland', formations: ['achanarras'],
      summary: ['One of the earliest well-known ray-finned fish, about 25–50 cm long with small, diamond-shaped scales and a large mouth, a predator that could swallow fish a good fraction of its own size.'],
      facts: [{ label: 'Named', value: 'Louis Agassiz, 1835' }], keywords: ['cheirolepis', 'ray-finned fish', 'devonian'] },
  ],
  eventNotes: {
    'harding-sandstone': {
      invertebrates: [{ tier: 'microceleb', title: 'Shallow-sea life', text: 'Brachiopods, molluscs and trace fossils of burrowing animals from a shallow, nearshore sea where some of the earliest fish lived.' }],
    },
    'soom-shale': {
      invertebrates: [{ tier: 'superstar', title: 'Onychopterella and soft-bodied survivors', text: 'Cold, low-oxygen water preserved soft parts, including the sea scorpion Onychopterella with its gut and muscles, and Promissum, a conodont known from a whole head with eyes. The fauna lived through the glaciation at the end of the Ordovician.' }],
    },
    miguasha: {
      invertebrates: [{ tier: 'microceleb', title: 'Scorpions', text: 'Rare scorpions washed into the estuary, a reminder that arthropods had colonised the land by then.' }],
    },
  },
};
