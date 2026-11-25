// Bone War: the armour of each thyreophoran (stegosaurs, ankylosaurs and their early relatives),
// seen from above with the head at the top of the card, for when an attack bounces off it. Each is
// drawn from its fossils: how its plates or spikes are arranged (in pairs or alternating), their
// shapes, shoulder spines, the half-rings of armour over an ankylosaur's neck, the keels on its
// osteoderms, its side spikes, shields over the hips and the end of its tail. Genera known only
// from fragments follow the best-known reconstruction of their closest relatives (marked).
//
// Drawn in a 100 × 140 box.

export type Shape = { d: string; fill: string; line?: number };

const SKIN = '#6E5D45';
const BONE = '#9C8664';
const SPIKE = '#CDB98E';
const PLATE = '#A07A52';

const ell = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
const f = (n: number) => n.toFixed(1);

// ---- Stegosaurs ----

type Plate = { y: number; len: number; wd: number; kind: 'plate' | 'tall' | 'spike' };
export type StegoSpec = {
  // Plates in two staggered rows (Stegosaurus) or in matching pairs (most others).
  arrangement: 'alternate' | 'paired';
  plates: Plate[];
  // Long spines from the shoulders, or broad wing-like shoulder plates (Yingshanosaurus).
  shoulder?: { len: number; kind: 'spine' | 'wing' };
  // Pairs of tail spikes, and how long.
  tailPairs: number;
  tailLen: number;
};

// A row of plates down the back, from neck (y≈22) to tail (y≈110).
const row = (ys: number[], lens: number[], kind: Plate['kind'], wd = 9): Plate[] => ys.map((y, i) => ({ y, len: lens[i] ?? lens[lens.length - 1]!, wd, kind }));

export const STEGOS: Record<string, StegoSpec> = {
  // Two staggered rows of huge, broad plates, biggest over the hips; two pairs of tail spikes.
  'stegosaurus-stenops': { arrangement: 'alternate', plates: row([20, 30, 41, 52, 63, 74, 85, 96], [8, 12, 17, 22, 26, 24, 18, 12], 'plate', 14), tailPairs: 2, tailLen: 26 },
  // Small plates over the neck and front of the back, then pairs of long spikes over the hips and
  // tail, and a long spike from each shoulder.
  kentrosaurus: { arrangement: 'paired', plates: [...row([22, 32, 42], [8, 10, 11], 'tall', 8), ...row([56, 68, 80, 92], [18, 20, 20, 18], 'spike', 5)], shoulder: { len: 26, kind: 'spine' }, tailPairs: 3, tailLen: 22 },
};
// Only well-known animals whose armour is certain are drawn individually; the rest use the plain
// armour typical of their group until they're drawn from references.
STEGOS['kentrosaurus-aethiopicus'] = STEGOS.kentrosaurus!;
delete STEGOS.kentrosaurus;

export function stegoShapes(s: StegoSpec): Shape[] {
  const out: Shape[] = [];
  // Body from above: neck, body, tail.
  out.push({ d: 'M44 4 Q50 0 56 4 L58 30 Q78 40 80 70 Q78 96 60 106 L53 140 L47 140 L40 106 Q22 96 20 70 Q22 40 42 30 Z', fill: SKIN });
  out.push({ d: 'M50 6 L50 136', fill: 'none', line: 2 });
  if (s.shoulder) {
    for (const side of [-1, 1]) {
      const x = 50 + side * 22;
      out.push(
        s.shoulder.kind === 'spine'
          ? { d: `M${x} 40 L${x + side * s.shoulder.len} ${40 - s.shoulder.len * 0.55} L${x} 47 Z`, fill: SPIKE }
          : { d: `M${x} 36 Q${x + side * s.shoulder.len} ${30} ${x + side * s.shoulder.len * 0.9} ${48} Q${x + side * 8} 52 ${x} 50 Z`, fill: PLATE },
      );
    }
  }
  s.plates.forEach((p, i) => {
    const sides = s.arrangement === 'paired' ? [-1, 1] : [i % 2 ? 1 : -1];
    for (const side of sides) {
      const x = 50 + side * (s.arrangement === 'paired' ? 3 : 1);
      // Drawn half as large again as the numbers above, to fill the card.
      const tip = x + side * p.len * 1.5;
      const h = (p.wd * 1.25) / 2;
      const y = p.y + (s.arrangement === 'alternate' && side > 0 ? 4 : 0);
      const d =
        p.kind === 'plate'
          ? `M${f(x)} ${f(y - h)} Q${f(tip)} ${f(y - h * 0.9)} ${f(tip)} ${f(y)} Q${f(tip)} ${f(y + h * 0.9)} ${f(x)} ${f(y + h)} Z`
          : p.kind === 'tall'
            ? `M${f(x)} ${f(y - h)} L${f(tip)} ${f(y - h * 0.2)} L${f(x)} ${f(y + h)} Z`
            : `M${f(x)} ${f(y - h)} L${f(tip)} ${f(y + h * 0.4)} L${f(x)} ${f(y + h)} Z`;
      out.push({ d, fill: p.kind === 'spike' ? SPIKE : PLATE });
    }
  });
  // Tail spikes near the tip, splaying out (the last pair of four points back).
  for (let i = 0; i < s.tailPairs; i++) {
    const y = 132 - i * 9;
    for (const side of [-1, 1]) {
      const back = s.tailPairs === 4 && i === 0;
      const x = 50 + side * 2;
      out.push({ d: back ? `M${x} ${y - 3} L${x + side * 5} ${y + 14} L${x} ${y + 3} Z` : `M${x} ${y - 3} L${x + side * s.tailLen} ${y + s.tailLen * 0.45} L${x} ${y + 3} Z`, fill: SPIKE });
    }
  }
  return out;
}

