# Common pets and their wild relatives, where PaleoDex did not already have them. Ranges show the
# wild (or feral) range; domestic animals kept worldwide get worldwide ranges with how they spread.
# Ranges are country-level outlines (clipped by boxes), so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def world(**clip):
    return {'world': True, **clip}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'United Kingdom', 'Ireland']
NEAR_EAST = ['Turkey', 'Syria', 'Iraq', 'Israel', 'Lebanon', 'Jordan', 'Cyprus']

CLADES = [
    {'id': 'cricetidae', 'name': 'Cricetidae', 'common': 'Hamsters, voles and New World mice', 'parent': 'rodentia', 'family': True, 'description': 'A huge rodent family of about 800 species, including hamsters, voles, lemmings, muskrats, gerbils and most American mice and rats.'},
    {'id': 'chinchillidae', 'name': 'Chinchillidae', 'common': 'Chinchillas and viscachas', 'parent': 'rodentia', 'family': True, 'description': 'South American rodents with dense, soft fur, related to guinea pigs: the two chinchillas and the viscachas.'},
    {'id': 'erinaceidae', 'name': 'Erinaceidae', 'common': 'Hedgehogs and gymnures', 'parent': 'eutheria', 'family': True, 'description': 'Spiny hedgehogs of Europe, Asia and Africa, and their spineless relatives, the gymnures or moonrats of South-east Asia. The family has a fossil record going back about 55 million years.'},
    {'id': 'psittaculidae', 'name': 'Psittaculidae', 'common': 'Old World parrots', 'parent': 'aves', 'family': True, 'description': 'Parrots of Australia, Asia and Africa, including budgerigars, lovebirds, lorikeets, rosellas and ring-necked parakeets.'},
    {'id': 'estrildidae', 'name': 'Estrildidae', 'common': 'Waxbills and grass finches', 'parent': 'aves', 'family': True, 'description': 'Small, seed-eating songbirds of Africa, Asia and Australia, including zebra finches, Gouldian finches, munias and waxbills.'},
    {'id': 'eublepharidae', 'name': 'Eublepharidae', 'common': 'Eyelid geckos', 'parent': 'squamata', 'family': True, 'description': 'Ground-living geckos that, unlike most geckos, have movable eyelids and no sticky toe pads.'},
    {'id': 'poeciliidae', 'name': 'Poeciliidae', 'common': 'Livebearers', 'parent': 'actinopterygii', 'family': True, 'description': 'Small fish of the Americas, most of which give birth to live young: guppies, mollies, platies, swordtails and mosquitofish.'},
    {'id': 'characidae', 'name': 'Characidae', 'common': 'Tetras', 'parent': 'actinopterygii', 'family': True, 'description': 'A large family of mostly small, often colourful freshwater fish of Central and South America, including many aquarium tetras.'},
    {'id': 'danionidae', 'name': 'Danionidae', 'common': 'Danios and rasboras', 'parent': 'actinopterygii', 'family': True, 'description': 'Small carp-like freshwater fish of South and South-east Asia, separated from the carp family in 2018, including danios, rasboras and the zebrafish.'},
]

UPGRADES = {}


def G(id, name, common, clade, place, summary, facts, keywords, rng, **extra):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng, **extra}


