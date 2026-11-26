// Bone War: the teeth for each kind of bite, as SVG paths. Seen from the front: the middle of the
// card is the front of the jaw, and each side runs back along the jaw, mirrored.

import type { Jaw, Palate } from '@/lib/bone-war-weapons';

const IVORY = '#F4EEDC';
const KERATIN = '#2E2824';

// One tooth hanging from the jaw line at the top: centre x, base width, length, and how far the tip curves.
const tooth = (x: number, wd: number, len: number, curve = 0) => `M${x - wd / 2} 0 Q${x + curve - wd * 0.1} ${len * 0.6} ${x + curve} ${len} Q${x + curve * 0.4 + wd * 0.2} ${len * 0.5} ${x + wd / 2} 0 Z`;
// A tyrannosaur tooth (and, longer, a sabre): thick and swollen at the base like a banana, narrowing to a sharp,
// slightly backward-curving point.
const crusher = (x: number, wd: number, len: number, curve: number) =>
  `M${x - wd / 2} 0 C${x - wd * 0.62} ${len * 0.35} ${x - wd * 0.3} ${len * 0.75} ${x + curve} ${len} C${x + wd * 0.42} ${len * 0.7} ${x + wd * 0.62} ${len * 0.3} ${x + wd / 2} 0 Z`;
const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
// A rodent's chisel incisor, and a low, flat-topped cheek tooth.
const chisel = (x: number, wd: number, len: number) => `M${x - wd / 2} 0 L${x - wd / 2} ${len - 2} Q${x} ${len + 3} ${x + wd / 2} ${len - 2} L${x + wd / 2} 0 Z`;
const molar = (x: number, wd: number, len: number) => `M${x - wd / 2} 0 L${x - wd / 2} ${len - 1.5} Q${x - wd / 4} ${len + 1} ${x} ${len - 1} Q${x + wd / 4} ${len + 1} ${x + wd / 2} ${len - 1.5} L${x + wd / 2} 0 Z`;

// A long, flat slicing blade (like Thylacoleo's premolars), its cutting edge sloping down towards
// the back of the jaw.
const shear = (x: number, wd: number, len: number, left: boolean) => {
  const [a, b] = left ? [len, len * 0.55] : [len * 0.55, len];
  return `M${x - wd / 2} 0 L${x - wd / 2} ${a - 2} Q${x - wd / 2} ${a} ${x - wd / 2 + 2} ${a} L${x + wd / 2 - 2} ${b} Q${x + wd / 2} ${b} ${x + wd / 2} ${b - 2} L${x + wd / 2} 0 Z`;
};

// A triangular cheek tooth with small points (denticles) down both edges, like early whales'.
const saw = (x: number, wd: number, len: number) => {
  const p = [[-0.5, 0], [-0.4, 0.36], [-0.3, 0.3], [-0.22, 0.64], [-0.1, 0.58], [0, 1], [0.1, 0.58], [0.22, 0.64], [0.3, 0.3], [0.4, 0.36], [0.5, 0]];
  return `M${p.map(([a, b]) => `${x + a! * wd} ${b! * len}`).join(' L')} Z`;
};
// A leaf-shaped plant-eater's tooth: broad, with a rounded point.
const leaf = (x: number, wd: number, len: number) => `M${x - wd / 2} 0 Q${x - wd * 0.75} ${len * 0.6} ${x} ${len} Q${x + wd * 0.75} ${len * 0.6} ${x + wd / 2} 0 Z`;

// One tooth on one side of the jaw: how far back from the front it sits (the middle of the card is
// the front of the jaw), its width and length, its shape, and how far its tip leans outward.
type Shape = 'cone' | 'thick' | 'chisel' | 'molar' | 'shear' | 'saw' | 'leaf';
type T = [back: number, width: number, length: number, shape?: Shape, lean?: number];
// Both sides, mirrored about the middle.
const both = (side: T[]) =>
  side.flatMap(([off, wd, len, shape = 'cone', lean = 0]) =>
    [50 - off, 50 + off].map((x) => {
      const c = x < 50 ? -lean : lean;
      if (shape === 'shear') return shear(x, wd, len, x < 50);
      if (shape === 'saw') return saw(x, wd, len);
      if (shape === 'leaf') return leaf(x, wd, len);
      return shape === 'thick' ? crusher(x, wd, len, c) : shape === 'chisel' ? chisel(x, wd, len) : shape === 'molar' ? molar(x, wd, len) : tooth(x, wd, len, c);
    }),
  );

