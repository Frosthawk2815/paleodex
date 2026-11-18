# Living pangolins (order Pholidota): all eight recognised species, four in Asia and four in Africa.
# Pangolins are the closest living relatives of the carnivorans (cats, dogs, bears and seals), the
# two together forming Ferae. Ranges are country outlines clipped by boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


CLADES = [
    {'id': 'ferae', 'name': 'Ferae', 'common': 'Carnivorans and pangolins', 'parent': 'eutheria',
     'description': 'The carnivorans (cats, dogs, bears, seals and their relatives) and the pangolins. Despite their very different lives, DNA shows they are each other’s closest living relatives.'},
    {'id': 'pholidota', 'name': 'Pholidota', 'common': 'Pangolins', 'parent': 'ferae',
     'description': 'Scaly, toothless mammals that eat ants and termites. Their closest relatives are the carnivorans; their likeness to anteaters and armadillos is convergent. Fossil pangolins such as Eomanis are known from the Eocene of Europe.'},
    {'id': 'manidae', 'name': 'Manidae', 'common': 'Pangolins', 'parent': 'pholidota', 'family': True,
     'description': 'The eight living pangolins, four in Asia and four in Africa, the most trafficked wild mammals in the world. More species have been proposed from DNA in seized scales.'},
    {'id': 'maninae', 'name': 'Maninae', 'common': 'Asian pangolins', 'parent': 'manidae',
     'description': 'The four Asian pangolins: Chinese, Sunda, Philippine and Indian.'},
    {'id': 'smutsiinae', 'name': 'Smutsiinae', 'common': 'Ground pangolins', 'parent': 'manidae',
     'description': 'The giant pangolin and Temminck’s ground pangolin of Africa, large pangolins that walk on their hind legs.'},
    {'id': 'phatagininae', 'name': 'Phatagininae', 'common': 'Tree pangolins', 'parent': 'manidae',
     'description': 'The white-bellied and black-bellied pangolins of African rainforests, small climbers with long, grasping tails.'},
]

# The carnivorans join the pangolins in Ferae.
CLADE_PARENTS = {'carnivora': 'ferae'}

UPGRADES = {}

# Historic ranges (about 1,000 to 150 years ago): much as today, except the Chinese pangolin, which
# was once found across much more of southern and central China.
HISTORIC = {
    'manis-pentadactyla': {'add': [part('China', 103, 22, 122, 34)]},
    **{g: 'same' for g in ['manis-javanica', 'manis-culionensis', 'manis-crassicaudata', 'smutsia-gigantea', 'smutsia-temminckii', 'phataginus-tricuspis', 'phataginus-tetradactyla']},
}

WEST_AFRICA_FOREST = ['Sierra Leone', 'Liberia', "Côte d'Ivoire", 'Ghana']
CENTRAL_AFRICA_FOREST = ['Cameroon', 'Eq. Guinea', 'Gabon', 'Congo']


