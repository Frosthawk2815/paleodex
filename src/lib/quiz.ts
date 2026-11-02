// The quiz: multiple-choice questions built from PaleoDex's own data, so every answer matches what
// the app shows. Each round draws questions at one difficulty (1 to 5, by how obscure the subject
// is) from a category: everything, dinosaurs, mammals (with their synapsid relatives), animals alive
// today, one group, or one period. Mass extinctions get questions of their own.

import { EVENTS, type HistoryEvent } from '@/data/events';
import { EXTINCTION_DETAILS } from '@/data/extinction-details';
import { type Clade, CLADES, SPECIES, type Species } from '@/data/life';
import { PERIODS } from '@/data/periods';
import { GENUS_MEANINGS, meaningNote, meaningText, SPECIES_MEANINGS } from '@/data/name-meanings';
import { SIZE_FACTS, type SizeFact } from '@/data/quiz-sizes';
import { isModernSpecies } from '@/lib/era';
import { EXTINCTIONS, type Extinction } from '@/lib/extinctions';
import { cladePath, familyOf, pastPointIndex, relativesOf, speciesInClade } from '@/lib/life';
import { phaseCentre, rangeOf } from '@/lib/ranges';
import type { PageRef } from '@/lib/profile';
import { UNITS_BY_LEVEL, type Unit } from '@/lib/time';

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export const DIFFICULTIES: { level: Difficulty; name: string; detail: string }[] = [
  { level: 1, name: 'Hatchling', detail: 'Household names and the basics' },
  { level: 2, name: 'Explorer', detail: 'Well-known animals and when they lived' },
  { level: 3, name: 'Field worker', detail: 'Who lived where, and alongside whom' },
  { level: 4, name: 'Specialist', detail: 'Lesser-known animals and fossil sites' },
  { level: 5, name: 'Professor', detail: 'Rare species and the fine detail of the timescale' },
];

export type Category = { kind: 'all' } | { kind: 'dinosaurs' } | { kind: 'mammals' } | { kind: 'alive'; id?: string } | { kind: 'clade'; id: string } | { kind: 'period'; id: string };
export const categoryKey = (c: Category) => (c.kind === 'clade' || c.kind === 'period' || (c.kind === 'alive' && c.id) ? `${c.kind}:${c.id}` : c.kind);

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  // Shown after answering: why the answer is right.
  explanation: string;
  // A picture to show with the question, and the species to open afterwards.
  image?: string;
  imageLabel?: string;
  speciesId?: string;
  // Clues shown under the question.
  hints?: string[];
  // Another page to open afterwards (e.g. a mass extinction), with its name.
  page?: PageRef;
  pageLabel?: string;
};

// Pictures for a species: the user's own photo if they have one, otherwise PaleoDex's picture.
export type ImageFor = (speciesId: string) => string | undefined;

// ---------------------------------------------------------------------------------------------
// Facts about species

// The best-known prehistoric animals: the subjects of the easiest questions.
const FAMOUS = new Set([
  'tyrannosaurus-rex', 'triceratops-horridus', 'velociraptor-mongoliensis', 'stegosaurus-stenops', 'brachiosaurus-altithorax',
  'spinosaurus-aegyptiacus', 'diplodocus-carnegii', 'ankylosaurus-magniventris', 'parasaurolophus-walkeri', 'pteranodon-longiceps',
  'mammuthus-primigenius', 'smilodon-fatalis', 'dilophosaurus-wetherilli', 'allosaurus-fragilis', 'archaeopteryx-lithographica',
  'apatosaurus-ajax', 'brontosaurus-excelsus', 'iguanodon-bernissartensis', 'pachycephalosaurus-wyomingensis', 'gallimimus-bullatus',
  'deinonychus-antirrhopus', 'carnotaurus-sastrei', 'mosasaurus-hoffmannii', 'dimetrodon-limbatus', 'otodus-megalodon',
  'raphus-cucullatus', 'thylacinus-cynocephalus', 'coelophysis-bauri', 'giganotosaurus-carolinii', 'argentinosaurus-huinculensis',
  'oviraptor-philoceratops', 'protoceratops-andrewsi', 'therizinosaurus-cheloniformis', 'edmontosaurus-regalis', 'compsognathus-longipes',
  'ichthyosaurus-communis', 'plesiosaurus-dolichodeirus', 'quetzalcoatlus-northropi', 'megatherium-americanum', 'baryonyx-walkeri',
]);

// When a species lived, in millions of years ago (its first fossil site, or its range).
const ageCache = new Map<string, number | null>();
export function speciesMa(s: Species): number | null {
  if (ageCache.has(s.id)) return ageCache.get(s.id)!;
  let ma: number | null = null;
  const f = s.formations.map((id) => EVENTS.find((e) => e.id === id)).find((e): e is HistoryEvent => !!e && e.kind === 'Rock formation');
  if (f) {
    const p = f.points[pastPointIndex(f)];
    if (p) ma = (p.fromMa + p.toMa) / 2;
  } else {
    const r = rangeOf(s.id);
    if (r) ma = r.lastSeen ? r.lastSeen.ma : (r.phases[r.phases.length - 1]?.toMa ?? null);
  }
  ageCache.set(s.id, ma);
  return ma;
}

const periodAt = (ma: number) => PERIODS.find((p) => ma <= p.startMa && ma >= p.endMa);

// How obscure a species is, from 1 (household name) to 5.
function obscurity(s: Species, hasImage: boolean): Difficulty {
  if (FAMOUS.has(s.id)) return 1;
  if (s.status === 'full' && s.common && hasImage) return 2;
  if (s.status === 'full') return 3;
  if (s.common || hasImage) return 4;
  return 5;
}

