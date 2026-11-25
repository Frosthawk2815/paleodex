// Bone War: the frill of each horned dinosaur, seen from the front, for when an attack bounces off
// it. Each is drawn to its own proportions (how long and wide), outline, openings (fenestrae) and
// the ornaments round its edge, from the fossils. Frills known only from fragments follow the
// best-known reconstruction of their nearest relatives (marked below).
//
// Drawn in a 100 × 140 box: the frill rises from the bottom of the card (its base, at the skull)
// towards the top (its back edge).

export type Edge =
  // Small bony points (epoccipitals), evenly round the edge.
  | { kind: 'points'; n: number; len: number }
  // Small rounded bumps giving a scalloped edge.
  | { kind: 'bumps'; n: number; size: number }
  // Long spikes at given places along the back edge (t from 0, the left end, to 1, the right),
  // bent outward (bend > 0) or towards the middle (bend < 0), in degrees.
  // curved: the spike sweeps round in a curve as it goes out (bending the given way) rather than
  // standing straight.
  // bend may be one value for all, or one per spike (for frills whose two sides don't match).
  // dir: instead of following the edge, point this many degrees out from straight up.
  | { kind: 'spikes'; at: number[]; len: number[]; bend?: number | number[]; width?: number; curved?: boolean; dir?: number }
  // Hooks that curl forward over the frill, towards its middle.
  | { kind: 'hooks'; at: number[]; len: number };

export type FrillSpec = {
  // How far up the card the frill reaches (0 to 1) and how wide it is (0 to 1 of the card).
  len: number;
  width: number;
  // round: a rounded back edge; heart: rounded with a notch in the middle of the back edge;
  // square: squared-off corners and a flat back edge; flared: narrow at the base, flaring wide
  // at the back (protoceratopsids).
  // fan: the 'triangular' frill of the papers: narrow where it meets the skull, widening in straight
  // lines to a broad back edge (Chasmosaurus, Diabloceratops, Machairoceratops). notch: a dip in
  // the middle of the back edge.
  // taper: widest at the skull, narrowing towards the back to the base of a pair of horns
  // (Diabloceratops).
  shape: 'round' | 'heart' | 'square' | 'flared' | 'fan' | 'taper';
  notch?: boolean;
  // A dip in the middle of the back edge, between two high points (where the main spikes rise):
  // how far each high point is from the middle (in t), how deep the dip is and how high the points
  // rise (both as a share of the frill's length).
  dip?: { half: number; depth: number; peak: number };
  // Size of the two openings (0 for a solid frill).
  holes: number;
  edge: Edge[];
  // Grooves left by blood vessels (solid frills).
  grooves?: boolean;
};

const CHASMO: FrillSpec = { len: 0.74, width: 0.84, shape: 'round', holes: 0.8, edge: [{ kind: 'points', n: 12, len: 6 }] };
const CENTRO: FrillSpec = { len: 0.52, width: 0.8, shape: 'round', holes: 0.55, edge: [{ kind: 'points', n: 10, len: 6 }] };

