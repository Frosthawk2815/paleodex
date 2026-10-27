import { ERAS, type Era, OLDEST_MA, type Period, PERIODS } from '@/data/periods';
import { type Series, SERIES_BY_PERIOD, type Stage } from '@/data/subdivisions';

export const ERA_SPANS: { name: Era; color: string; startMa: number; endMa: number }[] = ERAS.map((era) => {
  const periods = PERIODS.filter((p) => p.era === era.name);
  return {
    name: era.name,
    color: era.color,
    startMa: Math.max(...periods.map((p) => p.startMa)),
    endMa: Math.min(...periods.map((p) => p.endMa)),
  };
});

function containing<T extends { startMa: number; endMa: number }>(items: T[], t: number): T | undefined {
  return items.find((i) => t <= i.startMa && t > i.endMa) ?? (t <= 0 ? items[items.length - 1] : undefined);
}

export type TimeContext = { period?: Period; series?: Series; stage?: Stage };

// The period, series and stage that a moment in time falls in.
export function contextAt(t: number): TimeContext {
  const time = Math.min(Math.max(t, 0), OLDEST_MA);
  const period = containing(PERIODS, time);
  const series = period ? containing(SERIES_BY_PERIOD[period.id] ?? [], time) : undefined;
  const stage = series ? containing(series.stages, time) : undefined;
  return { period, series, stage };
}

const withCommas = (n: number) => n.toLocaleString('en-US');

export function timeLabel(t: number): string {
  const years = t * 1_000_000;
  if (years < 50) return 'Today';
  if (years < 10_000) return `${withCommas(Math.round(years / 10) * 10)} years ago`;
  if (years < 100_000) return `${withCommas(Math.round(years / 100) * 100)} years ago`;
  if (years < 1_000_000) return `${withCommas(Math.round(years / 1000) * 1000)} years ago`;
  return `${t.toFixed(t < 10 ? 2 : 1)} million years ago`;
}

// The timeline as a tree: all time → eras → periods → series → stages.
export type Level = 'all' | 'era' | 'period' | 'series' | 'stage';
export type Unit = {
  key: string;
  name: string;
  level: Level;
  startMa: number;
  endMa: number;
  color: string;
  parent?: Unit;
  children: Unit[];
};

function unit(name: string, level: Level, startMa: number, endMa: number, color: string, parent?: Unit): Unit {
  const u: Unit = { key: `${level}:${name}:${startMa}`, name, level, startMa, endMa, color, parent, children: [] };
  parent?.children.push(u);
  return u;
}

export const ALL_TIME: Unit = unit('All time', 'all', OLDEST_MA, 0, '#FFFFFF');
for (const era of ERA_SPANS) {
  const e = unit(era.name, 'era', era.startMa, era.endMa, era.color, ALL_TIME);
  for (const p of PERIODS.filter((p) => p.era === era.name)) {
    const pu = unit(p.name, 'period', p.startMa, p.endMa, p.color, e);
    for (const s of SERIES_BY_PERIOD[p.id] ?? []) {
      const su = unit(s.name, 'series', s.startMa, s.endMa, s.color, pu);
      for (const st of s.stages) unit(st.name, 'stage', st.startMa, st.endMa, st.color, su);
    }
  }
}

const LEVELS: Level[] = ['all', 'era', 'period', 'series', 'stage'];

// Every unit at a level, oldest first.
export const UNITS_BY_LEVEL: Record<Level, Unit[]> = { all: [ALL_TIME], era: [], period: [], series: [], stage: [] };
(function collect(u: Unit) {
  if (u.level !== 'all') UNITS_BY_LEVEL[u.level].push(u);
  u.children.forEach(collect);
})(ALL_TIME);

// A series with no stages (the Pridoli) stands in for its own stage, so stepping never skips it.
export function stepUnits(level: Level): Unit[] {
  if (level !== 'stage') return UNITS_BY_LEVEL[level];
  return UNITS_BY_LEVEL.series.flatMap((s) => (s.children.length ? s.children : [s]));
}

// The level the arrows step through when zoomed into `focus`: one level down, or the same for stages.
export function stepLevel(focus: Unit): Level {
  if (focus.level === 'stage' || (focus.level === 'series' && focus.children.length === 0)) return 'stage';
  return LEVELS[LEVELS.indexOf(focus.level) + 1];
}

export function unitAt(level: Level, t: number): Unit | undefined {
  return containing(stepUnits(level), t);
}

export function ancestors(u: Unit): Unit[] {
  const out: Unit[] = [];
  for (let p: Unit | undefined = u; p; p = p.parent) out.unshift(p);
  return out;
}