// Each jaw's teeth from the front of the mouth (the middle) back along the jaw (to each side).
// Upper and lower rows, each in a 100 × 70 box hanging from the top (the lower jaw is drawn flipped).
const DENTITION: Record<Exclude<Jaw, 'beak' | 'blades' | 'toothless'>, { upper: T[]; lower: T[]; back?: { upper: T[]; lower: T[] }; fill?: string }> = {
  // Tyrannosaurs: small, D-shaped premaxillary teeth at the front, then huge, thick maxillary teeth,
  // biggest just behind the front and smaller further back.
  crusher: {
    upper: [[3, 4.5, 11], [7.5, 4.5, 13], [14, 9, 46, 'thick', 1], [23, 10, 54, 'thick', 2], [32, 9, 46, 'thick', 2], [40, 8, 36, 'thick', 2], [47, 6, 24, 'thick', 1]],
    lower: [[4, 7, 28, 'thick'], [12, 8, 40, 'thick', 1], [21, 9, 48, 'thick', 2], [30, 8, 42, 'thick', 2], [39, 7, 32, 'thick', 1], [46, 6, 22, 'thick', 1]],
  },
  // Allosaurs, carcharodontosaurs and most theropods: flattened, serrated blades, a few smaller
  // premaxillary teeth in front, the longest early in the row.
  serrated: {
    upper: [[3, 4.5, 16, 'cone', 1], [8, 4.5, 19, 'cone', 1], [14, 6.5, 40, 'cone', 3], [22, 6.5, 46, 'cone', 3], [30, 6.5, 42, 'cone', 3], [38, 6, 34, 'cone', 2], [45, 5, 26, 'cone', 2]],
    lower: [[4, 5, 22, 'cone', 1], [11, 6, 32, 'cone', 2], [19, 6.5, 40, 'cone', 3], [27, 6.5, 38, 'cone', 3], [35, 6, 32, 'cone', 2], [43, 5, 24, 'cone', 2]],
  },
  // Dilophosaurus, Coelophysis and their kin: like the other theropods, but with a toothless gap in
  // the upper row (the subnarial notch) between the snout tip and the main upper jaw, where an
  // enlarged lower tooth fits.
  notched: {
    upper: [[3, 4.5, 18, 'cone', 1], [8, 4.5, 21, 'cone', 1], [12.5, 4.5, 18, 'cone', 1], [25, 6, 40, 'cone', 3], [32, 6, 44, 'cone', 3], [39, 5.5, 36, 'cone', 2], [46, 5, 26, 'cone', 2]],
    lower: [[4, 5, 20, 'cone', 1], [10, 5, 24, 'cone', 1], [18.5, 6.5, 38, 'cone', 2], [26, 5.5, 30, 'cone', 2], [33, 5.5, 30, 'cone', 2], [40, 5, 26, 'cone', 2], [46.5, 4.5, 20, 'cone', 1]],
  },
  // Spinosaurs: a rosette of long, straight, unserrated cones at the snout tip, then a notch in the
  // upper jaw holding only small teeth, then the maxillary teeth. The lower jaw's tip is a second
  // rosette of big teeth that sits in that notch when the mouth closes, so the two rosettes
  // interlock into a trap for slippery fish. (Dilophosaurus's notch looks similar, but there it is
  // thought to come from a loose joint between two snout bones, not a fish trap.)
  spinosaur: {
    upper: [[3, 5, 30], [8, 6, 40], [13, 6, 42], [20, 3.5, 12], [26, 3.5, 12], [32, 5.5, 34], [38.5, 5, 28], [44.5, 4.5, 22]],
    lower: [[3, 4.5, 22], [9, 5.5, 32], [16.5, 6.5, 42], [23, 6.5, 44], [29.5, 4.5, 20], [35.5, 4.5, 24], [41.5, 4.5, 22], [47, 4, 18]],
  },
  // Crocodiles and their kin: uneven cones, with an enlarged fourth tooth in the lower jaw that fits
  // a notch behind the snout tip, and an enlarged fifth upper tooth.
  conical: {
    upper: [[4, 4.5, 16], [9.5, 4.5, 22], [15, 5.5, 30], [25, 7, 42], [31.5, 5, 26], [37, 5, 22], [42.5, 4.5, 20], [48, 4, 16]],
    lower: [[4, 5, 26], [10, 4.5, 18], [18, 7, 42], [25.5, 5, 20], [31, 5, 24], [36.5, 4.5, 22], [42, 4.5, 18], [47.5, 4, 14]],
  },
  // Plesiosaurs, fish-eating pterosaurs and fish like Xiphactinus: a rosette of long, interlocking
  // fangs at the snout tip, then smaller cones further back.
  rosette: {
    upper: [[3, 5.5, 34], [8.5, 6, 42], [14, 5.5, 36], [23, 5, 26], [29, 4.5, 24], [35, 4.5, 22], [41, 4, 20], [47, 4, 18]],
    lower: [[3.5, 5.5, 38], [9, 6, 42], [15, 5, 30], [24, 4.5, 22], [30, 4.5, 22], [36, 4.5, 20], [42, 4, 18], [47.5, 4, 16]],
  },
  // Dolphins, ichthyosaurs, mosasaurs and constricting snakes: rows of near-identical cones.
  peg: {
    upper: range(3, 47, 5.5).map((o) => [o, 4.2, 22 - o * 0.12] as T),
    lower: range(3, 47, 5.5).map((o) => [o, 4.2, 22 - o * 0.12] as T),
  },
  // Sharks: the biggest teeth at the front, small intermediate teeth, then laterals shrinking towards
  // the corners, with the next row of replacement teeth behind.
  shark: {
    upper: [[4, 9, 34], [13, 9, 36], [20.5, 6, 20], [27.5, 8.5, 30, 'cone', 2], [35.5, 8, 26, 'cone', 3], [43, 7, 20, 'cone', 3], [48.5, 5, 13, 'cone', 2]],
    lower: [[4, 7, 34], [11.5, 7, 34], [19, 7, 30], [26.5, 7, 28], [34, 6.5, 24], [41.5, 6, 18], [47.5, 5, 13]],
    back: { upper: range(8, 44, 8).map((o) => [o, 6, 18] as T), lower: range(8, 44, 8).map((o) => [o, 5.5, 18] as T) },
    fill: '#FBF8EE',
  },
  // Cats, dogs, bears and other carnivores: three small incisors a side (the outer one a little
  // bigger), a big canine, a gap, small premolars, the blade-like carnassial and a small molar.
  fangs: {
    upper: [[2.5, 4, 10], [7, 4, 11], [11.5, 4.5, 14], [19, 8, 40, 'thick', 1], [28, 4.5, 10], [33.5, 5.5, 14], [41, 8, 20], [47.5, 4.5, 7, 'molar']],
    lower: [[2.5, 3.5, 9], [6.5, 3.5, 10], [10.5, 4, 11], [17, 7.5, 34, 'thick', 1], [26.5, 4.5, 10], [32, 5.5, 14], [40, 8, 20], [47, 4.5, 8, 'molar']],
  },
  // Sabre-toothed animals: six small incisors, the sabres, then few cheek teeth (a premolar and the
  // carnassial). The lower canines are small.
  sabre: {
    upper: [[2.5, 4.6, 10], [7.5, 4.6, 10], [12.5, 4.6, 12], [23, 15, 68, 'thick', 3], [35, 5, 10], [42, 8, 20], [48, 4, 7, 'molar']],
    lower: [[2.5, 4, 9], [7, 4, 9], [11.5, 4, 10], [18, 6, 16], [28, 5, 10], [37, 8, 18], [45, 6, 12]],
  },
  // Vipers and other venomous snakes: a long fang near the front of each upper jaw and nothing else
  // there; small, hooked teeth along the lower jaw.
  venom: {
    upper: [[11, 6, 54, 'cone', 2]],
    lower: range(5, 45, 6).map((o) => [o, 3.5, 11, 'cone', 1] as T),
    fill: '#FFFDF6',
  },
  // Thylacoleo, the marsupial lion: no real canines. Big stabbing incisors at the front (the lower
  // ones long and jutting forward), tiny teeth and a gap, then each side's huge slicing premolar
  // blade, and only small molars behind it.
  thylacoleo: {
    upper: [[4, 8, 44, 'thick'], [11, 3, 6], [15, 3, 6], [28, 17, 26, 'shear'], [40.5, 5, 6, 'molar'], [46.5, 4, 5, 'molar']],
    lower: [[4, 7, 40, 'thick'], [28, 17, 24, 'shear'], [41, 6, 8, 'molar'], [47, 4, 6, 'molar']],
  },
  // Early whales (Basilosaurus, Dorudon, Ambulocetus): cone-shaped front teeth, then triangular
  // cheek teeth with saw-like points down their edges.
  archaeocete: {
    upper: [[3, 4, 22], [9, 4, 25], [15, 4.5, 28], [21.5, 6, 34], [30, 9, 24, 'saw'], [39, 9, 22, 'saw'], [47, 7, 16, 'saw']],
    lower: [[3, 4, 22], [9, 4, 25], [15, 4.5, 26], [21.5, 6, 30], [30, 9, 22, 'saw'], [39, 9, 20, 'saw'], [47, 7, 14, 'saw']],
  },
  // Sperm whales: big peg teeth in the lower jaw only; the upper jaw has sockets they fit into.
  sperm: {
    upper: [],
    lower: [[4, 6.5, 30], [10, 6.5, 32], [16, 6.5, 32], [22, 6.5, 30], [28, 6, 28], [34, 6, 26], [40, 5.5, 22], [46, 5, 18]],
  },
  // Beaked whales: no working teeth except one pair of tusks in the lower jaw.
  tusked: { upper: [], lower: [[6, 7, 24, 'thick']] },
  // Lemurs, lorises and galagos: a toothcomb at the front of the lower jaw (six thin teeth lying
  // forward, close together) behind which sits a canine-like premolar; above, small incisors with a
  // gap between them, then a canine.
  toothcomb: {
    upper: [[5, 3, 8], [9, 3, 8], [16, 6, 30, 'thick'], [25, 5, 10], [32, 6, 12], [40, 7, 8, 'molar'], [47, 6, 7, 'molar']],
    lower: [[1.5, 2.4, 30], [4.5, 2.4, 30], [7.5, 2.6, 28], [14, 5, 20], [24, 5, 10], [33, 7, 8, 'molar'], [41, 7, 8, 'molar'], [48, 5, 7, 'molar']],
  },
  // Humans and their extinct relatives: flat, spade-shaped incisors, small canines barely longer
  // than the other teeth, then premolars and broad, flat-topped molars.
  hominin: {
    upper: [[3, 6, 16, 'chisel'], [9, 5, 14, 'chisel'], [15, 5.5, 16], [21.5, 6, 12, 'molar'], [28, 6, 12, 'molar'], [35.5, 8, 11, 'molar'], [43.5, 8, 11, 'molar']],
    lower: [[2.5, 5, 14, 'chisel'], [7.5, 5, 14, 'chisel'], [13, 5, 15], [19.5, 6, 12, 'molar'], [26, 6, 12, 'molar'], [33.5, 8, 11, 'molar'], [42, 8, 11, 'molar']],
  },
  // Paranthropus ("Nutcracker Man") and Gigantopithecus: tiny front teeth and blunt canines, with
  // huge, flat grinding premolars and molars.
  robust: {
    upper: [[3, 5, 10, 'chisel'], [8.5, 4.5, 9, 'chisel'], [13.5, 4.5, 10], [21, 8, 12, 'molar'], [29.5, 9, 12, 'molar'], [39.5, 11, 12, 'molar']],
    lower: [[2.5, 4.5, 9, 'chisel'], [7, 4.5, 9, 'chisel'], [12, 4.5, 10], [19.5, 8, 12, 'molar'], [28, 9, 12, 'molar'], [38, 11, 12, 'molar']],
  },
  // Crushing tooth plates (lungfish, chimaeras, placodonts, rays that eat shellfish): broad, flat
  // and blunt.
  pavement: {
    upper: [[5, 9, 8, 'molar'], [15, 9, 9, 'molar'], [25, 9.5, 10, 'molar'], [35, 9, 9, 'molar'], [45, 8, 8, 'molar']],
    lower: [[5, 9, 8, 'molar'], [15, 9, 9, 'molar'], [25, 9.5, 10, 'molar'], [35, 9, 9, 'molar'], [45, 8, 8, 'molar']],
  },
  // Helicoprion: a spiral whorl of teeth in the middle of the lower jaw, and small crushing teeth
  // above.
  whorl: {
    upper: [[12, 7, 6, 'molar'], [22, 7, 6, 'molar'], [32, 7, 6, 'molar'], [42, 6, 5, 'molar']],
    lower: [[0, 16, 50], [0, 12, 36], [0, 8, 22]],
  },
  // Pterosaurs that strained food (Ctenochasma, Pterodaustro) and deep-sea anglerfish: many long,
  // thin needle teeth.
  needles: {
    upper: range(1.5, 48, 2.6).map((o) => [o, 1.4, 26 - o * 0.2] as T),
    lower: range(2.8, 48, 2.6).map((o) => [o, 1.4, 24 - o * 0.2] as T),
  },
  // Frogs: a row of tiny teeth in the upper jaw only (the lower jaw is toothless).
  frog: { upper: range(3.5, 46, 3.5).map((o) => [o, 2, 5] as T), lower: [] },
  // Iguanas and other plant-eating lizards: rows of small leaf-shaped teeth.
  leaf: {
    upper: range(4, 46, 6).map((o) => [o, 5, 12, 'leaf'] as T),
    lower: range(4, 46, 6).map((o) => [o, 5, 12, 'leaf'] as T),
  },
  // Moray eels: long, backward-curving fangs at the front of the jaws (a big one in the middle of
  // the upper jaw), getting smaller further back. (The second set of jaws in the throat is drawn as
  // its own animation.)
  moray: {
    upper: [[2.5, 3.6, 32, 'cone', -1], [8, 3.2, 24, 'cone', 2], [13.5, 3, 21, 'cone', 2], [19, 3, 18, 'cone', 2], [25, 2.8, 16], [31, 2.6, 14], [37, 2.5, 12], [43, 2.4, 10]],
    lower: [[3, 3.4, 27, 'cone', -1], [9, 3, 22, 'cone', 2], [15, 3, 18, 'cone', 2], [21, 2.8, 16], [27, 2.6, 14], [33, 2.5, 12], [39, 2.4, 10], [45, 2.2, 8]],
  },
  // Rodents and rabbits: two long chisel incisors, a wide toothless gap, then flat grinding molars
  // at the back.
  incisors: {
    upper: [[3.5, 6.5, 40, 'chisel'], [38, 6, 8, 'molar'], [44, 6, 7.5, 'molar'], [49, 5, 7, 'molar']],
    lower: [[3.5, 6, 34, 'chisel'], [38, 6, 8, 'molar'], [44, 6, 7.5, 'molar'], [49, 5, 7, 'molar']],
    fill: '#F0D27A',
  },
};