export const FRILLS: Record<string, FrillSpec> = {
  // ---- Chasmosaurines: long frills ----
  // The longest frill of all: a huge, rounded sheet of bone with two big openings and small
  // triangular points round its edge.
  'torosaurus-latus': { len: 0.9, width: 0.84, shape: 'round', holes: 1, edge: [{ kind: 'points', n: 16, len: 5 }] },
  // Very long, widening to the back into a triangular shield, with a V-notch in the back edge and
  // enormous openings.
  'chasmosaurus-belli': { len: 0.86, width: 0.95, shape: 'fan', notch: true, holes: 1.15, edge: [{ kind: 'points', n: 12, len: 4 }] },
  // Long and slightly narrower, notched at the back, with larger points.
  'pentaceratops-sternbergii': { len: 0.9, width: 0.8, shape: 'heart', holes: 0.9, edge: [{ kind: 'points', n: 12, len: 8 }] },
  // Broad, squarish and shorter.
  'utahceratops-gettyi': { len: 0.68, width: 0.88, shape: 'square', holes: 0.8, edge: [{ kind: 'points', n: 12, len: 6 }] },
  // A short frill with small openings and ten hooks along the back, most curling forward.
  'kosmoceratops-richardsoni': {
    len: 0.58,
    width: 0.8,
    shape: 'square',
    holes: 0.45,
    edge: [{ kind: 'hooks', at: [0.14, 0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 0.78, 0.86], len: 17 }],
  },
  // Short and broad, with very small openings and a row of flattened points curled forward.
  'vagaceratops-irvinensis': {
    len: 0.6,
    width: 0.92,
    shape: 'square',
    holes: 0.35,
    edge: [{ kind: 'hooks', at: [0.18, 0.27, 0.36, 0.45, 0.55, 0.64, 0.73, 0.82], len: 12 }],
  },
  // A long, narrow, rectangular frill with big points along the back edge.
  'anchiceratops-ornatus': {
    len: 0.78,
    width: 0.68,
    shape: 'square',
    holes: 0.65,
    edge: [
      { kind: 'points', n: 8, len: 5 },
      { kind: 'spikes', at: [0.32, 0.41, 0.5, 0.59, 0.68], len: [11, 12, 12, 12, 11], width: 3 },
    ],
  },
  // Broad and rounded.
  'arrhinoceratops-brachyops': { len: 0.74, width: 0.88, shape: 'round', holes: 0.7, edge: [{ kind: 'points', n: 12, len: 6 }] },
  // Large triangular points at the back of the frill.
  'judiceratops-tyrannus': { len: 0.72, width: 0.84, shape: 'round', holes: 0.8, edge: [{ kind: 'points', n: 10, len: 9 }] },
  // Some points along the back curl forward, others jut out to the sides.
  'spiclypeus-shipporum': {
    len: 0.72,
    width: 0.86,
    shape: 'square',
    holes: 0.7,
    edge: [
      { kind: 'hooks', at: [0.38, 0.46, 0.54, 0.62], len: 14 },
      { kind: 'spikes', at: [0.2, 0.8], len: [12, 12], bend: 30, width: 3 },
    ],
  },
  // A solid frill with two small, uneven holes (a single, much-debated skull).
  'nedoceratops-hatcheri': { len: 0.68, width: 0.86, shape: 'round', holes: 0.25, edge: [{ kind: 'points', n: 14, len: 5 }], grooves: true },
  // Known from parts of the frill or skull only: drawn like their closest relatives.
  'agujaceratops-mariscalensis': CHASMO,
  'sierraceratops-turneri': CHASMO,
  'bisticeratops-froeseorum': CHASMO,
  'agathaumas-sylvestris': CHASMO,
  'ceratops-montanus': CHASMO,
  // Triceratops and its closest relatives: a shorter, solid frill, grooved by blood vessels, with
  // triangular points round its edge.
  'triceratops-horridus': { len: 0.66, width: 0.88, shape: 'round', holes: 0, edge: [{ kind: 'points', n: 16, len: 6 }], grooves: true },
  'triceratops-prorsus': { len: 0.64, width: 0.86, shape: 'round', holes: 0, edge: [{ kind: 'points', n: 16, len: 6 }], grooves: true },
  'eotriceratops-xerinsularis': { len: 0.7, width: 0.88, shape: 'round', holes: 0, edge: [{ kind: 'points', n: 16, len: 6 }], grooves: true },
  'ojoceratops-fowleri': { len: 0.66, width: 0.86, shape: 'round', holes: 0, edge: [{ kind: 'points', n: 14, len: 6 }], grooves: true },
  // A horned dinosaur from before the ceratopsids, with a smaller, simpler frill.
  'turanoceratops-tardabilis': { len: 0.44, width: 0.72, shape: 'round', holes: 0.4, edge: [] },

  // ---- Centrosaurines: shorter frills, with spikes and hooks ----
  // Four to six long, straight spikes at the back of the frill.
  'styracosaurus-albertensis': {
    len: 0.5,
    width: 0.78,
    shape: 'round',
    holes: 0.55,
    edge: [
      { kind: 'spikes', at: [0.26, 0.36, 0.45, 0.55, 0.64, 0.74], len: [32, 40, 36, 36, 40, 32], bend: 8, width: 4 },
      { kind: 'points', n: 6, len: 4 },
    ],
  },
  // Two hooks at the back of the frill curving forward over it.
  'centrosaurus-apertus': { len: 0.5, width: 0.78, shape: 'round', holes: 0.55, edge: [{ kind: 'points', n: 10, len: 5 }, { kind: 'hooks', at: [0.42, 0.58], len: 22 }] },
  // A pair of spikes curving up and out from the top of the frill.
  'pachyrhinosaurus-canadensis': { len: 0.52, width: 0.8, shape: 'round', holes: 0.5, edge: [{ kind: 'points', n: 10, len: 5 }, { kind: 'spikes', at: [0.38, 0.62], len: [26, 26], bend: 42, width: 4, curved: true }] },
  'pachyrhinosaurus-perotorum': { len: 0.52, width: 0.8, shape: 'round', holes: 0.5, edge: [{ kind: 'points', n: 10, len: 5 }, { kind: 'spikes', at: [0.38, 0.62], len: [24, 24], bend: 44, width: 4, curved: true }] },
  // Two long, straight spikes sticking up from the back of the frill.
  'einiosaurus-procurvicornis': { len: 0.5, width: 0.76, shape: 'round', holes: 0.5, edge: [{ kind: 'points', n: 8, len: 4 }, { kind: 'spikes', at: [0.44, 0.56], len: [38, 38], bend: 4, width: 4 }] },
  'achelousaurus-horneri': { len: 0.52, width: 0.78, shape: 'round', holes: 0.5, edge: [{ kind: 'points', n: 8, len: 4 }, { kind: 'spikes', at: [0.43, 0.57], len: [32, 32], bend: 6, width: 4 }] },



  // A big pair of hooks curving out to the sides.
  'albertaceratops-nesmoi': { len: 0.52, width: 0.8, shape: 'round', holes: 0.55, edge: [{ kind: 'points', n: 8, len: 4 }, { kind: 'spikes', at: [0.4, 0.6], len: [30, 30], bend: 70, width: 4, curved: true }] },
  // The biggest frill ornaments of any centrosaurine: the second pair of points from the middle
  // grew into huge blades that curve out sideways in the plane of the frill, and the two sides
  // don't match (hence "rangiformis", like a reindeer's uneven antlers). They rise from the high
  // points either side of a dip in the frill's back edge, which holds small, uneven spikes. No nose
  // horn. (Some researchers think it may be a mature Medusaceratops.)
  'lokiceratops-rangiformis': {
    len: 0.54,
    width: 0.8,
    shape: 'round',
    holes: 0.55,
    dip: { half: 0.07, depth: 0.12, peak: 0.05 },
    edge: [
      { kind: 'points', n: 8, len: 4 },
      // At the high points either side: the huge curved blades, unequal.
      { kind: 'spikes', at: [0.425, 0.575], len: [50, 42], bend: [32, 20], width: 5, curved: true, dir: 50 },
      // In the dip: small, uneven spikes.
      { kind: 'spikes', at: [0.475, 0.52], len: [20, 13], bend: [-10, 18], width: 2.6, dir: 0 },
    ],
  },

  // A crown of short spikes clustered at the top of the frill.
  'coronosaurus-brinkmani': {
    len: 0.5,
    width: 0.76,
    shape: 'round',
    holes: 0.5,
    edge: [{ kind: 'spikes', at: [0.34, 0.39, 0.44, 0.48, 0.52, 0.56, 0.61, 0.66], len: [12, 14, 16, 14, 14, 16, 14, 12], bend: 6, width: 2.5 }],
  },
  // Hooks curling forward all along the back edge.
  'wendiceratops-pinhornensis': { len: 0.52, width: 0.8, shape: 'round', holes: 0.55, edge: [{ kind: 'hooks', at: [0.24, 0.34, 0.44, 0.56, 0.66, 0.76], len: 18 }] },
  'sinoceratops-zhuchengensis': { len: 0.5, width: 0.8, shape: 'round', holes: 0.5, edge: [{ kind: 'hooks', at: [0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88], len: 14 }] },
  // A triangular frill with a dip in the back edge, and either side of it a long spike curving
  // forward and up like a sabre; no other points round its edge.
  'machairoceratops-cronusi': { len: 0.54, width: 0.8, shape: 'fan', notch: true, holes: 0.45, edge: [{ kind: 'spikes', at: [0.42, 0.58], len: [32, 32], bend: 6, width: 4.5, curved: true }] },
  // A broad frill with a plain, scalloped edge: no big spikes.
  'nasutoceratops-titusi': { len: 0.54, width: 0.82, shape: 'round', holes: 0.55, edge: [{ kind: 'points', n: 9, len: 7 }] },
  // A young animal (Avaceratops), and a dubious name (Monoclonius): simple edges.
  'avaceratops-lammersi': { ...CENTRO, len: 0.44 },
  'monoclonius-crassus': CENTRO,

  // ---- Earlier horned dinosaurs ----
  // Protoceratops and kin: narrow at the base, flaring wide at the back, with a smooth edge.
  'protoceratops-andrewsi': { len: 0.6, width: 0.8, shape: 'flared', holes: 0.5, edge: [] },
  'bagaceratops-rozhdestvenskyi': { len: 0.38, width: 0.66, shape: 'flared', holes: 0.3, edge: [] },
  'breviceratops-kozlowskii': { len: 0.4, width: 0.66, shape: 'flared', holes: 0.3, edge: [] },
};

