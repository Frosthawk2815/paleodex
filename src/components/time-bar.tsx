import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { textOn } from '@/data/periods';
import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { EVENT_LEAD_MA, EXTINCTIONS, type Extinction } from '@/lib/extinctions';
import { ALL_TIME, ancestors, type Level, stepLevel, stepUnits, type Unit, unitAt, UNITS_BY_LEVEL } from '@/lib/time';

const ALL_TIME_PX_PER_MY = 6;
const ROWS: { level: Level; height: number; fontSize: number }[] = [
  { level: 'era', height: 18, fontSize: 11 },
  { level: 'period', height: 26, fontSize: 12 },
  { level: 'series', height: 20, fontSize: 11 },
  { level: 'stage', height: 18, fontSize: 10 },
];
const ROW_GAP = 2;
const TRACK_HEIGHT = ROWS.reduce((h, r) => h + r.height + ROW_GAP, 0);

// Picks a tick spacing (1, 2 or 5 × a power of ten) so ticks sit about `targetPx` apart.
function tickStep(pxPerMy: number, targetPx = 90): number {
  const raw = targetPx / pxPerMy;
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw) return m * pow;
  return 10 * pow;
}

function tickLabel(ma: number): string {
  if (ma === 0) return 'Today';
  const trim = (n: number) => String(Number(n.toPrecision(6)));
  if (ma >= 1) return `${trim(ma)} Ma`;
  if (ma >= 0.001) return `${trim(ma * 1000)} ka`;
  return `${Math.round(ma * 1_000_000)} yr`;
}

type Props = {
  onChange: (timeMa: number) => void;
  // Called when a marker for an extinction with a site (e.g. Chicxulub) is tapped.
  onSite: (e: Extinction) => void;
};

