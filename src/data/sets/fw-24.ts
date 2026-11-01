// Mekosuchus inexpectatus and the Pindai Caves of New Caledonia, with the giant ground bird
// Sylviornis. Checked November 2026 against Anderson, Sand, Petchey and Worthy (2010, Journal of
// Pacific Archaeology) on the Pindai Caves.

import { formation } from '@/data/sets/formation';
import type { DataSet } from '@/data/sets/types';

export const FW_24: DataSet = {
  clades: [
    {
      id: 'sylviornithidae',
      name: 'Sylviornithidae',
      common: 'Sylviornithids',
      parent: 'aves',
      family: true,
      description: 'Giant flightless ground birds of New Caledonia and Fiji, early relatives of megapodes and the other fowl-like birds, all now extinct.',
    },
  ],
  events: [
    formation({
      id: 'pindai',
      title: 'Pindai Caves',
      short: 'Pindai',
      dateText: 'About 6,000 to 1,500 years ago (late Holocene)',
      placeText: 'Népoui Peninsula, north-west coast of Grande Terre, New Caledonia',
      lon: 164.95,
      lat: -21.33,
      plate: 834,
      fromMa: 0.006,
      toMa: 0.0015,
      jumpMa: 0.003,
      icon: 'forest',
      summary: [
        'Six caves in raised coral limestone at the tip of the Népoui Peninsula, holding the richest fossil deposits found on New Caledonia’s main island, along with traces of the first people to settle there, who arrived about 3,000 years ago.',
        'Its bones come from the island’s lost animals: the land crocodile Mekosuchus, the giant horned turtle Meiolania, the giant ground bird Sylviornis, and at least 20 other birds now extinct there, including a flightless swamphen, a larger relative of the kagu, pigeons and owls. Some occur in the same layers as people, but problems with dating mean how far humans caused these extinctions is still debated.',
      ],
      facts: [
        { label: 'Age', value: 'About 3,000 years ago (the time of human arrival)' },
        { label: 'Where today', value: 'Népoui Peninsula, New Caledonia' },
        { label: 'Rocks', value: 'Cave deposits in raised coral limestone' },
      ],
      keywords: ['pindai', 'pindai caves', 'nepoui', 'new caledonia', 'holocene', 'mekosuchus', 'sylviornis', 'meiolania', 'extinction', 'lapita'],
    }),
  ],
  species: [
    {
      id: 'mekosuchus-inexpectatus',
      name: 'Mekosuchus inexpectatus',
      common: 'New Caledonian land crocodile',
      clade: 'crocodylia',
      status: 'full',
      ageText: 'Until about 3,000 years ago (Holocene)',
      placeText: 'New Caledonia',
      formations: ['pindai'],
      summary: [
        'A small crocodile, probably under 2 m long, that lived mostly on land on New Caledonia, an island with no other large predators. Its back teeth were blunt, suited to crushing hard-shelled prey such as snails and crabs. It was the first species of Mekosuchus named, and its name means “unexpected”, as no crocodiles were known from the island.',
        'It is one of the last mekosuchines, a group of crocodiles found only in Australia and the Pacific that included land-hunting forms such as Quinkana. Its youngest bones are around 3,000 years old, close to when people first arrived, but whether people caused its disappearance is not settled.',
      ],
      facts: [
        { label: 'Named', value: 'Jean-Christophe Balouet and Eric Buffetaut, 1987' },
        { label: 'Last known', value: 'About 3,000 years ago' },
        { label: 'Diet', value: 'Probably snails, crabs and other hard-shelled prey' },
      ],
      related: [{ id: 'mekosuchus-whitehunterensis', note: 'An older relative from the Miocene of Australia.' }],
      keywords: ['mekosuchus', 'inexpectatus', 'mekosuchine', 'land crocodile', 'crocodile', 'new caledonia', 'holocene', 'extinct'],
    },
    {
      id: 'sylviornis-neocaledoniae',
      name: 'Sylviornis neocaledoniae',
      common: 'Sylviornis',
      clade: 'sylviornithidae',
      status: 'full',
      ageText: 'Until about 3,000 years ago (Holocene)',
      placeText: 'New Caledonia',
      formations: ['pindai'],
      summary: [
        'A giant flightless ground bird about 1.7 m long and around 30 kg, with a deep, bony-crested bill, the largest bird known from New Caledonia. It is a distant relative of megapodes and chickens.',
        'When named in 1980 it was thought to be a relative of emus and other ratites; better fossils later showed it belongs with the fowl-like birds. Bones from the Pindai Caves gave the first radiocarbon dates for it, showing it survived until people arrived about 3,000 years ago, and its bones in their settlements suggest it was hunted.',
      ],
      facts: [
        { label: 'Named', value: 'François Poplin, 1980' },
        { label: 'Size', value: 'About 1.7 m long, around 30 kg' },
        { label: 'Myth', value: 'First thought to be a ratite; it was a fowl-like bird' },
      ],
      keywords: ['sylviornis', 'giant megapode', 'flightless bird', 'galliform', 'new caledonia', 'holocene', 'extinct'],
    },
  ],
};
