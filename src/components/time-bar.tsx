import { useCallback, useRef, useState } from 'react';
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

import { OLDEST_MA, PERIODS, textOn } from '@/data/periods';
import { SERIES_BY_PERIOD } from '@/data/subdivisions';
import { IMPACT_MA } from '@/lib/impact';
import { ERA_SPANS } from '@/lib/time';

const PX_PER_MY = 6;
const TOTAL_WIDTH = OLDEST_MA * PX_PER_MY;
const TICK_EVERY_MY = 50;
const ERA_LABEL_SPACING = 320;

const SERIES = PERIODS.flatMap((p) => SERIES_BY_PERIOD[p.id] ?? []);
const STAGES = SERIES.flatMap((s) => s.stages);

const x = (ma: number) => (OLDEST_MA - ma) * PX_PER_MY;
const width = (start: number, end: number) => (start - end) * PX_PER_MY;

type Props = {
  onChange: (timeMa: number) => void;
  // Called when the K/T impact marker is tapped.
  onImpact: () => void;
};

// A horizontal strip of geological time, oldest on the left. Whatever sits under the
// centre marker is the selected time. It starts scrolled to the present day.
export function TimeBar({ onChange, onImpact }: Props) {
  const scroll = useRef<ScrollViewInstance>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const positioned = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => setViewWidth(e.nativeEvent.layout.width);

  const onContentSizeChange = () => {
    if (!positioned.current && viewWidth > 0) {
      positioned.current = true;
      scroll.current?.scrollTo({ x: TOTAL_WIDTH, animated: false });
    }
  };

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      onChange(Math.min(OLDEST_MA, Math.max(0, OLDEST_MA - offset / PX_PER_MY)));
    },
    [onChange],
  );

  const jumpTo = (ma: number) => scroll.current?.scrollTo({ x: x(ma), animated: true });

  const ticks: number[] = [];
  for (let t = Math.floor(OLDEST_MA / TICK_EVERY_MY) * TICK_EVERY_MY; t > 0; t -= TICK_EVERY_MY) ticks.push(t);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {viewWidth > 0 && (
        <ScrollView
          ref={scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={{ width: TOTAL_WIDTH + viewWidth, paddingHorizontal: viewWidth / 2 }}>
          <View style={styles.track}>
            <View style={styles.eraRow}>
              {ERA_SPANS.map((era) => {
                const w = width(era.startMa, era.endMa);
                // Repeat the label along long eras so one is always on screen.
                const labels = Math.max(1, Math.floor(w / ERA_LABEL_SPACING));
                return (
                  <View
                    key={era.name}
                    style={[styles.block, styles.eraBlock, { left: x(era.startMa), width: w, backgroundColor: era.color }]}>
                    {Array.from({ length: labels }, (_, i) => (
                      <Text key={i} style={[styles.eraText, { color: textOn(era.color) }]} numberOfLines={1}>
                        {era.name}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>

            <View style={styles.periodRow}>
              {PERIODS.map((p) => {
                const w = width(p.startMa, p.endMa);
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => jumpTo((p.startMa + p.endMa) / 2)}
                    accessibilityRole="button"
                    accessibilityLabel={`Jump to the ${p.name}`}
                    style={[styles.block, styles.periodBlock, { left: x(p.startMa), width: w, backgroundColor: p.color }]}>
                    {w > p.name.length * 7 + 8 && (
                      <Text style={[styles.periodText, { color: textOn(p.color) }]} numberOfLines={1}>
                        {p.name}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.seriesRow}>
              {SERIES.map((s) => (
                <View
                  key={`${s.name}-${s.startMa}`}
                  style={[styles.block, styles.thinBlock, { left: x(s.startMa), width: width(s.startMa, s.endMa), backgroundColor: s.color }]}
                />
              ))}
            </View>

            <View style={styles.stageRow}>
              {STAGES.map((s) => (
                <View
                  key={`${s.name}-${s.startMa}`}
                  style={[styles.block, styles.thinBlock, { left: x(s.startMa), width: width(s.startMa, s.endMa), backgroundColor: s.color }]}
                />
              ))}
            </View>

            <View style={styles.tickRow}>
              {ticks.map((t) => (
                <Text key={t} style={[styles.tick, { left: x(t) - 30 }]}>
                  {t} Ma
                </Text>
              ))}
              <Text style={[styles.tick, { left: x(0) - 30 }]}>Today</Text>
              <Pressable
                onPress={() => {
                  // Land just before the boundary so the asteroid is still in the sky.
                  jumpTo(IMPACT_MA + 0.3);
                  onImpact();
                }}
                accessibilityRole="button"
                accessibilityLabel="Jump to the Chicxulub asteroid impact"
                hitSlop={8}
                style={[styles.impactMarker, { left: x(IMPACT_MA) - 34 }]}>
                <Text style={styles.impactText}>☄ K/T</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
      <View pointerEvents="none" style={[styles.marker, { left: viewWidth / 2 - 1 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 104,
    justifyContent: 'center',
  },
  track: {
    width: TOTAL_WIDTH,
    height: 96,
  },
  block: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  eraRow: {
    height: 18,
  },
  eraBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  eraText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  periodRow: {
    height: 30,
    marginTop: 2,
  },
  periodBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.25)',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
  },
  seriesRow: {
    height: 10,
    marginTop: 2,
  },
  stageRow: {
    height: 8,
    marginTop: 2,
  },
  thinBlock: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(0,0,0,0.3)',
  },
  tickRow: {
    height: 20,
    marginTop: 4,
  },
  tick: {
    position: 'absolute',
    width: 60,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  impactMarker: {
    position: 'absolute',
    width: 68,
    alignItems: 'center',
  },
  impactText: {
    color: '#FFB347',
    fontSize: 11,
    fontWeight: '700',
  },
  marker: {
    position: 'absolute',
    top: 0,
    height: 80,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});
