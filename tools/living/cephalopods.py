# Living cephalopods: the nautilus, and the best-known squid, cuttlefish and octopuses. Ocean
# ranges are drawn as sea boxes with land cut out, so they are approximate. Checked November 2026.


def sea(lon0, lat0, lon1, lat1):
    return {'sea': [lon0, lat0, lon1, lat1]}


def F(id, name, common, parent, desc):
    return {'id': id, 'name': name, 'common': common, 'parent': parent, 'family': True, 'description': desc}


CLADES = [
    F('nautilida', 'Nautilida', 'Nautiluses', 'cephalopoda',
      'Cephalopods with a coiled outer shell divided into gas-filled chambers. Only the nautiluses survive, the last of the shelled nautiloids that once filled the seas.'),
    F('coleoidea', 'Coleoidea', 'Squid, octopuses and cuttlefish', 'cephalopoda',
      'Cephalopods whose shell is inside the body, reduced or lost. They include squid, cuttlefish, octopuses, the vampire squid and the extinct belemnites, and are among the most intelligent invertebrates.'),
    F('decapodiformes', 'Decapodiformes', 'Squid and cuttlefish', 'coleoidea',
      'Coleoids with eight arms and two longer feeding tentacles: squid, cuttlefish, bobtail squid and the ram’s horn squid.'),
    F('octopoda', 'Octopoda', 'Octopuses', 'coleoidea',
      'Eight-armed coleoids with no tentacles and, in most, no trace of a shell. About 300 species live today, from the shallows to the deep sea.'),
    F('vampyromorpha', 'Vampyromorpha', 'Vampire squid', 'coleoidea',
      'A single living species, the vampire squid of the deep sea, the last of an old group closer to octopuses than to squid.'),
]

UPGRADES = {}


