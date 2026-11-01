// Micropachycephalosaurus, the dinosaur with the longest name, now thought to be an early
// ceratopsian rather than a pachycephalosaur. Checked November 2026.

import type { DataSet } from '@/data/sets/types';

export const FW_28: DataSet = {
  clades: [
    {
      id: 'marginocephalia',
      name: 'Marginocephalia',
      common: 'Fringe-headed dinosaurs',
      parent: 'ornithischia',
      description:
        'The ornithischian dinosaurs with a bony shelf or frill at the back of the skull: the ceratopsians, from small parrot-beaked forms to Triceratops, and the dome-headed pachycephalosaurs. The two lines probably split in the Jurassic, in Asia.',
    },
  ],
  species: [
    {
      id: 'micropachycephalosaurus-hongtuyanensis',
      name: 'Micropachycephalosaurus hongtuyanensis',
      common: 'Micropachycephalosaurus',
      clade: 'marginocephalia',
      status: 'full',
      ageText: 'About 75 to 70 million years ago (Late Cretaceous)',
      placeText: 'Laiyang, Shandong, China',
      formations: ['wangshi'],
      summary: [
        'A small plant-eating dinosaur, probably under a metre long, with the longest name of any dinosaur: 23 letters in the genus alone. It is known only from scrappy remains, parts of the jaws, skull, hips and legs, found on a cliff near Laiyang.',
        'Its name means “small thick-headed lizard”, because Dong Zhiming described it in 1978 as a tiny pachycephalosaur, one of the dome-headed dinosaurs. Later studies found nothing to link it to them, and a 2011 analysis placed it instead as an early ceratopsian, a distant relative of Triceratops, though its fossils are so incomplete that this is still debated. PaleoDex places it with both groups, among the fringe-headed dinosaurs, rather than in either.',
        'It lived long after ceratopsians and pachycephalosaurs went their separate ways in the Jurassic, so it is not a link from the time they split; if it is not an early ceratopsian, it may be a late survivor of a branch close to that split.',
      ],
      facts: [
        { label: 'Named', value: 'Dong Zhiming, 1978' },
        { label: 'Name', value: 'The longest dinosaur name: 23 letters' },
        { label: 'Myth', value: 'Despite its name, probably not a pachycephalosaur' },
      ],
      related: [
        { id: 'yinlong-downsi', note: 'An early ceratopsian, if it belongs with the horned dinosaurs.' },
        { id: 'stegoceras-validum', note: 'A pachycephalosaur, the group it was first placed in.' },
      ],
      keywords: ['micropachycephalosaurus', 'longest dinosaur name', 'ceratopsian', 'pachycephalosaur', 'shandong', 'laiyang', 'china', 'cretaceous'],
    },
  ],
};
