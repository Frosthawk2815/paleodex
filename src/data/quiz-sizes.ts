// Adult sizes for the quiz's "how long / how heavy" questions, kept to well-supported figures that
// match the species pages. Values are metric: lengths in metres, weights in kilograms. A pair is a
// range ("about 7–9 m").
//
// Difficulty is the species' obscurity, plus 1 for a sexually dimorphic species (the question names
// a sex), plus 1 more when it asks about the less familiar sex (the male anglerfish, the lioness).

export type SizeFact = {
  id: string;
  measure: 'length' | 'weight';
  value: number | [number, number];
  // For sexually dimorphic species: which sex this figure is for, and whether it is the less
  // familiar one.
  sex?: 'male' | 'female';
  lesser?: boolean;
  // 'fossils' for prehistoric animals, 'remains' for recently extinct ones (museum specimens);
  // living species have neither.
  known?: 'fossils' | 'remains';
  // The figure is a maximum, not a typical adult, so the question asks how big it can grow.
  max?: boolean;
  explanation: string;
};

export const SIZE_FACTS: SizeFact[] = [
  // ---- Prehistoric ----
  { id: 'tyrannosaurus-rex', measure: 'length', value: 12, known: 'fossils', explanation: 'The most complete adult skeletons, such as Sue, are about 12 m long.' },
  { id: 'tyrannosaurus-rex', measure: 'weight', value: 8000, known: 'fossils', explanation: 'Most estimates for a big adult are around 8 tonnes, though they range from about 6 to 9.' },
  { id: 'velociraptor-mongoliensis', measure: 'length', value: 2, known: 'fossils', explanation: 'About 2 m including its long tail: far smaller than the film version.' },
  { id: 'velociraptor-mongoliensis', measure: 'weight', value: 15, known: 'fossils', explanation: 'Up to about 15 kg, roughly the weight of a large turkey or a medium dog.' },
  { id: 'triceratops-horridus', measure: 'length', value: [8, 9], known: 'fossils', explanation: 'Adult Triceratops were about 8 to 9 m long.' },
  { id: 'stegosaurus-stenops', measure: 'length', value: [7, 9], known: 'fossils', explanation: 'Adults were about 7 to 9 m long; the well-known skeleton “Sophie” is a smaller young adult.' },
  { id: 'spinosaurus-aegyptiacus', measure: 'length', value: 14, known: 'fossils', explanation: 'Recent studies estimate about 14 m, perhaps the longest predatory dinosaur, though it was lighter than T. rex.' },
  { id: 'diplodocus-carnegii', measure: 'length', value: 25, known: 'fossils', explanation: 'About 25 m, most of it neck and whip-like tail.' },
  { id: 'archaeopteryx-lithographica', measure: 'length', value: 0.5, known: 'fossils', explanation: 'About 50 cm long, roughly the size of a raven, with a long bony tail.' },
  { id: 'compsognathus-longipes', measure: 'length', value: 1, known: 'fossils', explanation: 'About 1 m, most of it tail; the larger French specimen reached about 1.25 m.' },
  { id: 'smilodon-fatalis', measure: 'weight', value: [160, 280], known: 'fossils', explanation: 'About 160–280 kg: the size of a lion, but more heavily built.' },
  { id: 'mammuthus-primigenius', measure: 'weight', value: 6000, sex: 'male', known: 'fossils', explanation: 'Bulls reached about 6 tonnes; cows were smaller, about 4 tonnes.' },
  { id: 'mammuthus-primigenius', measure: 'weight', value: 4000, sex: 'female', lesser: true, known: 'fossils', explanation: 'Cows reached about 4 tonnes, while bulls were about 6.' },
  { id: 'infernogallus-jamesi', measure: 'weight', value: 11, known: 'fossils', explanation: 'About 11 kg, roughly a turkey.' },
  { id: 'gerrothorax-maritimus', measure: 'length', value: 0.74, known: 'fossils', explanation: 'About 74 cm, from two nearly complete skeletons.' },
  { id: 'rinconraptor-pipoae', measure: 'length', value: 7, known: 'fossils', explanation: 'About 7 m, estimated by comparing its vertebrae with better-known megaraptorids.' },
  { id: 'sharovipteryx-mirabilis', measure: 'length', value: 0.2, known: 'fossils', explanation: 'About 20 cm, known from a single skeleton.' },
  { id: 'grippia-longirostris', measure: 'length', value: 1, known: 'fossils', explanation: 'About 1 m, small for an ichthyosaur relative.' },
  // ---- Recently extinct ----
  { id: 'thylacinus-cynocephalus', measure: 'weight', value: 20, sex: 'male', known: 'remains', explanation: 'A 2020 study of museum specimens found males averaged about 20 kg and females about 14 kg.' },
  { id: 'thylacinus-cynocephalus', measure: 'weight', value: 14, sex: 'female', lesser: true, known: 'remains', explanation: 'A 2020 study of museum specimens found females averaged about 14 kg and males about 20 kg.' },
  // ---- Living ----
  { id: 'loxodonta-africana', measure: 'weight', value: 6000, sex: 'male', explanation: 'Bulls usually weigh about 6 tonnes, twice as much as cows.' },
  { id: 'loxodonta-africana', measure: 'weight', value: 3000, sex: 'female', lesser: true, explanation: 'Cows weigh about 3 tonnes, half as much as bulls.' },
  { id: 'panthera-leo', measure: 'weight', value: [150, 250], sex: 'male', explanation: 'Males weigh about 150–250 kg; lionesses about 110–180 kg.' },
  { id: 'panthera-leo', measure: 'weight', value: [110, 180], sex: 'female', lesser: true, explanation: 'Lionesses weigh about 110–180 kg, less than males at about 150–250 kg.' },
  { id: 'gorilla-gorilla', measure: 'weight', value: [140, 200], sex: 'male', explanation: 'Silverback males weigh about 140–200 kg, about twice as much as females.' },
  { id: 'gorilla-gorilla', measure: 'weight', value: [70, 90], sex: 'female', lesser: true, explanation: 'Females weigh about 70–90 kg, around half as much as males.' },
  { id: 'physeter-macrocephalus', measure: 'length', value: 16, sex: 'male', explanation: 'Adult males are about 16 m long, sometimes more; females are about 11 m.' },
  { id: 'physeter-macrocephalus', measure: 'length', value: 11, sex: 'female', lesser: true, explanation: 'Adult females are about 11 m long, much smaller than males at about 16 m.' },
  { id: 'mirounga-angustirostris', measure: 'weight', value: [1500, 2300], sex: 'male', explanation: 'Bulls weigh about 1,500–2,300 kg, three or more times as much as cows.' },
  { id: 'mirounga-angustirostris', measure: 'weight', value: [400, 900], sex: 'female', lesser: true, explanation: 'Cows weigh about 400–900 kg, a fraction of a bull’s 1,500–2,300 kg.' },
  { id: 'varanus-komodoensis', measure: 'length', value: 2.6, sex: 'male', explanation: 'Adult males average about 2.6 m; females about 1.8 m.' },
  { id: 'varanus-komodoensis', measure: 'length', value: 1.8, sex: 'female', lesser: true, explanation: 'Adult females average about 1.8 m, smaller than males at about 2.6 m.' },
  {
    id: 'melanocetus-johnsonii',
    measure: 'length',
    value: 0.18,
    sex: 'female',
    max: true,
    explanation: 'Females grow to about 18 cm. Males stay under about 3 cm and spend their short adult lives searching for a female.',
  },
  {
    id: 'melanocetus-johnsonii',
    measure: 'length',
    value: 0.03,
    sex: 'male',
    lesser: true,
    max: true,
    explanation: 'Males stay under about 3 cm, a sixth of the female’s length, and spend their short adult lives searching for a female.',
  },
];
