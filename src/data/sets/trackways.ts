// Famous fossil trackways, flagged on the present-day map and linked to their makers where known.

import { trackway } from '@/data/sets/trackway';
import type { DataSet } from '@/data/sets/types';

export const TRACKWAYS: DataSet = {
  events: [
    trackway({
      id: 'zachelmie', title: 'Zachełmie tetrapod trackways', short: 'Zachełmie',
      dateText: 'About 395 million years ago (Middle Devonian, Eifelian)', placeText: 'Zachełmie quarry, Holy Cross Mountains, Poland',
      lon: 20.6, lat: 50.95, plate: 305, fromMa: 397, toMa: 393, jumpMa: 395,
      summary: [
        'Footprints and trackways of four-legged animals on what was a tidal flat or lagoon shore, some from animals perhaps up to 2.5–3 m long.',
        'Described in 2010, they are about 18 million years older than the oldest tetrapod skeletons and older than fish-like relatives such as Tiktaalik. They suggest the first tetrapods evolved earlier than their bones show, and lived alongside those relatives for millions of years.',
      ],
      facts: [
        { label: 'Laid', value: 'About 395 million years ago' },
        { label: 'Found', value: 'Described by Grzegorz Niedźwiedzki and colleagues, 2010' },
        { label: 'Trackmaker', value: 'Unknown early tetrapods' },
      ],
      keywords: ['zachelmie', 'poland', 'devonian', 'tetrapod', 'oldest footprints'],
    }),
    trackway({
      id: 'plagne', title: 'Plagne sauropod trackway', short: 'Plagne',
      dateText: 'About 150 million years ago (Late Jurassic, Tithonian)', placeText: 'Plagne, Ain, France',
      lon: 5.73, lat: 46.18, plate: 305, fromMa: 151, toMa: 149, jumpMa: 150,
      summary: [
        'A trail of giant sauropod footprints on what was a tidal flat, found by two amateur naturalists in 2009. Prints are up to about 1.2–1.5 m across, and the trackway runs for about 155 m, one of the longest sauropod trackways known.',
      ],
      facts: [
        { label: 'Laid', value: 'About 150 million years ago' },
        { label: 'Trackmaker', value: 'A large sauropod, species unknown' },
      ],
      keywords: ['plagne', 'france', 'jura', 'jurassic', 'sauropod', 'longest trackway'],
    }),
    trackway({
      id: 'walmadany', title: 'Walmadany dinosaur tracks', short: 'Walmadany',
      dateText: 'About 140 to 127 million years ago (Early Cretaceous)', placeText: 'Dampier Peninsula, near Broome, Western Australia',
      lon: 122.15, lat: -17.5, plate: 801, fromMa: 140, toMa: 127, jumpMa: 133,
      summary: [
        'Thousands of footprints along about 25 km of coastline, made by at least 21 kinds of dinosaur, among the most varied dinosaur track sites in the world. One sauropod print is about 1.7 m long, the largest dinosaur footprint known.',
        'The tracks are part of a song cycle of the Goolarabooloo people, telling of the journey of an ancestral being, Marala. Their scientific study in 2017 followed a campaign that helped stop a gas plant being built on the site.',
      ],
      facts: [
        { label: 'Laid', value: 'About 140 to 127 million years ago' },
        { label: 'Largest print', value: 'About 1.7 m long (sauropod)' },
        { label: 'Trackmakers', value: 'Sauropods, theropods, ornithopods and armoured dinosaurs; species unknown' },
      ],
      keywords: ['walmadany', 'broome', 'dampier', 'western australia', 'cretaceous', 'largest footprint', 'goolarabooloo'],
    }),
    trackway({
      id: 'paluxy', title: 'Paluxy River tracks (Dinosaur Valley State Park)', short: 'Paluxy',
      dateText: 'About 113 to 110 million years ago (Early Cretaceous)', placeText: 'Glen Rose, Texas, USA',
      lon: -97.82, lat: 32.25, plate: 101, fromMa: 113, toMa: 110, jumpMa: 112,
      summary: [
        'Sauropod and theropod footprints in limestone of the Paluxy River bed, on what was a muddy coastal plain. In the 1930s Roland T. Bird excavated a famous stretch where a large theropod’s tracks run alongside those of a herd of sauropods; whether it was following them is debated.',
        'From the 1930s some claimed that giant human footprints lay beside the dinosaur tracks. They turned out to be elongated dinosaur prints, erosion marks and carvings, and even most creationists abandoned the claim after studies in the 1970s and 80s.',
      ],
      facts: [
        { label: 'Laid', value: 'About 112 million years ago' },
        { label: 'Rocks', value: 'Glen Rose Formation limestone' },
        { label: '“Man tracks”', value: 'Debunked: dinosaur tracks, erosion and carvings' },
      ],
      trackmakers: [
        { id: 'acrocanthosaurus-atokensis', certainty: 'likely', note: 'The large three-toed tracks match the size and age of Acrocanthosaurus, the only big theropod known from these rocks.' },
        { id: 'sauroposeidon-proteles', certainty: 'possible', note: 'The sauropod tracks have been linked to Sauroposeidon, but no bones are found with them.' },
      ],
      keywords: ['paluxy', 'glen rose', 'dinosaur valley', 'texas', 'cretaceous', 'man tracks', 'roland bird'],
    }),
    trackway({
      id: 'lark-quarry', title: 'Lark Quarry dinosaur trackways', short: 'Lark Quarry',
      dateText: 'About 95 million years ago (Late Cretaceous, Cenomanian)', placeText: 'Near Winton, Queensland, Australia',
      lon: 142.4, lat: -23.0, plate: 801, fromMa: 96, toMa: 94, jumpMa: 95,
      summary: [
        'More than 3,000 footprints of small two-legged dinosaurs, now under a protective building. They were long described as a stampede of small dinosaurs fleeing a large predator. A 2013 restudy argued that many were made by small plant-eaters swimming or wading across a river over days or weeks, and that the big “predator” tracks may belong to a large plant-eater. The original researchers disagree.',
      ],
      facts: [
        { label: 'Laid', value: 'About 95 million years ago' },
        { label: 'Trackmakers', value: 'Small ornithopods and perhaps theropods; the large tracks are debated' },
      ],
      keywords: ['lark quarry', 'winton', 'queensland', 'stampede', 'cretaceous'],
    }),
    trackway({
      id: 'cal-orcko', title: 'Cal Orck’o', short: 'Cal Orck’o',
      dateText: 'About 68 million years ago (Late Cretaceous, Maastrichtian)', placeText: 'Sucre, Bolivia',
      lon: -65.3, lat: -19.0, plate: 201, fromMa: 69, toMa: 67, jumpMa: 68,
      summary: [
        'A limestone wall in a cement quarry, tilted almost upright by the rise of the Andes, covered in thousands of dinosaur footprints made on the muddy shore of a lake or lagoon. Titanosaurs, theropods and armoured dinosaurs crossed it near the end of the Cretaceous.',
      ],
      facts: [
        { label: 'Laid', value: 'About 68 million years ago' },
        { label: 'Rocks', value: 'El Molino Formation limestone' },
        { label: 'Trackmakers', value: 'Titanosaurs, theropods and ankylosaurs; species unknown' },
      ],
      keywords: ['cal orcko', 'sucre', 'bolivia', 'cretaceous', 'dinosaur wall'],
    }),
    trackway({
      id: 'laetoli', title: 'Laetoli footprints', short: 'Laetoli', human: true,
      dateText: 'About 3.66 million years ago (Pliocene)', placeText: 'Laetoli, Ngorongoro, Tanzania',
      lon: 35.33, lat: -3.22, plate: 712, fromMa: 3.68, toMa: 3.64, jumpMa: 3.66,
      summary: [
        'Footprints pressed into wet volcanic ash, then hardened and buried, including a trail of at least two or three hominins walking upright with a human-like stride. They were found by Mary Leakey’s team in 1976–78, along with tracks of many other animals.',
        'They show that upright walking evolved long before large brains. A 2021 study argued that a second set of prints at another part of the site was made by a different, unknown hominin.',
      ],
      facts: [
        { label: 'Laid', value: 'About 3.66 million years ago' },
        { label: 'Found', value: 'Mary Leakey’s team, 1976–1978' },
      ],
      trackmakers: [{ id: 'australopithecus-afarensis', certainty: 'likely', note: 'The only hominin known from Laetoli at that time; its fossils are found in the same beds.' }],
      keywords: ['laetoli', 'tanzania', 'mary leakey', 'pliocene', 'hominin', 'bipedal'],
    }),
    trackway({
      id: 'happisburgh', title: 'Happisburgh footprints', short: 'Happisburgh', human: true,
      dateText: 'About 950,000 to 850,000 years ago (Early Pleistocene)', placeText: 'Happisburgh, Norfolk, England',
      lon: 1.53, lat: 52.82, plate: 315, fromMa: 0.95, toMa: 0.85, jumpMa: 0.9,
      summary: [
        'About 150 footprints, a dozen clearly preserved, of a small group of adults and children on an estuary mudflat, exposed by waves on the beach in May 2013 and recorded in photographs before the sea washed them away within two weeks. They are the oldest known human footprints outside Africa.',
      ],
      facts: [
        { label: 'Laid', value: 'About 950,000 to 850,000 years ago' },
        { label: 'Trackmaker', value: 'Probably Homo antecessor, though no bones have been found at the site' },
        { label: 'Today', value: 'Destroyed by the sea in 2013; known from photographs and 3D models' },
      ],
      keywords: ['happisburgh', 'norfolk', 'england', 'pleistocene', 'homo antecessor', 'oldest footprints europe'],
    }),
    trackway({
      id: 'white-sands', title: 'White Sands footprints', short: 'White Sands', human: true,
      dateText: 'About 23,000 to 21,000 years ago (Late Pleistocene)', placeText: 'White Sands National Park, New Mexico, USA',
      lon: -106.3, lat: 32.8, plate: 101, fromMa: 0.023, toMa: 0.021, jumpMa: 0.022,
      summary: [
        'Thousands of footprints on the shore of an ancient lake, made by people, many of them children and teenagers, along with mammoths, giant ground sloths, camels and wolf-like canids. Some trackways seem to show people and sloths interacting.',
        'Dated in 2021 from seeds and confirmed in 2023 with pollen and quartz, they show that people were in North America during the height of the last Ice Age, thousands of years earlier than long thought. Some researchers still question the dates.',
      ],
      facts: [
        { label: 'Laid', value: 'About 23,000 to 21,000 years ago' },
        { label: 'Dating', value: 'Seeds (2021), confirmed by conifer pollen and quartz (2023)' },
      ],
      trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'Modern humans, the oldest firm evidence of people in the Americas if the dates hold.' }],
      keywords: ['white sands', 'new mexico', 'ice age', 'pleistocene', 'first americans', 'ground sloth'],
    }),
  ],
};
