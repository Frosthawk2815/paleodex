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
        'Raptors (dromaeosaurs), troodontids and avialans, many with an enlarged second toe claw. Anchiornithids and Rahonavis sit near the base; whether they are early birds, troodontids or raptor relatives is debated.',
    },
    {
      id: 'avialae',
      name: 'Avialae',
      common: 'Avialans',
      parent: 'paraves',
      family: true,
      description:
        'Birds in the broad sense: Archaeopteryx, modern birds and every dinosaur closer to modern birds than to raptors or troodontids, including toothed and long-tailed early birds.',
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
  ],
  upgrades: {
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