def G(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    G('manis-pentadactyla', 'Manis pentadactyla', 'Chinese pangolin', 'maninae', 'Forests and farmland of southern China, Taiwan, the eastern Himalayas and northern South-East Asia',
      ['A pangolin about the size of a house cat, covered in overlapping scales of keratin, the same material as fingernails. It has no teeth: it digs into ant and termite nests with strong front claws and laps up the insects with a sticky tongue longer than its body, which is anchored near its hips.',
       'It digs deep burrows and curls into a tight, armoured ball when threatened. Hunting for its meat and for its scales, used in traditional medicine, has wiped it out from much of China; it is critically endangered and protected, and all international trade in pangolins has been banned since 2017.'],
      [('Species in genus', '4 (more proposed)'), ('Length', 'About 40–58 cm, plus tail 25–38 cm'), ('Weight', 'About 2–7 kg'), ('IUCN status', 'Critically Endangered')],
      ['chinese pangolin', 'pangolin', 'scaly anteater', 'manis', 'pholidota', 'scales', 'wildlife trade', 'china', 'taiwan'],
      [part('China', 97, 18, 122, 32), C('Taiwan', 'Nepal', 'Bhutan'), part('India', 85, 25, 97, 29.5), part('Myanmar', 92, 20, 101, 28.5),
       part('Vietnam', 102, 18, 108, 23.5), part('Laos', 100, 17.5, 107.5, 22.5), part('Thailand', 97.5, 17, 101, 20.5)]),
    G('manis-javanica', 'Manis javanica', 'Sunda pangolin', 'maninae', 'Forests, plantations and gardens of South-East Asia, from Myanmar to Java and Borneo',
      ['A climbing pangolin that sleeps in tree hollows as well as burrows, holding on with its prehensile tail. It can live in plantations and even gardens, so long as it is not hunted.',
       'It has been the pangolin most seized in the illegal trade, with tonnes of its scales confiscated in single shipments, and it is critically endangered.'],
      [('Species in genus', '4 (more proposed)'), ('Length', 'About 40–65 cm, plus tail 35–56 cm'), ('Weight', 'About 4–10 kg'), ('IUCN status', 'Critically Endangered')],
      ['sunda pangolin', 'malayan pangolin', 'javan pangolin', 'pangolin', 'manis', 'borneo', 'sumatra', 'java', 'malaysia', 'wildlife trade'],
      [C('Cambodia', 'Malaysia', 'Brunei', 'Singapore'), part('Thailand', 97, 5.5, 106, 19), part('Vietnam', 104, 8.5, 109.5, 18), part('Laos', 100, 13.5, 107.7, 18.5),
       part('Myanmar', 97.5, 10, 100, 17), part('Indonesia', 95, -8.8, 119, 6)]),
    G('manis-culionensis', 'Manis culionensis', 'Philippine pangolin', 'maninae', 'Palawan and nearby islands, the Philippines',
      ['Found only on Palawan and a few small islands nearby, where it is known locally as balintong. It was long treated as part of the Sunda pangolin and recognised as its own species in 2005.',
       'Hunting and trafficking have pushed it to critically endangered.'],
      [('Species in genus', '4 (more proposed)'), ('Weight', 'About 2–7 kg'), ('IUCN status', 'Critically Endangered')],
      ['philippine pangolin', 'palawan pangolin', 'balintong', 'pangolin', 'manis', 'palawan', 'philippines'],
      [part('Philippines', 117, 8, 120.5, 12.5)]),
    G('manis-crassicaudata', 'Manis crassicaudata', 'Indian pangolin', 'maninae', 'Grassland, scrub and forest of India, Sri Lanka, Pakistan, Nepal and Bangladesh',
      ['The largest Asian pangolin, with a thick tail and big scales. It lives mainly on the ground, digging burrows, and can tear open hard termite mounds with its long front claws.',
       'Like the other pangolins it is hunted for its meat and scales, and is endangered.'],
      [('Species in genus', '4 (more proposed)'), ('Length', 'About 45–75 cm, plus tail 33–47 cm'), ('Weight', 'About 10–16 kg'), ('IUCN status', 'Endangered')],
      ['indian pangolin', 'thick-tailed pangolin', 'pangolin', 'manis', 'india', 'sri lanka', 'pakistan'],
      [part('India', 68, 8, 92, 30), C('Sri Lanka'), part('Pakistan', 66, 24, 75, 34), part('Bangladesh', 88, 21, 92.7, 26.6), part('Nepal', 80, 26.3, 88.2, 28)]),
    G('smutsia-gigantea', 'Smutsia gigantea', 'Giant pangolin', 'smutsiinae', 'Rainforest and forest edges of West and Central Africa',
      ['The biggest pangolin, as long as a person is tall from nose to tail tip. It walks on its hind legs with its front claws tucked under, and can dig through hard termite mounds; it is thought to play a part in keeping termite numbers in check.',
       'It is rarely seen, mostly at night. Hunting and the trade in its scales have made it endangered.'],
      [('Species in genus', '2'), ('Length', 'About 140–180 cm including tail'), ('Weight', 'Up to about 33 kg'), ('IUCN status', 'Endangered')],
      ['giant pangolin', 'pangolin', 'smutsia', 'africa', 'rainforest', 'wildlife trade'],
      [C(*WEST_AFRICA_FOREST, *CENTRAL_AFRICA_FOREST, 'Uganda'), part('Guinea', -15, 7.2, -8, 10.5), part('Nigeria', 2.7, 4, 9.5, 8),
       part('Dem. Rep. Congo', 12, -5, 31, 5), part('Central African Rep.', 15, 2, 27, 6)]),
    G('smutsia-temminckii', 'Smutsia temminckii', 'Temminck’s ground pangolin', 'smutsiinae', 'Savannas and woodlands of eastern and southern Africa',
      ['The only pangolin of southern Africa, living in dry savanna and woodland. It walks upright on its hind legs, balancing with its tail, and sniffs out ant and termite nests.',
       'It is vulnerable: it is hunted and trafficked, and many are killed on electric fences.'],
      [('Species in genus', '2'), ('Length', 'About 70–140 cm including tail'), ('Weight', 'About 5–18 kg'), ('IUCN status', 'Vulnerable')],
      ['temmincks ground pangolin', 'ground pangolin', 'cape pangolin', 'pangolin', 'smutsia', 'savanna', 'southern africa', 'kruger'],
      [C('Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique', 'Tanzania', 'Kenya', 'Uganda', 'Angola', 'S. Sudan'), part('South Africa', 22, -29, 32.9, -22),
       part('Namibia', 13, -24, 25.5, -17), part('Chad', 15, 8, 24, 12), part('Central African Rep.', 15, 6, 27, 11), part('Sudan', 22, 9, 34, 13), part('Ethiopia', 33, 4, 38, 11)]),
    G('phataginus-tricuspis', 'Phataginus tricuspis', 'White-bellied pangolin', 'phatagininae', 'Rainforests of West and Central Africa',
      ['Also called the tree pangolin, a small, agile climber with a long prehensile tail and scales with three points. It feeds mostly on tree-living ants and termites, and is the African pangolin most often found in bushmeat markets.',
       'Hunting and trafficking have made it endangered.'],
      [('Species in genus', '2'), ('Length', 'About 75–100 cm including tail'), ('Weight', 'About 1.5–3 kg'), ('IUCN status', 'Endangered')],
      ['white-bellied pangolin', 'tree pangolin', 'three-cusped pangolin', 'pangolin', 'phataginus', 'africa', 'rainforest'],
      [C(*WEST_AFRICA_FOREST, *CENTRAL_AFRICA_FOREST, 'Togo', 'Benin', 'Uganda'), part('Guinea', -15, 7.2, -8, 10.5), part('Nigeria', 3, 4, 10, 8),
       part('Dem. Rep. Congo', 12, -6, 31, 5), part('Central African Rep.', 15, 2, 27, 6), part('Angola', 11.7, -9, 16, -4.5)]),
    G('phataginus-tetradactyla', 'Phataginus tetradactyla', 'Black-bellied pangolin', 'phatagininae', 'Rainforests of West and Central Africa, often near rivers',
      ['Also called the long-tailed pangolin, it has the longest tail for its size of any mammal, about two-thirds of its length, with more tail bones than any other mammal. It spends most of its life in the trees and is active by day.',
       'It is vulnerable to hunting and the scale trade.'],
      [('Species in genus', '2'), ('Length', 'About 90–100 cm including tail'), ('Weight', 'About 2–3 kg'), ('IUCN status', 'Vulnerable')],
      ['black-bellied pangolin', 'long-tailed pangolin', 'pangolin', 'phataginus', 'africa', 'rainforest', 'longest tail'],
      [C('Gabon', 'Eq. Guinea', 'Congo', 'Liberia'), part('Cameroon', 8.5, 2, 16, 6), part('Dem. Rep. Congo', 12, -5, 30, 4), part('Central African Rep.', 15, 2, 24, 5),
       part('Sierra Leone', -13.3, 7, -10.3, 9.5), part("Côte d'Ivoire", -8.6, 4.3, -2.5, 7.5), part('Ghana', -3.3, 4.7, 0, 7), part('Nigeria', 5, 4, 9.5, 6.8), part('Angola', 11.7, -6, 13.2, -4.4)]),
]
