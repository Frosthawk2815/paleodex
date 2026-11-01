// Rising Star Cave: Homo naledi's site, shown as a single fossil site rather than a range.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const FW_25: DataSet = {
  events: [
    formation({
      id: 'rising-star',
      title: 'Rising Star Cave',
      short: 'Rising Star',
      dateText: 'About 335,000 to 236,000 years ago (Middle Pleistocene)',
      placeText: 'Cradle of Humankind, near Johannesburg, South Africa',
      lon: 27.712,
      lat: -26.017,
      plate: 701,
      fromMa: 0.335,
      toMa: 0.236,
      jumpMa: 0.3,
      icon: 'forest',
      summary: [
        'A cave system in the dolomite hills of the Cradle of Humankind, a World Heritage Site rich in human ancestors. In 2013 cavers squeezed through an 18 cm-wide gap into the Dinaledi Chamber and found its floor covered in bones; thousands of pieces from at least 15 individuals of a new species, Homo naledi, have been recovered from it and the nearby Lesedi Chamber.',
        'Almost all the bones belong to Homo naledi, with hardly any other animals. How they got there, through passages so tight that only slim cavers can reach them, is still debated.',
      ],
      facts: [
        { label: 'Age', value: 'About 335,000 to 236,000 years ago' },
        { label: 'Where today', value: 'Cradle of Humankind, Gauteng, South Africa' },
        { label: 'Rocks', value: 'Cave sediments in dolomite' },
        { label: 'Visit', value: 'The chambers are closed; Maropeng visitor centre tells the story' },
      ],
      keywords: ['rising star', 'rising star cave', 'dinaledi', 'lesedi', 'cradle of humankind', 'maropeng', 'south africa', 'homo naledi', 'pleistocene'],
    }),
  ],
};
