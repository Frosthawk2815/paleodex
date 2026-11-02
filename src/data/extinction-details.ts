// The story of each mass extinction, for its page: how much life was lost, what caused it, and
// notable groups that died out or made it through (linked to their group pages where PaleoDex has
// them). Loss figures are estimates and vary between studies. Checked November 2026.

export type GroupNote = { name: string; note: string; clade?: string };

export type ExtinctionDetail = {
  // The headline loss, e.g. "About 75% of species".
  loss: string;
  summary: string[];
  lost: GroupNote[];
  survived: GroupNote[];
  facts: { label: string; value: string }[];
};

export const EXTINCTION_DETAILS: Record<string, ExtinctionDetail> = {
  'end-cambrian': {
    loss: 'Not well measured: several waves that hit trilobites hardest',
    summary: [
      'Not a single event but a series of extinctions towards the end of the Cambrian, sometimes called the biomere extinctions, in which trilobite faunas were wiped out and replaced several times. Falling oxygen in the oceans and changes in sea temperature are the likeliest causes, but the details are uncertain.',
      'It is not counted among the Big Five, but it cleared the way for the Great Ordovician Biodiversification Event, when the number of kinds of sea animals multiplied.',
    ],
    lost: [
      { name: 'Many trilobite families', note: 'Replaced again and again by new ones.', clade: 'trilobita' },
      { name: 'Many brachiopods', note: 'Lamp shells of the Cambrian sea floor.', clade: 'brachiopoda' },
    ],
    survived: [
      { name: 'Trilobites as a group', note: 'They recovered and flourished in the Ordovician.', clade: 'trilobita' },
      { name: 'Conodonts', note: 'Early eel-like vertebrate relatives, known mostly from their tiny teeth.', clade: 'conodonta' },
      { name: 'Nautiloid cephalopods', note: 'Just appearing, they went on to become top predators.' },
    ],
    facts: [
      { label: 'When', value: 'About 487 million years ago, end of the Cambrian' },
      { label: 'Big Five?', value: 'No' },
    ],
  },
  'end-ordovician': {
    loss: 'About 85% of marine species',
    summary: [
      'The second-largest mass extinction, when nearly all life was still in the sea. It came in two pulses. First, a short, intense ice age spread from the South Pole across the supercontinent Gondwana, locking up water as ice: sea levels fell by perhaps 100 m, draining the shallow seas where most animals lived, and the water cooled. Then, as the ice melted, the oceans warmed and lost their oxygen, striking again at the survivors.',
    ],
    lost: [
      { name: 'Many trilobites', note: 'Especially those of the open sea.', clade: 'trilobita' },
      { name: 'Many brachiopods', note: 'The commonest shelled animals of the sea floor.', clade: 'brachiopoda' },
      { name: 'Graptolites', note: 'Floating colonial animals, nearly wiped out.' },
      { name: 'Giant endocerid nautiloids', note: 'Never recovered their former size or variety.', clade: 'endocerida' },
    ],
    survived: [
      { name: 'Jawless fish', note: 'Armoured fish that flourished in the Silurian.', clade: 'osteostraci' },
      { name: 'Sea scorpions', note: 'Reached their greatest size afterwards.', clade: 'eurypterida' },
      { name: 'Corals and brachiopods', note: 'Recovered to build the great reefs of the Silurian.' },
    ],
    facts: [
      { label: 'When', value: 'About 445 million years ago, end of the Ordovician' },
      { label: 'Lost', value: 'About 85% of marine species' },
      { label: 'Cause', value: 'Ice age and falling sea levels, then oxygen loss' },
      { label: 'Big Five?', value: 'Yes' },
    ],
  },
  kellwasser: {
    loss: 'The Late Devonian crises together: about 70–75% of species',
    summary: [
      'The first of two great pulses of the Late Devonian extinction, named after dark, oxygen-poor “Kellwasser” limestones in Germany. It devastated the vast reefs of the Devonian, built by stromatoporoid sponges and corals, and tropical sea life suffered most.',
      'Its cause is debated. The oceans lost their oxygen, possibly because the first forests, spreading across the land with deep roots, washed nutrients into the sea and fed huge blooms of algae. Climate swings and volcanic eruptions may also have played a part.',
    ],
    lost: [
      { name: 'Reef builders', note: 'Stromatoporoid sponges and many corals; reefs took millions of years to return.', clade: 'cnidaria' },
      { name: 'Many trilobites and brachiopods', note: 'Tropical forms were hit hardest.', clade: 'trilobita' },
      { name: 'Many placoderms', note: 'Armoured fish, the dominant vertebrates of the Devonian.', clade: 'placodermi' },
    ],
    survived: [
      { name: 'Some placoderms', note: 'Including Dunkleosteus, for a few million years more.', clade: 'placodermi' },
      { name: 'Sharks', note: 'Early sharks such as Cladoselache.', clade: 'chondrichthyes' },
      { name: 'Lobe-finned fish and early tetrapods', note: 'The line leading to four-legged animals.', clade: 'sarcopterygii' },
    ],
    facts: [
      { label: 'When', value: 'About 372 million years ago (Frasnian–Famennian boundary)' },
      { label: 'Lost', value: 'Part of about 70–75% of species lost across the Late Devonian' },
      { label: 'Cause', value: 'Ocean oxygen loss; causes debated' },
      { label: 'Big Five?', value: 'Yes (with the Hangenberg event)' },
    ],
  },
  hangenberg: {
    loss: 'The Late Devonian crises together: about 70–75% of species',
    summary: [
      'The second great pulse of the Late Devonian extinction, at the very end of the period, named after the Hangenberg black shale in Germany. It hit animals with backbones especially hard: a 2010 study estimated that most vertebrate species disappeared, ending the age of armoured fish.',
      'Oxygen loss in the oceans and a short ice age are the main suspects. A 2020 study found malformed plant spores from this time, suggesting a burst of harmful ultraviolet light as the ozone layer thinned, though this is still being tested.',
    ],
    lost: [
      { name: 'Placoderms', note: 'The armoured fish died out completely.', clade: 'placodermi' },
      { name: 'Many ammonoids and trilobites', note: 'Only a few lineages of each survived.', clade: 'ammonoidea' },
    ],
    survived: [
      { name: 'Sharks and their relatives', note: 'Flourished in the Carboniferous, “the age of sharks”.', clade: 'chondrichthyes' },
      { name: 'Ray-finned fish', note: 'Went on to become most of the world’s fish.', clade: 'actinopterygii' },
      { name: 'Four-legged animals', note: 'Survived through a bottleneck; their record is thin afterwards (“Romer’s gap”).' },
    ],
    facts: [
      { label: 'When', value: 'About 359 million years ago, end of the Devonian' },
      { label: 'Lost', value: 'Most vertebrate species (one estimate)' },
      { label: 'Cause', value: 'Ocean oxygen loss and glaciation; ozone loss suggested' },
      { label: 'Big Five?', value: 'Yes (with the Kellwasser event)' },
    ],
  },
  'end-permian': {
    loss: 'About 81% of marine species and about 70% of land vertebrate species',
    summary: [
      'The Great Dying, the largest mass extinction in Earth’s history and the only one to devastate insects. Older estimates of 90–96% of marine species have been revised down to about 81%, still the worst loss of life known.',
      'It was triggered by the Siberian Traps, a vast outpouring of lava in what is now Siberia, which burned through coal and released enormous amounts of carbon dioxide and methane. The world heated rapidly, tropical seas may have reached about 40 °C, the oceans became acidic and lost their oxygen, and some released poisonous hydrogen sulphide. Recovery took about 10 million years.',
    ],
    lost: [
      { name: 'Trilobites', note: 'The last ones died out, after almost 270 million years.', clade: 'trilobita' },
      { name: 'Sea scorpions', note: 'Gone for good.', clade: 'eurypterida' },
      { name: 'Gorgonopsians', note: 'The sabre-toothed top predators of the Permian.', clade: 'gorgonopsia' },
      { name: 'Most other synapsids', note: 'Most dicynodonts and therocephalians; pareiasaurs too.', clade: 'therocephalia' },
      { name: 'Ancient corals', note: 'The rugose and tabulate corals of the Palaeozoic.', clade: 'cnidaria' },
    ],
    survived: [
      { name: 'Lystrosaurus and a few other dicynodonts', note: 'Lystrosaurus became one of the commonest land animals in the world.', clade: 'dicynodontia' },
      { name: 'Cynodonts', note: 'The relatives of mammals, including their ancestors.', clade: 'cynodontia' },
      { name: 'Early archosaurs and their relatives', note: 'Their descendants include dinosaurs, pterosaurs and crocodiles.', clade: 'archosauria' },
      { name: 'Ammonoids', note: 'Just one or two lineages, which rediversified.', clade: 'ammonoidea' },
      { name: 'Temnospondyl amphibians', note: 'Some thrived in the Triassic.', clade: 'temnospondyli' },
    ],
    facts: [
      { label: 'When', value: 'About 252 million years ago, end of the Permian' },
      { label: 'Lost', value: 'About 81% of marine species; about 70% of land vertebrate species' },
      { label: 'Cause', value: 'Siberian Traps eruptions, extreme warming, acid and oxygen-poor oceans' },
      { label: 'Big Five?', value: 'Yes, the largest' },
    ],
  },
  'end-triassic': {
    loss: 'About 76% of species',
    summary: [
      'As the supercontinent Pangaea began to split apart, eruptions of the Central Atlantic Magmatic Province poured out lava across what are now four continents, releasing carbon dioxide that warmed the climate and acidified the oceans.',
      'It swept away most of the crocodile-line archosaurs that had ruled the Triassic on land, leaving the dinosaurs, until then fairly minor, to dominate the Jurassic.',
    ],
    lost: [
      { name: 'Conodonts', note: 'Gone after over 300 million years.', clade: 'conodonta' },
      { name: 'Phytosaurs', note: 'Crocodile-like Triassic predators.', clade: 'phytosauria' },
      { name: 'Aetosaurs', note: 'Armoured plant-eaters on the crocodile side.', clade: 'aetosauria' },
      { name: 'Rauisuchians', note: 'Big crocodile-line predators.', clade: 'rauisuchidae' },
      { name: 'Many large amphibians and ammonoids', note: 'Most big temnospondyls and most ammonoids.', clade: 'temnospondyli' },
    ],
    survived: [
      { name: 'Dinosaurs', note: 'Rose to dominate land for the next 135 million years.', clade: 'dinosauria' },
      { name: 'Pterosaurs', note: 'The flying reptiles carried on.', clade: 'pterosauria' },
      { name: 'Crocodylomorphs', note: 'The ancestors of crocodiles, then small and nimble.', clade: 'crocodylomorpha' },
      { name: 'Early mammals and their relatives', note: 'Small, mostly night-active animals.', clade: 'mammalia' },
      { name: 'Turtles, ichthyosaurs and plesiosaurs', note: 'All carried on into the Jurassic.', clade: 'testudines' },
    ],
    facts: [
      { label: 'When', value: 'About 201 million years ago, end of the Triassic' },
      { label: 'Lost', value: 'About 76% of species' },
      { label: 'Cause', value: 'Central Atlantic Magmatic Province eruptions as Pangaea split' },
      { label: 'Big Five?', value: 'Yes' },
    ],
  },
  'k-pg': {
    loss: 'About 75% of species',
    summary: [
      'The best-known mass extinction, at the end of the Cretaceous. An asteroid about 10 km across struck what is now the Yucatán Peninsula of Mexico, leaving the Chicxulub crater, about 180 km wide. It threw up rock, soot and sulphur that blocked sunlight for months to years, causing an “impact winter” that stopped photosynthesis and collapsed food chains on land and at sea.',
      'The enormous Deccan Traps eruptions in India were already under way and may have added to the damage, though the impact is now widely accepted as the main cause. Animals that were small, ate seeds, insects or dead matter, or lived in fresh water fared best.',
    ],
    lost: [
      { name: 'Non-bird dinosaurs', note: 'All except birds.', clade: 'dinosauria' },
      { name: 'Pterosaurs', note: 'Gone after about 160 million years.', clade: 'pterosauria' },
      { name: 'Mosasaurs', note: 'The giant sea lizards.', clade: 'mosasauridae' },
      { name: 'Plesiosaurs', note: 'The last long-necked sea reptiles.', clade: 'sauropterygia' },
      { name: 'Ammonites', note: 'Gone after over 300 million years.', clade: 'ammonoidea' },
    ],
    survived: [
      { name: 'Birds', note: 'The only dinosaurs to make it, probably small ground-living kinds.', clade: 'aves' },
      { name: 'Mammals', note: 'Small and adaptable, they spread into the world the dinosaurs left.', clade: 'mammalia' },
      { name: 'Crocodilians', note: 'Living in rivers helped them through.', clade: 'crocodylia' },
      { name: 'Turtles, lizards and snakes', note: 'Many lineages survived.', clade: 'squamata' },
      { name: 'Sharks and ray-finned fish', note: 'Sharks lost many species but carried on.', clade: 'chondrichthyes' },
      { name: 'Nautiluses', note: 'Their slow-growing eggs may have helped them outlast the ammonites.', clade: 'nautilida' },
    ],
    facts: [
      { label: 'When', value: 'About 66 million years ago, end of the Cretaceous' },
      { label: 'Lost', value: 'About 75% of species' },
      { label: 'Cause', value: 'The Chicxulub asteroid impact, perhaps helped by the Deccan Traps' },
      { label: 'Big Five?', value: 'Yes' },
    ],
  },
};
