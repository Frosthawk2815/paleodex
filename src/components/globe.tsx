import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Platform, Pressable, type HostInstance, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { asteroidVisible } from '@/lib/impact';
import { EARTH_RADIUS_KM, MOON_DISTANCE_TODAY_KM, MOON_RADIUS_KM, moonDistanceKm } from '@/lib/moon';
import { geographyAt, landCentre, QUATERNARY_MA } from '@/lib/geography';
import { EXTINCTIONS, extinctionAt } from '@/lib/extinctions';
import { siteAt } from '@/lib/plates';
import { pointPosition, pointVisible, visiblePoints } from '@/lib/events';
import { EVENTS, type EventPoint, type HistoryEvent } from '@/data/events';
import { moonView } from '@/lib/moon-surface';
import { FLAG_FOOT, PointIconShape } from '@/components/point-icon';
import { phaseCentre, phaseIndexAt, phasePolygons, rangeOf, visibleSkulls } from '@/lib/ranges';
import { speciesById } from '@/lib/life';

const GRATICULE = geoGraticule10();
// SVG text defaults to a serif font on the web; match the app's sans-serif.
const SVG_FONT = Platform.OS === 'web' ? 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' : undefined;
const DRAG_DEGREES_PER_PIXEL = 0.4;
const MAX_ZOOM = 24; // roughly country scale
const MIN_EARTH_PX = 7; // Earth and Moon are drawn at least this big when zoomed far out
const MIN_MOON_PX = 3;

// lon/lat are spin offsets in degrees; zoom 1 fits the globe to the screen.
// `anchor` is what the globe faces: the continents, or an extinction's site (by id) after jumping to it.
// `view` 'moon' shows the Moon close up (zoom 1 fits it to the screen as `moonZoom`).
type Camera = { lon: number; lat: number; zoom: number; anchor: string; view: 'earth' | 'moon'; moonZoom: number };

const MAX_MOON_ZOOM = 4;

// Zooming the Moon view out past its fit size goes back to the Earth–Moon view.
function zoomCamera(c: Camera, factor: number): Camera {
  if (c.view === 'moon') {
    const moonZoom = c.moonZoom * factor;
    if (moonZoom < 0.85) return { ...c, view: 'earth', zoom: 0.001 };
    return { ...c, moonZoom: Math.min(MAX_MOON_ZOOM, moonZoom) };
  }
  return { ...c, zoom: clampZoom(c.zoom * factor) };
}

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(0.001, z));

