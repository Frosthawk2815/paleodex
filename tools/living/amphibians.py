# Living amphibians. There are over 8,000 species, so this follows the well-known-names rule:
# famous frogs, salamanders and one caecilian, with relatives mentioned. Ranges are country-level
# outlines with boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'United Kingdom', 'Ireland']
CENTRAL_AMERICA = ['Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama']
SOUTH_AMERICA_TROPICS = ['Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru', 'Brazil', 'Bolivia', 'Paraguay']


def F(id, name, common, parent, desc):
    return {'id': id, 'name': name, 'common': common, 'parent': parent, 'family': True, 'description': desc}


CLADES = [
    F('phyllomedusidae', 'Phyllomedusidae', 'Leaf frogs', 'anura', 'Slow-climbing tree frogs of Central and South America that walk rather than leap and lay their eggs on leaves over water.'),
    F('dendrobatidae', 'Dendrobatidae', 'Poison dart frogs', 'anura', 'About 200 small, often brilliantly coloured frogs of Central and South American rainforests. Many carry poisons they get from eating ants and mites, and their bright colours warn predators. Parents carry tadpoles on their backs to pools.'),
    F('ranidae', 'Ranidae', 'True frogs', 'anura', 'Over 400 species of long-legged, smooth-skinned frogs found on every continent except Antarctica, including the common frog and the bullfrog.'),
    F('bufonidae', 'Bufonidae', 'True toads', 'anura', 'About 650 species of mostly warty, short-legged toads with poison glands behind the eyes, native to every continent except Australia and Antarctica.'),
    F('conrauidae', 'Conrauidae', 'Slippery frogs', 'anura', 'African river frogs, including the goliath frog, the largest frog alive.'),
    F('pipidae', 'Pipidae', 'Tongueless frogs', 'anura', 'Flat, fully aquatic frogs of Africa and South America with no tongue, including clawed frogs and the Surinam toad, whose young develop in pockets on the mother’s back.'),
    F('microhylidae', 'Microhylidae', 'Narrow-mouthed frogs', 'anura', 'About 700 species of mostly small frogs found across the tropics, including some of the smallest vertebrates known.'),
    F('ambystomatidae', 'Ambystomatidae', 'Mole salamanders', 'caudata', 'About 30 North American salamanders that live in burrows as adults, including the tiger salamander and the axolotl.'),
    F('salamandridae', 'Salamandridae', 'Newts and true salamanders', 'caudata', 'About 130 species across Europe, Asia, North Africa and North America, most with poisonous skin, including fire salamanders and newts.'),
    F('proteidae', 'Proteidae', 'Mudpuppies and the olm', 'caudata', 'Salamanders that keep their feathery gills all their lives: the North American mudpuppies and the blind olm of European caves.'),
]

UPGRADES = {}