// Leptoceratops and kin: short frills without openings.
const LEPTO: FrillSpec = { len: 0.36, width: 0.7, shape: 'round', holes: 0, edge: [] };
for (const id of ['leptoceratops-gracilis', 'prenoceratops-pieganensis', 'udanoceratops-tschizhovi', 'cerasinops-hodgskissi']) FRILLS[id] = LEPTO;

// The frill for a species, or the usual one for its kind of frill.
export const frillSpec = (id: string | undefined, kind: 'frill' | 'solidfrill' | 'spikyfrill'): FrillSpec =>
  (id && FRILLS[id]) || (kind === 'solidfrill' ? FRILLS['triceratops-horridus']! : kind === 'spikyfrill' ? FRILLS['centrosaurus-apertus']! : CHASMO);

// ---- Geometry ----

const BASE = 132;

// A point on the frill's edge at t (0 = left end at the base, 1 = right end), with the outward
// direction there.
function edgeAt(f: FrillSpec, t: number): { x: number; y: number; nx: number; ny: number } {
  const W = 46 * f.width;
  const L = 124 * f.len;
  // The dip and its two high points, if the frill has them.
  const dipAt = (u: number) => {
    if (!f.dip) return 0;
    const { half, depth, peak } = f.dip;
    const d = Math.abs(u - 0.5);
    const down = d < half ? L * depth * (1 - (d / half) ** 1.6) : 0;
    const up = L * peak * Math.exp(-(((d - half) / (half * 0.7)) ** 2));
    return down - up;
  };
  const at = (u: number) => {
    if (f.shape === 'fan' || f.shape === 'taper') {
      // fan: narrow base, straight sides widening to the back corners, then a straight back edge.
      // taper: wide base, sides narrowing to two back corners close together.
      const pts: [number, number][] =
        f.shape === 'fan'
          ? [
              [50 - W * 0.4, BASE],
              [50 - W, BASE - L * 0.9],
              [50, BASE - L],
              [50 + W, BASE - L * 0.9],
              [50 + W * 0.4, BASE],
            ]
          : [
              [50 - W, BASE],
              [50 - W * 0.9, BASE - L * 0.45],
              [50 - W * 0.3, BASE - L],
              [50, BASE - L],
              [50 + W * 0.3, BASE - L],
              [50 + W * 0.9, BASE - L * 0.45],
              [50 + W, BASE],
            ];
      const seg = f.shape === 'fan' ? [0, 0.3, 0.5, 0.7, 1] : [0, 0.17, 0.4, 0.5, 0.6, 0.83, 1];
      let k = 0;
      while (k < seg.length - 2 && u > seg[k + 1]!) k++;
      const v = (u - seg[k]!) / (seg[k + 1]! - seg[k]!);
      const [ax, ay] = pts[k]!;
      const [bx, by] = pts[k + 1]!;
      let y = ay + (by - ay) * v;
      if (f.notch) y += L * 0.14 * Math.exp(-(((u - 0.5) / 0.06) ** 2));
      return [ax + (bx - ax) * v, y + dipAt(u)] as const;
    }
    const a = Math.PI + u * Math.PI; // 180° (left) over the top to 360° (right)
    let c = Math.cos(a);
    let s = Math.sin(a); // negative: upward
    if (f.shape === 'square') {
      c = Math.sign(c) * Math.abs(c) ** 0.45;
      s = Math.sign(s) * Math.abs(s) ** 0.45;
    }
    let x = 50 + W * c;
    let y = BASE + L * s;
    if (f.shape === 'flared') x = 50 + W * c * (0.45 + 0.55 * Math.abs(s) ** 1.6);
    if (f.shape === 'heart' || f.notch) y += L * (f.notch ? 0.12 : 0.16) * Math.exp(-(((u - 0.5) / (f.shape === 'square' ? 0.03 : 0.06)) ** 2));
    y += dipAt(u);
    return [x, y] as const;
  };
  const [x, y] = at(t);
  const [x0, y0] = at(Math.max(0, t - 0.01));
  const [x1, y1] = at(Math.min(1, t + 0.01));
  const [tx, ty] = [x1 - x0, y1 - y0];
  const m = Math.hypot(tx, ty) || 1;
  // Outward: the tangent turned to the left of the direction of travel (left end to right end over
  // the top), which points away from the frill.
  return { x, y, nx: ty / m, ny: -tx / m };
}

