// Ctenosuchus tenuidens (2026) and its formation, the Middle Jurassic Anoual Formation of eastern
// Morocco. Checked November 2026 against Imran et al. (Journal of Vertebrate Paleontology, 2026),
// University of Portsmouth news and Haddoumi et al. on the Guelb el Ahmar fauna.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const FW_22: DataSet = {
  events: [
    formation({
      id: 'anoual',
      title: 'Anoual Formation',
      short: 'Anoual',
      dateText: 'About 168 to 166 million years ago (Middle Jurassic, Bathonian)',
      placeText: 'Talsint–Anoual area, Figuig province, eastern Morocco (map position approximate)',
      lon: -3.1,
      lat: 32.65,
      plate: 707,
      fromMa: 168,
      toMa: 166,
      jumpMa: 167,
      icon: 'river',
      summary: [
        'Red mudstones with thin limestone beds, laid down by rivers, lakes and floodplains in the High Atlas. It is one of the few places in Africa with land and freshwater animals from the Middle Jurassic.',
        'At Guelb el Ahmar, washing and sieving the rock has turned up at least 29 kinds of small animals, including the first Middle Jurassic mammals known from Africa, along with amphibians, lizard relatives, crocodile relatives and pterosaur teeth. Most are known from teeth and scraps and have not yet been named. The narrow-snouted Ctenosuchus, named in 2026, is the best-preserved animal found so far.',
      ],
      facts: [
        { label: 'Age', value: 'About 167 million years ago (Bathonian)' },
        { label: 'Where today', value: 'Near Talsint and Anoual, eastern Morocco' },
        { label: 'Rocks', value: 'Red mudstone with thin limestones' },
      ],
      keywords: ['anoual', 'talsint', 'guelb el ahmar', 'figuig', 'morocco', 'jurassic', 'bathonian', 'mammals', 'ctenosuchus'],
    }),
  ],
  species: [
    {
      id: 'ctenosuchus-tenuidens',
      name: 'Ctenosuchus tenuidens',
      common: 'Ctenosuchus',
      clade: 'thalattosuchia',
      status: 'full',
      ageText: 'About 167 million years ago (Middle Jurassic, Bathonian)',
      placeText: 'Talsint–Anoual area, eastern Morocco',
      formations: ['anoual'],
      summary: [
        'A long, narrow-snouted crocodile relative named in 2026 from two partial skeletons. Its teeth are unlike those of any relative: very thin, about ten times taller than wide, and packed closely, with more than 40 on each side of the upper jaw. Its name means “comb crocodile with thin teeth”.',
        'It belongs to the teleosaurids, a family of the thalattosuchians, which are usually thought of as sea crocodiles. Ctenosuchus, though, lived in rivers or lakes, and is the only freshwater teleosauroid known from the southern continents. It probably caught small fish and shrimp-like prey. Its describers mention that the comb of teeth might even have strained food from the water, but they call this a tentative idea.',
      ],
      facts: [
        { label: 'Named', value: 'Imran and colleagues, 2026 (Journal of Vertebrate Paleontology)' },
        { label: 'Teeth', value: 'More than 40 needle-thin teeth on each side of the upper jaw' },
        { label: 'Habitat', value: 'Freshwater, unusual for its sea-going family' },
        { label: 'Speculative', value: 'Filter feeding is a tentative suggestion, not established' },
      ],
      keywords: ['ctenosuchus', 'tenuidens', 'teleosaurid', 'teleosauroid', 'thalattosuchian', 'crocodile', 'freshwater', 'morocco', 'jurassic'],
    },
  ],
};