// The everyday group an animal belongs to, for "what kind of animal" questions.
const KINDS: { id: string; label: string }[] = [
  { id: 'aves', label: 'A bird' },
  { id: 'dinosauria', label: 'A dinosaur' },
  { id: 'pterosauria', label: 'A pterosaur (flying reptile)' },
  { id: 'ichthyosauria', label: 'An ichthyosaur (marine reptile)' },
  { id: 'sauropterygia', label: 'A plesiosaur or relative (marine reptile)' },
  { id: 'mosasauridae', label: 'A mosasaur (marine lizard)' },
  { id: 'crocodylia', label: 'A crocodilian' },
  { id: 'crocodylomorpha', label: 'A crocodile relative' },
  { id: 'testudines', label: 'A turtle' },
  { id: 'squamata', label: 'A lizard or snake' },
  { id: 'mammalia', label: 'A mammal' },
  { id: 'synapsida', label: 'A synapsid (early mammal relative)' },
  { id: 'reptilia', label: 'A reptile' },
  { id: 'anura', label: 'An amphibian' },
  { id: 'caudata', label: 'An amphibian' },
  { id: 'temnospondyli', label: 'An amphibian' },
  { id: 'chondrichthyes', label: 'A shark or ray' },
  { id: 'actinopterygii', label: 'A fish' },
  { id: 'sarcopterygii', label: 'A fish' },
  { id: 'placodermi', label: 'A fish' },
  { id: 'arthropoda', label: 'An arthropod (insect, trilobite or relative)' },
  { id: 'mollusca', label: 'A mollusc' },
];
// The ids of a species' groups, worked out once per species (the quiz asks about this a lot).
const pathCache = new Map<string, Set<string>>();
function pathIds(s: Species): Set<string> {
  let ids = pathCache.get(s.id);
  if (!ids) {
    ids = new Set(cladePath(s.clade).map((c) => c.id));
    pathCache.set(s.id, ids);
  }
  return ids;
}
function kindOf(s: Species): string | undefined {
  const ids = pathIds(s);
  return KINDS.find((k) => ids.has(k.id))?.label;
}
// Kinds that would also be true of an animal (a dinosaur is also a reptile; a bird is also a
// dinosaur), so they can't be offered as wrong answers.
function alsoTrue(s: Species): Set<string> {
  const ids = pathIds(s);
  const out = new Set(KINDS.filter((k) => ids.has(k.id)).map((k) => k.label));
  if (ids.has('aves')) out.add('A dinosaur');
  return out;
}
// The groups a species belongs to at each level of detail, for harder "what is it" questions and
// harder wrong answers: 1, its everyday kind (a dinosaur); 2, the main branch of that kind
// (theropod, sauropod or ornithischian); 3, the branch below that (coelurosaur, duck-billed
// dinosaur); 4, its family (abelisaurid, tyrannosaur). Missing where the tree is shallower.
const groupCache = new Map<string, Clade | undefined>();
function groupAt(s: Species, tier: 2 | 3 | 4): Clade | undefined {
  const key = `${s.id}:${tier}`;
  if (!groupCache.has(key)) groupCache.set(key, findGroup(s, tier));
  return groupCache.get(key);
}
function findGroup(s: Species, tier: 2 | 3 | 4): Clade | undefined {
  const path = cladePath(s.clade);
  const ids = path.map((c) => c.id);
  const k = KINDS.findIndex((x) => ids.includes(x.id));
  if (k < 0) return undefined;
  const at = ids.indexOf(KINDS[k]!.id);
  if (tier < 4) return path[at + tier - 1];
  const fam = familyOf(s);
  return fam && ids.indexOf(fam.id) > at + 1 ? fam : path[at + 3];
}
// Every group at a level with at least two species, with the main branch it sits in. Worked out once.
const tierCache = new Map<number, { group: Clade; branch?: string }[]>();
function groupsAtTier(tier: 2 | 3 | 4) {
  let out = tierCache.get(tier);
  if (!out) {
    const seen = new Map<string, { group: Clade; branch?: string }>();
    for (const o of SPECIES) {
      const g = groupAt(o, tier);
      if (g && !seen.has(g.id) && speciesInClade(g.id).length >= 2) seen.set(g.id, { group: g, branch: groupAt(o, 2)?.id });
    }
    out = [...seen.values()];
    tierCache.set(tier, out);
  }
  return out;
}
const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const isDinosaur = (s: Species) => pathIds(s).has('dinosauria') && !pathIds(s).has('aves');
// Mammals and their earlier synapsid relatives (such as Dimetrodon and the cynodonts).
const isSynapsid = (s: Species) => pathIds(s).has('synapsida');
// Synapsids that are clearly not mammals. Cynodonts are left out: some of them (Brasilodon,
// Hadrocodium) are counted as the earliest mammals by some researchers.
const isClearNonMammalSynapsid = (s: Species) => isSynapsid(s) && !pathIds(s).has('mammalia') && !pathIds(s).has('cynodontia');

