// More about each natural history museum and zoo on the globe: a little history, the address,
// notable exhibits and, for zoos, conservation work. `species` links to species pages.

export type Highlight = { text: string; species?: string[] };
export type PlaceDetail = { address: string; website?: string; history: string[]; exhibits?: Highlight[]; conservation?: Highlight[] };

export const PLACE_DETAILS: Record<string, PlaceDetail> = {
  // ── North America ──
  'museum-american-museum-of-natural-history': {
    address: '200 Central Park West (at 79th Street), New York, NY 10024, USA',
    website: 'https://www.amnh.org',
    history: [
      'Founded in 1869, with Theodore Roosevelt Sr. among its founders, and open on its present site since 1877. Its expeditions, from Barnum Brown’s dinosaur digs in Montana to Roy Chapman Andrews’s Gobi trips that found the first dinosaur eggs known to science, filled one of the biggest fossil collections in the world.',
    ],
    exhibits: [
      { text: 'The fourth-floor fossil halls hold the T. rex skeleton Barnum Brown dug up, one of the first ever found.', species: ['tyrannosaurus-rex'] },
      { text: 'A rearing Barosaurus defends its young from an Allosaurus in the Theodore Roosevelt Rotunda.', species: ['barosaurus-lentus', 'allosaurus-fragilis'] },
      { text: 'A cast of the giant titanosaur Patagotitan, so long its head pokes out of the gallery.', species: ['patagotitan-mayorum'] },
      { text: 'A life-size, 29 m model of a blue whale hangs in the Hall of Ocean Life.', species: ['balaenoptera-musculus'] },
    ],
  },
  'museum-national-museum-of-natural-history': {
    address: '10th Street & Constitution Avenue NW, Washington, DC 20560, USA',
    website: 'https://naturalhistory.si.edu',
    history: [
      'Part of the Smithsonian Institution, it opened on the National Mall in 1910 and holds over 140 million specimens, one of the largest natural history collections in the world. Entry is free.',
    ],
    exhibits: [
      { text: 'Henry, an 11-tonne African bush elephant, has stood in the rotunda since 1959.', species: ['loxodonta-africana'] },
      { text: 'The David H. Koch Hall of Fossils – Deep Time, opened in 2019, centres on “the Nation’s T. rex” pulling down a Triceratops.', species: ['tyrannosaurus-rex', 'triceratops-horridus'] },
      { text: 'The Sant Ocean Hall has a giant squid and a model of a North Atlantic right whale.', species: ['architeuthis-dux'] },
    ],
  },
  'museum-field-museum-of-natural-history': {
    address: '1400 S. DuSable Lake Shore Drive, Chicago, IL 60605, USA',
    website: 'https://www.fieldmuseum.org',
    history: [
      'Founded after the 1893 World’s Columbian Exposition to keep its natural history displays, and named after its first big donor, the department store owner Marshall Field. It moved to its marble building by Lake Michigan in 1921.',
    ],
    exhibits: [
      { text: 'SUE, the largest and most complete T. rex skeleton known, bought at auction in 1997.', species: ['tyrannosaurus-rex'] },
      { text: 'Máximo, a cast of the titanosaur Patagotitan, fills Stanley Field Hall.', species: ['patagotitan-mayorum'] },
      { text: 'The man-eating lions of Tsavo, two maneless males that killed railway workers in Kenya in 1898.', species: ['panthera-leo'] },
    ],
  },
  'museum-royal-tyrrell-museum-of-palaeontology': {
    address: '1500 North Dinosaur Trail, Drumheller, Alberta T0J 0Y0, Canada',
    website: 'https://tyrrellmuseum.com',
    history: [
      'Opened in 1985 in the badlands of the Red Deer River valley, among the rocks its fossils come from. It is named after Joseph Burr Tyrrell, who found the first Albertosaurus skull near here in 1884.',
    ],
    exhibits: [
      { text: 'The nodosaur Borealopelta, preserved in 3D with its armour and skin, found in an oil sands mine in 2011.', species: ['borealopelta-markmitchelli'] },
      { text: '“Black Beauty”, a T. rex skeleton stained black by minerals.', species: ['tyrannosaurus-rex'] },
      { text: 'Alberta’s own dinosaurs, including Albertosaurus and many horned and duck-billed dinosaurs.', species: ['albertosaurus-sarcophagus', 'centrosaurus-apertus'] },
    ],
  },
  'museum-royal-ontario-museum': {
    address: '100 Queen’s Park, Toronto, Ontario M5S 2C6, Canada',
    website: 'https://www.rom.on.ca',
    history: [
      'Opened in 1914 and now Canada’s largest museum, covering both world cultures and natural history. The crystal-shaped Michael Lee-Chin Crystal entrance was added in 2007.',
    ],
    exhibits: [
      { text: 'The ankylosaur Zuul, named after the monster in Ghostbusters, with its skin and armour preserved.', species: ['zuul-crurivastator'] },
      { text: 'One of the world’s largest collections of Burgess Shale fossils, from the Cambrian seas of British Columbia.', species: ['anomalocaris-canadensis', 'opabinia-regalis', 'marrella-splendens'] },
      { text: 'The skeleton of a blue whale that died in sea ice off Newfoundland in 2014.', species: ['balaenoptera-musculus'] },
    ],
  },
  'museum-canadian-museum-of-nature': {
    address: '240 McLeod Street, Ottawa, Ontario K2P 2R1, Canada',
    website: 'https://nature.ca',
    history: [
      'Canada’s national natural history museum grew out of the Geological Survey of Canada’s collections from 1856. It is housed in the Victoria Memorial Museum Building, a castle-like stone building over a century old.',
    ],
    exhibits: [
      { text: 'The complete skeleton of a young blue whale, about 20 m long, is the centrepiece of the Water Gallery.', species: ['balaenoptera-musculus'] },
      { text: 'The Fossil Gallery has over 30 skeletons of dinosaurs and early mammals; its Edmontosaurus has been on show since 1913, the first complete dinosaur displayed in Canada.' },
    ],
  },
  // ── China ──
  'museum-national-natural-history-museum-of-china': {
    address: '126 Tianqiao South Street, Dongcheng District, Beijing, China',
    website: 'https://www.nnhm.org.cn/en/',
    history: [
      'Set up in 1951 as the Central Museum of Natural History, with the palaeontologist Pei Wenzhong among its founders, it became the Beijing Museum of Natural History in 1962 and took its present name in 2023.',
    ],
    exhibits: [
      { text: 'A 26 m Mamenchisaurus skeleton, one of the longest dinosaurs found in China.', species: ['mamenchisaurus-sinocanadorum'] },
    ],
  },
  'museum-paleozoological-museum-of-china': {
    address: '142 Xizhimenwai Street, Xicheng District, Beijing, China',
    website: 'http://www.paleozoo.cn',
    history: [
      'Run by the Institute of Vertebrate Paleontology and Paleoanthropology, the Chinese Academy of Sciences’ centre for fossil research, which has named many of China’s dinosaurs and feathered dinosaurs.',
    ],
    exhibits: [
      { text: 'A Monolophosaurus attacking the plated dinosaur Tuojiangosaurus.', species: ['monolophosaurus-jiangi', 'tuojiangosaurus-multispinus'] },
      { text: 'Mamenchisaurus, one of the longest-necked dinosaurs, and many other Chinese dinosaurs.', species: ['mamenchisaurus-sinocanadorum'] },
    ],
  },
  'museum-shanghai-natural-history-museum': {
    address: '510 West Beijing Road, Jing’an Sculpture Park, Jing’an District, Shanghai, China',
    website: 'https://www.snhm.org.cn',
    history: [
      'Founded in 1956 and moved in 2015 to a new spiral building in Jing’an Sculpture Park, inspired by the shape of a nautilus shell. It holds about 290,000 specimens.',
    ],
    exhibits: [
      { text: 'A complete Mamenchisaurus skeleton about 140 million years old greets visitors at the entrance.', species: ['mamenchisaurus-sinocanadorum'] },
      { text: 'Chinese wildlife, including the Chinese alligator of the lower Yangtze.', species: ['alligator-sinensis'] },
    ],
  },
  // ── Russia ──
  'museum-moscow-paleontological-museum': {
    address: 'Profsoyuznaya Street 123, Moscow, Russia',
    website: 'https://paleo.ru/museum-en',
    history: [
      'The museum of the Russian Academy of Sciences’ Paleontological Institute, named after the palaeontologist Yuri Orlov. It began as part of Moscow University’s zoological museum and moved to its present building in 1987.',
    ],
    exhibits: [
      { text: 'Six halls with over 5,000 exhibits, among them Permian reptiles and mammal relatives from Russia and dinosaurs from Soviet–Mongolian expeditions to the Gobi.', species: ['scutosaurus-karpinskii', 'inostrancevia-alexandri', 'tarbosaurus-bataar', 'saurolophus-angustirostris'] },
    ],
  },
  'museum-zoological-museum-of-the-zoological-institute-of-the-russian-academy-of-sciences': {
    address: 'Universitetskaya Embankment 1, St Petersburg 199034, Russia',
    website: 'https://www.zin.ru',
    history: [
      'One of the largest zoological museums in the world. It grew out of Peter the Great’s Kunstkamera, the first museum in Russia, and became a museum of its own in 1832.',
    ],
    exhibits: [
      { text: 'The Berezovka mammoth, found frozen in Siberia in 1900, and the Adams mammoth, the first mammoth skeleton ever mounted.', species: ['mammuthus-primigenius'] },
      { text: 'A skeleton of Steller’s sea cow, hunted to extinction within 27 years of its discovery.', species: ['hydrodamalis-gigas'] },
    ],
  },
  'museum-darwin-museum': {
    address: 'Vavilova Street 57, Moscow 117292, Russia',
    website: 'https://www.darwinmuseum.ru',
    history: [
      'Founded in 1907 by the zoologist Alexander Kohts, who began with his own collection to teach evolution. It was the first museum in the world dedicated to evolution, and now holds over 400,000 items.',
    ],
    exhibits: [
      { text: 'A mounted great auk, a flightless seabird of the North Atlantic hunted to extinction in 1844, among other extinct animals.', species: ['pinguinus-impennis'] },
      { text: 'Rare editions of Darwin’s On the Origin of Species in its library.' },
    ],
  },
  // ── Brazil ──
  'museum-national-museum-of-brazil': {
    address: 'Quinta da Boa Vista, São Cristóvão, Rio de Janeiro, RJ 20940-040, Brazil',
    website: 'https://www.museunacional.ufrj.br',
    history: [
      'Founded in 1818, it was the oldest scientific institution in Brazil and was housed in the former imperial palace. A fire on 2 September 2018 destroyed most of its 20 million items; the palace is being rebuilt and is reopening in stages, with events in the park meanwhile.',
    ],
    exhibits: [
      { text: 'The Bendegó meteorite, over 5 tonnes, survived the fire, and parts of Luzia, one of the oldest human skeletons in the Americas, were recovered from the ruins.', species: ['homo-sapiens'] },
    ],
  },
  'museum-museum-of-zoology-of-the-university-of-s-o-paulo': {
    address: 'Avenida Nazaré 481, Ipiranga, São Paulo, SP, Brazil',
    website: 'https://mz.usp.br',
    history: [
      'Its collections began in 1890 as part of the Museu Paulista and now hold over 8 million specimens, one of the largest zoological collections in Latin America. It is part of the University of São Paulo.',
    ],
    exhibits: [
      { text: 'Biodiversity galleries of Brazilian wildlife, from Amazon fishes and frogs to big cats and birds.', species: ['panthera-onca'] },
    ],
  },
  'museum-museu-paraense-em-lio-goeldi': {
    address: 'Avenida Magalhães Barata 376, São Brás, Belém, PA 66040-170, Brazil',
    website: 'https://www.museu-goeldi.br',
    history: [
      'Founded in 1866 to study the Amazon, and later named after the Swiss naturalist Emil Goeldi, who ran it from 1894. Its zoo-botanical park, opened in 1895, is the oldest zoo in Brazil, a patch of rainforest in the middle of Belém.',
    ],
    exhibits: [
      { text: 'Living Amazon animals in the park, among them Amazonian manatees and jaguars.', species: ['trichechus-inunguis', 'panthera-onca'] },
    ],
  },
  // ── Australia ──
  'museum-australian-museum': {
    address: '1 William Street, Sydney NSW 2010, Australia',
    website: 'https://australian.museum',
    history: [
      'Founded in 1827, it is Australia’s oldest museum. The William Street building was begun in 1846 and opened to the public in 1857.',
    ],
    exhibits: [
      { text: 'Australian animals past and present, including the thylacine, the island’s large marsupial predator, hunted to extinction in the 20th century.', species: ['thylacinus-cynocephalus'] },
    ],
  },
  'museum-melbourne-museum': {
    address: '11 Nicholson Street, Carlton VIC 3053, Australia',
    website: 'https://museumsvictoria.com.au/melbournemuseum',
    history: [
      'Run by Museums Victoria, whose collections date from 1854. The present museum opened in 2000 in the Carlton Gardens, beside the World Heritage-listed Royal Exhibition Building.',
    ],
    exhibits: [
      { text: 'Horridus, one of the most complete Triceratops skeletons known, on show since 2022.', species: ['triceratops-horridus'] },
      { text: 'Dinosaur Walk, with skeletons including Diprotodon, the giant ice age marsupial, and Tarbosaurus.', species: ['diprotodon-optatum', 'tarbosaurus-bataar'] },
      { text: 'Phar Lap, the champion racehorse of the 1930s.' },
    ],
  },
  'museum-queensland-museum': {
    address: 'Corner of Grey and Melbourne Streets, South Brisbane QLD 4101, Australia',
    website: 'https://www.museum.qld.gov.au',
    history: [
      'Founded in 1862, the museum moved to the South Bank cultural centre in 1986. Its scientists have named many of Queensland’s dinosaurs and marine reptiles from the outback.',
    ],
    exhibits: [
      { text: 'Dinosaurs Unearthed, with Queensland’s own dinosaurs such as Muttaburrasaurus.', species: ['muttaburrasaurus-langdoni', 'kunbarrasaurus-ieversi'] },
      { text: 'The giant marine reptile Kronosaurus from the ancient inland sea.', species: ['kronosaurus-queenslandicus'] },
    ],
  },
  // ── India ──
  'museum-indian-museum': {
    address: '27 Jawaharlal Nehru Road, Kolkata 700016, India',
    website: 'https://indianmuseumkolkata.org',
    history: [
      'Founded by the Asiatic Society of Bengal in 1814, it is India’s oldest and largest museum, covering art, archaeology and natural history.',
    ],
    exhibits: [
      { text: 'The Siwalik gallery, run by the Geological Survey of India, has one of the finest collections of Siwalik Hills fossil mammals, including a skull of the giant straight-tusked elephant Palaeoloxodon namadicus.', species: ['palaeoloxodon-namadicus'] },
    ],
  },
  'museum-regional-museum-of-natural-history-mysore': {
    address: 'T. Narasipura Road, Siddhartha Nagar, Mysuru, Karnataka, India',
    history: [
      'Opened on 20 May 1995 by India’s Ministry of Environment and Forests, as one of a network of regional natural history museums, to show the wildlife of southern India.',
    ],
    exhibits: [
      { text: 'Galleries on the plants and animals of the Western Ghats and southern India, including tigers and Asian elephants.', species: ['panthera-tigris', 'elephas-maximus'] },
    ],
  },
  'museum-regional-museum-of-natural-history-bhopal': {
    address: 'Environment Complex, near Shahpura Lake, Bhopal, Madhya Pradesh, India',
    history: [
      'Opened on 29 September 1997 by India’s Ministry of Environment and Forests, it shows the wildlife and ecology of central India.',
    ],
    exhibits: [
      { text: 'Galleries on central India’s forests and their animals, including tigers.', species: ['panthera-tigris'] },
    ],
  },
  // ── Britain and Ireland ──
  'museum-natural-history-museum-london': {
    address: 'Cromwell Road, South Kensington, London SW7 5BD, United Kingdom',
    website: 'https://www.nhm.ac.uk',
    history: [
      'Its collections began with the cabinet of Sir Hans Sloane, which founded the British Museum in 1753. The natural history collections moved to Alfred Waterhouse’s “cathedral of nature”, decorated with terracotta animals, in 1881, campaigned for by the anatomist Richard Owen, who coined the word dinosaur.',
    ],
    exhibits: [
      { text: 'Hope, the skeleton of a blue whale, hangs in Hintze Hall.', species: ['balaenoptera-musculus'] },
      { text: 'The London specimen of Archaeopteryx, the first skeleton found, bought in 1862.', species: ['archaeopteryx-lithographica'] },
      { text: 'Sophie, the most complete Stegosaurus skeleton known.', species: ['stegosaurus-stenops'] },
      { text: 'A model and bones of the dodo, and fossil sea reptiles found by Mary Anning on the Dorset coast.', species: ['raphus-cucullatus', 'ichthyosaurus-communis', 'plesiosaurus-dolichodeirus'] },
    ],
  },
  'museum-oxford-university-museum-of-natural-history': {
    address: 'Parks Road, Oxford OX1 3PW, United Kingdom',
    website: 'https://www.oumnh.ox.ac.uk',
    history: [
      'Opened in 1860 in a neo-Gothic building of iron and glass. That year it hosted the famous debate on Darwin’s theory of evolution between Thomas Huxley and Bishop Samuel Wilberforce.',
    ],
    exhibits: [
      { text: 'The only soft tissue left of any dodo: its head and foot.', species: ['raphus-cucullatus'] },
      { text: 'The bones of Megalosaurus, the first dinosaur ever named, in 1824.', species: ['megalosaurus-bucklandii'] },
    ],
  },
  'museum-national-museum-of-scotland': {
    address: 'Chambers Street, Edinburgh EH1 1JF, United Kingdom',
    website: 'https://www.nms.ac.uk',
    history: [
      'Its Victorian Grand Gallery opened in 1866, and a new building for the story of Scotland was added in 1998. It brings Scotland’s natural history, science and culture together under one roof.',
    ],
    exhibits: [
      { text: 'A cast of a T. rex skeleton leads the Animal World galleries.', species: ['tyrannosaurus-rex'] },
      { text: 'Fossils from Scotland, among them the early four-legged animals and fishes of the Carboniferous and Devonian.' },
      { text: 'Dolly the sheep, the first mammal cloned from an adult cell, in 1996.' },
    ],
  },
  'museum-natural-history-museum-dublin': {
    address: 'Merrion Street Upper, Dublin 2, Ireland',
    website: 'https://www.museum.ie',
    history: [
      'Opened in 1857, when the explorer David Livingstone gave the opening lecture, and nicknamed the “Dead Zoo”. Its Victorian cabinet-style displays have hardly changed in over a century.',
    ],
    exhibits: [
      { text: 'Skeletons of the giant Irish deer, with antlers up to 3.6 m across, greet visitors.', species: ['megaloceros-giganteus'] },
      { text: 'Irish wildlife and animals from around the world, including a fin whale skeleton hanging from the roof.' },
    ],
  },
  // ── Germany, Austria and Switzerland ──
  'museum-museum-f-r-naturkunde-berlin': {
    address: 'Invalidenstraße 43, 10115 Berlin, Germany',
    website: 'https://www.museumfuernaturkunde.berlin',
    history: [
      'Founded in 1810 with the University of Berlin, it moved to its present building in 1889. It holds over 30 million specimens.',
    ],
    exhibits: [
      { text: 'A Giraffatitan from Tendaguru in Tanzania, one of the tallest mounted dinosaur skeletons in the world.', species: ['giraffatitan-brancai', 'dicraeosaurus-hansemanni', 'kentrosaurus-aethiopicus'] },
      { text: 'The Berlin specimen of Archaeopteryx, the most famous fossil bird of all.', species: ['archaeopteryx-lithographica'] },
    ],
  },
  'museum-senckenberg-natural-history-museum': {
    address: 'Senckenberganlage 25, 60325 Frankfurt am Main, Germany',
    website: 'https://museumfrankfurt.senckenberg.de',
    history: [
      'Opened in 1821 by the Senckenberg Nature Research Society, founded by Frankfurt citizens in 1817. It is one of the largest natural history museums in Germany.',
    ],
    exhibits: [
      { text: 'Fossils from the Messel Pit, a World Heritage site nearby, with early horses and birds preserved with fur, feathers and stomach contents.', species: ['eurohippus-messelensis', 'messelornis-cristata'] },
      { text: 'A mummified Edmontosaurus with skin impressions, and many dinosaur skeletons.', species: ['edmontosaurus-annectens'] },
    ],
  },
  'museum-state-museum-of-natural-history-stuttgart': {
    address: 'Museum am Löwentor, Rosenstein 1, 70191 Stuttgart, Germany',
    website: 'https://www.naturkundemuseum-bw.de',
    history: [
      'Founded in 1791, it is split between Schloss Rosenstein, a palace for living nature, and the Museum am Löwentor for fossils.',
    ],
    exhibits: [
      { text: 'Herds of Plateosaurus from Trossingen, one of the most common Triassic dinosaurs in Germany.', species: ['plateosaurus-trossingensis'] },
      { text: 'Ichthyosaurs from Holzmaden, some preserved with their body outline and unborn young.', species: ['ichthyosaurus-communis'] },
    ],
  },
  'museum-natural-history-museum-vienna': {
    address: 'Burgring 7, 1010 Vienna, Austria',
    website: 'https://www.nhm-wien.ac.at',
    history: [
      'Its collections began with Emperor Francis I, husband of Maria Theresa, in 1750. The palace-like building on the Ringstraße opened in 1889, the twin of the Art History Museum opposite.',
    ],
    exhibits: [
      { text: 'The Venus of Willendorf, a figurine carved about 30,000 years ago.', species: ['homo-sapiens'] },
      { text: 'One of the world’s largest meteorite collections, and a hall of dinosaurs.' },
    ],
  },
  'museum-natural-history-museum-of-bern': {
    address: 'Bernastrasse 15, 3005 Bern, Switzerland',
    website: 'https://www.nmbe.ch',
    history: [
      'Founded in 1832, it is known for its historic dioramas of animals in their habitats, some over 80 years old.',
    ],
    exhibits: [
      { text: 'Barry, the most famous St Bernard rescue dog of the Great St Bernard Pass, said to have saved over 40 lives in the early 1800s.' },
      { text: 'Dioramas of African and Swiss wildlife.' },
    ],
  },
  // ── France ──
  'museum-national-museum-of-natural-history-france': {
    address: '57 rue Cuvier, 75005 Paris, France',
    website: 'https://www.mnhn.fr',
    history: [
      'Founded in 1793 from the Royal Garden of Medicinal Plants of 1635. Scientists such as Cuvier, who showed that species can go extinct, and Lamarck worked here.',
    ],
    exhibits: [
      { text: 'The Gallery of Palaeontology and Comparative Anatomy, opened in 1898, with hundreds of skeletons in rows.' },
      { text: 'The Grand Gallery of Evolution, with a parade of African animals, and a hall of endangered and extinct species.', species: ['raphus-cucullatus'] },
    ],
  },
  'museum-mus-um-de-toulouse': {
    address: '35 allées Jules Guesde, 31000 Toulouse, France',
    website: 'https://museum.toulouse-metropole.fr',
    history: [
      'Opened to the public in 1865. Its director Jean-Baptiste Noulet was a pioneer of prehistory, finding evidence of how old humanity is. It holds over 2.5 million objects.',
    ],
    exhibits: [
      { text: 'A wall of animal skeletons in glass cases, and prehistoric finds from the many sites of south-western France.' },
    ],
  },
  'museum-mus-e-des-confluences': {
    address: '86 quai Perrache, 69002 Lyon, France',
    website: 'https://www.museedesconfluences.fr',
    history: [
      'Opened on 20 December 2014 in a building like a cloud of steel and glass where the Rhône and Saône rivers meet. It inherited Lyon’s natural history museum, whose collections go back to the 17th century.',
    ],
    exhibits: [
      { text: 'The story of life and of human societies, with fossils, animals and objects from around the world.' },
    ],
  },
  // ── Italy, Spain and Portugal ──
  'museum-museo-civico-di-storia-naturale-di-milano': {
    address: 'Corso Venezia 55, 20121 Milan, Italy',
    website: 'https://www.comune.milano.it/museostorianaturale',
    history: [
      'Founded on 7 May 1838, it is Milan’s oldest museum, housed in a grand building in the Indro Montanelli public gardens.',
    ],
    exhibits: [
      { text: 'Rooms of dinosaurs, minerals and Italian fossils, and dozens of dioramas of animals in their habitats.' },
    ],
  },
  'museum-la-specola': {
    address: 'Via Romana 17, 50125 Florence, Italy',
    website: 'https://www.sma.unifi.it',
    history: [
      'Opened in 1775 by Grand Duke Peter Leopold, it is one of the oldest science museums in Europe. Its name comes from the astronomical observatory (specola) on its roof.',
    ],
    exhibits: [
      { text: 'Hundreds of 18th-century anatomical wax models of the human body.', species: ['homo-sapiens'] },
      { text: 'A 17th-century stuffed hippopotamus that was once a Medici pet in the Boboli Gardens.', species: ['hippopotamus-amphibius'] },
    ],
  },
  'museum-national-museum-of-natural-sciences': {
    address: 'Calle de José Gutiérrez Abascal 2, 28006 Madrid, Spain',
    website: 'https://www.mncn.csic.es',
    history: [
      'Founded by King Charles III in 1771 as the Royal Cabinet of Natural History, it is one of the oldest natural history museums in the world.',
    ],
    exhibits: [
      { text: 'The first fossil skeleton of Megatherium ever found, sent from Argentina in 1788 and still mounted as it was then.', species: ['megatherium-americanum'] },
      { text: 'A cast of the Diplodocus “Dippy”, given by Andrew Carnegie to King Alfonso XIII in 1913.', species: ['diplodocus-carnegii'] },
    ],
  },
  'museum-jurassic-museum-of-asturias': {
    address: 'Rasa de San Telmo, Colunga, Asturias, Spain',
    website: 'https://www.museojurasicoasturias.com',
    history: [
      'Opened in 2004 on a clifftop above the “Dinosaur Coast”, in a building shaped like a three-toed dinosaur footprint.',
    ],
    exhibits: [
      { text: 'Jurassic footprints of large theropods and stegosaurs from the Asturian coast, with full-size dinosaur skeletons and models.' },
    ],
  },
  'museum-museu-da-lourinh': {
    address: 'Rua João Luís de Moura 95, Lourinhã, Portugal',
    website: 'https://www.museulourinha.org',
    history: [
      'Run by a local society of amateur and professional scientists since 1984, it shows the dinosaurs of the Lourinhã Formation, found in the sea cliffs nearby. The Dino Parque Lourinhã nearby has life-size models.',
    ],
    exhibits: [
      { text: 'A clutch of Lourinhanosaurus eggs with embryos inside, among the oldest dinosaur embryos known.', species: ['lourinhanosaurus-antunesi'] },
      { text: 'Bones of the long-necked stegosaur Miragaia and the giant predator Torvosaurus gurneyi.', species: ['miragaia-longicollum', 'torvosaurus-gurneyi', 'dinheirosaurus-lourinhanensis'] },
    ],
  },
  // ── Low Countries and Scandinavia ──
  'museum-naturalis-biodiversity-center': {
    address: 'Darwinweg 2, 2333 CR Leiden, Netherlands',
    website: 'https://www.naturalis.nl',
    history: [
      'The Dutch national natural history museum, whose collections go back to 1820. Its new building opened in 2019, and it holds about 42 million specimens.',
    ],
    exhibits: [
      { text: 'Trix, a female T. rex skeleton from Montana, one of the most complete known.', species: ['tyrannosaurus-rex'] },
      { text: 'Eugène Dubois’s finds of Java Man, the first fossils of Homo erectus, found in 1891.', species: ['homo-erectus'] },
    ],
  },
  'museum-royal-belgian-institute-of-natural-sciences': {
    address: 'Rue Vautier 29, 1000 Brussels, Belgium',
    website: 'https://www.naturalsciences.be',
    history: [
      'Founded in 1846. Its Dinosaur Gallery is one of the largest in Europe.',
    ],
    exhibits: [
      { text: 'The Iguanodons of Bernissart, found in a Belgian coal mine in 1878: about 30 skeletons, many still displayed as they lay.', species: ['iguanodon-bernissartensis'] },
    ],
  },
  'museum-swedish-museum-of-natural-history': {
    address: 'Frescativägen 40, 114 18 Stockholm, Sweden',
    website: 'https://www.nrm.se',
    history: [
      'Grew from the Royal Swedish Academy of Sciences’ collections, begun in 1739; the scientist Carl Linnaeus was one of the Academy’s founders. Its building opened in 1916.',
    ],
    exhibits: [
      { text: 'Swedish nature from the Ice Age to today, and a large hall of fossils.' },
    ],
  },
  'museum-natural-history-museum-oslo': {
    address: 'Sars’ gate 1, 0562 Oslo, Norway',
    website: 'https://www.nhm.uio.no',
    history: [
      'Part of the University of Oslo, with a botanical garden and geology and zoology museums. Its collections date from 1814.',
    ],
    exhibits: [
      { text: 'Ida, the nearly complete fossil primate Darwinius from the Messel Pit in Germany, described in 2009.', species: ['darwinius-masillae'] },
      { text: 'Fossils from Svalbard, among them the Jurassic sea reptiles of the Slottsmøya site.' },
    ],
  },
  'museum-natural-history-museum-of-denmark': {
    address: 'In the Botanical Garden, Copenhagen K, Denmark',
    website: 'https://snm.dk/en',
    history: [
      'Brings together Denmark’s zoological, geological and botanical museums, whose collections go back to the 17th century. Its old address on Øster Voldgade closed on 1 November 2026, and a new museum building in the Botanical Garden opens on 6 March 2027.',
    ],
    exhibits: [
      { text: 'The new museum’s eight exhibitions include an Ocean Hall; its collections hold one of the few dodo skulls in the world.', species: ['raphus-cucullatus'] },
    ],
  },
  'museum-finnish-museum-of-natural-history': {
    address: 'Pohjoinen Rautatiekatu 13, 00100 Helsinki, Finland',
    website: 'https://luomus.fi/en',
    history: [
      'Part of the University of Helsinki, it shows Finnish and world nature in a 1913 neo-baroque building.',
    ],
    exhibits: [
      { text: 'Finnish wildlife, such as the bear, wolf and lynx, and a hall on the history of life.', species: ['canis-lupus'] },
    ],
  },
  // ── Central and Eastern Europe ──
  'museum-museum-of-evolution-of-polish-academy-of-sciences': {
    address: 'Palace of Culture and Science, Plac Defilad 1, 00-901 Warsaw, Poland',
    website: 'https://muzeumewolucji.pl',
    history: [
      'Began in 1968 with an exhibition of the finds of the Polish–Mongolian palaeontological expeditions to the Gobi Desert, led by Zofia Kielan-Jaworowska. It is in Warsaw’s Palace of Culture and Science.',
    ],
    exhibits: [
      { text: 'Gobi dinosaurs found by the expeditions: the giant sauropod Opisthocoelicaudia, the long-armed Deinocheirus and Tarbosaurus.', species: ['opisthocoelicaudia-skarzynskii', 'deinocheirus-mirificus', 'tarbosaurus-bataar'] },
    ],
  },
  'museum-ba-t-w-jurassic-park': {
    address: 'Bałtów 8a, 27-423 Bałtów, Poland',
    website: 'https://www.juraparkbaltow.pl',
    history: [
      'Poland’s first dinosaur park, set up after dinosaur footprints were found in a quarry nearby. It has about 100 life-size dinosaur models along forest trails.',
    ],
    exhibits: [
      { text: 'A museum of fossils, including dinosaur footprints from the Świętokrzyskie region.' },
    ],
  },
  'museum-national-museum': {
    address: 'Václavské náměstí 68, 110 00 Prague 1, Czechia',
    website: 'https://www.nm.cz',
    history: [
      'Founded in 1818, it is the oldest and largest museum in Czechia. Its Historical Building at the top of Wenceslas Square reopened in 2018 after a long renovation.',
    ],
    exhibits: [
      { text: 'The Zoology hall and the Hall of Evolution, with a fin whale skeleton and fossils from Bohemia.' },
    ],
  },
  'museum-hungarian-natural-history-museum': {
    address: 'Ludovika tér 2–6, 1083 Budapest, Hungary',
    website: 'https://www.nhmus.hu',
    history: [
      'Founded in 1802 as part of the Hungarian National Museum.',
    ],
    exhibits: [
      { text: 'Dinosaurs from Iharkút in western Hungary, the country’s richest dinosaur site, such as the small horned dinosaur Ajkaceratops.', species: ['ajkaceratops-kozmai'] },
    ],
  },
  'museum-national-museum-of-natural-history-at-the-national-academy-of-sciences-of-ukraine': {
    address: 'Bohdana Khmelnytskoho Street 15, Kyiv 01030, Ukraine',
    website: 'https://museumkiev.org',
    history: [
      'Set up in 1966 by joining five museums (geology, palaeontology, zoology, botany and archaeology), it is Ukraine’s largest natural history museum, with about 30,000 exhibits in 24 halls.',
    ],
    exhibits: [
      { text: 'A mammoth skeleton found in Kyiv, and dwellings built of mammoth bones by Ice Age people.', species: ['mammuthus-primigenius', 'homo-sapiens'] },
    ],
  },
  'museum-croatian-natural-history-museum': {
    address: 'Demetrova 1, 10000 Zagreb, Croatia',
    website: 'https://www.hpm.hr',
    history: [
      'Founded in 1846 as part of the National Museum. Damaged in the 2020 Zagreb earthquake, its Amadeo Palace was rebuilt and reopened in October 2024.',
    ],
    exhibits: [
      { text: 'Fossils of the Krapina Neanderthals, one of the largest collections of Neanderthal remains from one site.', species: ['homo-neanderthalensis'] },
    ],
  },
  'museum-grigore-antipa-national-museum-of-natural-history': {
    address: 'Șoseaua Pavel D. Kiseleff 1, Bucharest 011341, Romania',
    website: 'https://www.antipa.ro',
    history: [
      'Founded in 1834 and named after the zoologist Grigore Antipa, who ran it from 1893 and pioneered habitat dioramas in Europe.',
    ],
    exhibits: [
      { text: 'A mounted skeleton of the giant elephant relative Deinotherium.', species: ['deinotherium-giganteum'] },
    ],
  },
  'museum-national-museum-of-natural-history-bulgaria': {
    address: 'Tsar Osvoboditel Boulevard 1, 1000 Sofia, Bulgaria',
    website: 'https://www.nmnhs.com',
    history: [
      'Founded in 1889 as the natural history museum of Prince Ferdinand, it is one of the largest natural history museums in the Balkans.',
    ],
    exhibits: [
      { text: 'Minerals, fossils and Bulgarian wildlife.' },
    ],
  },
  'museum-natural-history-museum-in-belgrade': {
    address: 'Gallery: Mali Kalemegdan 5, Belgrade; offices: Njegoševa 51, Belgrade, Serbia',
    website: 'https://www.nhmbeo.rs',
    history: [
      'Founded in 1895, with the botanist Josif Pančić as its father figure. It has no permanent exhibition: its 1.6 million specimens are shown in changing exhibitions at its gallery in the Kalemegdan fortress.',
    ],
  },
  'museum-slovenian-museum-of-natural-history': {
    address: 'Prešernova cesta 20, 1000 Ljubljana, Slovenia',
    website: 'https://www.pms-lj.si',
    history: [
      'Founded in 1821 as the Provincial Museum of Carniola, it shares a building with the National Museum of Slovenia.',
    ],
    exhibits: [
      { text: 'A mammoth skeleton found at Nevlje in 1938, one of the best preserved in Europe and the museum’s symbol.', species: ['mammuthus-primigenius'] },
      { text: 'The olm, a blind cave salamander found in Slovenia’s caves.', species: ['proteus-anguinus'] },
    ],
  },
  'museum-goulandris-natural-history-museum': {
    address: 'Othonos 100, 145 62 Kifissia, Athens, Greece',
    website: 'https://www.gnhm.gr/en',
    history: [
      'Founded in 1964 by Angelos and Niki Goulandris, it was the first natural history museum of its kind in Greece. Its GAIA Centre has interactive exhibits on climate and the environment.',
    ],
    exhibits: [
      { text: 'Greek plants, animals, shells, rocks and fossils.' },
    ],
  },
  // ── Middle East and Africa ──
  'museum-steinhardt-museum-of-natural-history': {
    address: 'Klausner Street 12, Tel Aviv University, Tel Aviv, Israel',
    website: 'https://smnh.tau.ac.il/en/',
    history: [
      'Opened in 2018 at Tel Aviv University, it houses about 5.5 million specimens, Israel’s national collections of plants, animals and human remains.',
    ],
    exhibits: [
      { text: 'The wildlife of Israel and the region, from its national collections.' },
    ],
  },
  'museum-egyptian-geological-museum': {
    address: 'Maadi, Cairo, Egypt',
    history: [
      'Founded by the Geological Survey of Egypt and opened in 1904, it is one of the oldest geology museums in Africa. Its original downtown building was demolished in 1980 to build the Tahrir Square metro station.',
    ],
    exhibits: [
      { text: 'Fossil mammals found in the Fayum since 1898, including the twin-horned Arsinoitherium, the museum’s symbol.', species: ['arsinoitherium-zitteli'] },
    ],
  },
  'museum-nairobi-national-museum': {
    address: 'Museum Hill, off Uhuru Highway, Nairobi, Kenya',
    website: 'https://museums.or.ke',
    history: [
      'Began with the East Africa Natural History Society, whose first museum opened in 1910. The present museum on Museum Hill opened in 1930 and is the flagship of the National Museums of Kenya.',
    ],
    exhibits: [
      { text: 'Ahmed, the great tusker of Marsabit, protected by presidential decree; his skeleton and tusks are in the Great Hall of Mammals.', species: ['loxodonta-africana'] },
      { text: 'The Cradle of Humankind gallery, with famous early human fossils found in Kenya.', species: ['homo-erectus'] },
      { text: 'A snake park and a gallery of the 1,300 species of East African birds.' },
    ],
  },
  'museum-national-museum-of-ethiopia': {
    address: 'King George VI Street, near Addis Ababa University, Addis Ababa, Ethiopia',
    history: [
      'Ethiopia’s national museum, in central Addis Ababa. It holds some of the most important human-ancestor fossils ever found; they sometimes travel abroad, so check what is on show.',
    ],
    exhibits: [
      { text: 'Lucy, a 3.2-million-year-old Australopithecus afarensis found in 1974, and Selam, a child of the same species.', species: ['australopithecus-afarensis'] },
    ],
  },
  'museum-natural-history-museum-of-zimbabwe': {
    address: 'Centenary Park, corner of Park Road and Leopold Takawira Avenue, Bulawayo, Zimbabwe',
    website: 'https://naturalhistorymuseumzimbabwe.com',
    history: [
      'Began in 1901 as the Rhodesia Museum, and opened in its present building in Centenary Park in 1964. It holds Zimbabwe’s national natural science collections.',
    ],
    exhibits: [
      { text: 'A mounted African elephant said to be the second largest in the world, and dioramas of Zimbabwe’s wildlife.', species: ['loxodonta-africana'] },
    ],
  },
  'museum-iziko-south-african-museum': {
    address: '25 Queen Victoria Street, Gardens, Cape Town 8001, South Africa',
    website: 'https://www.iziko.org.za',
    history: [
      'Founded in 1825, it is South Africa’s oldest museum, and has stood in the Company’s Garden since 1897.',
    ],
    exhibits: [
      { text: 'The Whale Well, with a 20.5 m blue whale skeleton.', species: ['balaenoptera-musculus'] },
      { text: 'A cast of the first living coelacanth found, caught off South Africa in 1938.', species: ['latimeria-chalumnae'] },
    ],
  },
  'museum-ditsong-national-museum-of-natural-history': {
    address: '432 Paul Kruger Street, Pretoria 0001, South Africa',
    website: 'https://ditsong.org.za',
    history: [
      'Founded in 1892 as the Transvaal Museum and renamed in 2010. Its scientists described many of the early human fossils of the Cradle of Humankind.',
    ],
    exhibits: [
      { text: 'Fossils from the Cradle of Humankind caves near Johannesburg, and halls of African mammals and birds.', species: ['homo-sapiens'] },
    ],
  },
  // ── Asia ──
  'museum-national-museum-of-nature-and-science': {
    address: '7-20 Ueno Park, Taitō, Tokyo 110-8718, Japan',
    website: 'https://www.kahaku.go.jp/english/',
    history: [
      'Founded in 1877, it is one of Japan’s oldest museums. Its historic Japan Gallery building opened in 1931.',
    ],
    exhibits: [
      { text: 'The Japanese sea reptile Futabasaurus, and dinosaurs including a Tyrannosaurus and Triceratops in the Global Gallery.', species: ['tyrannosaurus-rex', 'triceratops-horridus'] },
      { text: 'Hachikō, the famous loyal Akita dog of Shibuya Station.' },
    ],
  },
  'museum-fukui-prefectural-dinosaur-museum': {
    address: '51-11 Terao, Muroko, Katsuyama, Fukui 911-8601, Japan',
    website: 'https://www.dinosaur.pref.fukui.jp/en/',
    history: [
      'Opened in 2000 near the Kitadani quarry, Japan’s richest dinosaur site, in a domed building. It is one of the largest dinosaur museums in Asia.',
    ],
    exhibits: [
      { text: 'Dinosaurs found in Fukui, such as Fukuiraptor and Fukuisaurus, and dozens of skeletons from around the world.', species: ['fukuiraptor-kitadaniensis'] },
    ],
  },
  'museum-osaka-museum-of-natural-history': {
    address: '1-23 Nagai Park, Higashisumiyoshi-ku, Osaka 546-0034, Japan',
    website: 'https://www.omnh.jp',
    history: [
      'Founded in 1950, it moved to Nagai Park in 1974, beside the botanical garden.',
    ],
    exhibits: [
      { text: 'Whale skeletons, including a fin whale, and a life-size model of Naumann’s elephant, which lived in Japan in the ice ages.' },
    ],
  },
  'museum-national-science-museum-daejeon': {
    address: '481 Daedeok-daero, Yuseong-gu, Daejeon, South Korea',
    website: 'https://www.science.go.kr',
    history: [
      'First opened in Seoul in 1926, it moved to Daejeon in 1990 and is Korea’s national science museum.',
    ],
    exhibits: [
      { text: 'The Natural History Hall, with Korean dinosaurs and other Mesozoic skeletons.' },
    ],
  },
  'museum-goseong-dinosaur-museum': {
    address: '618 Jaranman-ro, Hai-myeon, Goseong-gun, Gyeongsangnam-do, South Korea',
    website: 'https://museum.goseong.go.kr',
    history: [
      'Opened on 9 November 2004 in Sangjogam park, by a coast with thousands of dinosaur footprints, one of the richest track sites in the world. It is being renovated for the first time in 20 years and was closed during 2026, so check before visiting.',
    ],
    exhibits: [
      { text: 'Footprints found in Goseong County, and real eggs of Oviraptor and Protoceratops.', species: ['oviraptor-philoceratops', 'protoceratops-andrewsi'] },
    ],
  },
  'museum-national-museum-of-natural-science': {
    address: 'No. 1 Guanqian Road, North District, Taichung 404, Taiwan',
    website: 'https://www.nmns.edu.tw/en/',
    history: [
      'Founded in 1986, it is one of Taiwan’s most visited museums, with a botanical garden and a tropical rainforest greenhouse.',
    ],
    exhibits: [
      { text: 'A dinosaur gallery with a moving T. rex and Velociraptors.', species: ['tyrannosaurus-rex', 'velociraptor-mongoliensis'] },
    ],
  },
  'museum-lee-kong-chian-natural-history-museum': {
    address: '2 Conservatory Drive, Singapore 117377',
    website: 'https://lkcnhm.nus.edu.sg',
    history: [
      'Part of the National University of Singapore, opened in 2015. Its collections began with the Raffles Museum, founded in 1849.',
    ],
    exhibits: [
      { text: 'Three diplodocid sauropod skeletons, a family nicknamed Prince, Apollonia and Twinky, found in Wyoming.', species: ['diplodocus-carnegii'] },
      { text: 'A sperm whale skeleton from a whale that washed up in Singapore in 2015.', species: ['physeter-macrocephalus'] },
    ],
  },
  'museum-national-museum-of-natural-history-manila': {
    address: 'Agrifina Circle, T.M. Kalaw Street, Rizal Park, Manila, Philippines',
    website: 'https://www.nationalmuseum.gov.ph',
    history: [
      'Opened on 18 May 2018 in the former Department of Agriculture building, with a “Tree of Life” of steel rising through the middle. Entry is free.',
    ],
    exhibits: [
      { text: 'Lolong, the largest crocodile ever held in captivity, 6.17 m long.', species: ['crocodylus-porosus'] },
      { text: 'The Philippine eagle and other animals found only in the Philippines.', species: ['pithecophaga-jefferyi'] },
    ],
  },
  'museum-bogor-zoology-museum': {
    address: 'Jalan Ir. H. Juanda 9, Paledang, Bogor, West Java, Indonesia',
    history: [
      'Started as a zoology laboratory in 1894 beside the Bogor Botanical Gardens and opened as a museum in 1901. It is Indonesia’s main zoological museum.',
    ],
    exhibits: [
      { text: 'The skeleton of a blue whale, the largest in Indonesia.', species: ['balaenoptera-musculus'] },
      { text: 'Mounted animals from across the Indonesian islands.' },
    ],
  },
  'museum-bandung-geological-museum': {
    address: 'Jalan Diponegoro 57, Bandung, West Java, Indonesia',
    website: 'https://museum.geologi.esdm.go.id',
    history: [
      'Opened on 16 May 1929 in an Art Deco building, for the Fourth Pacific Science Congress held in Bandung.',
    ],
    exhibits: [
      { text: 'Fossils of animals that lived on Java, such as the elephant relative Stegodon, and a cast of a T. rex skeleton.', species: ['stegodon-florensis', 'tyrannosaurus-rex'] },
    ],
  },
  'museum-sirindhorn-museum': {
    address: 'Non Buri, Sahatsakhan District, Kalasin, Thailand',
    history: [
      'Opened in 2008 beside the Phu Kum Khao dig site, where over 700 bones of at least seven sauropods were found, and named after Princess Maha Chakri Sirindhorn.',
    ],
    exhibits: [
      { text: 'Phuwiangosaurus, the first sauropod found in Thailand, named after the princess.', species: ['phuwiangosaurus-sirindhornae'] },
    ],
  },
  'museum-central-museum-of-dinosaurs-of-mongolia': {
    address: 'Former Lenin Museum building, Ulaanbaatar, Mongolia',
    history: [
      'Founded in 2013 after a US court returned a Tarbosaurus skeleton that had been smuggled out of Mongolia and sold at auction. It later merged with Mongolia’s natural history museum.',
    ],
    exhibits: [
      { text: 'The repatriated Tarbosaurus bataar skeleton, and a Tarbosaurus skull returned by the actor Nicolas Cage.', species: ['tarbosaurus-bataar'] },
      { text: 'Other Gobi dinosaurs, such as Saurolophus, Oviraptor and ankylosaurs.', species: ['saurolophus-angustirostris', 'oviraptor-philoceratops'] },
    ],
  },
  'museum-gobi-museum-of-nature-and-history': {
    address: 'Dalanzadgad, Ömnögovi Province, Mongolia',
    history: [
      'Opened on 18 May 2022 in the capital of the South Gobi province, with over 4,000 objects on the Gobi’s nature, history and peoples.',
    ],
    exhibits: [
      { text: 'Dinosaur bones and eggs from the South Gobi, home of famous fossil sites such as the Flaming Cliffs.', species: ['protoceratops-andrewsi'] },
    ],
  },
  // ── Latin America ──
  'museum-la-plata-museum': {
    address: 'Paseo del Bosque, La Plata, Buenos Aires Province, Argentina',
    website: 'https://www.museo.fcnym.unlp.edu.ar',
    history: [
      'Opened on 19 November 1888 by the explorer Francisco Moreno, who gave his own collections. Part of the National University of La Plata, it is one of the great natural history museums of South America.',
    ],
    exhibits: [
      { text: 'Giant ice age mammals of the pampas, such as ground sloths and glyptodonts, and the sabre-tooth Smilodon.', species: ['megatherium-americanum', 'smilodon-populator'] },
    ],
  },
  'museum-bernardino-rivadavia-natural-sciences-argentine-museum': {
    address: 'Avenida Ángel Gallardo 470, C1405DJR Buenos Aires, Argentina',
    website: 'https://www.macnconicet.gob.ar',
    history: [
      'Proposed by Bernardino Rivadavia in 1812 and opened in 1823, it is Argentina’s oldest museum. Its building in Parque Centenario was built for it.',
    ],
    exhibits: [
      { text: 'Argentine dinosaurs such as the titanosaur Bonatitan and the long-snouted raptor Austroraptor.' },
      { text: 'Giant ice age mammals of the pampas.', species: ['megatherium-americanum'] },
    ],
  },
  'museum-egidio-feruglio-paleontology-museum': {
    address: 'Avenida Fontana, Trelew, Chubut, Argentina',
    website: 'https://www.mef.org.ar',
    history: [
      'Founded in 1990 and named after the Italian geologist Egidio Feruglio, it reopened in November 2024 after a decade-long expansion. Its team dug up Patagotitan, and casts made in its workshop have gone on show abroad, including in London.',
    ],
    exhibits: [
      { text: 'A full skeleton of Patagotitan, one of the largest animals ever to walk on land.', species: ['patagotitan-mayorum'] },
    ],
  },
  'museum-museo-del-desierto': {
    address: 'Prolongación Pérez Treviño 3745, Centro Metropolitano Las Maravillas, Saltillo, Coahuila, Mexico',
    history: [
      'Opened on 25 November 1999, it shows the Chihuahuan Desert and the dinosaurs found in Coahuila, many of them named by its scientists.',
    ],
    exhibits: [
      { text: 'Coahuila’s dinosaurs, such as the crested duck-bill Velafrons and the hard-headed predator Xenovenator.', species: ['velafrons-coahuilensis', 'xenovenator-espinosai'] },
      { text: 'A T. rex skeleton and the giant pterosaur Quetzalcoatlus.', species: ['tyrannosaurus-rex', 'quetzalcoatlus-northropi'] },
    ],
  },
  'museum-chilean-national-museum-of-natural-history': {
    address: 'Parque Quinta Normal, Santiago, Chile',
    website: 'https://www.mnhn.gob.cl',
    history: [
      'Founded on 14 September 1830 by the French naturalist Claude Gay, it is one of the oldest natural history museums in South America.',
    ],
    exhibits: [
      { text: 'A 17 m blue whale skeleton in the central hall.', species: ['balaenoptera-musculus'] },
      { text: 'Mesozoic vertebrates, including Carnotaurus, and the Plomo mummy, an Inca child found in the Andes.', species: ['carnotaurus-sastrei'] },
    ],
  },
  'museum-museum-of-natural-history-lima': {
    address: 'Avenida Arenales 1256, Jesús María, Lima, Peru',
    website: 'https://museohn.unmsm.edu.pe',
    history: [
      'Founded on 28 February 1918 by the National University of San Marcos, it moved to its present site in 1934.',
    ],
    exhibits: [
      { text: 'Fossils of Livyatan, a giant predatory sperm whale that hunted off Peru 10 million years ago.', species: ['livyatan-melvillei'] },
      { text: 'Peruvian wildlife and ice age mammals, such as giant ground sloths.' },
    ],
  },
  // ── New Zealand ──
  'museum-te-papa': {
    address: '55 Cable Street, Wellington 6011, New Zealand',
    website: 'https://www.tepapa.govt.nz',
    history: [
      'Te Papa Tongarewa, New Zealand’s national museum, opened on the Wellington waterfront in 1998. Its collections go back to the Colonial Museum of 1865. Entry is free.',
    ],
    exhibits: [
      { text: 'A colossal squid caught in the Ross Sea in 2007, the only one of its kind on display anywhere.', species: ['mesonychoteuthis-hamiltoni'] },
      { text: 'The extinct giant moa and Haast’s eagle, the largest eagle known, which hunted them.', species: ['dinornis-robustus', 'hieraaetus-moorei'] },
    ],
  },
  // ── Zoos: North America ──
  'zoo-san-diego-zoo': {
    address: '2920 Zoo Drive, Balboa Park, San Diego, CA 92101, USA',
    website: 'https://zoo.sandiegozoo.org',
    history: ['Founded in 1916 by the doctor Harry Wegeforth, with animals left over from an exhibition in Balboa Park. It pioneered moated, cage-free enclosures and runs the San Diego Zoo Safari Park.'],
    conservation: [
      { text: 'A founding partner of the California condor recovery programme: the first condor chick conceived and hatched in a zoo hatched here in 1988, and over 200 condors hatched at its Safari Park have been released into the wild.', species: ['gymnogyps-californianus'] },
      { text: 'Its Frozen Zoo keeps living cells from over 1,000 species, used in efforts to clone endangered animals.' },
    ],
  },
  'zoo-bronx-zoo': {
    address: '2300 Southern Boulevard, Bronx, NY 10460, USA',
    website: 'https://bronxzoo.com',
    history: ['Opened on 8 November 1899 by the New York Zoological Society, now the Wildlife Conservation Society (WCS), which has its headquarters here and runs conservation projects around the world.'],
    conservation: [
      { text: 'In 1907, when bison were nearly gone, the zoo sent 15 of its bison to Oklahoma’s Wichita Mountains to start a new wild herd, one of the first reintroductions of an animal anywhere.', species: ['bison-bison'] },
    ],
  },
  'zoo-national-zoological-park': {
    address: '3001 Connecticut Avenue NW, Washington, DC 20008, USA',
    website: 'https://nationalzoo.si.edu',
    history: ['The Smithsonian’s National Zoo, founded in 1889 in Rock Creek Park. Entry is free. Its Conservation Biology Institute runs a breeding and research centre at Front Royal, Virginia.'],
    conservation: [
      { text: 'Giant pandas Bao Li and Qing Bao arrived in 2024, continuing five decades of panda research with China.', species: ['ailuropoda-melanoleuca'] },
      { text: 'Helped return zoo-born golden lion tamarins to Brazil’s Atlantic Forest from the 1980s.', species: ['leontopithecus-rosalia'] },
      { text: 'Breeds black-footed ferrets, once thought extinct, and helped produce the first cloned ferrets.', species: ['mustela-nigripes'] },
    ],
  },
  'zoo-toronto-zoo': {
    address: '2000 Meadowvale Road, Toronto, Ontario M1B 5K7, Canada',
    website: 'https://www.torontozoo.com',
    history: ['Opened in 1974 in the Rouge Valley, it is Canada’s largest zoo.'],
    conservation: [
      { text: 'Since 1997 it has bred Vancouver Island marmots, one of the rarest mammals in North America: over 140 of its pups have been released.' },
      { text: 'Raised over 500 black-footed ferret kits for release between 1993 and 2025, and head-starts threatened Blanding’s turtles in Ontario.', species: ['mustela-nigripes'] },
    ],
  },
  'zoo-calgary-zoo': {
    address: '1300 Zoo Road NE, Calgary, Alberta T2E 7V6, Canada',
    website: 'https://www.calgaryzoo.com',
    history: ['Its zoological society was founded in 1929. It is now the Wilder Institute/Calgary Zoo, with Canada’s largest breeding centre for returning endangered species to the wild.'],
    conservation: [
      { text: 'Breeds whooping cranes, which fell to about 20 birds in the 1940s, for recovery in the wild.', species: ['grus-americana'] },
      { text: 'Breeds Vancouver Island marmots and northern leopard frogs for release.' },
    ],
  },
  'zoo-africam-safari': {
    address: 'Boulevard Capitán Carlos Camacho Espíritu km 16.5, Puebla, Mexico',
    website: 'https://www.africamsafari.com',
    history: ['Opened on 2 April 1972 from the private collection of Carlos Camacho Espíritu. Visitors drive through large paddocks where animals roam.'],
    conservation: [
      { text: 'Takes part in breeding, rehabilitation and reintroduction programmes for Mexican species such as the jaguar and macaws, and a tapir project in Quintana Roo.', species: ['panthera-onca', 'ara-macao'] },
    ],
  },
  // ── Australia and New Zealand ──
  'zoo-taronga-zoo': {
    address: 'Bradleys Head Road, Mosman NSW 2088, Australia',
    website: 'https://taronga.org.au',
    history: ['Opened on 7 October 1916 on the shore of Sydney Harbour; visitors arrive by ferry. Its name comes from a word for “beautiful view”.'],
    conservation: [
      { text: 'Breeds critically endangered native species for release, such as the regent honeyeater and the corroboree frogs of the Snowy Mountains.', species: ['anthochaera-phrygia'] },
      { text: 'Its Wildlife Hospital treats sick and injured native animals, including platypuses and koalas.', species: ['ornithorhynchus-anatinus', 'phascolarctos-cinereus'] },
    ],
  },
  'zoo-melbourne-zoo': {
    address: 'Elliott Avenue, Parkville VIC 3052, Australia',
    website: 'https://www.zoo.org.au/melbourne',
    history: ['Opened in 1862, it is Australia’s oldest zoo.'],
    conservation: [
      { text: 'Saved the Lord Howe Island stick insect, thought extinct for 80 years until a few were found on the sea stack Ball’s Pyramid. From two pairs collected in 2003, the zoo has bred thousands for return to Lord Howe Island.', species: ['dryococelus-australis'] },
    ],
  },
  'zoo-australia-zoo': {
    address: '1638 Steve Irwin Way, Beerwah QLD 4519, Australia',
    website: 'https://australiazoo.com.au',
    history: ['Opened by Bob and Lyn Irwin in 1970 as the Beerwah Reptile and Fauna Park, and made famous by their son Steve Irwin, “the Crocodile Hunter”.'],
    conservation: [
      { text: 'With the University of Queensland, it runs one of the world’s largest crocodile research projects, tracking saltwater crocodiles in Cape York.', species: ['crocodylus-porosus'] },
      { text: 'The Australia Zoo Wildlife Hospital treats thousands of injured native animals every year.', species: ['phascolarctos-cinereus'] },
    ],
  },
  'zoo-auckland-zoo': {
    address: 'Motions Road, Western Springs, Auckland 1022, New Zealand',
    website: 'https://www.aucklandzoo.co.nz',
    history: ['Opened on 16 December 1922 at Western Springs.'],
    conservation: [
      { text: 'Its vets care for kākāpō, the flightless night parrot, and led the response to a deadly fungal outbreak in 2019.', species: ['strigops-habroptilus', 'porphyrio-hochstetteri'] },
      { text: 'Hatches wild kiwi eggs through Operation Nest Egg and has released over 400 kiwi.', species: ['apteryx-mantelli'] },
    ],
  },
  // ── Britain and Ireland ──
  'zoo-london-zoo': {
    address: 'Outer Circle, Regent’s Park, London NW1 4RY, United Kingdom',
    website: 'https://www.londonzoo.org',
    history: ['Opened in 1828 by the Zoological Society of London as a collection for scientific study, it is the world’s oldest scientific zoo, opened to the public in 1847.'],
    conservation: [
      { text: 'Since 1994 it has led the breeding of Partula snails, wiped out on Pacific islands by an introduced predatory snail. In 2023 thousands were flown back to Tahiti and Moorea, the largest reintroduction ever made.' },
    ],
  },
  'zoo-chester-zoo': {
    address: 'Caughall Road, Upton-by-Chester, Chester CH2 1LH, United Kingdom',
    website: 'https://www.chesterzoo.org',
    history: ['Founded in 1931 by George Mottershead, whose idea of a “zoo without bars” shaped it. It is the most visited zoo in the UK.'],
    conservation: [
      { text: 'A leading breeder of the critically endangered eastern black rhino, helped by its hormone lab, and since 1999 a supporter of rhino protection in Africa.', species: ['diceros-bicornis'] },
      { text: 'Breeds Asian elephants and leads research on a virus that kills young elephants.', species: ['elephas-maximus'] },
    ],
  },
  'zoo-edinburgh-zoo': {
    address: '134 Corstorphine Road, Edinburgh EH12 6TS, United Kingdom',
    website: 'https://www.edinburghzoo.org.uk',
    history: ['Opened in 1913 by the Royal Zoological Society of Scotland. It was one of the first zoos to breed penguins, and its daily penguin parade began in 1951.'],
    conservation: [
      { text: 'Leads the breeding for release of the critically endangered Scottish wildcat, with the society’s Highland Wildlife Park.', species: ['felis-silvestris'] },
    ],
  },
  'zoo-dublin-zoo': {
    address: 'Phoenix Park, Dublin 8, Ireland',
    website: 'https://www.dublinzoo.ie',
    history: ['Opened in 1831 by the Zoological Society of Ireland, it is one of the oldest zoos in the world. It became famous for breeding lions: hundreds were born here from 1857, and the first MGM lion may have been born here in 1919.'],
    conservation: [
      { text: 'Keeps and breeds Asiatic lions in the European breeding programme. Only a few hundred remain in the wild, all in India’s Gir Forest.', species: ['panthera-leo'] },
    ],
  },
  // ── Germany, Austria and Switzerland ──
  'zoo-berlin-zoo': {
    address: 'Hardenbergplatz 8, 10787 Berlin, Germany',
    website: 'https://www.zoo-berlin.de/en',
    history: ['Opened on 1 August 1844, it is Germany’s oldest zoo and one of the most species-rich zoos in the world.'],
    conservation: [
      { text: 'Its giant pandas Meng Meng and Jiao Qing had twins in 2019, the first pandas born in Germany.', species: ['ailuropoda-melanoleuca'] },
      { text: 'Supports conservation projects abroad, such as in Madagascar.' },
    ],
  },
  'zoo-hellabrunn-zoo': {
    address: 'Tierparkstraße 30, 81543 Munich, Germany',
    website: 'https://www.hellabrunn.de/en',
    history: ['Opened in 1911 and rebuilt in 1928 by Heinz Heck as the world’s first “geo-zoo”, with animals grouped by the continent they come from.'],
    conservation: [
      { text: 'Breeds Przewalski’s horses, the last truly wild horses, and has released them, along with dama gazelles and lynx.', species: ['equus-ferus-przewalskii', 'lynx-lynx'] },
      { text: 'In the 1920s and 30s the Heck brothers bred “Heck cattle” in an attempt to recreate the extinct aurochs.', species: ['bos-primigenius'] },
    ],
  },
  'zoo-leipzig-zoological-garden': {
    address: 'Pfaffendorfer Straße 29, 04105 Leipzig, Germany',
    website: 'https://www.zoo-leipzig.de/en',
    history: ['Opened on 9 June 1878. It became famous for breeding lions under director Karl Max Schneider. Gondwanaland, opened in 2011, is Europe’s largest indoor tropical hall.'],
    conservation: [
      { text: 'Pongoland, opened in 2001, keeps all four kinds of great ape and is used for research on ape behaviour and thinking.', species: ['pan-troglodytes', 'gorilla-gorilla'] },
      { text: 'Takes part in over 80 breeding programmes and provides animals for reintroductions, such as European wildcats and Przewalski’s horses.', species: ['felis-silvestris', 'equus-ferus-przewalskii'] },
    ],
  },
  'zoo-sch-nbrunn-zoo': {
    address: 'Maxingstraße 13b, 1130 Vienna, Austria',
    website: 'https://www.zoovienna.at/en',
    history: ['Founded in 1752 by Emperor Francis I in the grounds of Schönbrunn Palace, it is the oldest zoo in the world still open. Its baroque pavilion is still at its centre.'],
    conservation: [
      { text: 'Helps return the northern bald ibis and the bearded vulture to the wild in Europe.', species: ['geronticus-eremita', 'gypaetus-barbatus'] },
      { text: 'Has bred giant pandas, including the first panda born in Europe by natural mating, in 2007.', species: ['ailuropoda-melanoleuca'] },
    ],
  },
  'zoo-z-rich-zoo': {
    address: 'Zürichbergstrasse 221, 8044 Zurich, Switzerland',
    website: 'https://www.zoo.ch/en',
    history: ['Opened in 1929. Its Masoala Rainforest hall, opened in 2003, recreates a Madagascar rainforest under one roof.'],
    conservation: [
      { text: 'Funds the protection of Masoala National Park in Madagascar, home of the forest copied in its hall, every year since 2000.' },
    ],
  },
  // ── France, Italy, Spain and Portugal ──
  'zoo-paris-zoological-park': {
    address: 'Avenue Daumesnil, 75012 Paris, France',
    website: 'https://www.parczoologiquedeparis.fr/en',
    history: ['Opened in 1934 in the Bois de Vincennes, with its landmark 65 m artificial rock, the Grand Rocher. It closed in 2008 and reopened, rebuilt, in April 2014. It is run by France’s national natural history museum.'],
    conservation: [
      { text: 'Groups animals by habitat (Patagonia, Sahel–Sudan, Europe, Guiana and Madagascar) and takes part in European breeding programmes for species like the giraffe and wolverine.', species: ['gulo-gulo'] },
    ],
  },
  'zoo-zooparc-de-beauval': {
    address: '41110 Saint-Aignan, Loir-et-Cher, France',
    website: 'https://www.zoobeauval.com',
    history: ['Opened in 1980 by Françoise Delord as a bird park, it grew into one of the largest and most visited zoos in France.'],
    conservation: [
      { text: 'Yuan Meng, the first giant panda born in France, was born here in 2017, followed by twins in 2021. The parents returned to China in November 2025.', species: ['ailuropoda-melanoleuca'] },
      { text: 'Its Beauval Nature association funds conservation projects around the world.' },
    ],
  },
  'zoo-m-nagerie-du-jardin-des-plantes': {
    address: 'Jardin des Plantes, 57 rue Cuvier, 75005 Paris, France',
    website: 'https://www.jardindesplantesdeparis.fr',
    history: ['Founded in 1794 with animals from the royal menagerie at Versailles, it is one of the oldest zoos in the world. It is part of France’s national natural history museum.'],
    conservation: [
      { text: 'Specialises in small, rare animals in historic buildings, such as red pandas, and breeds them in European programmes.', species: ['ailurus-fulgens'] },
    ],
  },
  'zoo-bioparco-di-roma': {
    address: 'Piazzale del Giardino Zoologico 1, 00197 Rome, Italy',
    website: 'https://www.bioparco.it',
    history: ['Opened in 1911 in the gardens of Villa Borghese. Once a showplace for exotic animals, it now focuses on conservation, education and research.'],
    conservation: [
      { text: 'Takes part in European breeding programmes for endangered species.' },
    ],
  },
  'zoo-parco-natura-viva': {
    address: 'Località Figara 40, 37012 Bussolengo (VR), Italy',
    website: 'https://www.parconaturaviva.it/en',
    history: ['Opened on 21 June 1969 by Alberto Avesani on his family farm near Lake Garda, with a safari added in 1973. It is one of Italy’s largest zoos.'],
    conservation: [
      { text: 'A member of EAZA and WAZA, it breeds endangered species and supports research and field projects.' },
    ],
  },
  'zoo-bioparc-valencia': {
    address: 'Avenida Pío Baroja 3, 46015 Valencia, Spain',
    website: 'https://www.bioparcvalencia.es',
    history: ['Opened in 2008, it uses “zoo-immersion”: visitors walk through recreated African savannah, equatorial forest and Madagascar with hidden barriers.'],
    conservation: [
      { text: 'Takes part in European breeding programmes for African animals, including lemurs from Madagascar.', species: ['lemur-catta'] },
    ],
  },
  'zoo-zoo-aquarium-de-madrid': {
    address: 'Casa de Campo, 28011 Madrid, Spain',
    website: 'https://www.zoomadrid.com',
    history: ['Madrid’s first zoo opened in the Retiro Park in 1770; the present zoo opened in the Casa de Campo in 1972. In 1978 China gave King Juan Carlos a pair of giant pandas.'],
    conservation: [
      { text: 'Has kept giant pandas since 1978 and bred several cubs.', species: ['ailuropoda-melanoleuca'] },
    ],
  },
  'zoo-lisbon-zoo': {
    address: 'Praça Marechal Humberto Delgado, Lisbon, Portugal',
    website: 'https://www.zoo.pt',
    history: ['Opened in 1884, it is one of the oldest zoos in Europe and Portugal’s main zoo.'],
    conservation: [
      { text: 'A member of EAZA, taking part in European breeding programmes.' },
    ],
  },
  // ── Low Countries and Scandinavia ──
  'zoo-artis': {
    address: 'Plantage Kerklaan 38–40, 1018 CZ Amsterdam, Netherlands',
    website: 'https://www.artis.nl/en',
    history: ['Founded in 1838 as Natura Artis Magistra (“nature is the teacher of art”), it is the oldest zoo in the Netherlands. It has an aquarium, planetarium and Micropia, the world’s first museum of microbes.'],
  },
  'zoo-antwerp-zoo': {
    address: 'Koningin Astridplein 20–26, 2018 Antwerp, Belgium',
    website: 'https://www.zooantwerpen.be/en',
    history: ['Founded on 21 July 1843, it is Belgium’s oldest zoo, beside Antwerp’s central station. The first living okapi seen in Europe arrived here in 1919.'],
    conservation: [
      { text: 'Keeps the international studbook for the okapi and coordinates its breeding in zoos worldwide, and supports a reserve for okapis in the Democratic Republic of the Congo.', species: ['okapia-johnstoni'] },
    ],
  },
  'zoo-copenhagen-zoo': {
    address: 'Roskildevej 32, 2000 Frederiksberg, Denmark',
    website: 'https://www.zoo.dk/en',
    history: ['Founded in 1859, it is one of the oldest zoos in Europe.'],
    conservation: [
      { text: 'Runs over 30 conservation projects, including anti-poaching work for rhinos in South Africa’s Pilanesberg National Park since 2008, and protecting amphibians in Danish wetlands.', species: ['diceros-bicornis', 'ceratotherium-simum'] },
      { text: 'Its yin-yang shaped panda house opened in 2019.', species: ['ailuropoda-melanoleuca'] },
    ],
  },
  'zoo-kolm-rden-wildlife-park': {
    address: '618 92 Kolmården, Sweden',
    website: 'https://www.kolmarden.com',
    history: ['Opened on 27 May 1965 near Norrköping, it is the largest zoo in Scandinavia, with a cable car safari over its enclosures.'],
    conservation: [
      { text: 'Takes part in over 30 European breeding programmes and has sent European bison to Azerbaijan and Romania to help bring them back to the wild.' },
    ],
  },
  'zoo-kristiansand-zoo-and-amusement-park': {
    address: 'Kardemomme by, Kristiansand, Norway',
    website: 'https://www.dyreparken.no',
    history: ['Norway’s largest zoo, opened in 1966, combined with an amusement park and Kardemomme by, the town from Thorbjørn Egner’s children’s stories.'],
    conservation: [
      { text: 'Keeps Nordic animals such as wolves and lynx alongside animals from around the world.', species: ['canis-lupus', 'lynx-lynx'] },
    ],
  },
  'zoo-korkeasaari-zoo': {
    address: 'Mustikkamaanpolku 12, 00570 Helsinki, Finland',
    website: 'https://www.korkeasaari.fi/en',
    history: ['Opened in 1889 on an island in Helsinki’s harbour, it is one of the oldest zoos in northern Europe.'],
    conservation: [
      { text: 'A long-time breeder of snow leopards, it kept their international studbook from 1976. It now coordinates European breeding of markhor, forest reindeer and snowy owls.', species: ['panthera-uncia', 'rangifer-tarandus', 'bubo-scandiacus'] },
    ],
  },
  // ── Central and Eastern Europe ──
  'zoo-prague-zoo': {
    address: 'U Trojského zámku 3/120, 171 00 Prague 7, Czechia',
    website: 'https://www.zoopraha.cz/en',
    history: ['Opened in 1931 on the banks of the Vltava, it has bred Przewalski’s horses since 1932.'],
    conservation: [
      { text: 'Has kept the world studbook of Przewalski’s horse since 1959. Its Return of the Wild Horses project has flown horses back to Mongolia since 2011, and helped return them to Kazakhstan in 2024.', species: ['equus-ferus-przewalskii'] },
    ],
  },
  'zoo-budapest-zoo-and-botanical-garden': {
    address: 'Állatkerti körút 6–12, 1146 Budapest, Hungary',
    website: 'https://zoobudapest.com/en',
    history: ['Opened in 1866, it is one of the oldest zoos in Europe, with Art Nouveau animal houses from its 1912 rebuilding.'],
    conservation: [
      { text: 'Took part in the world’s first zoo breeding programme, to save the European bison in the 1920s, and has worked to protect Eurasian griffon vultures since 2001.' },
    ],
  },
  'zoo-wroc-aw-zoo': {
    address: 'ulica Wróblewskiego 1–5, 51-618 Wrocław, Poland',
    website: 'https://zoo.wroclaw.pl',
    history: ['Opened in 1865, it is the oldest zoo in Poland. Its Afrykarium, opened in 2014, recreates African waters and coasts.'],
  },
  'zoo-warsaw-zoo': {
    address: 'Ratuszowa 1/3, 03-461 Warsaw, Poland',
    website: 'https://zoo.waw.pl/en',
    history: [
      'Opened in 1928. During the Second World War its director Jan Żabiński and his wife Antonina hid around 300 Jews and resistance fighters in the zoo and their villa, saving most of them. They were honoured as Righteous Among the Nations, and the story was told in the film The Zookeeper’s Wife. The zoo took their names in 2023.',
    ],
  },
  'zoo-zagreb-zoo': {
    address: 'Maksimirski perivoj bb, 10000 Zagreb, Croatia',
    website: 'https://www.zoo.hr',
    history: ['Opened on 27 June 1925 on an island in a lake in Maksimir Park, starting with three foxes and three owls. It has been rebuilt and modernised since 2016.'],
    conservation: [
      { text: 'A member of EAZA and WAZA, taking part in European breeding programmes.' },
    ],
  },
  // ── Asia ──
  'zoo-ueno-zoo': {
    address: '9-83 Ueno Park, Taitō, Tokyo 110-8711, Japan',
    website: 'https://www.tokyo-zoo.net/english/ueno/',
    history: ['Opened in 1882, it is Japan’s oldest zoo. It was famous for its giant pandas from 1972; the last, the twins Xiao Xiao and Lei Lei, returned to China in January 2026.'],
    conservation: [
      { text: 'Bred giant pandas, including twins born in 2021.', species: ['ailuropoda-melanoleuca'] },
    ],
  },
  'zoo-asahiyama-zoo': {
    address: 'Kuranuma, Higashi-Asahikawa-chō, Asahikawa, Hokkaido, Japan',
    website: 'https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/',
    history: ['Opened in July 1967, it is Japan’s northernmost zoo. Near closure in the 1990s, it was saved by exhibits that show animals behaving naturally, like a polar bear dome and a tube through which seals swim.'],
    conservation: [
      { text: 'Its winter penguin walk began as exercise for the penguins. Its Wolf Forest tells the story of the extinct Hokkaido wolf.', species: ['aptenodytes-patagonicus', 'ursus-maritimus', 'canis-lupus'] },
    ],
  },
  'zoo-tama-zoological-park': {
    address: '7-1-1 Hodokubo, Hino, Tokyo 191-0042, Japan',
    website: 'https://www.tokyo-zoo.net/english/tama/',
    history: ['Opened on 5 May 1958 in the Tama Hills. It introduced the world’s first lion bus, which carries visitors among the lions, and has a large insectarium.'],
    conservation: [
      { text: 'Since 2008, crested ibises bred at its Wildlife Conservation Center have been released on Sado Island, bringing back a bird that had died out in the wild in Japan.', species: ['nipponia-nippon'] },
    ],
  },
  'zoo-singapore-zoo': {
    address: '80 Mandai Lake Road, Singapore 729826',
    website: 'https://www.mandai.com/en/singapore-zoo.html',
    history: ['Opened on 27 June 1973, it is known for its open enclosures, separated by moats instead of cages. It is part of Mandai Wildlife Reserve with the Night Safari, River Wonders and Bird Paradise.'],
    conservation: [
      { text: 'Has bred over 40 orangutans; its conservation arm, Mandai Nature, funds wildlife protection across Southeast Asia.', species: ['pongo-pygmaeus'] },
    ],
  },
  'zoo-jerusalem-biblical-zoo': {
    address: 'Derech Aharon Shulov 1, Malha, Jerusalem, Israel',
    website: 'https://www.jerusalemzoo.org.il/en',
    history: ['Opened in 1941 to show animals mentioned in the Bible, and on its present site since 1993.'],
    conservation: [
      { text: 'Breeds the endangered Persian fallow deer, which had died out in Israel, and since 1996 has released them into nature reserves with Israel’s Nature and Parks Authority.' },
    ],
  },
  // ── Africa ──
  'zoo-johannesburg-zoo': {
    address: 'Jan Smuts Avenue, Parkview, Johannesburg, South Africa',
    website: 'https://www.jhbcityparksandzoo.com',
    history: ['Established in 1904, it has over 2,000 animals of more than 300 species.'],
    conservation: [
      { text: 'Has managed a wattled crane conservation project with the South African Crane Working Group.' },
    ],
  },
  'zoo-pretoria-zoo': {
    address: 'Boom Street, Pretoria, South Africa',
    website: 'https://www.sanbi.org',
    history: ['Founded in 1899, the National Zoological Garden is South Africa’s only zoo with national status, run by the South African National Biodiversity Institute.'],
    conservation: [
      { text: 'Has bred endangered Cape vultures since 1996, and breeds and rehabilitates sungazer lizards taken from illegal trade.' },
    ],
  },
};
