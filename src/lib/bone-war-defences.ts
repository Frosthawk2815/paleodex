// Bone War: each animal's main armour, shown when an attack bounces off it (the target's defence
// held). Animals with no armour to speak of (most of them) show none: the attack just bounces.

import { cladePath } from '@/lib/life';
import { cardFor } from '@/lib/bone-war';

export type Defence =
  // Horned dinosaurs: a frill with openings (most chasmosaurines), a solid frill (Triceratops), or a
  // shorter frill edged with spikes (centrosaurines).
  | 'frill'
  | 'solidfrill'
  | 'spikyfrill'
  // Turtles' shells; the leathery, ridged back of leatherbacks and their extinct relatives.
  | 'shell'
  | 'leathery'
  // Bony plates in the skin: ankylosaurs' keeled osteoderms; crocodiles' rows of keeled scutes;
  // glyptodonts' and placodonts' domed mosaic; armadillos' bands; pangolins' overlapping scales.
  | 'osteoderms'
  | 'scutes'
  | 'carapace'
  | 'banded'
  | 'scales'
  // Stegosaurs' back plates; pachycephalosaurs' thick skull domes.
  | 'plates'
  | 'dome'
  // Armoured fish: placoderms' and jawless fish's bony head and trunk shields.
  | 'armourplate'
  // Arthropods' segmented exoskeletons.
  | 'exoskeleton'
  // Coiled shells (ammonites, nautilus, snails), straight shells (orthocerids, Baculites) and
  // bivalves.
  | 'conch'
  | 'straightshell'
  | 'clam'
  // Squid, cuttlefish and octopuses: a cloud of ink.
  | 'ink'
  // Hedgehogs, tenrecs, echidnas, horned lizards: spines.
  | 'spines'
  // Elephants, rhinos and hippos: thick, folded hide.
  | 'hide';

const BY_CLADE: Record<string, Defence> = {
  // Dinosaurs
  ceratopsidae: 'frill',
  protoceratopsidae: 'frill',
  leptoceratopsidae: 'frill',
  pachycephalosauridae: 'dome',
  ankylosauria: 'osteoderms',
  parankylosauria: 'osteoderms',
  scelidosauridae: 'osteoderms',
  stegosauria: 'plates',
  // Other reptiles
  testudines: 'shell',
  dermochelyidae: 'leathery',
  protostegidae: 'leathery', // Archelon and its kin had reduced, probably leather-covered shells
  crocodylomorpha: 'scutes',
  crocodylia: 'scutes',
  dyrosauridae: 'scutes',
  pholidosauridae: 'scutes',
  notosuchia: 'scutes',
  mahajangasuchidae: 'scutes',
  phytosauria: 'scutes',
  aetosauria: 'scutes',
  pareiasauria: 'osteoderms',
  squamata: 'scales',
  phrynosomatidae: 'spines',
  plagiosauridae: 'osteoderms',
  // Mammals
  glyptodontidae: 'carapace',
  pampatheriidae: 'banded',
  cingulata: 'banded',
  pholidota: 'scales',
  erinaceidae: 'spines',
  tenrecinae: 'spines',
  tachyglossidae: 'spines',
  proboscidea: 'hide',
  rhinocerotidae: 'hide',
  hippopotamidae: 'hide',
  // Fish
  actinopterygii: 'scales',
  sarcopterygii: 'scales',
  acipenseriformes: 'scutes', // sturgeons: rows of bony scutes
  placodermi: 'armourplate',
  pteraspidomorphi: 'armourplate',
  osteostraci: 'armourplate',
  // Invertebrates
  arthropoda: 'exoskeleton',
  ammonoidea: 'conch',
  nautilida: 'conch',
  orthocerida: 'straightshell',
  endocerida: 'straightshell',
  coleoidea: 'ink',
  bivalvia: 'clam',
};

const BY_SPECIES: Record<string, Defence> = {
  // Triceratops's frill was solid bone, without the openings of its relatives.
  'triceratops-horridus': 'solidfrill',
  'triceratops-prorsus': 'solidfrill',
  'eotriceratops-xerinsularis': 'solidfrill',
  // Centrosaurines: shorter frills edged with spikes and hooks.
  ...Object.fromEntries(
    [
      'diabloceratops-eatoni',
      'styracosaurus-albertensis',
      'pachyrhinosaurus-canadensis',
      'pachyrhinosaurus-perotorum',
      'sinoceratops-zhuchengensis',
      'centrosaurus-apertus',
      'nasutoceratops-titusi',
      'einiosaurus-procurvicornis',
      'achelousaurus-horneri',
      'albertaceratops-nesmoi',
      'avaceratops-lammersi',
      'lokiceratops-rangiformis',
      'monoclonius-crassus',
      'coronosaurus-brinkmani',
      'wendiceratops-pinhornensis',
      'machairoceratops-cronusi',
    ].map((id) => [id, 'spikyfrill' as Defence]),
  ),
  // Teleosaurids kept their armour; the open-sea metriorhynchids lost it (left with none).
  'macrospondylus-bollensis': 'scutes',
  'mystriosaurus-laurillardi': 'scutes',
  'pelagosaurus-typus': 'scutes',
  'metriorhynchus-superciliosus': 'none' as Defence,
  'tyrannoneustes-lythrodectikos': 'none' as Defence,
  'plesiosuchus-manselii': 'none' as Defence,
  'torvoneustes-carpenteri': 'none' as Defence,
  // Placodonts: Placodus had a row of bony knobs down its back; the cyamodontoids were armoured
  // like turtles in a mosaic of plates.
  'placodus-gigas': 'osteoderms',
  'cyamodus-hildegardis': 'carapace',
  'sinocyamodus-xinpuensis': 'carapace',
  'psephochelys-polyosteoderma': 'carapace',
  // A turtle forerunner with broad ribs, but no shell yet.
  'eunotosaurus-africanus': 'none' as Defence,
  // Straight ammonites; a land snail; Wiwaxia's spiny scales.
  'baculites-compressus': 'straightshell',
  'dendropupa-vetusta': 'conch',
  'wiwaxia-corrugata': 'spines',
};

const cache = new Map<string, Defence | null>();

// The armour of the card with this key, or null if it has none worth showing.
export function defenceOf(key: string): Defence | null {
  if (cache.has(key)) return cache.get(key)!;
  let d: Defence | null = null;
  const c = cardFor(key, 1);
  if (c && c.kind === 'species') {
    const own = BY_SPECIES[c.id];
    if (own) d = own;
    else {
      const path = cladePath(c.species.clade);
      for (let i = path.length - 1; i >= 0; i--) {
        const x = BY_CLADE[path[i]!.id];
        if (x) {
          d = x;
          break;
        }
      }
    }
  }
  if ((d as string) === 'none') d = null;
  cache.set(key, d);
  return d;
}
