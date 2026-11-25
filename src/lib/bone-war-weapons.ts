// Bone War: how each animal attacks, for the attack animations. Most animals bite, with teeth like
// their own; animals whose main weapon is something else use that: birds of prey close their
// talons, therizinosaurs, megaraptors and ground sloths slash with their arm claws (as many claws as
// they have), giants stomp with their family's footprint, and animals with horns, tusks, antlers,
// domes, clubs or spikes bash with them.

import { cladePath } from '@/lib/life';
import { cardFor } from '@/lib/bone-war';

// Teeth (and beaks) for a bite.
export type Jaw = 'crusher' | 'serrated' | 'conical' | 'shark' | 'fangs' | 'sabre' | 'venom' | 'beak' | 'incisors' | 'blades';
// Footprints for a stomp.
export type Foot = 'sauropod' | 'elephant' | 'ornithopod' | 'bird' | 'ostrich' | 'rhino' | 'horse' | 'cloven' | 'wombat' | 'kangaroo';
// Weapons for a bash, rising from below.
export type Bash = 'ceratopsian' | 'rhino' | 'twin' | 'bovid' | 'antlers' | 'dome' | 'club' | 'spikes' | 'tusks' | 'lance' | 'fluke' | 'forked';

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
  spinosauridae: bite('conical'),
  // Raptors held prey down with the sickle claw but struck with the three claws on each arm.
  dromaeosauridae: slash(3),
  alvarezsauridae: slash(1), // the one big claw on each arm
  therizinosauria: slash(3),
  megaraptora: slash(3),
  ornithomimosauria: bite('beak'),
  oviraptorosauria: bite('beak'),
  aves: bite('beak'),
  avialae: bite('beak'),
  enantiornithes: bite('conical'),
  hesperornithes: bite('conical'),
  sauropodomorpha: stomp('sauropod'),
  plateosauridae: slash(1), // the big thumb claw
  ornithischia: bite('beak'),
  heterodontosauridae: bite('fangs'),
  iguanodontia: stomp('ornithopod'),
  ceratopsidae: bash('ceratopsian'),
  pachycephalosauridae: bash('dome'),
  ankylosauria: bash('club'),
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
  mosasauridae: bite('conical'),
  sauropterygia: bite('conical'),
  ichthyosauria: bite('conical'),
  thalattosauria: bite('conical'),
  testudines: bite('beak'),
  squamata: bite('conical'),
  varanidae: bite('serrated'),
  serpentes: bite('venom'),
  boidae: bite('conical'), // constrictors: rows of hooked teeth, no fangs
  pythonidae: bite('conical'),
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
  odobenidae: bash('tusks'),
  cetacea: bite('conical'),
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
};

// Single animals that don't follow their group.
const BY_SPECIES: Record<string, Weapon> = {
  'thylacosmilus-atrox': bite('sabre'),
  'anteosaurus-magnificus': bite('fangs'),
  'moschops-capensis': bash('dome'),
  'monodon-monoceros': bash('lance'),
  'elasmotherium-sibiricum': bash('lance'),
  'myrmecophaga-tridactyla': slash(2),
  'paraceratherium-bugtiense': stomp('rhino'),
  'helicoprion-davisii': bite('shark'),
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
