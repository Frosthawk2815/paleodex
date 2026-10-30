# Living eagles, hawks, kites, harriers and Old World vultures (family Accipitridae), adding to the
# bald eagle in birds2.py. Ranges show roughly where each species breeds or lives year-round (with
# wintering areas for some migrants), as country outlines clipped by boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'United Kingdom', 'Ireland']
SUB_SAHARA = ['Senegal', 'Gambia', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Central African Rep.', 'Sudan', 'S. Sudan', 'Ethiopia', 'Eritrea', 'Somalia', 'Somaliland', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Dem. Rep. Congo', 'Congo', 'Gabon', 'Eq. Guinea', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'South Africa', 'eSwatini', 'Lesotho']
SAVANNA_AFRICA = [c for c in SUB_SAHARA if c not in ('Gabon', 'Congo', 'Eq. Guinea', 'Liberia', 'Sierra Leone')]
CENTRAL_AMERICA = ['Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama']
SOUTH_AMERICA_TROPICS = ['Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru', 'Brazil', 'Bolivia', 'Paraguay']
CENTRAL_ASIA = ['Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan', 'Turkmenistan', 'Afghanistan', 'Mongolia']

CLADES = []
UPGRADES = {}


def S(id, name, common, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': 'accipitridae', 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    # ---- Eagles ----
    S('aquila-chrysaetos', 'Aquila chrysaetos', 'Golden eagle', 'Mountains and open country across North America, Europe, Asia and North Africa',
      ['The most widespread large eagle, named for the golden feathers on the back of its head. It hunts hares, marmots, grouse and sometimes young deer, diving at well over 200 km/h. Kazakh and Mongolian eagle hunters still train golden eagles to catch foxes.',
       'It is a national bird of Mexico, Germany, Albania, Kazakhstan and several other countries.'],
      [('Species in genus', 'About 11'), ('Wingspan', 'About 1.8–2.3 m'), ('IUCN status', 'Least Concern')],
      ['golden eagle', 'eagle', 'aquila', 'raptor', 'eagle hunter', 'berkutchi'],
      [part('United States of America', -125, 30, -100, 49), part('United States of America', -170, 55, -140, 70), part('Canada', -141, 49, -60, 70), part('Mexico', -117, 20, -100, 32.7),
       C('Norway', 'Sweden', 'Finland', 'Spain', 'Portugal', 'Turkey', 'Iran', *CENTRAL_ASIA), part('United Kingdom', -7.5, 55.5, -2, 58.7), part('France', -1.5, 42.3, 7.7, 46),
       part('Italy', 7, 37, 16.5, 47), part('Switzerland', 6, 45.8, 10.5, 47), part('Austria', 9.5, 46.4, 15, 47.7), C('Greece', 'Albania', 'North Macedonia', 'Bulgaria'),
       part('Russia', 30, 45, 180, 72), part('China', 75, 28, 125, 50), part('Morocco', -9, 29, -2, 35), part('Algeria', -2, 33, 8, 36.5), part('Saudi Arabia', 36, 18, 45, 30)]),
    S('aquila-audax', 'Aquila audax', 'Wedge-tailed eagle', 'All of mainland Australia, Tasmania and southern New Guinea',
      ['Australia’s largest bird of prey, with a long, diamond-shaped tail and a wingspan that can reach about 2.3 m. It soars for hours over the outback, hunting rabbits, wallabies and lizards and eating roadkill. Pairs sometimes hunt kangaroos together.',
       'It was once shot and poisoned in huge numbers by farmers, but is now protected.'],
      [('Species in genus', 'About 11'), ('Wingspan', 'About 1.8–2.3 m'), ('IUCN status', 'Least Concern')],
      ['wedge-tailed eagle', 'wedgie', 'bunjil', 'eagle', 'aquila', 'raptor', 'australia'],
      [C('Australia'), part('Papua New Guinea', 141, -10, 148, -7)]),
    S('harpia-harpyja', 'Harpia harpyja', 'Harpy eagle', 'Lowland rainforests from southern Mexico to northern Argentina',
      ['One of the most powerful eagles, with a double crest and rear talons up to about 13 cm long, longer than a grizzly bear’s claws. Females, much bigger than males, weigh up to about 9 kg. It hunts sloths and monkeys in the forest canopy, snatching them from branches.',
       'A pair raises one chick every two to three years, so it is hit hard by hunting and forest clearing.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.8–2 m'), ('IUCN status', 'Vulnerable')],
      ['harpy eagle', 'eagle', 'harpia', 'raptor', 'rainforest', 'amazon', 'sloth'],
      [part('Mexico', -95, 14.5, -87, 19), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, exclude=['El Salvador']), part('Argentina', -56, -27.5, -53.6, -25.5)]),
    S('pithecophaga-jefferyi', 'Pithecophaga jefferyi', 'Philippine eagle', 'Rainforests of Mindanao, Luzon, Samar and Leyte, Philippines',
      ['One of the largest and rarest eagles, about 1 m long, with a shaggy crest and a huge, arched blue-grey bill. Once called the monkey-eating eagle, it mostly hunts flying lemurs (colugos), civets and other forest animals. It is the national bird of the Philippines.',
       'Only about 400 pairs survive, threatened by logging and hunting; killing one is punished with prison.'],
      [('Species in genus', '1'), ('Length', 'About 0.9–1 m'), ('IUCN status', 'Critically Endangered')],
      ['philippine eagle', 'monkey-eating eagle', 'haribon', 'eagle', 'pithecophaga', 'philippines'],
      [part('Philippines', 121, 14.5, 122.5, 18.5), part('Philippines', 124.5, 10, 126, 12.6), part('Philippines', 122, 5.5, 126.6, 10)]),
    S('haliaeetus-pelagicus', 'Haliaeetus pelagicus', 'Steller’s sea eagle', 'Coasts of the Sea of Okhotsk and Kamchatka; winters south to Hokkaido and Korea',
      ['The heaviest eagle in the world, up to about 9 kg, dark brown with white shoulders and tail and an enormous yellow bill. It catches salmon and other big fish; in winter, hundreds gather on the sea ice off Hokkaido.',
       'It is named after the naturalist Georg Steller, who also described Steller’s sea cow.'],
      [('Species in genus', '10'), ('Wingspan', 'About 1.9–2.5 m'), ('IUCN status', 'Vulnerable')],
      ['stellers sea eagle', 'sea eagle', 'eagle', 'haliaeetus', 'kamchatka', 'hokkaido'],
      [part('Russia', 135, 50, 165, 63), part('Japan', 141, 41.3, 146, 45.6), part('South Korea', 126, 34, 130, 38.5)]),
    S('stephanoaetus-coronatus', 'Stephanoaetus coronatus', 'Crowned eagle', 'Forests of central, eastern and southern Africa',
      ['A powerful forest eagle that hunts monkeys and small antelope, killing prey several times its own weight. Damage to the skull of the Taung Child, a 2.8-million-year-old Australopithecus, matches crowned eagle talon marks, suggesting early human relatives were sometimes its prey.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.5–1.8 m'), ('IUCN status', 'Near Threatened')],
      ['crowned eagle', 'african crowned eagle', 'eagle', 'stephanoaetus', 'taung child', 'africa'],
      [C('Cameroon', 'Gabon', 'Congo', 'Eq. Guinea', 'Central African Rep.', 'Dem. Rep. Congo', 'Uganda', 'Rwanda', 'Burundi', 'Kenya', 'Tanzania', 'Malawi', 'Zambia'), part('Ethiopia', 34, 5, 40, 10), part('Mozambique', 31, -26, 41, -11), part('Zimbabwe', 31, -22, 33.2, -16), part('South Africa', 28, -34, 33, -23), part('Angola', 12, -12, 22, -5), part("Côte d'Ivoire", -8.5, 4.5, -2.5, 8), part('Ghana', -3, 4.5, 1, 8), part('Liberia', -11.5, 4.3, -7.4, 8.5), part('Sierra Leone', -13.3, 6.9, -10.3, 10)]),
    S('polemaetus-bellicosus', 'Polemaetus bellicosus', 'Martial eagle', 'Savannas and open woodland of sub-Saharan Africa',
      ['Africa’s largest eagle, with eyesight good enough to spot prey several kilometres away. It hunts guineafowl, hyraxes, monitor lizards and small antelope from a high soar.',
       'Poisoning, power lines and persecution by farmers have caused steep declines, and it was listed as endangered in 2020.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.9–2.6 m'), ('IUCN status', 'Endangered')],
      ['martial eagle', 'eagle', 'polemaetus', 'africa', 'savanna'],
      [C(*SAVANNA_AFRICA)]),
    S('terathopius-ecaudatus', 'Terathopius ecaudatus', 'Bateleur', 'Savannas of sub-Saharan Africa',
      ['A snake eagle with a bright red face and legs and a tail so short it looks tailless in flight. It spends most of the day gliding low over the savanna, tilting from side to side like a tightrope walker, which gives it its French name. It eats snakes, small mammals and carrion.',
       'It has declined sharply because of poisoned carcasses and was listed as endangered in 2020.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.7–1.8 m'), ('IUCN status', 'Endangered')],
      ['bateleur', 'bateleur eagle', 'snake eagle', 'terathopius', 'africa', 'savanna'],
      [C(*SAVANNA_AFRICA, exclude=['Lesotho', 'Somaliland']), part('Saudi Arabia', 41, 16, 44, 20)]),
    S('circaetus-gallicus', 'Circaetus gallicus', 'Short-toed snake eagle', 'Southern Europe, North Africa and western and central Asia; winters in the Sahel and India',
      ['A large, pale eagle with owl-like yellow eyes that lives almost entirely on snakes, which it catches after hovering and swallows whole, head first. It feeds its chick by letting it pull a snake out of its throat. Thick scales on its legs help protect it from bites.'],
      [('Species in genus', '6'), ('Wingspan', 'About 1.7–1.9 m'), ('IUCN status', 'Least Concern')],
      ['short-toed snake eagle', 'short-toed eagle', 'snake eagle', 'circaetus', 'europe'],
      [C('Spain', 'Portugal', 'Italy', 'Greece', 'Albania', 'North Macedonia', 'Bulgaria', 'Serbia', 'Croatia', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran'), part('France', -2, 42.3, 7.7, 48), part('Russia', 35, 45, 60, 55), part('Kazakhstan', 50, 40, 85, 50), part('Morocco', -9, 30, -2, 35.5), part('Algeria', -2, 33, 8, 36.5), part('India', 70, 15, 88, 30)]),

    # ---- Hawks, buzzards and goshawks ----
    S('buteo-jamaicensis', 'Buteo jamaicensis', 'Red-tailed hawk', 'North and Central America and the Caribbean',
      ['The commonest large hawk in North America, often seen perched on roadside poles watching for rodents. Its rasping scream is used in films and TV for almost every bird of prey, including bald eagles, whose real calls are thin and twittering.',
       'A red-tailed hawk known as Pale Male nested on a Fifth Avenue apartment building in New York for over 20 years. Buteo has about 30 species, the buzzards and buteo hawks.'],
      [('Species in genus', 'About 30'), ('Wingspan', 'About 1.1–1.4 m'), ('IUCN status', 'Least Concern')],
      ['red-tailed hawk', 'redtail', 'hawk', 'buteo', 'buzzard', 'north america'],
      [part('Canada', -141, 42, -55, 64), C('United States of America', 'Mexico', *CENTRAL_AMERICA, latMax=70), C('Cuba', 'Jamaica', 'Haiti', 'Dominican Rep.', 'Puerto Rico')]),
    S('astur-gentilis', 'Astur gentilis', 'Eurasian goshawk', 'Forests of Europe, northern Asia and north-western Africa',
      ['A powerful forest hawk with short, broad wings and a long tail for twisting between trees at speed to catch pigeons, crows, grouse and squirrels. Females are much larger than males. It has long been flown in falconry.',
       'In 2023 the American goshawk was split off as a separate species, and in 2024 DNA showed goshawks belong in their own genus, Astur, not Accipiter.'],
      [('Species in genus', 'About 10'), ('Wingspan', 'About 0.9–1.2 m'), ('IUCN status', 'Least Concern')],
      ['goshawk', 'northern goshawk', 'eurasian goshawk', 'astur', 'accipiter', 'hawk', 'falconry'],
      [C(*EUROPE, 'Turkey', 'Georgia'), part('Russia', 28, 45, 180, 70), part('China', 80, 25, 135, 53), C('Mongolia', 'North Korea', 'South Korea'), part('Japan', 130, 31, 146, 45.6), part('Morocco', -9, 31, -2, 35.5)]),
    S('accipiter-nisus', 'Accipiter nisus', 'Eurasian sparrowhawk', 'Woodland, farmland and towns across Europe and Asia; winters south to Africa and India',
      ['A small, fast hawk that ambushes songbirds, often dashing through gardens and along hedges to surprise birds at feeders. Females are almost twice the weight of males and take larger prey, such as pigeons.',
       'Like many birds of prey, it nearly vanished from farmland in the 1960s because of pesticides, and recovered once they were banned.'],
      [('Species in genus', 'About 45'), ('Wingspan', 'About 0.6–0.8 m'), ('IUCN status', 'Least Concern')],
      ['sparrowhawk', 'eurasian sparrowhawk', 'accipiter', 'hawk', 'garden bird', 'europe'],
      [C(*EUROPE, 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', *CENTRAL_ASIA), part('Russia', 28, 45, 165, 68), part('China', 75, 22, 135, 53), C('North Korea', 'South Korea', 'Japan'), part('Morocco', -9, 30, -1, 36), part('Algeria', -2, 33, 8, 36.5), part('India', 70, 8, 90, 34)]),

    # ---- Kites ----
    S('milvus-milvus', 'Milvus milvus', 'Red kite', 'Western and central Europe, especially Germany, France, Spain and Britain',
      ['A graceful, reddish raptor with a deeply forked tail that it twists to steer as it drifts over the countryside looking for carrion and small animals. In medieval London kites scavenged in the streets and were protected.',
       'Persecution wiped it out from England and Scotland, leaving a handful of pairs in Wales. Reintroductions from 1989 brought it back, and Britain now has over 6,000 pairs, one of Europe’s greatest bird conservation successes.'],
      [('Species in genus', '2'), ('Wingspan', 'About 1.5–1.8 m'), ('IUCN status', 'Least Concern')],
      ['red kite', 'kite', 'milvus', 'reintroduction', 'wales', 'britain', 'europe'],
      [C('Spain', 'Portugal', 'France', 'Germany', 'Switzerland', 'Belgium', 'Luxembourg', 'Denmark', 'Czechia', 'Poland', 'Austria'), part('United Kingdom', -5.5, 50, 1.8, 57.7), part('Sweden', 12.5, 55, 15, 57), part('Italy', 9, 37, 17, 43), part('Morocco', -9, 31, -2, 35.5)]),
    S('rostrhamus-sociabilis', 'Rostrhamus sociabilis', 'Snail kite', 'Marshes from Florida and Mexico through Central and South America to Argentina',
      ['A kite that eats almost nothing but freshwater apple snails, pulling them from their shells with its slender, deeply hooked bill. It lives in flocks over marshes; the small population in the Florida Everglades is endangered there because of drained wetlands.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1–1.2 m'), ('IUCN status', 'Least Concern')],
      ['snail kite', 'everglade kite', 'kite', 'rostrhamus', 'everglades', 'florida'],
      [part('United States of America', -82.5, 25, -80, 28.5), part('Mexico', -98, 15, -87, 22.5), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS, 'Uruguay', 'Cuba'), part('Argentina', -66, -37, -57, -22)]),
    S('elanoides-forficatus', 'Elanoides forficatus', 'Swallow-tailed kite', 'South-eastern USA to Argentina; North American birds winter in South America',
      ['A strikingly elegant black-and-white kite with a long, deeply forked tail, which it twists constantly as it swoops over treetops catching flying insects, lizards and frogs, eating them in flight. It even drinks by skimming water like a swallow.',
       'North American birds migrate to South America each winter.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.2–1.4 m'), ('IUCN status', 'Least Concern')],
      ['swallow-tailed kite', 'kite', 'elanoides', 'florida', 'migration'],
      [part('United States of America', -95, 25, -77, 34), part('Mexico', -98, 15, -87, 22), C(*CENTRAL_AMERICA, *SOUTH_AMERICA_TROPICS), part('Argentina', -60, -28, -53.6, -22)]),
    S('elanus-caeruleus', 'Elanus caeruleus', 'Black-winged kite', 'Africa, southern Iberia and southern Asia',
      ['A small, pale grey kite with black shoulders and red eyes that hovers like a kestrel over grassland, dropping onto mice and voles. It has spread through Spain and Portugal and into France in recent decades.'],
      [('Species in genus', '4'), ('Wingspan', 'About 0.8–0.9 m'), ('IUCN status', 'Least Concern')],
      ['black-winged kite', 'black-shouldered kite', 'kite', 'elanus', 'africa', 'spain'],
      [C(*SUB_SAHARA, exclude=['Gabon', 'Congo', 'Eq. Guinea']), part('Egypt', 29, 24, 33, 31.5), part('Morocco', -10, 29, -1, 36), C('Portugal'), part('Spain', -7.5, 36, 0, 42), part('France', -1.8, 42.5, 1.5, 44.8),
       C('India', 'Sri Lanka', 'Nepal', 'Bangladesh', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia', 'Philippines'), part('Pakistan', 67, 24, 75, 33), part('China', 98, 21, 120, 27), part('Indonesia', 95, -9, 120, 6)]),

    # ---- Harriers ----
    S('circus-aeruginosus', 'Circus aeruginosus', 'Western marsh harrier', 'Reedbeds across Europe and western and central Asia; winters in Africa and South Asia',
      ['A long-winged, long-tailed raptor that glides low over reedbeds with its wings raised in a shallow V, dropping onto frogs, small birds and mammals. Like owls, harriers have a ring of stiff feathers round the face that funnels sound to their ears.',
       'In Britain it fell to a single breeding pair in 1971, then recovered to several hundred pairs after pesticides were banned and reedbeds protected.'],
      [('Species in genus', 'About 16'), ('Wingspan', 'About 1.1–1.4 m'), ('IUCN status', 'Least Concern')],
      ['marsh harrier', 'western marsh harrier', 'harrier', 'circus', 'reedbed', 'europe'],
      [C(*EUROPE, 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', exclude=['Norway', 'Ireland']), part('United Kingdom', -3.5, 50.5, 1.8, 55), part('Sweden', 11, 55, 20, 61), part('Finland', 21, 60, 30, 64), part('Russia', 28, 45, 95, 60), part('Kazakhstan', 50, 40, 85, 55), part('Morocco', -9, 30, -1, 36), part('Algeria', -2, 33, 8, 36.5)]),

    # ---- Old World vultures ----
    S('gypaetus-barbatus', 'Gypaetus barbatus', 'Bearded vulture', 'High mountains of southern Europe, Africa, the Middle East, Central Asia and the Himalayas',
      ['Also called the lammergeier, the only animal that lives mainly on bone, which makes up most of its diet. It drops large bones from a height onto rocks to smash them, then swallows the pieces; strong stomach acid dissolves them. Its orange chest comes from rubbing its feathers in iron-rich mud.',
       'It was wiped out in the Alps by about 1913; captive-bred birds released from 1986 now breed there again.'],
      [('Species in genus', '1'), ('Wingspan', 'About 2.3–2.8 m'), ('IUCN status', 'Near Threatened')],
      ['bearded vulture', 'lammergeier', 'ossifrage', 'vulture', 'gypaetus', 'bone eater', 'alps', 'himalaya'],
      [part('Spain', -2, 42, 3.5, 43.2), part('France', -1.5, 42.3, 3, 43.2), part('France', 5.5, 44, 7.7, 46.3), part('Switzerland', 6.8, 45.8, 10.5, 46.9), part('Italy', 6.5, 45.8, 12.5, 46.9), part('Austria', 10, 46.7, 13.5, 47.4), part('France', 8.5, 41.5, 9.6, 43), part('Greece', 23.5, 34.9, 26.3, 35.6),
       C('Georgia', 'Armenia', 'Azerbaijan', *CENTRAL_ASIA, 'Nepal', 'Bhutan', exclude=['Turkmenistan', 'Uzbekistan']), part('Turkey', 30, 37, 44.5, 41), part('Iran', 45, 30, 60, 38), part('Pakistan', 70, 30, 77, 37), part('India', 74, 28, 80, 36), part('China', 73, 27, 105, 40),
       part('Ethiopia', 36, 6, 41, 15), part('Kenya', 35, -1, 38, 1.5), part('Tanzania', 35, -4, 38, -2.5), part('South Africa', 27, -31.5, 30, -28), C('Lesotho'), part('Morocco', -8.5, 30.5, -4, 33), part('Saudi Arabia', 41, 16, 44, 21), part('Yemen', 43, 13, 46, 16)]),
    S('neophron-percnopterus', 'Neophron percnopterus', 'Egyptian vulture', 'Southern Europe, Africa, the Middle East and South and Central Asia',
      ['A small white vulture with a yellow face, one of the few birds that uses tools: it throws stones at ostrich eggs to crack them open. It also eats carrion, dung and rubbish. It was sacred in ancient Egypt and is the hieroglyph for the letter “a”.',
       'Poisoning, electrocution on power lines and the loss of livestock carcasses have caused steep declines; it is endangered.'],
      [('Species in genus', '1'), ('Wingspan', 'About 1.5–1.8 m'), ('IUCN status', 'Endangered')],
      ['egyptian vulture', 'pharaoh’s chicken', 'vulture', 'neophron', 'tool use', 'africa', 'india'],
      [C('Spain', 'Portugal', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', 'Afghanistan', 'Pakistan', 'India', 'Nepal', 'Oman', 'Yemen', 'Ethiopia', 'Eritrea', 'Somalia', 'Somaliland', 'Djibouti', 'Kenya', 'Tanzania', 'Sudan', 'Chad', 'Niger', 'Mali', 'Mauritania', 'Morocco', 'Algeria'),
       part('France', -1.5, 42.3, 6, 45), part('Italy', 12, 37, 18, 42), C('Greece', 'Bulgaria', 'North Macedonia', 'Albania'), part('Saudi Arabia', 36, 16, 50, 30), part('Kazakhstan', 50, 40, 75, 48), part('Uzbekistan', 56, 37, 73, 45), part('Turkmenistan', 52, 35, 66, 42), part('Egypt', 25, 22, 35, 31)]),
    S('gyps-rueppelli', 'Gyps rueppelli', 'Rüppell’s vulture', 'Savannas of the Sahel and East Africa',
      ['A large griffon vulture that holds the record for the highest-flying bird: in 1973 one hit an aircraft at about 11,300 m over Côte d’Ivoire. Special haemoglobin in its blood takes up oxygen even in very thin air. Flocks gather in huge numbers at carcasses, following other vultures down.',
       'Its numbers have crashed, mainly because of poisoned carcasses and the trade in vulture parts for traditional medicine.'],
      [('Species in genus', '8'), ('Wingspan', 'About 2.2–2.6 m'), ('IUCN status', 'Critically Endangered')],
      ['ruppells vulture', 'rüppell’s griffon', 'vulture', 'gyps', 'highest flying bird', 'africa'],
      [C('Senegal', 'Gambia', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Sudan', 'S. Sudan', 'Ethiopia', 'Eritrea', 'Kenya', 'Tanzania', 'Uganda', latMax=17), part('Nigeria', 3, 10, 14.5, 14), part('Cameroon', 12, 8, 16, 13), part('Guinea', -14, 10, -8, 12.6)]),
    S('gyps-bengalensis', 'Gyps bengalensis', 'White-rumped vulture', 'South and South-east Asia',
      ['Once perhaps the most common large bird of prey in the world, with tens of millions in India alone, cleaning up cattle carcasses. In the 1990s and 2000s its numbers fell by more than 99%: vultures were poisoned by diclofenac, a painkiller given to cattle, which causes kidney failure in birds that eat treated carcasses.',
       'Without vultures, rotting carcasses and feral dogs increased, and rabies cases rose. Diclofenac was banned for veterinary use in India, Nepal and Pakistan in 2006, and vultures are being bred in captivity for release.'],
      [('Species in genus', '8'), ('Wingspan', 'About 1.9–2.6 m'), ('IUCN status', 'Critically Endangered')],
      ['white-rumped vulture', 'indian white-backed vulture', 'vulture', 'gyps', 'diclofenac', 'india'],
      [C('India', 'Nepal', 'Bangladesh', 'Myanmar', 'Cambodia', 'Laos'), part('Pakistan', 67, 24, 75, 34), part('Bhutan', 89, 26.7, 92, 27.5)]),
    S('aegypius-monachus', 'Aegypius monachus', 'Cinereous vulture', 'Mountains and steppes from Spain to Mongolia and China',
      ['Also called the Eurasian black vulture, one of the largest flying birds, with a wingspan of up to about 3 m. Its strong bill tears the toughest hide and sinew at carcasses, where other vultures give way to it.',
       'It has recovered in Spain thanks to protection and feeding stations, and has been reintroduced to France.'],
      [('Species in genus', '1'), ('Wingspan', 'About 2.5–3 m'), ('IUCN status', 'Near Threatened')],
      ['cinereous vulture', 'black vulture', 'monk vulture', 'vulture', 'aegypius', 'spain', 'mongolia'],
      [part('Spain', -7.5, 37, 0, 42.5), part('Portugal', -8, 38, -6.2, 41.5), part('France', 3, 43.5, 6.5, 44.5), part('Greece', 25.5, 40.7, 26.5, 41.5), C('Georgia', 'Armenia', 'Azerbaijan', 'Mongolia', 'Kyrgyzstan', 'Tajikistan'), part('Turkey', 30, 37, 44.5, 41.5), part('Iran', 45, 30, 62, 38), part('Kazakhstan', 60, 42, 87, 50), part('Russia', 85, 48, 110, 53), part('China', 75, 32, 120, 46)]),
    S('pernis-apivorus', 'Pernis apivorus', 'European honey buzzard', 'Forests of Europe and western Asia; winters in tropical Africa',
      ['A buzzard-like raptor that specialises in raiding the nests of wasps and bees, digging them out with its feet to eat the larvae and honeycomb. Small, stiff, scale-like feathers on its face protect it from stings.',
       'It migrates to tropical Africa each autumn, with thousands crossing at narrow sea crossings such as Gibraltar and the Bosphorus.'],
      [('Species in genus', '3'), ('Wingspan', 'About 1.3–1.5 m'), ('IUCN status', 'Least Concern')],
      ['honey buzzard', 'european honey buzzard', 'pernis', 'wasp nest', 'migration', 'europe'],
      [C(*EUROPE, 'Turkey', 'Georgia', exclude=['Ireland', 'Portugal']), part('United Kingdom', -3.5, 50.5, 1.8, 57.5), part('Russia', 28, 45, 90, 62), part('Kazakhstan', 50, 45, 85, 54),
       C('Cameroon', 'Gabon', 'Congo', 'Dem. Rep. Congo', 'Central African Rep.', 'Ghana', "Côte d'Ivoire", 'Liberia', 'Sierra Leone', 'Guinea', 'Nigeria', 'Uganda', 'Angola', 'Zambia')]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Across most of Britain until persecution in the 1800s.
    'milvus-milvus': {'add': [C('United Kingdom', 'Ireland', 'Netherlands')]},
    # Found across the Alps and other European mountains before being shot and poisoned out.
    'gypaetus-barbatus': {'add': [part('Austria', 9.5, 46.4, 16, 47.8), part('Germany', 10, 47.3, 13, 47.8), part('Italy', 8, 37, 17, 45), part('Romania', 22, 45, 26.5, 47.5), C('Bulgaria', 'Serbia', 'Bosnia and Herz.', 'Albania', 'North Macedonia', 'Greece')]},
    # Spread into Portugal, Spain (from the 1970s) and France only recently.
    'elanus-caeruleus': {'without': [3, 4, 5]},
    # Cinereous vultures bred across much of southern Europe before the 1900s.
    'aegypius-monachus': {'add': [part('France', -1.5, 42.3, 7.7, 46), part('Italy', 8, 37, 17, 45), C('Bulgaria', 'Serbia', 'North Macedonia', 'Albania', 'Greece', 'Romania', 'Ukraine')]},
    # Once found over much of Britain, before drainage and persecution.
    'circus-aeruginosus': {'add': [C('Ireland')]},
}
HISTORIC = {**{sid: 'same' for sid in [
    'aquila-chrysaetos', 'aquila-audax', 'harpia-harpyja', 'pithecophaga-jefferyi', 'haliaeetus-pelagicus', 'stephanoaetus-coronatus', 'polemaetus-bellicosus',
    'terathopius-ecaudatus', 'circaetus-gallicus', 'buteo-jamaicensis', 'astur-gentilis', 'accipiter-nisus', 'rostrhamus-sociabilis', 'elanoides-forficatus',
    'neophron-percnopterus', 'gyps-rueppelli', 'gyps-bengalensis', 'pernis-apivorus',
]}, **HISTORIC_CHANGED}