// A horizontal strip of geological time, oldest on the left; whatever sits under the centre
// marker is the selected time. Tapping an era, period, series or stage zooms the strip to just
// that unit. The arrows step to the next or previous unit one level down, and the middle
// button zooms back out to all of time without moving the marker.
export function TimeBar({ onChange, onSite }: Props) {
  const scroll = useRef<ScrollViewInstance>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const [focus, setFocus] = useState<Unit>(ALL_TIME);
  const time = useRef(0);
  // The scroll offset we last moved to ourselves; scroll events there keep the exact time.
  const ownOffset = useRef<number | null>(null);
  // Where to put the marker once the strip has re-laid out for a new zoom.
  const pending = useRef<number | null>(0);

  const pxPerMy = focus === ALL_TIME ? ALL_TIME_PX_PER_MY : viewWidth / (focus.startMa - focus.endMa);
  const trackWidth = (focus.startMa - focus.endMa) * pxPerMy;
  const x = useCallback((ma: number) => (focus.startMa - ma) * pxPerMy, [focus, pxPerMy]);

  const scrollToTime = useCallback(
    (t: number, animated: boolean) => {
      ownOffset.current = x(t);
      scroll.current?.scrollTo({ x: x(t), animated });
    },
    [x],
  );

  // After a zoom change, move to the pending time once the new layout is in place.
  useEffect(() => {
    if (pending.current === null || viewWidth === 0) return;
    const t = pending.current;
    const id = requestAnimationFrame(() => {
      scrollToTime(t, false);
      requestAnimationFrame(() => {
        pending.current = null;
        time.current = t;
        onChange(t);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [focus, viewWidth, scrollToTime, onChange]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pending.current !== null) return; // ignore scroll events while re-zooming
      const offset = e.nativeEvent.contentOffset.x;
      // At coarse zoom a pixel can be ~170,000 years; don't let rounding move a time we set exactly.
      if (ownOffset.current !== null && Math.abs(offset - ownOffset.current) < 1.5) return;
      ownOffset.current = null;
      const t = Math.min(focus.startMa, Math.max(focus.endMa, focus.startMa - offset / pxPerMy));
      time.current = t;
      onChange(t);
    },
    [focus, pxPerMy, onChange],
  );

  // Show `t`, zooming to `nextFocus` first if that changes the view.
  const go = (t: number, nextFocus: Unit) => {
    if (nextFocus === focus) {
      time.current = t;
      scrollToTime(t, true);
    } else {
      pending.current = t;
      setFocus(nextFocus);
    }
  };

  const zoomInto = (u: Unit) => {
    const inside = time.current <= u.startMa && time.current >= u.endMa;
    go(inside ? time.current : u.startMa - (u.startMa - u.endMa) * 0.001, u);
  };

  // Step to the next (+1) or previous (-1) unit one level below the current zoom.
  const step = (dir: 1 | -1) => {
    const level = stepLevel(focus);
    const units = stepUnits(level);
    const t = time.current;
    const current = unitAt(level, t) ?? (dir > 0 ? units[0] : units[units.length - 1]);
    const i = units.indexOf(current);
    const nearStart = current.startMa - t < (current.startMa - current.endMa) * 0.01;
    // Back goes to the start of the current unit first, then to the previous one.
    const target = dir > 0 ? units[i + 1] : nearStart ? units[i - 1] : current;
    if (!target) return;
    const tt = target.startMa - (target.startMa - target.endMa) * 0.001;
    // Keep the zoom at the same depth: move it to the unit around the target.
    let nextFocus = focus;
    if (focus !== ALL_TIME && (tt > focus.startMa || tt < focus.endMa)) {
      nextFocus = target.level === focus.level ? target : (target.parent ?? focus);
    }
    go(tt, nextFocus);
  };

  const resetZoom = () => go(time.current, ALL_TIME);

  // Land just before the boundary, still in the period the extinction ended.
  const jumpToExtinction = (e: Extinction) => {
    const t = e.ma + EVENT_LEAD_MA;
    const inside = t <= focus.startMa && t >= focus.endMa;
    go(t, inside ? focus : (unitAt(focus.level, t) ?? ALL_TIME));
    if (e.site) onSite(e);
  };

  const visible = (u: Unit) => u.startMa > focus.endMa && u.endMa < focus.startMa;

  const step0 = tickStep(pxPerMy);
  const ticks: number[] = [];
  for (let t = Math.ceil(focus.endMa / step0) * step0; t <= focus.startMa + 1e-9; t += step0) ticks.push(Number(t.toPrecision(12)));
  const markers = EXTINCTIONS.filter((e) => e.ma <= focus.startMa && e.ma >= focus.endMa);
  const crumbs = ancestors(focus);

  return (
    <View onLayout={(e: LayoutChangeEvent) => setViewWidth(e.nativeEvent.layout.width)}>
      <View style={styles.controls}>
        <ArrowButton direction="left" label="Previous" onPress={() => step(-1)} />
        <ArrowButton direction="reset" label="Zoom timeline out to all of time" onPress={resetZoom} disabled={focus === ALL_TIME} />
        <View style={styles.crumbs}>
          <Text style={styles.crumbText} numberOfLines={1} ellipsizeMode="head">
            {crumbs.map((c, i) => (
              <Text key={c.key}>
                {i > 0 && <Text style={styles.crumbSep}> › </Text>}
                <Text
                  onPress={() => go(time.current, c)}
                  style={c === focus ? styles.crumbCurrent : styles.crumbLink}
                  accessibilityRole="button"
                  accessibilityLabel={`Zoom timeline to ${c.name}`}>
                  {c.name}
                </Text>
              </Text>
            ))}
          </Text>
        </View>
        <ArrowButton direction="right" label="Next" onPress={() => step(1)} />
      </View>

      <View style={styles.barWrap}>
        {viewWidth > 0 && (
          <ScrollView
            ref={scroll}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ width: trackWidth + viewWidth, paddingHorizontal: viewWidth / 2 }}>
            <View style={{ width: trackWidth, height: TRACK_HEIGHT + 30 }}>
              {ROWS.map((row) => (
                <View key={row.level} style={{ height: row.height, marginBottom: ROW_GAP }}>
                  {UNITS_BY_LEVEL[row.level].filter(visible).map((u) => {
                    const left = x(Math.min(u.startMa, focus.startMa));
                    const w = x(Math.max(u.endMa, focus.endMa)) - left;
                    const fits = w > u.name.length * row.fontSize * 0.62 + 8;
                    return (
                      <Pressable
                        key={u.key}
                        onPress={() => zoomInto(u)}
                        accessibilityRole="button"
                        accessibilityLabel={`Zoom timeline to the ${u.name}`}
                        style={[styles.block, { left, width: Math.max(w, 0.5), backgroundColor: u.color }]}>
                        {fits && (
                          <Text style={[styles.blockText, { fontSize: row.fontSize, color: textOn(u.color) }]} numberOfLines={1}>
                            {row.level === 'era' ? u.name.toUpperCase() : u.name}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}

              <View style={styles.tickRow}>
                {ticks.map((t) => (
                  <Text key={t} style={[styles.tick, { left: x(t) - 35 }]}>
                    {tickLabel(t)}
                  </Text>
                ))}
                {markers.map((e) => (
                  <Pressable
                    key={e.id}
                    onPress={() => jumpToExtinction(e)}
                    accessibilityRole="button"
                    accessibilityLabel={`Jump to the ${e.name}: ${e.causeText}`}
                    hitSlop={6}
                    style={[styles.eventMarker, { left: x(e.ma) - 30 }]}>
                    <ExtinctionIcon cause={e.cause} />
                    <Text style={[styles.eventText, { color: CAUSE_COLORS[e.cause] }]}>{e.short}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
        <View pointerEvents="none" style={[styles.marker, { left: viewWidth / 2 - 1, height: TRACK_HEIGHT }]} />
      </View>
    </View>
  );
}

function ArrowButton({
  direction,
  label,
  onPress,
  disabled,
}: {
  direction: 'left' | 'right' | 'reset';
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  // Simple strokes drawn in a 24×24 box: chevrons, or a double-headed arrow pointing down.
  const d =
    direction === 'left'
      ? 'M15 5 L8 12 L15 19'
      : direction === 'right'
        ? 'M9 5 L16 12 L9 19'
        : 'M12 3 L12 21 M7 9 L12 14 L17 9 M7 15 L12 20 L17 15';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed, disabled && styles.arrowDisabled]}>
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path d={d} stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 6,
  },
  arrow: {
    width: 36,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  arrowPressed: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  crumbs: {
    flex: 1,
    alignItems: 'center',
  },
  crumbText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  crumbSep: {
    color: 'rgba(255,255,255,0.35)',
  },
  crumbLink: {
    color: '#9CC8FF',
  },
  crumbCurrent: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  barWrap: {
    height: TRACK_HEIGHT + 32,
  },
  block: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  blockText: {
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  tickRow: {
    height: 30,
  },
  tick: {
    position: 'absolute',
    width: 70,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  eventMarker: {
    position: 'absolute',
    top: 14,
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  eventText: {
    fontSize: 11,
    fontWeight: '700',
  },
  marker: {
    position: 'absolute',
    top: 0,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});
