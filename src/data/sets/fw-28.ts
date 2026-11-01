// Micropachycephalosaurus, the dinosaur with the longest name, now thought to be an early
// ceratopsian rather than a pachycephalosaur. Checked November 2026.

import { formation } from '@/data/sets/formation';
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
  events: [
    formation({
      id: 'tuchengzi',
      title: 'Tuchengzi Formation',
      short: 'Tuchengzi',
      dateText: 'About 152 to 145 million years ago (Late Jurassic)',
      placeText: 'Chaoyang, Liaoning, and northern Hebei, China',
      lon: 120.4,
      lat: 41.6,
      plate: 604,
      fromMa: 152,
      toMa: 145,
      jumpMa: 150,
      icon: 'dunes',
      summary: [
        'Red sandstones and conglomerates laid down by rivers and wind in a dry basin at the very end of the Jurassic, below the famous Jehol beds. Its bones are rare, but it has given Chaoyangsaurus, one of the oldest ceratopsians, and many dinosaur footprints.',
      ],
      facts: [
        { label: 'Age', value: 'About 150 million years ago' },
        { label: 'Where today', value: 'Liaoning and Hebei, China' },
        { label: 'Rocks', value: 'Red sandstone and conglomerate' },
      ],
      keywords: ['tuchengzi', 'chaoyang', 'liaoning', 'hebei', 'china', 'jurassic', 'chaoyangsaurus', 'ceratopsian'],
    }),
    formation({
      id: 'khuren-dukh',
      title: 'Khuren Dukh Formation',
      short: 'Khuren Dukh',
      dateText: 'About 115 to 105 million years ago (Early Cretaceous)',
      placeText: 'Dornogovi Province, Mongolia (map position approximate)',
      lon: 109.0,
      lat: 44.9,
      plate: 628,
      fromMa: 115,
      toMa: 105,
      jumpMa: 108,
      icon: 'lake',
      summary: [
        'Lake and river deposits in the eastern Gobi, older than the famous Late Cretaceous beds of Mongolia. In 2025 it gave Zavacephale, the oldest definite pachycephalosaur, alongside the iguanodont Altirhinus with its arched nose.',
      ],
      facts: [
        { label: 'Age', value: 'About 108 million years ago' },
        { label: 'Where today', value: 'Eastern Gobi, Mongolia' },
        { label: 'Rocks', value: 'Lake and river sediments' },
      ],
      keywords: ['khuren dukh', 'gobi', 'mongolia', 'cretaceous', 'zavacephale', 'pachycephalosaur', 'altirhinus'],
    }),
    formation({
      id: 'obernkirchen',
      title: 'Obernkirchen Sandstone',
      short: 'Obernkirchen',
      dateText: 'About 145 to 140 million years ago (earliest Cretaceous)',
      placeText: 'Bückeberg hills near Obernkirchen, Lower Saxony, Germany',
      lon: 9.13,
      lat: 52.27,
      plate: 315,
      fromMa: 145,
      toMa: 140,
      jumpMa: 142,
      icon: 'swamp',
      summary: [
        'Fine sandstone from the coastal plains and deltas of north-west Germany at the start of the Cretaceous, quarried for centuries as a prized building stone. Its surfaces are crossed by thousands of dinosaur footprints, of meat-eaters, iguanodonts and others, and in 1855 it gave the small, puzzling plant-eater Stenopelix.',
      ],
      facts: [
        { label: 'Age', value: 'About 142 million years ago' },
        { label: 'Where today', value: 'Near Bückeburg and Obernkirchen, Germany' },
        { label: 'Rocks', value: 'Sandstone' },
      ],
      keywords: ['obernkirchen', 'bückeberg', 'bückeburg', 'lower saxony', 'germany', 'cretaceous', 'stenopelix', 'dinosaur footprints'],
    }),
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
    {
      id: 'stenopelix-valdensis',
      name: 'Stenopelix valdensis',
      common: 'Stenopelix',
      clade: 'marginocephalia',
      status: 'full',
      ageText: 'About 145 to 140 million years ago (earliest Cretaceous)',
      placeText: 'Lower Saxony, Germany',
      formations: ['obernkirchen'],
      summary: [
        'A small, two-legged plant-eater, about 1.5 m long, known from a single skeleton found in 1855 and preserved only as a natural mould in sandstone, with no skull. It has been called a pachycephalosaur, a ceratopsian and something in between.',
        'A 2009 study found it fits with the fringe-headed dinosaurs but could not place it in either group, while a 2011 analysis found it to be an early ceratopsian close to Yinlong. Like Micropachycephalosaurus, PaleoDex places it with both groups.',
      ],
      facts: [
        { label: 'Named', value: 'Hermann von Meyer, 1857' },
        { label: 'Known from', value: 'A single headless skeleton, as a mould in sandstone' },
      ],
      related: [{ id: 'micropachycephalosaurus-hongtuyanensis', note: 'Another fringe-headed dinosaur that cannot be placed in either group.' }],
      keywords: ['stenopelix', 'marginocephalian', 'ceratopsian', 'pachycephalosaur', 'germany', 'lower saxony', 'cretaceous'],
    },
    {
      id: 'zavacephale-rinpoche',
      name: 'Zavacephale rinpoche',
      common: 'Zavacephale',
      clade: 'pachycephalosauridae',
      status: 'full',
      ageText: 'About 108 million years ago (Early Cretaceous)',
      placeText: 'Eastern Gobi, Mongolia',
      formations: ['khuren-dukh'],
      summary: [
        'The oldest definite pachycephalosaur, named in 2025, at least 15 million years older than any other. The skeleton is small, under 1 m long, and bone growth rings show it was a juvenile, yet it already had a full skull dome, without the knobs and spikes of later dome-heads.',
        'It is also the most complete early pachycephalosaur: it preserves the first known dome-head hands and a cluster of gastroliths, stomach stones it swallowed to help grind plants.',
      ],
      facts: [
        { label: 'Named', value: 'Tsogtbaatar Chinzorig, Lindsay Zanno and colleagues, 2025 (Nature)' },
        { label: 'Length', value: 'Under 1 m (a juvenile)' },
        { label: 'First', value: 'Pachycephalosaur hands and stomach stones' },
      ],
      keywords: ['zavacephale', 'rinpoche', 'pachycephalosaur', 'dome-headed dinosaur', 'oldest', 'mongolia', 'gobi', 'cretaceous'],
    },
    {
      id: 'chaoyangsaurus-youngi',
      name: 'Chaoyangsaurus youngi',
      common: 'Chaoyangsaurus',
      clade: 'ceratopsia',
      status: 'full',
      ageText: 'About 150 million years ago (Late Jurassic)',
      placeText: 'Liaoning, China',
      formations: ['tuchengzi'],
      summary: [
        'One of the oldest ceratopsians, a small, two-legged plant-eater with a parrot-like beak and the rostral bone at the tip of its upper jaw that marks all ceratopsians. Found in 1976 and formally named in 1999, it showed that horned dinosaurs began in the Jurassic, long before their big frilled descendants.',
      ],
      facts: [
        { label: 'Named', value: 'Zhao Xijin, Cheng Zhengwu and Xu Xing, 1999' },
        { label: 'Found', value: '1976, near Chaoyang, Liaoning' },
      ],
      related: [{ id: 'yinlong-downsi', note: 'Another Late Jurassic ceratopsian from China.' }],
      keywords: ['chaoyangsaurus', 'early ceratopsian', 'ceratopsian', 'liaoning', 'china', 'jurassic'],
    },
  ],
};
