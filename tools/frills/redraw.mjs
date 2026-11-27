// Rebuild a drawing from a skull already traced into the game, for when the original drawing is
// lost: writes <id>-lines.png (its lines, black on white) and <id>-fills.png (its fills, no lines),
// both 1000 x 1400, so tools/frills/trace.py can trace it again with changes.
// Usage (from the project root): node tools/frills/redraw.mjs <out-dir> <species-id>
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const FILL = { bone: '#9A7650', ridge: '#7A5C3C', hole: '#5E4630', horn: '#D2BC92' };
const [dir, id] = process.argv.slice(2);
const text = readFileSync('src/lib/bone-war-traced.ts', 'utf8');
const block = text.match(new RegExp(`  '${id}': \\[\\n((?:    .*\\n)*?)  \\],`));
if (!block) throw new Error(`no traced skull for ${id}`);
const layers = [...block[1].matchAll(/fill: '(\w+)', d: '([^']*)'/g)].map(([, f, d]) => ({ f, d }));
const page = (paths, bg) => `<!doctype html><body style="margin:0;background:${bg}"><svg width="1000" height="1400" viewBox="0 0 100 140">${paths}</svg>`;
writeFileSync(`${dir}/${id}-lines.html`, page(layers.filter((l) => l.f === 'line').map((l) => `<path d="${l.d}" fill="#000"/>`).join(''), '#fff'));
writeFileSync(`${dir}/${id}-fills.html`, page(layers.filter((l) => l.f !== 'line').map((l) => `<path d="${l.d}" fill="${FILL[l.f]}"/>`).join(''), '#fff'));
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
for (const k of ['lines', 'fills']) {
  await p.goto(`file://${dir}/${id}-${k}.html`);
  await p.screenshot({ path: `${dir}/${id}-${k}.png` });
}
await browser.close();
