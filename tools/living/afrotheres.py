# Living afrotherians: elephants, sea cows, hyraxes, the aardvark, tenrecs and otter shrews,
# golden moles and sengis (elephant shrews). Every living genus of elephants, sea cows, hyraxes,
# aardvarks and sengis; representative tenrecs and golden moles. Ranges are country-level outlines
# (clipped by boxes) or coastal sea boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def sea(lon0, lat0, lon1, lat1):
    return {'sea': [lon0, lat0, lon1, lat1]}


CLADES = [
    {'id': 'afrotheria', 'name': 'Afrotheria', 'common': 'Afrotherians', 'parent': 'eutheria', 'description': 'One of the four great branches of placental mammals, which evolved in Africa when it was an island continent. DNA studies in the late 1990s showed that animals as different as elephants, sea cows, hyraxes, the aardvark, tenrecs, golden moles and sengis are each other’s closest relatives.'},
    {'id': 'paenungulata', 'name': 'Paenungulata', 'common': 'Elephants, sea cows and hyraxes', 'parent': 'afrotheria', 'description': 'The afrotherian branch containing elephants and their relatives, sea cows, hyraxes and the extinct embrithopods.'},
    {'id': 'elephantidae', 'name': 'Elephantidae', 'common': 'Elephants and mammoths', 'parent': 'proboscidea', 'family': True, 'description': 'True elephants: the three living species and extinct relatives such as mammoths and straight-tusked elephants.'},
    {'id': 'trichechidae', 'name': 'Trichechidae', 'common': 'Manatees', 'parent': 'sirenia', 'family': True, 'description': 'Three living manatees of the Atlantic coasts and the rivers of the Americas and West Africa, with rounded, paddle-shaped tails.'},
    {'id': 'dugongidae', 'name': 'Dugongidae', 'common': 'Dugongs and Steller’s sea cow', 'parent': 'sirenia', 'family': True, 'description': 'Sea cows with whale-like, notched tail flukes: the living dugong and the giant Steller’s sea cow, hunted to extinction in the 1760s.'},
    {'id': 'hyracoidea', 'name': 'Hyracoidea', 'common': 'Hyraxes', 'parent': 'paenungulata', 'description': 'Small, rabbit-sized plant-eaters of Africa and the Middle East, despite appearances close relatives of elephants and sea cows. About 35 million years ago hyraxes were the main plant-eaters of Africa, and some were as big as horses.'},
    {'id': 'procaviidae', 'name': 'Procaviidae', 'common': 'Hyraxes', 'parent': 'hyracoidea', 'family': True, 'description': 'The only living hyrax family, with five species in three genera: rock, bush and tree hyraxes.'},
    {'id': 'tubulidentata', 'name': 'Tubulidentata', 'common': 'Aardvarks', 'parent': 'afrotheria', 'description': 'An order with a single living species, the aardvark. Its name means “tube-toothed”: its teeth have no enamel and are made of many fine tubes.'},
    {'id': 'afrosoricida', 'name': 'Afrosoricida', 'common': 'Tenrecs and golden moles', 'parent': 'afrotheria', 'description': 'Small insect-eaters of Africa and Madagascar that look like shrews, hedgehogs, otters or moles, but are afrotherians that evolved those shapes independently.'},
    {'id': 'tenrecidae', 'name': 'Tenrecidae', 'common': 'Tenrecs', 'parent': 'afrosoricida', 'family': True, 'description': 'About 30 species found only on Madagascar, all descended from a single ancestor that crossed from Africa, probably on floating vegetation. They have evolved into hedgehog-like, shrew-like, mole-like and otter-like forms.'},
    {'id': 'potamogalidae', 'name': 'Potamogalidae', 'common': 'Otter shrews', 'parent': 'afrosoricida', 'family': True, 'description': 'Three species of semi-aquatic insectivores in the rivers and streams of central Africa.'},
    {'id': 'chrysochloridae', 'name': 'Chrysochloridae', 'common': 'Golden moles', 'parent': 'afrosoricida', 'family': True, 'description': 'About 21 species of blind, burrowing insectivores of southern Africa, with eyes covered by skin and shiny, often iridescent fur. They look like the moles of Europe and North America but are not related.'},
    {'id': 'macroscelidea', 'name': 'Macroscelidea', 'common': 'Sengis (elephant shrews)', 'parent': 'afrotheria', 'description': 'About 20 species of small, fast-running insect-eaters of Africa with long, flexible, trunk-like snouts. Long called elephant shrews, they are not shrews but relatives of elephants, and are now often called by their African name, sengi.'},
]

