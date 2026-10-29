# Living rodents. Rodents are far too species-rich (about 2,500 species) to cover every genus, so
# only the owner's picks are here: the capybara, both beavers, the black and brown rats, and the
# red and grey squirrels. Ranges are country-level outlines, so they are approximate.


def C(*names, **clip):
    return {'countries': list(names), **clip}


def part(country, lon0, lat0, lon1, lat1):
    return {'country': country, 'bbox': [lon0, lat0, lon1, lat1]}


def world(**clip):
    return {'world': True, **clip}


EUROPE = ['Portugal', 'Spain', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Germany', 'Switzerland', 'Austria', 'Italy', 'Denmark', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway']

CLADES = [
    {'id': 'rodentia', 'name': 'Rodentia', 'common': 'Rodents', 'parent': 'eutheria', 'description': 'The largest order of mammals, with about 2,500 species, roughly 40% of all mammals. All have a single pair of ever-growing incisors in each jaw, kept sharp by gnawing. Only a few well-known species are included here.'},
    {'id': 'caviidae', 'name': 'Caviidae', 'common': 'Cavies and capybaras', 'parent': 'rodentia', 'family': True, 'description': 'South American rodents including guinea pigs, maras and the capybara.'},
    {'id': 'muridae', 'name': 'Muridae', 'common': 'Old World mice and rats', 'parent': 'rodentia', 'family': True, 'description': 'The largest mammal family, with over 800 species, including house mice, rats and gerbils.'},
    {'id': 'sciuridae', 'name': 'Sciuridae', 'common': 'Squirrels', 'parent': 'rodentia', 'family': True, 'description': 'Tree squirrels, ground squirrels, chipmunks, marmots, prairie dogs and flying squirrels.'},
]

UPGRADES = {}


def G(id, name, common, clade, place, summary, facts, keywords, rng):
    return {'id': id, 'name': name, 'common': common, 'clade': clade, 'place': place, 'summary': summary, 'facts': facts, 'keywords': keywords, 'range': rng}


