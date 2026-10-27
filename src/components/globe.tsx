import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Platform, Pressable, type HostInstance, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { asteroidVisible } from '@/lib/impact';
import { EARTH_RADIUS_KM, MOON_DISTANCE_TODAY_KM, MOON_RADIUS_KM, moonDistanceKm } from '@/lib/moon';
import { geographyAt, landCentre, QUATERNARY_MA } from '@/lib/geography';
import { chicxulubAt } from '@/lib/plates';

const GRATICULE = geoGraticule10();
const DRAG_DEGREES_PER_PIXEL = 0.4;
const MAX_ZOOM = 24; // roughly country scale
const MIN_EARTH_PX = 7; // Earth and Moon are drawn at least this big when zoomed far out
const MIN_MOON_PX = 3;

// lon/lat are spin offsets in degrees; zoom 1 fits the globe to the screen.
// `anchor` is what the globe faces: the continents, or the impact site after jumping to it.
type Camera = { lon: number; lat: number; zoom: number; anchor: 'land' | 'impact' };

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(0.001, z));

// Turns one-finger drags into spin and two-finger pinches into zoom.
function createCameraResponder(setCamera: (update: (c: Camera) => Camera) => void) {
  let lastDx = 0;
  let lastDy = 0;
  let lastPinch = 0;
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      lastDx = 0;
      lastDy = 0;
      lastPinch = 0;
    },
    onPanResponderMove: (evt, g) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length >= 2) {
        const d = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
        if (lastPinch > 0) {
          const factor = d / lastPinch;
          setCamera((c) => ({ ...c, zoom: clampZoom(c.zoom * factor) }));
        }
        lastPinch = d;
        lastDx = g.dx;
        lastDy = g.dy;
        return;
      }
      lastPinch = 0;
      const dx = g.dx - lastDx;
      const dy = g.dy - lastDy;
      lastDx = g.dx;
      lastDy = g.dy;
      setCamera((c) => {
        // Spin slower when zoomed in so the surface follows the finger.
        const k = DRAG_DEGREES_PER_PIXEL / Math.max(c.zoom, 0.3);
        return { ...c, lon: c.lon + dx * k, lat: Math.max(-85, Math.min(85, c.lat - dy * k)) };
      });
    },
    onPanResponderTerminationRequest: () => false,
  });
}

// A lumpy outline for the asteroid, as offsets from its centre (unit radius).
const ROCK = [
  [1, 0.05],
  [0.72, 0.62],
  [0.2, 0.92],
  [-0.42, 0.8],
  [-0.9, 0.38],
  [-0.95, -0.2],
  [-0.55, -0.78],
  [0.05, -0.95],
  [0.6, -0.7],
];

// Near-side maria (dark patches) as [x, y, rx, ry] in Moon radii.
const MARIA = [
  [-0.25, -0.35, 0.28, 0.24],
  [0.12, -0.3, 0.16, 0.15],
  [0.22, -0.05, 0.2, 0.17],
  [0.6, -0.2, 0.1, 0.09],
  [-0.5, 0.02, 0.3, 0.45],
  [-0.1, 0.38, 0.15, 0.12],
  [0.45, 0.15, 0.13, 0.15],
];

const fmtKm = (km: number) => Math.round(km).toLocaleString('en-US');

function rockPath(x: number, y: number, size: number): string {
  return ROCK.map(([rx, ry], i) => `${i === 0 ? 'M' : 'L'} ${x + rx * size} ${y + ry * size}`).join(' ') + ' Z';
}

type Props = {
  timeMa: number;
  width: number;
  height: number;
  // Changes each time the timeline's impact marker is tapped; the globe then turns to Yucatán.
  focusImpact: number;
};

