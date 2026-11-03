# Common farm animals, where Animal Almanac had only their wild relatives. Ranges show where each was
# domesticated, how it spread with people, and where it is kept today; country-level outlines
# clipped by boxes, so they are approximate. Checked November 2026.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def world(**clip):
    return {'world': True, **clip}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia',
          'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herzegovina', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria',
          'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'United Kingdom', 'Ireland', 'Norway', 'Sweden', 'Finland']
NEAR_EAST = ['Turkey', 'Syria', 'Iraq', 'Israel', 'Lebanon', 'Jordan', 'Cyprus']
FERTILE_CRESCENT = [C(*NEAR_EAST), part('Iran', 44, 30, 52, 39)]
OLD_WORLD = [{'continents': ['Europe', 'Asia'], 'latMax': 65}, {'continents': ['Africa']}]
ANDES = [part('Peru', -80, -18, -68, -3), part('Bolivia', -70, -23, -64, -14), part('Chile', -71, -27, -66, -17), part('Argentina', -68, -28, -64, -21), part('Ecuador', -80, -5, -77, 1)]
TIBET = [part('China', 78, 27, 104, 40), C('Mongolia', 'Nepal', 'Bhutan'), part('India', 74, 30, 80, 36), part('Pakistan', 72, 34, 77, 37), C('Kyrgyzstan', 'Tajikistan')]


def F(id, name, common, parent, desc):
    return {'id': id, 'name': name, 'common': common, 'parent': parent, 'family': True, 'description': desc}


CLADES = [
    F('apidae', 'Apidae', 'Bees', 'hymenoptera', 'The largest bee family, including honey bees, bumblebees, stingless bees and carpenter bees.'),
]

UPGRADES = {}


def G(id, name, common, clade, place, summary, facts, keywords, rng, **extra):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng, **extra}