GENERA = [
    G('hydrochoerus-hydrochaeris', 'Hydrochoerus hydrochaeris', 'Capybara', 'caviidae', 'South America east of the Andes',
      ['The largest living rodent, up to about 65 kg, a semi-aquatic grazer of rivers, marshes and flooded savannas with webbed toes and eyes, ears and nostrils high on its head. It lives in groups and is famously tolerant of other animals, which often sit on it. Its close relatives include the guinea pig.',
       'Hydrochoerus has two species, with the smaller lesser capybara of Panama, Colombia and Venezuela. Giant extinct relatives such as Josephoartigasia were far larger.'],
      [('Species in genus', '2'), ('Weight', 'About 35–65 kg'), ('IUCN status', 'Least Concern')],
      ['capybara', 'hydrochoerus', 'largest rodent', 'south america'],
      [C('Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Brazil', 'Bolivia', 'Paraguay', 'Uruguay', 'Panama'), part('Argentina', -66, -38, -53, -22), part('Peru', -76, -13, -69, -2), part('Ecuador', -78, -3, -75, 0)]),
    G('castor-canadensis', 'Castor canadensis', 'North American beaver', 'castoridae', 'Canada, the United States and northern Mexico; introduced to Tierra del Fuego and Finland',
      ['The largest rodent in North America, a builder of dams and lodges that turns streams into ponds and wetlands, reshaping whole landscapes. The fur trade almost wiped it out by 1900; it has since recovered across most of its range.',
       'Twenty were released in Tierra del Fuego in 1946 to start a fur trade; their descendants, perhaps 100,000, have felled huge areas of southern beech forest. Its genus has one other species, the Eurasian beaver, which cannot interbreed with it.'],
      [('Species in genus', '2'), ('Weight', 'About 15–30 kg'), ('IUCN status', 'Least Concern')],
      ['north american beaver', 'beaver', 'castor', 'dam', 'tierra del fuego'],
      [C('Canada', latMax=68), C('United States of America', latMax=70), part('Mexico', -110, 26, -97, 32.7), part('Argentina', -69, -55.1, -64, -52.5), part('Chile', -71, -56, -66, -52.5), part('Finland', 23, 60, 30, 64)]),
    G('castor-fiber', 'Castor fiber', 'Eurasian beaver', 'castoridae', 'Europe and northern Asia',
      ['Hunted for fur, meat and castoreum (a scent-gland secretion used in medicine and perfume) to about 1,200 animals in eight places by 1900. Protection and reintroductions have brought it back to over a million across Europe and Asia, including Britain, where it had been extinct for about 400 years.',
       'Its dams slow floods, store water in droughts and create wetlands for many other species.'],
      [('Species in genus', '2'), ('Weight', 'About 13–35 kg'), ('IUCN status', 'Least Concern')],
      ['eurasian beaver', 'european beaver', 'beaver', 'castor', 'rewilding', 'britain'],
      [C(*EUROPE, exclude=['Portugal', 'Greece', 'Albania', 'North Macedonia', 'Montenegro', 'Italy']), part('United Kingdom', -6, 50.5, 0, 57.5), part('Russia', 28, 45, 120, 65), part('Mongolia', 88, 46, 92, 49), part('China', 86, 46, 90, 48.5), part('Kazakhstan', 60, 48, 85, 55)]),
    G('rattus-rattus', 'Rattus rattus', 'Black rat', 'muridae', 'Worldwide, especially warm regions; originally South Asia',
      ['A slender, agile climber with a long tail, also called the ship rat or roof rat. Originally from South Asia, it spread with people along trade routes and ships to every continent but Antarctica. It carried the fleas that spread plague, though some researchers argue human fleas and lice also spread the Black Death.',
       'On islands it has driven many seabirds, land birds and reptiles to extinction. Rattus has about 65 species.'],
      [('Species in genus', 'About 65'), ('Weight', 'About 100–300 g'), ('IUCN status', 'Least Concern')],
      ['black rat', 'ship rat', 'roof rat', 'rattus', 'plague', 'rat'],
      [world(latMin=-45, latMax=45)]),
    G('rattus-norvegicus', 'Rattus norvegicus', 'Brown rat', 'muridae', 'Worldwide; originally northern China and Mongolia',
      ['The grey, brown or Norway rat, the common large rat of cities, sewers and farms. Despite its name it came from northern China and Mongolia, reaching Europe in the 1700s, where it largely replaced the black rat. It is heavier and a better swimmer than the black rat, and digs burrows rather than climbing.',
       'Its domesticated form is the laboratory rat and the pet “fancy rat”, used in research since the 1800s.'],
      [('Species in genus', 'About 65'), ('Weight', 'About 250–500 g'), ('IUCN status', 'Least Concern')],
      ['brown rat', 'grey rat', 'gray rat', 'norway rat', 'sewer rat', 'rattus', 'rat', 'lab rat'],
      [world(latMin=-55, latMax=70)]),
    G('sciurus-vulgaris', 'Sciurus vulgaris', 'Red squirrel', 'sciuridae', 'Forests of Europe and northern Asia',
      ['A tree squirrel with ear tufts that buries seeds and nuts in many small caches, planting new trees from those it forgets. In Britain and Ireland, the introduced grey squirrel has replaced it across much of its range, both by outcompeting it and by carrying squirrelpox, which kills reds but not greys.',
       'Sciurus has about 30 species, including the grey squirrel.'],
      [('Species in genus', 'About 30'), ('Weight', 'About 250–340 g'), ('IUCN status', 'Least Concern')],
      ['red squirrel', 'sciurus', 'squirrel', 'europe', 'britain'],
      [C(*EUROPE, 'Ireland', 'Russia', 'Kazakhstan', 'Mongolia', 'Georgia', 'Turkey', latMax=70), part('United Kingdom', -8, 54.5, -1.5, 59), part('China', 75, 40, 135, 53), part('Japan', 139.5, 41.3, 146, 45.6), C('North Korea', 'South Korea')]),
    G('sciurus-carolinensis', 'Sciurus carolinensis', 'Grey squirrel', 'sciuridae', 'Eastern North America; introduced to Britain, Ireland, Italy and South Africa',
      ['The eastern grey squirrel, native to the hardwood forests of eastern North America and now common in city parks. Introduced to Britain from the 1870s, it has replaced the native red squirrel over most of England and Wales and is classed there as an invasive species.',
       'Its spread is held back where pine martens have recovered, since martens catch the heavier, ground-feeding greys more easily than reds.'],
      [('Species in genus', 'About 30'), ('Weight', 'About 400–600 g'), ('IUCN status', 'Least Concern')],
      ['grey squirrel', 'gray squirrel', 'eastern grey squirrel', 'sciurus', 'squirrel', 'invasive'],
      [part('United States of America', -100, 25, -67, 48), part('Canada', -97, 42, -64, 49), part('United Kingdom', -5.5, 50, 2, 56), part('Ireland', -8.5, 52.5, -6, 54.5), part('Italy', 7, 44, 10, 46), part('South Africa', 18, -34.5, 19.5, -33.5)]),
]


# Historic ranges (about 1,000 to 150 years ago). Species not listed in HISTORIC_CHANGED had a
# range much as today.
HISTORIC_CHANGED = {
    # Introduced to Tierra del Fuego and Finland in the 1900s.
    'castor-canadensis': {'without': [3, 4, 5]},
    # Hunted out of Britain by the 1500s and from most of Europe by 1900.
    'castor-fiber': {'add': [C('United Kingdom', 'Portugal', 'Italy', 'Greece', 'Albania', 'North Macedonia', 'Montenegro', 'Turkey', 'Kazakhstan'), part('Russia', 28, 45, 140, 68)]},
    # Native to northern China and Mongolia; it reached Europe in the 1700s and then the world.
    'rattus-norvegicus': {'label': 'Native range', 'from': 1000, 'to': 300, 'regions': [part('China', 100, 30, 135, 50), C('Mongolia'), part('Russia', 100, 42, 140, 55)]},
    'sciurus-vulgaris': {'add': [C('United Kingdom', 'Ireland')]},
    # Introduced to Britain, Ireland, Italy and South Africa from the 1870s.
    'sciurus-carolinensis': {'without': [2, 3, 4, 5]},
}
HISTORIC = {**{sid: 'same' for sid in ['hydrochoerus-hydrochaeris', 'rattus-rattus']}, **HISTORIC_CHANGED}
