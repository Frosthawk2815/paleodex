// Living things in PaleoDex: groups (clades) arranged as a family tree, and the species in them.
// A species belongs to one group; a group lists everything in it and in the groups below it.
// Species link to the rock formations they are found in (events with kind 'Rock formation').

export type Clade = {
  id: string;
  name: string; // scientific name
  common: string; // everyday name, e.g. "tyrannosaurs"
  parent?: string;
  // Families are the groups species are listed under in a formation's "life found here".
  family?: boolean;
  description: string;
};

export type Species = {
  id: string;
  name: string; // binomial, e.g. "Tyrannosaurus rex"
  common?: string;
  clade: string;
  // 'full' entries have a complete write-up; 'brief' ones are short until filled out.
  status: 'full' | 'brief';
  ageText: string;
  placeText: string;
  // Formations in PaleoDex (event ids) the species is found in, in the order to show them.
  formations: string[];
  // Other formations it's known from that aren't in PaleoDex yet.
  otherFormations?: string[];
  summary: string[];
  facts?: { label: string; value: string }[];
  keywords?: string[];
};

export const CLADES: Clade[] = [
  {
    id: 'dinosauria',
    name: 'Dinosauria',
    common: 'Dinosaurs',
    description: 'Reptiles with an upright, pillar-like stance that dominated land life for over 150 million years. Birds are their living descendants.',
  },
  {
    id: 'theropoda',
    name: 'Theropoda',
    common: 'Theropods',
    parent: 'dinosauria',
    description: 'Two-legged, mostly meat-eating dinosaurs with hollow bones and three main toes. The group includes birds.',
  },
  {
    id: 'coelurosauria',
    name: 'Coelurosauria',
    common: 'Coelurosaurs',
    parent: 'theropoda',
    description: 'Theropods closer to birds than to Allosaurus, including tyrannosaurs, ostrich-mimics, raptors and birds. Many were feathered.',
  },
  {
    id: 'tyrannosauroidea',
    name: 'Tyrannosauroidea',
    common: 'Tyrannosaurs',
    parent: 'coelurosauria',
    family: true,
    description:
      'The tyrant dinosaurs. They began in the Jurassic as small, often crested and feathered hunters, and ended as the giant top predators of Late Cretaceous Asia and North America.',
  },
  {
    id: 'tyrannosauridae',
    name: 'Tyrannosauridae',
    common: 'Tyrannosaurids',
    parent: 'tyrannosauroidea',
    description: 'The large, deep-skulled tyrannosaurs of the last 20 million years of the Cretaceous, with tiny two-fingered arms and bone-crushing bites.',
  },
  {
    id: 'albertosaurinae',
    name: 'Albertosaurinae',
    common: 'Albertosaurines',
    parent: 'tyrannosauridae',
    description: 'Lighter, longer-legged tyrannosaurids from western North America.',
  },
  {
    id: 'tyrannosaurinae',
    name: 'Tyrannosaurinae',
    common: 'Tyrannosaurines',
    parent: 'tyrannosauridae',
    description: 'The heavier tyrannosaurids, from Daspletosaurus to Tyrannosaurus, plus the long-snouted alioramins of Asia.',
  },
];