// Living in the wild today (not recently extinct).
export function isAlive(s: Species): boolean {
  const r = rangeOf(s.id);
  return !!r && !r.lastSeen && r.phases[r.phases.length - 1]?.toMa === 0;
}
// "was" for extinct animals, "is" for living ones.
const was = (s: Species) => (isAlive(s) ? 'is' : 'was');
// Roughly where a living species lives: the centre of its present range. Left out for animals found
// worldwide or kept by people everywhere, where a centre means nothing.
const homeCache = new Map<string, [number, number] | null>();
function homeOf(s: Species): [number, number] | null {
  if (!homeCache.has(s.id)) homeCache.set(s.id, findHome(s));
  return homeCache.get(s.id)!;
}
function findHome(s: Species): [number, number] | null {
  if (!isAlive(s) || /worldwide|domestic|cosmopolitan|every continent/i.test(s.placeText)) return null;
  const r = rangeOf(s.id)!;
  return phaseCentre(r.phases[r.phases.length - 1]!);
}
const kmApart = ([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) => {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
};

export const label = (s: Species) => s.common || s.name;
const named = (s: Species) => (s.common && s.common !== s.name ? `${s.common} (${s.name})` : s.name);

// ---------------------------------------------------------------------------------------------
// Helpers

const pick = <T>(xs: T[]): T | undefined => xs[Math.floor(Math.random() * xs.length)];
function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
// Up to n distinct items from xs, chosen at random.
const sample = <T>(xs: T[], n: number) => shuffle(xs).slice(0, n);

// A question from a right answer and wrong ones (needs three distinct wrong answers).
function build(id: string, prompt: string, right: string, wrong: string[], explanation: string, extra: Partial<Question> = {}): Question | null {
  const distinct = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (distinct.length < 3) return null;
  const options = shuffle([right, ...distinct]);
  return { id, prompt, options, answer: options.indexOf(right), explanation, ...extra };
}

const formationOf = (s: Species) =>
  s.formations.map((id) => EVENTS.find((e) => e.id === id)).find((e): e is HistoryEvent => !!e && e.kind === 'Rock formation');
const speciesInFormation = (id: string) => SPECIES.filter((s) => s.formations.includes(id));

// Name meanings that make good questions: not ones that just repeat the name (Albertosaurus,
// "Alberta lizard"; Quetzalcoatlus, after Quetzalcoatl) or say where it is from.
const giveaway = (name: string, meaning: string) => meaning.toLowerCase().includes(name.slice(0, 4).toLowerCase()) || /^(from|after) /.test(meaning);
const GOOD_GENUS_MEANINGS = Object.entries(GENUS_MEANINGS).filter(([g, m]) => !giveaway(g, meaningText(m)));
const GOOD_SPECIES_MEANINGS = Object.entries(SPECIES_MEANINGS).filter(([id, m]) => !giveaway(id.split('-').slice(1).join(' '), meaningText(m)));
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// ---------------------------------------------------------------------------------------------
// Question types. Each takes a subject species (or nothing) and returns a question, or null if it
// doesn't suit that subject.

type Ctx = { level: Difficulty; pool: Species[]; imageFor: ImageFor; category: Category };

const questionTypes: { levels: Difficulty[]; make: (s: Species, c: Ctx) => Question | null }[] = [
  // What kind of animal is it? At level 1 its everyday kind (a dinosaur); at level 2 the main branch
  // (a theropod, sauropod or ornithischian); at level 3 the branch below (a coelurosaur, a duck-billed
  // dinosaur); at levels 4 and 5 its family (an abelisaurid).
  {
    levels: [1, 2, 3, 4, 5],
    make: (s, c) => {
      if (c.level === 1) {
        const kind = kindOf(s);
        if (!kind) return null;
        // In the mammals quiz the answer would nearly always be "a mammal": ask only about earlier synapsids.
        if (c.category.kind === 'mammals' && pathIds(s).has('mammalia')) return null;
        const excluded = alsoTrue(s);
        const wrong = sample([...new Set(KINDS.map((k) => k.label))].filter((k) => !excluded.has(k)), 3);
        return build(`kind:${s.id}`, `What kind of animal is ${named(s)}?`, kind, wrong, `${label(s)} ${was(s)} ${lower(kind)}.`, { speciesId: s.id });
      }
      const tier = Math.min(c.level, 4) as 2 | 3 | 4;
      const group = groupAt(s, tier);
      if (!group) return null;
      // A group-of-one answer is no test; neither is a group the quiz is named after.
      // In a quiz on one group, the answer must be a group inside it (not "carnivorans" in a cats quiz).
      const quizGroup = c.category.kind === 'clade' || c.category.kind === 'alive' ? c.category.id : undefined;
      if (speciesInClade(group.id).length < 2 || (quizGroup && (group.id === quizGroup || !cladePath(group.id).some((x) => x.id === quizGroup)))) return null;
      const own = new Set(cladePath(s.clade).map((x) => x.id));
      // Wrong answers: groups at the same level, from the same branch first (other theropod
      // families for a theropod), then wider.
      const branch = groupAt(s, 2)?.id;
      const options = groupsAtTier(tier).filter((x) => !own.has(x.group.id));
      const siblings = options.filter((x) => x.group.parent === group.parent);
      const sameBranch = options.filter((x) => x.branch === branch && !siblings.includes(x));
      const rest = options.filter((x) => !siblings.includes(x) && !sameBranch.includes(x));
      const pool = [...shuffle(siblings), ...shuffle(sameBranch), ...shuffle(rest)].map((x) => x.group);
      const wrong = sample(pool.slice(0, Math.max(3, siblings.length)), 3).map((g) => g.common);
      return build(`group:${s.id}:${tier}`, `Which group ${isAlive(s) ? 'does' : 'did'} ${named(s)} belong to?`, cap(group.common), wrong.map(cap), `${label(s)} ${was(s)} one of the ${lower(group.common)} (${group.name}).`, {
        speciesId: s.id,
      });
    },
  },
  // Which animal is in this picture?
  {
    levels: [1, 2, 3],
    make: (s, c) => {
      const image = c.imageFor(s.id);
      if (!image) return null;
      const kind = kindOf(s);
      // Easier levels mix in different kinds of animal; harder ones use close relatives.
      const others = c.level >= 3 ? relativesOf(s).slice(0, 12) : SPECIES.filter((o) => kindOf(o) === kind && o.id !== s.id && FAMOUS.has(o.id));
      const wrong = sample(others.length >= 3 ? others : SPECIES.filter((o) => o.id !== s.id && FAMOUS.has(o.id)), 3).map(label);
      return build(`picture:${s.id}`, 'Which animal is shown in this picture?', label(s), wrong, `This is ${named(s)}.`, { image, speciesId: s.id });
    },
  },
  // In which period did it live?
  {
    levels: [1, 2, 3, 4],
    make: (s, c) => {
      // In a period quiz the answer would always be that period.
      if (c.category.kind === 'period') return null;
      const ma = speciesMa(s);
      if (ma === null || ma < 0.0117) return null;
      const period = periodAt(ma);
      if (!period) return null;
      const i = PERIODS.indexOf(period);
      // Harder levels offer neighbouring periods.
      const near = c.level >= 3 ? PERIODS.slice(Math.max(0, i - 3), i + 4) : PERIODS;
      const wrong = sample(near.filter((p) => p !== period), 3).map((p) => p.name);
      return build(`period:${s.id}`, `In which period did ${named(s)} live?`, period.name, wrong, `${label(s)} lived in the ${period.name}, ${lower(s.ageText)}.`, { speciesId: s.id });
    },
  },
  // This is X. Which of these is its closest relative?
  {
    levels: [1, 2, 3, 4, 5],
    make: (s, c) => {
      const image = c.imageFor(s.id);
      const rel = relativesOf(s);
      if (!image || rel.length < 1) return null;
      const right = c.level >= 4 ? rel[0]! : (pick(rel.slice(0, 3)) ?? rel[0]!);
      // A picture alone isn't always enough, so easier levels add clues: when it lived, where it is
      // found, an animal it lived alongside and another relative. Each level up takes one away,
      // the most telling first; at the top level there is only the name and the picture.
      const f = formationOf(s);
      const neighbour = f ? pick(speciesInFormation(f.id).filter((o) => o.id !== s.id && !rel.some((r) => r.id === o.id))) : undefined;
      const other = pick(rel.filter((r) => r.id !== right.id));
      const clues = [
        isAlive(s) ? 'Alive today' : `Lived ${lower(s.ageText)}`,
        `${isAlive(s) ? 'Lives in' : 'Fossils found in'}: ${s.placeText.replace(/ \(.*\)$/, '')}`,
        neighbour ? `Lived alongside ${label(neighbour)}` : null,
        other ? `Also related to ${label(other)}` : familyOf(s) ? `Part of the ${lower(familyOf(s)!.common)}` : null,
      ];
      const hints = clues.slice(0, 5 - c.level).filter((h): h is string => !!h);
      const relIds = new Set([s.id, ...rel.map((r) => r.id)]);
      const kind = kindOf(s);
      // Wrong answers get closer as the level rises: anything famous at level 1; the same kind of
      // animal from another main branch at level 2 (a sauropod or ornithischian for a theropod); the
      // same branch at level 3 (another theropod, not a coelurosaur); the same sub-branch but another
      // family at levels 4 and 5.
      const same = (o: Species, tier: 2 | 3) => groupAt(o, tier)?.id === groupAt(s, tier)?.id;
      const others = SPECIES.filter((o) => !relIds.has(o.id) && kindOf(o) === kind);
      // If a level has too few, loosen one step at a time.
      const steps: Species[][] = [
        others.filter((o) => same(o, 3) && familyOf(o)?.id !== familyOf(s)?.id),
        others.filter((o) => same(o, 2) && !same(o, 3)),
        others.filter((o) => !same(o, 2)),
        others,
      ];
      const start = c.level >= 4 ? 0 : c.level === 3 ? 1 : 2;
      const famous = SPECIES.filter((o) => !relIds.has(o.id) && FAMOUS.has(o.id));
      const candidates = c.level === 1 ? famous : [...steps.slice(start), famous].find((xs) => xs.length >= 3) ?? famous;
      const wrong = sample(candidates, 3).map(label);
      return build(
        `relative:${s.id}`,
        `This is ${named(s)}. Which of these is its closest relative?`,
        label(right),
        wrong,
        `${label(right)} is in the same family as ${label(s)}.`,
        { image, speciesId: s.id, hints },
      );
    },
  },
  // Which of these lived alongside it?
  {
    levels: [3, 4, 5],
    make: (s) => {
      const f = formationOf(s);
      if (!f) return null;
      const neighbours = speciesInFormation(f.id).filter((o) => o.id !== s.id);
      const right = pick(neighbours.filter((o) => kindOf(o) === kindOf(s))) ?? pick(neighbours);
      if (!right) return null;
      const ma = speciesMa(s) ?? 0;
      // Wrong answers: the same kind of animal, from other places and at least 10 million years apart.
      const wrong = sample(
        SPECIES.filter((o) => kindOf(o) === kindOf(right) && !o.formations.includes(f.id) && Math.abs((speciesMa(o) ?? 1e9) - ma) > 10),
        3,
      ).map(label);
      return build(
        `alongside:${s.id}`,
        `Which of these lived in the same place and time as ${named(s)}?`,
        label(right),
        wrong,
        `Both ${label(s)} and ${label(right)} are found in the ${f.title}.`,
        { speciesId: s.id },
      );
    },
  },
  // Where were its fossils found?
  {
    levels: [3, 4, 5],
    make: (s) => {
      const f = formationOf(s);
      if (!f) return null;
      const ma = speciesMa(s) ?? 0;
      const others = EVENTS.filter((e) => e.kind === 'Rock formation' && !s.formations.includes(e.id));
      // Harder questions choose formations of a similar age.
      const close = others.filter((e) => Math.abs((e.points[pastPointIndex(e)]?.jumpMa ?? 0) - ma) < 30);
      const wrong = sample(close.length >= 3 ? close : others, 3).map((e) => e.title);
      return build(`formation:${s.id}`, `In which rock formation have fossils of ${named(s)} been found?`, f.title, wrong, `${label(s)} is known from the ${f.title} (${f.placeText}).`, {
        speciesId: s.id,
      });
    },
  },
  // Which of these lived first?
  {
    levels: [3, 4, 5],
    make: (s, c) => {
      const ma = speciesMa(s);
      if (ma === null) return null;
      // Three others from the pool, each at least 15 million years younger.
      const younger = sample(
        c.pool.filter((o) => {
          const m = speciesMa(o);
          return m !== null && m < ma - 15 && !isModernSpecies(o);
        }),
        3,
      );
      return build(`oldest:${s.id}`, 'Which of these lived earliest?', label(s), younger.map(label), `${label(s)} lived ${lower(s.ageText)}, before the others.`, {
        speciesId: s.id,
      });
    },
  },
  // Which of these is not a dinosaur?
  {
    levels: [1, 2],
    make: (s, c) => {
      if (c.category.kind === 'period' || c.category.kind === 'mammals' || isDinosaur(s) || alsoTrue(s).has('A dinosaur') || !kindOf(s)) return null;
      const dinos = sample((c.category.kind === 'dinosaurs' ? c.pool : SPECIES).filter((o) => isDinosaur(o) && FAMOUS.has(o.id)), 3);
      return build(`notdino:${s.id}`, 'Which of these is not a dinosaur?', label(s), dinos.map(label), `${label(s)} ${was(s)} ${lower(kindOf(s)!)}, not a dinosaur.`, {
        speciesId: s.id,
      });
    },
  },
  // What does its name mean?
  {
    levels: [1, 2, 3, 4, 5],
    make: (s) => {
      const genus = s.name.split(' ')[0]!;
      const m = GENUS_MEANINGS[genus];
      if (!m || giveaway(genus, meaningText(m))) return null;
      const right = meaningText(m);
      const wrong = sample(GOOD_GENUS_MEANINGS.map(([, o]) => meaningText(o)).filter((t) => t !== right), 3).map(cap);
      const note = meaningNote(m);
      return build(`meaning:${genus}`, `What does the name ${genus} mean?`, cap(right), wrong, `${genus} means “${right}”.${note ? ` ${note}` : ''}`, { speciesId: s.id });
    },
  },
  // What does its species name mean? (rex, "king")
  {
    levels: [2, 3, 4, 5],
    make: (s) => {
      const m = SPECIES_MEANINGS[s.id];
      const epithet = s.name.split(' ').slice(1).join(' ');
      if (!m || !epithet || giveaway(epithet, meaningText(m))) return null;
      const right = meaningText(m);
      const wrong = sample(GOOD_SPECIES_MEANINGS.map(([, o]) => meaningText(o)).filter((t) => t !== right), 3).map(cap);
      const note = meaningNote(m);
      return build(`epithet:${s.id}`, `In the name ${s.name}, what does “${epithet}” mean?`, cap(right), wrong, `“${epithet}” means “${right}”.${note ? ` ${note}` : ''}`, {
        speciesId: s.id,
      });
    },
  },
  // Which of these is not a mammal? (An early synapsid among true mammals.)
  {
    levels: [1, 2, 3],
    make: (s, c) => {
      if (!['all', 'mammals'].includes(c.category.kind) && !(c.category.kind === 'clade' && pathIds(s).has(c.category.id))) return null;
      if (!isClearNonMammalSynapsid(s)) return null;
      const mammals = (c.category.kind === 'mammals' ? c.pool : SPECIES).filter(
        (o) => pathIds(o).has('mammalia') && (FAMOUS.has(o.id) || (!!o.common && o.status === 'full' && !!c.imageFor(o.id))),
      );
      return build(
        `notmammal:${s.id}`,
        'Which of these is not a mammal?',
        label(s),
        sample(mammals, 3).map(label),
        `${label(s)} was a synapsid, an early relative of mammals: closer to mammals than to reptiles, but not a mammal itself.`,
        { speciesId: s.id },
      );
    },
  },
  // Where does it live in the wild? (Living animals.)
  {
    levels: [2, 3, 4, 5],
    make: (s, c) => {
      const home = homeOf(s);
      if (!home) return null;
      // Wrong answers: other living animals that live far away (the same kind at harder levels).
      const far = SPECIES.filter((o) => {
        if (o.id === s.id || o.placeText === s.placeText || (c.level >= 4 && kindOf(o) !== kindOf(s))) return false;
        const h = homeOf(o);
        return !!h && kmApart(h, home) > 3000;
      });
      return build(`where:${s.id}`, `Where does the ${label(s)} live in the wild?`, s.placeText, sample(far, 3).map((o) => o.placeText), `${label(s)} lives here: ${s.placeText}.`, {
        speciesId: s.id,
      });
    },
  },
  // Which of these is still alive today? (One living animal among extinct ones of the same kind.)
  {
    levels: [1, 2, 3],
    make: (s, c) => {
      if (!isAlive(s) || !['all', 'alive', 'mammals', 'clade'].includes(c.category.kind)) return null;
      const kind = kindOf(s);
      const extinct = SPECIES.filter((o) => !isAlive(o) && (c.level >= 2 ? kindOf(o) === kind : FAMOUS.has(o.id)) && (c.level >= 3 || FAMOUS.has(o.id) || (o.status === 'full' && !!o.common)));
      return build(`stillalive:${s.id}`, 'Which of these is still alive today?', label(s), sample(extinct, 3).map(label), `${label(s)} is alive today; the others are extinct.`, {
        speciesId: s.id,
      });
    },
  },
];

// ---------------------------------------------------------------------------------------------
// Size questions: "what is the average length of an adult ...?", from quiz-sizes.ts.

const sig2 = (v: number) => {
  if (v >= 10) {
    const p = 10 ** (Math.floor(Math.log10(v)) - 1);
    return Math.round(v / p) * p;
  }
  return Math.round(v * 10) / 10;
};
// A metric size in a sensible unit: "About 7 m", "About 74 cm", "About 2–3 tonnes".
function sizeText(measure: SizeFact['measure'], value: number | [number, number]): string {
  const [lo, hi] = typeof value === 'number' ? [value, value] : value;
  // The unit suits the smaller figure, so a range never reads "0.6–1.1 tonnes".
  const [div, unit] =
    measure === 'length' ? (hi < 0.01 ? [0.001, 'mm'] : lo < 1 ? [0.01, 'cm'] : [1, 'm']) : hi < 1 ? [0.001, 'g'] : lo < 1000 ? [1, 'kg'] : [1000, 'tonnes'];
  const n = (v: number) => sig2(v / div).toLocaleString('en-US');
  const name = unit === 'tonnes' && hi === 1000 ? 'tonne' : unit;
  return lo === hi ? `About ${n(lo)} ${name}` : `About ${n(lo)}–${n(hi)} ${name}`;
}
const scale = (v: number | [number, number], k: number): number | [number, number] => (typeof v === 'number' ? v * k : [v[0] * k, v[1] * k]);
// Whether two sizes could be confused: their ranges overlap, or single figures are within 25%.
const span = (v: number | [number, number]): [number, number] => (typeof v === 'number' ? [v / 1.25, v * 1.25] : v);
const overlaps = (a: number | [number, number], b: number | [number, number]) => span(a)[0] <= span(b)[1] && span(b)[0] <= span(a)[1];

// How hard a size question is: the species' obscurity, plus 1 for naming a sex, plus 1 for the
// less familiar sex.
export const sizeDifficulty = (f: SizeFact, s: Species, imageFor: ImageFor) =>
  Math.min(5, obscurity(s, !!imageFor(s.id)) + (f.sex ? 1 : 0) + (f.lesser ? 1 : 0)) as Difficulty;

export function sizeQuestion(f: SizeFact, s: Species): Question | null {
  const who = `an adult ${f.sex ? `${f.sex} ` : ''}${named(s)}`;
  const what = f.measure === 'length' ? 'length' : 'weight';
  const base = f.max ? `How ${f.measure === 'length' ? 'long' : 'heavy'} can ${who} grow?` : `what is the average ${what} of ${who}?`;
  const prompt = f.max
    ? f.known === 'fossils'
      ? `Based on the fossils we have, ${lower(base)}`
      : base
    : f.known === 'fossils'
      ? `Based on the fossils we have, ${base}`
      : f.known === 'remains'
        ? `Based on the specimens we have, ${base}`
        : base.charAt(0).toUpperCase() + base.slice(1);
  const right = sizeText(f.measure, f.value);
  // The other sex's figure makes a good wrong answer; the rest are clearly bigger or smaller.
  // Wrong answers never overlap the right one or each other.
  const otherSex = f.sex ? SIZE_FACTS.find((o) => o.id === f.id && o.measure === f.measure && o.sex && o.sex !== f.sex) : undefined;
  const chosen: (number | [number, number])[] = [f.value];
  for (const v of [...(otherSex ? [otherSex.value] : []), ...shuffle([0.25, 0.5, 2, 4, 8]).map((k) => scale(f.value, k))]) {
    if (!chosen.some((c) => overlaps(c, v))) chosen.push(v);
  }
  const wrong = chosen.slice(1).map((v) => sizeText(f.measure, v));
  return build(`size:${f.id}:${f.measure}:${f.sex ?? 'any'}`, prompt, right, wrong, f.explanation, { speciesId: s.id });
}

// Questions about the geological timescale, for the period category and the hardest levels.
function timescaleQuestion(level: Difficulty, period?: string): Question | null {
  const periods = UNITS_BY_LEVEL.period;
  const p = period ? periods.find((u) => u.name.toLowerCase() === PERIODS.find((x) => x.id === period)?.name.toLowerCase()) : pick(periods);
  if (!p) return null;
  const allStages = UNITS_BY_LEVEL.stage;
  const stages = (u: Unit): Unit[] => (u.level === 'stage' ? [u] : u.children.flatMap(stages));
  const own = stages(p).sort((a, b) => b.startMa - a.startMa);
  const kinds = [
    () => {
      const i = periods.indexOf(p);
      const next = periods[i + 1];
      if (!next) return null;
      return build(`after:${p.key}`, `Which period came straight after the ${p.name}?`, next.name, sample(periods.filter((u) => u !== next && u !== p), 3).map((u) => u.name), `The ${next.name} followed the ${p.name}, ${Math.round(p.endMa)} million years ago.`);
    },
    () => {
      const last = own[own.length - 1];
      if (!last || own.length < 2) return null;
      const name = last.name.match(/^Stage \d+$/) ? `${last.name} (not yet formally named)` : last.name;
      return build(`laststage:${p.key}`, `What is the last stage of the ${p.name}?`, name, [...own.slice(0, -1).map((u) => u.name), ...sample(allStages, 4).map((u) => u.name)], `The ${p.name} ends with the ${name}.`);
    },
    () => {
      const st = pick(own);
      if (!st) return null;
      return build(`stageof:${st.key}`, `The ${st.name} stage belongs to which period?`, p.name, sample(periods.filter((u) => u !== p), 3).map((u) => u.name), `The ${st.name} is a stage of the ${p.name}.`);
    },
  ];
  const usable = level >= 4 ? kinds : kinds.slice(0, 1);
  for (const k of shuffle(usable)) {
    const q = k();
    if (q) return q;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Mass extinction questions, from the extinction pages. Each notes the groups it is about, so group,
// dinosaur and mammal quizzes only get the ones that concern their animals.

// inside: the question only suits quizzes on its groups or groups within them (not ones they contain).
type ExtinctionQ = { q: Question; levels: Difficulty[]; clades: string[]; extinction: Extinction; inside?: boolean };
const WELL_KNOWN_EXTINCTIONS = new Set(['k-pg', 'end-permian']);
// The period each extinction ended (the Kellwasser event fell within the Devonian).
const PERIOD_ENDED: Record<string, string> = {
  'end-cambrian': 'Cambrian',
  'end-ordovician': 'Ordovician',
  hangenberg: 'Devonian',
  'end-permian': 'Permian',
  'end-triassic': 'Triassic',
  'k-pg': 'Cretaceous',
};
const lowerName = (n: string) => (/^[A-Z][a-z]/.test(n) && !/^(Lystrosaurus|Dunkleosteus)/.test(n) ? lower(n) : n);

// Built fresh each time, so wrong answers are shuffled differently.
function extinctionQuestions(): ExtinctionQ[] {
  const out: ExtinctionQ[] = [];
  const named = EXTINCTIONS.filter((e) => e.bigFive);
  for (const e of EXTINCTIONS) {
    const d = EXTINCTION_DETAILS[e.id];
    if (!d) continue;
    const easy = WELL_KNOWN_EXTINCTIONS.has(e.id);
    const extra = { page: { kind: 'extinction', id: e.id } as PageRef, pageLabel: `the ${e.name}` };
    const finals = d.lost.filter((g) => g.final);
    const add = (q: Question | null, levels: Difficulty[], clades: string[] = [], inside = false) => q && out.push({ q, levels, clades, extinction: e, inside });
    // What caused it?
    if (e.bigFive) {
      const causes = [...new Set(named.map((x) => x.causeText))];
      add(
        build(`excause:${e.id}`, `What caused the ${e.name}?`, cap(e.causeText), causes.filter((c) => c !== e.causeText).map(cap), `${cap(e.causeText)}. ${d.summary[0]}`, extra),
        easy ? [1, 2, 3] : [3, 4, 5],
        finals.map((g) => g.clade).filter((c): c is string => !!c),
      );
    }
    // When did it happen?
    const when = (x: Extinction) => `About ${Math.round(x.ma)} million years ago`;
    add(
      build(`exwhen:${e.id}`, `When did the ${e.name} happen?`, when(e), EXTINCTIONS.filter((x) => x !== e).map(when), `${when(e)}.`, extra),
      easy ? [2, 3] : [4, 5],
    );
    // Which period did it end?
    const period = PERIOD_ENDED[e.id];
    if (period) {
      add(
        build(`experiod:${e.id}`, `The ${e.name} marks the end of which period?`, period, sample(PERIODS.map((p) => p.name).filter((n) => n !== period), 3), `It marks the end of the ${period}, about ${Math.round(e.ma)} million years ago.`, extra),
        easy ? [2, 3, 4] : [4, 5],
      );
    }
    // Which extinction wiped out a group for good?
    for (const g of finals) {
      add(
        build(`exended:${e.id}:${g.name}`, `Which mass extinction wiped out the last of the ${lowerName(g.name)}?`, e.name, EXTINCTIONS.filter((x) => x !== e).map((x) => x.name), `The ${e.name}. ${g.note}`, extra),
        easy && ['dinosauria', 'pterosauria', 'ammonoidea', 'trilobita'].includes(g.clade ?? '') ? [1, 2, 3] : [3, 4, 5],
        g.clade ? [g.clade] : [],
      );
    }
    // Which of these groups made it through? (Wrong answers: groups it wiped out completely.)
    if (finals.length >= 3) {
      for (const g of d.survived) {
        add(
          build(`exsurvived:${e.id}:${g.name}`, `Which of these made it through the ${e.name}?`, g.name, finals.map((f) => f.name), `${g.name} made it through. ${g.note} The others died out.`, extra),
          easy ? [2, 3, 4] : [4, 5],
          // Only the survivor counts: a turtle quiz may ask which group made it through, but a
          // tyrannosaur quiz shouldn't get this just because dinosaurs are a wrong answer.
          g.clade ? [g.clade] : [],
          true,
        );
      }
    }
  }
  // The largest of all.
  const permian = EXTINCTIONS.find((e) => e.id === 'end-permian');
  if (permian) {
    const q = build('exlargest', 'Which was the largest mass extinction in Earth’s history?', permian.name, EXTINCTIONS.filter((e) => e.bigFive && e !== permian).map((e) => e.name), 'The End-Permian extinction, the “Great Dying”, about 252 million years ago, wiped out about 81% of marine species.', {
      page: { kind: 'extinction', id: permian.id },
      pageLabel: `the ${permian.name}`,
    });
    if (q) out.push({ q, levels: [1, 2, 3], clades: [], extinction: permian });
  }
  return out;
}

// Extinction questions that suit a quiz: any for everything; for a period, the extinctions within or
// ending it; for dinosaurs, mammals or a group, those about its animals. None for animals alive today.
function extinctionQuestionsFor(category: Category, level: Difficulty): Question[] {
  const all = extinctionQuestions().filter((x) => x.levels.includes(level));
  if (category.kind === 'all') return all.map((x) => x.q);
  if (category.kind === 'period') {
    const p = PERIODS.find((x) => x.id === category.id);
    if (!p) return [];
    return all.filter((x) => x.extinction.ma <= p.startMa && x.extinction.ma >= p.endMa - 0.5).map((x) => x.q);
  }
  const root = category.kind === 'dinosaurs' ? 'dinosauria' : category.kind === 'mammals' ? 'synapsida' : category.kind === 'clade' ? category.id : null;
  if (!root) return [];
  // A question concerns the quiz's animals if one of its groups is the quiz's group, inside it, or
  // (for broad questions such as "the non-bird dinosaurs") contains it.
  const within = (clade: string) => cladePath(clade).some((c) => c.id === root);
  const contains = (clade: string) => cladePath(root).some((c) => c.id === clade);
  return all.filter((x) => x.clades.some((c) => within(c) || (!x.inside && contains(c)))).map((x) => x.q);
}

// ---------------------------------------------------------------------------------------------
// Rounds

// The species a category covers.
export function categoryPool(c: Category): Species[] {
  if (c.kind === 'dinosaurs') return SPECIES.filter(isDinosaur);
  if (c.kind === 'mammals') return SPECIES.filter(isSynapsid);
  if (c.kind === 'alive') return (c.id ? speciesInClade(c.id) : SPECIES).filter(isAlive);
  if (c.kind === 'clade') return speciesInClade(c.id);
  if (c.kind === 'period') {
    const p = PERIODS.find((x) => x.id === c.id);
    if (!p) return [];
    return SPECIES.filter((s) => {
      const ma = speciesMa(s);
      return ma !== null && ma <= p.startMa && ma >= p.endMa;
    });
  }
  return SPECIES;
}

// Groups worth a quiz of their own: big groups and families with plenty of species.
export const QUIZ_GROUPS = CLADES.filter((c) => !['animalia', 'chordata', 'vertebrata', 'mammalia', 'synapsida'].includes(c.id) && speciesInClade(c.id).length >= 12).sort((a, b) =>
  (a.common || a.name).localeCompare(b.common || b.name),
);

// Groups of living animals worth a quiz of their own (at least ten species alive today), for the
// Alive today category.
// Groups with exactly the same living members (birds are the only living theropods, dinosaurs,
// coelurosaurs…) are listed once: under the everyday name if one of them has it (Birds, Mammals),
// otherwise the narrowest.
export const LIVING_GROUPS = (() => {
  const bySet = new Map<string, Clade[]>();
  for (const c of CLADES) {
    if (['animalia', 'chordata', 'vertebrata'].includes(c.id)) continue;
    const living = speciesInClade(c.id).filter(isAlive);
    if (living.length < 10) continue;
    const key = living.map((x) => x.id).sort().join(',');
    bySet.set(key, [...(bySet.get(key) ?? []), c]);
  }
  const rank = (c: Clade) => {
    const k = KINDS.findIndex((x) => x.id === c.id);
    return k >= 0 ? k : 100 - cladePath(c.id).length;
  };
  return [...bySet.values()].map((cs) => cs.sort((a, b) => rank(a) - rank(b))[0]!).sort((a, b) => (a.common || a.name).localeCompare(b.common || b.name));
})();

// A round of questions at one difficulty. Subjects are drawn from the right obscurity, then the
// neighbouring ones if the category is small.
// show: how text will be displayed (e.g. converted to imperial units). A question is left out if two
// of its answers would read the same once shown that way (two lengths rounding to the same feet).
export function makeRound(category: Category, level: Difficulty, imageFor: ImageFor, count = 10, show: (t: string) => string = (t) => t): Question[] {
  const distinct = (q: Question) => new Set(q.options.map(show)).size === q.options.length;
  const pool = categoryPool(category);
  const ctx: Ctx = { level, pool, imageFor, category };
  const byTier = (t: number) => pool.filter((s) => obscurity(s, !!imageFor(s.id)) === t);
  const subjects: Species[] = [];
  for (const d of [0, -1, 1, -2, 2, -3, 3, -4, 4]) {
    const t = level + d;
    if (t >= 1 && t <= 5) subjects.push(...shuffle(byTier(t)));
    if (subjects.length >= count * 4) break;
  }
  const types = questionTypes.filter((t) => t.levels.includes(level));
  const out: Question[] = [];
  const seen = new Set<string>();
  const usedSpecies = new Set<string>();
  // Timescale questions: a few in period quizzes, and now and then at the top levels.
  // (Group and dinosaur quizzes stay on their animals.)
  const timescaleCount =
    category.kind === 'period' ? Math.round(count * 0.3) : category.kind !== 'all' ? 0 : level >= 4 ? Math.round(count * 0.2) : level === 3 ? 1 : 0;
  for (let i = 0; i < timescaleCount * 3 && out.filter((q) => q.id.match(/^(after|laststage|stageof):/)).length < timescaleCount; i++) {
    const q = timescaleQuestion(level, category.kind === 'period' ? category.id : undefined);
    if (q && distinct(q) && !seen.has(q.id)) {
      seen.add(q.id);
      out.push(q);
    }
  }
  // Up to two size questions, at this level, about animals in the category.
  const poolIds = new Set(pool.map((s) => s.id));
  for (const f of shuffle(SIZE_FACTS)) {
    if (out.filter((q) => q.id.startsWith('size:')).length >= 2) break;
    const s = poolIds.has(f.id) ? SPECIES.find((x) => x.id === f.id) : undefined;
    if (!s || usedSpecies.has(s.id) || sizeDifficulty(f, s, imageFor) !== level) continue;
    const q = sizeQuestion(f, s);
    if (q && distinct(q) && !seen.has(q.id)) {
      seen.add(q.id);
      usedSpecies.add(s.id);
      out.push(q);
    }
  }
  // A mass extinction question, where one suits the quiz (two in a period quiz with more than one).
  const exCount = category.kind === 'period' ? 2 : 1;
  for (const q of shuffle(extinctionQuestionsFor(category, level))) {
    if (out.filter((x) => x.id.startsWith('ex')).length >= exCount) break;
    const sameEvent = out.some((x) => x.page && q.page && x.page.id === q.page.id);
    if (distinct(q) && !seen.has(q.id) && !sameEvent) {
      seen.add(q.id);
      out.push(q);
    }
  }
  // No more than a quarter of a round (at least two) of any one kind of question.
  const perType = Math.max(2, Math.ceil(count / 4));
  const typeCount = new Map<string, number>();
  for (const s of subjects) {
    if (out.length >= count) break;
    if (usedSpecies.has(s.id)) continue;
    for (const t of shuffle(types)) {
      const q = t.make(s, ctx);
      const kind = q?.id.split(':')[0] ?? '';
      if (q && distinct(q) && !seen.has(q.id) && (typeCount.get(kind) ?? 0) < perType) {
        typeCount.set(kind, (typeCount.get(kind) ?? 0) + 1);
        seen.add(q.id);
        usedSpecies.add(s.id);
        out.push(q);
        break;
      }
    }
  }
  // If the variety limit left the round short (small categories), fill it with any kind.
  for (const s of subjects) {
    if (out.length >= count) break;
    if (usedSpecies.has(s.id)) continue;
    for (const t of shuffle(types)) {
      const q = t.make(s, ctx);
      if (q && distinct(q) && !seen.has(q.id)) {
        seen.add(q.id);
        usedSpecies.add(s.id);
        out.push(q);
        break;
      }
    }
  }
  return shuffle(out).slice(0, count);
}

// Whether a category has enough to quiz on.
export const categorySize = (c: Category) => categoryPool(c).length;
export const isModern = isModernSpecies;

// ---------------------------------------------------------------------------------------------
// Lifelines

// 50/50: two wrong answers, chosen at random, to take away.
export function fiftyFifty(q: Question): number[] {
  return shuffle(q.options.map((_, i) => i).filter((i) => i !== q.answer)).slice(0, 2);
}

// A fresh question for Refresh and Switcheroo: from the given quiz, and not about a question or
// species already in the round.
export function replacementQuestion(category: Category, level: Difficulty, imageFor: ImageFor, current: Question[], show: (t: string) => string = (t) => t): Question | null {
  const ids = new Set(current.map((q) => q.id));
  const species = new Set(current.map((q) => q.speciesId).filter(Boolean));
  for (let i = 0; i < 3; i++) {
    const q = makeRound(category, level, imageFor, 10, show).find((x) => !ids.has(x.id) && !(x.speciesId && species.has(x.speciesId)));
    if (q) return q;
  }
  return null;
}

// Switcheroo: the quiz the switched question comes from. It is never easier than the quiz the
// target is playing: from the sender's own pick, at its level or the level being played, whichever
// is higher. If that is just the quiz already being played (the sender's pick won, or both picked
// the same), it is one level harder, or at the top level, a different topic picked at random.
export function switcherooQuiz(mine: { category: Category; level: Difficulty }, playing: { category: Category; level: Difficulty }): { category: Category; level: Difficulty } {
  const level = Math.max(mine.level, playing.level) as Difficulty;
  const same = categoryKey(mine.category) === categoryKey(playing.category) && level === playing.level;
  if (!same) return { category: mine.category, level };
  if (level < 5) return { category: mine.category, level: (level + 1) as Difficulty };
  const basics: Category[] = [{ kind: 'all' }, { kind: 'dinosaurs' }, { kind: 'mammals' }, { kind: 'alive' }];
  const topics: Category[] = [
    ...basics,
    ...PERIODS.map((p): Category => ({ kind: 'period', id: p.id })),
    ...QUIZ_GROUPS.map((c): Category => ({ kind: 'clade', id: c.id })),
  ].filter((c) => categoryKey(c) !== categoryKey(mine.category) && categoryPool(c).length >= 20);
  return { category: pick(topics) ?? { kind: 'all' }, level: 5 };
}
