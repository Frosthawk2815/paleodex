import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeferredValue, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Globe } from '@/components/globe';
import { TimeBar } from '@/components/time-bar';
import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { extinctionAt } from '@/lib/extinctions';
import { contextAt, timeLabel } from '@/lib/time';

export default function GlobeScreen() {
  const insets = useSafeAreaInsets();
  const [timeMa, setTimeMa] = useState(0);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [focus, setFocus] = useState<{ id: string; n: number } | null>(null);
  // The globe can lag a frame behind the timeline so scrolling stays smooth.
  const globeTime = useDeferredValue(timeMa);
  const { period, series, stage } = contextAt(timeMa);
  const extinction = extinctionAt(timeMa);

  const onGlobeArea = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea({ width: Math.floor(width), height: Math.floor(height) });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 8 }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.app}>PaleoDex</Text>
        <Text style={styles.time} accessibilityLiveRegion="polite">
          {timeLabel(timeMa)}
        </Text>
        <Text style={styles.context} numberOfLines={1}>
          {period ? `${period.era} Era · ${period.name}` : ''}
        </Text>
        <Text style={styles.subContext} numberOfLines={1}>
          {[series?.name, stage?.name].filter(Boolean).join(' · ')}
        </Text>
        {extinction && (
          <View style={styles.event}>
            <ExtinctionIcon cause={extinction.cause} size={16} />
            <Text style={[styles.impact, { color: CAUSE_COLORS[extinction.cause] }]} numberOfLines={2}>
              {extinction.name} · {extinction.causeText}
            </Text>
          </View>
        )}
        {period && (
          <Link href={{ pathname: '/period/[id]', params: { id: period.id } }} style={styles.link}>
            About the {period.name} ›
          </Link>
        )}
      </View>

      <View style={styles.globeArea} onLayout={onGlobeArea}>
        {area.width > 0 && (
          <Globe timeMa={globeTime} width={area.width} height={area.height} focus={focus} />
        )}
      </View>

      <TimeBar onChange={setTimeMa} onSite={(e) => setFocus((f) => ({ id: e.id, n: (f?.n ?? 0) + 1 }))} />
      <Text style={styles.hint}>Slide or tap the timeline to travel in time · drag to spin · pinch to zoom</Text>
      <Text style={styles.credit}>
        Land and sea: Scotese & Wright (2018) PALEOMAP · Sea level: Spratt & Lisiecki (2016), Bintanja & van de Wal (2008)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070D',
    // Dragging the globe with a mouse shouldn't select the page's text on the web.
    userSelect: 'none',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 2,
  },
  app: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
  context: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
  },
  subContext: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  link: {
    color: '#9CC8FF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    paddingVertical: 4,
  },
  globeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 6,
    marginTop: 4,
  },
  impact: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  credit: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
