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
