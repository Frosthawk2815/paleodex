import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Platform, Pressable, type HostInstance, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { asteroidVisible } from '@/lib/impact';
import { EARTH_RADIUS_KM, MOON_DISTANCE_TODAY_KM, MOON_RADIUS_KM, moonDistanceKm } from '@/lib/moon';
import { geographyAt, landCentre, QUATERNARY_MA } from '@/lib/geography';
import { EXTINCTIONS, extinctionAt } from '@/lib/extinctions';
import { siteAt } from '@/lib/plates';
import { badgeBg, pointPosition, visiblePoints } from '@/lib/events';
import { EVENTS, type EventPoint, type HistoryEvent } from '@/data/events';
import { moonView } from '@/lib/moon-surface';
import { FLAG_FOOT, PointIconShape } from '@/components/point-icon';
import { EXTINCTION_DRIVERS, phaseCentre, phaseIndexAt, phasePolygons, rangeOf, visibleSkulls } from '@/lib/ranges';
import { speciesById } from '@/lib/life';
import { declutter, type Group } from '@/lib/declutter';

const GRATICULE = geoGraticule10();
// SVG text defaults to a serif font on the web; match the app's sans-serif.
const SVG_FONT = Platform.OS === 'web' ? 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' : undefined;
// 1 makes the surface follow the finger exactly; a little more feels livelier.
const DRAG_SPEED = 1.15;
// Momentum after a swipe: start above this speed (px/ms), lose speed each frame, stop below.
const SPIN_START_SPEED = 0.25;
const SPIN_MAX_SPEED = 4;
const SPIN_FRICTION = 0.95;
const SPIN_STOP_SPEED = 0.02;
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
// `setBaseRadius` tells it the globe's radius at zoom 1, so the surface follows the finger.
// Drag movement is applied once per frame, and a quick swipe leaves the globe spinning on its
// own, slowing down until it stops or is touched again.
function createCameraResponder(setCamera: (update: (c: Camera) => Camera) => void, onActive?: (active: boolean) => void) {
  let baseRadius = 150;
  let landCentre: [number, number] = [0, 0];
  let lastDx = 0;
  let lastDy = 0;
  let lastPinch = 0;
  let pinched = false;
  let pendingDx = 0;
  let pendingDy = 0;
  let frame = 0;
  let spin = 0;
  // Recent finger positions, for the release speed (not every platform reports it reliably).
  let samples: { t: number; x: number; y: number }[] = [];
  const releaseVelocity = () => {
    const now = Date.now();
    const recent = samples.filter((p) => now - p.t <= 100);
    if (recent.length < 2) return { vx: 0, vy: 0 };
    const a = recent[0];
    const b = recent[recent.length - 1];
    const dt = Math.max(1, b.t - a.t);
    return { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt };
  };

  const spinBy = (dx: number, dy: number) =>
    setCamera((c) => {
      if (c.view === 'moon') return c; // the Moon always shows its near side
      // Turning the opening view by hand fixes it in place, so moving the timeline no longer
      // re-centres it on the continents.
      if (c.anchor === 'land') c = { ...c, anchor: 'free', lon: c.lon - landCentre[0], lat: c.lat - landCentre[1] * 0.6 };
      const k = ((180 / Math.PI) * DRAG_SPEED) / Math.max(baseRadius * c.zoom, 40);
      return { ...c, lon: c.lon + dx * k, lat: Math.max(-85, Math.min(85, c.lat - dy * k)) };
    });
  const flush = () => {
    frame = 0;
    if (pendingDx || pendingDy) spinBy(pendingDx, pendingDy);
    pendingDx = 0;
    pendingDy = 0;
  };
  const stop = () => {
    if (spin) cancelAnimationFrame(spin);
    spin = 0;
  };
  // Keep turning at the release speed (pixels per millisecond), slowing by friction.
  const coast = (vx: number, vy: number) => {
    let last = Date.now();
    const step = () => {
      const now = Date.now();
      const dt = Math.min(50, now - last);
      last = now;
      spinBy(vx * dt, vy * dt);
      const decay = Math.pow(SPIN_FRICTION, dt / 16.7);
      vx *= decay;
      vy *= decay;
      spin = Math.hypot(vx, vy) > SPIN_STOP_SPEED ? requestAnimationFrame(step) : 0;
    };
    spin = requestAnimationFrame(step);
  };

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      stop();
      lastDx = 0;
      lastDy = 0;
      lastPinch = 0;
      pinched = false;
      samples = [];
      onActive?.(true);
    },
    onPanResponderRelease: () => {
      flush();
      onActive?.(false);
      const { vx, vy } = releaseVelocity();
      const speed = Math.hypot(vx, vy);
      if (!pinched && speed > SPIN_START_SPEED) {
        const scale = Math.min(1, SPIN_MAX_SPEED / speed);
        coast(vx * scale, vy * scale);
      }
    },
    onPanResponderTerminate: () => {
      flush();
      onActive?.(false);
    },
    onPanResponderMove: (evt, g) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length >= 2) {
        pinched = true;
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
      samples.push({ t: Date.now(), x: g.dx, y: g.dy });
      if (samples.length > 20) samples.shift();
      pendingDx += g.dx - lastDx;
      pendingDy += g.dy - lastDy;
      lastDx = g.dx;
      lastDy = g.dy;
      if (!frame) frame = requestAnimationFrame(flush);
    },
    onPanResponderTerminationRequest: () => false,
  });
  const setBaseRadius = (r: number) => {
    baseRadius = r;
  };
  const setLandCentre = (c: [number, number]) => {
    landCentre = c;
  };
  return { panHandlers: responder.panHandlers, stop, setBaseRadius, setLandCentre };
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