export type FrillShapes = {
  outline: string;
  holes: { cx: number; cy: number; rx: number; ry: number }[];
  ornaments: string[];
  // Hooks curl over the frill, so they're drawn on top of it.
  hooks: string[];
  midline: string;
  grooves: string[];
};

const f1 = (n: number) => n.toFixed(1);

export function frillShapes(f: FrillSpec): FrillShapes {
  const pts = Array.from({ length: 49 }, (_, i) => edgeAt(f, i / 48));
  const outline = `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')} Q50 ${BASE - 16} ${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)} Z`;
  const W = 46 * f.width;
  const L = 124 * f.len;
  const holes = f.holes
    ? [-1, 1].map((sgn) => ({ cx: 50 + sgn * W * 0.42, cy: BASE - L * 0.52, rx: W * 0.24 * f.holes, ry: L * 0.27 * f.holes }))
    : [];
  const ornaments: string[] = [];
  const hooks: string[] = [];
  const tri = (t: number, len: number, wd: number, bend: number) => {
    const e = edgeAt(f, t);
    // Bend the outward direction (positive: further out to the side it's on).
    const side = t < 0.5 ? -1 : 1;
    const r = (bend * side * Math.PI) / 180;
    const dx = e.nx * Math.cos(r) - e.ny * Math.sin(r);
    const dy = e.nx * Math.sin(r) + e.ny * Math.cos(r);
    const [px, py] = [-e.ny, e.nx];
    return `M${(e.x + px * wd).toFixed(1)} ${(e.y + py * wd).toFixed(1)} L${(e.x + dx * len).toFixed(1)} ${(e.y + dy * len).toFixed(1)} L${(e.x - px * wd).toFixed(1)} ${(e.y - py * wd).toFixed(1)} Z`;
  };
  for (const ed of f.edge) {
    if (ed.kind === 'bumps')
      for (let i = 0; i < ed.n; i++) {
        const e = edgeAt(f, 0.06 + (0.88 * i) / Math.max(1, ed.n - 1));
        const [cx, cy, r] = [e.x + e.nx * ed.size * 0.35, e.y + e.ny * ed.size * 0.35, ed.size];
        ornaments.push(`M${f1(cx - r)} ${f1(cy)} A${r} ${r} 0 1 0 ${f1(cx + r)} ${f1(cy)} A${r} ${r} 0 1 0 ${f1(cx - r)} ${f1(cy)} Z`);
      }
    if (ed.kind === 'points') for (let i = 0; i < ed.n; i++) ornaments.push(tri(0.06 + (0.88 * i) / Math.max(1, ed.n - 1), ed.len, 2.4, 0));
    if (ed.kind === 'spikes')
      ed.at.forEach((t, i) => {
        const len = ed.len[i] ?? ed.len[0]!;
        const bend = Array.isArray(ed.bend) ? (ed.bend[i] ?? 0) : (ed.bend ?? 0);
        if (!ed.curved) return ornaments.push(tri(t, len, ed.width ?? 3, bend));
        // A curved blade: starts out straight from the edge, then sweeps round to its bent tip.
        const e = edgeAt(f, t);
        const side = t < 0.5 ? -1 : 1;
        const r = (bend * side * Math.PI) / 180;
        // The direction it leaves the frill: the edge's outward direction, or straight up turned
        // out by dir.
        const [bx, by] = ed.dir !== undefined ? [side * Math.sin((ed.dir * Math.PI) / 180), -Math.cos((ed.dir * Math.PI) / 180)] : [e.nx, e.ny];
        const [dx, dy] = [bx * Math.cos(r) - by * Math.sin(r), bx * Math.sin(r) + by * Math.cos(r)];
        const [px, py] = [-by, bx];
        const wd = ed.width ?? 3;
        // Rooted inside the frill and drawn behind it, so the frill's edge covers the root and the
        // horn rises from it.
        const inset = Math.max(wd * 2, 8);
        const [rx, ry] = [e.x - e.nx * inset, e.y - e.ny * inset];
        const bw = Math.min(wd * 1.5, 7);
        const tip = [e.x + dx * len, e.y + dy * len];
        const c = [e.x + bx * len * 0.6, e.y + by * len * 0.6];
        ornaments.push(
          `M${f1(rx + px * bw)} ${f1(ry + py * bw)} Q${f1(c[0]! + px * wd)} ${f1(c[1]! + py * wd)} ${f1(tip[0]!)} ${f1(tip[1]!)} Q${f1(c[0]! - px * wd)} ${f1(c[1]! - py * wd)} ${f1(rx - px * bw)} ${f1(ry - py * bw)} Z`,
        );
      });
    if (ed.kind === 'hooks')
      for (const t of ed.at) {
        // Out from the edge, then curling back over the frill towards its middle.
        const e = edgeAt(f, t);
        const [mx, my] = [50, BASE - L * 0.5];
        const [ix, iy] = [mx - e.x, my - e.y];
        const im = Math.hypot(ix, iy) || 1;
        const [ux, uy] = [ix / im, iy / im];
        const [px, py] = [-e.ny, e.nx];
        const w = Math.max(3, ed.len * 0.3);
        const c = [e.x + e.nx * ed.len * 1.05, e.y + e.ny * ed.len * 1.05];
        const tip = [e.x + e.nx * ed.len * 0.5 + ux * ed.len * 0.7, e.y + e.ny * ed.len * 0.5 + uy * ed.len * 0.7];
        hooks.push(
          `M${(e.x + px * w).toFixed(1)} ${(e.y + py * w).toFixed(1)} Q${(c[0]! + px * w * 0.6).toFixed(1)} ${(c[1]! + py * w * 0.6).toFixed(1)} ${tip[0]!.toFixed(1)} ${tip[1]!.toFixed(1)} Q${(c[0]! - px * w * 0.3).toFixed(1)} ${(c[1]! - py * w * 0.3).toFixed(1)} ${(e.x - px * w).toFixed(1)} ${(e.y - py * w).toFixed(1)} Z`,
        );
      }
  }
  const top = edgeAt(f, 0.5);
  const midline = `M50 ${BASE - 6} L50 ${(top.y + 4).toFixed(1)}`;
  const grooves = f.grooves
    ? [-0.36, -0.22, -0.1, 0.1, 0.22, 0.36].map((o) => {
        const e = edgeAt(f, 0.5 + o);
        return `M50 ${BASE - 10} Q${(50 + (e.x - 50) * 0.4).toFixed(1)} ${(BASE - L * 0.45).toFixed(1)} ${(50 + (e.x - 50) * 0.82).toFixed(1)} ${(BASE + (e.y - BASE) * 0.84).toFixed(1)}`;
      })
    : [];
  return { outline, holes, ornaments, hooks, midline, grooves };
}

