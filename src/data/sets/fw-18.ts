// Fossil Wiki gap fill, batch 18: Jurassic–Cretaceous formations new to PaleoDex (English Chalk, Jagua,
// Sannine, Csehbánya, Eumeralla, Griman Creek, Crato, Kimmeridge Clay, Hastings Beds).
// Checked against current literature (2026).

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

const CH = ['chalk'];
const CH_PLACE = 'South-east England';
const JG = ['jagua'];
const JG_AGE = 'About 160 to 157 million years ago (Late Jurassic, Oxfordian)';
const JG_PLACE = 'Viñales, Pinar del Río, western Cuba';
const SN = ['sannine'];
const SN_AGE = 'About 98 to 94 million years ago (Late Cretaceous, Cenomanian)';
const SN_PLACE = 'Haqel, Hjoula and Nammoura, Lebanon';
const CB = ['csehbanya'];
const CB_AGE = 'About 86 to 84 million years ago (Late Cretaceous, Santonian)';
const CB_PLACE = 'Iharkút, Bakony Mountains, Hungary';
const EU = ['eumeralla'];
const EU_AGE = 'About 115 to 106 million years ago (Early Cretaceous)';
const EU_PLACE = 'Dinosaur Cove, Victoria, Australia';
const GC = ['griman-creek'];
const GC_AGE = 'About 100 to 96 million years ago (Late Cretaceous, Cenomanian)';
const GC_PLACE = 'Lightning Ridge, New South Wales, Australia';
const CR = ['crato'];
const CR_AGE = 'About 115 to 113 million years ago (Early Cretaceous, Aptian)';
const CR_PLACE = 'Chapada do Araripe, Ceará, Brazil';
const KC = ['kimmeridge-clay'];
const KC_AGE = 'About 155 to 150 million years ago (Late Jurassic)';
const KC_PLACE = 'Dorset and Wiltshire, England';
const HB = ['hastings'];

