// Titles: achievements earned by exploring, which the user can show under their name. Each is
// checked against the pages they have ever opened, their favourites and their own photos.

import { EVENTS } from '@/data/events';
import { PERIODS } from '@/data/periods';
import { isModernSpecies } from '@/lib/era';
import { pastPointIndex, speciesById, speciesInClade, speciesInFormation } from '@/lib/life';
import { LEVELS, levelOf } from '@/lib/points';

export type TitleContext = {
  visited: Set<string>;
  favourites: number;
  // How many different species the user has added their own photos of.
  photoSpecies: number;
  points: number;
};

export type Title = {
  id: string;
  name: string;
  // How to earn it, shown while it is locked. Secret titles get a riddle instead.
  hint: string;
  earned: (c: TitleContext) => boolean;
  // Set for the titles that come with reaching a level.
  level?: number;
};

const count = (c: TitleContext, kind: string) => [...c.visited].filter((k) => k.startsWith(`${kind}:`)).length;
const seen = (c: TitleContext, kind: string, id: string) => c.visited.has(`${kind}:${id}`);

// Worked out once, on first use.
let cache: {
  formations: typeof EVENTS;
  formationSpecies: Map<string, string[]>;
  dinosaurs: Set<string>;
  oldest: { formations: string[]; species: string[] };
  formationPeriod: Map<string, string>;
  periodsWithFormations: string[];
} | null = null;

function data() {
  if (cache) return cache;
  const formations = EVENTS.filter((e) => e.kind === 'Rock formation');
  const formationSpecies = new Map(formations.map((f) => [f.id, speciesInFormation(f.id).map((s) => s.id)]));
  // Prehistoric dinosaurs, not living birds.
  const dinosaurs = new Set(
    speciesInClade('dinosauria')
      .filter((s) => !isModernSpecies(s))
      .map((s) => s.id),
  );
  const age = (f: (typeof formations)[0]) => Math.max(...f.points.map((p) => p.fromMa));
  const maxAge = Math.max(...formations.map(age));
  const oldestFormations = formations.filter((f) => age(f) === maxAge).map((f) => f.id);
  const formationPeriod = new Map<string, string>();
  for (const f of formations) {
    const ma = f.points[pastPointIndex(f)]?.jumpMa ?? 0;
    const period = PERIODS.find((p) => ma <= p.startMa && ma > p.endMa);
    if (period) formationPeriod.set(f.id, period.id);
  }
  cache = {
    formations,
    formationSpecies,
    dinosaurs,
    oldest: { formations: oldestFormations, species: oldestFormations.flatMap((id) => formationSpecies.get(id) ?? []) },
    formationPeriod,
    periodsWithFormations: PERIODS.filter((p) => [...formationPeriod.values()].includes(p.id)).map((p) => p.id),
  };
  return cache;
}

const SPINOSAURS = ['spinosaurus-aegyptiacus', 'spinosaurus-mirabilis'];
// The dinosaurs seen on screen in Jurassic Park (1993). Either Triceratops species counts.
const JURASSIC_PARK = [
  ['tyrannosaurus-rex'],
  ['velociraptor-mongoliensis'],
  ['brachiosaurus-altithorax'],
  ['triceratops-horridus', 'triceratops-prorsus'],
  ['dilophosaurus-wetherilli'],
  ['gallimimus-bullatus'],
  ['parasaurolophus-walkeri'],
];

// Each level's name is also a title, unlocked by reaching that level.
const LEVEL_TITLES: Title[] = LEVELS.map((l, level) => ({
  id: `level-${level}`,
  name: l.title,
  hint: level === 0 ? 'Everyone starts here.' : `Reach level ${level} (${l.at.toLocaleString()} points).`,
  earned: (c: TitleContext) => levelOf(c.points).level >= level,
  level,
}));

