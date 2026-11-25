// Bone War: how each animal attacks, for the attack animations. Most animals bite, with teeth like
// their own; animals whose main weapon is something else use that: birds of prey close their
// talons, therizinosaurs, megaraptors and ground sloths slash with their arm claws (as many claws as
// they have), giants stomp with their family's footprint, and animals with horns, tusks, antlers,
// domes, clubs or spikes bash with them.

import { cladePath } from '@/lib/life';
import { cardFor } from '@/lib/bone-war';

// Teeth (and beaks) for a bite.
export type Jaw =
  | 'thylacoleo'
  | 'archaeocete'
  | 'sperm'
  | 'tusked'
  | 'toothcomb'
  | 'hominin'
  | 'robust'
  | 'pavement'
  | 'whorl'
  | 'needles'
  | 'frog'
  | 'leaf'
  | 'toothless'
  | 'crusher' | 'serrated' | 'notched' | 'conical' | 'rosette' | 'peg' | 'shark' | 'fangs' | 'sabre' | 'venom' | 'beak' | 'incisors' | 'blades';
// Footprints for a stomp.
export type Foot = 'sauropod' | 'elephant' | 'ornithopod' | 'bird' | 'ostrich' | 'rhino' | 'horse' | 'cloven' | 'wombat' | 'kangaroo';
// Weapons for a bash, rising from below (and the spear humans thrust).
export type Bash = 'spear' | 'ceratopsian' | 'rhino' | 'twin' | 'bovid' | 'antlers' | 'dome' | 'club' | 'spikes' | 'tusks' | 'lance' | 'fluke' | 'forked';

export type Weapon =
  | { kind: 'bite'; jaw: Jaw }
  // Closing feet (birds of prey) or pincers (crabs, sea scorpions, radiodonts, insects' mandibles).
  | { kind: 'grip'; style: 'talons' | 'pincer' }
  | { kind: 'slash'; claws: number }
  | { kind: 'stomp'; foot: Foot }
  | { kind: 'bash'; shape: Bash };

const bite = (jaw: Jaw): Weapon => ({ kind: 'bite', jaw });
const stomp = (foot: Foot): Weapon => ({ kind: 'stomp', foot });
const bash = (shape: Bash): Weapon => ({ kind: 'bash', shape });
const slash = (claws: number): Weapon => ({ kind: 'slash', claws });
const TALONS: Weapon = { kind: 'grip', style: 'talons' };
const PINCER: Weapon = { kind: 'grip', style: 'pincer' };

