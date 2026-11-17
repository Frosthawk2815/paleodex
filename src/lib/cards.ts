// Bone War cards: each species' four stats (attack, defence, speed or flight, swim; 0 to 3) and
// which mass extinction wipes it out.
//
// Stats come from the kind of animal it is (a big land predator, an armoured plant-eater, a whale...),
// scaled by its size from the Length, Weight and Wingspan facts on its page. Within a group the
// biggest members get the biggest numbers; smaller relatives trade attack and defence for speed.
// Apex predators always get +3 attack. OVERRIDES fixes individual animals by hand.

import { type Clade, SPECIES, type Species } from '@/data/life';
import { EXTINCTIONS, type Extinction } from '@/lib/extinctions';
import { cladePath } from '@/lib/life';
import { speciesMa } from '@/lib/quiz';

export type Stats = { attack: number; defence: number; speed: number; swim: number };
type Tier = 0 | 1 | 2; // small, medium, large
type Row = [number, number, number, number]; // attack, defence, speed, swim

// Each kind of animal: stats for small, medium and large members, and the sizes (metres long and kg)
// at which a member counts as medium and as large.
type Kind = { tiers: [Row, Row, Row]; m: [number, number]; l: [number, number] };
const K = (small: Row, medium: Row, large: Row, m: [number, number], l: [number, number]): Kind => ({ tiers: [small, medium, large], m, l });

const KINDS = {
  // T. rex +3 attack, +2 defence, +1 speed; Alioramus and Nanotyrannus +2/+1/+2; Velociraptor +2/+1/+2.
  bigPredator: K([1, 0, 3, 0], [2, 1, 2, 0], [3, 2, 1, 0], [1.5, 20], [8, 1500]),
  // Cats and dogs: a lion +3 attack, +2 speed; a leopard +2 attack, +3 speed.
  runningPredator: K([1, 0, 3, 0], [2, 1, 3, 0], [3, 1, 2, 0], [1, 15], [2.4, 150]),
  bear: K([1, 1, 2, 1], [2, 2, 1, 1], [3, 2, 1, 1], [1, 50], [2, 300]),
  armoured: K([0, 2, 1, 0], [1, 3, 0, 0], [2, 3, 0, 0], [1.5, 50], [5, 2000]),
  horned: K([1, 1, 2, 0], [2, 2, 1, 0], [2, 3, 1, 0], [1.5, 100], [5, 2000]),
  giant: K([1, 2, 1, 0], [1, 3, 0, 0], [2, 3, 0, 0], [3, 500], [12, 5000]),
  grazer: K([0, 1, 2, 0], [1, 1, 3, 0], [1, 2, 2, 0], [1, 30], [6, 1000]),
  flyer: K([0, 0, 2, 0], [1, 0, 3, 0], [2, 1, 3, 0], [1, 1], [5, 50]),
  raptor: K([1, 0, 3, 0], [2, 0, 3, 0], [2, 1, 3, 0], [0.5, 1], [2, 6]),
  seabird: K([0, 0, 2, 1], [1, 0, 2, 2], [1, 1, 2, 2], [0.5, 1], [2, 8]),
  diver: K([0, 1, 0, 2], [1, 1, 0, 3], [1, 2, 0, 3], [0.5, 5], [1.2, 30]),
  bigBird: K([0, 1, 2, 0], [1, 1, 3, 0], [2, 1, 3, 0], [1, 20], [2, 90]),
  marinePredator: K([1, 0, 0, 2], [2, 0, 0, 3], [3, 0, 0, 3], [1.5, 50], [6, 1000]),
  filterSwimmer: K([0, 1, 0, 2], [0, 2, 0, 3], [1, 2, 0, 3], [3, 500], [12, 10000]),
  fish: K([0, 1, 0, 2], [1, 0, 0, 3], [2, 1, 0, 3], [0.4, 2], [2, 100]),
  crocodilian: K([1, 1, 0, 2], [2, 1, 0, 2], [3, 2, 0, 1], [1.5, 30], [5, 500]),
  turtle: K([0, 2, 0, 1], [1, 3, 0, 1], [1, 3, 0, 2], [0.3, 5], [1.2, 100]),
  seaTurtle: K([0, 1, 0, 2], [0, 2, 0, 3], [1, 2, 0, 3], [0.5, 20], [1.5, 300]),
  reptile: K([1, 0, 2, 0], [1, 1, 2, 0], [2, 1, 1, 1], [0.5, 2], [2, 50]),
  snake: K([1, 0, 1, 0], [2, 0, 1, 1], [3, 1, 0, 1], [1, 3], [4, 50]),
  amphibian: K([0, 0, 1, 2], [1, 1, 0, 2], [2, 1, 0, 2], [0.3, 1], [1.5, 30]),
  primate: K([0, 0, 3, 0], [1, 1, 2, 0], [2, 2, 1, 0], [0.5, 5], [1.4, 60]),
  smallMammal: K([1, 0, 2, 0], [1, 1, 2, 0], [2, 1, 1, 1], [0.4, 2], [1.2, 40]),
  marineMammal: K([1, 0, 0, 2], [2, 1, 0, 3], [3, 1, 0, 3], [2, 100], [5, 1000]),
  invertebrate: K([0, 1, 0, 1], [0, 1, 0, 2], [1, 2, 0, 2], [0.1, 1], [0.5, 10]),
  arthropod: K([0, 1, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1], [0.1, 1], [1, 10]),
  insect: K([0, 0, 2, 0], [0, 1, 2, 0], [1, 1, 2, 0], [0.05, 0.1], [0.3, 1]),
} satisfies Record<string, Kind>;
type KindId = keyof typeof KINDS;

