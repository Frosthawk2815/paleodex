// Ammonitritor scientiacivium (2026) and its formation, the Early Triassic Vikinghøgda Formation of
// Svalbard, with two of its best-known animals. Checked November 2026 against the Biological
// Reviews omphalosaurid paper (Sander, Ebbo and colleagues), Wikidata and the EAVP 2024 guide.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const FW_21: DataSet = {
  clades: [
    {
      id: 'omphalosauridae',
      name: 'Omphalosauridae',
      common: 'Omphalosaurs',
      parent: 'reptilia',
      family: true,
      description:
        'Early Triassic sea reptiles with batteries of rounded, crushing teeth for grinding shelled prey. Usually thought to be early relatives of ichthyosaurs, though some researchers dispute this.',
    },
  ],
  events: [
    formation({
      // Vikinghøgda is a mountain in central Spitsbergen; the point is approximate.
      id: 'vikinghogda',
      title: 'Vikinghøgda Formation',
      short: 'Vikinghøgda',
      dateText: 'About 251 to 247 million years ago (Early Triassic)',
      placeText: 'Central Spitsbergen, Svalbard, Norway (map position approximate)',
      lon: 17.0,
      lat: 78.2,
      plate: 309,
      fromMa: 251,
      toMa: 247,
      jumpMa: 249,
      icon: 'sea',
      summary: [
        'Dark shale and siltstone from a sea on the northern edge of Pangaea, laid down only a few million years after the end-Permian extinction. Its bonebeds show how quickly reptiles took to the sea and refilled the oceans after the extinction.',
        'Its animals include the early ichthyosaur relative Grippia, the shell-crushing omphalosaur Ammonitritor, large ichthyosaurs such as Cymbospondylus, the long-snouted amphibian Aphaneramma, and many fish, including Saurichthys, coelacanths, lungfish and hybodont sharks.',
      ],
      facts: [
        { label: 'Age', value: 'About 249 million years ago' },
        { label: 'Where today', value: 'Central Spitsbergen, Svalbard' },
        { label: 'Rocks', value: 'Dark shale and siltstone with bonebeds' },
      ],
      invertebrates: [{ tier: 'pleb', title: 'Ammonoids', text: 'Ammonoids are common and are used to date the layers; they were likely food for the shell-crushing reptiles.' }],
      keywords: ['vikinghogda', 'vikinghøgda', 'sticky keep', 'grippia bonebed', 'spitsbergen', 'svalbard', 'norway', 'triassic', 'ichthyosaur'],
    }),
  ],
  species: [
    {
      id: 'ammonitritor-scientiacivium',
      name: 'Ammonitritor scientiacivium',
      common: 'Ammonitritor',
      clade: 'omphalosauridae',
      status: 'full',
      ageText: 'About 249 million years ago (Early Triassic, Olenekian)',
      placeText: 'Vikinghøgda, Spitsbergen, Svalbard, Norway',
      formations: ['vikinghogda'],
      summary: [
        'A sea reptile named in 2026 from the first three-dimensionally preserved omphalosaur skull, with part of its neck. Omphalosaurs had batteries of rounded teeth for crushing hard-shelled prey, and its name means “ammonite grinder”, after the shelled relatives of squid it probably ate.',
        'It was found in 2010 by Felix Saludes on an expedition led by Luc Ebbo, and the species name means “of citizen scientists”, honouring the amateurs who found and helped describe it. Its describers place omphalosaurs among early ichthyosaur relatives, but at least one researcher argues they are not related to ichthyosaurs; how closely is still debated.',
      ],
      facts: [
        { label: 'Named', value: 'Martin Sander, Luc Ebbo and colleagues, 2026 (Biological Reviews)' },
        { label: 'Name means', value: '“Ammonite grinder of the citizen scientists”' },
        { label: 'Known from', value: 'A skull without its braincase and palate, and part of the neck' },
      ],
      keywords: ['ammonitritor', 'scientiacivium', 'omphalosaur', 'omphalosaurid', 'ichthyosauriform', 'durophagous', 'svalbard', 'spitsbergen', 'triassic', 'citizen science'],
    },
    {
      id: 'grippia-longirostris',
      name: 'Grippia longirostris',
      common: 'Grippia',
      clade: 'ichthyosauria',
      status: 'full',
      ageText: 'About 249 million years ago (Early Triassic)',
      placeText: 'Spitsbergen, Svalbard, Norway',
      formations: ['vikinghogda'],
      summary: [
        'A small early relative of ichthyosaurs, about a metre long, with rounded back teeth for crushing shellfish. Strictly it sits just outside true ichthyosaurs, among the wider group of ichthyopterygians. The bonebed it comes from is called the Grippia level after it.',
      ],
      facts: [
        { label: 'Named', value: 'Carl Wiman, 1929' },
        { label: 'Size', value: 'About 1 metre' },
      ],
      keywords: ['grippia', 'ichthyopterygian', 'ichthyosaur', 'spitsbergen', 'svalbard', 'triassic'],
    },
    {
      id: 'aphaneramma-rostratum',
      name: 'Aphaneramma rostratum',
      common: 'Aphaneramma',
      clade: 'temnospondyli',
      status: 'full',
      ageText: 'About 250 million years ago (Early Triassic)',
      placeText: 'Spitsbergen, Svalbard, Norway',
      formations: ['vikinghogda'],
      summary: [
        'A trematosaur, an amphibian with an extremely long, narrow snout like a gharial’s, built for snapping up fish. Trematosaurs were among the few amphibians that could live in salty coastal seas.',
      ],
      facts: [
        { label: 'Named', value: 'Arthur Smith Woodward, 1904' },
        { label: 'Group', value: 'Trematosaurid temnospondyl' },
      ],
      keywords: ['aphaneramma', 'trematosaur', 'temnospondyl', 'amphibian', 'spitsbergen', 'svalbard', 'triassic'],
    },
  ],
};
