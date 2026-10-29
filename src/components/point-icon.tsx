import { useId } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export type PointIconKind =
  | 'flag'
  | 'us-flag'
  | 'skull'
  | 'swamp'
  | 'river'
  | 'dunes'
  | 'sea'
  | 'reef'
  | 'lagoon'
  | 'lake'
  | 'forest'
  | 'ash'
  | 'tar'
  | 'pickaxe'
  | 'track'
  | 'human-track';

// Where the foot of each flagpole is in the 24×24 box, so it can stand on the spot.
export const FLAG_FOOT: Partial<Record<PointIconKind, [number, number]>> = {
  flag: [12, 19],
  'us-flag': [7, 22],
  skull: [7, 22],
};

// Badge artwork drawn in a 24×24 box centred on (12, 12).
function Art({ kind }: { kind: Exclude<PointIconKind, 'flag' | 'us-flag' | 'skull' | 'track' | 'human-track'> }) {
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
  if (kind === 'river') {
    // A river winding across a green floodplain, with trees along its banks.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#7FA95A" />
        <Path d="M2 9 Q12 6 22 9 L22 4 Q12 0 2 4 Z" fill="#BFE3F2" opacity={0.9} />
        <Path d="M6 22 Q9 16 13 15 Q18 14 17 9.5 Q16.5 7 20 6" stroke="#3A7CA5" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <Circle cx={7} cy={12} r={2.2} fill="#3F7A35" />
        <Circle cx={18.5} cy={15.5} r={2.4} fill="#3F7A35" />
        <Circle cx={12.5} cy={10} r={1.6} fill="#4C8C3F" />
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
  if (kind === 'sea') {
    // Open sea: waves over deep blue water, with a fish below.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#1E5F8C" />
        <Path d="M1.5 9 Q4.5 6.5 7.5 9 T13.5 9 T19.5 9 T23 9 L23 2 L1 2 Z" fill="#9FD3F0" />
        <Path d="M2 12 Q5 10 8 12 T14 12 T20 12" stroke="#7FC4EA" strokeWidth={1} fill="none" />
        <Path d="M8 17 Q11.5 13.8 15 17 Q11.5 20.2 8 17 Z M15 17 L18 15 L18 19 Z" fill="#F2C14E" />
        <Circle cx={9.6} cy={16.6} r={0.6} fill="#1E5F8C" />
      </G>
    );
  }
  if (kind === 'reef') {
    // A shallow tropical reef: branching coral on a sandy floor.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#2A9BB8" />
        <Path d="M2 18 Q12 15.5 22 18 L20 20 Q12 24 4 20 Z" fill="#E9D8A6" />
        <Path d="M8 18 L8 12 M8 14 L5.5 11 M8 13 L10.5 9.5 M10.5 9.5 L10 7.5" stroke="#FF8A65" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Path d="M15.5 18 L15.5 11.5 M15.5 13.5 L18 10.5 M15.5 12.5 L13.5 9.5" stroke="#F06292" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Circle cx={12} cy={16.5} r={1.8} fill="#FFD54F" />
      </G>
    );
  }
  if (kind === 'lagoon') {
    // A warm, still lagoon behind a low reef, under a hot sky.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#F6E7B5" />
        <Circle cx={7} cy={6.5} r={2.4} fill="#FFB347" />
        <Path d="M1.2 11 L22.8 11 L22 17 Q12 25 2 17 Z" fill="#40C4C8" />
        <Path d="M1.5 11 Q6 9.2 10 11 Q15 9.6 22.5 11 Z" fill="#D9C27A" />
        <Path d="M5 14.5 L9 14.5 M12 16.5 L17 16.5" stroke="#B8F0F0" strokeWidth={0.9} strokeLinecap="round" />
      </G>
    );
  }
  if (kind === 'lake') {
    // A lake ringed by wooded hills.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#BFE3F2" />
        <Path d="M1.2 13 L6 6.5 L10 11 L14 5.5 L22.8 13 Z" fill="#4C8C3F" />
        <Path d="M1.2 13 L22.8 13 L22 17 Q12 25 2 17 Z" fill="#2E7DAF" />
        <Path d="M5 15.5 L10 15.5 M13 18 L18 18" stroke="#9FD3F0" strokeWidth={0.9} strokeLinecap="round" />
      </G>
    );
  }
  if (kind === 'forest') {
    // A Carboniferous-style coal forest: tall scale trees with tufted crowns over swampy ground.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#294D2E" />
        <Path d="M2 18 Q12 16 22 18 L20 20 Q12 24 4 20 Z" fill="#3D5A3A" />
        <Path d="M7 19 L7 6 M12 19 L12 4 M17 19 L17 7" stroke="#7A6A4A" strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M7 6 L4.5 4.5 M7 6 L9.5 4.5 M12 4 L9.5 2.8 M12 4 L14.5 2.8 M17 7 L14.6 5.5 M17 7 L19.4 5.5" stroke="#8ED86E" strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M6.2 9 L7.8 9 M6.2 12 L7.8 12 M11.2 8 L12.8 8 M11.2 11 L12.8 11 M16.2 10 L17.8 10 M16.2 13 L17.8 13" stroke="#5A4E36" strokeWidth={0.6} />
      </G>
    );
  }
  if (kind === 'ash') {
    // A volcano sending up an ash cloud.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#C9B79C" />
        <Circle cx={10} cy={6} r={3} fill="#7D7468" />
        <Circle cx={14} cy={5} r={3.4} fill="#8E857A" />
        <Circle cx={12} cy={8.5} r={2.6} fill="#6E665C" />
        <Path d="M3 20 L10 11 L14 11 L21 20 Q12 24 3 20 Z" fill="#5D4A3A" />
        <Path d="M10 11 L14 11 L13 13 L11 13 Z" fill="#FF7043" />
      </G>
    );
  }
  if (kind === 'tar') {
    // A sticky black tar seep with bubbles, and a trapped bone.
    return (
      <G>
        <Circle cx={12} cy={12} r={11} fill="#C7A76C" />
        <Path d="M2.5 13 Q12 9 21.5 13 L20.5 18 Q12 24 3.5 18 Z" fill="#1A1A1A" />
        <Circle cx={8} cy={14.5} r={1.1} fill="none" stroke="#555555" strokeWidth={0.6} />
        <Circle cx={16} cy={16} r={0.8} fill="none" stroke="#555555" strokeWidth={0.6} />
        <Path d="M11 13 L15 11.5" stroke="#F2EDE2" strokeWidth={1.2} strokeLinecap="round" />
        <Circle cx={11} cy={13} r={0.9} fill="#F2EDE2" />
        <Circle cx={15} cy={11.5} r={0.9} fill="#F2EDE2" />
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

// A black flag with a white skull: where the last of a species was seen alive.
function SkullFlag() {
  return (
    <G>
      <Circle cx={7} cy={22} r={1.6} fill="#FFFFFF" />
      <Line x1={7} y1={22} x2={7} y2={1.5} stroke="#E6E6E6" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M7 2.5 L22 2.5 L19.5 7.75 L22 13 L7 13 Z" fill="#141414" stroke="#FFFFFF" strokeWidth={0.6} />
      {/* Cranium and jaw */}
      <Circle cx={13.2} cy={6.6} r={3} fill="#F5F5F0" />
      <Rect x={11.4} y={8} width={3.6} height={2.6} rx={0.6} fill="#F5F5F0" />
      <Circle cx={12.1} cy={6.7} r={0.85} fill="#141414" />
      <Circle cx={14.3} cy={6.7} r={0.85} fill="#141414" />
      <Path d="M13.2 7.8 L12.8 8.7 L13.6 8.7 Z" fill="#141414" />
      <Line x1={12.5} y1={9.6} x2={12.5} y2={10.6} stroke="#141414" strokeWidth={0.4} />
      <Line x1={13.2} y1={9.6} x2={13.2} y2={10.6} stroke="#141414" strokeWidth={0.4} />
      <Line x1={13.9} y1={9.6} x2={13.9} y2={10.6} stroke="#141414" strokeWidth={0.4} />
    </G>
  );
}

// A ring with a footprint inside: a known fossil trackway. Three-toed for dinosaurs and other
// animals, a human foot for hominin tracks.
function TrackRing({ human }: { human: boolean }) {
  return (
    <G>
      <Ellipse cx={12} cy={23.5} rx={7} ry={1.6} fill="#000000" opacity={0.35} />
      <Circle cx={12} cy={12} r={11.3} fill="#FFFFFF" />
      <Circle cx={12} cy={12} r={9.2} fill="#E9D7A8" stroke="#8A5A2E" strokeWidth={2.6} />
      {human ? (
        <G fill="#6B4A2B">
          <Ellipse cx={12} cy={14} rx={2.7} ry={4.3} />
          <Circle cx={10.4} cy={8.1} r={1.1} />
          <Circle cx={12.3} cy={7.6} r={0.85} />
          <Circle cx={13.8} cy={8.1} r={0.72} />
          <Circle cx={14.8} cy={9.1} r={0.62} />
        </G>
      ) : (
        <G stroke="#6B4A2B" strokeLinecap="round" fill="none">
          <Path d="M12 15.2 L7.6 7.6" strokeWidth={2} />
          <Path d="M12 15.2 L12 5.9" strokeWidth={2.1} />
          <Path d="M12 15.2 L16.4 7.6" strokeWidth={2} />
          <Ellipse cx={12} cy={15.6} rx={2.5} ry={1.8} fill="#6B4A2B" stroke="none" />
        </G>
      )}
    </G>
  );
}

type Props = { kind: PointIconKind; x: number; y: number; size: number; color?: string };

// A marker icon to place inside an existing <Svg> (e.g. on the globe), centred on (x, y).
export function PointIconShape({ kind, x, y, size, color = '#FFD54A' }: Props) {
  const s = size / 24;
  // Badge artwork is clipped to its circle (ids can't contain the colons useId makes).
  const clipId = `badge${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <G transform={`translate(${x - 12 * s} ${y - 12 * s}) scale(${s})`}>
      {kind === 'flag' ? (
        <Flag color={color} />
      ) : kind === 'us-flag' ? (
        <UsFlag />
      ) : kind === 'skull' ? (
        <SkullFlag />
      ) : kind === 'track' || kind === 'human-track' ? (
        <TrackRing human={kind === 'human-track'} />
      ) : (
        <G>
          <Defs>
            <ClipPath id={clipId}>
              <Circle cx={12} cy={12} r={11} />
            </ClipPath>
          </Defs>
          <Ellipse cx={12} cy={23.5} rx={7} ry={1.6} fill="#000000" opacity={0.35} />
          <G clipPath={`url(#${clipId})`}>
            <Art kind={kind} />
          </G>
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
