import type { HistoryEvent } from '@/data/events';
import type { Clade, Species } from '@/data/life';

// A bundle of content (e.g. one era's formations and the animals found in them), merged into
// EVENTS, CLADES and SPECIES.
export type DataSet = { events?: HistoryEvent[]; clades?: Clade[]; species?: Species[] };