export const SPECIES: Species[] = [
  {
    id: 'tyrannosaurus-rex',
    name: 'Tyrannosaurus rex',
    common: 'T. rex',
    clade: 'tyrannosaurinae',
    status: 'full',
    ageText: 'About 68 to 66 million years ago (latest Cretaceous)',
    placeText: 'Western North America',
    formations: ['hell-creek', 'ojo-alamo'],
    otherFormations: ['Lance (Wyoming)', 'Scollard (Alberta)', 'Frenchman (Saskatchewan)', 'North Horn (Utah)'],
    summary: [
      'Tyrannosaurus rex, the “tyrant lizard king”, was one of the largest meat-eating land animals ever. It was the top predator of western North America in the last two million years before the asteroid impact, living alongside Triceratops and Edmontosaurus.',
      'Adults reached about 12 m long and around 8 tonnes. A 1.5 m skull, banana-sized teeth and one of the strongest bites of any land animal let it crush bone. Its arms were short but muscular, with two fingers.',
      'Growth rings in its bones show it grew slowly as a juvenile, then put on hundreds of kilograms a year as a teenager, reaching full size at around 20 and living to about 30. Its brain had large smell centres, and its forward-facing eyes gave it good depth perception.',
      'Skin impressions show small scales on its body; its smaller, earlier relatives such as Yutyrannus had feathers. A 2023 study of tooth wear and living reptiles suggests it had lips covering its teeth, unlike most older reconstructions.',
      'Its family tree is still debated. A 2022 proposal to split it into three species was widely rejected. In 2024 an older, closely related species, Tyrannosaurus mcraeensis, was named from about 72-million-year-old rocks in New Mexico. And a 2025 study of the “Dueling Dinosaurs” fossil argued that some small Hell Creek tyrannosaurs long thought to be young T. rex belong to a separate animal, Nanotyrannus.',
    ],
    facts: [
      { label: 'Named', value: 'Henry Fairfield Osborn, 1905' },
      { label: 'Length', value: 'About 12 m' },
      { label: 'Weight', value: 'About 8 tonnes' },
      { label: 'Diet', value: 'Meat: a hunter and scavenger' },
      { label: 'Lifespan', value: 'About 30 years' },
      { label: 'Famous fossils', value: '“Sue” (Chicago), “Stan”, “Scotty” (Saskatchewan)' },
    ],
    keywords: ['trex', 't-rex', 't rex', 'tyrant lizard'],
  },
  {
    id: 'nanotyrannus-lancensis',
    name: 'Nanotyrannus lancensis',
    common: 'Nanotyrannus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 67 to 66 million years ago',
    placeText: 'Montana, Wyoming and the Dakotas, USA',
    formations: ['hell-creek'],
    otherFormations: ['Lance (Wyoming)'],
    summary: [
      'A slender tyrannosaur about 5 to 6 m long from the very end of the Cretaceous. For decades many experts treated its fossils as young T. rex; a 2025 study of the “Dueling Dinosaurs” fossil argued it was a separate, small adult species. Where it sits in the tyrannosaur family is still debated.',
    ],
    keywords: ['nano', 'dueling dinosaurs', 'duelling dinosaurs'],
  },
  {
    id: 'tyrannosaurus-mcraeensis',
    name: 'Tyrannosaurus mcraeensis',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 73 to 71 million years ago',
    placeText: 'New Mexico, USA (Hall Lake Formation)',
    formations: [],
    otherFormations: ['Hall Lake (New Mexico)'],
    summary: ['A Tyrannosaurus species named in 2024 from a partial skull, several million years older than T. rex. Not all researchers accept it as distinct.'],
  },
  {
    id: 'tarbosaurus-bataar',
    name: 'Tarbosaurus bataar',
    common: 'Tarbosaurus',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 70 million years ago',
    placeText: 'Mongolia and China (Nemegt Formation)',
    formations: [],
    otherFormations: ['Nemegt (Mongolia)'],
    summary: ['Asia’s giant tyrannosaurid, a close relative of T. rex, up to about 10 m long.'],
  },
  {
    id: 'daspletosaurus-torosus',
    name: 'Daspletosaurus torosus',
    common: 'Daspletosaurus',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 77 to 75 million years ago',
    placeText: 'Alberta, Canada (Oldman Formation)',
    formations: [],
    otherFormations: ['Oldman (Alberta)'],
    summary: ['A heavily built tyrannosaurine about 9 m long, one of the earlier relatives on the line to Tyrannosaurus.'],
  },
  {
    id: 'lythronax-argestes',
    name: 'Lythronax argestes',
    common: 'Lythronax',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 80 million years ago',
    placeText: 'Utah, USA (Wahweap Formation)',
    formations: [],
    otherFormations: ['Wahweap (Utah)'],
    summary: ['An early tyrannosaurine with a short, broad skull and forward-facing eyes.'],
  },
  {
    id: 'teratophoneus-curriei',
    name: 'Teratophoneus curriei',
    common: 'Teratophoneus',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 76 million years ago',
    placeText: 'Utah, USA (Kaiparowits Formation)',
    formations: [],
    otherFormations: ['Kaiparowits (Utah)'],
    summary: ['A mid-sized, short-snouted tyrannosaurine from southern Laramidia.'],
  },
  {
    id: 'alioramus-remotus',
    name: 'Alioramus remotus',
    common: 'Alioramus',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 70 million years ago',
    placeText: 'Mongolia (Nemegt Formation)',
    formations: [],
    otherFormations: ['Nemegt (Mongolia)'],
    summary: ['A lightly built, long-snouted tyrannosaurid with a row of small bumps along its nose.'],
  },
  {
    id: 'qianzhousaurus-sinensis',
    name: 'Qianzhousaurus sinensis',
    common: 'Qianzhousaurus',
    clade: 'tyrannosaurinae',
    status: 'brief',
    ageText: 'About 66 million years ago',
    placeText: 'Jiangxi, China (Nanxiong Formation)',
    formations: [],
    otherFormations: ['Nanxiong (China)'],
    summary: ['A long-snouted relative of Alioramus, nicknamed “Pinocchio rex”.'],
  },
  {
    id: 'albertosaurus-sarcophagus',
    name: 'Albertosaurus sarcophagus',
    common: 'Albertosaurus',
    clade: 'albertosaurinae',
    status: 'brief',
    ageText: 'About 71 to 68 million years ago',
    placeText: 'Alberta, Canada (Horseshoe Canyon Formation)',
    formations: [],
    otherFormations: ['Horseshoe Canyon (Alberta)'],
    summary: ['A lighter, faster relative of T. rex about 9 m long. A bonebed of many individuals suggests it may sometimes have lived in groups.'],
  },
  {
    id: 'gorgosaurus-libratus',
    name: 'Gorgosaurus libratus',
    common: 'Gorgosaurus',
    clade: 'albertosaurinae',
    status: 'brief',
    ageText: 'About 77 to 75 million years ago',
    placeText: 'Alberta, Canada and Montana, USA (Dinosaur Park Formation)',
    formations: [],
    otherFormations: ['Dinosaur Park (Alberta)'],
    summary: ['The best-known albertosaurine, from dozens of skeletons, about 8 to 9 m long.'],
  },
  {
    id: 'appalachiosaurus-montgomeriensis',
    name: 'Appalachiosaurus montgomeriensis',
    common: 'Appalachiosaurus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 77 million years ago',
    placeText: 'Alabama, USA',
    formations: [],
    summary: ['A tyrannosaur from Appalachia, the eastern landmass of Late Cretaceous North America.'],
  },
  {
    id: 'dryptosaurus-aquilunguis',
    name: 'Dryptosaurus aquilunguis',
    common: 'Dryptosaurus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 67 million years ago',
    placeText: 'New Jersey, USA',
    formations: [],
    summary: ['An eastern North American tyrannosaur with longer arms and large hand claws than its western cousins.'],
  },
  {
    id: 'timurlengia-euotica',
    name: 'Timurlengia euotica',
    common: 'Timurlengia',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 90 million years ago',
    placeText: 'Uzbekistan (Bissekty Formation)',
    formations: [],
    otherFormations: ['Bissekty (Uzbekistan)'],
    summary: ['A horse-sized tyrannosaur whose braincase shows the keen hearing that later giants inherited.'],
  },
  {
    id: 'moros-intrepidus',
    name: 'Moros intrepidus',
    common: 'Moros',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 96 million years ago',
    placeText: 'Utah, USA (Cedar Mountain Formation)',
    formations: [],
    otherFormations: ['Cedar Mountain (Utah)'],
    summary: ['A small, fast tyrannosaur from soon after the family arrived in North America from Asia.'],
  },
  {
    id: 'yutyrannus-huali',
    name: 'Yutyrannus huali',
    common: 'Yutyrannus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 125 million years ago (Early Cretaceous)',
    placeText: 'Liaoning, China (Yixian Formation)',
    formations: [],
    otherFormations: ['Yixian (China)'],
    summary: ['A 9 m tyrannosaur covered in long filament-like feathers: the largest feathered animal known from direct evidence.'],
    keywords: ['feathered'],
  },
  {
    id: 'dilong-paradoxus',
    name: 'Dilong paradoxus',
    common: 'Dilong',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 126 million years ago (Early Cretaceous)',
    placeText: 'Liaoning, China (Yixian Formation)',
    formations: [],
    otherFormations: ['Yixian (China)'],
    summary: ['A small, early tyrannosaur about 2 m long with simple feathers.'],
    keywords: ['feathered'],
  },
  {
    id: 'eotyrannus-lengi',
    name: 'Eotyrannus lengi',
    common: 'Eotyrannus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 127 million years ago (Early Cretaceous)',
    placeText: 'Isle of Wight, England (Wessex Formation)',
    formations: [],
    otherFormations: ['Wessex (England)'],
    summary: ['A lightly built early tyrannosaur about 4 to 5 m long with long arms.'],
  },
  {
    id: 'guanlong-wucaii',
    name: 'Guanlong wucaii',
    common: 'Guanlong',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 160 million years ago (Late Jurassic)',
    placeText: 'Xinjiang, China (Shishugou Formation)',
    formations: [],
    otherFormations: ['Shishugou (China)'],
    summary: ['One of the earliest tyrannosaurs, about 3 m long, with a tall, thin crest on its head.'],
  },
  {
    id: 'proceratosaurus-bradleyi',
    name: 'Proceratosaurus bradleyi',
    common: 'Proceratosaurus',
    clade: 'tyrannosauroidea',
    status: 'brief',
    ageText: 'About 166 million years ago (Middle Jurassic)',
    placeText: 'Gloucestershire, England',
    formations: [],
    summary: ['An early tyrannosaur known from a skull with the base of a crest on its nose.'],
  },
];
