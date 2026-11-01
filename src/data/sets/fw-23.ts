// Orthocones: the straight-shelled nautiloid cephalopods of the early Palaeozoic seas, with two
// Ordovician formations and some of their trilobites. Checked November 2026: orthocone sizes
// follow Klug et al. (2015), which found the largest are Endoceras, not Cameroceras.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const FW_23: DataSet = {
  clades: [
    {
      id: 'endocerida',
      name: 'Endocerida',
      common: 'Endocerids',
      parent: 'cephalopoda',
      family: true,
      description:
        'Ordovician nautiloids with long, straight shells, some the largest shelled animals of their time. Cone-shaped deposits filled the narrow end of the shell, probably weighting it so the animal swam level.',
    },
    {
      id: 'orthocerida',
      name: 'Orthocerida',
      common: 'Orthocerids',
      parent: 'cephalopoda',
      family: true,
      description:
        'Nautiloids with slender, straight shells divided into gas-filled chambers, common from the Ordovician to the Triassic. Their shells are among the most common fossils sold in rock shops, often labelled “Orthoceras”.',
    },
  ],
  events: [
    formation({
      id: 'trenton',
      title: 'Trenton Group',
      short: 'Trenton',
      dateText: 'About 456 to 450 million years ago (Late Ordovician)',
      placeText: 'Trenton Falls and the Mohawk Valley, New York, USA, and southern Ontario, Canada',
      lon: -75.15,
      lat: 43.27,
      plate: 101,
      fromMa: 456,
      toMa: 450,
      jumpMa: 453,
      icon: 'sea',
      summary: [
        'Layers of limestone and shale from a warm, shallow tropical sea that covered eastern North America, then lying south of the equator. They are packed with shells, sea lilies, bryozoans and trilobites.',
        'Its trilobites include the big, smooth Isotelus and the spiny Ceraurus, which at the Walcott–Rust Quarry is preserved with its legs. Straight-shelled nautiloids such as Cameroceras hunted in the same sea.',
      ],
      facts: [
        { label: 'Age', value: 'About 453 million years ago' },
        { label: 'Where today', value: 'Central New York and southern Ontario' },
        { label: 'Rocks', value: 'Limestone and shale' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Sea floor life', text: 'Brachiopods, bryozoans, sea lilies, snails and corals.' }],
      keywords: ['trenton', 'trenton falls', 'mohawk valley', 'new york', 'ontario', 'ordovician', 'trilobite', 'nautiloid', 'cameroceras'],
    }),
    formation({
      id: 'orthoceratite-limestone',
      title: 'Orthoceratite Limestone',
      short: 'Orthoceratite',
      dateText: 'About 475 to 465 million years ago (Early to Middle Ordovician)',
      placeText: 'Öland and Västergötland, Sweden',
      lon: 16.55,
      lat: 56.65,
      plate: 301,
      fromMa: 475,
      toMa: 465,
      jumpMa: 470,
      icon: 'sea',
      summary: [
        'Red and grey limestone laid down very slowly on the floor of a cool sea over the ancient continent of Baltica, named for the orthocone shells that crowd its surfaces. It has been quarried for centuries, and polished slabs pave old floors and churches across Scandinavia.',
        'At Kinnekulle the same limestone holds dozens of fossil meteorites, debris from a collision in the asteroid belt about 466 million years ago that showered the Earth for millions of years.',
      ],
      facts: [
        { label: 'Age', value: 'About 470 million years ago' },
        { label: 'Where today', value: 'Öland and Kinnekulle, Sweden' },
        { label: 'Rocks', value: 'Red and grey limestone' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Trilobites', text: 'Asaphid trilobites such as Megistaspis, with brachiopods and other shells.' }],
      keywords: ['orthoceratite limestone', 'orthoceras', 'oland', 'öland', 'kinnekulle', 'sweden', 'ordovician', 'nautiloid', 'fossil meteorites'],
    }),
  ],
  species: [
    {
      id: 'cameroceras-trentonense',
      name: 'Cameroceras trentonense',
      common: 'Cameroceras',
      clade: 'endocerida',
      status: 'full',
      ageText: 'About 456 to 450 million years ago (Late Ordovician)',
      placeText: 'New York, USA',
      formations: ['trenton'],
      summary: [
        'A straight-shelled nautiloid, a relative of the living nautilus, from the Ordovician seas of North America. Like other endocerids it had a long, cone-shaped shell with a thick siphuncle, a tube running its length that helped control buoyancy.',
        'It is often said to have been 9 to 11 m long, the giant of its seas. That figure comes from a second-hand report of a shell destroyed in the field before anyone collected or photographed it. The largest orthocone actually known is Endoceras giganteum, estimated at about 5.7 m.',
      ],
      facts: [
        { label: 'Named', value: 'Joseph Conrad, 1842' },
        { label: 'Myth', value: 'The 9 to 11 m length is not supported by any specimen' },
      ],
      keywords: ['cameroceras', 'orthocone', 'nautiloid', 'endocerid', 'cephalopod', 'ordovician', 'trenton', 'new york'],
    },
    {
      id: 'endoceras-giganteum',
      name: 'Endoceras giganteum',
      common: 'Endoceras',
      clade: 'endocerida',
      status: 'full',
      ageText: 'About 470 to 445 million years ago (Middle to Late Ordovician)',
      placeText: 'North America',
      formations: [],
      summary: [
        'The longest shelled cephalopod known. Its largest specimen is about 3 m long even with the narrow end missing, and a 2015 study estimated the complete shell at about 5.7 m.',
        'Endocerids like it were among the top predators of the Ordovician seas, though how they hunted is debated: a long, heavy shell suggests a slow animal that may have drifted after small prey rather than chasing big ones.',
      ],
      facts: [
        { label: 'Genus named', value: 'James Hall, 1847' },
        { label: 'Length', value: 'About 5.7 m (estimated from a 3 m incomplete shell)' },
      ],
      keywords: ['endoceras', 'giganteum', 'orthocone', 'nautiloid', 'endocerid', 'cephalopod', 'ordovician', 'largest'],
    },
    {
      id: 'orthoceras-regulare',
      name: 'Orthoceras regulare',
      common: 'Orthoceras',
      clade: 'orthocerida',
      status: 'full',
      ageText: 'About 470 million years ago (Middle Ordovician)',
      placeText: 'Sweden and the Baltic region',
      formations: ['orthoceratite-limestone'],
      summary: [
        'The orthocone the whole group is named after, a slender, straight-shelled nautiloid from the Ordovician limestones of Sweden and the Baltic. Its name means “straight horn”.',
        'The polished black “Orthoceras” sold in rock shops and as ornaments almost all come from Morocco and are Devonian, some 80 million years younger. They belong to several other orthocone genera, and the name is a trade label rather than an identification.',
      ],
      facts: [
        { label: 'Named', value: 'Schlotheim, 1820, as Orthoceratites regularis' },
        { label: 'Myth', value: 'Polished Moroccan “Orthoceras” are other, younger orthocones' },
      ],
      keywords: ['orthoceras', 'orthocone', 'nautiloid', 'orthocerid', 'cephalopod', 'ordovician', 'sweden', 'oland', 'straight horn'],
    },
    {
      id: 'isotelus-gigas',
      name: 'Isotelus gigas',
      common: 'Isotelus',
      clade: 'trilobita',
      status: 'full',
      ageText: 'About 456 to 450 million years ago (Late Ordovician)',
      placeText: 'New York, USA, and Ontario, Canada',
      formations: ['trenton'],
      summary: [
        'A large, smooth, broad trilobite that ploughed the sea floor of Ordovician North America. Its relatives include Isotelus rex from Manitoba, at over 70 cm the largest complete trilobite known. Isotelus is the state fossil of Ohio.',
      ],
      facts: [{ label: 'Named', value: 'James DeKay, 1824' }],
      keywords: ['isotelus', 'trilobite', 'ordovician', 'trenton', 'new york', 'ohio state fossil'],
    },
    {
      id: 'ceraurus-pleurexanthemus',
      name: 'Ceraurus pleurexanthemus',
      common: 'Ceraurus',
      clade: 'trilobita',
      status: 'full',
      ageText: 'About 456 to 450 million years ago (Late Ordovician)',
      placeText: 'New York, USA, and Ontario, Canada',
      formations: ['trenton'],
      summary: [
        'A spiny trilobite with long backward-pointing spines at its tail and the corners of its head. Specimens from the Walcott–Rust Quarry in New York, studied by Charles Walcott in the 1870s, were among the first trilobites found with their legs and gills preserved.',
      ],
      facts: [{ label: 'Named', value: 'Green, 1832' }],
      keywords: ['ceraurus', 'trilobite', 'ordovician', 'trenton', 'walcott-rust quarry', 'new york'],
    },
  ],
};
