import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeferredValue, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Globe } from '@/components/globe';
import { TimeBar } from '@/components/time-bar';
import { contextAt, timeLabel } from '@/lib/time';

export default function GlobeScreen() {
  const insets = useSafeAreaInsets();
  const [timeMa, setTimeMa] = useState(0);
  const [globeSize, setGlobeSize] = useState(0);
  // The globe can lag a frame behind the timeline so scrolling stays smooth.
  const globeTime = useDeferredValue(timeMa);
  const { period, series, stage } = contextAt(timeMa);

  const onGlobeArea = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setGlobeSize(Math.floor(Math.min(width - 32, height - 16, 520)));
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
        {period && (
          <Link href={{ pathname: '/period/[id]', params: { id: period.id } }} style={styles.link}>
            About the {period.name} ›
          </Link>
        )}
      </View>

      <View style={styles.globeArea} onLayout={onGlobeArea}>
        {globeSize > 0 && <Globe timeMa={globeTime} size={globeSize} />}
      </View>

      <TimeBar onChange={setTimeMa} />
      <Text style={styles.hint}>Slide the timeline to travel in time · drag the globe to spin it</Text>
      <Text style={styles.credit}>Continents: Merdith et al. (2021) plate model</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070D',
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
    alignItems: 'center',
    justifyContent: 'center',
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
