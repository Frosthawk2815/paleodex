// Bone War: the teeth for each kind of bite, as SVG paths. Seen from the front: the middle of the
// card is the front of the jaw, and each side runs back along the jaw, mirrored.

import type { Jaw } from '@/lib/bone-war-weapons';

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

// One tooth on one side of the jaw: how far back from the front it sits (the middle of the card is
// the front of the jaw), its width and length, its shape, and how far its tip leans outward.
type Shape = 'cone' | 'thick' | 'chisel' | 'molar';
type T = [back: number, width: number, length: number, shape?: Shape, lean?: number];
// Both sides, mirrored about the middle.
const both = (side: T[]) =>
  side.flatMap(([off, wd, len, shape = 'cone', lean = 0]) =>
    [50 - off, 50 + off].map((x) => {
      const c = x < 50 ? -lean : lean;
      return shape === 'thick' ? crusher(x, wd, len, c) : shape === 'chisel' ? chisel(x, wd, len) : shape === 'molar' ? molar(x, wd, len) : tooth(x, wd, len, c);
    }),
  );

// Each jaw's teeth from the front of the mouth (the middle) back along the jaw (to each side).
// Upper and lower rows, each in a 100 × 70 box hanging from the top (the lower jaw is drawn flipped).
const DENTITION: Record<Exclude<Jaw, 'beak' | 'blades'>, { upper: T[]; lower: T[]; back?: { upper: T[]; lower: T[] }; fill?: string }> = {
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
  // Crocodiles and their kin: uneven cones, with an enlarged fourth tooth in the lower jaw that fits
  // a notch behind the snout tip, and an enlarged fifth upper tooth.
  conical: {
    upper: [[4, 4.5, 16], [9.5, 4.5, 22], [15, 5.5, 30], [25, 7, 42], [31.5, 5, 26], [37, 5, 22], [42.5, 4.5, 20], [48, 4, 16]],
    lower: [[4, 5, 26], [10, 4.5, 18], [18, 7, 42], [25.5, 5, 20], [31, 5, 24], [36.5, 4.5, 22], [42, 4.5, 18], [47.5, 4, 14]],
  },
  // Spinosaurs and plesiosaurs: a rosette of long, interlocking fangs at the snout tip, then
  // smaller cones further back.
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
  // Rodents and rabbits: two long chisel incisors, a wide toothless gap, then flat grinding molars
  // at the back.
  incisors: {
    upper: [[3.5, 6.5, 40, 'chisel'], [38, 6, 8, 'molar'], [44, 6, 7.5, 'molar'], [49, 5, 7, 'molar']],
    lower: [[3.5, 6, 34, 'chisel'], [38, 6, 8, 'molar'], [44, 6, 7.5, 'molar'], [49, 5, 7, 'molar']],
    fill: '#F0D27A',
  },
};

// The teeth of one jaw.
export function teeth(jaw: Jaw, lower: boolean): { paths: string[]; fill: string; back?: string[] } {
  if (jaw === 'beak')
    return {
      // A hooked beak: its tip at the front, in the middle.
      paths: [lower ? 'M0 0 L100 0 L100 8 Q66 12 50 44 Q34 12 0 8 Z' : 'M0 0 L100 0 L100 10 Q70 14 54 60 L50 68 L46 58 Q32 14 0 10 Z'],
      fill: lower ? '#4A433C' : KERATIN,
    };
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

