// Tylosaurus rex, a giant mosasaur named in 2026 from Texas, including several famous specimens
// long counted as Tylosaurus proriger. Checked November 2026 against the AMNH, SMU and Perot Museum
// announcements of Zietlow, Polcyn and Tykoski (2026, Bulletin of the American Museum of Natural
// History).

import type { DataSet } from '@/data/sets/types';

export const FW_29: DataSet = {
  species: [
    {
      id: 'tylosaurus-rex',
      name: 'Tylosaurus rex',
      common: 'Tylosaurus rex',
      clade: 'mosasauridae',
      status: 'full',
      ageText: 'About 80 million years ago (Late Cretaceous)',
      placeText: 'Texas and the Western Interior Seaway, USA',
      formations: [],
      summary: [
        'One of the largest mosasaurs known, up to about 13 m long, named in 2026 from a skeleton found in Texas in 1979 and now on display at the Perot Museum in Dallas. Unlike Tylosaurus proriger, it had serrated teeth, edged like steak knives for slicing big prey.',
        'Its describers re-examined tylosaur fossils in more than a dozen museums and found that several famous giants long counted as Tylosaurus proriger, including the “Bunker” specimen in Kansas and “Sophie” at Yale, belong to this new species. Mosasaurs were giant sea-going lizards, closer to snakes and monitor lizards than to dinosaurs; its name nods to the other T. rex.',
      ],
      facts: [
        { label: 'Named', value: 'Amelia Zietlow, Michael Polcyn and Ron Tykoski, 2026' },
        { label: 'Length', value: 'Up to about 13 m' },
        { label: 'Teeth', value: 'Serrated, unlike those of Tylosaurus proriger' },
        { label: 'Myth', value: 'A sea lizard, not a dinosaur' },
      ],
      related: [{ id: 'tylosaurus-proriger', note: 'Its close relative; several of its largest specimens were reassigned to T. rex.' }],
      keywords: ['tylosaurus rex', 'tylosaurus', 't. rex of the sea', 'mosasaur', 'texas', 'perot museum', 'bunker', 'cretaceous'],
    },
  ],
};