// The kind of each group; a species takes the kind of the most specific group it belongs to.
const KIND_OF: Record<string, KindId> = {
  // Dinosaurs
  theropoda: 'bigPredator', ornithomimosauria: 'grazer', therizinosauria: 'horned', oviraptorosauria: 'grazer', alvarezsauridae: 'grazer',
  avialae: 'flyer', anchiornithidae: 'flyer', scansoriopterygidae: 'flyer', aves: 'flyer', hesperornithes: 'diver',
  sauropodomorpha: 'giant', ornithischia: 'grazer', ankylosauria: 'armoured', stegosauria: 'armoured', scelidosauridae: 'armoured',
  ceratopsidae: 'horned', pachycephalosauridae: 'horned', psittacosauridae: 'grazer', protoceratopsidae: 'grazer', leptoceratopsidae: 'grazer',
  // Birds
  accipitridae: 'raptor', falconidae: 'raptor', strigiformes: 'raptor', pandionidae: 'raptor', sagittariidae: 'raptor', cathartidae: 'raptor', teratornithidae: 'raptor',
  laridae: 'seabird', sulidae: 'seabird', procellariidae: 'seabird', diomedeidae: 'seabird', fregatidae: 'seabird', pelecanidae: 'seabird',
  phalacrocoracidae: 'seabird', anatidae: 'seabird', gaviidae: 'seabird', podicipedidae: 'seabird', phoenicopteridae: 'seabird', alcidae: 'diver', spheniscidae: 'diver',
  palaeognathae: 'bigBird', dromornithidae: 'bigBird', gastornithidae: 'bigBird', phorusrhacidae: 'bigBird', sylviornithidae: 'bigBird',
  // Other reptiles
  pterosauria: 'flyer', crocodylomorpha: 'crocodilian', crocodylia: 'crocodilian', phytosauria: 'crocodilian', choristodera: 'crocodilian',
  proterosuchidae: 'crocodilian', notosuchia: 'reptile', thalattosuchia: 'marinePredator', dyrosauridae: 'crocodilian', pholidosauridae: 'crocodilian',
  rauisuchidae: 'bigPredator', ornithosuchidae: 'bigPredator', poposauroidea: 'grazer', aetosauria: 'armoured', silesauridae: 'reptile', lagerpetidae: 'reptile',
  mosasauridae: 'marinePredator', sauropterygia: 'marinePredator', ichthyosauria: 'marinePredator', thalattosauria: 'marinePredator', omphalosauridae: 'marinePredator',
  tanystropheidae: 'reptile', mesosauridae: 'amphibian', testudines: 'turtle', cheloniidae: 'seaTurtle', dermochelyidae: 'seaTurtle', protostegidae: 'seaTurtle',
  reptilia: 'reptile', squamata: 'reptile', serpentes: 'snake', rhynchocephalia: 'reptile', pareiasauria: 'armoured', rhynchosauria: 'grazer', weigeltisauridae: 'flyer',
  // Synapsids and mammals
  synapsida: 'smallMammal', sphenacodontidae: 'bigPredator', gorgonopsia: 'bigPredator', dinocephalia: 'giant', dicynodontia: 'grazer', edaphosauridae: 'grazer',
  mammalia: 'smallMammal', primates: 'primate', carnivora: 'smallMammal', felidae: 'runningPredator', canidae: 'runningPredator', hyaenidae: 'runningPredator',
  ursidae: 'bear', amphicyonidae: 'bear', nimravidae: 'runningPredator', hyaenodonta: 'bigPredator', thylacinidae: 'runningPredator', thylacoleonidae: 'runningPredator',
  sparassodonta: 'runningPredator', pinnipedia: 'marineMammal', cetacea: 'marineMammal', mysticeti: 'filterSwimmer', sirenia: 'filterSwimmer',
  proboscidea: 'giant', rhinocerotidae: 'horned', brontotheriidae: 'giant', chalicotheriidae: 'giant', dinocerata: 'giant', embrithopoda: 'giant',
  hippopotamidae: 'giant', giraffidae: 'giant', diprotodontidae: 'giant', pilosa: 'giant', glyptodontidae: 'armoured', pampatheriidae: 'armoured', cingulata: 'armoured',
  perissodactyla: 'grazer', artiodactyla: 'grazer', entelodontidae: 'horned', litopterna: 'grazer', notoungulata: 'grazer', astrapotheria: 'giant',
  macropodidae: 'grazer', lagomorpha: 'grazer', rodentia: 'smallMammal', chiroptera: 'flyer', monotremata: 'smallMammal',
  // Fish
  chordata: 'fish', vertebrata: 'fish', chondrichthyes: 'marinePredator', batoidea: 'filterSwimmer', rhincodontidae: 'filterSwimmer', holocephali: 'fish',
  placodermi: 'marinePredator', actinopterygii: 'fish', sarcopterygii: 'fish', tetrapodomorpha: 'amphibian', pachycormidae: 'marinePredator', ichthyodectidae: 'marinePredator',
  // Amphibians
  temnospondyli: 'crocodilian', lepospondyli: 'amphibian', reptiliomorpha: 'amphibian', anura: 'amphibian', caudata: 'amphibian', gymnophiona: 'amphibian',
  // Invertebrates
  animalia: 'invertebrate', arthropoda: 'arthropod', radiodonta: 'marinePredator', eurypterida: 'marinePredator', hexapoda: 'insect', cephalopoda: 'marinePredator',
  mollusca: 'invertebrate', echinodermata: 'invertebrate',
};