def S(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': [summary], 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    # ── Frogs ──
    S('agalychnis-callidryas', 'Agalychnis callidryas', 'Red-eyed tree frog', 'phyllomedusidae', 'Rainforests from southern Mexico to Colombia',
      'A bright green tree frog that sleeps by day with its blue-and-yellow flanks and red eyes hidden; startled awake, it flashes them to shock predators. It lays eggs on leaves over ponds, and embryos can hatch early and drop into the water if they feel the vibrations of an attacking snake.',
      [('Length', 'About 4–7 cm'), ('IUCN status', 'Least Concern')],
      ['red-eyed tree frog', 'tree frog', 'agalychnis', 'frog'],
      [part('Mexico', -97, 15, -88, 19), C(*CENTRAL_AMERICA), part('Colombia', -78, 4, -75, 9)]),
    S('phyllobates-terribilis', 'Phyllobates terribilis', 'Golden poison frog', 'dendrobatidae', 'Pacific rainforest of western Colombia',
      'Perhaps the most poisonous animal alive: one frog, about 5 cm long, carries enough batrachotoxin to kill about ten people. Emberá people tipped blowgun darts by wiping them on its back. It makes the poison from something in its wild diet, so frogs raised in captivity are harmless.',
      [('Length', 'About 5 cm'), ('IUCN status', 'Endangered')],
      ['golden poison frog', 'poison dart frog', 'poison frog', 'phyllobates', 'colombia'],
      [part('Colombia', -77.6, 2.5, -76.6, 3.6)]),
    S('lithobates-catesbeianus', 'Lithobates catesbeianus', 'American bullfrog', 'ranidae', 'Eastern North America; introduced widely',
      'North America’s largest frog, up to about 20 cm and 750 g, named for the male’s deep, bull-like call. It eats almost anything it can swallow, including other frogs, snakes and ducklings. Spread around the world for frog legs, it is an invasive pest in western North America, Europe, Asia and South America and helped carry the chytrid fungus that has devastated frogs worldwide.',
      [('Length', 'Up to about 20 cm'), ('IUCN status', 'Least Concern')],
      ['american bullfrog', 'bullfrog', 'lithobates', 'rana catesbeiana', 'frog'],
      [part('United States of America', -105, 25, -67, 47), part('Canada', -95, 42, -64, 48), part('Mexico', -100, 22, -97, 28)]),
    S('rana-temporaria', 'Rana temporaria', 'Common frog', 'ranidae', 'Europe to western Siberia',
      'The familiar brown frog of European garden ponds, which gathers in early spring to lay great clumps of frogspawn. It survives farther north than most frogs, beyond the Arctic Circle, and can change its skin shade to match its surroundings.',
      [('Length', 'About 6–9 cm'), ('IUCN status', 'Least Concern')],
      ['common frog', 'european frog', 'grass frog', 'frogspawn', 'rana', 'frog'],
      [C(*EUROPE, exclude=['Portugal']), part('Russia', 28, 45, 75, 70)]),
    S('rhinella-marina', 'Rhinella marina', 'Cane toad', 'bufonidae', 'Amazon basin and nearby; introduced to Australia and many islands',
      'A huge toad, up to about 15 cm and over 1 kg, whose glands ooze a poison that kills animals that bite it. In 1935, 102 toads were released in Queensland to control cane beetles, which they did not do; their descendants, now well over 200 million, have spread across northern Australia, killing quolls, goannas and freshwater crocodiles. The toads of Mexico and Central America were split off as a separate species in 2016.',
      [('Weight', 'Up to over 1 kg'), ('IUCN status', 'Least Concern')],
      ['cane toad', 'giant toad', 'marine toad', 'rhinella', 'bufo marinus', 'toad', 'invasive'],
      [*[C(n) for n in ['Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru', 'Bolivia']], part('Brazil', -74, -20, -35, 5), part('Australia', 124, -20, 146, -11), part('Australia', 140, -31, 154, -15)]),
    S('atelopus-zeteki', 'Atelopus zeteki', 'Panamanian golden frog', 'bufonidae', 'Mountain streams of central Panama',
      'A bright golden toad and a national symbol of Panama, which waves its arms at rivals because rushing streams drown out calls. The chytrid fungus swept through its habitat in the 2000s and it has not been seen in the wild since 2009; it survives in captive breeding programmes awaiting a safe return.',
      [('Length', 'About 4–6 cm'), ('IUCN status', 'Critically Endangered (possibly extinct in the wild)')],
      ['panamanian golden frog', 'golden frog', 'atelopus', 'harlequin toad', 'chytrid', 'panama'],
      [part('Panama', -81, 8, -79.5, 9.3)]),
    S('conraua-goliath', 'Conraua goliath', 'Goliath frog', 'conrauidae', 'Rainforest rivers of Cameroon and Equatorial Guinea',
      'The largest frog alive, with a body up to about 32 cm long and weighing up to about 3 kg. A 2019 study found that adults dig nesting pools beside rivers, shifting rocks up to 2 kg, perhaps explaining their size. It is hunted for food and its rivers are threatened by logging and dams.',
      [('Weight', 'Up to about 3 kg'), ('IUCN status', 'Endangered')],
      ['goliath frog', 'giant frog', 'conraua', 'largest frog', 'cameroon'],
      [part('Cameroon', 9, 2, 11, 5), part('Eq. Guinea', 9.3, 1, 11.4, 2.4)]),
    S('xenopus-laevis', 'Xenopus laevis', 'African clawed frog', 'pipidae', 'Southern Africa; introduced worldwide',
      'A flat, fully aquatic frog with clawed hind toes and no tongue. From the 1930s to the 1960s it was the standard pregnancy test: a woman’s urine injected into a female made her lay eggs if pregnant. It became one of biology’s main laboratory animals (John Gurdon’s cloning of frogs from body cells, which won a 2012 Nobel Prize, used it), and the global trade in it may have helped spread chytrid fungus.',
      [('Length', 'About 6–12 cm'), ('IUCN status', 'Least Concern')],
      ['african clawed frog', 'clawed frog', 'xenopus', 'pregnancy test', 'frog'],
      [C('South Africa', 'Lesotho', 'eSwatini', 'Namibia', 'Botswana', 'Zimbabwe', 'Malawi'), part('Mozambique', 30, -27, 36, -15)]),
    S('paedophryne-amauensis', 'Paedophryne amauensis', 'Amau frog', 'microhylidae', 'Leaf litter of southeastern Papua New Guinea',
      'Described in 2012 at about 7.7 mm long, small enough to sit on a fingernail, and long counted as the smallest known vertebrate. A 2024 study measured Brazil’s flea toad (Brachycephalus pulex) at about 7.1 mm, slightly smaller. It hops among dead leaves on the rainforest floor, eating mites.',
      [('Length', 'About 7.7 mm'), ('Described', '2012')],
      ['amau frog', 'paedophryne', 'smallest frog', 'smallest vertebrate', 'papua new guinea'],
      [part('Papua New Guinea', 146.5, -10.5, 149, -9)]),
    # ── Salamanders ──
    S('ambystoma-mexicanum', 'Ambystoma mexicanum', 'Axolotl', 'ambystomatidae', 'Lake Xochimilco canals, Mexico City',
      'A salamander that stays in its larval form all its life, keeping its feathery gills and living in water. It can regrow lost legs, tail, parts of its spinal cord, heart and brain, making it a key animal in regeneration research. Millions live in labs and as pets, but in the wild, pollution, invasive fish and urban growth cut numbers from about 6,000 per square kilometre in 1998 to about 36 in 2014.',
      [('Length', 'About 15–30 cm'), ('IUCN status', 'Critically Endangered')],
      ['axolotl', 'ambystoma', 'mexican walking fish', 'salamander', 'mexico'],
      [part('Mexico', -99.4, 19, -98.9, 19.5)]),
    S('andrias-davidianus', 'Andrias davidianus', 'Chinese giant salamander', 'cryptobranchidae', 'Mountain streams of central and southern China',
      'One of the largest amphibians, historically reaching about 1.8 m, though wild ones that big are now unknown. Genetic studies since 2018 show it is several species, and the South China giant salamander (Andrias sligoi) may be the largest of all. Millions are farmed for food, mixing the lineages, while wild populations have nearly vanished. Its relatives are the Japanese giant salamander and the North American hellbender.',
      [('Length', 'Historically up to about 1.8 m'), ('IUCN status', 'Critically Endangered')],
      ['chinese giant salamander', 'giant salamander', 'andrias', 'largest amphibian', 'china'],
      [part('China', 103, 23, 121, 35)]),
    S('salamandra-salamandra', 'Salamandra salamandra', 'Fire salamander', 'salamandridae', 'Forests of central and southern Europe',
      'A black-and-yellow salamander whose skin glands make a nerve poison. The old belief that salamanders live in fire probably came from them crawling out of logs thrown on fires. Since about 2010 a fungus from Asia, Batrachochytrium salamandrivorans, has wiped out most fire salamanders in the Netherlands and is spreading in Belgium, Germany and Spain.',
      [('Length', 'About 15–25 cm'), ('IUCN status', 'Vulnerable')],
      ['fire salamander', 'salamander', 'salamandra', 'europe'],
      [C('Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Czechia', 'Slovakia', 'Poland', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Ukraine', latMax=53, lonMax=30)]),
    S('triturus-cristatus', 'Triturus cristatus', 'Great crested newt', 'salamandridae', 'Northern and central Europe',
      'Europe’s largest newt, whose males grow a tall, jagged crest in the breeding season. It is strictly protected in Britain and the European Union, so ponds must often be surveyed for it before building work can go ahead. Its skin is warty and secretes a mild poison.',
      [('Length', 'About 10–16 cm'), ('IUCN status', 'Least Concern')],
      ['great crested newt', 'crested newt', 'newt', 'triturus', 'britain'],
      [C('United Kingdom', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Austria', 'Switzerland', 'Hungary', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', latMin=44), part('Sweden', 11, 55, 19, 62), part('Finland', 21, 60, 30, 63), part('Russia', 28, 50, 60, 62)]),
    S('proteus-anguinus', 'Proteus anguinus', 'Olm', 'proteidae', 'Flooded caves of the Dinaric Alps, Slovenia to Herzegovina',
      'A blind, pale pink cave salamander that keeps its gills for life; olms washed out of caves by floods were once thought to be baby dragons. It can live for about 100 years and go years without eating, and one tracked olm did not move for seven years.',
      [('Length', 'About 20–30 cm'), ('IUCN status', 'Vulnerable')],
      ['olm', 'proteus', 'human fish', 'cave salamander', 'baby dragon', 'slovenia'],
      [part('Slovenia', 13.5, 45.4, 15.5, 46.2), part('Croatia', 14, 43, 17.5, 45.6), part('Bosnia and Herz.', 16, 42.6, 18.5, 44.5)]),
    # ── Caecilians ──
    S('siphonops-annulatus', 'Siphonops annulatus', 'Ringed caecilian', 'gymnophiona', 'South America east of the Andes',
      'A legless, burrowing amphibian that looks like a large blue-grey earthworm with white rings. A 2024 study showed that mothers feed their young a milk-like fluid, and the young also peel off and eat their mother’s skin, which regrows. Caecilians have tiny eyes under the skin and smell with sensory tentacles on the face.',
      [('Length', 'About 30–45 cm'), ('IUCN status', 'Least Concern')],
      ['ringed caecilian', 'caecilian', 'siphonops'],
      [C(*SOUTH_AMERICA_TROPICS), part('Argentina', -58, -28, -53, -25)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Released in Queensland in 1935; the historic range is its native range.
    'rhinella-marina': {'without': [8, 9]},
}
HISTORIC = {**{sid: 'same' for sid in ['agalychnis-callidryas', 'phyllobates-terribilis', 'lithobates-catesbeianus', 'rana-temporaria', 'atelopus-zeteki', 'conraua-goliath', 'xenopus-laevis', 'paedophryne-amauensis', 'ambystoma-mexicanum', 'andrias-davidianus', 'salamandra-salamandra', 'triturus-cristatus', 'proteus-anguinus', 'siphonops-annulatus']}, **HISTORIC_CHANGED}
