// Bone War: each kind of armour, drawn over a card (in a 100 × 140 box) when an attack bounces off
// it. Simplified, but true to the animal: a ceratopsian's frill with its edge of small bony points,
// a turtle's scutes, an ankylosaur's keeled osteoderms, a crocodile's rows of scutes, and so on.

import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { Defence } from '@/lib/bone-war-defences';

const LINE = '#2E2418';

// Points around an ellipse, from angle a0 to a1 (degrees; 0 is to the right, -90 straight up).
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), a] as const;
  });

// Small bony points (epoccipitals) round a frill's edge, or longer spikes.
const edgePoints = (cx: number, cy: number, rx: number, ry: number, n: number, len: number, wd: number, fill: string) =>
  arc(cx, cy, rx, ry, -165, -15, n).map(([x, y, a], i) => {
    const [ox, oy] = [Math.cos(a), Math.sin(a)];
    const [px, py] = [-oy, ox];
    return <Path key={i} d={`M${x + px * wd} ${y + py * wd} L${x + ox * len} ${y + oy * len} L${x - px * wd} ${y - py * wd} Z`} fill={fill} stroke={LINE} strokeWidth={0.6} />;
  });

export function armour(d: Defence): ReactNode {
  switch (d) {
    case 'frill':
      // A long frill with a pair of openings, edged with small bony points.
      return (
        <G>
          {edgePoints(50, 92, 44, 78, 13, 7, 3, '#B89468')}
          <Path d="M6 132 Q2 30 50 14 Q98 30 94 132 Q50 112 6 132 Z" fill="#9A7650" stroke={LINE} strokeWidth={1} />
          <Ellipse cx={31} cy={66} rx={11} ry={21} fill="#5E4630" stroke={LINE} strokeWidth={0.8} />
          <Ellipse cx={69} cy={66} rx={11} ry={21} fill="#5E4630" stroke={LINE} strokeWidth={0.8} />
          <Path d="M50 18 L50 120" stroke="#7A5C3C" strokeWidth={3} />
        </G>
      );
    case 'solidfrill':
      // Triceratops: a solid frill of bone, grooved by blood vessels, edged with bony points.
      return (
        <G>
          {edgePoints(50, 96, 42, 70, 13, 6, 3, '#B89468')}
          <Path d="M8 132 Q4 40 50 26 Q96 40 92 132 Q50 114 8 132 Z" fill="#9A7650" stroke={LINE} strokeWidth={1} />
          {[-60, -35, -12, 12, 35, 60].map((a) => (
            <Path key={a} d={`M50 120 Q${50 + a * 0.35} 90 ${50 + a * 0.62} 46`} stroke="#7A5C3C" strokeWidth={1.2} fill="none" />
          ))}
        </G>
      );
    case 'spikyfrill':
      // Centrosaurines (Styracosaurus and kin): a shorter frill edged with long spikes and hooks.
      return (
        <G>
          {edgePoints(50, 104, 38, 52, 6, 40, 4.5, '#D8C39A')}
          <Path d="M10 132 Q6 66 50 50 Q94 66 90 132 Q50 116 10 132 Z" fill="#9A7650" stroke={LINE} strokeWidth={1} />
          <Ellipse cx={34} cy={88} rx={8} ry={12} fill="#5E4630" stroke={LINE} strokeWidth={0.8} />
          <Ellipse cx={66} cy={88} rx={8} ry={12} fill="#5E4630" stroke={LINE} strokeWidth={0.8} />
        </G>
      );
    case 'shell': {
      // A turtle's carapace: five scutes down the middle, four either side, and a rim of marginals.
      const hex = (cy: number, s: number) => `M${50 - s} ${cy} L${50 - s * 0.55} ${cy - s} L${50 + s * 0.55} ${cy - s} L${50 + s} ${cy} L${50 + s * 0.55} ${cy + s} L${50 - s * 0.55} ${cy + s} Z`;
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Ellipse cx={50} cy={70} rx={46} ry={64} fill="#7A6534" />
          <Ellipse cx={50} cy={70} rx={38} ry={55} fill="#8C7640" />
          {arc(50, 70, 46, 64, -180, 180, 25).map(([x, y], i) => {
            const [ix, iy] = [50 + (x - 50) * 0.83, 70 + (y - 70) * 0.86];
            return <Path key={i} d={`M${ix} ${iy} L${x} ${y}`} />;
          })}
          {[28, 50, 72, 94, 114].map((cy) => (
            <Path key={cy} d={hex(cy, 11)} fill="#9C8650" />
          ))}
          {[39, 61, 83, 104].map((y) => (
            <G key={y}>
              <Path d={`M39 ${y} L${14 + Math.abs(70 - y) * 0.25} ${y - 4}`} />
              <Path d={`M61 ${y} L${86 - Math.abs(70 - y) * 0.25} ${y - 4}`} />
            </G>
          ))}
        </G>
      );
    }
    case 'leathery':
      // A leatherback's back: leathery skin over small bones, with seven ridges running its length.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M50 6 Q96 28 90 88 Q80 130 50 136 Q20 130 10 88 Q4 28 50 6 Z" fill="#3B4248" />
          {[-30, -20, -10, 0, 10, 20, 30].map((o) => (
            <Path key={o} d={`M${50 + o * 0.5} 10 Q${50 + o * 1.25} 70 ${50 + o * 0.2} 132`} stroke="#9AA3AA" strokeWidth={1.6} fill="none" />
          ))}
        </G>
      );
    case 'osteoderms':
      // An ankylosaur's back: rows of keeled bony plates set in the skin, spikes along the sides.
      return (
        <G stroke={LINE} strokeWidth={0.8}>
          <Rect x={8} y={4} width={84} height={132} rx={18} fill="#6E5D45" />
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <G key={r}>
              {[0, 1, 2, 3].map((c) => {
                const x = 22 + c * 19 + (r % 2 ? 9 : 0) - (r % 2 && c === 3 ? 76 : 0);
                const y = 16 + r * 18;
                return (
                  <G key={c}>
                    <Ellipse cx={x} cy={y} rx={8} ry={7} fill="#9C8664" />
                    <Path d={`M${x} ${y - 6} L${x} ${y + 6}`} stroke="#5E4C34" strokeWidth={1.4} />
                  </G>
                );
              })}
              <Path d={`M9 ${12 + r * 18} L0 ${18 + r * 18} L9 ${22 + r * 18} Z`} fill="#B9A27A" />
              <Path d={`M91 ${12 + r * 18} L100 ${18 + r * 18} L91 ${22 + r * 18} Z`} fill="#B9A27A" />
            </G>
          ))}
        </G>
      );
    case 'scutes':
      // A crocodile's back: rows of bony scutes, each with a raised keel, two big ones at the neck.
      return (
        <G stroke={LINE} strokeWidth={0.8}>
          <Rect x={12} y={2} width={76} height={136} rx={14} fill="#3F4A2E" />
          <Rect x={30} y={6} width={18} height={14} rx={3} fill="#5E6B42" />
          <Rect x={52} y={6} width={18} height={14} rx={3} fill="#5E6B42" />
          {Array.from({ length: 8 }, (_, r) =>
            [0, 1, 2, 3].map((c) => {
              const x = 16 + c * 17.5;
              const y = 26 + r * 14;
              return (
                <G key={`${r}-${c}`}>
                  <Rect x={x} y={y} width={15} height={12} rx={2.5} fill="#56623C" />
                  <Path d={`M${x + 7.5} ${y + 1.5} L${x + 7.5} ${y + 10.5}`} stroke="#2A3220" strokeWidth={1.6} />
                </G>
              );
            }),
          )}
        </G>
      );
    case 'carapace': {
      // A glyptodont's (or placodont's) domed shell: a mosaic of hundreds of fused bony plates, each
      // with a rosette pattern.
      const cells: ReactNode[] = [];
      for (let r = 0; r < 12; r++)
        for (let c = 0; c < 9; c++) {
          const x = 10 + c * 10 + (r % 2 ? 5 : 0);
          const y = 10 + r * 10.5;
          if (((x - 50) / 44) ** 2 + ((y - 70) / 62) ** 2 > 0.92) continue;
          cells.push(
            <G key={`${r}-${c}`}>
              <Circle cx={x} cy={y} r={5} fill="#A28B66" />
              <Circle cx={x} cy={y} r={2} fill="#7A6548" />
            </G>,
          );
        }
      return (
        <G stroke={LINE} strokeWidth={0.6}>
          <Ellipse cx={50} cy={70} rx={46} ry={64} fill="#8A7454" strokeWidth={1} />
          {cells}
        </G>
      );
    }
    case 'banded':
      // An armadillo's armour: solid shields at front and back with flexible bands between.
      return (
        <G stroke={LINE} strokeWidth={0.8}>
          <Ellipse cx={50} cy={70} rx={44} ry={64} fill="#9C8A70" strokeWidth={1} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <G key={i}>
              <Path d={`M${8 + Math.abs(3 - i)} ${50 + i * 7} L${92 - Math.abs(3 - i)} ${50 + i * 7}`} strokeWidth={1.4} />
              {Array.from({ length: 9 }, (_, j) => (
                <Path key={j} d={`M${14 + j * 9} ${50 + i * 7} L${14 + j * 9} ${55 + i * 7}`} stroke="#6E5E48" />
              ))}
            </G>
          ))}
          {[24, 34, 106, 116].map((y) =>
            [26, 38, 50, 62, 74].map((x) => <Circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="#B4A288" />),
          )}
        </G>
      );
    case 'scales': {
      // Overlapping scales (pangolins, fish, lizards), each lying over the one behind it.
      const rows: ReactNode[] = [];
      for (let r = 11; r >= 0; r--)
        for (let c = 0; c < 7; c++) {
          const x = 8 + c * 14 + (r % 2 ? 7 : 0);
          const y = 2 + r * 11;
          rows.push(<Path key={`${r}-${c}`} d={`M${x - 8} ${y} Q${x - 8} ${y + 11} ${x} ${y + 15} Q${x + 8} ${y + 11} ${x + 8} ${y} Z`} fill={r % 2 ? '#8A6E4B' : '#9A7D58'} stroke={LINE} strokeWidth={0.6} />);
        }
      return <G>{rows}</G>;
    }
    case 'plates':
      // A stegosaur's back: two staggered rows of tall bony plates along the spine.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M50 0 L50 140" stroke="#6E5D45" strokeWidth={6} />
          {[10, 30, 52, 76, 100, 122].map((y, i) => {
            const s = [9, 13, 16, 16, 13, 9][i]!;
            const left = i % 2 === 0;
            const x = left ? 50 - 2 : 50 + 2;
            const tip = left ? x - s * 2.2 : x + s * 2.2;
            return <Path key={y} d={`M${x} ${y - s} Q${tip} ${y - s * 0.6} ${tip} ${y} Q${tip} ${y + s * 0.6} ${x} ${y + s} Z`} fill="#A07A52" />;
          })}
        </G>
      );
    case 'dome':
      // A pachycephalosaur's skull: a thick dome of solid bone ringed with small bony knobs.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M6 112 Q6 20 50 16 Q94 20 94 112 Z" fill="#A9895F" />
          <Path d="M18 100 Q18 34 50 30 Q82 34 82 100" stroke="#8C6F48" strokeWidth={2} fill="none" />
          {arc(50, 112, 46, 94, -178, -2, 11).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={3.6} fill="#7A5E3C" />
          ))}
          {[20, 34, 50, 66, 80].map((x) => (
            <Circle key={x} cx={x} cy={118} r={4} fill="#7A5E3C" />
          ))}
        </G>
      );
    case 'armourplate':
      // An armoured fish: a bony head shield with its eye openings, jointed to a trunk shield, both
      // covered in small bumps.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M10 66 Q10 8 50 6 Q90 8 90 66 Z" fill="#7D7466" />
          <Path d="M8 70 L92 70 L86 132 Q50 140 14 132 Z" fill="#6E6658" />
          <Circle cx={34} cy={34} r={7} fill="#2E2A24" />
          <Circle cx={66} cy={34} r={7} fill="#2E2A24" />
          <Path d="M50 8 L50 66 M50 70 L50 134 M20 50 L80 50 M14 100 L86 100" stroke="#4E473C" strokeWidth={0.8} />
          {Array.from({ length: 40 }, (_, i) => (
            <Circle key={i} cx={16 + ((i * 37) % 70)} cy={14 + ((i * 53) % 116)} r={1.2} fill="#A39A8A" stroke="none" />
          ))}
        </G>
      );
    case 'exoskeleton':
      // A segmented exoskeleton (drawn trilobite-style): a head shield, jointed body segments with a
      // raised middle, and a tail shield.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M6 44 Q6 4 50 4 Q94 4 94 44 L98 62 L86 46 Z M6 44 L2 62 L14 46 Z" fill="#7A6A56" />
          <Path d="M6 44 Q6 4 50 4 Q94 4 94 44 Z" fill="#8A7A64" />
          <Path d="M40 40 Q40 12 50 12 Q60 12 60 40 Z" fill="#9C8B72" />
          {Array.from({ length: 8 }, (_, i) => (
            <G key={i}>
              <Rect x={10} y={46 + i * 8.5} width={80} height={8} rx={3} fill="#7A6A56" />
              <Rect x={40} y={46 + i * 8.5} width={20} height={8} rx={3} fill="#9C8B72" />
            </G>
          ))}
          <Path d="M14 116 L86 116 Q80 138 50 138 Q20 138 14 116 Z" fill="#8A7A64" />
        </G>
      );
    case 'conch': {
      // A coiled shell, ribbed, each whorl wrapping the last.
      const whorls = [
        [50, 72, 44],
        [44, 76, 30],
        [48, 80, 20],
        [46, 78, 12],
        [47, 77, 6],
      ] as const;
      return (
        <G stroke={LINE} strokeWidth={1}>
          {whorls.map(([cx, cy, r], i) => (
            <Circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#C9B48A' : '#B39B6E'} />
          ))}
          {Array.from({ length: 22 }, (_, i) => {
            const a = (i / 22) * Math.PI * 2;
            return <Path key={i} d={`M${44 + Math.cos(a) * 30} ${76 + Math.sin(a) * 30} L${50 + Math.cos(a) * 44} ${72 + Math.sin(a) * 44}`} stroke="#8C7650" />;
          })}
        </G>
      );
    }
    case 'straightshell':
      // A straight, tapering shell divided inside by walls (septa).
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M46 2 Q50 0 54 2 L78 136 L22 136 Z" fill="#B39B6E" />
          {Array.from({ length: 11 }, (_, i) => {
            const y = 14 + i * 11.5;
            const half = 4 + (y / 136) * 24;
            return <Path key={i} d={`M${50 - half} ${y} Q50 ${y + 4} ${50 + half} ${y}`} stroke="#8C7650" fill="none" />;
          })}
        </G>
      );
    case 'clam':
      // A bivalve's shell: a fan with ribs radiating from the hinge.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M50 18 Q4 30 8 92 Q24 132 50 134 Q76 132 92 92 Q96 30 50 18 Z" fill="#B7A27C" />
          {[-40, -28, -16, -5, 5, 16, 28, 40].map((o) => (
            <Path key={o} d={`M50 20 Q${50 + o * 0.7} 80 ${50 + o} 132`} stroke="#8C7650" fill="none" />
          ))}
          <Path d="M40 18 L60 18 L56 10 L44 10 Z" fill="#9C8660" />
        </G>
      );
    case 'spines':
      // Spines bristling outward (hedgehogs, tenrecs, echidnas, horned lizards).
      return (
        <G>
          <Ellipse cx={50} cy={82} rx={40} ry={52} fill="#5A4636" />
          {Array.from({ length: 34 }, (_, i) => {
            const a = Math.PI + (i / 33) * Math.PI;
            const r0 = 18 + ((i * 7) % 3) * 6;
            const [x0, y0] = [50 + Math.cos(a) * r0, 96 + Math.sin(a) * r0 * 1.2];
            const [x1, y1] = [50 + Math.cos(a) * 52, 96 + Math.sin(a) * 82];
            return (
              <G key={i}>
                <Path d={`M${x0} ${y0} L${x1} ${y1}`} stroke="#3E2E22" strokeWidth={2.4} strokeLinecap="round" />
                <Path d={`M${x0 + (x1 - x0) * 0.75} ${y0 + (y1 - y0) * 0.75} L${x1} ${y1}`} stroke="#E8DCC4" strokeWidth={2.4} strokeLinecap="round" />
              </G>
            );
          })}
        </G>
      );
    case 'hide':
      // Thick, deeply folded hide (elephants, rhinos, hippos).
      return (
        <G>
          <Rect x={4} y={4} width={92} height={132} rx={12} fill="#77706A" />
          {Array.from({ length: 12 }, (_, i) => (
            <Path key={i} d={`M4 ${14 + i * 11} Q26 ${8 + i * 11} 50 ${15 + i * 11} Q74 ${21 + i * 11} 96 ${13 + i * 11}`} stroke="#4E4844" strokeWidth={1.6} fill="none" />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <Path key={`c${i}`} d={`M${10 + ((i * 29) % 80)} ${10 + ((i * 41) % 120)} l4 3`} stroke="#5E5852" strokeWidth={1} />
          ))}
        </G>
      );
    case 'ink':
      // A cloud of ink, released as the attacker strikes.
      return (
        <G fill="#141018">
          <Circle cx={50} cy={70} r={30} />
          <Circle cx={28} cy={56} r={20} />
          <Circle cx={72} cy={58} r={22} />
          <Circle cx={36} cy={92} r={22} />
          <Circle cx={66} cy={94} r={20} />
          <Circle cx={50} cy={40} r={18} />
        </G>
      );
  }
}
