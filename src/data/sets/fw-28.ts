// Micropachycephalosaurus, the dinosaur with the longest name, now thought to be an early
// ceratopsian rather than a pachycephalosaur. Checked November 2026.

import type { DataSet } from '@/data/sets/types';

export const FW_28: DataSet = {
  species: [
    {
      id: 'micropachycephalosaurus-hongtuyanensis',
      name: 'Micropachycephalosaurus hongtuyanensis',
      common: 'Micropachycephalosaurus',
      clade: 'ceratopsia',
      status: 'full',
      ageText: 'About 75 to 70 million years ago (Late Cretaceous)',
      placeText: 'Laiyang, Shandong, China',
      formations: ['wangshi'],
      summary: [
        'A small plant-eating dinosaur, probably under a metre long, with the longest name of any dinosaur: 23 letters in the genus alone. It is known only from scrappy remains, parts of the jaws, skull, hips and legs, found on a cliff near Laiyang.',
        'Its name means “small thick-headed lizard”, because Dong Zhiming described it in 1978 as a tiny pachycephalosaur, one of the dome-headed dinosaurs. Later studies found nothing to link it to them, and a 2011 analysis placed it instead as an early ceratopsian, a distant relative of Triceratops, though its fossils are so incomplete that this is still debated.',
      ],
      facts: [
        { label: 'Named', value: 'Dong Zhiming, 1978' },
        { label: 'Name', value: 'The longest dinosaur name: 23 letters' },
        { label: 'Myth', value: 'Despite its name, probably not a pachycephalosaur' },
      ],
      keywords: ['micropachycephalosaurus', 'longest dinosaur name', 'ceratopsian', 'pachycephalosaur', 'shandong', 'laiyang', 'china', 'cretaceous'],
    },
  ],
};
