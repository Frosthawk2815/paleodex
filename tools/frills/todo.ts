// The owner's drawing to-do list: every frilled or armoured dinosaur in Bone War still drawn by the
// generator, with the ones traced from the owner's drawings struck through.
// Usage (from the project root):
//   npx -y esbuild@0.24.0 tools/frills/todo.ts --bundle --platform=node --alias:@=./src --loader:.png=empty --loader:.jpg=empty --log-level=error | node - <out.md>
import { SPECIES } from '@/data/life';
import { FRILLS, HAND_DRAWN } from '@/lib/bone-war-frills';
import { defenceOf } from '@/lib/bone-war-defences';
import { ANKYS, STEGOS } from '@/lib/bone-war-thyreo';
import { TRACED } from '@/lib/bone-war-traced';
import { cladePath } from '@/lib/life';

// Run under Node (see above); the app's own type setup doesn't include Node's.
declare const require: (m: string) => { writeFileSync(path: string, text: string): void };
declare const process: { argv: string[] };
const { writeFileSync } = require('fs');

const THYREO = ['ankylosauria', 'parankylosauria', 'scelidosauridae', 'stegosauria', 'thyreophora'];
const ORDER = ['Spiky frills', 'Long frills', 'Stegosaurs', 'Ankylosaurs', 'Early armoured dinosaurs'];
const groups = new Map<string, { name: string; done: boolean }[]>(ORDER.map((g) => [g, []]));
for (const s of SPECIES) {
  const d = defenceOf('species:' + s.id);
  if (!d) continue;
  const path = cladePath(s.clade).map((c) => c.id);
  const thyreo = path.some((c) => THYREO.includes(c));
  const frill = d === 'frill' || d === 'solidfrill' || d === 'spikyfrill';
  if (!frill && !(thyreo && (d === 'plates' || d === 'osteoderms'))) continue;
  // The famous ones the owner chose to keep as they are.
  if (FRILLS[s.id] || HAND_DRAWN[s.id] || STEGOS[s.id] || ANKYS[s.id]) continue;
  const group = frill
    ? d === 'spikyfrill' ? 'Spiky frills' : 'Long frills'
    : path.includes('scelidosauridae') ? 'Early armoured dinosaurs' : d === 'plates' ? 'Stegosaurs' : 'Ankylosaurs';
  groups.get(group)!.push({ name: s.name, done: !!TRACED[s.id] });
}
const all = [...groups.values()].flat();
const out = [`# Drawing to-do (${all.filter((x) => x.done).length} of ${all.length} done)`, ''];
for (const [g, xs] of groups) {
  if (!xs.length) continue;
  out.push(`## ${g}`, '', ...xs.sort((a, b) => a.name.localeCompare(b.name)).map((x) => (x.done ? `- ~~${x.name}~~` : `- ${x.name}`)), '');
}
writeFileSync(process.argv[2]!, out.join('\n'));