// By group; a species takes the weapon of the most specific group it belongs to.
const BY_CLADE: Record<string, Weapon> = {
  // Dinosaurs
  theropoda: bite('serrated'),
  tyrannosauridae: bite('crusher'), // thick, bone-crushing teeth
  spinosauridae: bite('rosette'),
  // A toothless gap (the subnarial notch) between the snout tip and the upper jaw.
  dilophosauridae: bite('notched'),
  coelophysidae: bite('notched'),
  // Raptors held prey down with the sickle claw but struck with the three claws on each arm.
  dromaeosauridae: slash(3),
  alvarezsauridae: slash(1), // the one big claw on each arm
  therizinosauria: slash(3),
  megaraptora: slash(3),
  ornithomimosauria: bite('beak'),
  oviraptorosauria: bite('beak'),
  aves: bite('beak'),
  avialae: bite('beak'),
  hesperornithes: bite('conical'),
  sauropodomorpha: stomp('sauropod'),
  plateosauridae: slash(1), // the big thumb claw
  ornithischia: bite('beak'),
  heterodontosauridae: bite('fangs'),
  iguanodontia: stomp('ornithopod'),
  ceratopsidae: bash('ceratopsian'),
  pachycephalosauridae: bash('dome'),
  parankylosauria: bash('club'),
  stegosauria: bash('spikes'),
  scelidosauridae: bash('spikes'),
  // Pterosaurs
  pterosauria: bite('conical'),
  azhdarchidae: bite('beak'),
  pteranodontidae: bite('beak'),
  tapejaridae: bite('beak'),
  // Birds
  accipitriformes: TALONS,
  accipitridae: TALONS,
  pandionidae: TALONS,
  falconidae: TALONS,
  strigiformes: TALONS,
  strigidae: TALONS,
  tytonidae: TALONS,
  aegypiinae: bite('beak'),
  gypaetinae: bite('beak'),
  cathartidae: bite('beak'),
  sagittariidae: stomp('bird'), // the secretary bird kicks its prey
  palaeognathae: stomp('bird'),
  struthionidae: stomp('ostrich'),
  casuariidae: slash(1), // the dagger claw
  apterygidae: bite('beak'),
  tinamidae: bite('beak'),
  dromornithidae: stomp('bird'),
  // Other reptiles
  crocodylomorpha: bite('conical'),
  phytosauria: bite('conical'),
  choristodera: bite('conical'),
  proterosuchidae: bite('conical'),
  rauisuchidae: bite('serrated'),
  ornithosuchidae: bite('serrated'),
  poposauroidea: bite('beak'),
  aetosauria: bash('spikes'),
  mosasauridae: bite('peg'),
  sauropterygia: bite('rosette'),
  ichthyosauria: bite('peg'),
  thalattosauria: bite('conical'),
  testudines: bite('beak'),
  squamata: bite('conical'),
  varanidae: bite('serrated'),
  serpentes: bite('venom'),
  boidae: bite('peg'), // constrictors: rows of hooked teeth, no fangs
  pythonidae: bite('peg'),
  pareiasauria: bash('dome'),
  rhynchosauria: bite('beak'),
  // Synapsids
  synapsida: bite('conical'),
  sphenacodontidae: bite('serrated'),
  varanopidae: bite('serrated'),
  gorgonopsia: bite('sabre'),
  therocephalia: bite('fangs'),
  cynodontia: bite('fangs'),
  dinocephalia: bash('dome'), // head-butting
  dicynodontia: bash('tusks'),
  // Mammals
  mammalia: bite('fangs'),
  machairodontinae: bite('sabre'),
  nimravidae: bite('sabre'),
  thylacoleonidae: bite('thylacoleo'),
  odobenidae: bash('tusks'),
  cetacea: bite('peg'),
  mysticeti: bash('fluke'),
  sirenia: bash('fluke'),
  proboscidea: stomp('elephant'),
  rhinocerotidae: bash('rhino'),
  brontotheriidae: bash('forked'),
  chalicotheriidae: slash(3),
  dinocerata: bash('tusks'),
  embrithopoda: bash('twin'),
  giraffidae: stomp('cloven'),
  camelidae: stomp('cloven'),
  diprotodontidae: stomp('wombat'),
  pilosa: slash(3),
  cingulata: slash(3),
  glyptodontidae: bash('club'),
  pholidota: slash(3),
  tubulidentata: slash(4),
  perissodactyla: stomp('horse'),
  tapiridae: stomp('rhino'),
  artiodactyla: stomp('cloven'),
  cervidae: bash('antlers'),
  bovidae: bash('bovid'),
  antilocapridae: bash('bovid'),
  suidae: bash('tusks'),
  litopterna: stomp('horse'),
  notoungulata: stomp('rhino'),
  macropodidae: stomp('kangaroo'),
  rodentia: bite('incisors'),
  lagomorpha: bite('incisors'),
  multituberculata: bite('incisors'),
  monotremata: slash(3),
  ornithorhynchidae: slash(1), // the venomous spur
  // Fish
  vertebrata: bite('conical'),
  chondrichthyes: bite('shark'),
  batoidea: bash('fluke'),
  rhincodontidae: bash('fluke'),
  placodermi: bite('blades'),
  xiphiidae: bash('lance'),
  // Invertebrates
  animalia: bash('dome'),
  arthropoda: PINCER,
  radiodonta: PINCER,
  cephalopoda: bite('beak'),

  // ---- Teeth checked family by family ----
  herrerasauridae: bite('serrated'),
  archaeopterygidae: bite('peg'),
  enantiornithes: bite('peg'),
  anchiornithidae: bite('peg'),
  teratornithidae: bite('beak'), // giant soaring scavengers and hunters, not talon-killers
  ankylosauria: bash('spikes'), // armour and spikes; only some had tail clubs (below)
  notosuchia: bite('fangs'), // mammal-like crocodile relatives with incisor, canine and cheek teeth
  mahajangasuchidae: bite('fangs'),
  gavialidae: bite('peg'),
  silesauridae: bite('beak'),
  rhynchocephalia: bite('peg'),
  procolophonidae: bite('peg'),
  edaphosauridae: bite('peg'),
  iguanidae: bite('leaf'),
  agamidae: bite('peg'),
  chamaeleonidae: bite('peg'),
  gekkonidae: bite('peg'),
  eublepharidae: bite('peg'),
  scincidae: bite('peg'),
  phrynosomatidae: bite('peg'),
  corytophanidae: bite('peg'),
  anura: bite('frog'),
  caudata: bite('peg'),
  gymnophiona: bite('peg'),
  // Pterosaurs
  ctenochasmatidae: bite('needles'),
  dimorphodontidae: bite('rosette'),
  rhamphorhynchidae: bite('rosette'),
  anhangueridae: bite('rosette'),
  ornithocheiridae: bite('rosette'),
  anurognathidae: bite('peg'),
  pterodactylidae: bite('peg'),
  nyctosauridae: bite('beak'),
  // Fish
  actinopterygii: bite('peg'),
  cyprinidae: bite('toothless'),
  danionidae: bite('toothless'),
  characidae: bite('peg'),
  clupeiformes: bite('toothless'),
  acipenseriformes: bite('toothless'),
  syngnathidae: bite('toothless'),
  regalecidae: bite('toothless'),
  tetraodontidae: bite('beak'),
  molidae: bite('beak'),
  serrasalmidae: bite('shark'), // a single row of triangular, razor-edged teeth
  melanocetidae: bite('needles'),
  lepisosteidae: bite('conical'),
  esocidae: bite('conical'),
  ichthyodectidae: bite('rosette'), // Xiphactinus: big fangs at the front
  aulopiformes: bite('rosette'), // Enchodus, the "sabre-toothed herring"
  dipnoi: bite('pavement'),
  holocephali: bite('pavement'),
  eugeneodontida: bite('whorl'),
  pteraspidomorphi: bash('dome'), // jawless: armoured heads, no bite
  osteostraci: bash('dome'),
  myllokunmingiidae: bash('dome'),
  petromyzontiformes: bite('peg'),
  // Mammals
  odontoceti: bite('peg'),
  physeteridae: bite('sperm'),
  kogiidae: bite('sperm'),
  ziphiidae: bite('tusked'),
  strepsirrhini: bite('toothcomb'),
  daubentoniidae: bite('incisors'), // the aye-aye's ever-growing incisors
  diprotodontia: bite('incisors'), // wombats, koalas and possums: big front incisors, no lower canines
  hyracoidea: bite('incisors'),
  myrmecobiidae: bite('peg'),
  pampatheriidae: slash(3),
  entelodontidae: bite('fangs'),
  hippopotamidae: bite('fangs'),
  tayassuidae: bash('tusks'),
  moschidae: bite('sabre'), // musk deer: long tusk-like upper canines, no antlers
  tragulidae: bite('sabre'),
  // Others
  trilobita: bash('dome'),
};

