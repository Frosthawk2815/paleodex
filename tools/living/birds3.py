# Living birds, third batch: more species for the big families of waterbirds, seabirds, shorebirds,
# falcons, New World vultures and owls, so large families are represented in proportion to their
# size. Ranges show roughly where each species breeds or lives year-round (with wintering areas for
# some migrants), as country outlines clipped by boxes or sea boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def sea(lon0, lat0, lon1, lat1):
    return {'sea': [lon0, lat0, lon1, lat1]}


def world(**clip):
    return {'world': True, **clip}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'United Kingdom', 'Ireland']
SUB_SAHARA = ['Senegal', 'Gambia', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Central African Rep.', 'Sudan', 'S. Sudan', 'Ethiopia', 'Eritrea', 'Somalia', 'Somaliland', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Dem. Rep. Congo', 'Congo', 'Gabon', 'Eq. Guinea', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'South Africa', 'eSwatini', 'Lesotho']
EAST_SOUTH_AFRICA = ['Ethiopia', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'South Africa', 'eSwatini', 'Angola']
SOUTH_AMERICA_TROPICS = ['Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru', 'Brazil', 'Bolivia', 'Paraguay']
CENTRAL_AMERICA = ['Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama']
SOUTH_ASIA = ['India', 'Pakistan', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Bhutan']
SE_ASIA = ['Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia']
CENTRAL_ASIA = ['Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan', 'Turkmenistan', 'Mongolia']
CARIBBEAN = ['Cuba', 'Jamaica', 'Haiti', 'Dominican Rep.', 'Puerto Rico', 'Bahamas']
US = 'United States of America'


def F(id, name, common, desc):
    return {'id': id, 'name': name, 'common': common, 'parent': 'aves', 'family': True, 'description': desc}


CLADES = [
    F('charadriidae', 'Charadriidae', 'Plovers and lapwings', 'About 70 species of short-billed shorebirds that run and stop to pick food from the ground, found on every continent but Antarctica.'),
    F('haematopodidae', 'Haematopodidae', 'Oystercatchers', 'About 12 species of black or black-and-white shorebirds with long, bright orange bills for prising open shellfish.'),
    F('recurvirostridae', 'Recurvirostridae', 'Avocets and stilts', 'Long-legged wading birds with slender bills; avocets’ bills curve upwards.'),
]

UPGRADES = {}


def S(id, name, common, clade, place, summary, facts, keywords, rng, **extra):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng, **extra}


