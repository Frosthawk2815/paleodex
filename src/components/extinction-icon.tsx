import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import type { Cause } from '@/lib/extinctions';

export const CAUSE_COLORS: Record<Cause, string> = {
  sun: '#FFD54A',
  ice: '#BFE6FF',
  anoxia: '#7FD1C7',
  volcano: '#FF7043',
  asteroid: '#FFB347',
};

// One axis of a snowflake (a line with a V at each end), rotated by `deg` about the centre.
function snowflakeArm(deg: number): string {
  const r = (deg * Math.PI) / 180;
  const p = (x: number, y: number) => {
    const dx = x - 12;
    const dy = y - 12;
    return `${(12 + dx * Math.cos(r) - dy * Math.sin(r)).toFixed(2)} ${(12 + dx * Math.sin(r) + dy * Math.cos(r)).toFixed(2)}`;
  };
  return `M${p(12, 2)} L${p(12, 22)} M${p(9, 4.5)} L${p(12, 7)} L${p(15, 4.5)} M${p(9, 19.5)} L${p(12, 17)} L${p(15, 19.5)}`;
}

// Small drawn icons for the primary cause of a mass extinction (24×24 box).
export function ExtinctionIcon({ cause, size = 14 }: { cause: Cause; size?: number }) {
  const c = CAUSE_COLORS[cause];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {cause === 'sun' && (
        <G stroke={c} strokeWidth={2.2} strokeLinecap="round">
          <Circle cx={12} cy={12} r={5} fill={c} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return <Line key={a} x1={12 + 8 * Math.cos(r)} y1={12 + 8 * Math.sin(r)} x2={12 + 11 * Math.cos(r)} y2={12 + 11 * Math.sin(r)} />;
          })}
        </G>
      )}
      {cause === 'ice' && (
        <G stroke={c} strokeWidth={2} strokeLinecap="round" fill="none">
          {[0, 60, 120].map((a) => (
            <Path key={a} d={snowflakeArm(a)} />
          ))}
        </G>
      )}
      {cause === 'anoxia' && (
        <G>
          <SvgText x={12} y={17} fontSize={15} fontWeight="700" fill={c} textAnchor="middle">
            O₂
          </SvgText>
          <Line x1={3} y1={21} x2={21} y2={3} stroke="#FF6B6B" strokeWidth={2.2} strokeLinecap="round" />
        </G>
      )}
      {cause === 'volcano' && (
        <G>
          <Path d="M2 22 L9 10 L15 10 L22 22 Z" fill="#8D6E63" />
          <Path d="M9 10 L15 10 L13.5 13 L10.5 13 Z" fill={c} />
          <Circle cx={10} cy={6} r={2.4} fill={c} />
          <Circle cx={14.5} cy={4} r={2} fill={c} opacity={0.8} />
        </G>
      )}
      {cause === 'asteroid' && (
        <G>
          <Path d="M10 14 L21 3 L14 10 Z" fill={c} opacity={0.7} />
          <Path d="M4 13 L7 9 L12 10 L14 15 L11 20 L5 19 Z" fill="#8C7A68" stroke="#3E3329" strokeWidth={1} />
        </G>
      )}
    </Svg>
  );
}
