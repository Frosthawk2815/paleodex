import { CENOZOIC } from '@/data/sets/cenozoic';
import { CRETACEOUS } from '@/data/sets/cretaceous';
import { ICE_AGE } from '@/data/sets/ice-age';
import { MEDIA_CENOZOIC } from '@/data/sets/media-cenozoic';
import { MEDIA_EARLY } from '@/data/sets/media-early';
import { MEDIA_EARLY_CRETACEOUS } from '@/data/sets/media-early-cretaceous';
import { MEDIA_LATE_CRETACEOUS } from '@/data/sets/media-late-cretaceous';
import { MODERN } from '@/data/sets/modern';
import { PALEOZOIC } from '@/data/sets/paleozoic';
import { TRIASSIC_JURASSIC } from '@/data/sets/triassic-jurassic';
import { TREE_1 } from '@/data/sets/tree-1';
import { TREE_2 } from '@/data/sets/tree-2';
import { TREE_3 } from '@/data/sets/tree-3';
import { PICKS_1 } from '@/data/sets/picks-1';
import { PICKS_2 } from '@/data/sets/picks-2';
import { PICKS_3 } from '@/data/sets/picks-3';
import { ECOLOGY_1 } from '@/data/sets/ecology-1';
import { FAMILIES_1 } from '@/data/sets/families-1';
import { FAMILIES_2 } from '@/data/sets/families-2';
import type { DataSet } from '@/data/sets/types';

// Content bundles merged into EVENTS, CLADES and SPECIES, oldest first.
export const SETS: DataSet[] = [PALEOZOIC, TRIASSIC_JURASSIC, MEDIA_EARLY, CRETACEOUS, MEDIA_EARLY_CRETACEOUS, MEDIA_LATE_CRETACEOUS, CENOZOIC, MEDIA_CENOZOIC, MODERN, ICE_AGE, TREE_1, TREE_2, TREE_3, PICKS_1, PICKS_2, PICKS_3, ECOLOGY_1, FAMILIES_1, FAMILIES_2];