GENERA = [
    # ── Falcons and caracaras ──
    S('falco-tinnunculus', 'Falco tinnunculus', 'Common kestrel', 'falconidae', 'Europe, Asia and Africa',
      ['A small falcon that hovers in one spot over roadside verges and fields, head perfectly still, watching for voles. Kestrels can see ultraviolet light, which lets them spot the urine trails voles leave along their runways.'],
      [('Species in genus', 'About 40'), ('Wingspan', 'About 65–80 cm'), ('IUCN status', 'Least Concern')],
      ['kestrel', 'common kestrel', 'windhover', 'falco', 'falcon', 'hovering'],
      [C(*EUROPE, *SUB_SAHARA, *SOUTH_ASIA, *CENTRAL_ASIA, 'Turkey', 'Iran', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Saudi Arabia', 'Yemen', 'Oman', 'Afghanistan', exclude=['Gabon', 'Congo', 'Eq. Guinea']), part('Russia', 28, 45, 140, 65), part('China', 75, 20, 135, 53), C('Japan', 'North Korea', 'South Korea')]),
    S('falco-rusticolus', 'Falco rusticolus', 'Gyrfalcon', 'falconidae', 'Arctic tundra and coasts around the North Pole',
      ['The largest falcon, from almost white to dark grey, which hunts ptarmigan and seabirds across the Arctic. In medieval Europe white gyrfalcons from Greenland and Iceland were the most valuable hunting birds, reserved for kings.'],
      [('Species in genus', 'About 40'), ('Wingspan', 'About 1.1–1.6 m'), ('IUCN status', 'Least Concern')],
      ['gyrfalcon', 'gyr', 'falco', 'falcon', 'arctic', 'falconry'],
      [part('Canada', -141, 60, -60, 83), part(US, -170, 60, -141, 72), part('Greenland', -75, 59, -10, 84), C('Iceland'), part('Norway', 5, 62, 31, 71.5), part('Sweden', 14, 65, 24, 69), part('Finland', 21, 67, 30, 70), part('Russia', 30, 64, 180, 78)]),
    S('caracara-plancus', 'Caracara plancus', 'Crested caracara', 'falconidae', 'Open country from the southern USA to Tierra del Fuego',
      ['A long-legged, ground-walking member of the falcon family with a black cap and bare red face, which scavenges carrion and catches small animals on foot. Despite looks, caracaras are true falcons; the crested caracara is the national bird of Mexico in some depictions.'],
      [('Species in genus', '2'), ('Wingspan', 'About 1.2 m'), ('IUCN status', 'Least Concern')],
      ['crested caracara', 'caracara', 'mexican eagle', 'falcon', 'south america'],
      [part(US, -105, 25, -80, 31), C('Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Argentina', 'Chile', 'Cuba')]),
    S('phalcoboenus-australis', 'Phalcoboenus australis', 'Striated caracara', 'falconidae', 'Falkland Islands and islands off Tierra del Fuego',
      ['A bold, intelligent caracara that lives around seabird and seal colonies on remote islands, scavenging and stealing. Falkland islanders call it the “Johnny rook”. Tests show it is as good at solving puzzles as many parrots and crows.'],
      [('Species in genus', '4'), ('Wingspan', 'About 1.2 m'), ('IUCN status', 'Near Threatened')],
      ['striated caracara', 'johnny rook', 'caracara', 'falkland islands', 'falcon'],
      [C('Falkland Is.'), part('Chile', -72, -56.1, -66, -54.5), part('Argentina', -66.5, -55.1, -63.5, -54.6)]),
    S('microhierax-caerulescens', 'Microhierax caerulescens', 'Collared falconet', 'falconidae', 'Forest edges of the Himalayan foothills and mainland South-east Asia',
      ['One of the smallest birds of prey in the world, about the size of a sparrow, black and white with a chestnut face. It sits on exposed branches and darts out to catch dragonflies, butterflies and small birds.'],
      [('Species in genus', '5'), ('Length', 'About 15–18 cm'), ('IUCN status', 'Least Concern')],
      ['collared falconet', 'falconet', 'smallest raptor', 'microhierax', 'falcon', 'asia'],
      [part('India', 77, 21, 97, 31), C('Nepal', 'Bhutan', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam')]),

    # ── New World vultures ──
    S('cathartes-aura', 'Cathartes aura', 'Turkey vulture', 'cathartidae', 'Southern Canada to Tierra del Fuego',
      ['A red-headed vulture that soars with wings held in a shallow V, rocking in the wind. Unusually for a bird it has a superb sense of smell and can find a hidden carcass under the forest canopy by the scent of decay; gas companies once used circling vultures to find pipeline leaks.'],
      [('Species in genus', '3'), ('Wingspan', 'About 1.6–1.8 m'), ('IUCN status', 'Least Concern')],
      ['turkey vulture', 'buzzard', 'vulture', 'cathartes', 'americas'],
      [part('Canada', -125, 42, -65, 55), C(US, 'Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Argentina', 'Chile', 'Cuba', 'Jamaica', 'Bahamas', latMax=55)]),
    S('gymnogyps-californianus', 'Gymnogyps californianus', 'California condor', 'cathartidae', 'Mountains of California, Arizona, Utah and Baja California',
      ['The largest flying land bird in North America, with a wingspan of about 3 m. Lead from bullets in carcasses poisoned it to just 27 birds, and in 1987 the last wild ones were captured for a breeding programme. Released birds have built the population back to over 500, about half flying free.'],
      [('Species in genus', '1'), ('Wingspan', 'About 2.7–3 m'), ('IUCN status', 'Critically Endangered')],
      ['california condor', 'condor', 'gymnogyps', 'vulture', 'lead poisoning', 'california'],
      [part(US, -122, 34, -117.5, 37.5), part(US, -113.5, 35.5, -111.5, 37.8), part('Mexico', -116, 30.5, -115, 31.5)]),
    S('sarcoramphus-papa', 'Sarcoramphus papa', 'King vulture', 'cathartidae', 'Tropical forests and savannas from southern Mexico to northern Argentina',
      ['A white vulture with a startling head of orange, purple, red and yellow bare skin. Its strong bill tears open tough hides that smaller vultures cannot, so they wait for it at carcasses. The Maya portrayed it as a messenger between people and the gods.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.2–2 m'), ('IUCN status', 'Least Concern')],
      ['king vulture', 'vulture', 'sarcoramphus', 'maya', 'rainforest'],
      [part('Mexico', -100, 14.5, -87, 23), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS), part('Argentina', -65, -28, -53.6, -22)]),

    # ── Owls ──
    S('bubo-virginianus', 'Bubo virginianus', 'Great horned owl', 'strigidae', 'Almost all of North America and much of South America',
      ['A big, powerful owl with ear tufts and yellow eyes, which takes prey as large as skunks, hares, ospreys and other owls, gripping with a force that needs a lot of strength to open. It nests early, sometimes laying eggs in snow.'],
      [('Species in genus', 'About 20'), ('Wingspan', 'About 0.9–1.5 m'), ('IUCN status', 'Least Concern')],
      ['great horned owl', 'hoot owl', 'bubo', 'owl', 'north america'],
      [C('Canada', US, 'Mexico', *CENTRAL_AMERICA, latMax=68), C('Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina', 'Guyana', 'Suriname'), part('Brazil', -60, -34, -34, -2)]),
    S('bubo-bubo', 'Bubo bubo', 'Eurasian eagle-owl', 'strigidae', 'Mountains, forests and deserts across Europe and Asia',
      ['One of the largest owls, with orange eyes and long ear tufts, able to kill foxes, young deer and other birds of prey. Its deep hoot carries several kilometres. Once wiped out from much of western Europe, it has returned to many areas.'],
      [('Species in genus', 'About 20'), ('Wingspan', 'About 1.4–1.9 m'), ('IUCN status', 'Least Concern')],
      ['eurasian eagle-owl', 'eagle owl', 'bubo', 'owl', 'europe', 'asia'],
      [C(*EUROPE, 'Turkey', 'Iran', 'Afghanistan', *CENTRAL_ASIA, exclude=['United Kingdom', 'Ireland', 'Netherlands', 'Denmark']), part('Russia', 28, 45, 165, 68), part('China', 75, 22, 135, 53), C('North Korea', 'South Korea'), part('Pakistan', 66, 25, 77, 37), part('India', 72, 15, 82, 35)]),
    S('athene-cunicularia', 'Athene cunicularia', 'Burrowing owl', 'strigidae', 'Open grassland and deserts of western North America, Florida, Central and South America',
      ['A small, long-legged owl that lives in burrows, often ones dug by prairie dogs or tortoises, and is active by day. When threatened in its burrow, young owls make a hiss that sounds like a rattlesnake. Some line their burrows with dung to attract beetles to eat.'],
      [('Species in genus', '4'), ('Length', 'About 20–28 cm'), ('IUCN status', 'Least Concern')],
      ['burrowing owl', 'athene', 'owl', 'prairie dog', 'americas'],
      [part(US, -122, 26, -95, 49), part('Canada', -115, 49, -100, 52.5), part(US, -82.5, 25, -80, 28.5), part('Mexico', -117, 18, -97, 32.7), C('Colombia', 'Venezuela', 'Peru', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina', 'Chile'), part('Brazil', -60, -34, -34, -2)]),
    S('micrathene-whitneyi', 'Micrathene whitneyi', 'Elf owl', 'strigidae', 'Deserts of the south-western USA and Mexico',
      ['The world’s lightest owl, about 40 g and the size of a sparrow. It nests in old woodpecker holes in giant saguaro cacti and hunts insects and scorpions at night, removing the stings before eating them.'],
      [('Species in genus', '1'), ('Length', 'About 13–14 cm'), ('IUCN status', 'Least Concern')],
      ['elf owl', 'smallest owl', 'micrathene', 'owl', 'saguaro', 'sonoran desert'],
      [part(US, -115, 29, -103, 35), part('Mexico', -116, 17, -98, 32.5)]),
    S('strix-nebulosa', 'Strix nebulosa', 'Great grey owl', 'strigidae', 'Northern conifer forests of North America and Eurasia',
      ['The longest owl, with a huge, round face whose rings of feathers funnel sound to its ears so well that it can hear voles moving under 60 cm of snow and plunge through the snow to catch them. Much of its size is fluffy feathers; it weighs less than a great horned owl.'],
      [('Species in genus', 'About 22'), ('Length', 'About 60–85 cm'), ('IUCN status', 'Least Concern')],
      ['great grey owl', 'great gray owl', 'strix', 'owl', 'boreal forest'],
      [part('Canada', -141, 49, -70, 65), part(US, -165, 60, -141, 68), part(US, -122, 37, -110, 49), part('Sweden', 15, 63, 24, 68), part('Finland', 22, 61, 30, 69), part('Russia', 28, 50, 165, 67), C('Mongolia', latMin=47)]),
    S('strix-aluco', 'Strix aluco', 'Tawny owl', 'strigidae', 'Woodland across Europe, North Africa and western Asia',
      ['The common owl of European woods and parks, whose calls are the classic “twit-twoo”, actually a female’s sharp “ke-wick” answered by a male’s hoot. Pairs stay in the same territory for life and know every tree in it.'],
      [('Species in genus', 'About 22'), ('Length', 'About 37–39 cm'), ('IUCN status', 'Least Concern')],
      ['tawny owl', 'brown owl', 'strix', 'owl', 'twit twoo', 'europe'],
      [C(*EUROPE, 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', exclude=['Ireland']), part('Norway', 5, 58, 12, 64), part('Sweden', 11, 55, 18, 63), part('Russia', 28, 45, 60, 60), part('Iran', 46, 35, 57, 39), part('Morocco', -9, 30, -1, 36), part('Algeria', -2, 34, 8, 37), part('Tunisia', 8, 34, 11.5, 37.5)]),
    S('ketupa-blakistoni', 'Ketupa blakistoni', 'Blakiston’s fish owl', 'strigidae', 'River forests of the Russian Far East, north-eastern China and Hokkaido',
      ['The largest owl in the world, with a shaggy, ear-tufted head, that wades in icy rivers to catch salmon and trout. It needs old riverside trees big enough to nest in, so it has declined with logging; only a few hundred pairs remain.'],
      [('Species in genus', '7'), ('Wingspan', 'About 1.8–2 m'), ('IUCN status', 'Endangered')],
      ['blakistons fish owl', 'fish owl', 'largest owl', 'ketupa', 'bubo', 'hokkaido', 'russia'],
      [part('Russia', 130, 43, 145, 55), part('China', 127, 45, 135, 50), part('Japan', 141, 42, 146, 45.6)]),

    # ── Ducks, geese and swans ──
    S('cygnus-olor', 'Cygnus olor', 'Mute swan', 'anatidae', 'Europe and central Asia; introduced to North America, South Africa, Japan and Australia',
      ['A huge white swan with an orange bill and a black knob, holding its neck in a graceful S-curve. It is not really mute but grunts and hisses, and its wingbeats make a loud throbbing sound. In Britain, unmarked mute swans on open water traditionally belong to the monarch.'],
      [('Species in genus', '6'), ('Weight', 'About 9–12 kg'), ('IUCN status', 'Least Concern')],
      ['mute swan', 'swan', 'cygnus', 'europe'],
      [C('United Kingdom', 'Ireland', 'France', 'Belgium', 'Netherlands', 'Germany', 'Denmark', 'Poland', 'Czechia', 'Austria', 'Hungary', 'Lithuania', 'Latvia', 'Estonia', 'Belarus', 'Ukraine', 'Romania'), part('Sweden', 11, 55, 19, 61), part('Russia', 28, 44, 90, 58), part('Kazakhstan', 50, 42, 85, 54), part('Mongolia', 90, 46, 105, 52),
       part(US, -90, 38, -69, 47), part(US, -124, 45, -121, 49)]),
    S('cygnus-atratus', 'Cygnus atratus', 'Black swan', 'anatidae', 'Australia; introduced to New Zealand',
      ['An all-black swan with a red bill and white flight feathers that show only when it flies. Europeans believed all swans were white, so “black swan” meant something impossible, until Dutch explorers saw them in Western Australia in 1697. It is the emblem of Western Australia.'],
      [('Species in genus', '6'), ('Weight', 'About 4.5–9 kg'), ('IUCN status', 'Least Concern')],
      ['black swan', 'swan', 'cygnus', 'western australia', 'new zealand'],
      [part('Australia', 113, -44, 154, -20), C('New Zealand')]),
    S('branta-canadensis', 'Branta canadensis', 'Canada goose', 'anatidae', 'North America; introduced to Britain, Europe and New Zealand',
      ['A large grey-brown goose with a black neck and white chin strap, famous for flying south in noisy V-shaped flocks. Many now live year-round in city parks and on golf courses. Introduced to Britain in the 1600s for the king’s waterfowl collection, it is now common across northern Europe.'],
      [('Species in genus', '6'), ('Weight', 'About 3–7 kg'), ('IUCN status', 'Least Concern')],
      ['canada goose', 'goose', 'branta', 'migration', 'north america'],
      [part('Canada', -141, 42, -55, 75), part(US, -170, 25, -66, 72), part('Mexico', -117, 23, -97, 32.7), part('United Kingdom', -6, 50, 1.8, 58), C('Ireland', 'Belgium', 'Netherlands', 'Denmark'), part('Sweden', 11, 55, 20, 64), part('Finland', 21, 60, 28, 64), part('Norway', 5, 58, 12, 64), part('New Zealand', 166, -47, 175, -40)]),
    S('anser-anser', 'Anser anser', 'Greylag goose', 'anatidae', 'Europe and Asia',
      ['A large grey goose with a pink or orange bill, the wild ancestor of most farmyard geese, domesticated in Egypt and Europe thousands of years ago. Konrad Lorenz famously showed that greylag goslings follow and become attached to the first moving thing they see, a process he called imprinting.'],
      [('Species in genus', '11'), ('Weight', 'About 2–4.5 kg'), ('IUCN status', 'Least Concern')],
      ['greylag goose', 'goose', 'anser', 'imprinting', 'lorenz', 'domestic goose'],
      [C(*EUROPE, 'Iceland', 'Turkey', 'Iran', *CENTRAL_ASIA), part('Russia', 28, 45, 135, 62), part('China', 75, 22, 125, 50), C(*SOUTH_ASIA), part('Morocco', -9, 30, -1, 36), part('Algeria', -2, 33, 8, 37)]),
    S('aix-sponsa', 'Aix sponsa', 'Wood duck', 'anatidae', 'Wooded swamps and rivers of North America and Cuba',
      ['One of the most colourful ducks, the male with a green crest and red eyes. It nests in tree holes, and a day after hatching the ducklings jump from the nest, sometimes 15 m up, to the ground or water below, unharmed. Nest boxes helped it recover from overhunting in the early 1900s.'],
      [('Species in genus', '2'), ('Weight', 'About 0.5–0.9 kg'), ('IUCN status', 'Least Concern')],
      ['wood duck', 'carolina duck', 'aix', 'duck', 'north america'],
      [part(US, -100, 25, -67, 49), part(US, -124, 32, -116, 49), part('Canada', -100, 42, -60, 50), part('Canada', -128, 48, -115, 52), part('Mexico', -117, 20, -97, 32.7), C('Cuba')]),
    S('aix-galericulata', 'Aix galericulata', 'Mandarin duck', 'anatidae', 'Forested rivers of eastern Asia; introduced to Britain and Europe',
      ['The male is one of the most ornate birds in the world, with orange “sails” on his back and orange whiskers. In China, pairs are a symbol of lasting love, given as wedding gifts. Habitat loss has made it rare in China, and escaped birds now form a large wild population in Britain.'],
      [('Species in genus', '2'), ('Weight', 'About 0.4–0.7 kg'), ('IUCN status', 'Least Concern')],
      ['mandarin duck', 'aix', 'duck', 'china', 'japan', 'britain'],
      [part('Russia', 127, 42, 141, 52), part('China', 100, 22, 135, 50), C('North Korea', 'South Korea', 'Japan', 'Taiwan'), part('United Kingdom', -3, 50.5, 1.5, 53)]),
    S('somateria-mollissima', 'Somateria mollissima', 'Common eider', 'anatidae', 'Arctic and northern coasts of Europe, Asia and North America',
      ['A big sea duck that dives for mussels, swallowing them whole and crushing the shells in its gizzard. Females line their nests with soft down plucked from their breasts; in Iceland and Norway people gently collect this eiderdown from nests to fill duvets.'],
      [('Species in genus', '3'), ('Weight', 'About 1.2–3 kg'), ('IUCN status', 'Near Threatened')],
      ['common eider', 'eider', 'eiderdown', 'somateria', 'sea duck', 'arctic'],
      [sea(-170, 55, -140, 72), sea(-140, 60, -60, 82), sea(-75, 42, -50, 60), sea(-75, 59, -10, 84), sea(-25, 62, -12, 67.5), sea(-11, 50, 32, 72), sea(32, 64, 180, 78)]),
    S('cairina-moschata', 'Cairina moschata', 'Muscovy duck', 'anatidae', 'Forested wetlands from Mexico to northern Argentina; domesticated worldwide',
      ['A large black duck with white wing patches, wild in tropical American forests, where it nests in tree holes. Native peoples domesticated it long before Europeans arrived; the domestic form, with red, warty facial skin, is now kept worldwide.'],
      [('Species in genus', '1'), ('Weight', 'About 1.1–4 kg'), ('IUCN status', 'Least Concern')],
      ['muscovy duck', 'cairina', 'duck', 'domestic duck', 'south america'],
      [part('Mexico', -106, 14.5, -87, 26), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS), part('Argentina', -65, -30, -53.6, -22)]),
    S('branta-sandvicensis', 'Branta sandvicensis', 'Nēnē', 'anatidae', 'Volcanic slopes and grassland of the Hawaiian islands',
      ['The Hawaiian goose, the state bird of Hawaii, descended from Canada geese that reached the islands about 500,000 years ago. It has lost most of the webbing on its feet for walking on lava. Hunting and introduced mongooses cut it to about 30 birds by 1952; captive breeding has brought it back to over 3,000.'],
      [('Species in genus', '6'), ('Weight', 'About 1.5–2.5 kg'), ('IUCN status', 'Near Threatened')],
      ['nene', 'nēnē', 'hawaiian goose', 'branta', 'hawaii', 'conservation success'],
      [part(US, -160.5, 18.8, -154.8, 22.3)]),

    # ── Rails ──
    S('gallinula-chloropus', 'Gallinula chloropus', 'Common moorhen', 'rallidae', 'Wetlands across Europe, Asia and Africa',
      ['A dark waterbird with a red-and-yellow bill that walks on lily pads with long green toes and jerks its head as it swims. Young from earlier broods often help their parents raise the next one.'],
      [('Species in genus', '8'), ('Length', 'About 30–38 cm'), ('IUCN status', 'Least Concern')],
      ['moorhen', 'common moorhen', 'gallinule', 'gallinula', 'rail', 'wetland'],
      [C(*EUROPE, *SUB_SAHARA, *SOUTH_ASIA, *SE_ASIA, 'Turkey', 'Iran', 'Morocco', 'Algeria', 'Tunisia', 'Egypt', exclude=['Norway', 'Finland']), part('Sweden', 11, 55, 19, 61), part('Russia', 28, 44, 60, 58), part('China', 98, 20, 125, 42), C('Japan', 'Philippines'), part('Indonesia', 95, -9, 120, 6)]),
    S('fulica-atra', 'Fulica atra', 'Eurasian coot', 'rallidae', 'Lakes and ponds across Europe, Asia, North Africa and Australia',
      ['A plump black waterbird with a white bill and forehead shield (hence “bald as a coot”). Its toes have scalloped flaps instead of webbing. Coots are aggressive in spring, fighting with their feet, and sometimes kill their own extra chicks.'],
      [('Species in genus', '10'), ('Length', 'About 36–38 cm'), ('IUCN status', 'Least Concern')],
      ['coot', 'eurasian coot', 'fulica', 'rail', 'bald as a coot'],
      [C(*EUROPE, *SOUTH_ASIA, 'Turkey', 'Iran', 'Afghanistan', *CENTRAL_ASIA, 'Morocco', 'Algeria', 'Tunisia', 'Egypt', exclude=['Norway']), part('Russia', 28, 44, 140, 60), part('China', 75, 20, 135, 52), C('Japan', 'North Korea', 'South Korea'), part('Australia', 113, -44, 154, -15), C('New Zealand')]),
    S('hypotaenidia-owstoni', 'Hypotaenidia owstoni', 'Guam rail', 'rallidae', 'Guam (wiped out there) and Cocos Island and Rota, where it has been reintroduced',
      ['A flightless rail of the Pacific island of Guam, wiped out in the wild in the 1980s by the brown tree snake, accidentally brought in on cargo after World War II, which ate most of the island’s native birds. The last 21 rails were captured for breeding in 1986.',
       'Released on snake-free Cocos Island, it breeds in the wild again, and in 2019 it became only the second bird ever moved off the “extinct in the wild” list.'],
      [('Species in genus', 'About 8'), ('Length', 'About 28 cm'), ('IUCN status', 'Critically Endangered')],
      ['guam rail', 'koko', 'hypotaenidia', 'rail', 'flightless', 'brown tree snake', 'guam'],
      [sea(144.6, 13.2, 144.75, 13.3), sea(145.1, 14.1, 145.3, 14.2)]),
    S('atlantisia-rogersi', 'Atlantisia rogersi', 'Inaccessible Island rail', 'rallidae', 'Inaccessible Island, Tristan da Cunha, South Atlantic',
      ['The smallest flightless bird alive, about the size of a chick, which runs mouse-like through tussock grass on one tiny island in the South Atlantic. Its ancestors flew there from South America; with no predators, it lost the power of flight.'],
      [('Species in genus', '1'), ('Weight', 'About 35–50 g'), ('IUCN status', 'Vulnerable')],
      ['inaccessible island rail', 'smallest flightless bird', 'atlantisia', 'rail', 'tristan da cunha'],
      [sea(-12.8, -37.4, -12.6, -37.2)]),

    # ── Cranes ──
    S('grus-americana', 'Grus americana', 'Whooping crane', 'gruidae', 'Breeds in Wood Buffalo National Park, Canada; winters on the Texas coast',
      ['North America’s tallest bird, white with a red crown, named for its loud trumpeting call. By 1941 only about 15 wild birds survived. Protection and captive breeding have raised numbers to over 800; volunteers even taught young cranes a new migration route by leading them with ultralight aircraft.'],
      [('Species in genus', '8'), ('Height', 'About 1.5 m'), ('IUCN status', 'Endangered')],
      ['whooping crane', 'crane', 'grus', 'endangered', 'canada', 'texas'],
      [part('Canada', -115, 59, -112, 61), part(US, -98, 27.5, -96, 29), part(US, -91, 42, -88, 45), part(US, -93, 29.5, -91, 31)]),
    S('antigone-canadensis', 'Antigone canadensis', 'Sandhill crane', 'gruidae', 'North America and north-eastern Siberia; winters in the southern USA and Mexico',
      ['A tall grey crane with a red cap that dances, leaping and bowing, especially in spring. Each March about half a million gather on the Platte River in Nebraska, one of the great wildlife spectacles. Fossils show sandhill-like cranes have lived in North America for millions of years.'],
      [('Species in genus', '4'), ('Height', 'About 0.8–1.2 m'), ('IUCN status', 'Least Concern')],
      ['sandhill crane', 'crane', 'antigone', 'grus', 'platte river', 'north america'],
      [part('Canada', -141, 48, -65, 72), part(US, -170, 55, -141, 72), part(US, -125, 25, -80, 48), part('Mexico', -110, 18, -97, 32.7), part('Russia', 160, 60, 180, 72), C('Cuba')]),
    S('balearica-regulorum', 'Balearica regulorum', 'Grey crowned crane', 'gruidae', 'Wetlands and grassland of eastern and southern Africa',
      ['A crane with a golden crown of stiff feathers, a bare white face and a red throat pouch, the national bird of Uganda. It is the only crane that roosts in trees. Draining of wetlands and capture for the pet trade have made it endangered.'],
      [('Species in genus', '2'), ('Height', 'About 1 m'), ('IUCN status', 'Endangered')],
      ['grey crowned crane', 'crowned crane', 'balearica', 'crane', 'uganda', 'africa'],
      [C('Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Burundi', 'Zambia', 'Malawi', 'Zimbabwe'), part('Dem. Rep. Congo', 27, -12, 31, 2), part('Mozambique', 32, -26, 37, -14), part('South Africa', 27, -32, 32.5, -24), part('Botswana', 22, -20, 26, -18), part('Angola', 13, -18, 22, -12)]),

    # ── Herons ──
    S('ardea-alba', 'Ardea alba', 'Great egret', 'ardeidae', 'Wetlands on every continent except Antarctica',
      ['A tall, all-white heron with a yellow bill. In the breeding season it grows long, lacy plumes on its back, which in the late 1800s were in such demand for women’s hats that egrets were shot in huge numbers. Outrage at the slaughter led to the founding of the Audubon Society, and the great egret became its symbol.'],
      [('Species in genus', 'About 12'), ('Height', 'About 0.9–1 m'), ('IUCN status', 'Least Concern')],
      ['great egret', 'great white egret', 'egret', 'ardea', 'heron', 'audubon', 'plume trade'],
      [part(US, -125, 25, -67, 45), C('Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Argentina', 'Cuba'), C(*SUB_SAHARA, *SOUTH_ASIA, *SE_ASIA), part('Australia', 113, -40, 154, -11), C('New Zealand'), part('China', 98, 20, 125, 45), C('Japan', 'Philippines', 'Hungary', 'Netherlands', 'France', 'Romania', 'Ukraine')]),
    S('ardea-herodias', 'Ardea herodias', 'Great blue heron', 'ardeidae', 'Wetlands and coasts of North and Central America, the Caribbean and the Galápagos',
      ['North America’s largest heron, standing still for long periods in shallow water before stabbing fish, frogs and even gophers with its dagger-like bill. It nests in colonies called heronries high in trees.'],
      [('Species in genus', 'About 12'), ('Height', 'About 1–1.4 m'), ('IUCN status', 'Least Concern')],
      ['great blue heron', 'heron', 'ardea', 'north america'],
      [part('Canada', -135, 42, -55, 58), C(US, 'Mexico', *CENTRAL_AMERICA, *CARIBBEAN, latMax=60), part('Colombia', -78, 6, -71, 12.5), part('Venezuela', -73, 8, -60, 12), part('Ecuador', -92, -1.5, -89, 1)]),
    S('bubulcus-ibis', 'Bubulcus ibis', 'Cattle egret', 'ardeidae', 'Grassland and farmland worldwide in warm regions',
      ['A small, stocky white heron that follows cattle, elephants and tractors to catch the insects they disturb. Originally from Africa and southern Asia, it reached South America on its own around 1877, probably blown across the Atlantic, and has since spread through the Americas and to Australia.'],
      [('Species in genus', '2'), ('Length', 'About 46–56 cm'), ('IUCN status', 'Least Concern')],
      ['cattle egret', 'egret', 'bubulcus', 'heron', 'range expansion'],
      [C(*SUB_SAHARA, *SOUTH_ASIA, *SE_ASIA, 'Egypt', 'Morocco', 'Algeria', 'Portugal', 'Spain'), part('France', -2, 42.3, 7.7, 47), part(US, -100, 25, -75, 40), C('Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Cuba'), part('Argentina', -66, -38, -53.6, -22), part('Australia', 113, -40, 154, -11), part('China', 98, 20, 125, 40), C('Japan', 'Philippines')]),
    S('nycticorax-nycticorax', 'Nycticorax nycticorax', 'Black-crowned night heron', 'ardeidae', 'Wetlands on every continent except Australia and Antarctica',
      ['A stocky, short-necked heron with red eyes that feeds mainly at dusk and night and roosts in trees by day. It is one of the most widespread herons in the world. Some even use bait, dropping bread or insects on the water to lure fish.'],
      [('Species in genus', '2'), ('Length', 'About 58–65 cm'), ('IUCN status', 'Least Concern')],
      ['black-crowned night heron', 'night heron', 'nycticorax', 'heron'],
      [part(US, -125, 25, -67, 45), C('Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Argentina', 'Chile', 'Cuba'), C('Spain', 'Portugal', 'France', 'Italy', 'Hungary', 'Romania', 'Bulgaria', 'Serbia', 'Ukraine', 'Turkey', *SUB_SAHARA, *SOUTH_ASIA, *SE_ASIA, exclude=['Somalia']), part('China', 98, 20, 125, 42), C('Japan', 'Philippines')]),
    S('botaurus-stellaris', 'Botaurus stellaris', 'Eurasian bittern', 'ardeidae', 'Reedbeds across Europe and Asia; winters in Africa and southern Asia',
      ['A secretive, streaky brown heron that hides in reedbeds, pointing its bill skywards and swaying with the reeds when alarmed. The male’s booming call, like someone blowing over a bottle, can be heard up to 5 km away. It died out in Britain in the 1880s and has since returned.'],
      [('Species in genus', '4'), ('Length', 'About 70–80 cm'), ('IUCN status', 'Least Concern')],
      ['bittern', 'eurasian bittern', 'botaurus', 'heron', 'booming', 'reedbed'],
      [C(*EUROPE, 'Turkey', 'Kazakhstan', exclude=['Norway', 'Ireland']), part('United Kingdom', -3.5, 50.5, 1.8, 54.5), part('Sweden', 11, 55, 20, 62), part('Finland', 21, 60, 30, 64), part('Russia', 28, 45, 140, 60), part('China', 105, 35, 135, 50), part('South Africa', 26, -34, 32, -26)]),

    # ── Storks, ibises and flamingos ──
    S('leptoptilos-crumenifer', 'Leptoptilos crumenifer', 'Marabou stork', 'ciconiidae', 'Savannas, wetlands and rubbish dumps of sub-Saharan Africa',
      ['A huge, bald-headed stork with a pink, dangling throat pouch and one of the largest wingspans of any land bird, up to about 3 m. It eats carrion alongside vultures and scavenges at rubbish dumps and slaughterhouses.'],
      [('Species in genus', '3'), ('Wingspan', 'About 2.3–3 m'), ('IUCN status', 'Least Concern')],
      ['marabou stork', 'marabou', 'undertaker bird', 'leptoptilos', 'stork', 'africa'],
      [C(*SUB_SAHARA, exclude=['Gabon', 'Congo', 'Eq. Guinea', 'Liberia', 'Sierra Leone', 'Lesotho', 'eSwatini'])]),
    S('jabiru-mycteria', 'Jabiru mycteria', 'Jabiru', 'ciconiidae', 'Wetlands from Mexico to northern Argentina',
      ['The tallest flying bird in Central and South America, a white stork with a black head and a bright red band at the base of its neck. It builds huge stick nests in tall trees in the Pantanal and the llanos.'],
      [('Species in genus', '1'), ('Height', 'About 1.2–1.4 m'), ('IUCN status', 'Least Concern')],
      ['jabiru', 'stork', 'jabiru mycteria', 'pantanal'],
      [part('Mexico', -98, 15, -87, 21), C('Belize', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica', 'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Paraguay', 'Bolivia'), part('Brazil', -62, -24, -44, 2), part('Argentina', -64, -30, -57, -22), C('Uruguay')]),
    S('eudocimus-ruber', 'Eudocimus ruber', 'Scarlet ibis', 'threskiornithidae', 'Mangroves and mudflats of northern South America',
      ['A brilliant scarlet ibis that gets its colour from pigments in the crabs and shrimps it eats; young birds are grey-brown. It is the national bird of Trinidad and Tobago, where huge flocks fly in to roost in the Caroni Swamp each evening.'],
      [('Species in genus', '2'), ('Length', 'About 55–63 cm'), ('IUCN status', 'Least Concern')],
      ['scarlet ibis', 'ibis', 'eudocimus', 'trinidad', 'mangrove'],
      [part('Colombia', -76, 8, -71, 12.5), part('Venezuela', -73, 7, -60, 12), C('Trinidad and Tobago', 'Guyana', 'Suriname'), part('Brazil', -55, -3, -40, 5)]),
    S('platalea-ajaja', 'Platalea ajaja', 'Roseate spoonbill', 'threskiornithidae', 'Wetlands from the south-eastern USA to Argentina',
      ['A pink wading bird with a flat, spoon-shaped bill that it sweeps from side to side through shallow water, snapping shut on shrimps and fish it touches. Like flamingos, it gets its colour from its food. Plume hunters almost wiped it out in Florida in the 1800s.'],
      [('Species in genus', '6'), ('Length', 'About 70–85 cm'), ('IUCN status', 'Least Concern')],
      ['roseate spoonbill', 'spoonbill', 'platalea', 'florida', 'americas'],
      [part(US, -98, 25, -80, 30.5), C('Mexico', *CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Cuba'), part('Argentina', -66, -38, -53.6, -22)]),
    S('geronticus-eremita', 'Geronticus eremita', 'Northern bald ibis', 'threskiornithidae', 'Cliffs on the Atlantic coast of Morocco; reintroduced in central Europe',
      ['A black ibis with a bald red head and shaggy neck feathers, once common across the Middle East, North Africa and central Europe, where it vanished by the 1600s. The main wild colony now lives near Agadir in Morocco. In Austria and Germany, young birds have been taught to migrate to Italy by following microlight aircraft.'],
      [('Species in genus', '2'), ('Length', 'About 70–80 cm'), ('IUCN status', 'Endangered')],
      ['northern bald ibis', 'waldrapp', 'hermit ibis', 'geronticus', 'ibis', 'morocco', 'reintroduction'],
      [part('Morocco', -10, 30, -9, 31.5), part('Spain', -6.2, 36.1, -5.6, 36.6), part('Austria', 13, 47.5, 14.5, 48.2), part('Germany', 9, 47.5, 11, 48.2), part('Italy', 10.5, 43, 12, 44)]),
    S('phoeniconaias-minor', 'Phoeniconaias minor', 'Lesser flamingo', 'phoenicopteridae', 'Salt lakes of eastern and southern Africa and north-western India',
      ['The smallest and most numerous flamingo, with a deep-keeled bill that filters tiny blue-green algae from salty, alkaline lakes, the source of its pink colour. Over a million gather at times on lakes of the East African Rift, and almost all breed at Lake Natron in Tanzania, whose caustic water keeps predators away.'],
      [('Species in genus', '1'), ('Height', 'About 80–90 cm'), ('IUCN status', 'Near Threatened')],
      ['lesser flamingo', 'flamingo', 'phoeniconaias', 'lake natron', 'rift valley'],
      [part('Kenya', 35, -2, 37, 1), part('Tanzania', 34, -4, 37, -2), part('Ethiopia', 38, 7, 40, 9), part('Botswana', 24, -22, 27, -19.5), part('Namibia', 14, -24, 16.5, -18.5), part('South Africa', 24, -29, 29, -26), part('India', 68, 22, 72.5, 25), part('Pakistan', 66, 24, 69, 26)]),

    # ── Gulls and terns ──
    S('larus-argentatus', 'Larus argentatus', 'European herring gull', 'laridae', 'Coasts and cities of north-western Europe',
      ['The classic grey-backed seaside gull, which now nests on rooftops in many towns and steals chips. Its chicks peck at a red spot on the parent’s bill to make it bring up food, a reflex the scientist Niko Tinbergen studied in famous experiments.'],
      [('Species in genus', 'About 25'), ('Wingspan', 'About 1.3–1.5 m'), ('IUCN status', 'Least Concern')],
      ['herring gull', 'seagull', 'gull', 'larus', 'tinbergen', 'europe'],
      [C('United Kingdom', 'Ireland', 'Iceland', 'Norway', 'Denmark', 'Netherlands', 'Belgium', 'Estonia', 'Latvia'), part('France', -5, 46, 3, 51.2), part('Germany', 6, 53, 14.5, 55), part('Sweden', 11, 55, 22, 66), part('Finland', 21, 60, 30, 70), part('Russia', 28, 59, 45, 70)]),
    S('rissa-tridactyla', 'Rissa tridactyla', 'Black-legged kittiwake', 'laridae', 'North Atlantic and North Pacific oceans; nests on sea cliffs',
      ['A small, gentle-looking gull of the open ocean, named for its “kitti-waaake” call. It nests on tiny ledges of sheer sea cliffs, gluing nests of mud and seaweed. Kittiwakes have declined steeply where warming seas have reduced the sand eels they feed their chicks.'],
      [('Species in genus', '2'), ('Wingspan', 'About 0.9–1.2 m'), ('IUCN status', 'Vulnerable')],
      ['kittiwake', 'black-legged kittiwake', 'rissa', 'gull', 'seabird', 'sea cliffs'],
      [sea(-70, 40, 30, 80), sea(-180, 40, -120, 72), sea(140, 40, 180, 72)]),
    S('rynchops-niger', 'Rynchops niger', 'Black skimmer', 'laridae', 'Coasts and rivers of the Americas',
      ['A tern-like bird with a unique bill: the lower half is longer than the upper. It flies low over calm water with the lower bill slicing the surface, snapping shut on any fish it touches. Its eyes have cat-like slit pupils to cut glare from water and sand.'],
      [('Species in genus', '3'), ('Wingspan', 'About 1.1–1.3 m'), ('IUCN status', 'Least Concern')],
      ['black skimmer', 'skimmer', 'rynchops', 'tern', 'americas'],
      [part(US, -98, 25, -70, 41), part(US, -120, 32, -116, 34), part('Mexico', -117, 15, -87, 32), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Argentina', exclude=['Chile'])]),
    S('pagophila-eburnea', 'Pagophila eburnea', 'Ivory gull', 'laridae', 'The high Arctic pack ice',
      ['A pure white gull with black legs that lives along the edge of the Arctic sea ice all year, scavenging seal carcasses left by polar bears. It nests on remote cliffs and nunataks. Its Canadian population fell by about 70% in 20 years as the ice retreated.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.1–1.2 m'), ('IUCN status', 'Near Threatened')],
      ['ivory gull', 'pagophila', 'gull', 'arctic', 'sea ice', 'climate change'],
      [sea(-120, 72, -60, 84), sea(-60, 74, 0, 84), sea(0, 76, 110, 84), sea(-75, 58, -50, 70)]),

    # ── Sandpipers and other shorebirds ──
    S('scolopax-rusticola', 'Scolopax rusticola', 'Eurasian woodcock', 'scolopacidae', 'Damp woodland across Europe and northern Asia',
      ['A plump, camouflaged wader of woodland floors that probes for earthworms with its long, flexible-tipped bill. Its eyes are set so far back that it can see all around and above itself. At dusk in spring, males fly “roding” display flights over the treetops.'],
      [('Species in genus', '8'), ('Length', 'About 33–38 cm'), ('IUCN status', 'Least Concern')],
      ['woodcock', 'eurasian woodcock', 'scolopax', 'wader', 'roding', 'woodland'],
      [C(*EUROPE, 'Turkey', 'Georgia', exclude=['Portugal', 'Greece', 'Albania', 'North Macedonia']), part('Russia', 28, 45, 145, 65), part('China', 85, 40, 135, 53), C('Mongolia', 'Japan', latMin=40), part('Spain', -9.5, 42, -2, 43.8)]),
    S('calidris-canutus', 'Calidris canutus', 'Red knot', 'scolopacidae', 'Breeds in the high Arctic; winters on coasts of every continent but Antarctica',
      ['A stocky sandpiper with brick-red breeding plumage and one of the longest migrations of any bird, up to 15,000 km each way between the Arctic and southern South America, Africa or Australia. In spring, migrating knots depend on horseshoe crab eggs in Delaware Bay to refuel; overharvesting of crabs caused a steep decline.'],
      [('Species in genus', 'About 24'), ('Length', 'About 23–26 cm'), ('IUCN status', 'Near Threatened')],
      ['red knot', 'knot', 'calidris', 'sandpiper', 'migration', 'horseshoe crab'],
      [part('Canada', -125, 66, -60, 83), part('Greenland', -75, 75, -15, 84), part('Russia', 70, 70, 180, 78), part(US, -76, 38, -74, 40), part('Argentina', -69, -55, -62, -40), part('Brazil', -50, -3, -40, 0), part('Mauritania', -17, 19, -16, 21.5), part('Australia', 113, -25, 125, -15), C('New Zealand')]),
    S('calidris-pygmaea', 'Calidris pygmaea', 'Spoon-billed sandpiper', 'scolopacidae', 'Breeds in Chukotka, Russia; winters on coasts of Bangladesh, Myanmar and South-east Asia',
      ['A sparrow-sized sandpiper with a unique spoon-shaped bill tip. It breeds only on coastal tundra in Russia’s far north-east and migrates about 8,000 km to tropical mudflats. Loss of Yellow Sea mudflats and trapping on its wintering grounds cut it to a few hundred pairs; eggs taken for captive rearing have helped it.'],
      [('Species in genus', 'About 24'), ('Length', 'About 14–16 cm'), ('IUCN status', 'Critically Endangered')],
      ['spoon-billed sandpiper', 'spoonie', 'calidris', 'sandpiper', 'chukotka', 'critically endangered'],
      [part('Russia', 170, 62, 180, 67), part('Russia', -180, 64, -172, 67), part('Bangladesh', 89, 21.5, 92.5, 23), part('Myanmar', 94, 15, 98, 18), part('Thailand', 99.5, 13, 100.5, 13.6), part('China', 119.5, 32, 121.5, 33.5)]),
    S('calidris-pugnax', 'Calidris pugnax', 'Ruff', 'scolopacidae', 'Breeds in northern Europe and Siberia; winters in Africa and South Asia',
      ['A wader whose breeding males grow huge, colourful neck ruffs and ear tufts and fight in groups called leks to win females. There are three kinds of males: territorial ones, “satellite” males with white ruffs, and rare female-like males that sneak matings.'],
      [('Species in genus', 'About 24'), ('Length', 'About 26–32 cm'), ('IUCN status', 'Least Concern')],
      ['ruff', 'calidris pugnax', 'philomachus', 'sandpiper', 'lek', 'wader'],
      [part('Norway', 5, 60, 31, 71), part('Sweden', 12, 60, 24, 69), part('Finland', 21, 62, 30, 70), part('Russia', 28, 58, 180, 74), C('Estonia', 'Latvia', 'Netherlands'), C(*SUB_SAHARA, exclude=['Gabon', 'Congo', 'Eq. Guinea', 'Dem. Rep. Congo', 'Liberia']), part('India', 68, 18, 85, 30)]),
    S('charadrius-vociferus', 'Charadrius vociferus', 'Killdeer', 'charadriidae', 'North America to north-western South America',
      ['A plover with two black breast bands, named for its loud “kill-deer” call. It nests in a simple scrape on gravel, even on flat roofs and car parks. If a predator approaches, the parent pretends to have a broken wing, dragging it along the ground to lure the predator away from the nest.'],
      [('Species in genus', 'About 30'), ('Length', 'About 23–26 cm'), ('IUCN status', 'Least Concern')],
      ['killdeer', 'plover', 'charadrius', 'broken wing display', 'north america'],
      [part('Canada', -135, 42, -55, 62), C(US, 'Mexico', *CENTRAL_AMERICA, *CARIBBEAN, latMax=62), part('Colombia', -78, 0, -72, 12), part('Ecuador', -81, -5, -78, 1), part('Peru', -81, -18, -70, -5)]),
    S('vanellus-vanellus', 'Vanellus vanellus', 'Northern lapwing', 'charadriidae', 'Farmland and wet grassland across Europe and Asia',
      ['A black-and-white plover with a long wispy crest and green-glossed back, named for its floppy, lapping wingbeats. Its tumbling spring display flights come with a call that gave it the name “peewit”. Changes in farming have caused big declines.'],
      [('Species in genus', 'About 25'), ('Length', 'About 28–31 cm'), ('IUCN status', 'Near Threatened')],
      ['lapwing', 'northern lapwing', 'peewit', 'green plover', 'vanellus', 'europe'],
      [C(*EUROPE, 'Turkey', 'Kazakhstan', 'Mongolia', exclude=['Norway']), part('Norway', 5, 58, 31, 70), part('Russia', 28, 45, 135, 62), part('China', 75, 35, 130, 50), part('Morocco', -9, 30, -1, 36), part('Iran', 46, 30, 62, 39)]),
    S('haematopus-ostralegus', 'Haematopus ostralegus', 'Eurasian oystercatcher', 'haematopodidae', 'Coasts and inland waters of Europe and Asia; winters on coasts south to Africa and India',
      ['A noisy, pied wader with a long orange bill and pink legs. Despite its name it rarely eats oysters, but opens mussels and cockles: some birds hammer through the shell, others stab between the two halves to cut the muscle, a technique young birds learn from their parents.'],
      [('Species in genus', 'About 12'), ('Length', 'About 40–45 cm'), ('IUCN status', 'Near Threatened')],
      ['oystercatcher', 'eurasian oystercatcher', 'haematopus', 'wader', 'coast'],
      [C('United Kingdom', 'Ireland', 'Iceland', 'Norway', 'Denmark', 'Netherlands', 'Belgium', 'Estonia', 'Latvia', 'Lithuania'), part('France', -5, 43, 3, 51.2), part('Germany', 6, 53, 14.5, 55), part('Sweden', 11, 55, 24, 69), part('Finland', 21, 60, 30, 70), part('Russia', 28, 45, 90, 70), part('Kazakhstan', 50, 42, 85, 52), part('China', 115, 20, 125, 42), C('Portugal', 'Morocco', 'Mauritania')]),
    S('recurvirostra-avosetta', 'Recurvirostra avosetta', 'Pied avocet', 'recurvirostridae', 'Coastal lagoons and salt lakes of Europe, Africa and Asia',
      ['An elegant black-and-white wader with a long, thin, upturned bill that it sweeps from side to side through shallow water to catch small creatures. It returned to breed in Britain in 1947, after a 100-year absence, and became the symbol of the RSPB.'],
      [('Species in genus', '4'), ('Length', 'About 42–45 cm'), ('IUCN status', 'Least Concern')],
      ['avocet', 'pied avocet', 'recurvirostra', 'wader', 'rspb'],
      [part('United Kingdom', -3.5, 50.5, 1.8, 54), C('Netherlands', 'Belgium', 'Denmark', 'Portugal'), part('Germany', 6, 53, 14.5, 55), part('Spain', -9.5, 36, 3.5, 42), part('France', -5, 43, 6, 51), part('Italy', 8, 37, 18.5, 46), part('Ukraine', 30, 44, 40, 47.5), part('Turkey', 26, 36, 44, 42), part('Kazakhstan', 50, 42, 85, 52), part('Mongolia', 88, 42, 120, 50), part('China', 75, 35, 125, 48), C('Kenya', 'Tanzania', 'Botswana', 'Namibia', 'South Africa'), part('Ethiopia', 37, 6, 42, 9)]),

    # ── Seabirds ──
    S('phoebastria-immutabilis', 'Phoebastria immutabilis', 'Laysan albatross', 'diomedeidae', 'The North Pacific; nests mainly on the north-western Hawaiian Islands',
      ['A white-and-dark-grey albatross that ranges across the whole North Pacific. One female, Wisdom, ringed on Midway Atoll in 1956, is the oldest known wild bird and was still laying eggs in her 70s. Chicks often die after their parents feed them floating plastic by mistake.'],
      [('Species in genus', '4'), ('Wingspan', 'About 2 m'), ('IUCN status', 'Near Threatened')],
      ['laysan albatross', 'albatross', 'phoebastria', 'wisdom', 'midway', 'plastic'],
      [sea(130, 20, 180, 55), sea(-180, 20, -120, 58)]),
    S('thalassarche-melanophris', 'Thalassarche melanophris', 'Black-browed albatross', 'diomedeidae', 'The Southern Ocean; nests mainly on the Falklands, South Georgia and southern Chile',
      ['The most widespread albatross, named for the dark eyebrow stripe that gives it a frowning look. Most nest on the Falkland Islands. Many were drowned on longline fishing hooks, but bird-scaring lines on fishing boats have greatly reduced deaths.'],
      [('Species in genus', '6'), ('Wingspan', 'About 2.1–2.5 m'), ('IUCN status', 'Least Concern')],
      ['black-browed albatross', 'mollymawk', 'albatross', 'thalassarche', 'falkland islands', 'southern ocean'],
      [sea(-180, -65, 180, -30)]),
    S('fulmarus-glacialis', 'Fulmarus glacialis', 'Northern fulmar', 'procellariidae', 'The North Atlantic and North Pacific oceans',
      ['A gull-like seabird of the petrel family with stiff, straight wings and tube-shaped nostrils that help it smell food at sea. When threatened at the nest, it spits a foul-smelling oil that can mat the feathers of attacking birds. Fulmars have spread enormously around Britain in the last 200 years.'],
      [('Species in genus', '2'), ('Wingspan', 'About 1–1.1 m'), ('IUCN status', 'Least Concern')],
      ['northern fulmar', 'fulmar', 'fulmarus', 'petrel', 'tubenose', 'seabird'],
      [sea(-70, 45, 40, 82), sea(-180, 45, -120, 72), sea(140, 40, 180, 72)]),
    S('uria-aalge', 'Uria aalge', 'Common murre', 'alcidae', 'The North Atlantic and North Pacific; nests on sea cliffs',
      ['Also called the common guillemot, a penguin-like auk that dives to over 100 m for fish. It nests packed tightly on narrow cliff ledges without any nest; its pear-shaped egg helps stop it rolling off. Chicks jump from the cliffs into the sea before they can fly, and are raised at sea by their fathers.'],
      [('Species in genus', '2'), ('Length', 'About 38–46 cm'), ('IUCN status', 'Least Concern')],
      ['common murre', 'common guillemot', 'guillemot', 'murre', 'uria', 'auk', 'seabird'],
      [sea(-70, 40, 35, 76), sea(-180, 35, -118, 70), sea(140, 38, 180, 66)]),
    S('alca-torda', 'Alca torda', 'Razorbill', 'alcidae', 'The North Atlantic; nests on sea cliffs',
      ['A black-and-white auk with a deep, blunt, white-striped bill. It is the closest living relative of the great auk, hunted to extinction in 1844. Razorbills can dive to over 100 m, using their wings to “fly” underwater.'],
      [('Species in genus', '1'), ('Length', 'About 37–39 cm'), ('IUCN status', 'Least Concern')],
      ['razorbill', 'alca', 'auk', 'great auk relative', 'seabird'],
      [sea(-75, 40, 35, 75)]),
    S('pelecanus-occidentalis', 'Pelecanus occidentalis', 'Brown pelican', 'pelecanidae', 'Coasts of the Americas from the USA to Chile and Brazil',
      ['The only pelican that dives for food, plunging head-first from up to 20 m into the sea and scooping fish into its throat pouch. DDT poisoning wiped it out from Louisiana, the “Pelican State”, by the 1960s; it recovered after DDT was banned.'],
      [('Species in genus', '8'), ('Wingspan', 'About 2–2.3 m'), ('IUCN status', 'Least Concern')],
      ['brown pelican', 'pelican', 'pelecanus', 'louisiana', 'ddt'],
      [sea(-125, 20, -110, 39), sea(-98, 18, -75, 31), sea(-90, 7, -60, 22), sea(-92, -19, -77, 7), sea(-62, -10, -34, 12)]),
    S('pelecanus-crispus', 'Pelecanus crispus', 'Dalmatian pelican', 'pelecanidae', 'Lakes and deltas from south-eastern Europe to Mongolia',
      ['One of the heaviest flying birds, up to about 13 kg, with curly feathers on its nape. Drainage of wetlands and persecution made it rare; Lake Prespa in Greece holds the largest colony in the world.'],
      [('Species in genus', '8'), ('Wingspan', 'About 2.7–3.2 m'), ('IUCN status', 'Near Threatened')],
      ['dalmatian pelican', 'pelican', 'pelecanus', 'lake prespa', 'greece'],
      [part('Greece', 20.5, 38.5, 26.5, 41.5), part('Albania', 19.3, 40.5, 20.5, 41.5), part('Romania', 28.5, 44.5, 29.8, 45.5), part('Bulgaria', 27, 43.5, 28, 44.2), part('Turkey', 26, 37, 44, 42), part('Russia', 44, 44, 50, 47.5), part('Kazakhstan', 50, 42, 82, 50), part('Mongolia', 88, 46, 100, 50), part('Iran', 47, 36.5, 54, 38), part('India', 68, 21, 74, 25)]),
    S('morus-bassanus', 'Morus bassanus', 'Northern gannet', 'sulidae', 'The North Atlantic; nests on islands and sea cliffs',
      ['The largest seabird of the North Atlantic, white with black wingtips and a yellow head, which dives into the sea from up to 30 m at about 100 km/h, folding its wings at the last moment. Air sacs under its skin cushion the impact. Bass Rock in Scotland, which gave it its scientific name, holds the largest colony in the world.'],
      [('Species in genus', '3'), ('Wingspan', 'About 1.7–1.8 m'), ('IUCN status', 'Least Concern')],
      ['northern gannet', 'gannet', 'morus', 'bass rock', 'seabird', 'diving'],
      [sea(-70, 40, -50, 52), sea(-30, 45, 15, 70), sea(-20, 30, -5, 45)]),
    S('nannopterum-harrisi', 'Nannopterum harrisi', 'Flightless cormorant', 'phalacrocoracidae', 'Coasts of Fernandina and Isabela, Galápagos Islands',
      ['The only cormorant that cannot fly, with tiny, ragged wings about a third of the length needed. With no land predators and rich feeding close to shore, its ancestors stopped flying; its strong legs make it a powerful diver. Fewer than about 2,000 survive.'],
      [('Species in genus', '3'), ('Length', 'About 90–100 cm'), ('IUCN status', 'Vulnerable')],
      ['flightless cormorant', 'galapagos cormorant', 'cormorant', 'nannopterum', 'phalacrocorax', 'galapagos'],
      [sea(-92, -1.2, -90.8, 0.3)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Before lead poisoning and shooting, condors ranged from British Columbia to Baja California.
    'gymnogyps-californianus': {'regions': [part(US, -124.5, 32.5, -114, 49), part('Mexico', -117, 28, -113, 32.7), part('Canada', -125, 48.5, -120, 50)]},
    'cygnus-olor': {'without': [5, 6]},
    'branta-canadensis': {'without': [3, 4, 5, 6, 7, 8]},
    'aix-galericulata': {'without': [3]},
    'hypotaenidia-owstoni': {'regions': [sea(144.6, 13.2, 145, 13.7)]},
    'grus-americana': {'regions': [part('Canada', -120, 49, -95, 62), part(US, -105, 37, -85, 49), part(US, -98, 26, -88, 31), part('Mexico', -106, 22, -97, 30)]},
    'botaurus-stellaris': {'add': [C('United Kingdom', 'Ireland')]},
    'geronticus-eremita': {'regions': [part('Morocco', -10, 29, -1, 35.5), part('Algeria', -1, 33, 8, 36.5), C('Syria', 'Iraq', 'Turkey', 'Saudi Arabia', 'Yemen', 'Egypt', 'Sudan', 'Ethiopia', 'Eritrea')]},
    'recurvirostra-avosetta': {'without': [0]},
    'bubulcus-ibis': {'regions': [C(*SUB_SAHARA, *SOUTH_ASIA, *SE_ASIA, 'Egypt', 'Morocco', 'Algeria', 'Portugal', 'Spain'), part('China', 98, 20, 125, 35), C('Japan', 'Philippines')]},
    'branta-sandvicensis': {'regions': [part(US, -160.5, 18.8, -154.8, 22.3)]},
}
HISTORIC = {**{sid: 'same' for sid in [
    'falco-tinnunculus', 'falco-rusticolus', 'caracara-plancus', 'phalcoboenus-australis', 'microhierax-caerulescens', 'cathartes-aura', 'sarcoramphus-papa',
    'bubo-virginianus', 'bubo-bubo', 'athene-cunicularia', 'micrathene-whitneyi', 'strix-nebulosa', 'strix-aluco', 'ketupa-blakistoni',
    'cygnus-atratus', 'anser-anser', 'aix-sponsa', 'somateria-mollissima', 'cairina-moschata', 'gallinula-chloropus', 'fulica-atra', 'atlantisia-rogersi',
    'antigone-canadensis', 'balearica-regulorum', 'ardea-alba', 'ardea-herodias', 'nycticorax-nycticorax', 'leptoptilos-crumenifer', 'jabiru-mycteria',
    'eudocimus-ruber', 'platalea-ajaja', 'phoeniconaias-minor', 'larus-argentatus', 'rissa-tridactyla', 'rynchops-niger', 'pagophila-eburnea',
    'scolopax-rusticola', 'calidris-canutus', 'calidris-pygmaea', 'calidris-pugnax', 'charadrius-vociferus', 'vanellus-vanellus', 'haematopus-ostralegus',
    'phoebastria-immutabilis', 'thalassarche-melanophris', 'fulmarus-glacialis', 'uria-aalge', 'alca-torda', 'pelecanus-occidentalis', 'pelecanus-crispus',
    'morus-bassanus', 'nannopterum-harrisi',
]}, **HISTORIC_CHANGED}

# Middle stages for big changes in the last 150 years (calendar years).
STAGES = {
    # The last wild condors were caught in 1987; releases began in 1992.
    'gymnogyps-californianus': [
        {'years': (1950, 1992), 'label': 'The last wild condors in southern California',
         'regions': [part(US, -120, 34, -118, 35.5)]},
    ],
    # Down to about 15 birds wintering in Texas in 1941.
    'grus-americana': [
        {'years': (1940, 1990), 'label': 'The last wild flock, about 15 birds in 1941',
         'regions': [part('Canada', -115, 59, -112, 61), part(US, -98, 27.5, -96, 29)]},
    ],
}
