import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export type PointIconKind = 'flag' | 'us-flag' | 'swamp' | 'dunes' | 'pickaxe';

// Where the foot of each flagpole is in the 24×24 box, so it can stand on the spot.
export const FLAG_FOOT: Partial<Record<PointIconKind, [number, number]>> = { flag: [12, 19], 'us-flag': [7, 22] };

// Badge artwork drawn in a 24×24 box centred on (12, 12).
function Art({ kind }: { kind: Exclude<PointIconKind, 'flag' | 'us-flag'> }) {
  if (kind === 'swamp') {
    // A lush, Everglades-like swamp: still water, reeds and trees.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#2F5D3A" />
        <Path d="M2.5 15 Q12 13 21.5 15 L20 19 Q12 23.5 4 19 Z" fill="#3A7CA5" />
        <Path d="M4.5 16.5 Q8 15.8 11 16.6 M13 17.4 Q16.5 16.6 19.5 17.2" stroke="#7FB8E0" strokeWidth={0.8} fill="none" />
        <Line x1={8} y1={15} x2={8} y2={9} stroke="#5B3A22" strokeWidth={1.4} />
        <Circle cx={8} cy={7.5} r={3.6} fill="#6FBF5A" />
        <Circle cx={6.2} cy={9} r={2.4} fill="#5AA548" />
        <Line x1={15.5} y1={15} x2={15.5} y2={7.5} stroke="#5B3A22" strokeWidth={1.2} />
        <Path d="M15.5 7.5 Q12.5 6 11 8 M15.5 7.5 Q18.5 6 20 8 M15.5 7.5 Q14 4.5 12.5 4.8 M15.5 7.5 Q17 4.5 18.5 4.8" stroke="#8ED86E" strokeWidth={1.3} fill="none" strokeLinecap="round" />
        <Path d="M11 16 L10.4 12.5 M12 16 L12.3 12 M18.5 15.6 L18.9 12.6" stroke="#A6E07A" strokeWidth={0.9} strokeLinecap="round" />
      </G>
    );
  }
  if (kind === 'dunes') {
    // Desert dunes under a hot sun.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#F3D9A4" />
        <Circle cx={16.5} cy={7} r={2.8} fill="#FFB347" />
        <Path d="M1.5 15 Q7 9.5 12 14 Q16 11 22.5 14.5 L21 18.5 Q12 24 3 18.5 Z" fill="#D9A35A" />
        <Path d="M2.5 18 Q9 13.5 15 17.5 Q18 16 21.5 17 L20 19.5 Q12 24 4 19.5 Z" fill="#C0843A" />
      </G>
    );
  }
  // A pickaxe: where the rocks can be dug up today.
  return (
    <G>
      <Circle cx={12} cy={12} r={11} fill="#3E4250" />
      <Line x1={7} y1={18} x2={16} y2={7.5} stroke="#B07A44" strokeWidth={2} strokeLinecap="round" />
      <Path d="M8.5 6.5 Q14.5 3.5 19.5 9.5 L18.6 10.3 Q14.5 6.5 9.2 7.6 Z" fill="#D7DCE3" stroke="#8F97A3" strokeWidth={0.6} />
    </G>
  );
}

function Flag({ color }: { color: string }) {
  return (
    <G>
      <Circle cx={12} cy={19} r={3} fill={color} stroke="#FFFFFF" strokeWidth={1} />
      <Line x1={12} y1={19} x2={12} y2={3} stroke="#FFFFFF" strokeWidth={1.5} />
      <Path d="M12 3 L22 6.5 L12 10 Z" fill={color} />
    </G>
  );
}

// The Stars and Stripes, as planted at Tranquility Base (simplified: 7 stripes, a few stars).
function UsFlag() {
  const top = 3;
  const stripe = 10 / 7;
  return (
    <G>
      <Circle cx={7} cy={22} r={1.6} fill="#FFFFFF" />
      <Line x1={7} y1={22} x2={7} y2={1.5} stroke="#E6E6E6" strokeWidth={1.3} strokeLinecap="round" />
      <Rect x={7} y={top} width={15} height={10} fill="#FFFFFF" stroke="#1A1A1A" strokeWidth={0.4} />
      {[0, 2, 4, 6].map((i) => (
        <Rect key={i} x={7} y={top + i * stripe} width={15} height={stripe} fill="#B22234" />
      ))}
      <Rect x={7} y={top} width={6.5} height={stripe * 4} fill="#3C3B6E" />
      {[
        [8.3, 4.1],
        [10.2, 4.1],
        [12.1, 4.1],
        [9.25, 5.3],
        [11.15, 5.3],
        [8.3, 6.5],
        [10.2, 6.5],
        [12.1, 6.5],
        [9.25, 7.7],
        [11.15, 7.7],
      ].map(([x, y]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={0.38} fill="#FFFFFF" />
      ))}
    </G>
  );
}

type Props = { kind: PointIconKind; x: number; y: number; size: number; color?: string };

// A marker icon to place inside an existing <Svg> (e.g. on the globe), centred on (x, y).
export function PointIconShape({ kind, x, y, size, color = '#FFD54A' }: Props) {
  const s = size / 24;
  return (
    <G transform={`translate(${x - 12 * s} ${y - 12 * s}) scale(${s})`}>
      {kind === 'flag' ? (
        <Flag color={color} />
      ) : kind === 'us-flag' ? (
        <UsFlag />
      ) : (
        <G>
          <Ellipse cx={12} cy={23.5} rx={7} ry={1.6} fill="#000000" opacity={0.35} />
          <Art kind={kind} />
          <Circle cx={12} cy={12} r={11} fill="none" stroke="#FFFFFF" strokeWidth={1.4} />
        </G>
      )}
    </G>
  );
}

// The same icon as a standalone image, for use in the interface.
export function PointIcon({ kind, size = 22, color }: { kind: PointIconKind; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <PointIconShape kind={kind} x={12} y={12} size={24} color={color} />
    </Svg>
  );
}
