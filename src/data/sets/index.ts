import { CENOZOIC } from '@/data/sets/cenozoic';
import { CRETACEOUS } from '@/data/sets/cretaceous';
import { MEDIA_EARLY } from '@/data/sets/media-early';
import { MEDIA_EARLY_CRETACEOUS } from '@/data/sets/media-early-cretaceous';
import { MEDIA_LATE_CRETACEOUS } from '@/data/sets/media-late-cretaceous';
import { MODERN } from '@/data/sets/modern';
import { PALEOZOIC } from '@/data/sets/paleozoic';
import { TRIASSIC_JURASSIC } from '@/data/sets/triassic-jurassic';
import type { DataSet } from '@/data/sets/types';

// Content bundles merged into EVENTS, CLADES and SPECIES, oldest first.
export const SETS: DataSet[] = [PALEOZOIC, TRIASSIC_JURASSIC, MEDIA_EARLY, CRETACEOUS, MEDIA_EARLY_CRETACEOUS, MEDIA_LATE_CRETACEOUS, CENOZOIC, MODERN];
