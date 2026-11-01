// The quiz: multiple-choice questions built from PaleoDex's own data, so every answer matches what
// the app shows. Each round draws questions at one difficulty (1 to 5, by how obscure the subject
// is) from a category: everything, dinosaurs, mammals (with their synapsid relatives), one group, or
// one period.

import { EVENTS, type HistoryEvent } from '@/data/events';
import { CLADES, SPECIES, type Species } from '@/data/life';
import { PERIODS } from '@/data/periods';
import { GENUS_MEANINGS, meaningNote, meaningText, SPECIES_MEANINGS } from '@/data/name-meanings';
import { SIZE_FACTS, type SizeFact } from '@/data/quiz-sizes';
import { isModernSpecies } from '@/lib/era';
import { cladePath, pastPointIndex, relativesOf, speciesInClade } from '@/lib/life';
import { rangeOf } from '@/lib/ranges';
import { UNITS_BY_LEVEL, type Unit } from '@/lib/time';

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export const DIFFICULTIES: { level: Difficulty; name: string; detail: string }[] = [
  { level: 1, name: 'Hatchling', detail: 'Household names and the basics' },
  { level: 2, name: 'Explorer', detail: 'Well-known animals and when they lived' },
  { level: 3, name: 'Field worker', detail: 'Who lived where, and alongside whom' },
  { level: 4, name: 'Specialist', detail: 'Lesser-known animals and fossil sites' },
  { level: 5, name: 'Professor', detail: 'Rare species and the fine detail of the timescale' },
];

export type Category = { kind: 'all' } | { kind: 'dinosaurs' } | { kind: 'mammals' } | { kind: 'clade'; id: string } | { kind: 'period'; id: string };
export const categoryKey = (c: Category) => (c.kind === 'clade' || c.kind === 'period' ? `${c.kind}:${c.id}` : c.kind);

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
const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const isDinosaur = (s: Species) => pathIds(s).has('dinosauria') && !pathIds(s).has('aves');
// Mammals and their earlier synapsid relatives (such as Dimetrodon and the cynodonts).
const isSynapsid = (s: Species) => pathIds(s).has('synapsida');
// Synapsids that are clearly not mammals. Cynodonts are left out: some of them (Brasilodon,
// Hadrocodium) are counted as the earliest mammals by some researchers.
const isClearNonMammalSynapsid = (s: Species) => isSynapsid(s) && !pathIds(s).has('mammalia') && !pathIds(s).has('cynodontia');

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
  // What kind of animal is it?
  {
    levels: [1, 2],
    make: (s, c) => {
      const kind = kindOf(s);
      if (!kind) return null;
      // In the mammals quiz the answer would nearly always be "a mammal": ask only about earlier synapsids.
      if (c.category.kind === 'mammals' && pathIds(s).has('mammalia')) return null;
      const excluded = alsoTrue(s);
      const wrong = sample([...new Set(KINDS.map((k) => k.label))].filter((k) => !excluded.has(k)), 3);
      return build(`kind:${s.id}`, `What kind of animal is ${named(s)}?`, kind, wrong, `${label(s)} was ${lower(kind)}.`, { speciesId: s.id });
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
    levels: [2, 3, 4, 5],
    make: (s, c) => {
      const image = c.imageFor(s.id);
      const rel = relativesOf(s);
      if (!image || rel.length < 1) return null;
      const right = c.level >= 4 ? rel[0]! : (pick(rel.slice(0, 3)) ?? rel[0]!);
      const relIds = new Set([s.id, ...rel.map((r) => r.id)]);
      const kind = kindOf(s);
      // Wrong answers: the same kind of animal from other families (or, at easy levels, anything famous).
      const candidates = SPECIES.filter((o) => !relIds.has(o.id) && (c.level >= 3 ? kindOf(o) === kind : FAMOUS.has(o.id)));
      const wrong = sample(candidates, 3).map(label);
      return build(
        `relative:${s.id}`,
        `This is ${named(s)}. Which of these is its closest relative?`,
        label(right),
        wrong,
        `${label(right)} is in the same family as ${label(s)}.`,
        { image, speciesId: s.id },
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
      return build(`notdino:${s.id}`, 'Which of these is not a dinosaur?', label(s), dinos.map(label), `${label(s)} was ${lower(kindOf(s)!)}, not a dinosaur.`, {
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
// Rounds

// The species a category covers.
export function categoryPool(c: Category): Species[] {
  if (c.kind === 'dinosaurs') return SPECIES.filter(isDinosaur);
  if (c.kind === 'mammals') return SPECIES.filter(isSynapsid);
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

// Switcheroo, when the target is already playing the sender's own quiz: one level harder, or at
// the top level, a different topic picked at random.
export function switcherooQuiz(mine: { category: Category; level: Difficulty }, playing: { category: Category; level: Difficulty }): { category: Category; level: Difficulty } {
  const same = categoryKey(mine.category) === categoryKey(playing.category) && mine.level === playing.level;
  if (!same) return mine;
  if (mine.level < 5) return { category: mine.category, level: (mine.level + 1) as Difficulty };
  const basics: Category[] = [{ kind: 'all' }, { kind: 'dinosaurs' }, { kind: 'mammals' }];
  const topics: Category[] = [
    ...basics,
    ...PERIODS.map((p): Category => ({ kind: 'period', id: p.id })),
    ...QUIZ_GROUPS.map((c): Category => ({ kind: 'clade', id: c.id })),
  ].filter((c) => categoryKey(c) !== categoryKey(mine.category) && categoryPool(c).length >= 20);
  return { category: pick(topics) ?? { kind: 'all' }, level: 5 };
}