def S(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    S('nautilus-pompilius', 'Nautilus pompilius', 'Chambered nautilus', 'nautilida', 'Coral reef slopes of the western Pacific and eastern Indian Ocean',
      ['The last of the shelled nautiloids, with a coiled shell about 20 cm across divided into chambers. It adjusts the gas and liquid in the chambers to float, spending the day 300 m or more deep on reef slopes and rising at night to scavenge with up to 90 sucker-less tentacles. It can live for over 20 years.',
       'It is often called a living fossil, but only its body plan is ancient: nautiloids go back about 500 million years, while the living nautilus species are much younger. Trade in its shells, sold as ornaments, led to its listing on CITES in 2016.'],
      [('Shell', 'About 20 cm across'), ('Myth', '“Living fossil” is misleading: its species are young, though its lineage is old')],
      ['nautilus', 'chambered nautilus', 'nautiloid', 'cephalopod', 'shell', 'living fossil'],
      [sea(95, -30, 180, 15)]),
    S('architeuthis-dux', 'Architeuthis dux', 'Giant squid', 'decapodiformes', 'Deep oceans worldwide, except the polar seas',
      ['Females reach about 13 m including their two long feeding tentacles, which make up most of that length; males are smaller. Its eyes, up to about 27 cm across, are among the largest of any animal, and help it spot sperm whales, its main predator, in the dark.',
       'Probably the origin of the kraken legend, it was known only from dead and dying specimens until Tsunemi Kubodera and Kyoichi Mori photographed one alive at 900 m off Japan in 2004. The first video of one in the deep sea followed in 2012.'],
      [('Length', 'Up to about 13 m including tentacles'), ('First seen alive', '2004, off the Ogasawara Islands, Japan')],
      ['giant squid', 'architeuthis', 'kraken', 'squid', 'cephalopod', 'deep sea'],
      [sea(-180, -60, 180, 65)]),
    S('mesonychoteuthis-hamiltoni', 'Mesonychoteuthis hamiltoni', 'Colossal squid', 'decapodiformes', 'Southern Ocean around Antarctica',
      ['The heaviest invertebrate known. A specimen caught by fishers in 2007 weighed about 495 kg. It is shorter than the giant squid but much bulkier, with swivelling hooks on its arms and tentacles as well as suckers.',
       'For a century it was known only from remains, many from the stomachs of sperm whales. In March 2025 a research expedition near the South Sandwich Islands filmed a live one at 600 m for the first time: a see-through juvenile about 30 cm long.'],
      [('Weight', 'About 495 kg (the largest specimen weighed)'), ('First filmed alive', '2025, a juvenile near the South Sandwich Islands')],
      ['colossal squid', 'mesonychoteuthis', 'squid', 'heaviest invertebrate', 'cephalopod', 'antarctica'],
      [sea(-180, -75, 180, -40)]),
    S('dosidicus-gigas', 'Dosidicus gigas', 'Humboldt squid', 'decapodiformes', 'Eastern Pacific, from Chile to Alaska',
      ['A powerful, fast-growing squid up to about 1.5 m long and 50 kg, hunting in large groups and flashing red and white as it does, which earned it the name “red devil” in Mexico. It lives only about a year or two.',
       'Since the late 1990s it has spread far north of its old range, reaching California, Canada and Alaska, probably helped by warmer, low-oxygen water and fewer predators.'],
      [('Length', 'Up to about 1.5 m'), ('Lifespan', 'About 1 to 2 years')],
      ['humboldt squid', 'jumbo squid', 'red devil', 'dosidicus', 'squid', 'cephalopod'],
      [sea(-140, -50, -70, 60)]),
    S('sepia-officinalis', 'Sepia officinalis', 'Common cuttlefish', 'decapodiformes', 'Northeast Atlantic, the North Sea and the Mediterranean',
      ['A broad-bodied relative of squid with a W-shaped pupil and a chalky internal shell, the cuttlebone, which it fills with gas to float and which washes up on beaches. Big males reach about 45 cm.',
       'It changes colour, pattern and skin texture in a fraction of a second to hide or to signal, even though its eyes have only one kind of light sensor and it is thought to be colour-blind.'],
      [('Length', 'Up to about 45 cm (body)'), ('Shell', 'The internal cuttlebone')],
      ['cuttlefish', 'common cuttlefish', 'sepia', 'cuttlebone', 'cephalopod', 'camouflage'],
      [sea(-25, -35, 42, 62)]),
    S('spirula-spirula', 'Spirula spirula', 'Ram’s horn squid', 'decapodiformes', 'Deep tropical and subtropical oceans worldwide',
      ['A small squid relative, about 5 cm long, with a coiled, chambered shell inside its body that keeps it floating head-down in the deep. Its little white shells wash up on beaches worldwide, but the living animal is rarely seen; the first video of one in the wild was made only in 2020, off Australia’s Great Barrier Reef.'],
      [('Length', 'About 5 cm'), ('Shell', 'Coiled and chambered, inside the body')],
      ['ram\'s horn squid', 'spirula', 'squid', 'cephalopod', 'deep sea'],
      [sea(-180, -40, 180, 40)]),
    S('octopus-vulgaris', 'Octopus vulgaris', 'Common octopus', 'octopoda', 'Mediterranean Sea and the eastern Atlantic',
      ['A rocky-shore octopus about 1 m long including its arms, with three hearts, blue blood and most of its neurons in its arms. It solves puzzles, opens jars and escapes tanks, yet lives only one or two years: the female guards her eggs without eating and dies soon after they hatch.',
       'Octopuses once called this species around the world are now known to be several closely related species. In 2022 the United Kingdom recognised octopuses and other cephalopods as sentient in law.'],
      [('Length', 'About 1 m including arms'), ('Hearts', 'Three')],
      ['octopus', 'common octopus', 'octopus vulgaris', 'cephalopod', 'intelligence'],
      [sea(-30, -35, 42, 55)]),
    S('enteroctopus-dofleini', 'Enteroctopus dofleini', 'Giant Pacific octopus', 'octopoda', 'North Pacific, from Japan to California',
      ['The largest octopus species. Adults commonly weigh about 15 kg with arms spanning about 4 m; much larger records are doubtful. It hunts crabs, clams and fish in cold coastal waters, and lives three to five years.'],
      [('Weight', 'Commonly about 15 kg'), ('Arm span', 'About 4 m')],
      ['giant pacific octopus', 'enteroctopus', 'octopus', 'cephalopod', 'largest octopus'],
      [sea(120, 20, 180, 62), sea(-180, 30, -115, 62)]),
    S('hapalochlaena-lunulata', 'Hapalochlaena lunulata', 'Greater blue-ringed octopus', 'octopoda', 'Coral reefs and tide pools of the western Pacific and Indian Ocean',
      ['A small octopus, about 10 cm including its arms, that flashes bright blue rings when threatened. Its bite carries tetrodotoxin, made by bacteria living in it, enough to kill a person by stopping their breathing; there is no antidote, but victims survive if kept breathing until the poison wears off.'],
      [('Length', 'About 10 cm including arms'), ('Venom', 'Tetrodotoxin, from bacteria')],
      ['blue-ringed octopus', 'hapalochlaena', 'octopus', 'venomous', 'tetrodotoxin', 'cephalopod'],
      [sea(90, -35, 160, 25)]),
    S('thaumoctopus-mimicus', 'Thaumoctopus mimicus', 'Mimic octopus', 'octopoda', 'Sandy shallows of Indonesia and the western Pacific',
      ['An octopus discovered in 1998 off Sulawesi that impersonates other animals, flattening into a flatfish, trailing its arms like a lionfish, or hiding six arms and waving two like a banded sea snake, apparently copying whichever dangerous animal will scare off a threat.'],
      [('Discovered', '1998, off Sulawesi, Indonesia')],
      ['mimic octopus', 'thaumoctopus', 'octopus', 'cephalopod', 'mimicry'],
      [sea(95, -15, 155, 15)]),
    S('amphioctopus-marginatus', 'Amphioctopus marginatus', 'Coconut octopus', 'octopoda', 'Tropical western Pacific and Indian Ocean',
      ['A small octopus that collects discarded coconut shell halves, carries them stacked under its body as it stilt-walks along the sea floor, and assembles them into a shelter. Described in 2009, this was the first tool use recorded in an invertebrate.'],
      [('Known for', 'The first tool use recorded in an invertebrate (2009)')],
      ['coconut octopus', 'veined octopus', 'amphioctopus', 'octopus', 'tool use', 'cephalopod'],
      [sea(70, -25, 160, 30)]),
    S('vampyroteuthis-infernalis', 'Vampyroteuthis infernalis', 'Vampire squid', 'vampyromorpha', 'Deep tropical and temperate oceans worldwide',
      ['A deep-sea cephalopod about 30 cm long, with webbed arms and red eyes. Despite its names, “vampire squid from hell”, it is neither a vampire nor a squid: it is the last of its own group, closer to octopuses, and feeds gently on marine snow, drifting flakes of dead matter, which it gathers on two sticky filaments.',
       'It lives where the water holds very little oxygen, where few predators can follow.'],
      [('Length', 'About 30 cm'), ('Myth', 'Not a squid, and it does not suck blood')],
      ['vampire squid', 'vampyroteuthis', 'cephalopod', 'deep sea', 'marine snow'],
      [sea(-180, -45, 180, 45)]),
    S('argonauta-argo', 'Argonauta argo', 'Greater argonaut', 'octopoda', 'Open tropical and subtropical oceans worldwide',
      ['An open-ocean octopus whose females make a thin, white, ridged shell with two of their arms, up to about 30 cm across, and use it as an egg case and float, trapping air to stay level. The males are tiny, a few centimetres long.',
       'Its shell gives it the name paper nautilus, but it is an octopus, not a nautilus, and its shell has no chambers.'],
      [('Female shell', 'Up to about 30 cm'), ('Myth', 'A “paper nautilus”, but an octopus')],
      ['argonaut', 'paper nautilus', 'argonauta', 'octopus', 'cephalopod'],
      [sea(-180, -40, 180, 40)]),
]

HISTORIC = {sid: 'same' for sid in [g['id'] for g in GENERA if g['id'] != 'dosidicus-gigas']}
# The Humboldt squid spread north from the late 1990s.
HISTORIC['dosidicus-gigas'] = {'regions': [sea(-120, -50, -70, 35)], 'stages': []}
