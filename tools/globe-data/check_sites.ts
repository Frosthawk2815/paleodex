// Lists formations whose marker sits on the wrong surface on the globe: marine settings drawn on
// land, or land settings drawn in the sea. Uses the app's own map code at each site's jump time.
//   npx -y esbuild@0.24.0 tools/globe-data/check_sites.ts --bundle --platform=node --tsconfig=tsconfig.json --outfile=/tmp/check_sites.js && node /tmp/check_sites.js
import { EVENTS } from '@/data/events';
import { geographyAt, type Polygon } from '@/lib/geography';
import { siteAt } from '@/lib/plates';

const MARINE = new Set(['sea', 'reef']);
const LAND = new Set(['river', 'forest', 'dunes', 'lake', 'swamp', 'ash', 'tar']);

function inRing(lon: number, lat: number, ring: [number, number][]): boolean {
  // Longitudes relative to the test point, unwrapped along the ring so it stays continuous
  // (a ring on the far side of the globe then cannot wrap around the point).
  const xs: number[] = [];
  for (const [x] of ring) {
    let rel = ((x - lon + 540) % 360) - 180;
    if (xs.length) rel += Math.round((xs[xs.length - 1] - rel) / 360) * 360;
    xs.push(rel);
  }
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x1, y1] = [xs[i], ring[i][1]];
    const [x2, y2] = [xs[j], ring[j][1]];
    if (y1 > lat !== y2 > lat && 0 < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1) c = !c;
  }
  return c;
}
const inside = (lon: number, lat: number, polys: Polygon[]) =>
  polys.some((p) => inRing(lon, lat, p[0]) && !p.slice(1).some((h) => inRing(lon, lat, h)));

// With --all, lists every site with a land or sea setting (used to protect sites from patches).
const ALL = process.argv.includes('--all');
const rows: string[] = [];
for (const e of EVENTS) {
  for (const p of e.points) {
    if (p.body !== 'earth' || !p.icon || p.jumpMa < 2.6) continue;
    const want = MARINE.has(p.icon) ? 'sea' : LAND.has(p.icon) ? 'land' : null;
    if (!want) continue;
    const geo = geographyAt(p.jumpMa);
    const [lon, lat] = p.plate != null ? siteAt({ lon: p.lon, lat: p.lat, plate: p.plate }, p.jumpMa) : [p.lon, p.lat];
    const onLand = inside(lon, lat, geo.land);
    if (ALL || (want === 'sea') === onLand) {
      rows.push(JSON.stringify({ id: e.id, title: e.title, icon: p.icon, want, ma: p.jumpMa, map: geo.mapAge, lon: p.lon, lat: p.lat, plate: p.plate, from: p.fromMa, to: p.toMa }));
    }
  }
}
console.log(`[${rows.join(',\n')}]`);