GENERA = [
    # ---- Mammals ----
    G('felis-catus', 'Felis catus', 'Domestic cat', 'felidae', 'Worldwide with people; tamed from the African wildcat in the Near East',
      ['The world’s most popular pet, with perhaps 600 million or more cats. Cats descend from the African wildcat, which began living alongside the first farmers in the Near East about 10,000 years ago, probably drawn by mice in grain stores; a cat was buried with a person on Cyprus about 9,500 years ago. Ancient Egypt later revered them.',
       'Pet and feral cats are also among the most damaging introduced predators. They have been linked to at least 60 bird, mammal and reptile extinctions, mostly on islands, such as the Stephens Island wren of New Zealand, and in the USA alone they kill an estimated 1 to 4 billion birds a year.',
       'Some researchers treat the domestic cat as a form of the wildcat, Felis silvestris catus.'],
      [('Domesticated', 'About 10,000 years ago, Near East'), ('Weight', 'Usually about 3.5–5 kg'), ('Status', 'Domestic; also feral on every continent but Antarctica')],
      ['domestic cat', 'cat', 'house cat', 'kitten', 'pet', 'felis catus', 'feral cat', 'invasive'],
      [world(latMin=-55, latMax=72)],
      pastRanges=[
          {'from': 10000, 'to': 4000, 'label': 'Tamed alongside the first farmers', 'regions': [C(*NEAR_EAST), part('Iran', 44, 30, 52, 39), part('Egypt', 25, 22, 35, 32)]},
          {'from': 4000, 'to': 500, 'label': 'Spread across the Old World with people', 'regions': [C(*EUROPE, *NEAR_EAST), {'continents': ['Africa'], 'latMin': 0}, part('Iran', 44, 25, 63, 40), C('Afghanistan', 'Pakistan', 'India', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Thailand', 'Japan', 'North Korea', 'South Korea'), part('China', 98, 21, 125, 42)]},
      ]),
    G('canis-familiaris', 'Canis familiaris', 'Domestic dog', 'canidae', 'Worldwide with people; domesticated from Ice Age wolves',
      ['The first domesticated animal, descended from a population of Ice Age grey wolves at least 15,000 years ago, and possibly much earlier; where it happened is still debated. Dogs travelled with people into the Americas and later reached Australia, where they became the dingo about 3,500 years ago.',
       'There are perhaps 700 million to 1 billion dogs, most of them free-roaming village dogs rather than pets, and several hundred breeds, almost all created in the last 200 years.',
       'Dogs have been linked to the extinction of about a dozen species, and the arrival of the dingo may have helped end the thylacine and Tasmanian devil on mainland Australia. Some researchers treat the dog as a form of the wolf, Canis lupus familiaris.'],
      [('Domesticated', 'At least 15,000 years ago, Eurasia'), ('Breeds', 'Several hundred'), ('Status', 'Domestic; also free-roaming and feral (including the dingo)')],
      ['domestic dog', 'dog', 'puppy', 'pet', 'canis familiaris', 'dingo', 'village dog', 'wolf'],
      [world(latMin=-55, latMax=78)],
      pastRanges=[
          {'from': 15000, 'to': 10000, 'label': 'The first dogs, with Ice Age hunters', 'regions': [{'continents': ['Europe', 'Asia'], 'latMin': 25, 'latMax': 65}]},
          {'from': 10000, 'to': 3500, 'label': 'Spread with people (not yet in Australia)', 'regions': [{'continents': ['Europe', 'Asia', 'Africa', 'North America', 'South America'], 'latMax': 75}]},
      ]),
    G('cavia-porcellus', 'Cavia porcellus', 'Guinea pig', 'caviidae', 'Domestic worldwide; domesticated in the Andes of South America',
      ['Neither from Guinea nor a pig, the guinea pig was domesticated in the Andes at least 5,000 to 7,000 years ago from a wild cavy, and is still raised there for food, as cuy, especially in Peru, Ecuador and Bolivia. Spanish traders brought it to Europe in the 1500s.',
       'It is a close relative of the capybara. Like people, it cannot make its own vitamin C, which made it important in early medical research.'],
      [('Domesticated', 'At least 5,000 years ago, Andes'), ('Weight', 'About 0.7–1.2 kg'), ('Status', 'Domestic')],
      ['guinea pig', 'cavy', 'cuy', 'cavia', 'pet', 'andes', 'rodent'],
      [part('Peru', -80, -18, -69, -3), part('Ecuador', -80, -5, -77, 1), part('Bolivia', -69.5, -22, -64, -15), part('Colombia', -78, 0, -73, 6)]),
    G('mesocricetus-auratus', 'Mesocricetus auratus', 'Golden hamster', 'cricetidae', 'Wild only around Aleppo in northern Syria and southern Turkey; domestic worldwide',
      ['The Syrian hamster, the classic pet hamster. In the wild it lives alone in deep burrows in farmland, coming out at dusk, and carries food home in its huge cheek pouches.',
       'Almost all pet and laboratory golden hamsters descend from a mother and litter dug up near Aleppo in 1930 by the zoologist Israel Aharoni. The wild population is small and threatened.'],
      [('Species in genus', '4'), ('Weight', 'About 100–150 g'), ('IUCN status', 'Vulnerable (in the wild)')],
      ['golden hamster', 'syrian hamster', 'hamster', 'mesocricetus', 'pet', 'aleppo'],
      [part('Syria', 36.5, 35.8, 38.5, 37), part('Turkey', 36.5, 36.6, 38.5, 37.3)]),
    G('meriones-unguiculatus', 'Meriones unguiculatus', 'Mongolian gerbil', 'cricetidae', 'Steppes and semi-deserts of Mongolia and northern China; domestic worldwide',
      ['A sociable desert rodent that lives in family groups in burrows, drums its hind feet to warn of danger and needs very little water. Most pets and laboratory gerbils descend from about 20 pairs caught in Mongolia in 1935.',
       'Meriones has about 17 species, the jirds, from North Africa to China.'],
      [('Species in genus', 'About 17'), ('Weight', 'About 50–60 g'), ('IUCN status', 'Least Concern')],
      ['mongolian gerbil', 'gerbil', 'jird', 'meriones', 'pet', 'mongolia'],
      [C('Mongolia'), part('China', 105, 38, 125, 46), part('Russia', 100, 49.5, 118, 52)]),
    G('chinchilla-lanigera', 'Chinchilla lanigera', 'Long-tailed chinchilla', 'chinchillidae', 'Rocky slopes of the Andes in northern Chile; domestic worldwide',
      ['A rodent with the densest fur of any land animal, with dozens of hairs growing from each follicle, which keeps out cold and parasites; it bathes in dust instead of water. Hunting for fur nearly wiped out wild chinchillas by the early 1900s.',
       'Almost all pet and farmed chinchillas descend from a handful of wild animals taken to the USA in 1923. Only a few small wild colonies survive.'],
      [('Species in genus', '2'), ('Weight', 'About 400–600 g'), ('IUCN status', 'Endangered (in the wild)')],
      ['chinchilla', 'long-tailed chinchilla', 'chinchilla lanigera', 'pet', 'fur', 'andes', 'chile'],
      [part('Chile', -71.7, -32.5, -70, -29)]),
    G('mustela-furo', 'Mustela furo', 'Ferret', 'mustelidae', 'Domestic worldwide; feral in New Zealand',
      ['The domesticated form of the European polecat, kept for at least 2,000 years to hunt rabbits and rats by chasing them out of burrows, called ferreting. It sleeps up to 18 hours a day.',
       'Ferrets, stoats and weasels were released in New Zealand in the 1880s to control introduced rabbits; feral ferrets now prey on native birds such as kiwi.'],
      [('Domesticated', 'At least 2,000 years ago, Europe'), ('Weight', 'About 0.7–2 kg'), ('Status', 'Domestic; feral in New Zealand')],
      ['ferret', 'polecat', 'mustela furo', 'pet', 'ferreting', 'new zealand'],
      [C('New Zealand')], rangeFrom=140),
    G('mus-musculus', 'Mus musculus', 'House mouse', 'muridae', 'Worldwide with people; originally from the Indian subcontinent',
      ['Probably the most widespread mammal after humans, it spread from northern India and Pakistan with the first farmers and later on ships to almost everywhere people live. Pet “fancy mice” have been bred in China and Japan for centuries.',
       'The laboratory mouse, the most-used animal in medical research, is a house mouse. On islands, introduced mice can be deadly: on Gough Island in the South Atlantic they eat seabird chicks alive.'],
      [('Species in genus', 'About 40'), ('Weight', 'About 12–30 g'), ('IUCN status', 'Least Concern')],
      ['house mouse', 'mouse', 'mus musculus', 'lab mouse', 'fancy mouse', 'pet', 'rodent'],
      [world(latMin=-55, latMax=72)]),
    G('atelerix-albiventris', 'Atelerix albiventris', 'Four-toed hedgehog', 'erinaceidae', 'Savannas of West, Central and East Africa',
      ['The African pygmy hedgehog of the pet trade, a small hedgehog with only four toes on its hind feet. It eats insects, snails and other small animals, rolls into a spiny ball when threatened, and becomes sluggish in cold or dry seasons.',
       'Atelerix has four species, all in Africa.'],
      [('Species in genus', '4'), ('Weight', 'About 250–600 g'), ('IUCN status', 'Least Concern')],
      ['four-toed hedgehog', 'african pygmy hedgehog', 'hedgehog', 'atelerix', 'pet', 'africa'],
      [C('Senegal', 'Gambia', 'Mali', 'Burkina Faso', 'Niger', 'Nigeria', 'Chad', 'Sudan', 'S. Sudan', 'Ethiopia', 'Kenya', 'Uganda', 'Tanzania', latMax=17)]),

    # ---- Birds ----
    G('melopsittacus-undulatus', 'Melopsittacus undulatus', 'Budgerigar', 'psittaculidae', 'Dry inland Australia',
      ['A small, green and yellow parrot that roams dry inland Australia in flocks that can number thousands, following rain and seeding grasses. Brought to Britain in 1840 by the naturalist John Gould, it became one of the most popular pet birds, bred in blues, whites and many other colours.',
       'Budgies can learn to mimic speech; one, Puck, was recorded with a vocabulary of over 1,700 words.'],
      [('Species in genus', '1'), ('Weight', 'About 30–40 g'), ('IUCN status', 'Least Concern')],
      ['budgerigar', 'budgie', 'parakeet', 'melopsittacus', 'pet bird', 'parrot', 'australia'],
      [part('Australia', 114, -36, 151, -16)]),
    G('nymphicus-hollandicus', 'Nymphicus hollandicus', 'Cockatiel', 'cacatuidae', 'Open country of inland Australia',
      ['The smallest cockatoo, grey with a yellow crest and orange cheek patches, which lives in nomadic flocks in Australia’s interior. It is one of the most popular pet birds, and males often learn to whistle tunes.'],
      [('Species in genus', '1'), ('Weight', 'About 80–100 g'), ('IUCN status', 'Least Concern')],
      ['cockatiel', 'quarrion', 'nymphicus', 'cockatoo', 'pet bird', 'parrot', 'australia'],
      [part('Australia', 115, -36, 152, -14)]),
    G('psittacus-erithacus', 'Psittacus erithacus', 'Grey parrot', 'psittacidae', 'Rainforests of West and Central Africa',
      ['A grey parrot with a red tail, famous for its intelligence and gift for speech. Alex, studied by Irene Pepperberg for 30 years, learned to name objects, colours and numbers.',
       'Trapping for the pet trade, with millions of birds exported, and forest loss have caused steep declines; international trade in wild-caught birds was banned in 2016. The Timneh parrot of West Africa is now treated as a separate species.'],
      [('Species in genus', '2'), ('Weight', 'About 400 g'), ('IUCN status', 'Endangered')],
      ['grey parrot', 'african grey', 'gray parrot', 'psittacus', 'alex', 'pet bird', 'parrot', 'africa'],
      [C('Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Eq. Guinea', 'Gabon', 'Congo', 'Central African Rep.', 'Uganda'), part("Côte d'Ivoire", -6, 4, -2.5, 8), part('Dem. Rep. Congo', 12, -6, 31, 5), part('Kenya', 34, -1, 35.5, 1), part('Angola', 12, -9, 17, -5)]),
    G('agapornis-roseicollis', 'Agapornis roseicollis', 'Rosy-faced lovebird', 'psittaculidae', 'Dry country of Namibia, south-western Angola and north-western South Africa',
      ['A small green parrot with a pink face that lives in flocks in dry, rocky country, often nesting inside the huge communal nests of sociable weavers. Lovebirds are named for their close pair bonds and the way pairs sit together preening.',
       'Agapornis has nine species, all from Africa and Madagascar.'],
      [('Species in genus', '9'), ('Weight', 'About 50 g'), ('IUCN status', 'Least Concern')],
      ['rosy-faced lovebird', 'peach-faced lovebird', 'lovebird', 'agapornis', 'pet bird', 'parrot', 'namibia'],
      [part('Namibia', 13, -28, 19, -17), part('Angola', 12, -17.5, 15, -13), part('South Africa', 16.5, -30, 20, -28)]),
    G('taeniopygia-castanotis', 'Taeniopygia castanotis', 'Zebra finch', 'estrildidae', 'Grassland and scrub across most of mainland Australia',
      ['A tiny grey finch with an orange beak and, in males, orange cheeks and a striped throat. It lives in flocks in dry country and breeds quickly after rain. Popular as a pet, it is also one of the most-studied birds in science: young males learn their song from their fathers, much as children learn to speak.',
       'The Timor zebra finch of Indonesia’s Lesser Sunda Islands is now usually treated as a separate species.'],
      [('Species in genus', '2'), ('Weight', 'About 12 g'), ('IUCN status', 'Least Concern')],
      ['zebra finch', 'finch', 'taeniopygia', 'birdsong', 'pet bird', 'australia'],
      [part('Australia', 113, -38, 153, -12)]),

    # ---- Reptiles ----
    G('pogona-vitticeps', 'Pogona vitticeps', 'Central bearded dragon', 'agamidae', 'Dry woodland and desert of central and eastern Australia',
      ['A sturdy lizard with a spiny “beard” under its chin that it puffs out and turns black when threatened or courting. It also waves an arm and bobs its head to signal to others. It eats insects and plants.',
       'Australia has banned the export of its wildlife since the 1960s, so pet bearded dragons come from captive-bred stock. In some, eggs incubated at high temperatures hatch as females even when they are genetically male.'],
      [('Species in genus', '8'), ('Length', 'About 40–60 cm'), ('IUCN status', 'Least Concern')],
      ['bearded dragon', 'beardie', 'pogona', 'agamid', 'lizard', 'pet reptile', 'australia'],
      [part('Australia', 129, -37, 151, -19)]),
    G('eublepharis-macularius', 'Eublepharis macularius', 'Leopard gecko', 'eublepharidae', 'Dry, rocky grassland of Afghanistan, Pakistan, north-western India and eastern Iran',
      ['A spotted, ground-living gecko with movable eyelids and no sticky toe pads, so unlike many geckos it cannot climb walls. It stores fat in its thick tail, which it can shed to escape a predator and regrow.',
       'It is active at night and is one of the most popular pet lizards, bred in many colours and patterns.'],
      [('Species in genus', 'About 6'), ('Length', 'About 20–25 cm'), ('IUCN status', 'Least Concern')],
      ['leopard gecko', 'gecko', 'eublepharis', 'lizard', 'pet reptile', 'pakistan'],
      [C('Pakistan'), part('Afghanistan', 61, 29, 71, 35.5), part('India', 68, 24, 77, 33), part('Iran', 58, 25, 63, 31)]),
    G('python-regius', 'Python regius', 'Ball python', 'pythonidae', 'Savannas and open forests of West and Central Africa',
      ['A small, heavy-bodied python, usually under 1.5 m long, named for its habit of curling into a tight ball with its head tucked inside when frightened. It hunts rodents at night, killing them by constriction.',
       'It is the most traded live wild animal from Africa, with tens of thousands exported each year, many from snake farms in Togo, Benin and Ghana.'],
      [('Species in genus', 'About 10'), ('Length', 'Usually 1–1.5 m'), ('IUCN status', 'Near Threatened')],
      ['ball python', 'royal python', 'python', 'python regius', 'snake', 'pet reptile', 'africa'],
      [C('Senegal', 'Gambia', 'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Central African Rep.', 'S. Sudan', 'Uganda'), part('Mali', -12, 10, -4, 14), part('Burkina Faso', -5.5, 9.5, 2, 13), part('Chad', 15, 7.5, 22, 11)]),
    G('pantherophis-guttatus', 'Pantherophis guttatus', 'Corn snake', 'colubridae', 'Pine woods, fields and farm buildings of the south-eastern USA',
      ['A slender, orange-red rat snake with black-edged blotches, harmless to people, that kills mice and rats by constriction. Its name may come from the maize-like chequered pattern on its belly or from its habit of hunting rodents in corn stores.',
       'It is one of the most popular pet snakes, bred in dozens of colour forms.'],
      [('Species in genus', 'About 10'), ('Length', 'About 1–1.5 m'), ('IUCN status', 'Least Concern')],
      ['corn snake', 'red rat snake', 'pantherophis', 'rat snake', 'snake', 'pet reptile', 'usa'],
      [part('United States of America', -92, 25, -75, 40)]),
    G('testudo-hermanni', 'Testudo hermanni', 'Hermann’s tortoise', 'testudinidae', 'Mediterranean Europe, from eastern Spain to the Balkans',
      ['A small, yellow-and-black tortoise of Mediterranean scrub and woodland, one of Europe’s few native tortoises. It eats mostly plants, sleeps through the winter and can live for over 70 years.',
       'Fires, farming and collecting for the pet trade have reduced it; it is now protected and pets must be captive-bred.'],
      [('Species in genus', '5'), ('Length', 'About 15–20 cm'), ('IUCN status', 'Near Threatened')],
      ['hermanns tortoise', 'tortoise', 'testudo', 'pet reptile', 'europe', 'mediterranean'],
      [part('Spain', 0.5, 39, 4.5, 42.5), part('France', 6, 41.3, 9.6, 43.6), part('Italy', 7, 37, 18.5, 44.5), C('Croatia', 'Bosnia and Herz.', 'Montenegro', 'Albania', 'North Macedonia', 'Serbia', 'Greece', 'Bulgaria'), part('Romania', 21, 44, 23.5, 45.3), part('Turkey', 26, 40.5, 29.5, 42)]),

    # ---- Fish ----
    G('poecilia-reticulata', 'Poecilia reticulata', 'Guppy', 'poeciliidae', 'Streams of north-eastern South America and the southern Caribbean; introduced worldwide',
      ['A small livebearer, giving birth to live young; males are brightly coloured with large tails, females larger and drab. Named after Robert Guppy, who sent specimens from Trinidad in 1866, it is one of the most popular aquarium fish.',
       'Wild guppies in Trinidad are a classic example of evolution: in streams with many predators males are dull, and where predators are few they become bright within a few generations. Guppies released to eat mosquito larvae have harmed native fish in many countries.'],
      [('Species in genus', 'About 40'), ('Length', 'About 2–6 cm'), ('IUCN status', 'Least Concern')],
      ['guppy', 'millionfish', 'poecilia', 'livebearer', 'aquarium fish', 'trinidad'],
      [part('Venezuela', -73, 7, -60, 12), C('Trinidad and Tobago', 'Guyana', 'Suriname'), part('Brazil', -60, 0, -50, 5)]),
    G('paracheirodon-innesi', 'Paracheirodon innesi', 'Neon tetra', 'characidae', 'Blackwater and clearwater streams of the western Amazon basin',
      ['A tiny schooling fish with a glowing blue stripe and red tail, which makes it easy for others in the school to see in dark, tea-coloured water. It is one of the best-selling aquarium fish; most are now farmed in Asia.'],
      [('Species in genus', '3'), ('Length', 'About 3–4 cm'), ('IUCN status', 'Least Concern')],
      ['neon tetra', 'tetra', 'paracheirodon', 'aquarium fish', 'amazon'],
      [part('Peru', -76, -10, -70, -2), part('Colombia', -74, -4, -69, 1), part('Brazil', -70, -6, -64, 0)]),
    G('danio-rerio', 'Danio rerio', 'Zebrafish', 'danionidae', 'Rivers, rice paddies and ponds of northern India, Bangladesh and Nepal',
      ['A small, striped minnow and a favourite aquarium fish. It is also one of the most important animals in biology: its embryos are transparent, so scientists can watch organs form, and it can regrow its fins, spinal cord and even parts of its heart.',
       'Genetically modified zebrafish that glow red, green or other colours are sold as pets in some countries.'],
      [('Species in genus', 'About 45'), ('Length', 'About 3–4 cm'), ('IUCN status', 'Least Concern')],
      ['zebrafish', 'zebra danio', 'danio', 'aquarium fish', 'model organism', 'india'],
      [part('India', 75, 21, 96, 31), C('Bangladesh'), part('Nepal', 80, 26.3, 88.2, 28)]),
]


# Historic ranges (about 1,000 to 150 years ago). Domestic animals with written-out spread
# ('pastRanges') are not listed here.
HISTORIC_CHANGED = {
    # Spread across the world on ships and with settlers; before that, mainly Eurasia and North Africa.
    'mus-musculus': {'label': 'Before the age of sail', 'regions': [{'continents': ['Europe', 'Asia'], 'latMax': 65}, {'continents': ['Africa'], 'latMin': 15}]},
    # Wild chinchillas were far more widespread before the fur trade (Chile, Peru, Bolivia, Argentina).
    'chinchilla-lanigera': {'add': [part('Chile', -72, -33, -69, -26), part('Argentina', -69, -30, -65, -22), part('Bolivia', -69, -22, -66, -18), part('Peru', -72, -18, -69, -14)]},
}
HISTORIC = {**{sid: 'same' for sid in [
    'cavia-porcellus', 'mesocricetus-auratus', 'meriones-unguiculatus', 'atelerix-albiventris',
    'melopsittacus-undulatus', 'nymphicus-hollandicus', 'psittacus-erithacus', 'agapornis-roseicollis', 'taeniopygia-castanotis',
    'pogona-vitticeps', 'eublepharis-macularius', 'python-regius', 'pantherophis-guttatus', 'testudo-hermanni',
    'poecilia-reticulata', 'paracheirodon-innesi', 'danio-rerio',
]}, **HISTORIC_CHANGED}