// ---- Ankylosaurs and their early relatives ----

export type AnkySpec = {
  // Broad, low body (ankylosaurids, most nodosaurids) or narrower (early forms).
  body: 'wide' | 'narrow';
  // Bands of fused armour over the neck (half-rings), and how many plates on each.
  rings: number;
  ringPlates?: number;
  // Rows of osteoderms on the back: how many across, and their keels (tall points, low ridges,
  // or flat).
  across: number;
  keel: 'tall' | 'low' | 'flat';
  // Spikes along the sides (pairs) and their length.
  flank: number;
  flankLen: number;
  // Big spikes at the shoulders: long, forked (two-pronged, pointing forward), or flat blades.
  shoulder?: { n: number; len: number; kind: 'long' | 'forked' | 'blade' };
  // A shield of small fused osteoderms over the hips.
  hipShield?: boolean;
  // Big spikes over the hips (pairs) and their length.
  hipSpikes?: { n: number; len: number };
  // The end of the tail.
  tail: 'club' | 'spikes' | 'macuahuitl' | 'plain';
};

const ANKY: AnkySpec = { body: 'wide', rings: 2, ringPlates: 6, across: 7, keel: 'low', flank: 7, flankLen: 6, tail: 'club' };

export const ANKYS: Record<string, AnkySpec> = {
  // ---- Ankylosaurids: neck half-rings, rows of osteoderms, a tail club ----
  // Small, flat, closely packed osteoderms, two half-rings, small side spikes.
  'ankylosaurus-magniventris': { ...ANKY, across: 8, keel: 'flat', flank: 6, flankLen: 5 },
  // Keeled osteoderms in bands across the back, and two neck half-rings.
  'euoplocephalus-tutus': { ...ANKY, keel: 'tall' },
};

