# Living monotremes: the egg-laying mammals. All five living species (the platypus and four
# echidnas). Ranges are country-level outlines clipped by boxes, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


CLADES = [
    {'id': 'ornithorhynchidae', 'name': 'Ornithorhynchidae', 'common': 'Platypuses', 'parent': 'monotremata', 'family': True, 'description': 'The platypus and its fossil relatives, such as the toothed Obdurodon from Australia and Patagorhynchus from Patagonia, which shows the family once lived in South America too.'},
    {'id': 'tachyglossidae', 'name': 'Tachyglossidae', 'common': 'Echidnas', 'parent': 'monotremata', 'family': True, 'description': 'Spiny, toothless, ant- and worm-eating monotremes of Australia and New Guinea: the short-beaked echidna and three long-beaked echidnas.'},
]

# Fossil platypuses move into the new family.
UPGRADES = {
    'obdurodon-dicksoni': {'clade': 'ornithorhynchidae'},
    'patagorhynchus-pascuali': {'clade': 'ornithorhynchidae'},
}


def G(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    G('ornithorhynchus-anatinus', 'Ornithorhynchus anatinus', 'Platypus', 'ornithorhynchidae', 'Rivers, streams and lakes of eastern Australia and Tasmania',
      ['An egg-laying mammal with a duck-like bill, webbed feet and a beaver-like tail. When the first specimen reached Britain in 1799, some scientists suspected it was a fake stitched together from different animals.',
       'It hunts underwater with its eyes, ears and nostrils closed, finding insect larvae, shrimps and worms with thousands of sensors in its bill that detect the tiny electric fields of their muscles. Males have a venomous spur on each hind ankle, painful enough to disable a dog. The female lays one to three eggs in a burrow and feeds the young milk that seeps from patches of skin, as it has no nipples.',
       'Drought, dams and land clearing have reduced it in many rivers.'],
      [('Species in genus', '1'), ('Length', 'About 40–60 cm'), ('Weight', 'About 0.7–2.4 kg'), ('IUCN status', 'Near Threatened')],
      ['platypus', 'duck-billed platypus', 'ornithorhynchus', 'monotreme', 'egg-laying mammal', 'venomous', 'electroreception', 'australia', 'tasmania'],
      [part('Australia', 141, -39, 154, -28), part('Australia', 144, -28, 154, -15), part('Australia', 143.5, -44, 149, -39.5), part('Australia', 136.5, -36.1, 138.1, -35.6)]),
    G('tachyglossus-aculeatus', 'Tachyglossus aculeatus', 'Short-beaked echidna', 'tachyglossidae', 'All of Australia, Tasmania and southern New Guinea',
      ['A spiny, toothless ant- and termite-eater with a short snout and a long, sticky tongue. It is found almost everywhere in Australia, from snowy mountains to deserts, the most widespread native Australian mammal.',
       'The female lays a single soft-shelled egg directly into a pouch on her belly; the hatchling, called a puggle, stays there until its spines start to grow. It has one of the lowest body temperatures of any mammal, about 32 °C, and can hibernate in cold areas.'],
      [('Species in genus', '1'), ('Weight', 'About 2–7 kg'), ('IUCN status', 'Least Concern')],
      ['short-beaked echidna', 'echidna', 'spiny anteater', 'tachyglossus', 'monotreme', 'puggle', 'australia', 'new guinea'],
      [C('Australia'), part('Papua New Guinea', 141, -10.5, 148, -6), part('Indonesia', 137.5, -9, 141, -6)]),
    G('zaglossus-bruijnii', 'Zaglossus bruijnii', 'Western long-beaked echidna', 'tachyglossidae', 'Mountain forests of the Bird’s Head region, western New Guinea, Indonesia',
      ['The largest monotreme, up to about 16 kg, with a long, down-curved snout for probing soil and leaf litter for earthworms, which it hooks with spines on its tongue. Its spines are short and mostly hidden in thick fur.',
       'It is hunted for food with dogs and is critically endangered. A museum specimen collected in the Kimberley in 1901 suggests long-beaked echidnas may have survived in north-western Australia until about a century ago, long after they were thought to have died out there.'],
      [('Species in genus', '3'), ('Weight', 'About 5–16 kg'), ('IUCN status', 'Critically Endangered')],
      ['western long-beaked echidna', 'long-beaked echidna', 'echidna', 'zaglossus', 'monotreme', 'new guinea', 'indonesia'],
      [part('Indonesia', 130.5, -4, 135, -0.5)]),
    G('zaglossus-bartoni', 'Zaglossus bartoni', 'Eastern long-beaked echidna', 'tachyglossidae', 'Mountain forests of central and eastern New Guinea',
      ['Also called Barton’s long-beaked echidna, it lives in the high forests of the central ranges of New Guinea, where it is threatened by hunting and forest clearing. Like its relatives it feeds mainly on earthworms.'],
      [('Species in genus', '3'), ('Weight', 'About 5–10 kg'), ('IUCN status', 'Critically Endangered')],
      ['eastern long-beaked echidna', 'bartons long-beaked echidna', 'long-beaked echidna', 'echidna', 'zaglossus', 'papua new guinea'],
      [part('Papua New Guinea', 142, -8.5, 148, -5), part('Indonesia', 138, -5, 141, -3.5)]),
    G('zaglossus-attenboroughi', 'Zaglossus attenboroughi', 'Attenborough’s long-beaked echidna', 'tachyglossidae', 'Cyclops Mountains, northern New Guinea, Indonesia',
      ['The smallest long-beaked echidna, named after Sir David Attenborough and known for decades from a single specimen collected in 1961. In 2023 an expedition to the steep, rugged Cyclops Mountains finally caught it on camera traps, confirming that it still survives.'],
      [('Species in genus', '3'), ('Weight', 'Perhaps about 5 kg'), ('IUCN status', 'Critically Endangered')],
      ['attenboroughs long-beaked echidna', 'sir davids long-beaked echidna', 'long-beaked echidna', 'echidna', 'zaglossus', 'cyclops mountains', 'rediscovered'],
      [part('Indonesia', 140.2, -2.65, 140.8, -2.4)]),
]

HISTORIC_CHANGED = {
    # Lost from the Adelaide region; introduced to Kangaroo Island in the 1920s and 1940s.
    'ornithorhynchus-anatinus': {'without': [3], 'add': [part('Australia', 138, -36, 139.5, -34)]},
}
HISTORIC = {**{sid: 'same' for sid in ['tachyglossus-aculeatus', 'zaglossus-bruijnii', 'zaglossus-bartoni', 'zaglossus-attenboroughi']}, **HISTORIC_CHANGED}
