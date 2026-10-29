# Living crocodylians: every species (about 27; a few recent splits are debated). Ranges are
# country-level outlines with boxes for parts of countries, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def sea(lon0, lat0, lon1, lat1):
    return {'sea': [lon0, lat0, lon1, lat1]}


AMAZON = [part('Brazil', -74, -14, -48, 5), part('Peru', -77, -14, -69, -2), part('Colombia', -78, -4, -67, 8), part('Ecuador', -78, -3, -75, 1), part('Venezuela', -73, 1, -60, 11), part('Bolivia', -69.5, -18, -60, -10), C('Guyana', 'Suriname')]
WEST_AFRICA = ['Senegal', 'Gambia', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Mali', 'Burkina Faso', 'Niger', 'Chad']
CENTRAL_AFRICA = ['Gabon', 'Congo', 'Eq. Guinea', 'Central African Rep.', 'Dem. Rep. Congo', 'Cameroon']
NEW_GUINEA = [C('Papua New Guinea'), part('Indonesia', 131, -9, 141, -0.5)]

CLADES = [
    {'id': 'alligatoridae', 'name': 'Alligatoridae', 'common': 'Alligators and caimans', 'parent': 'crocodylia', 'family': True, 'description': 'Broad-snouted crocodylians whose lower teeth fit inside the upper jaw when the mouth is closed. Two alligators and six caimans live today, mostly in the Americas.'},
    {'id': 'crocodylidae', 'name': 'Crocodylidae', 'common': 'True crocodiles', 'parent': 'crocodylia', 'family': True, 'description': 'Crocodiles of the tropics worldwide, whose fourth lower tooth shows when the mouth is closed. Many tolerate salt water thanks to salt glands on the tongue.'},
    {'id': 'gavialidae', 'name': 'Gavialidae', 'common': 'Gharials', 'parent': 'crocodylia', 'family': True, 'description': 'The gharial and the false gharial (tomistoma), slender-snouted fish-eaters of South and Southeast Asia; DNA shows the two are close relatives.'},
]

# Fossil crocodylians already in PaleoDex, moved to their families.
UPGRADES = {
    'purussaurus-mirandai': {'clade': 'alligatoridae'},
    'mourasuchus-arendsi': {'clade': 'alligatoridae'},
    'gryposuchus-croizati': {'clade': 'gavialidae'},
}


def S(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': [summary], 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    # ── Alligators and caimans ──
    S('alligator-mississippiensis', 'Alligator mississippiensis', 'American alligator', 'alligatoridae', 'Southeastern United States',
      'A broad-snouted crocodylian of swamps, rivers and lakes from North Carolina to Texas. Hunting cut its numbers badly by the 1960s; protection brought it back to over a million and it was taken off the US endangered list in 1987, one of the great conservation recoveries. The temperature of the nest decides whether hatchlings are male or female.',
      [('Length', 'Males about 3.4–4.5 m'), ('IUCN status', 'Least Concern')],
      ['american alligator', 'alligator', 'gator', 'florida', 'everglades'],
      [part('United States of America', -100, 25, -75.5, 36.5)]),
    S('alligator-sinensis', 'Alligator sinensis', 'Chinese alligator', 'alligatoridae', 'Lower Yangtze River, China',
      'A small alligator, about 1.5–2 m long, that spends winter dormant in burrows. Only a few hundred survive in the wild, but thousands live in breeding centres, and reintroductions have begun. It is one of only two living alligators.',
      [('Length', 'About 1.5–2 m'), ('IUCN status', 'Critically Endangered')],
      ['chinese alligator', 'alligator', 'yangtze', 'china'],
      [part('China', 117, 29.5, 121.5, 32)]),
    S('caiman-crocodilus', 'Caiman crocodilus', 'Spectacled caiman', 'alligatoridae', 'Southern Mexico to the Amazon',
      'Named for the bony ridge between its eyes like the bridge of a pair of glasses, it is the most widespread and numerous crocodylian in the Americas.',
      [('Length', 'About 1.5–2.5 m'), ('IUCN status', 'Least Concern')],
      ['spectacled caiman', 'caiman', 'south america'],
      [part('Mexico', -95, 14.5, -90, 18.5), C('Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama'), *AMAZON, C('Trinidad and Tobago')]),
    S('caiman-latirostris', 'Caiman latirostris', 'Broad-snouted caiman', 'alligatoridae', 'Southeastern South America',
      'A caiman with the broadest snout of any crocodylian, living in marshes and mangroves from northeast Brazil to northern Argentina. It can survive cold winters further south than most crocodylians.',
      [('Length', 'About 2–3.5 m'), ('IUCN status', 'Least Concern')],
      ['broad-snouted caiman', 'caiman', 'argentina', 'brazil'],
      [part('Brazil', -58, -32, -35, -5), C('Paraguay', 'Uruguay'), part('Argentina', -64, -32, -54, -22), part('Bolivia', -63, -20, -57.5, -17)]),
    S('caiman-yacare', 'Caiman yacare', 'Yacare caiman', 'alligatoridae', 'Pantanal and the southern Amazon',
      'The caiman of the Pantanal wetlands, where it gathers in crowds of thousands as pools shrink in the dry season. Commercial hunting for skins once took millions; it has recovered under protection.',
      [('Length', 'About 2–3 m'), ('IUCN status', 'Least Concern')],
      ['yacare caiman', 'caiman', 'pantanal'],
      [part('Brazil', -62, -22, -54, -10), part('Bolivia', -69, -21, -57.5, -10), C('Paraguay'), part('Argentina', -64, -28, -57, -22)]),
    S('melanosuchus-niger', 'Melanosuchus niger', 'Black caiman', 'alligatoridae', 'Amazon basin',
      'The largest member of the alligator family, up to about 5 m, and a top predator of the Amazon, taking capybaras, deer and anacondas. It was hunted to about 1% of its former numbers for its dark skin in the 1900s and has since recovered in many areas. It is the only species in its genus.',
      [('Length', 'Up to about 5 m'), ('IUCN status', 'Least Concern')],
      ['black caiman', 'melanosuchus', 'amazon'],
      AMAZON),
    S('paleosuchus-palpebrosus', 'Paleosuchus palpebrosus', 'Cuvier’s dwarf caiman', 'alligatoridae', 'Amazon and Orinoco basins',
      'The smallest crocodylian in the Americas, about 1.2–1.5 m, heavily armoured and living in fast, cool forest streams.',
      [('Length', 'About 1.2–1.5 m'), ('IUCN status', 'Least Concern')],
      ['cuviers dwarf caiman', 'dwarf caiman', 'paleosuchus', 'amazon'],
      [*AMAZON, C('Paraguay')]),
    S('paleosuchus-trigonatus', 'Paleosuchus trigonatus', 'Schneider’s dwarf caiman', 'alligatoridae', 'Amazon basin and the Guianas',
      'A small, heavily armoured caiman that lives in rainforest streams and often travels far from water over land.',
      [('Length', 'About 1.7–2.3 m'), ('IUCN status', 'Least Concern')],
      ['schneiders dwarf caiman', 'smooth-fronted caiman', 'paleosuchus', 'amazon'],
      AMAZON),
    # ── True crocodiles ──
    S('crocodylus-niloticus', 'Crocodylus niloticus', 'Nile crocodile', 'crocodylidae', 'Eastern, central and southern Africa and Madagascar',
      'Africa’s largest crocodile, up to about 5.5 m, famous for ambushing wildebeest and zebra at river crossings. It kills more people than any other crocodile. West African populations are now a separate species.',
      [('Length', 'Males about 3.5–5 m'), ('IUCN status', 'Least Concern')],
      ['nile crocodile', 'crocodile', 'crocodylus', 'africa'],
      [C('Egypt', latMax=24.5), C('Sudan', 'S. Sudan', 'Ethiopia', 'Somalia', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'Angola', 'Madagascar', 'eSwatini'), part('South Africa', 26, -29, 33, -22), part('Dem. Rep. Congo', 25, -13, 31, 5)]),
    S('crocodylus-suchus', 'Crocodylus suchus', 'West African crocodile', 'crocodylidae', 'West and Central Africa',
      'A smaller relative of the Nile crocodile, recognised as a separate species in 2011 after DNA showed it is closer to American crocodiles. It was the sacred crocodile of ancient Egypt; mummified crocodiles from Egyptian tombs include both species.',
      [('Length', 'About 2–4 m')],
      ['west african crocodile', 'desert crocodile', 'crocodylus', 'west africa'],
      [C(*WEST_AFRICA, 'Mauritania'), part('Central African Rep.', 14, 2, 27, 11), part('Dem. Rep. Congo', 12, -6, 30, 5), C('Gabon', 'Congo')]),
    S('crocodylus-porosus', 'Crocodylus porosus', 'Saltwater crocodile', 'crocodylidae', 'Coasts and rivers from India to northern Australia',
      'The largest living reptile, with males over 6 m and about 1,000 kg, and the strongest bite force measured for any living animal. It swims far out to sea, riding currents between islands. Australia’s population has recovered to over 100,000 since hunting was banned in the 1970s.',
      [('Length', 'Males up to about 6–7 m'), ('IUCN status', 'Least Concern')],
      ['saltwater crocodile', 'saltie', 'estuarine crocodile', 'crocodylus', 'largest reptile', 'australia'],
      [part('India', 80, 8, 92, 23), C('Sri Lanka', 'Bangladesh', 'Myanmar', 'Thailand', 'Cambodia', 'Vietnam', 'Malaysia', 'Brunei', 'Philippines', 'Timor-Leste', 'Palau', 'Solomon Is.', 'Vanuatu'), part('Indonesia', 95, -11, 141, 6), C('Papua New Guinea'), part('Australia', 113, -25, 154, -10)]),
    S('crocodylus-acutus', 'Crocodylus acutus', 'American crocodile', 'crocodylidae', 'Southern Florida, the Caribbean, Central America and northern South America',
      'A slender-snouted crocodile of coasts, mangroves and saline lakes. In southern Florida it lives alongside the American alligator, the only place where the two meet. Its Florida population recovered from a few hundred to over 2,000.',
      [('Length', 'About 3–4 m'), ('IUCN status', 'Vulnerable')],
      ['american crocodile', 'crocodylus', 'florida', 'caribbean'],
      [part('United States of America', -82, 24.5, -80, 26), part('Mexico', -106, 14.5, -86, 24), C('Cuba', 'Jamaica', 'Haiti', 'Dominican Rep.', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama'), part('Colombia', -80, 1, -71, 12.5), part('Venezuela', -73, 8, -60, 12), part('Ecuador', -81, -4, -79, 1.5), part('Peru', -81.5, -6, -79.5, -3.4)]),
    S('crocodylus-intermedius', 'Crocodylus intermedius', 'Orinoco crocodile', 'crocodylidae', 'Orinoco River basin, Venezuela and Colombia',
      'One of the largest crocodiles, with a long, narrow snout. Hunted almost to extinction for its skin in the early 1900s, only a few hundred breeding adults remain in the wild.',
      [('Length', 'Up to about 5 m'), ('IUCN status', 'Critically Endangered')],
      ['orinoco crocodile', 'crocodylus', 'venezuela', 'llanos'],
      [part('Venezuela', -72, 5, -62, 9), part('Colombia', -74, 2, -67.5, 7)]),
    S('crocodylus-johnstoni', 'Crocodylus johnstoni', 'Freshwater crocodile', 'crocodylidae', 'Rivers of northern Australia',
      'The “freshie”, a slender-snouted fish-eater that is shy of people, much smaller and less dangerous than the saltwater crocodile. It can gallop on land. Introduced cane toads, which are poisonous to eat, have killed many.',
      [('Length', 'About 2–3 m'), ('IUCN status', 'Least Concern')],
      ['freshwater crocodile', 'freshie', 'johnstons crocodile', 'crocodylus', 'australia'],
      [part('Australia', 120, -22, 146, -11)]),
    S('crocodylus-mindorensis', 'Crocodylus mindorensis', 'Philippine crocodile', 'crocodylidae', 'Philippines',
      'A small freshwater crocodile found only in the Philippines and one of the most threatened, with perhaps a hundred adults in the wild. Community-based conservation in northern Luzon has helped it.',
      [('Length', 'About 2–3 m'), ('IUCN status', 'Critically Endangered')],
      ['philippine crocodile', 'crocodylus', 'philippines'],
      [C('Philippines')]),
    S('crocodylus-moreletii', 'Crocodylus moreletii', 'Morelet’s crocodile', 'crocodylidae', 'Gulf of Mexico coast, Yucatán, Belize and Guatemala',
      'A medium-sized crocodile of freshwater marshes and lagoons. Heavily hunted until the 1970s, it has recovered so well under protection that it is now listed as Least Concern.',
      [('Length', 'About 2.5–3 m'), ('IUCN status', 'Least Concern')],
      ['morelets crocodile', 'mexican crocodile', 'crocodylus', 'mexico', 'belize'],
      [part('Mexico', -99, 15.5, -86.5, 23), C('Belize'), part('Guatemala', -92, 15.5, -88, 18)]),
    S('crocodylus-novaeguineae', 'Crocodylus novaeguineae', 'New Guinea crocodile', 'crocodylidae', 'Northern New Guinea',
      'A freshwater crocodile of swamps and rivers in northern New Guinea. In 2019 crocodiles south of the central mountains were described as a separate species, Hall’s New Guinea crocodile.',
      [('Length', 'About 2.5–3.5 m'), ('IUCN status', 'Least Concern')],
      ['new guinea crocodile', 'crocodylus', 'new guinea'],
      [part('Papua New Guinea', 141, -6, 151, -2.5), part('Indonesia', 134, -3.5, 141, -1)]),
    S('crocodylus-halli', 'Crocodylus halli', 'Hall’s New Guinea crocodile', 'crocodylidae', 'Southern New Guinea',
      'Described in 2019, separated from the New Guinea crocodile by the central mountain range and by differences in its skull. It is named after Philip Hall, who studied New Guinea crocodiles in the 1980s.',
      [('Length', 'About 2.5–3.5 m'), ('Described', '2019')],
      ['halls new guinea crocodile', 'crocodylus', 'new guinea'],
      [part('Papua New Guinea', 141, -9.5, 146, -6), part('Indonesia', 137, -9, 141, -5)]),
    S('crocodylus-palustris', 'Crocodylus palustris', 'Mugger crocodile', 'crocodylidae', 'India, Sri Lanka, Pakistan, Nepal and Iran',
      'A broad-snouted crocodile of rivers, lakes and reservoirs, able to walk long distances between water bodies and dig burrows to escape heat. It has been seen balancing sticks on its snout during the egret nesting season, perhaps as a lure for birds collecting nest material.',
      [('Length', 'About 3–4 m'), ('IUCN status', 'Vulnerable')],
      ['mugger crocodile', 'marsh crocodile', 'mugger', 'crocodylus', 'india'],
      [C('India', 'Sri Lanka', 'Nepal', latMax=30), part('Pakistan', 66, 24, 74, 30), part('Iran', 60, 25, 63, 27)]),
    S('crocodylus-rhombifer', 'Crocodylus rhombifer', 'Cuban crocodile', 'crocodylidae', 'Zapata Swamp and Isla de la Juventud, Cuba',
      'A small, aggressive, unusually terrestrial crocodile with bright yellow-and-black markings and long legs, found in a tiny area of Cuba. Hybridisation with American crocodiles threatens it.',
      [('Length', 'About 2–3.5 m'), ('IUCN status', 'Critically Endangered')],
      ['cuban crocodile', 'crocodylus', 'cuba', 'zapata swamp'],
      [part('Cuba', -82, 21.4, -80.5, 22.5)]),
    S('crocodylus-siamensis', 'Crocodylus siamensis', 'Siamese crocodile', 'crocodylidae', 'Scattered sites in Southeast Asia',
      'A freshwater crocodile once common across Southeast Asia and thought nearly extinct in the wild by the 1990s; small wild populations were later found in Cambodia, Laos and Indonesian Borneo. Many thousands live on crocodile farms.',
      [('Length', 'About 2–3 m'), ('IUCN status', 'Critically Endangered')],
      ['siamese crocodile', 'crocodylus', 'cambodia', 'laos'],
      [part('Cambodia', 102.5, 10.5, 106, 13), part('Laos', 104, 14, 106.5, 17), part('Thailand', 99, 11, 102, 15), part('Indonesia', 114, -3, 117.5, 1)]),
    S('mecistops-cataphractus', 'Mecistops cataphractus', 'West African slender-snouted crocodile', 'crocodylidae', 'Rivers of West Africa',
      'A narrow-snouted, fish-eating crocodile of forest rivers. A 2018 study split the Central African population as a separate species. It is one of Africa’s most threatened crocodiles.',
      [('Length', 'About 2.5–3.5 m'), ('IUCN status', 'Critically Endangered')],
      ['slender-snouted crocodile', 'mecistops', 'west africa'],
      [C('Senegal', 'Gambia', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', latMax=13)]),
    S('mecistops-leptorhynchus', 'Mecistops leptorhynchus', 'Central African slender-snouted crocodile', 'crocodylidae', 'Rivers of Central Africa',
      'Separated from the West African slender-snouted crocodile in 2018 on the basis of DNA and skull shape, it lives in the rivers and swamps of the Congo Basin and Cameroon.',
      [('Length', 'About 2.5–3.5 m'), ('Described as a species', '2018')],
      ['central african slender-snouted crocodile', 'mecistops', 'congo'],
      [C(*CENTRAL_AFRICA, latMax=6), C('Tanzania', lonMax=31, latMin=-8)]),
    S('osteolaemus-tetraspis', 'Osteolaemus tetraspis', 'Dwarf crocodile', 'crocodylidae', 'Rainforests of West and Central Africa',
      'The smallest crocodile, rarely over 1.5 m, heavily armoured and nocturnal, living in rainforest swamps and pools. In a cave in Gabon, a population living on bats and crickets is turning orange from bat guano. Some split it into two or three species.',
      [('Length', 'About 1.5 m'), ('IUCN status', 'Vulnerable')],
      ['dwarf crocodile', 'osteolaemus', 'gabon', 'africa'],
      [C('Guinea', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', 'Gabon', 'Congo', 'Eq. Guinea', 'Central African Rep.', latMax=9), C('Cameroon', latMax=6), part('Dem. Rep. Congo', 12, -6, 30, 5)]),
    # ── Gharials ──
    S('gavialis-gangeticus', 'Gavialis gangeticus', 'Gharial', 'gavialidae', 'Rivers of northern India and Nepal',
      'A huge crocodylian with an extremely long, thin snout lined with over 100 teeth for catching fish. Males grow a bulbous knob, the ghara (Hindi for pot), on the snout tip to amplify sounds. Its population crashed to about 200 in the 1970s; captive breeding has helped, and most now live in the Chambal River.',
      [('Length', 'Males up to about 5–6 m'), ('IUCN status', 'Critically Endangered')],
      ['gharial', 'gavial', 'gavialis', 'india', 'chambal'],
      [part('India', 76, 24, 89, 30), part('Nepal', 80, 26.5, 85, 29)]),
    S('tomistoma-schlegelii', 'Tomistoma schlegelii', 'False gharial', 'gavialidae', 'Peat swamps of Borneo, Sumatra and the Malay Peninsula',
      'Also called the tomistoma, a slender-snouted crocodile of blackwater peat swamps. Long placed with true crocodiles, DNA shows it is the gharial’s closest living relative. Its swamps are being drained for oil palm plantations.',
      [('Length', 'Up to about 4–5 m'), ('IUCN status', 'Endangered')],
      ['false gharial', 'tomistoma', 'malayan gharial', 'borneo', 'sumatra'],
      [part('Indonesia', 95, -6, 106.2, 6), part('Indonesia', 108.5, -4.3, 119.3, 4.5), part('Malaysia', 100, 1, 104.5, 7), part('Malaysia', 109.5, 0.8, 115, 5)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Once along the lower Nile to the delta (gone by the late 1800s) and in what is now Israel.
    'crocodylus-niloticus': {'add': [part('Egypt', 29, 24, 33, 31.6), part('Israel', 34.8, 32.2, 35.3, 32.7)]},
    # Once in the Indus, Ganges, Brahmaputra and Mahanadi rivers and into Myanmar.
    'gavialis-gangeticus': {'add': [part('Pakistan', 67, 24, 74, 33), part('India', 72, 19, 96, 30), C('Bangladesh', 'Bhutan'), part('Myanmar', 92, 19, 95, 23)]},
    # Once through much of the lower and middle Yangtze and nearby rivers.
    'alligator-sinensis': {'add': [part('China', 105, 23, 122, 35)]},
    'crocodylus-siamensis': {'add': [C('Thailand', 'Cambodia', 'Laos', 'Vietnam', 'Malaysia', 'Brunei'), part('Indonesia', 105, -9, 114.6, -5.8)]},
    'tomistoma-schlegelii': {'add': [part('Thailand', 98, 5.5, 102, 9), part('Indonesia', 105, -9, 114.6, -5.8)]},
}
HISTORIC = {**{sid: 'same' for sid in ['alligator-mississippiensis', 'caiman-crocodilus', 'caiman-latirostris', 'caiman-yacare', 'melanosuchus-niger', 'paleosuchus-palpebrosus', 'paleosuchus-trigonatus', 'crocodylus-suchus', 'crocodylus-porosus', 'crocodylus-acutus', 'crocodylus-intermedius', 'crocodylus-johnstoni', 'crocodylus-mindorensis', 'crocodylus-moreletii', 'crocodylus-novaeguineae', 'crocodylus-halli', 'crocodylus-palustris', 'crocodylus-rhombifer', 'mecistops-cataphractus', 'mecistops-leptorhynchus', 'osteolaemus-tetraspis']}, **HISTORIC_CHANGED}