export const FW_18: DataSet = {
  events: [
    formation({
      id: 'chalk',
      title: 'Chalk Group (English Chalk)',
      short: 'Chalk',
      dateText: 'About 100 to 72 million years ago (Late Cretaceous)',
      placeText: 'South-east England, including the White Cliffs of Dover and the Sussex Downs',
      lon: 1.2,
      lat: 51.1,
      plate: 315,
      fromMa: 100,
      toMa: 72,
      jumpMa: 92,
      icon: 'sea',
      summary: [
        'Thick white limestone built from the tiny chalk plates of countless planktonic algae (coccolithophores) that settled on the floor of a warm, clear shelf sea when sea levels were very high. The White Cliffs of Dover are its best-known exposure.',
        'Victorian quarrymen found fish, sharks, turtles, ichthyosaurs, plesiosaurs, mosasaurs and pterosaurs. Its fish, such as the beardfish relative Berycopsis and the mackerel shark Cretalamna, are often preserved in three dimensions.',
      ],
      facts: [
        { label: 'Age', value: 'About 100 to 72 million years ago (Cenomanian to Campanian)' },
        { label: 'Where today', value: 'Kent, Sussex, the North and South Downs and beyond' },
        { label: 'Rocks', value: 'Chalk, made of coccolith plates' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Sea life', text: 'Sea urchins such as Micraster, belemnites, ammonites, inoceramid clams, sponges and brachiopods are common; flint nodules formed from sponge silica.' }],
      keywords: ['chalk', 'chalk group', 'white cliffs of dover', 'sussex', 'kent', 'england', 'cretaceous'],
    }),
    formation({
      id: 'jagua',
      title: 'Jagua Formation',
      short: 'Jagua',
      dateText: JG_AGE,
      placeText: JG_PLACE,
      lon: -83.7,
      lat: 22.6,
      plate: 206,
      fromMa: 161,
      toMa: 156,
      jumpMa: 159,
      icon: 'sea',
      summary: [
        'Dark limestones and shales with nodules, laid down in the young Caribbean Seaway, which opened as North and South America pulled apart and for the first time linked the Pacific with the young Atlantic.',
        'Its marine reptiles, such as the pliosaur Gallardosaurus and the plesiosaur Vinialesaurus, are close relatives of those in the Oxford Clay of England, showing animals swam through the new seaway between Europe and the Pacific.',
      ],
      facts: [
        { label: 'Age', value: 'About 159 million years ago (middle–late Oxfordian)' },
        { label: 'Where today', value: 'Sierra de los Órganos, western Cuba' },
        { label: 'Rocks', value: 'Marine limestone, shale and fossil-bearing nodules' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Ammonites', text: 'Ammonites are common and are used to date the beds.' }],
      keywords: ['jagua', 'cuba', 'pinar del rio', 'vinales', 'caribbean seaway', 'jurassic'],
    }),
    formation({
      id: 'sannine',
      title: 'Sannine Formation (Lebanese fish beds)',
      short: 'Sannine',
      dateText: SN_AGE,
      placeText: SN_PLACE,
      lon: 35.7,
      lat: 34.1,
      plate: 508,
      fromMa: 98,
      toMa: 93,
      jumpMa: 96,
      icon: 'lagoon',
      summary: [
        'Finely layered limestones from quiet sea basins on the edge of the Tethys Ocean, famous for exquisitely preserved fish, which have been collected since at least the Middle Ages.',
        'Besides thousands of fish, sharks, rays, octopuses and shrimps, it holds early snakes with legs, like Eupodophis, swimming lizards related to mosasaurs and snakes, and pterosaurs.',
      ],
      facts: [
        { label: 'Age', value: 'About 96 million years ago (Cenomanian)' },
        { label: 'Where today', value: 'Mount Lebanon, north of Beirut' },
        { label: 'Rocks', value: 'Thin-bedded limestone' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Shrimps and octopuses', text: 'Shrimps, lobsters and some of the oldest octopus fossils, preserved with ink sacs.' }],
      keywords: ['sannine', 'haqel', 'hjoula', 'nammoura', 'lebanon', 'fish beds', 'cretaceous', 'eupodophis'],
    }),
    formation({
      id: 'csehbanya',
      title: 'Csehbánya Formation (Iharkút)',
      short: 'Csehbánya',
      dateText: CB_AGE,
      placeText: CB_PLACE,
      lon: 17.6,
      lat: 47.2,
      plate: 308,
      fromMa: 86,
      toMa: 84,
      jumpMa: 85,
      icon: 'river',
      summary: [
        'River and floodplain deposits uncovered in an open-cast bauxite mine at Iharkút, found in 2000 by Attila Ősi. At the time, Hungary was part of an island in the European archipelago of the Tethys Ocean.',
        'It is one of the richest Late Cretaceous sites in Europe, with the nodosaur Hungarosaurus, the ornithopod Mochlodon, the possible ceratopsian Ajkaceratops, the pterosaur Bakonydraco, the freshwater mosasaur Pannoniasaurus, crocodiles, turtles, lizards, frogs and fish.',
      ],
      facts: [
        { label: 'Age', value: 'About 85 million years ago (Santonian)' },
        { label: 'Where today', value: 'Bakony Mountains, western Hungary' },
        { label: 'Rocks', value: 'River channel sandstones and floodplain clays' },
      ],
      keywords: ['csehbanya', 'csehbánya', 'iharkut', 'iharkút', 'bakony', 'hungary', 'cretaceous', 'hungarosaurus'],
    }),
    formation({
      id: 'eumeralla',
      title: 'Eumeralla Formation (Dinosaur Cove)',
      short: 'Eumeralla',
      dateText: EU_AGE,
      placeText: EU_PLACE,
      lon: 143.4,
      lat: -38.8,
      plate: 801,
      fromMa: 118,
      toMa: 104,
      jumpMa: 110,
      icon: 'river',
      summary: [
        'River deposits from a rift valley between Australia and Antarctica, when this region lay inside the Antarctic Circle. Animals lived through weeks of winter darkness, with cool temperatures and probably seasonal frost.',
        'At Dinosaur Cove, volunteers tunnelled into sea cliffs to dig out the fossils. Its animals include small, big-eyed ornithopods like Leaellynasaura, small theropods, early mammals, turtles and lungfish.',
      ],
      facts: [
        { label: 'Age', value: 'About 110 million years ago (late Aptian to Albian)' },
        { label: 'Where today', value: 'Otway coast, Victoria' },
        { label: 'Back then', value: 'Near the South Pole, around 70°S' },
      ],
      keywords: ['eumeralla', 'dinosaur cove', 'otway', 'victoria', 'australia', 'polar dinosaurs', 'cretaceous', 'leaellynasaura'],
    }),
    formation({
      id: 'griman-creek',
      title: 'Griman Creek Formation (Lightning Ridge)',
      short: 'Griman Creek',
      dateText: GC_AGE,
      placeText: GC_PLACE,
      lon: 148.0,
      lat: -29.4,
      plate: 801,
      fromMa: 100,
      toMa: 96,
      jumpMa: 98,
      icon: 'river',
      summary: [
        'Coastal river and floodplain deposits near the edge of the inland Eromanga Sea. Many of its bones and teeth have been turned into precious opal, and they are found by opal miners rather than palaeontologists.',
        'It has the richest early monotreme fauna anywhere, including Steropodon, Kollikodon and Opalios, along with small ornithopods, the theropod “Lightning Claw”, turtles, crocodiles, lungfish and the ornithopod Fostoria.',
      ],
      facts: [
        { label: 'Age', value: 'About 98 million years ago (Cenomanian)' },
        { label: 'Where today', value: 'Lightning Ridge opal fields, New South Wales' },
        { label: 'Special', value: 'Fossils preserved as opal' },
      ],
      keywords: ['griman creek', 'lightning ridge', 'opal', 'new south wales', 'australia', 'monotremes', 'cretaceous', 'steropodon'],
    }),
    formation({
      id: 'crato',
      title: 'Crato Formation (Santana Group)',
      short: 'Crato',
      dateText: CR_AGE,
      placeText: CR_PLACE,
      lon: -39.4,
      lat: -7.2,
      plate: 201,
      fromMa: 115,
      toMa: 113,
      jumpMa: 114,
      icon: 'lagoon',
      summary: [
        'Finely layered limestone from a salty lake or lagoon, quarried as paving stone around Nova Olinda and Santana do Cariri. It lies just below the Romualdo Formation, whose nodules hold 3D fossils.',
        'It is one of the world’s great fossil sites for insects, and also preserves feathered birds, pterosaurs with crests and soft tissues, frogs, lizards, the four-legged snake-like Tetrapodophis and huge numbers of the small fish Dastilbe.',
        'Many Crato fossils have been illegally exported from Brazil, and some important specimens have been returned in recent years.',
      ],
      facts: [
        { label: 'Age', value: 'About 114 million years ago (late Aptian)' },
        { label: 'Where today', value: 'Araripe Basin, north-eastern Brazil' },
        { label: 'Rocks', value: 'Laminated limestone' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Insects and spiders', text: 'Hundreds of species of insects, including dragonflies, cockroaches, crickets and mayflies, and spiders and scorpions.' }],
      keywords: ['crato', 'santana group', 'araripe', 'nova olinda', 'ceara', 'brazil', 'cretaceous', 'pterosaurs'],
    }),
    formation({
      id: 'kimmeridge-clay',
      title: 'Kimmeridge Clay Formation',
      short: 'Kimmeridge Clay',
      dateText: KC_AGE,
      placeText: KC_PLACE,
      lon: -2.1,
      lat: 50.6,
      plate: 315,
      fromMa: 157,
      toMa: 145,
      jumpMa: 152,
      icon: 'sea',
      summary: [
        'Dark, oily mudstones laid down in a warm, quiet sea; the rock is the main source of North Sea oil. Its seas were ruled by giant pliosaurs, such as the huge skull found at Kimmeridge Bay in 2023.',
        'It also holds ichthyosaurs, plesiosaurs, metriorhynchid sea crocodiles, sharks, fish and pterosaurs, many collected by Steve Etches and shown in the Etches Collection museum at Kimmeridge.',
      ],
      facts: [
        { label: 'Age', value: 'About 157 to 145 million years ago (Kimmeridgian to early Tithonian)' },
        { label: 'Where today', value: 'Jurassic Coast of Dorset, and inland to Yorkshire' },
        { label: 'Seen at', value: 'The Etches Collection, Kimmeridge' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Ammonites', text: 'Ammonites, often crushed flat, and oysters and other shellfish.' }],
      keywords: ['kimmeridge clay', 'kimmeridge', 'dorset', 'jurassic coast', 'etches collection', 'england', 'jurassic', 'pliosaur'],
    }),
    formation({
      id: 'hastings',
      title: 'Hastings Beds (Wealden Group)',
      short: 'Hastings',
      dateText: 'About 142 to 133 million years ago (Early Cretaceous, Berriasian–Valanginian)',
      placeText: 'Hastings and the Weald of Sussex and Kent, England',
      lon: 0.6,
      lat: 50.9,
      plate: 315,
      fromMa: 142,
      toMa: 133,
      jumpMa: 137,
      icon: 'river',
      summary: [
        'River sands and clays laid down on a wide floodplain, the older part of the Wealden. Some of the first dinosaur fossils ever studied, including bones collected by Gideon Mantell in the 1820s and 1830s, came from these rocks.',
        'Its animals include iguanodonts, the dryosaurid Valdosaurus, armoured dinosaurs, sauropods like Haestasaurus, crocodiles, turtles and early mammals.',
      ],
      facts: [
        { label: 'Age', value: 'About 137 million years ago (Valanginian)' },
        { label: 'Where today', value: 'Hastings, Tunbridge Wells and the High Weald' },
        { label: 'History', value: 'Gideon Mantell’s collecting ground' },
      ],
      keywords: ['hastings beds', 'hastings', 'wealden', 'tunbridge wells', 'sussex', 'mantell', 'england', 'cretaceous'],
    }),
  ],
  species: [
    // ---- Chalk ----
    { id: 'cretalamna-appendiculata', name: 'Cretalamna appendiculata', common: 'Cretalamna', clade: 'lamniformes', status: 'full', ageText: 'About 100 to 46 million years ago (Late Cretaceous to Eocene)', placeText: 'Worldwide; first described from the English Chalk', formations: [...CH, 'niobrara'],
      summary: ['A mackerel shark, perhaps about 2 to 3 m long (estimates vary), known mostly from teeth found worldwide. It is thought to be the ancestor of the otodontid line that led to the giant megalodon. The name now covers several closely related species.'],
      facts: [{ label: 'Named', value: 'Louis Agassiz, 1835 (as Lamna appendiculata); genus by Glikman, 1958' }],
      keywords: ['cretalamna', 'otodontid', 'shark', 'megalodon ancestor', 'chalk', 'cretaceous'] },
    { id: 'berycopsis-elegans', name: 'Berycopsis elegans', common: 'Berycopsis', clade: 'actinopterygii', status: 'full', ageText: 'About 100 to 90 million years ago (Late Cretaceous)', placeText: CH_PLACE, formations: CH,
      summary: ['A deep-bodied spiny-finned fish, usually placed with the beardfishes, a small group that still lives in deep seas today. Relatives are known from Germany and Lebanon.'],
      facts: [{ label: 'Named', value: 'Frederick Dixon, 1850' }],
      keywords: ['berycopsis', 'beardfish', 'polymixiid', 'fish', 'chalk', 'cretaceous'] },
    { id: 'aulolepis-typus', name: 'Aulolepis typus', common: 'Aulolepis', clade: 'actinopterygii', status: 'full', ageText: 'About 97 to 90 million years ago (Late Cretaceous)', placeText: 'England and Germany', formations: CH,
      summary: ['A small sea fish, one of the early spiny-finned fishes, from the English Chalk and its German equivalent.'],
      facts: [{ label: 'Named', value: 'Louis Agassiz, 1844' }],
      keywords: ['aulolepis', 'ctenothrissiform', 'fish', 'chalk', 'cretaceous'] },
    { id: 'lonchodraco-giganteus', name: 'Lonchodraco giganteus', common: 'Lonchodraco', clade: 'pterosauria', status: 'full', ageText: 'About 95 to 90 million years ago (Late Cretaceous)', placeText: 'Burham, Kent, England', formations: CH,
      summary: ['A toothed pterosaur with a blade-like crest under the tips of its jaws, known from jaw pieces found in the Kent chalk in the 1840s. It was first called Pterodactylus giganteus, one of the first pterosaurs named from Britain.'],
      facts: [{ label: 'Named', value: 'James Bowerbank, 1846 (as Pterodactylus giganteus); genus by Taissa Rodrigues and Alexander Kellner, 2013' }],
      keywords: ['lonchodraco', 'lonchodraconid', 'pterosaur', 'chalk', 'kent', 'cretaceous'] },

    // ---- Jagua ----
    { id: 'gallardosaurus-iturraldei', name: 'Gallardosaurus iturraldei', common: 'Gallardosaurus', clade: 'sauropterygia', status: 'full', ageText: JG_AGE, placeText: JG_PLACE, formations: JG,
      summary: ['A pliosaur, a short-necked, big-headed marine reptile, known from a skull and neck vertebrae. It is very close to Peloneustes from the Oxford Clay of England, showing pliosaurs swam through the Caribbean Seaway.'],
      facts: [{ label: 'Named', value: 'Zulma Gasparini, 2009' }],
      keywords: ['gallardosaurus', 'pliosaur', 'plesiosaur', 'cuba', 'jurassic'] },
    { id: 'vinialesaurus-caroli', name: 'Vinialesaurus caroli', common: 'Vinialesaurus', clade: 'sauropterygia', status: 'full', ageText: JG_AGE, placeText: JG_PLACE, formations: JG,
      summary: ['A long-necked cryptoclidid plesiosaur known from the front of a skull and the first neck vertebrae. It was first named as a kind of Cryptoclidus in 1949 and got its own genus in 2002.'],
      facts: [{ label: 'Named', value: 'Carlos de la Torre and Luis Rojas, 1949; genus by Zulma Gasparini and colleagues, 2002' }],
      keywords: ['vinialesaurus', 'cryptoclidid', 'plesiosaur', 'cuba', 'jurassic'] },
    { id: 'cacibupteryx-caribensis', name: 'Cacibupteryx caribensis', common: 'Cacibupteryx', clade: 'rhamphorhynchidae', status: 'full', ageText: JG_AGE, placeText: JG_PLACE, formations: JG,
      summary: ['A long-tailed rhamphorhynchid pterosaur known from a partial skull, one of the few Jurassic pterosaurs from the Americas.'],
      facts: [{ label: 'Named', value: 'Zulma Gasparini, Marta Fernández and Marcelo de la Fuente, 2004' }],
      keywords: ['cacibupteryx', 'rhamphorhynchid', 'pterosaur', 'cuba', 'jurassic'] },
    { id: 'nesodactylus-hesperius', name: 'Nesodactylus hesperius', common: 'Nesodactylus', clade: 'rhamphorhynchidae', status: 'full', ageText: JG_AGE, placeText: JG_PLACE, formations: JG,
      summary: ['A long-tailed rhamphorhynchid pterosaur known from a partial skeleton found in a limestone nodule in 1918 and named in 1969. Its name means “island finger”.'],
      facts: [{ label: 'Named', value: 'Edwin Colbert, 1969' }],
      keywords: ['nesodactylus', 'rhamphorhynchid', 'pterosaur', 'cuba', 'jurassic'] },
    { id: 'notoemys-oxfordiensis', name: 'Notoemys oxfordiensis', common: 'Notoemys', aka: ['Caribemys'], akaNote: 'First named Caribemys oxfordiensis in 2001 and later moved to Notoemys.', clade: 'pleurodira', status: 'full', ageText: JG_AGE, placeText: JG_PLACE, formations: JG,
      summary: ['An early side-necked turtle, a platychelyid, one of the oldest relatives of the side-necked turtles that live in South America, Africa and Australia today. Other Notoemys species come from Argentina and Colombia.'],
      facts: [{ label: 'Named', value: 'Marcelo de la Fuente and Manuel Iturralde-Vinent, 2001 (as Caribemys)' }],
      keywords: ['notoemys', 'caribemys', 'platychelyid', 'side-necked turtle', 'cuba', 'jurassic'] },

    // ---- Sannine ----
    { id: 'eupodophis-descouensi', name: 'Eupodophis descouensi', common: 'Eupodophis', clade: 'serpentes', status: 'full', ageText: SN_AGE, placeText: 'Al-Nammoura, Lebanon', formations: SN,
      summary: [
        'An 85 cm sea snake with two tiny hind legs about 2 cm long, a famous “snake with legs”. In 2011 X-ray imaging revealed a second leg hidden inside the rock, showing it had knees, ankles and shin bones.',
        'Its legs were probably useless leftovers from its lizard ancestors, not a stage on the way to growing legs.',
      ],
      facts: [
        { label: 'Named', value: 'Jean-Claude Rage and François Escuillié, 2000' },
        { label: 'Seen at', value: 'MIM Museum, Beirut' },
      ],
      keywords: ['eupodophis', 'snake with legs', 'simoliophiid', 'snake', 'lebanon', 'cretaceous'] },
    { id: 'aphanizocnemus-libanensis', name: 'Aphanizocnemus libanensis', common: 'Aphanizocnemus', clade: 'squamata', status: 'full', ageText: SN_AGE, placeText: 'Lebanon', formations: SN,
      summary: ['A small sea-going lizard about 30 cm long, half of it a flattened tail for swimming, with paddle-like hands and feet. It is usually placed with the dolichosaurs, close to snakes and mosasaurs.'],
      facts: [{ label: 'Named', value: 'Cristiano Dal Sasso and Giovanni Pinna, 1997' }],
      keywords: ['aphanizocnemus', 'dolichosaur', 'marine lizard', 'lebanon', 'cretaceous'] },
    { id: 'pontosaurus-kornhuberi', name: 'Pontosaurus kornhuberi', common: 'Pontosaurus', clade: 'squamata', status: 'full', ageText: SN_AGE, placeText: 'Haqel, Lebanon', formations: SN,
      summary: ['A long-bodied swimming lizard, a dolichosaur related to mosasaurs and snakes. The first species was found on the island of Hvar in Croatia; this one, from Lebanon, is known from a beautiful complete skeleton with traces of soft tissue.'],
      facts: [{ label: 'Genus named', value: 'Dragutin Gorjanović-Kramberger, 1892' }],
      keywords: ['pontosaurus', 'dolichosaur', 'marine lizard', 'lebanon', 'cretaceous'] },
    { id: 'anguillavus-quadripinnis', name: 'Anguillavus quadripinnis', common: 'Anguillavus', clade: 'actinopterygii', status: 'full', ageText: SN_AGE, placeText: 'Haqel, Lebanon', formations: SN,
      summary: ['One of the earliest eels, about 20 cm long. Unlike modern eels it still had small pelvic fins, which gives its species name, “four fins”. Its name means “eel ancestor”.'],
      facts: [{ label: 'Named', value: 'Oliver Perry Hay, 1903' }],
      keywords: ['anguillavus', 'eel', 'anguilliform', 'fish', 'lebanon', 'cretaceous'] },
    { id: 'charitopsis-spinosus', name: 'Charitopsis spinosus', common: 'Charitopsis', clade: 'gonorynchiformes', status: 'full', ageText: SN_AGE, placeText: 'Lebanon', formations: SN,
      summary: ['A small sea fish related to the living beaked salmon, Gonorynchus.'],
      facts: [{ label: 'Named', value: 'Mireille Gayet, 1993' }],
      keywords: ['charitopsis', 'gonorynchid', 'fish', 'lebanon', 'cretaceous'] },
    { id: 'microtuban-altivolans', name: 'Microtuban altivolans', common: 'Microtuban', clade: 'pterosauria', status: 'full', ageText: SN_AGE, placeText: 'Hjoula, Lebanon', formations: SN,
      summary: ['A small, toothless azhdarchoid pterosaur known from a partial skeleton with unusually short wing fingers. It was found in rocks laid down far from shore, suggesting it could fly long distances over the sea.'],
      facts: [{ label: 'Named', value: 'Ross Elgin and Eberhard Frey, 2011' }],
      keywords: ['microtuban', 'azhdarchoid', 'pterosaur', 'lebanon', 'cretaceous'] },

    // ---- Csehbánya ----
    { id: 'pannoniasaurus-inexpectatus', name: 'Pannoniasaurus inexpectatus', common: 'Pannoniasaurus', clade: 'mosasauridae', status: 'full', ageText: CB_AGE, placeText: CB_PLACE, formations: CB,
      summary: ['A mosasaur up to about 6 m long that lived in rivers and lakes, not the sea, the first freshwater mosasaur known. Its species name means “unexpected”. It was probably the top predator in Iharkút’s waters.'],
      facts: [{ label: 'Named', value: 'László Makádi, Michael Caldwell and Attila Ősi, 2012' }],
      keywords: ['pannoniasaurus', 'tethysaurine', 'freshwater mosasaur', 'mosasaur', 'hungary', 'cretaceous'] },
    { id: 'ajkaceratops-kozmai', name: 'Ajkaceratops kozmai', common: 'Ajkaceratops', clade: 'ceratopsia', status: 'full', ageText: CB_AGE, placeText: CB_PLACE, formations: CB,
      summary: [
        'A small, parrot-beaked dinosaur described in 2010 as the first ceratopsian from Europe, related to Asian forms that may have reached Europe by island-hopping.',
        'Later studies questioned whether it was a ceratopsian at all, but more complete skull material described in 2026 supports its placement as one.',
      ],
      facts: [{ label: 'Named', value: 'Attila Ősi and colleagues, 2010' }],
      keywords: ['ajkaceratops', 'ceratopsian', 'europe', 'hungary', 'cretaceous'] },
    { id: 'bakonydraco-galaczi', name: 'Bakonydraco galaczi', common: 'Bakonydraco', clade: 'azhdarchidae', status: 'full', ageText: CB_AGE, placeText: CB_PLACE, formations: CB,
      summary: ['A toothless azhdarchoid pterosaur with a wingspan of perhaps about 3.5 m, known from a complete lower jaw and many other jaw pieces. It may have eaten fruit or small prey.'],
      facts: [{ label: 'Named', value: 'Attila Ősi, David Weishampel and Coralia Jianu, 2005' }],
      keywords: ['bakonydraco', 'azhdarchid', 'pterosaur', 'hungary', 'cretaceous'] },

    // ---- Eumeralla ----
    { id: 'leaellynasaura-amicagraphica', name: 'Leaellynasaura amicagraphica', common: 'Leaellynasaura', clade: 'elasmaria', status: 'full', ageText: EU_AGE, placeText: EU_PLACE, formations: EU,
      summary: [
        'A small, two-legged plant-eater with one of the longest tails relative to its body of any dinosaur, about three times its body length, perhaps wrapped around itself for warmth.',
        'It lived inside the Antarctic Circle. Its large eye sockets and brain’s vision centres have been suggested to help it see during the long polar winter, though this is debated. It is named after Leaellyn Rich, daughter of its discoverers.',
      ],
      facts: [{ label: 'Named', value: 'Thomas Rich and Patricia Vickers-Rich, 1989' }],
      keywords: ['leaellynasaura', 'elasmarian', 'ornithopod', 'polar dinosaur', 'dinosaur cove', 'victoria', 'cretaceous'] },
    { id: 'kryoryctes-cadburyi', name: 'Kryoryctes cadburyi', common: 'Kryoryctes', clade: 'monotremata', status: 'full', ageText: 'About 106 million years ago (Early Cretaceous)', placeText: EU_PLACE, formations: EU,
      summary: ['An early monotreme known from one upper arm bone, which is strong like an echidna’s and suggests it dug. Its name means “cold digger”, and its species name honours the Cadbury company, which supported the dig.'],
      facts: [{ label: 'Named', value: 'Peter Pridmore and colleagues, 2005' }],
      keywords: ['kryoryctes', 'monotreme', 'mammal', 'dinosaur cove', 'victoria', 'cretaceous'] },

    // ---- Griman Creek ----
    { id: 'steropodon-galmani', name: 'Steropodon galmani', common: 'Steropodon', clade: 'monotremata', status: 'full', ageText: GC_AGE, placeText: GC_PLACE, formations: GC,
      summary: ['A platypus-like monotreme known from a jaw with three teeth, preserved as opal. Described in 1985, it was the first Mesozoic mammal found in Australia, and with a jaw about 3 cm long it was large for a mammal of its time.'],
      facts: [
        { label: 'Named', value: 'Michael Archer, Tim Flannery, Alex Ritchie and Ralph Molnar, 1985' },
        { label: 'Seen at', value: 'Australian Museum, Sydney' },
      ],
      keywords: ['steropodon', 'monotreme', 'platypus', 'opal', 'lightning ridge', 'cretaceous'] },
    { id: 'opalios-splendens', name: 'Opalios splendens', common: 'Opalios', clade: 'monotremata', status: 'full', ageText: GC_AGE, placeText: GC_PLACE, formations: GC,
      summary: ['A monotreme named in 2024 from a piece of opalised jaw, one of three new monotremes named that year from Lightning Ridge, showing early egg-laying mammals were surprisingly varied.'],
      facts: [{ label: 'Named', value: 'Tim Flannery and colleagues, 2024' }],
      keywords: ['opalios', 'monotreme', 'opal', 'lightning ridge', 'cretaceous'] },
    { id: 'weewarrasaurus-pobeni', name: 'Weewarrasaurus pobeni', common: 'Weewarrasaurus', clade: 'iguanodontia', status: 'full', ageText: GC_AGE, placeText: 'Wee Warra opal field, Lightning Ridge, New South Wales, Australia', formations: GC,
      summary: ['A small, dog-sized ornithopod known from a jaw preserved in opal. It was found in a bag of rough opal bought by Mike Poben, who gave it to scientists; it is named after him and the Wee Warra opal field.'],
      facts: [{ label: 'Named', value: 'Phil Bell and colleagues, 2018' }],
      keywords: ['weewarrasaurus', 'ornithopod', 'opal', 'lightning ridge', 'cretaceous'] },

    // ---- Crato ----
    { id: 'tupandactylus-imperator', name: 'Tupandactylus imperator', common: 'Tupandactylus', clade: 'tapejaridae', status: 'full', ageText: CR_AGE, placeText: CR_PLACE, formations: CR,
      summary: [
        'A tapejarid pterosaur with an enormous sail-like head crest many times taller than its skull, supported by bony rods. A 2022 study of an almost complete specimen found two kinds of fuzzy filaments, including branched ones like simple feathers, with pigment granules.',
        'A second, smaller-crested species, T. navigans, may be the other sex of the same species.',
      ],
      facts: [{ label: 'Named', value: 'Diógenes Campos and Alexander Kellner, 1997 (as Tapejara imperator); genus 2007' }],
      related: [{ id: 'tapejara-wellnhoferi', note: 'Its smaller relative from the Romualdo Formation.' }],
      keywords: ['tupandactylus', 'tapejarid', 'pterosaur', 'crest', 'pycnofibres', 'crato', 'brazil', 'cretaceous'] },
    { id: 'arthurdactylus-conandoylei', name: 'Arthurdactylus conandoylei', common: 'Arthurdactylus', clade: 'pterosauria', status: 'full', ageText: CR_AGE, placeText: CR_PLACE, formations: CR,
      summary: ['A fish-eating ornithocheirid pterosaur with a wingspan of about 4.5 m, known from a skeleton without its skull. It is named after Arthur Conan Doyle, whose novel The Lost World has pterosaurs living on a South American plateau.'],
      facts: [{ label: 'Named', value: 'Eberhard Frey and David Martill, 1994' }],
      keywords: ['arthurdactylus', 'ornithocheirid', 'pterosaur', 'conan doyle', 'lost world', 'crato', 'brazil', 'cretaceous'] },
    { id: 'ludodactylus-sibbicki', name: 'Ludodactylus sibbicki', common: 'Ludodactylus', clade: 'anhangueridae', status: 'full', ageText: CR_AGE, placeText: CR_PLACE, formations: CR,
      summary: ['An anhanguerid pterosaur with both teeth and a Pteranodon-like crest at the back of its head, a combination seen on many toy pterosaurs but unknown in real ones until it was found, which gives its name, “toy finger”. The only skull has a plant leaf caught in its jaws.'],
      facts: [{ label: 'Named', value: 'Eberhard Frey and colleagues, 2003' }],
      keywords: ['ludodactylus', 'anhanguerid', 'pterosaur', 'crest', 'crato', 'brazil', 'cretaceous'] },
    { id: 'lacusovagus-magnificens', name: 'Lacusovagus magnificens', common: 'Lacusovagus', clade: 'pterosauria', status: 'full', ageText: CR_AGE, placeText: CR_PLACE, formations: CR,
      summary: ['A large toothless chaoyangopterid pterosaur with a wide skull and a wingspan perhaps over 4 m, much larger than its Chinese relatives. Its name means “lake wanderer”.'],
      facts: [{ label: 'Named', value: 'Mark Witton, 2008' }],
      keywords: ['lacusovagus', 'chaoyangopterid', 'azhdarchoid', 'pterosaur', 'crato', 'brazil', 'cretaceous'] },
    { id: 'tetrapodophis-amplectus', name: 'Tetrapodophis amplectus', common: 'Tetrapodophis', clade: 'squamata', status: 'full', ageText: CR_AGE, placeText: CR_PLACE, formations: CR,
      summary: [
        'A small, long-bodied reptile with four tiny limbs, about 20 cm long, described in 2015 as a four-legged snake.',
        'Caution: later study argued it is a dolichosaur, a swimming lizard related to mosasaurs, rather than a snake. The only specimen is in a private collection in Germany, and the circumstances of its export from Brazil are controversial, which has limited further research.',
      ],
      facts: [{ label: 'Named', value: 'David Martill, Helmut Tischlinger and Nicholas Longrich, 2015' }],
      keywords: ['tetrapodophis', 'four-legged snake', 'dolichosaur', 'squamate', 'crato', 'brazil', 'cretaceous'] },

    // ---- Kimmeridge Clay ----
    { id: 'plesiosuchus-manselii', name: 'Plesiosuchus manselii', common: 'Plesiosuchus', clade: 'thalattosuchia', status: 'full', ageText: KC_AGE, placeText: 'Kimmeridge, Dorset, England', formations: KC,
      summary: ['A large metriorhynchid sea crocodile, perhaps around 6 to 7 m long, with a short, deep skull and big, serrated teeth for hunting large prey, including other marine reptiles. It had flippers and a fish-like tail fin.'],
      facts: [{ label: 'Named', value: 'John Hulke, 1870 (as Steneosaurus manselii); genus by Richard Owen, 1884' }],
      keywords: ['plesiosuchus', 'metriorhynchid', 'sea crocodile', 'thalattosuchian', 'kimmeridge', 'dorset', 'jurassic'] },
    { id: 'torvoneustes-carpenteri', name: 'Torvoneustes carpenteri', common: 'Torvoneustes', clade: 'thalattosuchia', status: 'full', ageText: KC_AGE, placeText: 'Westbury, Wiltshire, England', formations: KC,
      summary: ['A metriorhynchid sea crocodile with blunt, rounded teeth, perhaps for crushing hard-shelled prey such as turtles and ammonites. It was moved between three genera before getting its own in 2010. Its name means “savage swimmer”.'],
      facts: [{ label: 'Named', value: 'Wilkinson and colleagues, 2008 (as Dakosaurus carpenteri); genus by Marco Andrade and colleagues, 2010' }],
      keywords: ['torvoneustes', 'metriorhynchid', 'sea crocodile', 'thalattosuchian', 'kimmeridge', 'wiltshire', 'jurassic'] },

    // ---- Hastings ----
    { id: 'haestasaurus-becklesii', name: 'Haestasaurus becklesii', common: 'Haestasaurus', clade: 'macronaria', status: 'full', ageText: 'About 140 to 135 million years ago (Early Cretaceous)', placeText: 'Hastings, East Sussex, England', formations: HB,
      summary: ['A macronarian sauropod known from a forearm found in 1852 with a patch of fossil skin of small, six-sided scales, the first dinosaur skin ever found. Long filed under Pelorosaurus, it got its own genus in 2015, named after Haesta, the chief whose people gave Hastings its name.'],
      facts: [{ label: 'Named', value: 'Gideon Mantell, 1852 (as Pelorosaurus becklesii); genus by Paul Upchurch, Philip Mannion and Michael Taylor, 2015' }],
      keywords: ['haestasaurus', 'pelorosaurus', 'macronarian', 'sauropod', 'skin', 'hastings', 'sussex', 'cretaceous'] },
    { id: 'valdosaurus-canaliculatus', name: 'Valdosaurus canaliculatus', common: 'Valdosaurus', clade: 'iguanodontia', status: 'full', ageText: 'About 137 to 125 million years ago (Early Cretaceous)', placeText: 'Isle of Wight and the Weald, England', formations: [...HB, 'wessex'],
      summary: ['A fast-running, two-legged dryosaurid plant-eater about 1.2 m long or more, related to Dryosaurus of the Morrison Formation. Its bones were first thought to belong to Hypsilophodon, then Camptosaurus and then Dryosaurus before it got its own genus.'],
      facts: [{ label: 'Named', value: 'Peter Galton, 1975 (as Dryosaurus canaliculatus); genus 1977' }],
      keywords: ['valdosaurus', 'dryosaurid', 'ornithopod', 'wealden', 'isle of wight', 'cretaceous'] },
    { id: 'ornimegalonyx-oteroi', name: 'Ornimegalonyx oteroi', common: 'Cuban giant owl', clade: 'strigidae', status: 'full', ageText: 'Late Pleistocene, perhaps until about 10,000 years ago', placeText: 'Caves and sinkholes of Cuba', formations: [],
      summary: [
        'One of the largest owls that ever lived, standing about 1 m tall and perhaps weighing around 9 kg (estimates vary), with long, powerful legs. Its short wings and heavy legs suggest it could barely fly, if at all, and hunted on the ground, running down prey like a giant roadrunner.',
        'It probably preyed on giant hutias, large rodents of the Caribbean, and perhaps young ground sloths. Like many Caribbean animals, it disappeared around the end of the Ice Age or soon after; when exactly, and whether people played a part, is uncertain.',
      ],
      facts: [
        { label: 'Named', value: 'Oscar Arredondo, 1958' },
        { label: 'Height', value: 'About 1–1.1 m (estimate)' },
      ],
      related: [{ id: 'bubo-virginianus', note: 'A living owl of similar build, though far smaller.' }],
      keywords: ['ornimegalonyx', 'cuban giant owl', 'giant owl', 'flightless owl', 'cuba', 'pleistocene', 'ice age'] },
  ],
};