# Fossil elephants and Steller's sea cow are moved into the new families.
UPGRADES = {
    'mammuthus-primigenius': {'clade': 'elephantidae'},
    'mammuthus-columbi': {'clade': 'elephantidae'},
    'palaeoloxodon-antiquus': {'clade': 'elephantidae'},
    'palaeoloxodon-cypriotes': {'clade': 'elephantidae'},
    'hydrodamalis-gigas': {'clade': 'dugongidae'},
}


def G(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    # ---- Elephants ----
    G('loxodonta-africana', 'Loxodonta africana', 'African bush elephant', 'elephantidae', 'Savannas and dry woodlands of sub-Saharan Africa, now in scattered populations',
      ['The largest living land animal: big males stand up to about 4 m at the shoulder and usually weigh around 6 tonnes. Its huge ears, shaped a little like the map of Africa, help it shed heat. Females and young live in family herds led by the oldest female, the matriarch, while adult males roam alone or in bachelor groups.',
       'Elephants shape the savanna by pushing over trees, digging for water and spreading seeds. Poaching for ivory and loss of land have cut their numbers sharply; Botswana now has the largest population, about 130,000.'],
      [('Species in genus', '2'), ('Weight', 'Females about 3 t, males about 6 t'), ('Height', 'Up to about 4 m'), ('IUCN status', 'Endangered')],
      ['african bush elephant', 'african elephant', 'savanna elephant', 'elephant', 'loxodonta', 'ivory', 'africa'],
      [C('Botswana', 'Zimbabwe', 'Zambia', 'Malawi'), part('South Africa', 26, -26, 32.5, -22), part('Namibia', 13, -21, 25.5, -17), part('Angola', 17, -18, 24, -13), part('Mozambique', 31, -26, 41, -11), C('Tanzania', 'Kenya', 'Uganda'), part('S. Sudan', 27, 4, 34, 8), part('Ethiopia', 34, 5, 40, 9), part('Chad', 17, 9, 22, 12), part('Cameroon', 13, 7.5, 15.5, 11), part('Niger', 1.5, 11.5, 3, 12.5), part('Burkina Faso', 0, 10.8, 2.4, 12.5), part('Benin', 1, 10.5, 3, 12), part('Mali', -2.5, 14.5, -0.5, 16.5)]),
    G('loxodonta-cyclotis', 'Loxodonta cyclotis', 'African forest elephant', 'elephantidae', 'Rainforests of Central and West Africa',
      ['Smaller than the bush elephant, with rounder ears and straighter, downward-pointing tusks of hard, pinkish ivory. It lives in small family groups in dense rainforest, where it opens paths through the undergrowth and spreads the seeds of many trees, which helps the forest store carbon.',
       'Long treated as a type of African elephant, it was recognised as a separate species by the IUCN in 2021. Its numbers fell by more than 85% over about 30 years, mostly to ivory poaching; Gabon holds most of those left.'],
      [('Species in genus', '2'), ('Weight', 'About 2–5 t'), ('IUCN status', 'Critically Endangered')],
      ['african forest elephant', 'forest elephant', 'elephant', 'loxodonta', 'gabon', 'rainforest'],
      [C('Gabon', 'Congo', 'Eq. Guinea'), part('Cameroon', 9.5, 2, 16, 5), part('Central African Rep.', 15, 2, 18.5, 4.5), part('Dem. Rep. Congo', 17, -4, 30, 4), part('Liberia', -11, 5, -7.5, 7.5), part("Côte d'Ivoire", -8.5, 5, -6, 7.5), part('Ghana', -3, 5, -1, 7), part('Sierra Leone', -11.5, 7, -10.5, 8.5), part('Guinea', -9.5, 7.5, -8, 9)]),
    G('elephas-maximus', 'Elephas maximus', 'Asian elephant', 'elephantidae', 'Forests and grasslands of South and South-east Asia, in scattered populations',
      ['Smaller than African elephants, with smaller ears, a rounded back and a single finger-like tip on its trunk. Only some males grow tusks. It has been tamed and worked by people for about 4,000 years, but has never been truly domesticated.',
       'It once lived from Iraq and Syria to the Yangtze in China. Fewer than about 50,000 survive in the wild, squeezed by farms and growing towns. In 2021 a herd in Yunnan, China, became famous worldwide after wandering about 500 km north towards the city of Kunming.'],
      [('Species in genus', '1'), ('Weight', 'About 2.5–5 t'), ('IUCN status', 'Endangered')],
      ['asian elephant', 'indian elephant', 'elephant', 'elephas', 'india', 'sri lanka', 'asia'],
      [part('India', 74, 8, 79, 15), part('India', 77, 18, 87, 24), part('India', 77, 28.5, 81, 31), part('India', 88, 22, 97, 29), C('Sri Lanka', 'Bhutan'), part('Nepal', 80, 26.3, 88.2, 28), part('Bangladesh', 91.5, 21, 92.7, 25), C('Myanmar', 'Laos', 'Cambodia'), part('Thailand', 97.5, 5.5, 104, 20), part('Vietnam', 105, 10.5, 108.5, 16), part('Malaysia', 100, 1.5, 104, 6.5), part('Malaysia', 116, 4, 119, 6), part('Indonesia', 95, -6, 106, 5.5), part('Indonesia', 116, 3.5, 117.6, 4.5), part('China', 99.5, 21, 102, 24)]),

    # ---- Sea cows ----
    G('dugong-dugon', 'Dugong dugon', 'Dugong', 'dugongidae', 'Warm, shallow coasts of the Indian Ocean and western Pacific, from East Africa to Vanuatu',
      ['The only living member of its family, a sea cow with a whale-like fluked tail and a downturned snout for grazing seagrass on the seabed, leaving feeding trails behind it. It can live for 70 years. Sailors’ stories of mermaids may have been inspired by dugongs and manatees.',
       'Northern Australia holds most of the world’s dugongs. Elsewhere they have declined because of hunting, fishing nets and seagrass loss; in 2022 dugongs were declared functionally extinct in China. Its only recent relative, the giant Steller’s sea cow, was hunted to extinction in the 1760s.'],
      [('Species in genus', '1'), ('Length', 'About 2.5–3 m'), ('Weight', 'About 250–400 kg'), ('IUCN status', 'Vulnerable')],
      ['dugong', 'sea cow', 'dugong dugon', 'sirenian', 'seagrass', 'mermaid', 'australia'],
      [sea(32, -27, 42, -3), sea(32, 12, 44, 29), sea(47, 23, 57, 30), sea(76, 6, 81, 10.5), sea(92, 6, 99, 16), sea(99, 5, 105, 13), sea(103, -8, 120, 5), sea(117, 5, 127, 19), sea(120, -10, 141, 2), sea(112, -27, 154, -9), sea(141, -12, 163, -2), sea(163, -23, 170, -13)]),
    G('trichechus-manatus', 'Trichechus manatus', 'West Indian manatee', 'trichechidae', 'Coasts, rivers and springs from Florida and the Gulf of Mexico through the Caribbean to northern Brazil',
      ['A large, slow sea cow with a rounded paddle tail, grazing seagrass and water plants for up to eight hours a day. Like all manatees it keeps growing new molars at the back of its jaws that slowly move forward as the front ones wear out. In winter, Florida manatees gather at warm springs and power-plant outflows.',
       'Christopher Columbus reported seeing three “mermaids” in 1493, noting they were “not half as beautiful as they are painted”; they were probably manatees. Boat strikes are a major threat, and in 2021 more than 1,000 Florida manatees died, many starving after seagrass beds died off.'],
      [('Species in genus', '3'), ('Length', 'About 3–3.5 m'), ('Weight', 'About 400–550 kg'), ('IUCN status', 'Vulnerable')],
      ['west indian manatee', 'florida manatee', 'antillean manatee', 'manatee', 'sea cow', 'trichechus', 'florida', 'caribbean'],
      [sea(-88, 24, -79, 31.5), sea(-98, 18, -88, 22), sea(-89, 8, -77, 18.5), sea(-85, 17, -64, 23.5), sea(-77, 8, -60, 12.5), sea(-60, -6, -34, 8)]),
    G('trichechus-inunguis', 'Trichechus inunguis', 'Amazonian manatee', 'trichechidae', 'Rivers, lakes and flooded forests of the Amazon basin',
      ['The smallest manatee and the only one that lives only in fresh water, with smooth, rubbery skin, no nails on its flippers and usually a white patch on its chest. In the dry season, when waters fall, it can fast for months, living off its fat.',
       'Tens of thousands were killed in the mid-1900s for meat and for their tough hides, used to make machine belts and hoses. It is now protected, but is still hunted illegally.'],
      [('Species in genus', '3'), ('Length', 'About 2.5–2.8 m'), ('Weight', 'Up to about 400 kg'), ('IUCN status', 'Vulnerable')],
      ['amazonian manatee', 'manatee', 'sea cow', 'trichechus', 'amazon', 'river'],
      [part('Brazil', -74, -8, -49, 2), part('Peru', -76, -10, -70, -2), part('Colombia', -74, -4, -69.5, 2), part('Ecuador', -77, -3, -75, 0)]),
    G('trichechus-senegalensis', 'Trichechus senegalensis', 'African manatee', 'trichechidae', 'Coasts, lagoons and rivers of West and Central Africa, from Senegal to Angola',
      ['The least-studied sea cow, very like the West Indian manatee. It lives along coasts and in mangroves and lagoons, and travels far up rivers: it reaches the Niger River in Mali and Niger, hundreds of kilometres from the sea.',
       'It is threatened by hunting, accidental capture in fishing nets and dams that block rivers.'],
      [('Species in genus', '3'), ('Length', 'About 3–4 m'), ('Weight', 'Up to about 500 kg'), ('IUCN status', 'Vulnerable')],
      ['african manatee', 'west african manatee', 'manatee', 'sea cow', 'trichechus', 'africa'],
      [C('Senegal', 'Gambia', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Eq. Guinea', 'Gabon'), part('Guinea', -15, 9, -12, 11.5), part("Côte d'Ivoire", -7.5, 4.5, -2.5, 6.5), part('Ghana', -3, 4.5, 1.2, 6.5), part('Togo', 0.8, 6, 1.8, 6.5), part('Benin', 1.6, 6.2, 2.8, 7), part('Nigeria', 3, 4, 9, 12), part('Cameroon', 8.5, 2, 11, 5), part('Congo', 11, -5, 13, -2), part('Dem. Rep. Congo', 12, -6.2, 14, -5), part('Angola', 12, -11, 14, -6), part('Mali', -5, 13, 0, 17), part('Niger', 0, 12, 4, 15), part('Chad', 14, 9, 17, 13)]),

    # ---- Hyraxes ----
    G('procavia-capensis', 'Procavia capensis', 'Rock hyrax', 'procaviidae', 'Rocky outcrops and cliffs across much of Africa and the Middle East',
      ['A stocky, rabbit-sized animal that lives in colonies among rocks, basking in the sun in the morning because it controls its body temperature poorly. Rubbery, sweaty foot pads give it grip on steep rock. Despite looks, its closest living relatives are elephants and sea cows, and its upper incisors grow into small tusks.',
       'It is the “coney” of the Bible. Colonies use the same latrines for thousands of years, building up layers of hardened urine (hyraceum) that preserve pollen and record past climates over 50,000 years.'],
      [('Species in genus', '1'), ('Weight', 'About 2–5 kg'), ('IUCN status', 'Least Concern')],
      ['rock hyrax', 'dassie', 'coney', 'hyrax', 'procavia', 'africa', 'middle east'],
      [C('South Africa', 'Lesotho', 'eSwatini', 'Namibia', 'Zimbabwe', 'Zambia', 'Malawi', 'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Eritrea', 'Somalia', 'Somaliland', 'Djibouti', 'Israel', 'Lebanon', 'Jordan', 'Yemen'), part('Botswana', 25, -25, 29, -18), part('Angola', 12, -18, 22, -10), part('Mozambique', 31, -25, 36, -11), part('Dem. Rep. Congo', 25, -12, 31, -2), part('Sudan', 30, 8, 38, 22), part('Syria', 35.5, 32.5, 37, 35), part('Saudi Arabia', 34.5, 13, 45, 30), part('Oman', 53, 16, 60, 24), part('Egypt', 32.5, 22, 35.5, 30), part('Libya', 22, 31, 25, 33), part('Algeria', 4, 22, 8, 26), part('Niger', 7, 17, 10, 20), part('Chad', 16, 19, 20, 22), part('Mali', -4, 13.5, 1, 16), part('Senegal', -12.5, 12, -11, 13), part('Nigeria', 7.5, 9, 10, 11)]),
    G('heterohyrax-brucei', 'Heterohyrax brucei', 'Yellow-spotted rock hyrax', 'procaviidae', 'Rocky hills of eastern and southern Africa, from Egypt to South Africa',
      ['Also called the bush hyrax, it has a white or yellow spot above each eye and a pale belly. It often shares rock outcrops with the rock hyrax: the two species sleep huddled together and their young play together, but they eat different food, the bush hyrax browsing leaves while the rock hyrax mainly grazes.'],
      [('Species in genus', '1'), ('Weight', 'About 1.5–3.5 kg'), ('IUCN status', 'Least Concern')],
      ['yellow-spotted rock hyrax', 'bush hyrax', 'hyrax', 'heterohyrax', 'serengeti', 'africa'],
      [part('Egypt', 33, 22, 36, 25), part('Sudan', 33, 10, 38, 22), C('Eritrea', 'Ethiopia', 'Somalia', 'Somaliland', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Zambia', 'Malawi', 'Zimbabwe'), part('Dem. Rep. Congo', 27, -12, 31, 3), part('Mozambique', 31, -24, 41, -11), part('Botswana', 25, -25, 29, -18), part('South Africa', 27, -25, 32, -22), part('Angola', 12, -16, 17, -10)]),
    G('dendrohyrax-arboreus', 'Dendrohyrax arboreus', 'Southern tree hyrax', 'procaviidae', 'Forests of eastern and southern Africa',
      ['A soft-furred hyrax that lives alone in tree holes high in the forest canopy and feeds at night. Its loud, rising series of croaks and shrieks, among the most startling sounds of the African night, can carry for over a kilometre.',
       'Dendrohyrax has four species; one, the Benin tree hyrax, was only recognised in 2021, after scientists noticed its unusual barking calls.'],
      [('Species in genus', '4'), ('Weight', 'About 2–4 kg'), ('IUCN status', 'Least Concern')],
      ['southern tree hyrax', 'tree hyrax', 'hyrax', 'dendrohyrax', 'africa', 'forest'],
      [C('Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Tanzania', 'Malawi'), part('Dem. Rep. Congo', 27, -12, 31, 2), part('Zambia', 28, -15, 33, -8), part('Mozambique', 32, -21, 37, -11), part('Zimbabwe', 32, -21, 33.2, -17), part('South Africa', 26, -34.5, 31, -30)]),

    # ---- Aardvark ----
    G('orycteropus-afer', 'Orycteropus afer', 'Aardvark', 'tubulidentata', 'Savannas, grasslands and woodlands across sub-Saharan Africa',
      ['A pig-sized, long-eared, night-active digger and the only living member of its order. Its powerful claws break open termite mounds and ant nests, and a long sticky tongue collects tens of thousands of insects in a night. Its name means “earth pig” in Afrikaans. Its teeth have no enamel and are made of fine tubes, and they keep growing throughout its life.',
       'Its burrows are later used as homes by many other animals, from warthogs and hyenas to porcupines, bats and birds. It also eats the fruit of the aardvark cucumber and buries its seeds in its dung, spreading the plant.'],
      [('Species in genus', '1'), ('Weight', 'About 40–65 kg'), ('IUCN status', 'Least Concern')],
      ['aardvark', 'earth pig', 'antbear', 'orycteropus', 'tubulidentata', 'africa'],
      [{'continents': ['Africa'], 'latMax': 16, 'exclude': ['Madagascar', 'Comoros', 'Cabo Verde', 'São Tomé and Principe']}]),

    # ---- Tenrecs and otter shrews ----
    G('tenrec-ecaudatus', 'Tenrec ecaudatus', 'Common tenrec', 'tenrecidae', 'Madagascar; introduced to the Comoros, Mauritius, Réunion and the Seychelles',
      ['The largest tenrec, a tailless, spiny-haired, hedgehog-like insect-eater up to about 2 kg. It holds the record for the largest litters of any mammal: up to 32 young at once, and females can have up to 29 nipples.',
       'It sleeps through the dry season for months in a burrow. In Madagascar it is hunted for food.'],
      [('Species in genus', '1'), ('Weight', 'About 1–2.4 kg'), ('Litter', 'Up to 32 young'), ('IUCN status', 'Least Concern')],
      ['common tenrec', 'tailless tenrec', 'tenrec', 'madagascar', 'biggest litter'],
      [C('Madagascar', 'Comoros', 'Mauritius', 'Seychelles')]),
    G('setifer-setosus', 'Setifer setosus', 'Greater hedgehog tenrec', 'tenrecidae', 'Forests, scrub, farmland and towns across Madagascar',
      ['A tenrec covered in short, stiff spines that rolls into a ball when threatened, so like a hedgehog that it is a textbook example of convergent evolution: the two are not closely related.'],
      [('Species in genus', '1'), ('Weight', 'About 180–270 g'), ('IUCN status', 'Least Concern')],
      ['greater hedgehog tenrec', 'hedgehog tenrec', 'tenrec', 'setifer', 'madagascar', 'convergent evolution'],
      [C('Madagascar')]),
    G('echinops-telfairi', 'Echinops telfairi', 'Lesser hedgehog tenrec', 'tenrecidae', 'Dry forests and scrub of south-western Madagascar',
      ['A small, spiny, hedgehog-like tenrec that climbs well and eats insects. To survive the cool, dry season it hibernates for months, letting its body temperature drop close to that of its surroundings. It is sometimes kept as a pet.'],
      [('Species in genus', '1'), ('Weight', 'About 100–200 g'), ('IUCN status', 'Least Concern')],
      ['lesser hedgehog tenrec', 'hedgehog tenrec', 'tenrec', 'echinops', 'madagascar', 'pet'],
      [part('Madagascar', 43, -25.7, 46.5, -20)]),
    G('hemicentetes-semispinosus', 'Hemicentetes semispinosus', 'Lowland streaked tenrec', 'tenrecidae', 'Rainforests and farmland of eastern Madagascar',
      ['A small tenrec striped in black and yellow, with detachable barbed quills. It is the only mammal known to communicate by stridulation: it rubs together special quills on its back to make a high-pitched sound, probably to keep its family group together. It feeds mainly on earthworms.'],
      [('Species in genus', '2'), ('Weight', 'About 80–280 g'), ('IUCN status', 'Least Concern')],
      ['lowland streaked tenrec', 'streaked tenrec', 'tenrec', 'hemicentetes', 'stridulation', 'madagascar'],
      [part('Madagascar', 46.5, -25, 50.5, -12)]),
    G('microgale-longicaudata', 'Microgale longicaudata', 'Lesser long-tailed shrew tenrec', 'tenrecidae', 'Rainforests of eastern and northern Madagascar',
      ['A tiny, shrew-like tenrec with a tail more than twice as long as its body, which it can wrap around twigs while climbing. Microgale, the shrew tenrecs, is the largest tenrec genus, with about 22 species, several discovered only since the 1990s.'],
      [('Species in genus', 'About 22'), ('Weight', 'About 5–10 g'), ('IUCN status', 'Least Concern')],
      ['shrew tenrec', 'long-tailed shrew tenrec', 'tenrec', 'microgale', 'madagascar'],
      [part('Madagascar', 46.5, -25, 50.5, -12)]),
    G('limnogale-mergulus', 'Limnogale mergulus', 'Web-footed tenrec', 'tenrecidae', 'Fast-flowing streams of the eastern highlands of Madagascar',
      ['The only semi-aquatic tenrec, a small otter-like swimmer with webbed hind feet and a flattened tail that hunts aquatic insect larvae, crayfish and frogs at night. Deforestation that muddies its clear streams is the main threat.'],
      [('Species in genus', '1'), ('Weight', 'About 60–100 g'), ('IUCN status', 'Vulnerable')],
      ['web-footed tenrec', 'aquatic tenrec', 'tenrec', 'limnogale', 'madagascar'],
      [part('Madagascar', 46.5, -22.5, 48.5, -18)]),
    G('potamogale-velox', 'Potamogale velox', 'Giant otter shrew', 'potamogalidae', 'Rivers and streams of the rainforests of central Africa',
      ['An otter-like insectivore up to about 60 cm long, half of it a flattened tail that it sweeps from side to side to swim. It hunts crabs, fish and frogs at night, finding them with its sensitive whiskers. Despite its name it is not a shrew but a relative of tenrecs.'],
      [('Species in genus', '1'), ('Length', 'About 50–65 cm'), ('IUCN status', 'Least Concern')],
      ['giant otter shrew', 'otter shrew', 'potamogale', 'afrosoricid', 'africa'],
      [part('Nigeria', 5, 4, 10, 7), C('Cameroon', 'Eq. Guinea', 'Gabon', 'Congo'), part('Central African Rep.', 15, 2, 24, 6), part('Dem. Rep. Congo', 12, -8, 30, 5), part('Angola', 12, -9, 22, -5), part('Uganda', 29.5, -1, 31, 1.5)]),

    # ---- Golden moles ----
    G('chrysochloris-asiatica', 'Chrysochloris asiatica', 'Cape golden mole', 'chrysochloridae', 'Sandy and loamy soils of the Western and Northern Cape, South Africa',
      ['A small, blind golden mole with iridescent, coppery fur and a leathery nose pad for pushing through soil. Its name “asiatica” is a mistake: early naturalists wrongly thought it came from Siberia.',
       'In 2023 a relative, De Winton’s golden mole, unrecorded for 87 years, was found again by sampling the sand for traces of its DNA.'],
      [('Species in genus', '3'), ('Weight', 'About 35–50 g'), ('IUCN status', 'Least Concern')],
      ['cape golden mole', 'golden mole', 'chrysochloris', 'south africa', 'de wintons golden mole'],
      [part('South Africa', 17, -34.5, 21, -29)]),
    G('eremitalpa-granti', 'Eremitalpa granti', 'Grant’s golden mole', 'chrysochloridae', 'Sand dunes of the Namib Desert in Namibia and north-western South Africa',
      ['A tiny golden mole that “swims” through loose desert sand rather than digging tunnels, which collapse behind it. Blind, it detects the vibrations of termites and of wind-blown grass hummocks with an enlarged middle-ear bone, and travels several kilometres a night between them.'],
      [('Species in genus', '1'), ('Weight', 'About 15–30 g'), ('IUCN status', 'Least Concern')],
      ['grants golden mole', 'desert golden mole', 'golden mole', 'eremitalpa', 'namib', 'sand swimmer'],
      [part('Namibia', 12, -28, 16, -19), part('South Africa', 16.5, -32, 18.5, -28.5)]),
    G('chrysospalax-trevelyani', 'Chrysospalax trevelyani', 'Giant golden mole', 'chrysochloridae', 'Forests of the Eastern Cape, South Africa',
      ['The largest golden mole, about 20 cm long and up to 500 g, which forages on the forest floor at night for giant earthworms and millipedes. Its small forest patches are threatened by cattle, firewood collecting and dogs.'],
      [('Species in genus', '2'), ('Weight', 'About 400–500 g'), ('IUCN status', 'Endangered')],
      ['giant golden mole', 'golden mole', 'chrysospalax', 'south africa', 'eastern cape'],
      [part('South Africa', 26.5, -33.5, 30, -31.5)]),
    G('amblysomus-hottentotus', 'Amblysomus hottentotus', 'Hottentot golden mole', 'chrysochloridae', 'Grassland, forest edges and gardens of eastern South Africa, Lesotho and eSwatini',
      ['A common golden mole that makes ridges of raised soil across lawns and fields as it tunnels just below the surface for earthworms and insect larvae. Like other golden moles, it can lower its metabolism to save energy in cold weather.'],
      [('Species in genus', '5'), ('Weight', 'About 50–100 g'), ('IUCN status', 'Least Concern')],
      ['hottentot golden mole', 'golden mole', 'amblysomus', 'south africa'],
      [part('South Africa', 26, -34, 32.5, -24), C('Lesotho', 'eSwatini')]),

    # ---- Sengis ----
    G('rhynchocyon-petersi', 'Rhynchocyon petersi', 'Black-and-rufous giant sengi', 'macroscelidea', 'Coastal and mountain forests of Kenya and Tanzania',
      ['A squirrel-sized sengi with a long, twitching, trunk-like snout and striking black and red fur, which forages in leaf litter for insects, spiders and worms. Pairs live in territories and build nests of leaves on the forest floor.',
       'Rhynchocyon, the giant sengis, has five species; the grey-faced sengi of Tanzania’s Udzungwa Mountains was only discovered in 2005, first seen on camera traps.'],
      [('Species in genus', '5'), ('Weight', 'About 400–700 g')],
      ['black-and-rufous giant sengi', 'giant sengi', 'elephant shrew', 'sengi', 'rhynchocyon', 'kenya', 'tanzania'],
      [part('Kenya', 38.5, -4.7, 41, -1.5), part('Tanzania', 35.5, -10, 40, -4)]),
    G('elephantulus-rufescens', 'Elephantulus rufescens', 'Rufous sengi', 'macroscelidea', 'Dry savanna and bushland of East Africa',
      ['A mouse-sized sengi that keeps a network of cleared trails through its territory and races along them at high speed to escape predators. Pairs mate for life but spend most of their time apart.',
       'Elephantulus has about 10 species. The Somali sengi, unrecorded by scientists for about 50 years, was found alive in Djibouti in 2019 and is now placed in its own genus, Galegeeska.'],
      [('Species in genus', 'About 10'), ('Weight', 'About 50–60 g'), ('IUCN status', 'Least Concern')],
      ['rufous sengi', 'elephant shrew', 'sengi', 'elephantulus', 'somali sengi', 'east africa'],
      [C('Kenya', 'Somalia', 'Somaliland'), part('Ethiopia', 37, 3.5, 46, 10), part('Tanzania', 33, -8, 39, -1), part('Uganda', 32, 1, 35, 4), part('S. Sudan', 32, 4, 35.5, 6)]),
    G('macroscelides-proboscideus', 'Macroscelides proboscideus', 'Round-eared sengi', 'macroscelidea', 'Semi-desert and dry scrub of Namibia, Botswana and South Africa',
      ['A tiny, round-eared sengi of open, dry country that lives in monogamous pairs and saves energy by dropping into torpor on cold nights. Despite its small size it is a close relative of elephants.',
       'Macroscelides has three species; the Etendeka round-eared sengi of Namibia was described in 2014.'],
      [('Species in genus', '3'), ('Weight', 'About 30–45 g'), ('IUCN status', 'Least Concern')],
      ['round-eared sengi', 'elephant shrew', 'sengi', 'macroscelides', 'namibia', 'karoo'],
      [part('Namibia', 14, -29, 20, -22), part('Botswana', 20, -27, 23, -23), part('South Africa', 17, -33.5, 25, -27)]),
    G('petrodromus-tetradactylus', 'Petrodromus tetradactylus', 'Four-toed sengi', 'macroscelidea', 'Forests and thickets of central, eastern and southern Africa',
      ['A rat-sized sengi with only four toes on its hind feet, which thumps its hind legs on the ground as an alarm signal. It lives in pairs and clears trails through dense undergrowth, foraging mainly for ants and termites.'],
      [('Species in genus', '1'), ('Weight', 'About 150–280 g'), ('IUCN status', 'Least Concern')],
      ['four-toed sengi', 'elephant shrew', 'sengi', 'petrodromus', 'africa'],
      [part('Kenya', 37, -4.7, 41.5, 0), C('Tanzania', 'Malawi'), part('Mozambique', 32, -27, 41, -11), part('Zambia', 22, -18, 34, -8), part('Zimbabwe', 29, -22.5, 33, -15), part('South Africa', 31, -29, 33, -25), part('Dem. Rep. Congo', 13, -13, 30, 3), part('Angola', 12, -12, 22, -5), part('Congo', 11, -5, 18, 3), part('Uganda', 29.5, -1, 34, 3)]),
    G('petrosaltator-rozeti', 'Petrosaltator rozeti', 'North African sengi', 'macroscelidea', 'Rocky, dry country of Morocco, Algeria, Tunisia and Libya',
      ['The only sengi living north of the Sahara, in rocky scrub and semi-desert. It was long placed in Elephantulus, but DNA showed it is most closely related to the four-toed sengi, and it was given its own genus in 2016.'],
      [('Species in genus', '1'), ('Weight', 'About 45–50 g'), ('IUCN status', 'Least Concern')],
      ['north african sengi', 'elephant shrew', 'sengi', 'petrosaltator', 'morocco', 'north africa'],
      [part('Morocco', -10, 28, -1, 35), part('W. Sahara', -14, 26, -8.7, 27.7), part('Algeria', -2, 29, 9, 36.5), part('Tunisia', 8, 31, 11.5, 37), part('Libya', 10, 30, 15, 33)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Before the ivory trade of the 1800s and 1900s, across almost all of Africa south of the Sahara
    # outside the rainforest.
    'loxodonta-africana': {'regions': [{'continents': ['Africa'], 'latMax': 17, 'exclude': ['Madagascar', 'Comoros', 'Cabo Verde', 'São Tomé and Principe', 'Gabon', 'Congo', 'Eq. Guinea']}]},
    'loxodonta-cyclotis': {'regions': [C('Gabon', 'Congo', 'Eq. Guinea', 'Liberia', 'Sierra Leone'), part('Cameroon', 9, 1.5, 16, 6), part('Central African Rep.', 15, 2, 24, 5.5), part('Dem. Rep. Congo', 15, -6, 30.5, 5), part("Côte d'Ivoire", -8.5, 4.5, -2.5, 8), part('Ghana', -3, 4.5, 0.5, 7.5), part('Guinea', -10, 7.2, -7.5, 9.5), part('Nigeria', 5, 4.5, 10, 7.5)]},
    # Still widespread across India, and in southern China north to about Guangdong and Fujian.
    'elephas-maximus': {'regions': [part('India', 72, 8, 89, 31), C('Sri Lanka', 'Bhutan', 'Bangladesh', 'Myanmar', 'Laos', 'Cambodia', 'Vietnam', 'Thailand'), part('Nepal', 80, 26.3, 88.2, 29), part('Malaysia', 100, 1.3, 104.5, 6.7), part('Malaysia', 115, 4, 119.3, 7), part('Indonesia', 95, -6, 106, 5.8), part('China', 97.5, 21, 118, 26)]},
    # Once more widespread around Asian coasts, including southern China and Japan's Ryukyu Islands.
    'dugong-dugon': {'add': [sea(105, 18, 122, 24), sea(123, 24, 130, 29)]},
    'chrysospalax-trevelyani': {'add': [part('South Africa', 26, -34, 31, -30)]},
}
HISTORIC = {**{sid: 'same' for sid in [
    'trichechus-manatus', 'trichechus-inunguis', 'trichechus-senegalensis', 'procavia-capensis', 'heterohyrax-brucei', 'dendrohyrax-arboreus',
    'orycteropus-afer', 'tenrec-ecaudatus', 'setifer-setosus', 'echinops-telfairi', 'hemicentetes-semispinosus', 'microgale-longicaudata',
    'limnogale-mergulus', 'potamogale-velox', 'chrysochloris-asiatica', 'eremitalpa-granti', 'amblysomus-hottentotus',
    'rhynchocyon-petersi', 'elephantulus-rufescens', 'macroscelides-proboscideus', 'petrodromus-tetradactylus', 'petrosaltator-rozeti',
]}, **HISTORIC_CHANGED}
