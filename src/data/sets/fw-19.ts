// Recent finds and requested additions: Gerrothorax maritimus, Rinconraptor pipoae, Longisquama,
// Eporeodon, and the first known adult T. rex trackway (Hell Creek, North Dakota).
// Checked against current literature and news reports (November 2026).

import { trackway } from '@/data/sets/trackway';
import type { DataSet } from '@/data/sets/types';

export const FW_19: DataSet = {
  clades: [
    {
      id: 'plagiosauridae',
      name: 'Plagiosauridae',
      common: 'Plagiosaurs',
      parent: 'temnospondyli',
      family: true,
      description: 'Very flat, broad-headed temnospondyl amphibians of the Triassic, often armoured, that lay on the bottom of rivers, lakes and, it now seems, the sea.',
    },
  ],
  species: [
    {
      id: 'gerrothorax-maritimus',
      name: 'Gerrothorax maritimus',
      common: 'Gerrothorax maritimus',
      clade: 'plagiosauridae',
      status: 'full',
      ageText: 'About 237 million years ago (Late Triassic)',
      placeText: 'Guizhou, China',
      formations: [],
      summary: [
        'A flat, armoured amphibian about 74 cm long, named in 2026 from two nearly complete skeletons found in rocks laid down in the open sea, dozens of kilometres from land. It may be the first amphibian known to have lived its whole life in salt water.',
        'Strontium in its bones matches Triassic seawater, which suggests it grew up drinking it. Its describers think it lay on the sea floor and sucked in passing prey. Living amphibians cannot cope with salt water, so outside scientists have called the find potentially revolutionary; the marine lifestyle is an interpretation of two specimens and may be tested by further finds.',
      ],
      facts: [
        { label: 'Named', value: '2026, in Nature Ecology & Evolution' },
        { label: 'Size', value: 'About 74 cm long' },
        { label: 'Relatives', value: 'Gerrothorax pulcherrimus, from freshwater rocks in Germany and Greenland' },
      ],
      keywords: ['gerrothorax', 'maritimus', 'plagiosaur', 'temnospondyl', 'amphibian', 'marine', 'guizhou', 'china', 'triassic'],
    },
    {
      id: 'rinconraptor-pipoae',
      name: 'Rinconraptor pipoae',
      common: 'Rinconraptor',
      clade: 'megaraptoridae',
      status: 'full',
      ageText: 'About 86 to 83 million years ago (Late Cretaceous)',
      placeText: 'Cerro Overo, near Rincón de los Sauces, Neuquén, Argentina',
      formations: [],
      summary: [
        'A megaraptorid, one of the long-armed, big-clawed predators of Cretaceous South America and Australia, named in 2026. It was about 7 metres long, an estimate from comparing its vertebrae with better-known relatives, and is known from parts of the backbone, a humerus and a tibia.',
        'Its bones were first spotted in 2016 and dug up in 2019. The genus is named after Rincón de los Sauces, and the species honours Laura Pipo, a researcher on the 2019 dig who died in 2020.',
      ],
      facts: [
        { label: 'Named', value: 'Ariel Méndez and colleagues, 2026 (Palaeontologia Electronica)' },
        { label: 'Length', value: 'About 7 metres' },
        { label: 'Age', value: 'Reports give about 86 or about 83 million years ago' },
      ],
      keywords: ['rinconraptor', 'pipoae', 'megaraptor', 'megaraptorid', 'neuquen', 'patagonia', 'argentina', 'cretaceous'],
    },
    {
      id: 'longisquama-insignis',
      name: 'Longisquama insignis',
      common: 'Longisquama',
      clade: 'reptilia',
      status: 'full',
      ageText: 'About 230 million years ago (Middle to Late Triassic)',
      placeText: 'Madygen, Kyrgyzstan',
      formations: [],
      summary: [
        'A small reptile from lakeside forests of the Madygen Formation, known from one poorly preserved skeleton and several impressions. It is famous for a row of long, flat structures along its back, which gave it its name, “long scales”.',
        'In the 1990s and 2000s some claimed the back structures were feathers and that Longisquama was close to the ancestry of birds. A 2012 restudy found they are skin appendages, not feathers, and it is now regarded as a diapsid reptile of uncertain position with no bearing on bird origins.',
      ],
      facts: [
        { label: 'Named', value: 'Aleksandr Sharov, 1970' },
        { label: 'Myth', value: 'Not a feathered bird ancestor: its back crest is made of skin' },
        { label: 'Relatives', value: 'Uncertain; a diapsid reptile' },
      ],
      keywords: ['longisquama', 'madygen', 'kyrgyzstan', 'triassic', 'diapsid', 'crest', 'feathers'],
    },
    {
      id: 'eporeodon-occidentalis',
      name: 'Eporeodon occidentalis',
      common: 'Eporeodon',
      clade: 'merycoidodontidae',
      status: 'full',
      ageText: 'About 30 to 25 million years ago (Oligocene)',
      placeText: 'John Day Basin, Oregon, USA',
      formations: [],
      summary: [
        'A cow-sized oreodont, one of a family of sheep- to cow-sized grazing and browsing mammals found only in North America, common in the John Day fossil beds of Oregon. Oreodonts are often compared with pigs or sheep, but they were their own branch of even-toed hoofed mammals.',
        'Its name is uncertain: a 2014 restudy found no clear differences between Eporeodon and Eucrotaphus from the same rocks, and recommended merging them, though it is not yet known whether they are one species (perhaps males and females) or two living side by side.',
      ],
      facts: [
        { label: 'Named', value: 'Othniel Marsh, 1873' },
        { label: 'Size', value: 'About the size of a cow' },
        { label: 'Name', value: 'May be the same animal as Eucrotaphus (under study)' },
      ],
      keywords: ['eporeodon', 'eucrotaphus', 'oreodont', 'merycoidodont', 'john day', 'oregon', 'oligocene'],
    },
  ],
  events: [
    trackway({
      id: 'marmarth-trex',
      title: 'Marmarth T. rex trackway',
      short: 'T. rex tracks',
      dateText: 'About 66.5 million years ago (latest Cretaceous)',
      placeText: 'Near Marmarth, North Dakota, USA (Hell Creek Formation)',
      lon: -103.92,
      lat: 46.3,
      plate: 101,
      fromMa: 66.7,
      toMa: 66.3,
      jumpMa: 66.5,
      trackmakers: [
        { id: 'tyrannosaurus-rex', certainty: 'likely', note: 'Its size and shape fit an adult T. rex, the only giant meat-eater known from these rocks.' },
      ],
      summary: [
        'Four three-toed footprints spanning about 7 metres, with a stride of about 4 metres, described in 2026 as the first known trackway of an adult T. rex. Science teacher and museum volunteer Kent Hups spotted it in July 2025 in the Badlands, on land run by the U.S. Forest Service.',
        'The prints are heavily weathered, so the walking speed worked out from them, about 6 to 7 km/h, is approximate. Researchers from the Denver Museum of Nature & Science and Liverpool John Moores University call it “likely attributable” to an adult T. rex; some prints were lifted out by helicopter for display in Denver.',
      ],
      facts: [
        { label: 'Laid', value: 'About 66.5 million years ago' },
        { label: 'Found', value: 'Kent Hups, 2025; described in the Journal of Vertebrate Paleontology, 2026' },
        { label: 'Trackmaker', value: 'Likely an adult Tyrannosaurus rex' },
      ],
      keywords: ['t. rex', 'tyrannosaurus', 'trackway', 'footprints', 'marmarth', 'north dakota', 'hell creek', 'denver museum'],
    }),
  ],
};
