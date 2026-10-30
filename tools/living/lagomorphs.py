# Living lagomorphs: rabbits, hares and pikas. All 12 living genera, one entry each for the
# best-known species. Ranges are country-level outlines (clipped by boxes), so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia']

# The order Lagomorpha itself is defined with the fossil groups (families-6.ts).
CLADES = [
    {'id': 'leporidae', 'name': 'Leporidae', 'common': 'Rabbits and hares', 'parent': 'lagomorpha', 'family': True, 'description': 'About 65 species of rabbits and hares in 11 genera, on every continent except Antarctica (in Australia only as introduced animals). Hares are born furred with open eyes and live above ground; most rabbits are born naked and blind in burrows or nests.'},
    {'id': 'ochotonidae', 'name': 'Ochotonidae', 'common': 'Pikas', 'parent': 'lagomorpha', 'family': True, 'description': 'Small, round-eared, tailless relatives of rabbits, with about 34 living species in one genus, Ochotona, mostly in the mountains and steppes of Asia. Many more genera lived in the past, including the Sardinian pika, which survived until historical times.'},
]

UPGRADES = {}


def G(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    G('oryctolagus-cuniculus', 'Oryctolagus cuniculus', 'European rabbit', 'leporidae', 'Native to Spain, Portugal and north-west Africa; introduced across Europe, Australia, New Zealand, Chile, Argentina and many islands',
      ['The wild ancestor of every domestic rabbit, a social burrower that lives in warrens. Native to the Iberian Peninsula and north-west Africa, it was spread by the Romans and in the Middle Ages, when rabbits were farmed in walled warrens for meat and fur; it was domesticated in France by around 1500 to 1800.',
       'Twenty-four rabbits released in Victoria in 1859 multiplied into hundreds of millions, stripping vegetation across Australia; the myxoma virus (1950) and rabbit haemorrhagic disease (1995) were released to control them. Introduced rabbits ate Laysan Island bare in the early 1900s, wiping out the Laysan rail, millerbird and honeycreeper.',
       'Ironically, in its native range it is now endangered, hit by those same diseases, and its decline threatens the Iberian lynx and Spanish imperial eagle that depend on it.'],
      [('Species in genus', '1'), ('Weight', 'About 1.2–2.5 kg'), ('IUCN status', 'Endangered (in its native range)')],
      ['european rabbit', 'rabbit', 'bunny', 'oryctolagus', 'domestic rabbit', 'myxomatosis', 'invasive', 'australia'],
      [C('Portugal', 'Spain', 'France', 'United Kingdom', 'Ireland', 'Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Germany', 'Austria', 'Czechia', 'Hungary'),
       part('Italy', 7, 36.5, 18.5, 46.5), part('Morocco', -10, 29, -1, 36), part('Algeria', -2, 34, 9, 37), part('Tunisia', 8, 33, 11.5, 37.5),
       part('Australia', 113, -44, 154, -20), C('New Zealand'), part('Chile', -74, -56, -70, -30), part('Argentina', -72, -55.1, -64, -36)]),
    G('lepus-europaeus', 'Lepus europaeus', 'European hare', 'leporidae', 'Europe, Turkey and western Asia; introduced to South America, Australia and New Zealand',
      ['A large, long-legged hare of open farmland and grassland that relies on speed, up to about 70 km/h, rather than burrows. Its young (leverets) are born furred with open eyes in a shallow scrape. In spring, “mad March hares” box: usually a female fending off an over-eager male.',
       'Lepus has about 32 species, including the mountain hare, the Arctic hare, the snowshoe hare, which turns white in winter, and the American jackrabbits, which are hares despite their name.'],
      [('Species in genus', 'About 32'), ('Weight', 'About 3–5 kg'), ('Top speed', 'About 70 km/h'), ('IUCN status', 'Least Concern')],
      ['european hare', 'brown hare', 'hare', 'lepus', 'jackrabbit', 'snowshoe hare', 'mountain hare', 'mad march hare'],
      [C(*EUROPE, 'United Kingdom', 'Ireland', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Syria', 'Lebanon', 'Israel', 'Jordan', 'Iraq'),
       part('Sweden', 11, 55, 19, 63), part('Finland', 21, 60, 30, 65), part('Norway', 5, 58, 12, 61), part('Russia', 28, 44, 60, 62), part('Kazakhstan', 50, 42, 70, 54), part('Iran', 44, 33, 60, 39),
       part('Argentina', -70, -52, -57, -27), part('Chile', -73, -46, -70, -33), C('Uruguay'), part('Australia', 135, -44, 154, -25), C('New Zealand')]),
    G('sylvilagus-floridanus', 'Sylvilagus floridanus', 'Eastern cottontail', 'leporidae', 'Eastern and central North America to north-western South America; introduced to Italy',
      ['The commonest rabbit of the Americas, named for its white, cotton-ball tail, which it flashes while fleeing. Unlike the European rabbit it does not dig warrens, but hides in thickets and nests in shallow grass-lined hollows. A female can raise several litters a year.',
       'Sylvilagus has about 20 species, the cottontails, including the marsh and swamp rabbits, the desert cottontail and the tapetí of South America.'],
      [('Species in genus', 'About 20'), ('Weight', 'About 0.8–1.5 kg'), ('IUCN status', 'Least Concern')],
      ['eastern cottontail', 'cottontail', 'rabbit', 'sylvilagus', 'north america'],
      [part('United States of America', -110, 25, -67, 49), part('Canada', -100, 42, -64, 50), C('Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama'),
       part('Colombia', -77, 4, -71, 12), part('Venezuela', -73, 7, -62, 12), part('Italy', 7, 44, 13, 46.5)]),
    G('brachylagus-idahoensis', 'Brachylagus idahoensis', 'Pygmy rabbit', 'leporidae', 'Sagebrush of the Great Basin, western USA',
      ['The smallest rabbit in the world, about 400 g, small enough to sit in a palm. It lives almost only in tall, dense sagebrush, which makes up nearly all of its winter diet, and is one of only two North American rabbits that dig their own burrows.',
       'A small, isolated population in Washington’s Columbia Basin dropped to a few animals in the early 2000s and has been bred in captivity and released again.'],
      [('Species in genus', '1'), ('Weight', 'About 375–500 g'), ('IUCN status', 'Least Concern')],
      ['pygmy rabbit', 'smallest rabbit', 'brachylagus', 'sagebrush', 'great basin'],
      [part('United States of America', -121, 37, -110, 46)]),
    G('romerolagus-diazi', 'Romerolagus diazi', 'Volcano rabbit', 'leporidae', 'Pine forests and grassland on volcanoes near Mexico City',
      ['A tiny, short-eared, nearly tailless rabbit found only on the slopes of a few volcanoes around Mexico City, including Popocatépetl and Iztaccíhuatl, at about 2,800 to 4,250 m. It lives in colonies in dense bunchgrass and, unusually for a rabbit, makes loud, high-pitched calls to warn of danger.',
       'It is one of the most primitive living rabbits, and is threatened by fires, farming and the spread of the city.'],
      [('Species in genus', '1'), ('Weight', 'About 400–600 g'), ('IUCN status', 'Endangered')],
      ['volcano rabbit', 'zacatuche', 'teporingo', 'romerolagus', 'mexico'],
      [part('Mexico', -99.4, 18.9, -98.5, 19.4)]),
    G('pentalagus-furnessi', 'Pentalagus furnessi', 'Amami rabbit', 'leporidae', 'Amami Ōshima and Tokunoshima, southern Japan',
      ['A dark-furred, short-eared, short-legged forest rabbit with long claws for digging, found only on two small islands. It is often called a “living fossil” because it keeps features of ancient rabbits, and it calls to others with high-pitched sounds.',
       'Mongooses released on Amami Ōshima in 1979 to kill venomous habu snakes ate rabbits instead. After a long eradication campaign, the island was declared mongoose-free in 2024 and rabbit numbers have recovered.'],
      [('Species in genus', '1'), ('Weight', 'About 2–3 kg'), ('IUCN status', 'Endangered')],
      ['amami rabbit', 'ryukyu rabbit', 'pentalagus', 'japan', 'living fossil', 'mongoose'],
      [part('Japan', 128.9, 27.6, 129.8, 28.6)]),
    G('nesolagus-netscheri', 'Nesolagus netscheri', 'Sumatran striped rabbit', 'leporidae', 'Mountain forests of the Barisan range, Sumatra, Indonesia',
      ['One of the rarest and least-known mammals, a forest rabbit with bold dark stripes and a red rump, seen only a handful of times since the early 1900s, mostly in camera-trap photographs. It is thought to be nocturnal.',
       'Its only relative, the Annamite striped rabbit of Laos and Vietnam, was discovered by scientists only in 1999, from carcasses in a local market.'],
      [('Species in genus', '2'), ('Weight', 'About 1.5 kg'), ('IUCN status', 'Data Deficient')],
      ['sumatran striped rabbit', 'striped rabbit', 'nesolagus', 'annamite striped rabbit', 'sumatra'],
      [part('Indonesia', 98, -6, 105.5, 3)]),
    G('caprolagus-hispidus', 'Caprolagus hispidus', 'Hispid hare', 'leporidae', 'Tall grasslands at the foot of the Himalayas in Nepal, India and Bhutan',
      ['Also called the Assam rabbit, a dark, coarse-furred rabbit with small ears that lives in the tall “elephant grass” of the Himalayan foothills. It was thought extinct in the 1950s and 1960s before being found again in 1971.',
       'Burning and clearing of its grassland have left it in scattered patches, mainly in protected areas.'],
      [('Species in genus', '1'), ('Weight', 'About 2–2.5 kg'), ('IUCN status', 'Endangered')],
      ['hispid hare', 'assam rabbit', 'bristly rabbit', 'caprolagus', 'nepal', 'india'],
      [part('Nepal', 80, 26.3, 88.2, 28.8), part('India', 88, 25.8, 96, 27.6), part('India', 78, 27.5, 84.5, 30), part('Bhutan', 89, 26.7, 92, 27.2)]),
    G('bunolagus-monticularis', 'Bunolagus monticularis', 'Riverine rabbit', 'leporidae', 'Dense shrubs along seasonal rivers in the Karoo, South Africa',
      ['One of the world’s most threatened mammals, a rabbit with a dark stripe along its jaw and a woolly brown tail. It lives only in the thin strips of dense bush along the dry riverbeds of the Karoo, where it digs burrows in the soft soil.',
       'Most of this river-bank habitat has been turned into farmland, leaving perhaps a few hundred adults.'],
      [('Species in genus', '1'), ('Weight', 'About 1.5–1.8 kg'), ('IUCN status', 'Critically Endangered')],
      ['riverine rabbit', 'bushman rabbit', 'bunolagus', 'karoo', 'south africa'],
      [part('South Africa', 19, -33.5, 24.5, -30.5)]),
    G('pronolagus-rupestris', 'Pronolagus rupestris', 'Smith’s red rock hare', 'leporidae', 'Rocky hills of southern and eastern Africa',
      ['A rabbit (despite the name “hare”) with reddish fur and a bushy, rusty tail that lives among boulders and on rocky slopes, sheltering in crevices by day. It is noisy for a rabbit, screaming when caught.',
       'Pronolagus has four species, the red rock hares, all in southern and eastern Africa.'],
      [('Species in genus', '4'), ('Weight', 'About 1.3–2 kg'), ('IUCN status', 'Least Concern')],
      ['red rock hare', 'smiths red rock hare', 'pronolagus', 'rabbit', 'south africa'],
      [part('South Africa', 17, -34.5, 31, -26), C('Lesotho'), part('Namibia', 15, -29, 20, -24), part('Kenya', 34, -4, 38, 1), part('Tanzania', 31, -9, 38, -2), C('Malawi'), part('Zambia', 28, -15, 33, -9)]),
    G('poelagus-marjorita', 'Poelagus marjorita', 'Bunyoro rabbit', 'leporidae', 'Savanna and woodland of central Africa, from Uganda to Chad, and Angola',
      ['Also called the Central African rabbit, a short-eared, stiff-furred rabbit of savanna and rocky woodland edges, active at night. It is the only rabbit native to central Africa.',
       'It was once placed in the red rock hare genus; DNA shows it is a separate branch.'],
      [('Species in genus', '1'), ('Weight', 'About 2–3 kg'), ('IUCN status', 'Least Concern')],
      ['bunyoro rabbit', 'central african rabbit', 'poelagus', 'uganda', 'africa'],
      [C('Uganda', 'S. Sudan', 'Central African Rep.'), part('Dem. Rep. Congo', 24, 1, 31, 5), part('Chad', 15, 8, 23, 11), part('Angola', 14, -12, 19, -8)]),
    G('ochotona-princeps', 'Ochotona princeps', 'American pika', 'ochotonidae', 'Rocky mountain slopes of western North America',
      ['A small, round-eared, tailless relative of rabbits that lives on rock slides in the mountains. It does not hibernate; instead it spends the summer gathering grasses and flowers into haypiles under the rocks to eat in winter, and gives a sharp “eep” call when danger is near.',
       'It overheats easily and has vanished from some lower, warmer sites, making it a closely watched sign of climate change. Ochotona has about 34 species, most in Asia, including the plateau pika of Tibet.'],
      [('Species in genus', 'About 34'), ('Weight', 'About 120–180 g'), ('IUCN status', 'Least Concern')],
      ['american pika', 'pika', 'ochotona', 'rock rabbit', 'climate change', 'rocky mountains'],
      [part('Canada', -128, 49, -114, 57), part('United States of America', -123, 35, -105, 49)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Spread across Europe in medieval times (to Britain by the Normans); introduced to Australia
    # (1859), New Zealand (1830s onwards) and southern South America in the 1800s and 1900s.
    'oryctolagus-cuniculus': {'without': [4, 5, 6, 7]},
    # Introduced to South America, Australia and New Zealand in the 1800s.
    'lepus-europaeus': {'without': [8, 9, 10, 11, 12]},
    # Introduced to Italy in the 1960s.
    'sylvilagus-floridanus': {'without': [5]},
}
HISTORIC = {**{sid: 'same' for sid in [
    'brachylagus-idahoensis', 'romerolagus-diazi', 'pentalagus-furnessi', 'nesolagus-netscheri', 'caprolagus-hispidus',
    'bunolagus-monticularis', 'pronolagus-rupestris', 'poelagus-marjorita', 'ochotona-princeps',
]}, **HISTORIC_CHANGED}
