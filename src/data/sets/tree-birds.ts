// The bird end of the theropod tree, following current phylogenies:
// Maniraptora › Pennaraptora › Paraves › Avialae › Ornithuromorpha › Aves (crown birds).
// Where a group's position is still debated, its description says so.

import type { DataSet } from '@/data/sets/types';

export const TREE_BIRDS: DataSet = {
  clades: [
    {
      id: 'pennaraptora',
      name: 'Pennaraptora',
      common: 'Pennaraptorans',
      parent: 'maniraptora',
      description:
        'Maniraptorans with large pennaceous (vaned) feathers on the arms and tail: oviraptorosaurs, scansoriopterygids and paravians. Where scansoriopterygids belong within it is debated.',
    },
    {
      id: 'paraves',
      name: 'Paraves',
      common: 'Paravians',
      parent: 'pennaraptora',
      description:
        'Dromaeosaurs (popularly “raptors”), troodontids and avialans, many with an enlarged second toe claw. Anchiornithids and Rahonavis sit near the base; whether they are early birds, troodontids or dromaeosaur relatives is debated.',
    },
    {
      id: 'avialae',
      name: 'Avialae',
      common: 'Avialans',
      parent: 'paraves',
      family: true,
      description:
        'Birds in the broad sense: Archaeopteryx, modern birds and every dinosaur closer to modern birds than to dromaeosaurs or troodontids, including toothed and long-tailed early birds.',
    },
    {
      id: 'ornithuromorpha',
      name: 'Ornithuromorpha',
      common: 'Ornithuromorphs',
      parent: 'avialae',
      family: true,
      description:
        'Avialans with modern-style bodies, such as a short tail ending in a ploughshare bone and a deep breastbone: Ichthyornis, the toothed diving hesperornithines and the crown birds.',
    },
    {
      id: 'unenlagiinae',
      name: 'Unenlagiinae',
      common: 'Unenlagiines',
      parent: 'dromaeosauridae',
      description:
        'Long-snouted, lightly built raptor relatives from the Cretaceous of South America, from the 1.5 m Buitreraptor to the 5 m Austroraptor. Many had small, simple teeth, perhaps for catching fish and other small prey. They are usually placed within the dromaeosaurs, but some studies put them just outside, closer to birds, as a family of their own (Unenlagiidae). Rahonavis of Madagascar is sometimes counted among them.',
    },
    {
      id: 'halszkaraptorinae',
      name: 'Halszkaraptorinae',
      common: 'Halszkaraptorines',
      parent: 'dromaeosauridae',
      description:
        'Small raptor relatives from the Late Cretaceous of Mongolia, several of them long-necked and duck-like: Halszkaraptor, Mahakala, Hulsanpes and Natovenator. They are usually treated as early-branching dromaeosaurs, but a 2025 study placed them among the avialans, closer to birds. Whether they swam is debated.',
    },
  ],
  species: [
    {
      id: 'halszkaraptor-escuilliei',
      name: 'Halszkaraptor escuilliei',
      common: 'Halszkaraptor',
      clade: 'halszkaraptorinae',
      status: 'full',
      ageText: 'About 75 to 71 million years ago',
      placeText: 'Ukhaa Tolgod, Gobi Desert, Mongolia',
      formations: ['djadochta'],
      summary: [
        'A mallard-sized raptor relative with a swan-like neck making up half the length of its head and body, short, flattened arms and a flat, spoon-shaped snout. Each side of its upper snout tip held 11 closely packed teeth, more than any other known dinosaur, and channels in the snout may have held touch- or pressure-sensitive nerves.',
        'Its describers in 2017 suggested it lived like a merganser, swimming with its arms and catching fish with its long neck. A 2019 study disputed this. In 2022 its close relative Natovenator was found with a flattened, diving-bird-like ribcage, which supports swimming in the group, but a 2024 study found Halszkaraptor’s bite was fast and weak, better suited to insects and other small invertebrates than fish, perhaps caught in dim light with its large eyes. How it lived is still uncertain.',
        'The skeleton was taken from Mongolia by poachers and passed through private collections in Japan and Britain before a fossil dealer, François Escuillié, brought it to scientists in Brussels in 2015. A synchrotron X-ray scan showed it was a genuine single animal, not a forgery, and it was returned to Mongolia. It is named after the Polish palaeontologist Halszka Osmólska and Escuillié.',
      ],
      facts: [
        { label: 'Named', value: 'Andrea Cau and colleagues, 2017' },
        { label: 'Size', value: 'About the size of a mallard' },
        { label: 'Known from', value: 'One skeleton of a roughly one-year-old' },
      ],
      keywords: ['halszkaraptor', 'halszkaraptorine', 'duck raptor', 'swimming dinosaur', 'raptor', 'dromaeosaur', 'mongolia', 'gobi', 'cretaceous'],
    },
    {
      id: 'natovenator-polydontus',
      name: 'Natovenator polydontus',
      common: 'Natovenator',
      clade: 'halszkaraptorinae',
      status: 'full',
      ageText: 'About 72 to 71 million years ago',
      placeText: 'Ömnögovi, Gobi Desert, Mongolia',
      formations: ['barun-goyot'],
      summary: [
        'A small, long-necked halszkaraptorine, about the size of a small duck, known from a nearly complete skeleton with its skull. Its name means “many-toothed swimming hunter”.',
        'Its ribs angle sharply backwards, giving it a flattened, streamlined body like that of diving birds such as cormorants and penguins. Its describers in 2022 took this as the best evidence yet that halszkaraptorines swam, though it is an inference from body shape, and how well it swam is unknown.',
      ],
      facts: [
        { label: 'Named', value: 'Sungjin Lee and colleagues, 2022' },
        { label: 'Size', value: 'About the size of a small duck' },
      ],
      keywords: ['natovenator', 'halszkaraptorine', 'swimming dinosaur', 'raptor', 'dromaeosaur', 'mongolia', 'gobi', 'cretaceous'],
    },
    {
      id: 'mahakala-omnogovae',
      name: 'Mahakala omnogovae',
      common: 'Mahakala',
      clade: 'halszkaraptorinae',
      status: 'full',
      ageText: 'About 75 to 71 million years ago',
      placeText: 'Ömnögovi, Gobi Desert, Mongolia',
      formations: ['djadochta'],
      summary: [
        'A tiny raptor relative about 50–70 cm long and under 1 kg, close to adult size, with the enlarged second-toe claw of a dromaeosaur. When it was named in 2007 it was found to be one of the earliest-branching dromaeosaurs, despite living late in the Cretaceous.',
        'Its small size, shared with the earliest troodontids and birds, suggested that the ancestors of birds had already become small before they could fly, rather than shrinking as they took to the air. It was later grouped with Halszkaraptor among the halszkaraptorines. It is named after Mahākāla, a protector deity of Tibetan Buddhism.',
      ],
      facts: [
        { label: 'Named', value: 'Alan Turner and colleagues, 2007' },
        { label: 'Length', value: 'About 50–70 cm' },
        { label: 'Weight', value: 'About 0.4–0.7 kg' },
      ],
      keywords: ['mahakala', 'halszkaraptorine', 'raptor', 'dromaeosaur', 'mongolia', 'gobi', 'cretaceous'],
    },
  ],
  upgrades: {
    'austroraptor-cabazai': { clade: 'unenlagiinae' },
    'unenlagia-comahuensis': { clade: 'unenlagiinae' },
    'neuquenraptor-argentinus': { clade: 'unenlagiinae' },
    'buitreraptor-gonzalezorum': { clade: 'unenlagiinae' },
    'diuqin-lechiguanae': { clade: 'unenlagiinae' },
    'jeholornis-prima': { clade: 'avialae' },
    'sapeornis-chaoyangensis': { clade: 'avialae' },
    'fukuipteryx-prima': { clade: 'avialae' },
    'rahonavis-ostromi': { clade: 'paraves' },
    'patagopteryx-deferrariisi': { clade: 'ornithuromorpha' },
    'yanornis-martini': { clade: 'ornithuromorpha' },
    'apsaravis-ukhaana': { clade: 'ornithuromorpha' },
    'ichthyornis-dispar': { clade: 'ornithuromorpha' },
  },
};