// ---- Drawn by hand ----

// Diabloceratops, drawn from its skull seen from the front: a tall, fairly narrow frill (about as
// wide as the skull) with nearly parallel sides lined with rounded knobs, two large openings
// either side of a central bar, and a shallow U between the bases of its two very long horns, which
// rise from the top corners and curve outward, their tips pointing out to the sides.
const knobs = (side: 1 | -1) =>
  [68, 79, 90, 101, 112, 123].map((y) => {
    const x = 50 + side * (23 + (y - 70) * 0.078 + 1.2);
    const r = 3.6;
    return `M${(x - r).toFixed(1)} ${y} A${r} ${r} 0 1 0 ${(x + r).toFixed(1)} ${y} A${r} ${r} 0 1 0 ${(x - r).toFixed(1)} ${y} Z`;
  });
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${(100 - Number(x)).toFixed(1)} ${y}`);
const DIABLO_HORN = 'M31 64 C25 52 23 40 21 28 C19 18 15 10 8 3 C16 9 22 17 25.5 27 C29 40 35 53 42 61 Z';

export const HAND_DRAWN: Record<string, FrillShapes> = {
  'diabloceratops-eatoni': {
    outline: 'M22 134 C21 110 23 86 27 70 Q29 60 35 57 Q50 71 65 57 Q71 60 73 70 C77 86 79 110 78 134 Q50 118 22 134 Z',
    holes: [
      { cx: 37.5, cy: 92, rx: 8.5, ry: 22 },
      { cx: 62.5, cy: 92, rx: 8.5, ry: 22 },
    ],
    ornaments: [DIABLO_HORN, mirror(DIABLO_HORN), ...knobs(-1), ...knobs(1)],
    hooks: [],
    midline: 'M50 70 L50 126',
    grooves: [],
  },
};