// Apex predators of their ecosystems always get +3 attack.
const APEX = new Set([
  'panthera-onca', 'panthera-uncia', 'puma-concolor', 'canis-lupus', 'orcinus-orca', 'carcharodon-carcharias', 'crocodylus-porosus', 'crocodylus-niloticus',
  'varanus-komodoensis', 'ursus-maritimus', 'otodus-megalodon', 'livyatan-melvillei', 'dunkleosteus-terrelli', 'anomalocaris-canadensis', 'smilodon-fatalis',
  'smilodon-populator', 'thylacoleo-carnifex', 'hieraaetus-moorei', 'deinosuchus-riograndensis', 'sarcosuchus-imperator', 'purussaurus-brasiliensis',
  'utahraptor-ostrommaysi', 'inostrancevia-alexandri', 'dimetrodon-limbatus', 'kelenken-guillermoi', 'titanoboa-cerrejonensis', 'harpia-harpyja',
]);

// Animals set by hand: [attack, defence, speed, swim].
const OVERRIDES: Record<string, Row> = {
  'panthera-leo': [3, 1, 2, 0],
  'panthera-pardus': [2, 1, 3, 0],
  'panthera-tigris': [3, 1, 1, 1],
  'acinonyx-jubatus': [2, 0, 3, 0],
  'ursus-maritimus': [3, 1, 0, 2],
  'orcinus-orca': [3, 0, 0, 3],
  'velociraptor-mongoliensis': [2, 1, 2, 0],
  'equus-caballus': [1, 1, 3, 0],
  'struthio-camelus': [1, 1, 3, 0],
  'leedsichthys-problematicus': [0, 2, 0, 3],
  'spinosaurus-aegyptiacus': [3, 1, 0, 2],
  'hippopotamus-amphibius': [3, 2, 0, 1],
  'ornithorhynchus-anatinus': [1, 0, 0, 2],
  'lutra-lutra': [1, 0, 1, 2],
};

const num = (v: string) => Number(v.replace(',', '.'));

// Biggest length in metres (or wingspan, for fliers) and weight in kg from a species' facts.
function sizeOf(s: Species): { m?: number; kg?: number } {
  let m: number | undefined;
  let kg: number | undefined;
  for (const f of s.facts ?? []) {
    const label = f.label.toLowerCase();
    const v = f.value;
    if (/length|wingspan|size|height/.test(label)) {
      const hits = [...v.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:[–-]\s*(\d+(?:[.,]\d+)?))?\s*(mm|cm|m)\b/g)];
      for (const h of hits) {
        const x = num(h[2] ?? h[1]!) * (h[3] === 'mm' ? 0.001 : h[3] === 'cm' ? 0.01 : 1);
        if (!m || x > m) m = x;
      }
    }
    if (/weight|mass/.test(label)) {
      const hits = [...v.matchAll(/(\d+(?:[.,]\d+)*)\s*(?:[–-]\s*(\d+(?:[.,]\d+)*))?\s*(tonnes?|t\b|kg|g\b)/g)];
      for (const h of hits) {
        const raw = (h[2] ?? h[1]!).replace(/,(?=\d{3})/g, '');
        const x = num(raw) * (h[3]!.startsWith('t') ? 1000 : h[3] === 'g' ? 0.001 : 1);
        if (!kg || x > kg) kg = x;
      }
    }
  }
  return { m, kg };
}

