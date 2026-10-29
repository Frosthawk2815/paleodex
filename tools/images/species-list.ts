// Prints every species (id, binomial, common name) as JSON, for fetch_images.py.
// Build and run:
//   npx -y esbuild@0.24.0 tools/images/species-list.ts --bundle --platform=node --tsconfig=tsconfig.json \
//     --outfile=tools/images/species-list.js --log-level=error && node tools/images/species-list.js > tools/images/species.json
import { SPECIES } from '@/data/life';
import { cladePath } from '@/lib/life';

console.log(
  JSON.stringify(
    SPECIES.map((s) => ({ id: s.id, name: s.name, common: s.common ?? null, path: cladePath(s.clade).map((c) => c.id) })),
    null,
    1,
  ),
);
