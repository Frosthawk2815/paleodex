// More fossil trackways worldwide, from Devonian tetrapods to people in the last few thousand years.

import { trackway } from '@/data/sets/trackway';
import type { DataSet } from '@/data/sets/types';

export const TRACKWAYS_2: DataSet = {
  clades: [
    {
      id: 'cetiosauridae',
      name: 'Cetiosauridae',
      common: 'Cetiosaurs',
      parent: 'sauropodomorpha',
      family: true,
      description: 'Early long-necked sauropods of the Middle Jurassic, outside the later diplodocoids and macronarians. Whether they form a true family or just a grade of early sauropods is debated.',
    },
  ],
  species: [
    {
      id: 'cetiosaurus-oxoniensis',
      name: 'Cetiosaurus oxoniensis',
      common: 'Cetiosaurus',
      clade: 'cetiosauridae',
      status: 'full',
      ageText: 'About 168 to 166 million years ago (Middle Jurassic, Bathonian)',
      placeText: 'Oxfordshire and Rutland, England',
      formations: ['great-oolite'],
      summary: [
        'A long-necked plant-eater about 16 m long, the first sauropod ever named. Richard Owen named the genus in 1841 from huge vertebrae and thought they came from a giant sea-going reptile, hence the name “whale lizard”. Only when John Phillips dug up three skeletons near Bletchingdon, Oxfordshire, in 1869–70 and named this species in 1871 did it become clear it was a land animal.',
        'A fairly complete skeleton found in a quarry near Rutland Water in 1968, the “Rutland dinosaur”, is mounted in Leicester. Cetiosaurus is thought to have made the 220 m trackway at Dewars Farm, the longest known in Europe, though no bones were found with the prints.',
      ],
      facts: [
        { label: 'Genus named', value: 'Richard Owen, 1841' },
        { label: 'Species named', value: 'John Phillips, 1871' },
        { label: 'Length', value: 'About 16 m' },
        { label: 'Diet', value: 'Plants' },
        { label: 'Name trouble', value: 'For a century many unrelated sauropod bones were lumped into Cetiosaurus; in 2014 the ICZN fixed C. oxoniensis as the type species' },
      ],
      keywords: ['cetiosaurus', 'whale lizard', 'sauropod', 'owen', 'rutland dinosaur', 'bletchingdon', 'jurassic', 'dewars farm'],
    },
  ],
  events: [
    // ── Palaeozoic ──
    trackway({
      id: 'valentia', title: 'Valentia Island tetrapod trackway', short: 'Valentia',
      dateText: 'About 385 million years ago (late Middle Devonian)', placeText: 'Valentia Island, County Kerry, Ireland',
      lon: -10.35, lat: 51.93, plate: 315, fromMa: 387, toMa: 383, jumpMa: 385,
      summary: [
        'A trail of about 150 prints left by a four-legged animal crossing a river floodplain, found in 1992 by geology student Iwan Stössel. It is one of the oldest records of vertebrates walking.',
        'The age comes from a dated volcanic ash in the same rocks. A few researchers have questioned whether every mark was made by a tetrapod rather than a fish or by water, but most accept it as a tetrapod trackway.',
      ],
      facts: [
        { label: 'Laid', value: 'About 385 million years ago' },
        { label: 'Found', value: 'Iwan Stössel, 1992' },
        { label: 'Trackmaker', value: 'An early tetrapod, species unknown' },
      ],
      keywords: ['valentia', 'ireland', 'kerry', 'devonian', 'tetrapod'],
    }),
    trackway({
      id: 'manakacha', title: 'Grand Canyon Manakacha trackway', short: 'Manakacha',
      dateText: 'About 313 million years ago (Late Carboniferous)', placeText: 'Bright Angel Trail, Grand Canyon, Arizona, USA',
      lon: -112.12, lat: 36.08, plate: 133, fromMa: 314, toMa: 312, jumpMa: 313,
      summary: [
        'Two trails of footprints on a boulder that fell beside the Bright Angel Trail, spotted by geologist Allan Krill in 2016 and described in 2020. They are the oldest vertebrate tracks known from the Grand Canyon.',
        'The prints show a lateral-sequence walk, with legs on one side moving one after the other, as in living dogs and cats. The maker was an early reptile-like amniote or synapsid. Younger rocks in the canyon, such as the Coconino Sandstone, hold many Permian trackways.',
      ],
      facts: [
        { label: 'Laid', value: 'About 313 million years ago' },
        { label: 'Found', value: 'Allan Krill, 2016; described by Stephen Rowland and colleagues, 2020' },
        { label: 'Trackmaker', value: 'An early amniote, species unknown' },
      ],
      keywords: ['grand canyon', 'bright angel', 'manakacha', 'arizona', 'carboniferous', 'coconino'],
    }),
    trackway({
      id: 'bromacker', title: 'Bromacker trackways', short: 'Bromacker',
      dateText: 'About 290 million years ago (Early Permian)', placeText: 'Tambach-Dietharz, Thuringian Forest, Germany',
      lon: 10.6, lat: 50.83, plate: 305, fromMa: 292, toMa: 288, jumpMa: 290,
      summary: [
        'A quarry where both footprints and skeletons of the same upland animals are found, which lets scientists match tracks to their makers, something rarely possible.',
        'A 2015 study used the skeleton of the diadectid Orobates to show that one kind of track, Ichniotherium sphaerodactylum, matches its feet; another, Ichniotherium cottae, matches the related Diadectes found here.',
      ],
      facts: [
        { label: 'Laid', value: 'About 290 million years ago' },
        { label: 'Trackmakers', value: 'Diadectids such as Orobates and Diadectes absitus, early reptiles and synapsids' },
      ],
      keywords: ['bromacker', 'tambach', 'thuringia', 'germany', 'permian', 'orobates', 'ichniotherium'],
    }),
    trackway({
      id: 'robledo', title: 'Prehistoric Trackways National Monument', short: 'Robledo Mountains',
      dateText: 'About 285 to 280 million years ago (Early Permian)', placeText: 'Robledo Mountains, near Las Cruces, New Mexico, USA',
      lon: -106.85, lat: 32.43, plate: 101, fromMa: 286, toMa: 280, jumpMa: 283,
      summary: [
        'Thousands of tracks of amphibians, reptiles, synapsids and insects on a tidal flat, from long before the dinosaurs. Amateur palaeontologist Jerry MacDonald found and collected many of them from 1987, and the area became a national monument in 2009.',
      ],
      facts: [
        { label: 'Laid', value: 'About 285 to 280 million years ago' },
        { label: 'Found', value: 'Jerry MacDonald, from 1987' },
        { label: 'Protected', value: 'National monument since 2009' },
      ],
      trackmakers: [
        { id: 'dimetrodon-limbatus', certainty: 'possible', note: 'The track type Dimetropus is thought to have been made by sphenacodont synapsids like Dimetrodon, which lived in the region; the exact species is unknown.' },
      ],
      keywords: ['prehistoric trackways', 'robledo', 'las cruces', 'new mexico', 'permian', 'dimetropus'],
    }),

    // ── Triassic and Jurassic ──
    trackway({
      id: 'hildburghausen', title: 'Chirotherium tracks of Hildburghausen', short: 'Hildburghausen',
      dateText: 'About 247 to 243 million years ago (Early to Middle Triassic)', placeText: 'Hildburghausen, Thuringia, Germany',
      lon: 10.73, lat: 50.43, plate: 305, fromMa: 247, toMa: 243, jumpMa: 245,
      summary: [
        'Hand-shaped prints found in sandstone quarries in 1833, described in 1834 and named Chirotherium (“hand beast”) in 1835. Early guesses for the maker included a bear, an ape or a giant marsupial; Richard Owen later suggested a giant amphibian.',
        'The puzzle lasted more than a century. In 1965 Bernard Krebs showed that the feet of the Triassic archosaur Ticinosuchus fit the prints, and similar reptiles such as Arizonasaurus are also candidates. The outer “thumb” is actually the fifth toe.',
      ],
      facts: [
        { label: 'Laid', value: 'About 245 million years ago' },
        { label: 'Found', value: '1833; named Chirotherium by Johann Kaup in 1835' },
        { label: 'Trackmaker', value: 'A pseudosuchian archosaur' },
      ],
      trackmakers: [
        { id: 'ticinosuchus-ferox', certainty: 'possible', note: 'Its feet match the prints closely, but it lived a little later and farther south; a close relative probably made them.' },
      ],
      keywords: ['chirotherium', 'hildburghausen', 'thuringia', 'germany', 'triassic', 'hand beast'],
    }),
    trackway({
      id: 'rocky-hill', title: 'Dinosaur State Park tracks', short: 'Rocky Hill',
      dateText: 'About 200 million years ago (Early Jurassic)', placeText: 'Rocky Hill, Connecticut, USA',
      lon: -72.66, lat: 41.65, plate: 101, fromMa: 201, toMa: 199, jumpMa: 200,
      summary: [
        'About 2,000 footprints uncovered in 1966 by bulldozer operator Edward McCarthy while digging for a state building. About 500 are now under a dome, one of the largest dinosaur track displays in North America.',
        'The tracks are Eubrontes, three-toed prints of a large theropod walking along a lake in a rift valley that formed as Pangaea split. Eubrontes is Connecticut’s state fossil.',
      ],
      facts: [
        { label: 'Laid', value: 'About 200 million years ago' },
        { label: 'Found', value: 'Edward McCarthy, 1966' },
        { label: 'Track type', value: 'Eubrontes' },
      ],
      trackmakers: [
        { id: 'dilophosaurus-wetherilli', certainty: 'possible', note: 'Eubrontes tracks are often linked to a Dilophosaurus-sized theropod, but no bones are found with them and Dilophosaurus itself is known only from Arizona.' },
      ],
      keywords: ['dinosaur state park', 'rocky hill', 'connecticut', 'jurassic', 'eubrontes'],
    }),
    trackway({
      id: 'st-george', title: 'St. George Dinosaur Discovery Site', short: 'St. George',
      dateText: 'About 199 million years ago (earliest Jurassic)', placeText: 'Johnson Farm, St. George, Utah, USA',
      lon: -113.53, lat: 37.11, plate: 132, fromMa: 200, toMa: 198, jumpMa: 199,
      summary: [
        'Found in 2000 by Sheldon Johnson while levelling land, on the shore of an ancient lake. Besides walking tracks there are rare swim traces, where dinosaurs scraped the bottom with their claws, and marks of resting theropods.',
      ],
      facts: [
        { label: 'Laid', value: 'About 199 million years ago' },
        { label: 'Found', value: 'Sheldon Johnson, 2000' },
        { label: 'Rocks', value: 'Moenave Formation' },
      ],
      trackmakers: [
        { id: 'dilophosaurus-wetherilli', certainty: 'possible', note: 'The large theropod tracks fit an animal like Dilophosaurus, known from slightly younger rocks nearby.' },
      ],
      keywords: ['st george', 'johnson farm', 'utah', 'jurassic', 'swim tracks', 'moenave'],
    }),
    trackway({
      id: 'pedreira-galinha', title: 'Pedreira do Galinha sauropod trackways', short: 'Galinha',
      dateText: 'About 175 million years ago (Middle Jurassic)', placeText: 'Serra de Aire, near Fátima, Portugal',
      lon: -8.6, lat: 39.55, plate: 304, fromMa: 177, toMa: 173, jumpMa: 175,
      summary: [
        'Sauropod trackways in an old limestone quarry, now a natural monument. Two trails run for about 142 and 147 m, among the longest sauropod trackways known, and show clear hand and foot prints of a type named Polyonyx gomesi.',
      ],
      facts: [
        { label: 'Laid', value: 'About 175 million years ago' },
        { label: 'Track type', value: 'Polyonyx gomesi' },
      ],
      keywords: ['pedreira do galinha', 'serra de aire', 'portugal', 'fatima', 'jurassic', 'sauropod'],
    }),
    trackway({
      id: 'skye-tracks', title: 'Isle of Skye dinosaur tracks', short: 'Skye',
      dateText: 'About 170 million years ago (Middle Jurassic)', placeText: 'Brothers’ Point, Isle of Skye, Scotland',
      lon: -6.15, lat: 57.63, plate: 303, fromMa: 171, toMa: 168, jumpMa: 170,
      summary: [
        'Tracks of sauropods, theropods and ornithopods on what was a shallow lagoon shore, from a time with few dinosaur bones anywhere in the world. A 2020 study reported Deltapodus, a track type thought to be made by stegosaurs.',
      ],
      facts: [
        { label: 'Laid', value: 'About 170 million years ago' },
        { label: 'Trackmakers', value: 'Sauropods, theropods, ornithopods and probably stegosaurs; species unknown' },
      ],
      keywords: ['skye', 'brothers point', 'scotland', 'jurassic', 'deltapodus'],
    }),
    trackway({
      id: 'dewars-farm', title: 'Dewars Farm Quarry trackways (“Dinosaur Highway”)', short: 'Dewars Farm',
      dateText: 'About 166 million years ago (Middle Jurassic, Bathonian)', placeText: 'Near Bicester, Oxfordshire, England',
      lon: -1.35, lat: 51.82, plate: 315, fromMa: 167, toMa: 165, jumpMa: 166,
      summary: [
        'Hundreds of footprints on what was a shallow tropical lagoon shore, uncovered in a working limestone quarry after worker Gary Johnson noticed odd bumps in the clay. A first dig in 2024, announced in January 2025, exposed five trackways, the longest more than 150 m: four of sauropods and one of a large theropod whose path crosses theirs.',
        'A second dig in summer 2025, announced in October 2025 by the Oxford University Museum of Natural History and the University of Birmingham, followed one sauropod trail for about 220 m from first to last exposed print, nearly 100 footprints each close to a metre long. It is the longest sauropod trackway known in Europe, longer than Plagne in France (about 155 m), and may be the longest known anywhere. It may extend further still under unquarried rock.',
      ],
      facts: [
        { label: 'Laid', value: 'About 166 million years ago' },
        { label: 'Found', value: 'Gary Johnson, quarry worker; dug 2024 and 2025' },
        { label: 'Longest trackway', value: 'About 220 m, one sauropod (2025 dig)' },
        { label: 'Also called', value: 'The “Dinosaur Highway”' },
      ],
      trackmakers: [
        { id: 'cetiosaurus-oxoniensis', certainty: 'likely', note: 'The researchers think the sauropod tracks were made by Cetiosaurus, the sauropod known from bones of the same age in Oxfordshire. No bones were found with the tracks, and some palaeontologists think naming the maker goes too far.' },
        { id: 'megalosaurus-bucklandii', certainty: 'likely', note: 'The only large theropod known from rocks of this age in the region; Megalosaurus was first named from nearby Stonesfield.' },
      ],
      keywords: ['dewars farm', 'oxfordshire', 'bicester', 'england', 'jurassic', 'megalosaurus', 'cetiosaurus', 'sauropod', 'dinosaur highway', 'longest trackway'],
    }),
    trackway({
      id: 'purgatoire', title: 'Purgatoire River tracksite', short: 'Purgatoire',
      dateText: 'About 150 million years ago (Late Jurassic)', placeText: 'Picket Wire Canyonlands, Colorado, USA',
      lon: -103.55, lat: 37.6, plate: 101, fromMa: 152, toMa: 148, jumpMa: 150,
      summary: [
        'More than 1,300 footprints on the shore of an ancient lake, the largest dinosaur track site in North America. Several sauropod trackways run side by side in the same direction, one of the first pieces of evidence that sauropods moved in groups.',
      ],
      facts: [
        { label: 'Laid', value: 'About 150 million years ago' },
        { label: 'Rocks', value: 'Morrison Formation' },
      ],
      trackmakers: [
        { id: 'allosaurus-fragilis', certainty: 'possible', note: 'The large theropod tracks fit Allosaurus, the most common big predator in the Morrison Formation.' },
      ],
      keywords: ['purgatoire', 'picket wire', 'colorado', 'jurassic', 'morrison', 'sauropod herd'],
    }),
    trackway({
      id: 'courtedoux', title: 'Courtedoux tracksites', short: 'Courtedoux',
      dateText: 'About 152 million years ago (Late Jurassic)', placeText: 'Courtedoux, Canton of Jura, Switzerland',
      lon: 7.04, lat: 47.41, plate: 305, fromMa: 153, toMa: 151, jumpMa: 152,
      summary: [
        'Thousands of footprints in more than 280 trackways, found from 2002 during construction of the A16 motorway and recorded before the road was built. Sauropods and theropods walked across tidal flats on islands in a shallow tropical sea.',
      ],
      facts: [
        { label: 'Laid', value: 'About 152 million years ago' },
        { label: 'Found', value: 'During motorway building, from 2002' },
      ],
      keywords: ['courtedoux', 'jura', 'switzerland', 'a16', 'jurassic', 'sauropod'],
    }),
    trackway({
      id: 'crayssac', title: 'Crayssac pterosaur tracks (“Pterosaur Beach”)', short: 'Crayssac',
      dateText: 'About 150 million years ago (Late Jurassic, early Tithonian)', placeText: 'Crayssac, Lot, France',
      lon: 1.33, lat: 44.5, plate: 305, fromMa: 151, toMa: 149, jumpMa: 150,
      summary: [
        'A lagoon shore crossed by pterosaurs, crocodile relatives, turtles and small dinosaurs. A 2009 study described a trackway showing a pterosaur landing: two foot drags as it touched down, a hop, then the hands coming down as it walked off on all fours.',
      ],
      facts: [
        { label: 'Laid', value: 'About 150 million years ago' },
        { label: 'Trackmaker', value: 'A small pterodactyloid pterosaur' },
      ],
      keywords: ['crayssac', 'pterosaur beach', 'lot', 'france', 'jurassic', 'pterosaur landing'],
    }),

    // ── Cretaceous ──
    trackway({
      id: 'munchehagen', title: 'Münchehagen tracksite', short: 'Münchehagen',
      dateText: 'About 140 million years ago (Early Cretaceous, Berriasian)', placeText: 'Münchehagen, Lower Saxony, Germany',
      lon: 9.13, lat: 52.43, plate: 315, fromMa: 142, toMa: 139, jumpMa: 140,
      summary: [
        'Sauropod and ornithopod trackways in sandstone of a coastal plain, protected under a hall at the Dinosaurier-Park Münchehagen. Some sauropod trails are among the best preserved in Europe.',
      ],
      facts: [
        { label: 'Laid', value: 'About 140 million years ago' },
        { label: 'Trackmakers', value: 'Sauropods, iguanodontians and theropods; species unknown' },
      ],
      keywords: ['munchehagen', 'lower saxony', 'germany', 'cretaceous', 'sauropod'],
    }),
    trackway({
      id: 'sousa', title: 'Valley of the Dinosaurs, Sousa', short: 'Sousa',
      dateText: 'About 140 to 125 million years ago (Early Cretaceous)', placeText: 'Sousa, Paraíba, Brazil',
      lon: -38.23, lat: -6.75, plate: 201, fromMa: 140, toMa: 125, jumpMa: 133,
      summary: [
        'Footprints of theropods, sauropods and ornithopods in the Rio do Peixe basin, a rift valley that formed as South America and Africa pulled apart. Tracks have been known here since the 1920s, and dozens of sites are now recorded, the richest in Brazil.',
      ],
      facts: [
        { label: 'Laid', value: 'About 140 to 125 million years ago' },
        { label: 'Trackmakers', value: 'Theropods, sauropods and ornithopods; species unknown' },
      ],
      keywords: ['sousa', 'paraiba', 'brazil', 'vale dos dinossauros', 'rio do peixe', 'cretaceous'],
    }),
    trackway({
      id: 'peace-river', title: 'Peace River Canyon tracks', short: 'Peace River',
      dateText: 'About 115 million years ago (Early Cretaceous)', placeText: 'Near Hudson’s Hope, British Columbia, Canada',
      lon: -122.0, lat: 56.0, plate: 101, fromMa: 117, toMa: 113, jumpMa: 115,
      summary: [
        'Charles M. Sternberg recorded dinosaur tracks here in 1930, the first studied in western Canada. Ornithopods, theropods and armoured dinosaurs walked across coastal swamps that later became coal.',
        'Many tracks were cast or removed before most of the canyon was flooded by a dam reservoir. Others have since been found near Tumbler Ridge.',
      ],
      facts: [
        { label: 'Laid', value: 'About 115 million years ago' },
        { label: 'Found', value: 'Charles M. Sternberg, 1930' },
        { label: 'Rocks', value: 'Gething Formation' },
      ],
      keywords: ['peace river', 'hudsons hope', 'tumbler ridge', 'british columbia', 'canada', 'cretaceous'],
    }),
    trackway({
      id: 'dinosaur-ridge', title: 'Dinosaur Ridge tracks', short: 'Dinosaur Ridge',
      dateText: 'About 100 million years ago (Early to Late Cretaceous)', placeText: 'Near Morrison, Colorado, USA',
      lon: -105.2, lat: 39.68, plate: 101, fromMa: 102, toMa: 98, jumpMa: 100,
      summary: [
        'Hundreds of footprints exposed in 1937 when a road was cut across the ridge, made on the muddy shore of the advancing Western Interior Seaway. Most are of iguanodont-like ornithopods, with theropod tracks and crocodile traces too.',
      ],
      facts: [
        { label: 'Laid', value: 'About 100 million years ago' },
        { label: 'Found', value: 'Road building, 1937' },
        { label: 'Rocks', value: 'Dakota Group sandstone' },
      ],
      keywords: ['dinosaur ridge', 'morrison', 'colorado', 'dakota', 'cretaceous', 'ornithopod'],
    }),
    trackway({
      id: 'el-chocon-tracks', title: 'Villa El Chocón tracks', short: 'El Chocón tracks',
      dateText: 'About 97 million years ago (Late Cretaceous, Cenomanian)', placeText: 'Shore of Lake Ezequiel Ramos Mexía, Neuquén, Argentina',
      lon: -68.75, lat: -39.27, plate: 291, fromMa: 99, toMa: 95, jumpMa: 97,
      summary: [
        'Large three-toed theropod prints and sauropod tracks on the lakeshore near the town where Giganotosaurus was found, exposed when the reservoir level drops.',
      ],
      facts: [
        { label: 'Laid', value: 'About 97 million years ago' },
        { label: 'Rocks', value: 'Candeleros Formation' },
      ],
      trackmakers: [
        { id: 'giganotosaurus-carolinii', certainty: 'possible', note: 'Big theropod tracks in the same formation as Giganotosaurus; the match is size and age only.' },
      ],
      keywords: ['el chocon', 'neuquen', 'argentina', 'cretaceous', 'giganotosaurus', 'candeleros'],
    }),
    trackway({
      id: 'uhangri', title: 'Uhangri pterosaur and dinosaur tracks', short: 'Uhangri',
      dateText: 'About 81 to 79 million years ago (Late Cretaceous, Campanian)', placeText: 'Haenam, South Jeolla, South Korea',
      lon: 126.38, lat: 34.57, plate: 611, fromMa: 81, toMa: 79, jumpMa: 80,
      summary: [
        'Lake-shore tracks of dinosaurs, birds and pterosaurs. The pterosaur prints, named Haenamichnus in 2002, are the largest known, and one trail about 7.3 m long was the longest pterosaur trackway known when described. They were probably made by a giant azhdarchid.',
      ],
      facts: [
        { label: 'Laid', value: 'About 80 million years ago' },
        { label: 'Track type', value: 'Haenamichnus uhangriensis (pterosaur)' },
      ],
      keywords: ['uhangri', 'haenam', 'korea', 'cretaceous', 'pterosaur tracks', 'haenamichnus', 'azhdarchid'],
    }),
    trackway({
      id: 'denali-tracks', title: 'Denali dinosaur tracks', short: 'Denali',
      dateText: 'About 70 million years ago (Late Cretaceous)', placeText: 'Denali National Park, Alaska, USA',
      lon: -149.5, lat: 63.5, plate: 123, fromMa: 72, toMa: 68, jumpMa: 70,
      summary: [
        'Thousands of tracks found since 2005 in a park with almost no dinosaur bones, from a polar forest with dark winters. Hadrosaurs of all ages left prints, from young to adult, suggesting herds; there are also theropod, therizinosaur, bird and pterosaur tracks.',
      ],
      facts: [
        { label: 'Laid', value: 'About 70 million years ago' },
        { label: 'Rocks', value: 'Cantwell Formation' },
      ],
      keywords: ['denali', 'alaska', 'cantwell', 'cretaceous', 'hadrosaur', 'polar dinosaurs'],
    }),
    trackway({
      id: 'fumanya', title: 'Fumanya titanosaur tracks', short: 'Fumanya',
      dateText: 'About 67 million years ago (Late Cretaceous, Maastrichtian)', placeText: 'Fumanya, Berguedà, Catalonia, Spain',
      lon: 1.83, lat: 42.18, plate: 304, fromMa: 68, toMa: 66.5, jumpMa: 67,
      summary: [
        'Nearly 3,000 footprints in more than 50 trackways, exposed on the steep walls of old coal mines in the Pyrenees. They are the largest Late Cretaceous sauropod track site in Europe, left by wide-gauge titanosaurs crossing a coastal mudflat shortly before the end of the age of dinosaurs.',
      ],
      facts: [
        { label: 'Laid', value: 'About 67 million years ago' },
        { label: 'Trackmakers', value: 'Titanosaurs, species unknown' },
      ],
      keywords: ['fumanya', 'catalonia', 'pyrenees', 'spain', 'cretaceous', 'titanosaur'],
    }),

    // ── Cenozoic: hominins and Ice Age animals ──
    trackway({
      id: 'trachilos', title: 'Trachilos footprints', short: 'Trachilos', human: true,
      dateText: 'Disputed: about 6 million years ago (latest Miocene), or perhaps much younger', placeText: 'Trachilos, western Crete, Greece',
      lon: 23.65, lat: 35.5, plate: 330, fromMa: 6.1, toMa: 5.6, jumpMa: 6.05,
      summary: [
        'Prints on an old beach surface that the 2017 describers said show a human-like foot, with a big toe in line with the others. If so, a hominin-like animal walked in Europe more than 5.6 million years ago.',
        'Every part of this is disputed: some researchers say the rocks are about 3 million years old, and others that the marks are not footprints at all, or were made by another animal. It is listed here with that caveat.',
      ],
      facts: [
        { label: 'Laid', value: 'About 6.05 million years ago (2021 estimate); others argue about 3 million' },
        { label: 'Found', value: 'Gerard Gierliński, 2002; described 2017' },
        { label: 'Trackmaker', value: 'Unknown; hominin status disputed' },
      ],
      keywords: ['trachilos', 'crete', 'greece', 'miocene', 'hominin', 'disputed'],
    }),
    trackway({
      id: 'ileret', title: 'Ileret footprints', short: 'Ileret', human: true,
      dateText: 'About 1.53 to 1.51 million years ago (Early Pleistocene)', placeText: 'Ileret, east of Lake Turkana, Kenya',
      lon: 36.2, lat: 4.3, plate: 709, fromMa: 1.53, toMa: 1.51, jumpMa: 1.52,
      summary: [
        'Hominin footprints in two layers of lake-side sediment, described in 2009. They show an essentially modern foot, with an arch, a big toe in line and a modern stride, and later finds at the site show groups walking together.',
        'A 2024 study found a second kind of footprint on the same surface, with a more ape-like, splayed big toe, probably made by Paranthropus boisei. The two species crossed the same lakeshore within hours or days of each other, the first direct evidence of two hominin species sharing ground.',
      ],
      facts: [
        { label: 'Laid', value: 'About 1.52 million years ago' },
        { label: 'Trackmakers', value: 'Probably Homo erectus (also called Homo ergaster) and Paranthropus boisei' },
      ],
      trackmakers: [{ id: 'homo-erectus', certainty: 'likely', note: 'The modern-looking footprints, from their size, shape and age.' }, { id: 'paranthropus-boisei', certainty: 'likely', note: 'A second footprint type, described in 2024, probably made by Paranthropus boisei alongside Homo erectus.' }],
      keywords: ['ileret', 'koobi fora', 'turkana', 'kenya', 'pleistocene', 'homo erectus', 'paranthropus'],
    }),
    trackway({
      id: 'matalascanas', title: 'Matalascañas footprints', short: 'Matalascañas', human: true,
      dateText: 'About 296,000 years ago (Middle Pleistocene)', placeText: 'Asperillo beach, Huelva, Spain',
      lon: -6.55, lat: 37.0, plate: 304, fromMa: 0.313, toMa: 0.279, jumpMa: 0.296,
      summary: [
        'Human footprints exposed by storms on a beach near Doñana. First dated to about 106,000 years, they were redated in 2022 to about 296,000 years, so the makers were early members of the Neanderthal lineage rather than classic Neanderthals.',
      ],
      facts: [
        { label: 'Laid', value: 'About 296,000 ± 17,000 years ago (2022 dating)' },
      ],
      trackmakers: [
        { id: 'homo-neanderthalensis', certainty: 'possible', note: 'At this age the makers belonged to the Neanderthal lineage, but may predate Neanderthals as usually defined.' },
      ],
      keywords: ['matalascanas', 'huelva', 'donana', 'spain', 'pleistocene', 'neanderthal'],
    }),
    trackway({
      id: 'langebaan', title: 'Langebaan footprints (“Eve’s footprints”)', short: 'Langebaan', human: true,
      dateText: 'About 117,000 years ago (Late Pleistocene)', placeText: 'Langebaan Lagoon, Western Cape, South Africa',
      lon: 18.05, lat: -33.08, plate: 701, fromMa: 0.118, toMa: 0.116, jumpMa: 0.117,
      summary: [
        'Three footprints of a modern human walking down a wet dune, found in 1995 by David Roberts and described with Lee Berger in 1997. They were among the oldest known footprints of our species. The “Eve” nickname is popular, not scientific: there is no way to tell the walker’s sex.',
      ],
      facts: [
        { label: 'Laid', value: 'About 117,000 years ago' },
        { label: 'Found', value: 'David Roberts, 1995' },
        { label: 'Today', value: 'Removed to the Iziko South African Museum, Cape Town' },
      ],
      trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'A modern human; the foot shape and age leave no other candidate in southern Africa.' }],
      keywords: ['langebaan', 'eves footprints', 'western cape', 'south africa', 'pleistocene', 'homo sapiens'],
    }),
    trackway({
      id: 'le-rozel', title: 'Le Rozel footprints', short: 'Le Rozel', human: true,
      dateText: 'About 80,000 years ago (Late Pleistocene)', placeText: 'Le Rozel, Normandy, France',
      lon: -1.84, lat: 49.48, plate: 305, fromMa: 0.082, toMa: 0.078, jumpMa: 0.08,
      summary: [
        'Some 257 footprints in coastal dune sand, excavated from 2012 and published in 2019, along with stone tools. Most were made by children and teenagers, giving a rare look at the make-up of a Neanderthal group.',
      ],
      facts: [
        { label: 'Laid', value: 'About 80,000 years ago' },
        { label: 'Prints', value: '257, the largest Neanderthal footprint collection known' },
      ],
      trackmakers: [{ id: 'homo-neanderthalensis', certainty: 'likely', note: 'Neanderthals were the only humans in western Europe at this time, and their tools are found in the same layers.' }],
      keywords: ['le rozel', 'normandy', 'france', 'pleistocene', 'neanderthal'],
    }),
    trackway({
      id: 'willandra', title: 'Willandra Lakes footprints', short: 'Willandra', human: true,
      dateText: 'About 23,000 to 19,000 years ago (Late Pleistocene)', placeText: 'Mungo National Park, New South Wales, Australia',
      lon: 143.0, lat: -33.7, plate: 801, fromMa: 0.023, toMa: 0.019, jumpMa: 0.021,
      summary: [
        'More than 700 footprints of men, women and children, the largest set of Ice Age human footprints known when found. Mary Pappin Jr., a Mutthi Mutthi woman, spotted them in 2003. One trail appears to show a person running fast, and one a one-legged man walking with a stick.',
      ],
      facts: [
        { label: 'Laid', value: 'About 21,000 years ago' },
        { label: 'Found', value: 'Mary Pappin Jr., 2003' },
      ],
      trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'Aboriginal Australians, ancestors of the people of the Willandra Lakes today.' }],
      keywords: ['willandra', 'mungo', 'new south wales', 'australia', 'pleistocene', 'aboriginal'],
    }),
    trackway({
      id: 'engare-sero', title: 'Engare Sero footprints', short: 'Engare Sero', human: true,
      dateText: 'Between about 19,000 and 6,000 years ago (most likely 12,000 to 10,000)', placeText: 'Near Lake Natron, northern Tanzania',
      lon: 35.95, lat: -2.6, plate: 709, fromMa: 0.019, toMa: 0.0058, jumpMa: 0.011,
      summary: [
        'More than 400 human footprints in volcanic mudflow from the nearby volcano Ol Doinyo Lengai, the largest collection of human footprints in Africa. A 2020 study suggested one group was mostly women walking together, with a few men and children passing.',
      ],
      facts: [
        { label: 'Laid', value: 'Between about 19,000 and 6,000 years ago' },
        { label: 'Prints', value: 'More than 400' },
      ],
      trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'Modern humans.' }],
      keywords: ['engare sero', 'lake natron', 'ol doinyo lengai', 'tanzania', 'pleistocene'],
    }),
    trackway({
      id: 'pehuen-co', title: 'Pehuen-Có megafauna tracks', short: 'Pehuen-Có',
      dateText: 'About 12,000 radiocarbon years ago (Late Pleistocene)', placeText: 'Pehuen-Có, Buenos Aires Province, Argentina',
      lon: -61.55, lat: -39.0, plate: 290, fromMa: 0.0145, toMa: 0.013, jumpMa: 0.014,
      summary: [
        'Footprints of giant ground sloths, Macrauchenia, mastodon-like gomphotheres, giant armadillo relatives, camelids and birds on an old mudflat, exposed on a beach after a storm in 1986 and found by Teresa Manera. Eleven kinds of mammal track and four of birds are recorded. The site is now a provincial reserve.',
      ],
      facts: [
        { label: 'Laid', value: 'About 12,000 radiocarbon years ago (roughly 14,000 calendar years)' },
        { label: 'Found', value: 'Teresa Manera, 1986' },
      ],
      trackmakers: [
        { id: 'megatherium-americanum', certainty: 'likely', note: 'The largest sloth tracks match Megatherium, the giant ground sloth of the Pampas.' },
        { id: 'macrauchenia-patachonica', certainty: 'likely', note: 'Three-toed tracks named Macrauchenichnus match the feet of Macrauchenia.' },
      ],
      keywords: ['pehuen co', 'buenos aires', 'argentina', 'pleistocene', 'megatherium', 'macrauchenia', 'ground sloth'],
    }),
    trackway({
      id: 'formby', title: 'Formby Point footprints', short: 'Formby', human: true,
      dateText: 'About 8,000 to 4,500 years ago (Mesolithic to Neolithic)', placeText: 'Formby Point, Merseyside, England',
      lon: -3.1, lat: 53.55, plate: 315, fromMa: 0.008, toMa: 0.0045, jumpMa: 0.0065,
      summary: [
        'Footprints of people, red and roe deer, aurochs and cranes in mud layers that wash out of the beach and are destroyed by the next tides. Local teacher Gordon Roberts recorded thousands of them over more than 25 years.',
      ],
      facts: [
        { label: 'Laid', value: 'About 8,000 to 4,500 years ago' },
        { label: 'Recorded', value: 'Gordon Roberts, from 1989' },
      ],
      trackmakers: [
        { id: 'homo-sapiens', certainty: 'known', note: 'Mesolithic and Neolithic people, including children, perhaps hunting and gathering on the mudflats.' },
        { id: 'bos-primigenius', certainty: 'likely', note: 'Large cloven-hoofed prints match the extinct wild ox.' },
      ],
      keywords: ['formby', 'merseyside', 'england', 'mesolithic', 'neolithic', 'aurochs'],
    }),
    trackway({
      id: 'acahualinca', title: 'Footprints of Acahualinca', short: 'Acahualinca', human: true,
      dateText: 'About 2,100 years ago', placeText: 'Managua, Nicaragua',
      lon: -86.3, lat: 12.15, plate: 204, fromMa: 0.0023, toMa: 0.0019, jumpMa: 0.0021,
      summary: [
        'Footprints of 15 or 16 people walking towards Lake Managua across fresh volcanic ash, found in the 1870s and now in a site museum. Early estimates put them at 5,000 years or more; dating of the ash from an eruption of Masaya places them at about 2,100 years. Animal tracks cross the human ones at a different time.',
      ],
      facts: [
        { label: 'Laid', value: 'About 2,100 years ago' },
        { label: 'Ash', value: 'From the Masaya volcano' },
      ],
      trackmakers: [{ id: 'homo-sapiens', certainty: 'known', note: 'Ancient Nicaraguans.' }],
      keywords: ['acahualinca', 'managua', 'nicaragua', 'masaya', 'volcanic ash'],
    }),
  ],
};