function kindOf(path: Clade[]): KindId {
  for (let i = path.length - 1; i >= 0; i--) {
    const k = KIND_OF[path[i]!.id];
    if (k) return k;
  }
  return 'invertebrate';
}

function tierOf(s: Species, kind: Kind): Tier | undefined {
  const { m, kg } = sizeOf(s);
  if (m === undefined && kg === undefined) return undefined;
  if ((m ?? 0) >= kind.l[0] || (kg ?? 0) >= kind.l[1]) return 2;
  if ((m ?? 0) >= kind.m[0] || (kg ?? 0) >= kind.m[1]) return 1;
  return 0;
}

let cache: Map<string, Stats> | null = null;

function build(): Map<string, Stats> {
  const out = new Map<string, Stats>();
  // Species with no size facts take the most common size among their family (or medium).
  const byFamily = new Map<string, number[]>();
  const info = SPECIES.map((s) => {
    const path = cladePath(s.clade);
    const kindId = kindOf(path);
    const kind = KINDS[kindId];
    const tier = tierOf(s, kind);
    const fam = path[path.length - 1]?.id ?? '';
    if (tier !== undefined) byFamily.set(fam, [...(byFamily.get(fam) ?? []), tier]);
    return { s, kind, tier, fam };
  });
  for (const { s, kind, tier, fam } of info) {
    let row: Row;
    if (OVERRIDES[s.id]) row = OVERRIDES[s.id]!;
    else {
      const known = byFamily.get(fam);
      const t = tier ?? (known?.length ? (Math.round(known.reduce((a, b) => a + b, 0) / known.length) as Tier) : 1);
      row = [...kind.tiers[t]] as Row;
      if (APEX.has(s.id)) row[0] = 3;
      // Keep cards balanced: no more than 6 points in all, taking from the biggest non-attack stat.
      while (row[0] + row[1] + row[2] + row[3] > 6) {
        const i = [1, 2, 3].sort((a, b) => row[b]! - row[a]!)[0]!;
        row[i] -= 1;
      }
    }
    out.set(s.id, { attack: row[0], defence: row[1], speed: row[2], swim: row[3] });
  }
  return out;
}

export function statsOf(id: string): Stats {
  if (!cache) cache = build();
  return cache.get(id) ?? { attack: 0, defence: 0, speed: 0, swim: 0 };
}

// ---------------------------------------------------------------------------------------------
// Which mass extinction removes a species from play

const living = (s: Species) => /^living/i.test(s.ageText);
let extCache: Map<string, string | null> | null = null;

// A species is wiped out by the first mass extinction its whole lineage did not live through: take
// the largest group it belongs to that has no living members, and the first extinction at or after
// that group's last fossils. All non-bird dinosaurs go with the K–Pg asteroid, whenever they lived;
// gorgonopsians, gone long before, need the end-Permian. Living animals, and lineages that lasted
// past the K–Pg, are safe.
function buildExtinctions(): Map<string, string | null> {
  const out = new Map<string, string | null>();
  const memberAges = new Map<string, { alive: boolean; youngest: number }>();
  for (const s of SPECIES) {
    const ma = speciesMa(s);
    for (const c of cladePath(s.clade)) {
      const cur = memberAges.get(c.id) ?? { alive: false, youngest: Infinity };
      if (living(s)) cur.alive = true;
      else if (ma !== null) cur.youngest = Math.min(cur.youngest, ma);
      memberAges.set(c.id, cur);
    }
  }
  const kpg = EXTINCTIONS.find((e) => e.id === 'k-pg')!;
  const sorted = [...EXTINCTIONS].sort((a, b) => b.ma - a.ma);
  for (const s of SPECIES) {
    if (living(s)) {
      out.set(s.id, null);
      continue;
    }
    const path = cladePath(s.clade);
    const ids = new Set(path.map((c) => c.id));
    if (ids.has('dinosauria') && !ids.has('avialae')) {
      out.set(s.id, kpg.id);
      continue;
    }
    // The largest group in its path with no living members (or the species itself).
    const top = path.find((c) => !memberAges.get(c.id)?.alive);
    const lastMa = top ? memberAges.get(top.id)!.youngest : speciesMa(s);
    let hit: Extinction | undefined;
    if (lastMa !== null && lastMa !== undefined && Number.isFinite(lastMa)) {
      hit = sorted.find((e) => e.ma <= lastMa + 0.5);
    }
    out.set(s.id, hit?.id ?? null);
  }
  return out;
}

export function extinctionOf(id: string): string | null {
  if (!extCache) extCache = buildExtinctions();
  return extCache.get(id) ?? null;
}
