// Bird orders and the major branches of the bird family tree, so that families sit in their real
// groups rather than all directly under "birds". The big branches follow the DNA studies of Jarvis
// et al. (2014) and Prum et al. (2015); the deepest ones (such as where the hoatzin or kagu belong)
// are still debated. Families defined in other sets are moved here with `cladeParents`.

import type { DataSet } from '@/data/sets/types';

const G = (id: string, name: string, common: string, parent: string, description: string) => ({ id, name, common, parent, description });

export const BIRD_ORDERS: DataSet = {
  clades: [
    // Fowl and waterfowl.
    G('galloanserae', 'Galloanserae', 'Fowl and waterfowl', 'aves', 'Gamebirds and ducks, geese and swans: an early branch of modern birds, with extinct giants such as the mihirungs and Gastornis.'),
    G('galliformes', 'Galliformes', 'Gamebirds', 'galloanserae', 'Chicken-like ground birds: pheasants, grouse, quail, turkeys, guineafowl, curassows and megapodes.'),
    // The rest of modern birds (Neoaves), in their main branches.
    G('mirandornithes', 'Mirandornithes', 'Flamingos and grebes', 'aves', 'Flamingos and grebes, which look nothing alike but share features of their bones, eggs and even their lice.'),
    G('columbimorphae', 'Columbimorphae', 'Pigeons and sandgrouse', 'aves', 'Pigeons and doves, sandgrouse and the mesites of Madagascar.'),
    G('otidimorphae', 'Otidimorphae', 'Bustards, cuckoos and turacos', 'aves', 'Bustards, cuckoos and turacos, a group known mainly from DNA.'),
    G('strisores', 'Strisores', 'Nightjars, swifts and hummingbirds', 'aves', 'Nightjars, frogmouths, the oilbird, swifts and hummingbirds: the hummingbirds and swifts evolved from night-flying ancestors.'),
    G('apodiformes', 'Apodiformes', 'Swifts and hummingbirds', 'strisores', 'Swifts and hummingbirds, with tiny feet and the most aerial lives of any birds.'),
    G('gruiformes', 'Gruiformes', 'Cranes and rails', 'aves', 'Cranes, rails, coots, moorhens and their relatives.'),
    G('charadriiformes', 'Charadriiformes', 'Shorebirds, gulls and auks', 'aves', 'Waders such as sandpipers and plovers, and gulls, terns, skuas and auks.'),
    G('aequornithes', 'Aequornithes', 'Core waterbirds', 'aves', 'Loons, penguins, albatrosses and petrels, storks, cormorants and gannets, pelicans, herons and ibises.'),
    G('procellariiformes', 'Procellariiformes', 'Tubenoses', 'aequornithes', 'Albatrosses, petrels and shearwaters, ocean wanderers with tube-shaped nostrils.'),
    G('suliformes', 'Suliformes', 'Gannets, cormorants and frigatebirds', 'aequornithes', 'Gannets and boobies, cormorants and shags, frigatebirds and darters.'),
    G('pelecaniformes', 'Pelecaniformes', 'Pelicans, herons and ibises', 'aequornithes', 'Pelicans, the shoebill, herons and egrets, and ibises and spoonbills.'),
    G('telluraves', 'Telluraves', 'Core landbirds', 'aves', 'Most land birds: birds of prey, owls, kingfishers and woodpeckers, parrots and the songbirds.'),
    G('afroaves', 'Afroaves', 'Eagles, owls, kingfishers and woodpeckers', 'telluraves', 'Eagles and hawks, owls, mousebirds, trogons, hornbills, kingfishers and woodpeckers. The group probably began with birds of prey.'),
    G('coraciimorphae', 'Coraciimorphae', 'Trogons, kingfishers and woodpeckers', 'afroaves', 'Trogons, hornbills and hoopoes, kingfishers, rollers and bee-eaters, and woodpeckers and toucans.'),
    G('bucerotiformes', 'Bucerotiformes', 'Hornbills and hoopoes', 'coraciimorphae', 'Hornbills, ground hornbills, hoopoes and wood hoopoes.'),
    G('coraciiformes', 'Coraciiformes', 'Kingfishers, rollers and bee-eaters', 'coraciimorphae', 'Kingfishers, rollers, bee-eaters, motmots and todies.'),
    G('piciformes', 'Piciformes', 'Woodpeckers and toucans', 'coraciimorphae', 'Woodpeckers, toucans, barbets, honeyguides and jacamars.'),
    G('australaves', 'Australaves', 'Falcons, parrots and songbirds', 'telluraves', 'Seriemas and terror birds, falcons, parrots and the passerines. Falcons are closer to parrots than to eagles.'),
    G('psittaciformes', 'Psittaciformes', 'Parrots', 'australaves', 'Parrots, cockatoos and the New Zealand parrots (kākāpō, kea and kākā).'),
    G('passeriformes', 'Passeriformes', 'Perching birds', 'australaves', 'The perching birds or passerines: more than half of all bird species, from crows and wrens to the songbirds.'),
  ],
  cladeParents: {
    // Fowl and waterfowl.
    anatidae: 'galloanserae', dromornithidae: 'galloanserae', gastornithidae: 'galloanserae',
    phasianidae: 'galliformes', megapodiidae: 'galliformes', odontophoridae: 'galliformes', numididae: 'galliformes', cracidae: 'galliformes',
    phoenicopteridae: 'mirandornithes', podicipedidae: 'mirandornithes',
    columbidae: 'columbimorphae', pteroclidae: 'columbimorphae',
    otididae: 'otidimorphae', cuculidae: 'otidimorphae', musophagidae: 'otidimorphae',
    caprimulgidae: 'strisores', steatornithidae: 'strisores', podargidae: 'strisores', apodidae: 'apodiformes', trochilidae: 'apodiformes',
    gruidae: 'gruiformes', rallidae: 'gruiformes',
    alcidae: 'charadriiformes', laridae: 'charadriiformes', scolopacidae: 'charadriiformes', charadriidae: 'charadriiformes', haematopodidae: 'charadriiformes', recurvirostridae: 'charadriiformes',
    gaviidae: 'aequornithes', spheniscidae: 'aequornithes', ciconiidae: 'aequornithes',
    diomedeidae: 'procellariiformes', procellariidae: 'procellariiformes',
    sulidae: 'suliformes', fregatidae: 'suliformes', phalacrocoracidae: 'suliformes',
    pelecanidae: 'pelecaniformes', balaenicipitidae: 'pelecaniformes', ardeidae: 'pelecaniformes', threskiornithidae: 'pelecaniformes',
    // Landbirds.
    accipitriformes: 'afroaves', strigiformes: 'afroaves', teratornithidae: 'accipitriformes',
    trogonidae: 'coraciimorphae',
    bucerotidae: 'bucerotiformes', upupidae: 'bucerotiformes',
    alcedinidae: 'coraciiformes', coraciidae: 'coraciiformes', meropidae: 'coraciiformes',
    picidae: 'piciformes', ramphastidae: 'piciformes', indicatoridae: 'piciformes',
    phorusrhacidae: 'australaves', falconidae: 'australaves',
    psittaculidae: 'psittaciformes', psittacidae: 'psittaciformes', cacatuidae: 'psittaciformes', strigopidae: 'psittaciformes',
    ...Object.fromEntries(
      [
        'estrildidae', 'menuridae', 'corvidae', 'paradisaeidae', 'hirundinidae', 'turdidae', 'muscicapidae', 'fringillidae', 'thraupidae', 'passeridae', 'sturnidae', 'mimidae',
        'cardinalidae', 'ptilonorhynchidae', 'tyrannidae', 'furnariidae', 'thamnophilidae', 'pipridae', 'cotingidae', 'parulidae', 'icteridae', 'passerellidae', 'vireonidae',
        'meliphagidae', 'maluridae', 'callaeidae', 'acanthisittidae', 'mohoidae', 'artamidae', 'rhipiduridae', 'paridae', 'aegithalidae', 'sittidae', 'troglodytidae', 'regulidae',
        'phylloscopidae', 'acrocephalidae', 'sylviidae', 'pycnonotidae', 'zosteropidae', 'alaudidae', 'motacillidae', 'laniidae', 'bombycillidae', 'cinclidae', 'prunellidae',
        'emberizidae', 'oriolidae', 'dicruridae', 'pittidae', 'ploceidae', 'nectariniidae',
      ].map((f) => [f, 'passeriformes']),
    ),
  },
};