GENERA = [
    G('bos-taurus', 'Bos taurus', 'Cattle', 'bovidae', 'Worldwide with people; domesticated from the aurochs',
      ['Cattle descend from the aurochs, a huge wild ox that died out in 1627. They were domesticated twice: in the Near East about 10,500 years ago, giving the taurine cattle of Europe, and in the Indus Valley about 8,000 years ago, giving the humped zebu of hot countries, sometimes called Bos indicus.',
       'There are about 1.5 billion cattle, kept for meat, milk, leather and pulling ploughs. The burps of cattle and other livestock are a major source of methane, a powerful greenhouse gas.',
       'A bull does not charge because a cape is red: cattle cannot tell red from green, and it is the cape’s movement that provokes it.'],
      [('Domesticated', 'About 10,500 years ago, Near East; zebu about 8,000 years ago, Indus Valley'), ('Number', 'About 1.5 billion'), ('Myth', 'Bulls are not angered by red')],
      ['cattle', 'cow', 'bull', 'ox', 'zebu', 'bos taurus', 'bos indicus', 'aurochs', 'farm animal', 'livestock'],
      [world(latMin=-50, latMax=70)],
      pastRanges=[
          {'from': 10500, 'to': 6000, 'label': 'Domesticated in the Near East and the Indus Valley', 'regions': [*FERTILE_CRESCENT, C('Pakistan'), part('India', 68, 20, 80, 32)]},
          {'from': 6000, 'to': 500, 'label': 'Spread across the Old World', 'regions': OLD_WORLD},
      ]),
    G('equus-caballus', 'Equus caballus', 'Horse', 'equidae', 'Worldwide with people; domesticated on the steppes of western Eurasia',
      ['Ancient DNA shows that today’s domestic horses come from the steppes of the lower Volga and Don rivers, in what is now southern Russia, about 4,200 years ago. Within a few centuries, riding and chariots carried them across Eurasia, transforming travel and war.',
       'Earlier horses kept at Botai in Kazakhstan, about 5,500 years ago, turned out to be the ancestors of Przewalski’s horses, not of modern horses. So Przewalski’s horse, often called the last truly wild horse, may instead descend from those early herded horses. Mustangs and brumbies are feral descendants of domestic horses.'],
      [('Domesticated', 'About 4,200 years ago, western Eurasian steppe'), ('Number', 'About 60 million'), ('Myth', 'Mustangs are feral, not wild horses')],
      ['horse', 'pony', 'equus caballus', 'mustang', 'brumby', 'przewalski', 'farm animal', 'livestock'],
      [world(latMin=-50, latMax=70)],
      pastRanges=[
          {'from': 4500, 'to': 4000, 'label': 'Domesticated on the steppe', 'regions': [part('Russia', 38, 44, 52, 54), part('Kazakhstan', 46, 45, 55, 52), part('Ukraine', 33, 46, 40, 50)]},
          {'from': 4000, 'to': 500, 'label': 'Spread across Eurasia and North Africa with riders and chariots', 'regions': [{'continents': ['Europe', 'Asia'], 'latMax': 62}, {'continents': ['Africa'], 'latMin': 10}]},
      ]),
    G('equus-asinus', 'Equus asinus', 'Donkey', 'equidae', 'Worldwide with people; domesticated in East Africa',
      ['Donkeys come from the African wild ass, domesticated once, in East Africa, about 7,000 years ago, probably by herders as the Sahara dried out. They became the pack animals that carried goods for early civilisations from Egypt to Mesopotamia.',
       'There are about 50 million donkeys, still vital to farmers and traders in Africa and Asia. Their wild ancestor, the African wild ass, is now critically endangered.'],
      [('Domesticated', 'About 7,000 years ago, East Africa'), ('Number', 'About 50 million')],
      ['donkey', 'ass', 'burro', 'equus asinus', 'mule', 'farm animal', 'livestock'],
      [world(latMin=-45, latMax=60)],
      pastRanges=[
          {'from': 7000, 'to': 4500, 'label': 'Domesticated in East Africa', 'regions': [C('Sudan', 'Egypt', 'Ethiopia', 'Eritrea', 'Somalia', 'Djibouti', 'Kenya')]},
          {'from': 4500, 'to': 500, 'label': 'Spread with traders', 'regions': [{'continents': ['Africa'], 'latMin': -5}, *FERTILE_CRESCENT, C(*EUROPE[:25]), part('Iran', 44, 25, 63, 40), C('Afghanistan', 'Pakistan', 'India')]},
      ]),
    G('sus-domesticus', 'Sus domesticus', 'Pig', 'suidae', 'Worldwide with people; domesticated from wild boar',
      ['Pigs were domesticated from wild boar twice, in eastern Anatolia about 10,500 years ago and in China about 9,000 years ago. Farmers took Near Eastern pigs into Europe, but interbreeding with local wild boar later replaced almost all of their Near Eastern ancestry.',
       'There are nearly a billion pigs, about half of them in China. Despite the saying, pigs hardly sweat at all: they wallow in mud to keep cool and to protect their skin from the sun.'],
      [('Domesticated', 'About 10,500 years ago, Anatolia; about 9,000 years ago, China'), ('Number', 'Nearly 1 billion'), ('Myth', 'Pigs barely sweat, so they wallow to keep cool')],
      ['pig', 'hog', 'swine', 'sus domesticus', 'farm animal', 'livestock'],
      [world(latMin=-50, latMax=70)],
      pastRanges=[
          {'from': 10500, 'to': 7000, 'label': 'Domesticated in Anatolia and China', 'regions': [C('Turkey', 'Syria', 'Iraq'), part('China', 105, 25, 122, 40)]},
          {'from': 7000, 'to': 500, 'label': 'Spread across Eurasia', 'regions': [{'continents': ['Europe', 'Asia'], 'latMax': 62}, {'continents': ['Africa'], 'latMin': 20}]},
      ]),
    G('ovis-aries', 'Ovis aries', 'Sheep', 'bovidae', 'Worldwide with people; domesticated from the mouflon',
      ['Sheep were among the first animals farmed, domesticated from the Asiatic mouflon in the Near East about 10,500 years ago, first for meat, milk and skins. Woolly fleeces that keep growing came later, about 5,000 years ago; wild sheep moult a short coat each year.',
       'There are about 1.3 billion sheep. The Soay sheep of the remote St Kilda islands in Scotland are a feral breed close to the early domestic sheep of Europe.'],
      [('Domesticated', 'About 10,500 years ago, Near East'), ('Number', 'About 1.3 billion')],
      ['sheep', 'lamb', 'ram', 'ewe', 'ovis aries', 'wool', 'mouflon', 'farm animal', 'livestock'],
      [world(latMin=-55, latMax=70)],
      pastRanges=[
          {'from': 10500, 'to': 7000, 'label': 'Domesticated in the Near East', 'regions': FERTILE_CRESCENT},
          {'from': 7000, 'to': 500, 'label': 'Spread across the Old World', 'regions': OLD_WORLD},
      ]),
    G('capra-hircus', 'Capra hircus', 'Goat', 'bovidae', 'Worldwide with people; domesticated from the wild goat',
      ['Goats were domesticated from the wild goat, or bezoar ibex, in the Zagros Mountains of Iran and in Anatolia about 10,500 years ago. Hardy and able to browse on almost anything leafy, they thrive where cattle cannot.',
       'There are over a billion goats. Feral goats strip islands of plants; a project on the Galápagos removed about 140,000 from Isabela and nearby islands by 2006 to save the giant tortoises’ habitat. And no, they do not eat tin cans.'],
      [('Domesticated', 'About 10,500 years ago, Zagros Mountains and Anatolia'), ('Number', 'Over 1 billion')],
      ['goat', 'kid', 'billy goat', 'nanny goat', 'capra hircus', 'farm animal', 'livestock', 'feral goat'],
      [world(latMin=-50, latMax=70)],
      pastRanges=[
          {'from': 10500, 'to': 7000, 'label': 'Domesticated in the Zagros and Anatolia', 'regions': FERTILE_CRESCENT},
          {'from': 7000, 'to': 500, 'label': 'Spread across the Old World', 'regions': OLD_WORLD},
      ]),
    G('gallus-gallus-domesticus', 'Gallus gallus domesticus', 'Chicken', 'phasianidae', 'Worldwide with people; domesticated from the red junglefowl',
      ['The most numerous bird on Earth, with over 20 billion alive at any time. Chickens come from the red junglefowl of Southeast Asia, domesticated perhaps 3,500 years ago, probably around rice and millet fields, and at first kept more for cockfighting and ceremonies than for food.',
       'Like all birds, chickens are living dinosaurs. They are often called the closest living relatives of T. rex, after a 2008 study of proteins from a T. rex bone, but every bird is equally closely related to it: the chicken is no closer than a sparrow or an ostrich.'],
      [('Domesticated', 'About 3,500 years ago, Southeast Asia'), ('Number', 'Over 20 billion'), ('Myth', 'No closer to T. rex than any other bird')],
      ['chicken', 'hen', 'rooster', 'cockerel', 'gallus', 'poultry', 'farm animal', 'livestock'],
      [world(latMin=-55, latMax=70)],
      pastRanges=[
          {'from': 3500, 'to': 2500, 'label': 'Domesticated in Southeast Asia', 'regions': [C('Thailand', 'Myanmar', 'Laos', 'Cambodia', 'Vietnam'), part('China', 97, 20, 110, 26)]},
          {'from': 2500, 'to': 500, 'label': 'Spread across the Old World and the Pacific', 'regions': OLD_WORLD},
      ]),
    G('lama-glama', 'Lama glama', 'Llama', 'camelidae', 'The Andes, and farms worldwide; domesticated from the guanaco',
      ['The pack animal of the Andes, domesticated from the guanaco in the highlands of Peru about 4,000 to 7,000 years ago. Llama caravans carried goods across the Inca Empire, and their dung was burned for fuel and used to grow crops at high altitude.',
       'A llama will carry only about a quarter of its body weight, and lies down and refuses to move if overloaded.'],
      [('Domesticated', 'About 4,000 to 7,000 years ago, Andes'), ('Load', 'About a quarter of its body weight')],
      ['llama', 'lama glama', 'camelid', 'andes', 'inca', 'farm animal', 'pack animal'],
      ANDES,
      pastRanges=[{'from': 7000, 'to': 500, 'label': 'Domesticated in the Andes', 'regions': ANDES}]),
    G('vicugna-pacos', 'Vicugna pacos', 'Alpaca', 'camelidae', 'The Andes, and farms worldwide; domesticated from the vicuña',
      ['Kept for its soft, warm fleece rather than as a pack animal. For a long time alpacas were thought to come from the guanaco, like llamas, but DNA studies since 2001 show they were domesticated from the smaller, wild vicuña, so they are now placed in the vicuña’s genus.'],
      [('Domesticated', 'About 6,000 to 7,000 years ago, Andes'), ('Myth', 'Not a small llama: it comes from the vicuña')],
      ['alpaca', 'vicugna pacos', 'camelid', 'andes', 'fleece', 'farm animal'],
      ANDES,
      pastRanges=[{'from': 7000, 'to': 500, 'label': 'Domesticated in the Andes', 'regions': ANDES}]),
    G('bubalus-bubalis', 'Bubalus bubalis', 'Water buffalo', 'bovidae', 'South and Southeast Asia, and farms worldwide',
      ['About 200 million water buffalo are kept, mostly in Asia, for ploughing rice paddies, milk and meat. There are two kinds, domesticated separately from the wild water buffalo: river buffalo in South Asia about 5,000 years ago, and swamp buffalo in China and Southeast Asia about 4,000 years ago. Buffalo milk makes true mozzarella di bufala.'],
      [('Domesticated', 'About 5,000 years ago, South Asia; about 4,000 years ago, East Asia'), ('Number', 'About 200 million')],
      ['water buffalo', 'buffalo', 'bubalus bubalis', 'carabao', 'mozzarella', 'farm animal', 'livestock'],
      [C('India', 'Pakistan', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia', 'Indonesia', 'Philippines', 'Egypt', 'Italy'), part('China', 98, 18, 122, 34)],
      pastRanges=[{'from': 5000, 'to': 500, 'label': 'Domesticated in South and East Asia', 'regions': [C('India', 'Pakistan', 'Bangladesh', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam'), part('China', 98, 18, 122, 34)]}]),
    G('bos-grunniens', 'Bos grunniens', 'Domestic yak', 'bovidae', 'The Tibetan Plateau and the high mountains of Central Asia',
      ['A shaggy ox domesticated from the wild yak on the Tibetan Plateau about 5,000 to 7,000 years ago, which let people live year-round above 4,000 m. Yaks give milk, meat, wool, leather and dung for fuel, and carry loads over high passes. Its name means “grunting ox”, from its grunting call.'],
      [('Domesticated', 'About 5,000 to 7,000 years ago, Tibetan Plateau'), ('Lives', 'Up to about 5,000 m')],
      ['yak', 'domestic yak', 'bos grunniens', 'tibet', 'himalaya', 'farm animal', 'livestock'],
      TIBET,
      pastRanges=[{'from': 7000, 'to': 500, 'label': 'Domesticated on the Tibetan Plateau', 'regions': [part('China', 78, 27, 104, 40), C('Nepal', 'Bhutan')]}]),
    G('camelus-bactrianus', 'Camelus bactrianus', 'Bactrian camel', 'camelidae', 'The steppes and deserts of Central Asia',
      ['The two-humped camel of Central Asia, domesticated about 5,000 to 6,000 years ago, which carried goods along the Silk Road through deserts that are scorching in summer and far below freezing in winter.',
       'Its humps store fat, not water. The wild Bactrian camel of the Gobi is a separate species, not its ancestor, and is critically endangered.'],
      [('Domesticated', 'About 5,000 to 6,000 years ago, Central Asia'), ('Myth', 'Humps hold fat, not water')],
      ['bactrian camel', 'camel', 'camelus bactrianus', 'two humps', 'silk road', 'farm animal', 'pack animal'],
      [C('Mongolia', 'Kazakhstan', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan', 'Afghanistan'), part('China', 75, 36, 112, 46), part('Russia', 45, 44, 52, 50)],
      pastRanges=[{'from': 6000, 'to': 500, 'label': 'Domesticated in Central Asia', 'regions': [C('Mongolia', 'Kazakhstan', 'Turkmenistan', 'Uzbekistan'), part('China', 75, 36, 112, 46)]}]),
    G('apis-mellifera', 'Apis mellifera', 'Western honey bee', 'apidae', 'Native to Europe, Africa and the Near East; kept worldwide',
      ['A social bee living in colonies of tens of thousands, led by a single queen. People have taken honey from wild nests for at least 9,000 years and kept bees in hives for over 4,000. Three-quarters of the world’s main food crops benefit from animal pollinators such as bees.',
       'A worker bee dies after stinging a mammal only because her barbed sting catches in thick skin and tears away; she can sting other insects and survive.'],
      [('Colony', 'Tens of thousands of bees, one queen'), ('Myth', 'Bees die after stinging only when the sting gets stuck')],
      ['honey bee', 'honeybee', 'bee', 'apis mellifera', 'honey', 'pollinator', 'beekeeping', 'farm animal'],
      [world(latMin=-50, latMax=65)],
      pastRanges=[{'from': 10000, 'to': 500, 'label': 'Native range', 'regions': [{'continents': ['Europe'], 'latMax': 62}, {'continents': ['Africa']}, *FERTILE_CRESCENT, part('Iran', 44, 25, 63, 40)]}]),
]