export const TITLES: Title[] = [
  ...LEVEL_TITLES,
  { id: 'fossil-finder', name: 'Fossil Finder', hint: 'Open your first page.', earned: (c) => c.visited.size >= 1 },
  { id: 'rock-hound', name: 'Rock Hound', hint: 'Visit 10 rock formations.', earned: (c) => [...c.visited].filter((k) => k.startsWith('event:') && data().formationSpecies.has(k.slice(6))).length >= 10 },
  { id: 'field-assistant', name: 'Field Assistant', hint: 'Open 25 species.', earned: (c) => count(c, 'species') >= 25 },
  {
    id: 'bone-digger',
    name: 'Bone Digger',
    hint: 'Open 50 prehistoric dinosaurs.',
    earned: (c) => [...data().dinosaurs].filter((id) => seen(c, 'species', id)).length >= 50,
  },
  { id: 'excavator', name: 'Excavator', hint: 'Open 100 species.', earned: (c) => count(c, 'species') >= 100 },
  {
    id: 'fossil-preparator',
    name: 'Fossil Preparator',
    hint: 'Open every species from one rock formation (one with at least three).',
    earned: (c) => [...data().formationSpecies.values()].some((ids) => ids.length >= 3 && ids.every((id) => seen(c, 'species', id))),
  },
  {
    id: 'field-leader',
    name: 'Field Leader',
    hint: 'Visit a rock formation from every geological period, Cambrian to the present.',
    earned: (c) => {
      const d = data();
      const visitedPeriods = new Set([...d.formationPeriod].filter(([id]) => seen(c, 'event', id)).map(([, p]) => p));
      return d.periodsWithFormations.every((p) => visitedPeriods.has(p));
    },
  },
  { id: 'curator', name: 'Curator', hint: 'Save 25 favourites.', earned: (c) => c.favourites >= 25 },
  { id: 'palaeontologist', name: 'Palaeontologist', hint: 'Open 250 species.', earned: (c) => count(c, 'species') >= 250 },
  { id: 'senior-palaeontologist', name: 'Senior Palaeontologist', hint: 'Open 1,000 species.', earned: (c) => count(c, 'species') >= 1000 },
  { id: 'professor', name: 'Professor', hint: 'Open 100 groups.', earned: (c) => count(c, 'clade') >= 100 },
  { id: 'museum-director', name: 'Museum Director', hint: 'Add your own photos of 10 different species.', earned: (c) => c.photoSpecies >= 10 },
  {
    id: 'deep-time-explorer',
    name: 'Deep Time Explorer',
    hint: 'Visit the oldest rock formation in PaleoDex, or one of the animals found there.',
    earned: (c) => {
      const { formations, species } = data().oldest;
      return formations.some((id) => seen(c, 'event', id)) || species.some((id) => seen(c, 'species', id));
    },
  },
  {
    id: 'living-legend',
    name: 'Living Legend',
    hint: 'Earn every other title.',
    earned: (c) => TITLES.every((t) => t.id === 'living-legend' || t.earned(c)),
  },
  {
    id: 'animal-i-have-become',
    name: 'The Animal I Have Become',
    hint: 'A secret. Meet every species of a famous sail-backed river giant.',
    earned: (c) => SPINOSAURS.every((id) => seen(c, 'species', id)),
  },
  {
    id: 'dr-grants-student',
    name: 'Dr. Grant’s Favourite Student',
    hint: 'A secret. Find every dinosaur that starred in a certain 1993 film about a theme park.',
    earned: (c) => JURASSIC_PARK.every((ids) => ids.some((id) => seen(c, 'species', id))),
  },
];

export const titleById = (id: string | null | undefined) => TITLES.find((t) => t.id === id);

// Every title the context has earned.
export const earnedTitles = (c: TitleContext) => TITLES.filter((t) => t.earned(c));

// Sanity check used in development: every species a title asks for exists.
export const missingTitleSpecies = () => [...SPINOSAURS, ...JURASSIC_PARK.flat()].filter((id) => !speciesById(id));