export function Globe({ timeMa, width: w, height: h, focusImpact }: Props) {
  const [camera, setCamera] = useState<Camera>({ lon: 0, lat: 0, zoom: 1, anchor: 'land' });
  const [pan] = useState(() => createCameraResponder(setCamera));
  const [seenFocus, setSeenFocus] = useState(focusImpact);
  const container = useRef<HostInstance>(null);

  if (seenFocus !== focusImpact) {
    setSeenFocus(focusImpact);
    setCamera({ lon: 0, lat: 0, zoom: 6, anchor: 'impact' });
  }

  // Mouse wheel / trackpad zoom on the web.
  useEffect(() => {
    if (Platform.OS !== 'web' || !container.current) return;
    const el = container.current as unknown as HTMLElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCamera((c) => ({ ...c, zoom: clampZoom(c.zoom * Math.exp(-e.deltaY * 0.0015)) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Scale: rPx is the true Earth radius in pixels; zoom 1 fits the globe to the view.
  // The furthest zoom fits today's Earth–Moon distance across the view.
  const baseR = Math.min(w, h) / 2 - 8;
  const minZoom = (w - 70) / (MOON_DISTANCE_TODAY_KM / EARTH_RADIUS_KM) / baseR;
  if (camera.zoom < minZoom) setCamera((c) => ({ ...c, zoom: minZoom }));
  const zoom = Math.max(minZoom, camera.zoom);
  const rPx = baseR * zoom;
  const earthR = Math.max(rPx, MIN_EARTH_PX);

  const moonKm = moonDistanceKm(timeMa);
  const moonDistPx = (moonKm / EARTH_RADIUS_KM) * rPx;
  const moonR = Math.max((MOON_RADIUS_KM / EARTH_RADIUS_KM) * rPx, MIN_MOON_PX);
  // As the Moon comes into view, slide Earth left so both fit on screen.
  const slide = Math.min(1, Math.max(0, (2 * w - moonDistPx) / w));
  const ex = w / 2 - (moonDistPx / 2) * slide;
  const ey = h / 2;
  const mx = ex + moonDistPx;
  const moonOnScreen = mx - moonR < w;

  // Recompute in steps of 0.1 million years (finer steps don't visibly move the continents),
  // or 1,000 years in the Quaternary, where sea level changes quickly.
  const step = timeMa > QUATERNARY_MA ? Math.round(timeMa * 10) / 10 : Math.round(timeMa * 1000) / 1000;
  const geo = useMemo(() => geographyAt(step), [step]);
  const centre = useMemo(() => landCentre(geo.land), [geo]);
  const showAsteroid = asteroidVisible(timeMa);
  const impactSite = useMemo(() => chicxulubAt(step), [step]);
  const anchor = camera.anchor === 'impact' && showAsteroid ? 'impact' : 'land';
  const rotLon = anchor === 'impact' ? -impactSite[0] + camera.lon : -centre[0] + camera.lon;
  const rotLat = anchor === 'impact' ? -impactSite[1] + camera.lat : -centre[1] * 0.6 + camera.lat;

  const { land, shelf, grid, projection } = useMemo(() => {
    const p = geoOrthographic()
      .scale(earthR)
      .translate([ex, ey])
      .rotate([rotLon, rotLat])
      .clipAngle(90)
      .clipExtent([
        [-2, -2],
        [w + 2, h + 2],
      ])
      .precision(zoom > 4 ? 0.2 : 0.5);
    const path = geoPath(p);
    return {
      land: path({ type: 'MultiPolygon', coordinates: geo.land }) ?? '',
      shelf: path({ type: 'MultiPolygon', coordinates: geo.shelf }) ?? '',
      grid: earthR > 40 ? (path(GRATICULE) ?? '') : '',
      projection: p,
    };
  }, [geo, earthR, ex, ey, rotLon, rotLat, w, h, zoom]);

  // The asteroid hangs just above the impact site, enlarged so it shows at country zoom.
  let asteroid: { x: number; y: number; size: number } | null = null;
  if (showAsteroid) {
    const facing = geoDistance(impactSite, [-rotLon, -rotLat]) < Math.PI / 2 - 0.05;
    const sp = projection(impactSite);
    if (facing && sp) {
      const lift = 1.06;
      asteroid = {
        x: ex + (sp[0] - ex) * lift,
        y: ey + (sp[1] - ey) * lift,
        size: Math.min(46, Math.max(7, earthR * 0.03)),
      };
    }
  }

  const kmAcross = (w / rPx) * EARTH_RADIUS_KM;
  const seaLevel = geo.seaLevel !== undefined ? `Sea level ${geo.seaLevel > 0 ? '+' : ''}${Math.round(geo.seaLevel)} m` : '';
  const scale = zoom > 1.5 ? `About ${fmtKm(Number(kmAcross.toPrecision(2)))} km across` : '';
  const readout = moonOnScreen
    ? `Earth–Moon: ${fmtKm(moonKm)} km (today ${fmtKm(MOON_DISTANCE_TODAY_KM)} km)`
    : [seaLevel, scale].filter(Boolean).join(' · ');
  const enlarged = moonOnScreen && rPx < MIN_EARTH_PX * 1.5;

  const zoomBy = (f: number) => setCamera((c) => ({ ...c, zoom: clampZoom(Math.max(c.zoom, minZoom) * f) }));

  return (
    <View style={{ width: w, height: h }}>
      <View
        ref={container}
        {...pan.panHandlers}
        style={StyleSheet.absoluteFill}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Globe showing Earth ${Math.round(timeMa)} million years ago. Drag to spin, pinch to zoom.`}>
        <Svg width={w} height={h}>
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
            <RadialGradient id="moon" cx="40%" cy="35%" r="70%">
              <Stop offset="0" stopColor="#E4E4E2" />
              <Stop offset="1" stopColor="#8D8E8C" />
            </RadialGradient>
            <RadialGradient id="rock" cx="35%" cy="30%" r="75%">
              <Stop offset="0" stopColor="#A08C78" />
              <Stop offset="1" stopColor="#3E3329" />
            </RadialGradient>
            <RadialGradient id="fire" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFB347" stopOpacity={0.8} />
              <Stop offset="1" stopColor="#FF5E1A" stopOpacity={0} />
            </RadialGradient>
            {asteroid && (
              <LinearGradient
                id="trail"
                gradientUnits="userSpaceOnUse"
                x1={asteroid.x}
                y1={asteroid.y}
                x2={asteroid.x + asteroid.size * 5}
                y2={asteroid.y - asteroid.size * 5}>
                <Stop offset="0" stopColor="#FFD27A" stopOpacity={0.9} />
                <Stop offset="1" stopColor="#FF5E1A" stopOpacity={0} />
              </LinearGradient>
            )}
          </Defs>

          {moonOnScreen && (
            <Circle cx={ex} cy={ey} r={moonDistPx} stroke="#FFFFFF" strokeOpacity={0.12} strokeDasharray="3 6" fill="none" />
          )}

          <Circle cx={ex} cy={ey} r={earthR + 6} fill="url(#glow)" />
          <Circle cx={ex} cy={ey} r={earthR} fill="url(#ocean)" />
          {grid !== '' && <Path d={grid} stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={0.6} fill="none" />}
          {/* Outlines in the fill colour hide hairline gaps between neighbouring plate fragments. */}
          <Path d={shelf} fill="#2F6F9A" stroke="#2F6F9A" strokeWidth={zoom > 2 ? 2 : 0.8} strokeLinejoin="round" />
          <Path d={land} fill="#9DBF7A" stroke="#9DBF7A" strokeWidth={zoom > 2 ? 2.5 : 0.8} strokeLinejoin="round" />
          <Circle cx={ex} cy={ey} r={earthR} fill="url(#shade)" />

          {asteroid && (
            <G>
              <Path
                d={`M ${asteroid.x - asteroid.size * 0.6} ${asteroid.y - asteroid.size * 0.6} L ${asteroid.x + asteroid.size * 5} ${asteroid.y - asteroid.size * 5} L ${asteroid.x + asteroid.size * 0.6} ${asteroid.y + asteroid.size * 0.6} Z`}
                fill="url(#trail)"
              />
              <Circle cx={asteroid.x} cy={asteroid.y} r={asteroid.size * 1.8} fill="url(#fire)" />
              <Path d={rockPath(asteroid.x, asteroid.y, asteroid.size)} fill="url(#rock)" stroke="#241C15" strokeWidth={1} />
            </G>
          )}

          {moonOnScreen && (
            <G>
              <Circle cx={mx} cy={ey} r={moonR} fill="url(#moon)" />
              {moonR > 6 &&
                MARIA.map(([x, y, rx, ry], i) => (
                  <Ellipse key={i} cx={mx + x * moonR} cy={ey + y * moonR} rx={rx * moonR} ry={ry * moonR} fill="#5E6166" opacity={0.45} />
                ))}
              <Line x1={ex + earthR + 4} y1={ey} x2={mx - moonR - 4} y2={ey} stroke="#FFFFFF" strokeOpacity={0.35} strokeDasharray="2 4" />
              <SvgText x={(ex + mx) / 2} y={ey - 10} fill="#FFFFFF" fillOpacity={0.8} fontSize={12} textAnchor="middle">
                {`${fmtKm(moonKm)} km`}
              </SvgText>
              <SvgText x={mx} y={ey + moonR + 16} fill="#FFFFFF" fillOpacity={0.7} fontSize={12} textAnchor="middle">
                Moon
              </SvgText>
              <SvgText x={ex} y={ey + earthR + 16} fill="#FFFFFF" fillOpacity={0.7} fontSize={12} textAnchor="middle">
                Earth
              </SvgText>
            </G>
          )}
        </Svg>
      </View>

      <View style={styles.controls}>
        <ZoomButton label="+" a11y="Zoom in" onPress={() => zoomBy(2)} />
        <ZoomButton label="−" a11y="Zoom out" onPress={() => zoomBy(0.5)} />
        <ZoomButton label="☾" a11y="Zoom out to the Earth and Moon" onPress={() => setCamera((c) => ({ ...c, zoom: minZoom }))} />
      </View>

      {readout !== '' && (
        <View pointerEvents="none" style={styles.readout}>
          <Text style={styles.readoutText}>{readout}</Text>
          {enlarged && <Text style={styles.readoutNote}>Earth and Moon enlarged · distance to scale</Text>}
          {moonOnScreen && <Text style={styles.readoutNote}>Moon moves away about 3.8 cm a year</Text>}
        </View>
      )}
    </View>
  );
}

function ZoomButton({ label, a11y, onPress }: { label: string; a11y: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    right: 12,
    top: 8,
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  readout: {
    position: 'absolute',
    left: 12,
    bottom: 6,
    right: 64,
  },
  readoutText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  readoutNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
});
