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

export function timeLabel(t: number): string {
  if (t < 0.01) return 'Today';
  if (t < 1) return `${(Math.round(t * 1000) * 1000).toLocaleString('en-US')} years ago`;
  return `${t.toFixed(1)} million years ago`;
}
