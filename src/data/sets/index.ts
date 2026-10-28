import { MODERN } from '@/data/sets/modern';
import { PALEOZOIC } from '@/data/sets/paleozoic';
import type { DataSet } from '@/data/sets/types';

// Content bundles merged into EVENTS, CLADES and SPECIES, oldest first.
export const SETS: DataSet[] = [PALEOZOIC, MODERN];