// Rows of teeth on the roof of the mouth, drawn behind the upper teeth.
// Each row sits further back in the mouth, so it's drawn lower (drop), showing between and below the
// main teeth.
const PALATE: Record<Palate, { row: T[]; drop: number }> = {
  // A short row near the middle of the palate, curving back.
  pterygoid: { row: [6.5, 11, 15.5, 20, 24.5].map((o) => [o, 3.2, 16, 'cone', 1.5] as T), drop: 10 },
  // A long row running alongside the main teeth.
  palatine: { row: range(5.5, 40, 4.5).map((o) => [o, 2.6, 11, 'cone', 1] as T), drop: 11 },
  // A big fang on each side of the palate, with smaller teeth behind it.
  fangs: { row: [[14, 5, 28] as T, [24, 2.5, 9] as T, [30, 2.5, 9] as T, [36, 2.5, 8] as T], drop: 8 },
};
// A path moved down by dy.
const lowered = (d: string, dy: number) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${x} ${(Number(y) + dy).toFixed(1)}`);

// The teeth of one jaw (and, for the upper jaw, any on the roof of the mouth).
export function teeth(jaw: Jaw, lower: boolean, palate?: Palate): { paths: string[]; fill: string; back?: string[] } {
  const t = jawTeeth(jaw, lower);
  if (lower || !palate) return t;
  const p = PALATE[palate];
  return { ...t, back: [...(t.back ?? []), ...both(p.row).map((d) => lowered(d, p.drop))] };
}

function jawTeeth(jaw: Jaw, lower: boolean): { paths: string[]; fill: string; back?: string[] } {
  if (jaw === 'beak')
    return {
      // A hooked beak: its tip at the front, in the middle.
      paths: [lower ? 'M0 0 L100 0 L100 8 Q66 12 50 44 Q34 12 0 8 Z' : 'M0 0 L100 0 L100 10 Q70 14 54 60 L50 68 L46 58 Q32 14 0 10 Z'],
      fill: lower ? '#4A433C' : KERATIN,
    };
  if (jaw === 'toothless')
    // No teeth in the mouth at all (carp and goldfish, herring, sturgeons, seahorses): soft lips.
    return { paths: [lower ? 'M0 0 L100 0 L100 5 Q50 14 0 5 Z' : 'M0 0 L100 0 L100 6 Q50 16 0 6 Z'], fill: '#C98F86' };
  if (jaw === 'blades')
    // Placoderms had no teeth: bony jaw plates, with a pair of fang-like points meeting at the front
    // and a shearing edge with a second point further back.
    return {
      paths: [
        lower
          ? 'M0 6 L24 14 L32 26 L40 16 L45.5 42 L50 20 L54.5 42 L60 16 L68 26 L76 14 L100 6 L100 0 L0 0 Z'
          : 'M0 6 L22 14 L30 30 L37 16 L44 20 L46.5 52 L50 24 L53.5 52 L56 20 L63 16 L70 30 L78 14 L100 6 L100 0 L0 0 Z',
      ],
      fill: '#D8CDB2',
    };
  const d = DENTITION[jaw];
  return { paths: both(lower ? d.lower : d.upper), back: d.back ? both(lower ? d.back.lower : d.back.upper) : undefined, fill: d.fill ?? IVORY };
}

