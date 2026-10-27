import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { useMemo, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { landCentre, reconstructCoastlines } from '@/lib/plates';

const GRATICULE = geoGraticule10();
const DRAG_DEGREES_PER_PIXEL = 0.4;

type Spin = [number, number];

// Turns drags into globe rotation (degrees of longitude and tilt).
function createSpinResponder(setSpin: (update: (s: Spin) => Spin) => void) {
  let lastDx = 0;
  let lastDy = 0;
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      lastDx = 0;
      lastDy = 0;
    },
    onPanResponderMove: (_, g) => {
      const dx = g.dx - lastDx;
      const dy = g.dy - lastDy;
      lastDx = g.dx;
      lastDy = g.dy;
      setSpin(([lon, lat]) => [
        lon + dx * DRAG_DEGREES_PER_PIXEL,
        Math.max(-80, Math.min(80, lat - dy * DRAG_DEGREES_PER_PIXEL)),
      ]);
    },
    onPanResponderTerminationRequest: () => false,
  });
}

type Props = {
  timeMa: number;
  size: number;
};

// An orthographic (3D) view of Earth with the continents placed where they were at `timeMa`.
// By default it faces the land; dragging spins it, and the spin is kept as time changes.
export function Globe({ timeMa, size }: Props) {
  const [spin, setSpin] = useState<Spin>([0, 0]);

  const [pan] = useState(() => createSpinResponder(setSpin));

  // Recompute in steps of 0.1 million years; finer steps don't visibly move the continents.
  const step = Math.round(timeMa * 10) / 10;
  const rings = useMemo(() => reconstructCoastlines(step), [step]);
  const centre = useMemo(() => landCentre(rings), [rings]);

  const r = size / 2 - 6;
  const { land, grid } = useMemo(() => {
    const projection = geoOrthographic()
      .scale(r)
      .translate([size / 2, size / 2])
      .rotate([-centre[0] + spin[0], -centre[1] * 0.6 + spin[1]])
      .clipAngle(90)
      .precision(0.5);
    const path = geoPath(projection);
    return {
      land: path({ type: 'MultiPolygon', coordinates: rings.map((ring) => [ring]) }) ?? '',
      grid: path(GRATICULE) ?? '',
    };
  }, [rings, centre, spin, r, size]);

  const c = size / 2;

  return (
    <View
      {...pan.panHandlers}
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Globe showing Earth ${Math.round(timeMa)} million years ago. Drag to spin.`}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="ocean" cx="40%" cy="35%" r="70%">
            <Stop offset="0" stopColor="#3A7CA5" />
            <Stop offset="1" stopColor="#0B2A45" />
          </RadialGradient>
          <RadialGradient id="shade" cx="38%" cy="32%" r="72%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
            <Stop offset="0.55" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.55} />
          </RadialGradient>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0.88" stopColor="#7FB8FF" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#7FB8FF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={c} cy={c} r={size / 2} fill="url(#glow)" />
        <Circle cx={c} cy={c} r={r} fill="url(#ocean)" />
        <Path d={grid} stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={0.6} fill="none" />
        <Path d={land} fill="#9DBF7A" />
        <Circle cx={c} cy={c} r={r} fill="url(#shade)" />
      </Svg>
    </View>
  );
}
