import { CRETACEOUS } from '@/data/sets/cretaceous';
import { MODERN } from '@/data/sets/modern';
import { PALEOZOIC } from '@/data/sets/paleozoic';
import { TRIASSIC_JURASSIC } from '@/data/sets/triassic-jurassic';
import type { DataSet } from '@/data/sets/types';

// Content bundles merged into EVENTS, CLADES and SPECIES, oldest first.
export const SETS: DataSet[] = [PALEOZOIC, TRIASSIC_JURASSIC, CRETACEOUS, MODERN];