// Turns one-finger drags into spin and two-finger pinches into zoom.
// `onActive` reports when a drag starts and ends, so a page around the globe can stop scrolling.
function createCameraResponder(setCamera: (update: (c: Camera) => Camera) => void, onActive?: (active: boolean) => void) {
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
      onActive?.(true);
    },
    onPanResponderRelease: () => onActive?.(false),
    onPanResponderTerminate: () => onActive?.(false),
    onPanResponderMove: (evt, g) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length >= 2) {
        const d = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
        if (lastPinch > 0) {
          const factor = d / lastPinch;
          setCamera((c) => zoomCamera(c, factor));
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
        if (c.view === 'moon') return c; // the Moon always shows its near side
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

type Marker = { event: HistoryEvent; point: EventPoint; index: number; xy: [number, number] };

// Rock formations get a different marker colour from other events.
const markerColor = (e: HistoryEvent) => (e.kind === 'Rock formation' ? '#FF9EC7' : '#FFD54A');

// The event point a camera anchor ('event:<id>:<index>') refers to, if it's showing at `timeMa`.
function anchoredPoint(anchor: string, timeMa: number): EventPoint | undefined {
  if (!anchor.startsWith('event:')) return undefined;
  const [, id, index] = anchor.split(':');
  const point = EVENTS.find((e) => e.id === id)?.points[Number(index)];
  return point && point.body === 'earth' && pointVisible(point, timeMa) ? point : undefined;
}

// A fixed place a camera anchor refers to: a last sighting ('skull:<species>') or the middle of
// a range phase ('range:<species>:<phase>').
function anchorLonLat(anchor: string): [number, number] | undefined {
  const [kind, id, index] = anchor.split(':');
  const r = kind === 'skull' || kind === 'range' ? rangeOf(id) : undefined;
  if (!r) return undefined;
  if (kind === 'skull') return r.lastSeen ? [r.lastSeen.lon, r.lastSeen.lat] : undefined;
  const phase = r.phases[Number(index)];
  return phase ? phaseCentre(phase) : undefined;
}

const speciesName = (id: string) => {
  const s = speciesById(id);
  return s?.common ?? s?.name ?? id;
};

const fmtKm = (km: number) => Math.round(km).toLocaleString('en-US');

function rockPath(x: number, y: number, size: number): string {
  return ROCK.map(([rx, ry], i) => `${i === 0 ? 'M' : 'L'} ${x + rx * size} ${y + ry * size}`).join(' ') + ' Z';
}

type Props = {
  timeMa: number;
  width: number;
  height: number;
  // Set each time something asks the globe to look at a place: an extinction's site, or the
  // Moon for an event there.
  // For 'event', `index` is which of the event's points to look at.
  // 'skull' looks at where a species was last seen; 'range' at one phase (`index`) of its range.
  focus: { kind: 'site' | 'moon' | 'event' | 'skull' | 'range'; id: string; index?: number; n: number } | null;
  // Called when an event's marker is tapped (with the index of the point tapped).
  onSelectEvent: (e: HistoryEvent, index: number) => void;
  // Called when a drag on the globe starts (true) and ends (false). Must be a stable function.
  onDragging?: (active: boolean) => void;
  // A species whose range is drawn over the map, and a way to hide it.
  rangeId?: string;
  onClearRange?: () => void;
  // Called when a skull flag (a species' last sighting) is tapped.
  onSelectSpecies?: (id: string) => void;
};

const K_PG = EXTINCTIONS.find((e) => e.cause === 'asteroid')!;

export function Globe({ timeMa, width: w, height: h, focus, onSelectEvent, onDragging, rangeId, onClearRange, onSelectSpecies }: Props) {
  const [camera, setCamera] = useState<Camera>({ lon: 0, lat: 0, zoom: 1, anchor: 'land', view: 'earth', moonZoom: 1 });
  const [pan] = useState(() => createCameraResponder(setCamera, onDragging));
  const [seenFocus, setSeenFocus] = useState(focus);
  const container = useRef<HostInstance>(null);

  if (seenFocus !== focus) {
    setSeenFocus(focus);
    const point = focus?.kind === 'event' ? EVENTS.find((e) => e.id === focus.id)?.points[focus.index ?? 0] : undefined;
    if (focus?.kind === 'moon' || point?.body === 'moon') {
      setCamera((c) => ({ ...c, view: 'moon', moonZoom: 1.3 }));
    } else if (focus && point) {
      setCamera({ lon: 0, lat: 0, zoom: point.zoom ?? 4, anchor: `event:${focus.id}:${focus.index ?? 0}`, view: 'earth', moonZoom: 1 });
    } else if (focus?.kind === 'skull' || focus?.kind === 'range') {
      const anchor = focus.kind === 'skull' ? `skull:${focus.id}` : `range:${focus.id}:${focus.index ?? 0}`;
      if (anchorLonLat(anchor)) setCamera({ lon: 0, lat: 0, zoom: focus.kind === 'skull' ? 3 : 1.4, anchor, view: 'earth', moonZoom: 1 });
    } else {
      const site = EXTINCTIONS.find((e) => e.id === focus?.id)?.site;
      if (focus && site) setCamera({ lon: 0, lat: 0, zoom: site.zoom, anchor: focus.id, view: 'earth', moonZoom: 1 });
    }
  }

  // Mouse wheel / trackpad zoom on the web.
  useEffect(() => {
    if (Platform.OS !== 'web' || !container.current) return;
    const el = container.current as unknown as HTMLElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCamera((c) => zoomCamera(c, Math.exp(-e.deltaY * 0.0015)));
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
  const impactSite = useMemo(() => siteAt(K_PG.site!, step), [step]);
  // Keep facing a focused site while the timeline is still at its event.
  const current = extinctionAt(timeMa);
  const anchorSite = current?.site && camera.anchor === current.id ? current.site : undefined;
  // ...or an event point after jumping to it, while that point is showing.
  const anchorPoint = anchoredPoint(camera.anchor, timeMa);
  // ...or a fixed place (a species' last sighting or range).
  const fixedAnchor = useMemo(() => anchorLonLat(camera.anchor), [camera.anchor]);
  const anchorPos = anchorSite ? siteAt(anchorSite, step) : anchorPoint ? pointPosition(anchorPoint, step) : fixedAnchor;

  // The selected species' range at this time.
  const range = rangeId ? rangeOf(rangeId) : undefined;
  const phaseIndex = range ? phaseIndexAt(range, timeMa) : -1;
  const phase = range && phaseIndex >= 0 ? range.phases[phaseIndex] : undefined;
  const rotLon = anchorPos ? -anchorPos[0] + camera.lon : -centre[0] + camera.lon;
  const rotLat = anchorPos ? -anchorPos[1] + camera.lat : -centre[1] * 0.6 + camera.lat;

  const { land, shelf, grid, rangeD, projection } = useMemo(() => {
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
      rangeD: phase ? (path({ type: 'MultiPolygon', coordinates: phasePolygons(phase) }) ?? '') : '',
      projection: p,
    };
  }, [geo, earthR, ex, ey, rotLon, rotLat, w, h, zoom, phase]);

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

  // Label the place tied to the current extinction (other than the asteroid, which is drawn).
  let siteLabel: { x: number; y: number; name: string } | null = null;
  if (current?.site && current.cause !== 'asteroid' && earthR > 60) {
    const pos = siteAt(current.site, step);
    const sp = projection(pos);
    if (sp && geoDistance(pos, [-rotLon, -rotLat]) < Math.PI / 2 - 0.05) siteLabel = { x: sp[0], y: sp[1], name: current.site.name };
  }

  const zoomBy = (f: number) => setCamera((c) => zoomCamera(c.view === 'moon' ? c : { ...c, zoom: Math.max(c.zoom, minZoom) }, f));

  // Moon close-up: the near side, with markers for events there.
  const moonMode = camera.view === 'moon';
  const bigMoonR = (Math.min(w, h) / 2 - 24) * camera.moonZoom;
  const moonCx = moonMode ? w / 2 : mx;
  const moonCy = moonMode ? h / 2 : ey;
  const moonDrawR = moonMode ? bigMoonR : moonR;
  const moonSurface = useMemo(() => moonView(moonCx, moonCy, moonDrawR), [moonCx, moonCy, moonDrawR]);
  // Event markers: on the Moon in the close-up, otherwise on Earth (when it's big enough).
  const centreLonLat: [number, number] = [-rotLon, -rotLat];
  const markers: Marker[] = (moonMode ? visiblePoints('moon', timeMa) : earthR > 40 ? visiblePoints('earth', timeMa) : []).flatMap(
    (v) => {
      if (moonMode) {
        const xy = moonSurface.project(v.point.lon, v.point.lat);
        return xy ? [{ ...v, xy }] : [];
      }
      const pos = pointPosition(v.point, step);
      const xy = projection(pos);
      return xy && geoDistance(pos, centreLonLat) < Math.PI / 2 - 0.05 ? [{ ...v, xy }] : [];
    },
  );
  // Skull flags where the last of a species was seen alive, until that date.
  const skulls =
    !moonMode && earthR > 40
      ? visibleSkulls(timeMa, rangeId).flatMap(({ id, lastSeen }) => {
          const pos: [number, number] = [lastSeen.lon, lastSeen.lat];
          const xy = projection(pos);
          return xy && geoDistance(pos, centreLonLat) < Math.PI / 2 - 0.05
            ? [{ id, xy, name: speciesName(id), country: lastSeen.country }]
            : [];
        })
      : [];
  // Several species last seen in the same country are stacked in a column, one label per row,
  // rather than on top of each other.
  for (const sk of skulls) {
    const same = skulls.filter((o) => o.country === sk.country);
    const k = same.indexOf(sk);
    if (same.length > 1) sk.xy = [sk.xy[0] + (k % 2 === 0 ? -16 : 16), sk.xy[1] + (k - (same.length - 1) / 2) * 58];
  }
  const moonReadout = `Moon · ${fmtKm(moonKm)} km from Earth`;
  // In the Earth–Moon view, tapping the Moon opens the close-up.
  const moonHit = !moonMode && moonOnScreen ? Math.max(44, moonR * 2 + 16) : 0;

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

          {!moonMode && moonOnScreen && (
            <Circle cx={ex} cy={ey} r={moonDistPx} stroke="#FFFFFF" strokeOpacity={0.12} strokeDasharray="3 6" fill="none" />
          )}

          {!moonMode && (
          <G>
          <Circle cx={ex} cy={ey} r={earthR + 6} fill="url(#glow)" />
          <Circle cx={ex} cy={ey} r={earthR} fill="url(#ocean)" />
          {grid !== '' && <Path d={grid} stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={0.6} fill="none" />}
          {/* Outlines in the fill colour hide hairline gaps between neighbouring plate fragments. */}
          <Path d={shelf} fill="#2F6F9A" stroke="#2F6F9A" strokeWidth={zoom > 2 ? 2 : 0.8} strokeLinejoin="round" />
          <Path d={land} fill="#9DBF7A" stroke="#9DBF7A" strokeWidth={zoom > 2 ? 2.5 : 0.8} strokeLinejoin="round" />
          {rangeD !== '' && (
            <Path d={rangeD} fill="#FF7043" fillOpacity={0.45} stroke="#FFCCBC" strokeWidth={1.2} strokeLinejoin="round" />
          )}
          <Circle cx={ex} cy={ey} r={earthR} fill="url(#shade)" />

          {siteLabel && (
            <G>
              <Circle cx={siteLabel.x} cy={siteLabel.y} r={14} fill="#FF7043" opacity={0.25} />
              <Circle cx={siteLabel.x} cy={siteLabel.y} r={5} fill="#FF7043" stroke="#FFFFFF" strokeWidth={1.5} />
              {/* A dark copy underneath keeps the label readable over land or sea. */}
              <SvgText fontFamily={SVG_FONT} x={siteLabel.x} y={siteLabel.y - 20} fill="#05070D" stroke="#05070D" strokeWidth={4} fontSize={13} fontWeight="700" textAnchor="middle">
                {siteLabel.name}
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={siteLabel.x} y={siteLabel.y - 20} fill="#FFFFFF" fontSize={13} fontWeight="700" textAnchor="middle">
                {siteLabel.name}
              </SvgText>
            </G>
          )}

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
          </G>
          )}

          {(moonMode || moonOnScreen) && (
            <G>
              <Circle cx={moonCx} cy={moonCy} r={moonDrawR} fill="url(#moon)" />
              {moonDrawR > 6 && <Path d={moonSurface.maria} fill="#5E6166" opacity={0.5} />}
              {moonDrawR > 6 && <Circle cx={moonCx} cy={moonCy} r={moonDrawR} fill="url(#shade)" />}
            </G>
          )}

          {markers.map(({ event, point, index, xy }) => (
            <G key={`${event.id}-${index}`}>
              {FLAG_FOOT[point.icon ?? 'flag'] ? (
                // Flags stand with the foot of the pole on the spot.
                <PointIconShape
                  kind={point.icon ?? 'flag'}
                  x={xy[0] + (12 - FLAG_FOOT[point.icon ?? 'flag']![0]) * 1.5}
                  y={xy[1] - (FLAG_FOOT[point.icon ?? 'flag']![1] - 12) * 1.5}
                  size={36}
                  color={markerColor(event)}
                />
              ) : (
                <G>
                  <Circle cx={xy[0]} cy={xy[1]} r={2.5} fill="#FFFFFF" />
                  <PointIconShape kind={point.icon!} x={xy[0]} y={xy[1] - 21} size={36} />
                </G>
              )}
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 18} fill="#05070D" stroke="#05070D" strokeWidth={4} fontSize={13} fontWeight="700" textAnchor="middle">
                {point.label}
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 18} fill="#FFFFFF" fontSize={13} fontWeight="700" textAnchor="middle">
                {point.label}
              </SvgText>
            </G>
          ))}

          {skulls.map(({ id, xy, name }) => (
            <G key={`skull-${id}`}>
              <PointIconShape kind="skull" x={xy[0] + (12 - 7) * 1.5} y={xy[1] - (22 - 12) * 1.5} size={36} />
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 16} fill="#05070D" stroke="#05070D" strokeWidth={4} fontSize={12} fontWeight="700" textAnchor="middle">
                {`Last ${name.toLowerCase()}`}
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 16} fill="#FFFFFF" fontSize={12} fontWeight="700" textAnchor="middle">
                {`Last ${name.toLowerCase()}`}
              </SvgText>
            </G>
          ))}

          {!moonMode && moonOnScreen && (
            <G>
              <Line x1={ex + earthR + 4} y1={ey} x2={mx - moonR - 4} y2={ey} stroke="#FFFFFF" strokeOpacity={0.35} strokeDasharray="2 4" />
              <SvgText fontFamily={SVG_FONT} x={(ex + mx) / 2} y={ey - 10} fill="#FFFFFF" fillOpacity={0.8} fontSize={12} textAnchor="middle">
                {`${fmtKm(moonKm)} km`}
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={mx} y={ey + moonR + 16} fill="#FFFFFF" fillOpacity={0.7} fontSize={12} textAnchor="middle">
                Moon
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={ex} y={ey + earthR + 16} fill="#FFFFFF" fillOpacity={0.7} fontSize={12} textAnchor="middle">
                Earth
              </SvgText>
            </G>
          )}
        </Svg>
      </View>

      {moonHit > 0 && (
        <Pressable
          onPress={() => setCamera((c) => ({ ...c, view: 'moon', moonZoom: 1 }))}
          accessibilityRole="button"
          accessibilityLabel="Look at the Moon close up"
          style={[styles.hit, { left: mx - moonHit / 2, top: ey - moonHit / 2, width: moonHit, height: moonHit }]}
        />
      )}
      {markers.map(({ event, index, xy }) => (
        <Pressable
          key={`${event.id}-${index}-hit`}
          onPress={() => onSelectEvent(event, index)}
          accessibilityRole="button"
          accessibilityLabel={`${event.title}: read more`}
          style={[styles.hit, { left: xy[0] - 24, top: xy[1] - 30, width: 48, height: 60 }]}
        />
      ))}
      {skulls.map(({ id, xy, name }) => (
        <Pressable
          key={`skull-${id}-hit`}
          onPress={() => onSelectSpecies?.(id)}
          accessibilityRole="button"
          accessibilityLabel={`Where the last ${name.toLowerCase()} was seen alive: read more`}
          style={[styles.hit, { left: xy[0] - 12, top: xy[1] - 34, width: 44, height: 56 }]}
        />
      ))}
      {!moonMode && range && rangeId && (
        <View style={styles.rangeChip}>
          <View style={styles.rangeSwatch} />
          <Text style={styles.rangeText} numberOfLines={2}>
            <Text style={styles.rangeName}>{speciesName(rangeId)}</Text>
            {phase ? ` · ${phase.label}` : ' · not alive at this time'}
          </Text>
          <Pressable onPress={onClearRange} accessibilityRole="button" accessibilityLabel="Hide the range" hitSlop={10}>
            <Text style={styles.rangeClose}>✕</Text>
          </Pressable>
        </View>
      )}
      {moonMode && (
        <Pressable
          onPress={() => setCamera((c) => ({ ...c, view: 'earth', zoom: 0.001 }))}
          accessibilityRole="button"
          accessibilityLabel="Back to the Earth and Moon"
          style={({ pressed }) => [styles.back, pressed && styles.buttonPressed]}>
          <Text style={styles.backText}>‹ Earth</Text>
        </Pressable>
      )}

      <View style={styles.controls}>
        <ZoomButton label="+" a11y="Zoom in" onPress={() => zoomBy(2)} />
        <ZoomButton label="−" a11y="Zoom out" onPress={() => zoomBy(0.5)} />
        <ZoomButton label="☾" a11y="Zoom out to the Earth and Moon" onPress={() => setCamera((c) => ({ ...c, view: 'earth', zoom: minZoom }))} />
      </View>

      {moonMode ? (
        <View pointerEvents="none" style={styles.readout}>
          <Text style={styles.readoutText}>{moonReadout}</Text>
          <Text style={styles.readoutNote}>Near side, as seen from Earth</Text>
          {markers.length > 0 && <Text style={styles.readoutNote}>Tap a marker to read about it</Text>}
        </View>
      ) : (
        readout !== '' && (
          <View pointerEvents="none" style={styles.readout}>
            <Text style={styles.readoutText}>{readout}</Text>
            {enlarged && <Text style={styles.readoutNote}>Earth and Moon enlarged · distance to scale</Text>}
            {moonOnScreen && <Text style={styles.readoutNote}>Tap the Moon to look closer</Text>}
          </View>
        )
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
  hit: {
    position: 'absolute',
  },
  back: {
    position: 'absolute',
    left: 12,
    top: 8,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  rangeChip: {
    position: 'absolute',
    left: 12,
    top: 8,
    right: 64,
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(5,7,13,0.75)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,204,188,0.5)',
  },
  rangeSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: 'rgba(255,112,67,0.8)',
  },
  rangeText: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  rangeName: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rangeClose: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
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
