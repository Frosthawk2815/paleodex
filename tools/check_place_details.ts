// Checks place-details.ts: every species id exists, and lists places still without details.
// Run: npx -y esbuild@0.24.0 tools/check_place_details.ts --bundle --platform=node --tsconfig=tsconfig.json --outfile=<out>.js && node <out>.js
import { PLACE_DETAILS } from '@/data/place-details';
import { speciesById } from '@/lib/life';
import { MUSEUM_AND_ZOO_LIST } from '@/lib/places';

let bad = 0;
for (const [id, d] of Object.entries(PLACE_DETAILS)) {
  if (!MUSEUM_AND_ZOO_LIST.some((p) => p.id === id)) (bad++, console.log('unknown place', id));
  for (const h of [...(d.exhibits ?? []), ...(d.conservation ?? [])]) for (const s of h.species ?? []) if (!speciesById(s)) (bad++, console.log('missing species', id, s));
}
const missing = MUSEUM_AND_ZOO_LIST.filter((p) => !PLACE_DETAILS[p.id]).map((p) => p.id);
for (const m of missing.filter((x) => x.startsWith("museum"))) console.log("missing", m);
console.log(`${Object.keys(PLACE_DETAILS).length} with details, ${missing.length} without, ${bad} problems`);