// Single animals that don't follow their group.
const BY_SPECIES: Record<string, Weapon> = {
  'thylacosmilus-atrox': bite('sabre'),
  // Teeth checked one by one
  'australopithecus-afarensis': bite('hominin'),
  // Humans (the genus Homo) fight with a spear, thrust up from below.
  'homo-habilis': bash('spear'),
  'homo-naledi': bash('spear'),
  'homo-erectus': bash('spear'),
  'homo-neanderthalensis': bash('spear'),
  'homo-floresiensis': bash('spear'),
  'homo-longi': bash('spear'),
  'homo-sapiens': bash('spear'),
  'paranthropus-boisei': bite('robust'),
  'paranthropus-robustus': bite('robust'),
  'gigantopithecus-blacki': bite('robust'),
  'pakicetus-inachus': bite('archaeocete'),
  'ambulocetus-natans': bite('archaeocete'),
  'basilosaurus-isis': bite('archaeocete'),
  'dorudon-atrox': bite('archaeocete'),
  'peregocetus-pacificus': bite('archaeocete'),
  'perucetus-colossus': bite('archaeocete'),
  'odobenocetops-peruvianus': bash('tusks'),
  'livyatan-melvillei': bite('conical'), // huge teeth in both jaws, unlike living sperm whales
  'messapicetus-gregarius': bite('peg'), // an early beaked whale that still had a full set
  'placodus-gigas': bite('pavement'),
  'paraplacodus-broilii': bite('pavement'),
  'cyamodus-hildegardis': bite('pavement'),
  'sinocyamodus-xinpuensis': bite('pavement'),
  'psephochelys-polyosteoderma': bite('pavement'),
  'globidens-dakotensis': bite('pavement'), // a mosasaur with ball-shaped shell-crushing teeth
  'ptychodus-mortoni': bite('pavement'),
  'myledaphus-bipartitus': bite('pavement'),
  'heliobatis-radians': bite('pavement'),
  'onchopristis-numida': bash('lance'), // sawfish: the toothed rostrum
  'atlanticopristis-equatorialis': bash('lance'),
  'cetorhinus-maximus': bash('fluke'), // the basking shark filters its food
  'leedsichthys-problematicus': bash('fluke'),
  'limusaurus-inextricabilis': bite('beak'), // toothless as an adult
  'pelecanimimus-polyodon': bite('peg'), // over 200 tiny teeth
  'incisivosaurus-gauthieri': bite('incisors'), // rodent-like front teeth
  'ichthyornis-dispar': bite('peg'),
  'yanornis-martini': bite('peg'),
  'jeholornis-prima': bite('peg'),
  'sapeornis-chaoyangensis': bite('peg'),
  'hydropotes-inermis': bite('sabre'), // the water deer: tusks, no antlers
  'tiarajudens-eccentricus': bite('sabre'), // a plant-eater with sabre-like canines
  'dromaius-novaehollandiae': stomp('bird'), // emus kick, but have no dagger claw
  'eurotamandua-joresi': slash(3),
  'beelzebufo-ampinga': bite('frog'),
  // Ankylosaurids with tail clubs
  'ankylosaurus-magniventris': bash('club'),
  'euoplocephalus-tutus': bash('club'),
  'pinacosaurus-grangeri': bash('club'),
  'tarchia-tumanovae': bash('club'),
  'scolosaurus-cutleri': bash('club'),
  'akainacephalus-johnsoni': bash('club'),
  'saichania-chulsanensis': bash('club'),
  'anodontosaurus-lambei': bash('club'),
  'zaraapelta-nomadis': bash('club'),
  'talarurus-plicatospineus': bash('club'),
  'tsagantegia-longicranialis': bash('club'),
  'minotaurasaurus-ramachandrani': bash('club'),
  'oohkotokia-horneri': bash('club'),
  'nodocephalosaurus-kirtlandensis': bash('club'),
  'zuul-crurivastator': bash('club'),

  'anteosaurus-magnificus': bite('fangs'),
  'moschops-capensis': bash('dome'),
  'monodon-monoceros': bash('lance'),
  'elasmotherium-sibiricum': bash('lance'),
  'myrmecophaga-tridactyla': slash(2),
  'paraceratherium-bugtiense': stomp('rhino'),
  'helicoprion-davisii': bite('whorl'),
  'hippopotamus-amphibius': bite('fangs'),
  'diplocaulus-magnicornis': bash('twin'),
};

const cache = new Map<string, Weapon>();

// The weapon of the card with this key (a species card; anything else bites).
export function weaponOf(key: string): Weapon {
  const hit = cache.get(key);
  if (hit) return hit;
  let w: Weapon = bite('conical');
  const c = cardFor(key, 1);
  if (c && c.kind === 'species') {
    const own = BY_SPECIES[c.id];
    if (own) w = own;
    else {
      const path = cladePath(c.species.clade);
      for (let i = path.length - 1; i >= 0; i--) {
        const x = BY_CLADE[path[i]!.id];
        if (x) {
          w = x;
          break;
        }
      }
    }
  }
  cache.set(key, w);
  return w;
}
