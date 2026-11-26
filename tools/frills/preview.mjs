// Render traced skulls from src/lib/bone-war-traced.ts in the game's colours, for checking.
// Usage (from the project root): node tools/frills/preview.mjs <out-dir> <species-id> [...]
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const FILL = { bone: '#9A7650', ridge: '#7A5C3C', hole: '#5E4630', horn: '#D2BC92', line: '#2E2418' };
const text = readFileSync('src/lib/bone-war-traced.ts', 'utf8');
const [dir, ...ids] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 560 }, deviceScaleFactor: 2 });
for (const id of ids) {
  const block = text.match(new RegExp(`  '${id}': \\[\\n((?:    .*\\n)*?)  \\],`));
  if (!block) throw new Error(`no traced skull for ${id}`);
  const paths = [...block[1].matchAll(/fill: '(\w+)', d: '([^']*)'/g)].map(([, f, d]) => `<path d="${d}" fill="${FILL[f]}"/>`).join('');
  writeFileSync(`${dir}/${id}.html`, `<!doctype html><body style="margin:0;background:#556"><svg width="400" height="560" viewBox="0 0 100 140">${paths}</svg>`);
  await page.goto(`file://${dir}/${id}.html`);
  await page.screenshot({ path: `${dir}/${id}.png` });
  console.log(`${dir}/${id}.png`);
}
await browser.close();