export function ankyShapes(s: AnkySpec): Shape[] {
  const out: Shape[] = [];
  const rx = s.body === 'wide' ? 40 : 30;
  // Body from above: head, short neck, broad body, tail.
  out.push({ d: `M42 2 Q50 -2 58 2 L60 22 Q${50 + rx} 30 ${50 + rx} 66 Q${50 + rx} 98 60 106 L54 140 L46 140 L40 106 Q${50 - rx} 98 ${50 - rx} 66 Q${50 - rx} 30 40 22 Z`, fill: SKIN });
  // Neck half-rings: bands of fused plates.
  for (let i = 0; i < s.rings; i++) {
    const y = 16 + i * 9;
    out.push({ d: `M${50 - 16 - i * 3} ${y} Q50 ${y - 4} ${50 + 16 + i * 3} ${y} L${50 + 16 + i * 3} ${y + 6} Q50 ${y + 2} ${50 - 16 - i * 3} ${y + 6} Z`, fill: BONE });
    const n = s.ringPlates ?? 4;
    for (let j = 0; j < n; j++) {
      const x = 50 - (16 + i * 3) + ((32 + i * 6) * (j + 0.5)) / n;
      out.push({ d: ell(x, y + 2, 3, 2.4), fill: SPIKE });
    }
  }
  // Shoulder spikes.
  if (s.shoulder)
    for (let k = 0; k < s.shoulder.n; k++)
      for (const side of [-1, 1]) {
        const y = 30 + k * 8;
        const x = 50 + side * (rx * 0.72 + k * 2);
        const L = s.shoulder.len;
        if (s.shoulder.kind === 'forked') {
          out.push({ d: `M${x} ${y} L${x + side * L} ${y - L * 0.8} L${x + side * 3} ${y + 4} Z`, fill: SPIKE });
          out.push({ d: `M${x} ${y + 2} L${x + side * L * 1.05} ${y - L * 0.2} L${x + side * 2} ${y + 7} Z`, fill: SPIKE });
        } else if (s.shoulder.kind === 'blade') out.push({ d: `M${x} ${y - 3} L${x + side * L} ${y - L * 0.25} L${x + side * L * 0.6} ${y + 6} L${x} ${y + 6} Z`, fill: SPIKE });
        else out.push({ d: `M${x} ${y - 2} L${x + side * L} ${y - L * 0.35} L${x} ${y + 4} Z`, fill: SPIKE });
      }
  // Rows of osteoderms down the back.
  const rows = s.body === 'wide' ? 8 : 9;
  for (let r = 0; r < rows; r++) {
    const y = 38 + r * 8;
    const width = (rx - 6) * Math.sqrt(Math.max(0.1, 1 - ((y - 66) / 44) ** 2));
    for (let c = 0; c < s.across; c++) {
      const x = 50 - width + ((2 * width) * (c + 0.5)) / s.across;
      if (s.hipShield && y > 74 && y < 100) continue;
      const rr = s.keel === 'flat' ? 2.4 : 3.2;
      out.push({ d: ell(x, y, rr * 1.15, rr), fill: BONE });
      if (s.keel !== 'flat') out.push({ d: `M${f(x)} ${f(y - rr)} L${f(x)} ${f(y + rr)}`, fill: 'none', line: s.keel === 'tall' ? 1.6 : 0.9 });
      if (s.keel === 'tall') out.push({ d: `M${f(x - 1.2)} ${f(y)} L${f(x)} ${f(y - 4)} L${f(x + 1.2)} ${f(y)} Z`, fill: SPIKE });
    }
  }
  // A shield of small fused osteoderms over the hips.
  if (s.hipShield) {
    out.push({ d: ell(50, 88, rx * 0.8, 13), fill: '#8A7454' });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) out.push({ d: ell(50 - rx * 0.62 + c * rx * 0.2 + (r % 2 ? rx * 0.1 : 0), 79 + r * 6, 1.8, 1.8), fill: SPIKE });
  }
  // Big spikes over the hips.
  if (s.hipSpikes)
    for (let k = 0; k < s.hipSpikes.n; k++)
      for (const side of [-1, 1]) {
        const y = 86 + k * 8;
        const x = 50 + side * (rx * 0.5 + k * 3);
        out.push({ d: `M${x} ${y - 3} L${x + side * s.hipSpikes.len} ${y - s.hipSpikes.len * 0.5} L${x} ${y + 3} Z`, fill: SPIKE });
      }
  // Spikes along the sides.
  for (let i = 0; i < s.flank; i++) {
    const y = 44 + (i * 56) / Math.max(1, s.flank);
    const w = rx * Math.sqrt(Math.max(0.15, 1 - ((y - 66) / 44) ** 2));
    for (const side of [-1, 1]) {
      const x = 50 + side * (w - 1);
      out.push({ d: `M${f(x)} ${f(y - 3)} L${f(x + side * s.flankLen)} ${f(y + 1)} L${f(x)} ${f(y + 4)} Z`, fill: SPIKE });
    }
  }
  // The tail.
  if (s.tail === 'club') out.push({ d: 'M50 136 Q38 136 37 128 Q37 120 44 119 Q47 117 50 119 Q53 117 56 119 Q63 120 63 128 Q62 136 50 136 Z', fill: BONE });
  if (s.tail === 'spikes')
    for (let i = 0; i < 4; i++)
      for (const side of [-1, 1]) {
        const y = 108 + i * 8;
        const x = 50 + side * (4 - i * 0.6);
        out.push({ d: `M${f(x)} ${f(y - 2)} L${f(x + side * (9 - i))} ${f(y + 2)} L${f(x)} ${f(y + 4)} Z`, fill: SPIKE });
      }
  if (s.tail === 'macuahuitl')
    for (let i = 0; i < 6; i++)
      for (const side of [-1, 1]) {
        const y = 112 + i * 4.5;
        const r = 8 - i * 0.8;
        out.push({ d: `M50 ${y + 3} L${50 + side * r} ${y + 2} Q${50 + side * (r + 2)} ${y - 1} ${50 + side * (r - 1)} ${y - 3} L50 ${y - 2} Z`, fill: BONE });
      }
  return out;
}

// ---- Which drawing a species uses ----
export const thyreoShapes = (id: string | undefined): Shape[] | null => {
  if (!id) return null;
  if (STEGOS[id]) return stegoShapes(STEGOS[id]!);
  if (ANKYS[id]) return ankyShapes(ANKYS[id]!);
  return null;
};