// The event point a camera anchor ('event:<id>:<index>') refers to. The camera keeps following
// it (moving with its plate) at any time, so moving the timeline stays over the same region even
// before or after the point itself is showing.
function anchoredPoint(anchor: string): EventPoint | undefined {
  if (!anchor.startsWith('event:')) return undefined;
  const [, id, index] = anchor.split(':');
  const point = EVENTS.find((e) => e.id === id)?.points[Number(index)];
  return point && point.body === 'earth' ? point : undefined;
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
  // Called when a skull marker (a species' last sighting) is tapped.
  onSelectSpecies?: (id: string) => void;
};

const K_PG = EXTINCTIONS.find((e) => e.cause === 'asteroid')!;

// A common name mid-sentence: lower-case first letter, except names named after people
// (Steller’s sea cow).
const inSentence = (name: string) => (/^[A-Z][a-z]*['’]s\b/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1));

export function Globe({ timeMa, width: w, height: h, focus, onSelectEvent, onDragging, rangeId, onClearRange, onSelectSpecies }: Props) {
  const [camera, setCamera] = useState<Camera>({ lon: 0, lat: 0, zoom: 1, anchor: 'land', view: 'earth', moonZoom: 1 });
  const [pan] = useState(() => createCameraResponder(setCamera, onDragging));
  // Stop any spin when the globe goes away.
  useEffect(() => pan.stop, [pan]);
  const [seenFocus, setSeenFocus] = useState(focus);
  // A group of overlapping markers the user tapped while fully zoomed in: pick one from a list.
  const [chooser, setChooser] = useState<Marker[] | null>(null);
  const container = useRef<HostInstance>(null);

  if (seenFocus !== focus) {
    setSeenFocus(focus);
    pan.stop(); // a jump elsewhere ends any spin
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
  useEffect(() => pan.setBaseRadius(baseR), [pan, baseR]);
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
  useEffect(() => pan.setLandCentre(centre), [pan, centre]);
  const showAsteroid = asteroidVisible(timeMa);
  const impactSite = useMemo(() => siteAt(K_PG.site!, step), [step]);
  // Keep facing a focused extinction site (moving with its plate) after jumping to it...
  const current = extinctionAt(timeMa);
  const anchorSite = EXTINCTIONS.find((e) => e.id === camera.anchor)?.site;
  // ...or an event point after jumping to it...
  const anchorPoint = anchoredPoint(camera.anchor);
  // ...or a fixed place (a species' last sighting or range). A view the user has turned by hand
  // ('free') stays put; only the opening view ('land') follows the continents as they move.
  const fixedAnchor = useMemo(() => (camera.anchor === 'free' ? ([0, 0] as [number, number]) : anchorLonLat(camera.anchor)), [camera.anchor]);
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
  // While a modern species' range is shown, rock formations and other species' extinction markers
  // are hidden so the range stands out (except for species that helped drive extinctions).
  const showingRange = !moonMode && !!range && !!rangeId;
  const markers: Marker[] = (moonMode ? visiblePoints('moon', timeMa) : earthR > 40 ? visiblePoints('earth', timeMa) : []).flatMap(
    (v) => {
      if (showingRange && v.event.kind === 'Rock formation') return [];
      if (moonMode) {
        const xy = moonSurface.project(v.point.lon, v.point.lat);
        return xy ? [{ ...v, xy }] : [];
      }
      const pos = pointPosition(v.point, step);
      const xy = projection(pos);
      const onScreen = xy && xy[0] > -40 && xy[0] < w + 40 && xy[1] > -60 && xy[1] < h + 40;
      return xy && onScreen && geoDistance(pos, centreLonLat) < Math.PI / 2 - 0.05 ? [{ ...v, xy }] : [];
    },
  );
  // Skull markers where the last of a species was seen alive, until that date.
  const skulls =
    !moonMode && earthR > 40
      ? visibleSkulls(timeMa, rangeId).flatMap(({ id, lastSeen }) => {
          if (showingRange && id !== rangeId && !EXTINCTION_DRIVERS.has(rangeId)) return [];
          const pos: [number, number] = [lastSeen.lon, lastSeen.lat];
          const xy = projection(pos);
          return xy && geoDistance(pos, centreLonLat) < Math.PI / 2 - 0.05
            ? [{ id, xy, name: speciesName(id), spot: `${lastSeen.lon.toFixed(1)},${lastSeen.lat.toFixed(1)}`, extra: 0, zoomTo: 0 }]
            : [];
        })
      : [];
  // Several species last seen at the same spot (usually the middle of a country) are stacked in
  // a column, one label per row.
  // A column only fits over the country when zoomed in; further out the column would reach other
  // continents, so the group shows as one marker ("+3") that zooms in when tapped.
  const ROW_PX = 58;
  for (const spot of new Set(skulls.map((sk) => sk.spot))) {
    const same = skulls.filter((o) => o.spot === spot);
    if (same.length < 2) continue;
    const fitsR = ((same.length - 1) * ROW_PX) / 0.3;
    if (earthR >= fitsR) {
      same.forEach((sk, k) => {
        sk.xy = [sk.xy[0] + (k % 2 === 0 ? -16 : 16), sk.xy[1] + (k - (same.length - 1) / 2) * ROW_PX];
      });
    } else {
      const lead = same.find((sk) => sk.id === rangeId) ?? same[0];
      lead.extra = same.length - 1;
      lead.zoomTo = (fitsR * 1.1) / baseR;
      for (const sk of same) if (sk !== lead) skulls.splice(skulls.indexOf(sk), 1);
    }
  }
  // Overlapping markers are grouped: the one the camera is following leads, then trackways and
  // events, then dig sites. Labels that would collide with one already drawn are hidden.
  const priority = (m: Marker) =>
    camera.anchor === `event:${m.event.id}:${m.index}` ? 0 : m.event.kind === 'Rock formation' ? 2 : 1;
  const groupLabel = (g: { lead: Marker; members: Marker[] }) =>
    g.members.length > 1 ? `${g.lead.point.label} +${g.members.length - 1}` : g.lead.point.label;
  // Icon areas relative to the spot: flags stand up and to the right of it, badges sit above it;
  // a count bubble adds a little to the top right.
  const iconArea = (g: { lead: Marker; members: Marker[] }) => {
    const flag = FLAG_FOOT[g.lead.point.icon ?? 'flag'] !== undefined;
    const r = flag ? { x0: -6, y0: -36, x1: 30, y1: 2 } : { x0: -18, y0: -40, x1: 18, y1: 3 };
    return g.members.length > 1 ? { ...r, x1: Math.max(r.x1, 27), y0: Math.min(r.y0, -46) } : r;
  };
  const sideGap = (g: { lead: Marker; members: Marker[] }) =>
    (FLAG_FOOT[g.lead.point.icon ?? 'flag'] !== undefined ? 30 : 20) + (g.members.length > 1 ? 9 : 0);
  const groups = declutter(markers, { xy: (m) => m.xy, priority, label: groupLabel, labelOffset: 6, radius: 46, icon: iconArea, sideGap,
    bounds: { x0: 2, y0: 0, x1: w - 2, y1: h },
    mustLabel: (g) => priority(g.lead) === 0,
  });
  // Tapping a group zooms in on it until its markers separate; when that can't help, list them.
  const openGroup = (g: Group<Marker>) => {
    if (g.members.length === 1) return onSelectEvent(g.lead.event, g.lead.index);
    const spread = Math.max(...g.members.map((m) => Math.hypot(m.xy[0] - g.xy[0], m.xy[1] - g.xy[1])));
    const canZoom = moonMode ? camera.moonZoom < MAX_MOON_ZOOM : zoom < MAX_ZOOM / 1.5;
    if (!canZoom || spread < 1) return setChooser(g.members);
    if (moonMode) setCamera((c) => ({ ...c, moonZoom: Math.min(MAX_MOON_ZOOM, c.moonZoom * 2) }));
    else setCamera({ lon: 0, lat: 0, zoom: clampZoom(zoom * 2.5), anchor: `event:${g.lead.event.id}:${g.lead.index}`, view: 'earth', moonZoom: 1 });
  };
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

          {groups.map((g) => {
            const { event, point, index } = g.lead;
            const xy = g.xy;
            const label = groupLabel(g);
            return (
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
                  <PointIconShape kind={point.icon!} x={xy[0]} y={xy[1] - 21} size={36} bg={badgeBg(event, point)} />
                </G>
              )}
              {g.members.length > 1 && (
                // How many markers are grouped here.
                <G>
                  <Circle cx={xy[0] + 17} cy={xy[1] - 36} r={9} fill="#FF7043" stroke="#FFFFFF" strokeWidth={1.5} />
                  <SvgText fontFamily={SVG_FONT} x={xy[0] + 17} y={xy[1] - 32} fill="#FFFFFF" fontSize={11} fontWeight="800" textAnchor="middle">
                    {g.members.length > 99 ? '99+' : String(g.members.length)}
                  </SvgText>
                </G>
              )}
              {g.showLabel && g.label && (
                <G>
                  <SvgText fontFamily={SVG_FONT} x={g.label.x} y={g.label.y} fill="#05070D" stroke="#05070D" strokeWidth={4} fontSize={13} fontWeight="700" textAnchor={g.label.anchor}>
                    {label}
                  </SvgText>
                  <SvgText fontFamily={SVG_FONT} x={g.label.x} y={g.label.y} fill="#FFFFFF" fontSize={13} fontWeight="700" textAnchor={g.label.anchor}>
                    {label}
                  </SvgText>
                </G>
              )}
            </G>
            );
          })}

          {skulls.map(({ id, xy, name, extra }) => (
            <G key={`skull-${id}`}>
              <Circle cx={xy[0]} cy={xy[1]} r={2.5} fill="#FFFFFF" />
              <PointIconShape kind="skull" x={xy[0]} y={xy[1] - 21} size={36} />
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 16} fill="#05070D" stroke="#05070D" strokeWidth={4} fontSize={12} fontWeight="700" textAnchor="middle">
                {`Last ${inSentence(name)}${extra ? ` +${extra}` : ''}`}
              </SvgText>
              <SvgText fontFamily={SVG_FONT} x={xy[0]} y={xy[1] + 16} fill="#FFFFFF" fontSize={12} fontWeight="700" textAnchor="middle">
                {`Last ${inSentence(name)}${extra ? ` +${extra}` : ''}`}
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
      {groups.map((g) => (
        <Pressable
          key={`${g.lead.event.id}-${g.lead.index}-hit`}
          onPress={() => openGroup(g)}
          accessibilityRole="button"
          accessibilityLabel={
            g.members.length > 1 ? `${g.lead.event.title} and ${g.members.length - 1} more here: zoom in` : `${g.lead.event.title}: read more`
          }
          style={[styles.hit, { left: g.xy[0] - 24, top: g.xy[1] - 30, width: 48, height: 60 }]}
        />
      ))}
      {chooser && (
        <View style={styles.chooser}>
          <View style={styles.chooserHead}>
            <Text style={styles.chooserTitle}>{chooser.length} places here</Text>
            <Pressable onPress={() => setChooser(null)} accessibilityRole="button" accessibilityLabel="Close the list" hitSlop={10}>
              <Text style={styles.rangeClose}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.chooserList}>
            {chooser.map((m) => (
              <Pressable
                key={`${m.event.id}-${m.index}-pick`}
                onPress={() => {
                  setChooser(null);
                  onSelectEvent(m.event, m.index);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${m.event.title}: read more`}
                style={({ pressed }) => [styles.chooserItem, pressed && { opacity: 0.6 }]}>
                <Text style={styles.chooserItemTitle}>{m.event.title}</Text>
                <Text style={styles.chooserItemSub}>{m.event.kind}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      {skulls.map(({ id, xy, name, extra, zoomTo }) => (
        <Pressable
          key={`skull-${id}-hit`}
          onPress={() =>
            extra
              ? setCamera({ lon: 0, lat: 0, zoom: zoomTo, anchor: `skull:${id}`, view: 'earth', moonZoom: 1 })
              : onSelectSpecies?.(id)
          }
          accessibilityRole="button"
          accessibilityLabel={
            extra
              ? `Where the last ${inSentence(name)} and ${extra} more were seen alive: zoom in`
              : `Where the last ${inSentence(name)} was seen alive: read more`
          }
          style={[styles.hit, { left: xy[0] - 22, top: xy[1] - 40, width: 44, height: 56 }]}
        />
      ))}
      {!moonMode && !!range && !!rangeId && (
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
  chooser: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    maxHeight: 260,
    borderRadius: 14,
    backgroundColor: 'rgba(10,14,24,0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 8,
  },
  chooserHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  chooserTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  chooserList: {
    paddingHorizontal: 8,
  },
  chooserItem: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chooserItemTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  chooserItemSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
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
