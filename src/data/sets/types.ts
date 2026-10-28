import type { HistoryEvent } from '@/data/events';
import type { Clade, Species } from '@/data/life';

// A bundle of content (e.g. one era's formations and the animals found in them), merged into
// EVENTS, CLADES and SPECIES. `upgrades` fill out species defined elsewhere (by id), e.g. a
// short entry that now has a formation and a full write-up.
export type DataSet = {
  events?: HistoryEvent[];
  clades?: Clade[];
  species?: Species[];
  upgrades?: Record<string, Partial<Species>>;
};
