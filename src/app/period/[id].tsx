import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { durationLabel, getPeriod, PERIODS, rangeLabel, textOn } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';

export default function PeriodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const period = getPeriod(id);

  if (!period) {
    return (
      <View style={[styles.center, { backgroundColor: palette.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={{ color: palette.text }}>That period doesn’t exist.</Text>
      </View>
    );
  }

  const index = PERIODS.indexOf(period);
  const prev = PERIODS[index - 1];
  const next = PERIODS[index + 1];
  const onColor = textOn(period.color);

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
      <Stack.Screen options={{ title: period.name }} />

      <View style={[styles.banner, { backgroundColor: period.color }]}>
        <Text style={[styles.era, { color: onColor }]}>
          {period.era} Era{period.informal ? ' · Informal' : ''}
        </Text>
        <Text style={[styles.name, { color: onColor }]}>{period.name}</Text>
        <Text style={[styles.tagline, { color: onColor }]}>{period.tagline}</Text>
      </View>

      <View style={styles.stats}>
        <Stat label="When" value={rangeLabel(period)} />
        <Stat label={period.endMa === 0 ? 'So far' : 'Lasted'} value={durationLabel(period)} />
      </View>

      <Text style={[styles.body, { color: palette.text }]}>{period.summary}</Text>

      <Text style={[styles.heading, { color: palette.text }]}>Life and events</Text>
      {period.highlights.map((h) => (
        <View key={h} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: period.color }]} />
          <Text style={[styles.body, styles.bulletText, { color: palette.text }]}>{h}</Text>
        </View>
      ))}

      <Text style={[styles.heading, { color: palette.text }]}>
        {period.endMa === 0 ? 'Where it stands' : 'How it ended'}
      </Text>
      <Text style={[styles.body, { color: palette.text }]}>{period.ending}</Text>

      <View style={styles.nav}>
        {prev ? <NavLink id={prev.id} label={`← ${prev.name}`} align="left" /> : <View style={styles.navSpacer} />}
        {next ? <NavLink id={next.id} label={`${next.name} →`} align="right" /> : <View style={styles.navSpacer} />}
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const palette = usePalette();
  return (
    <View style={[styles.stat, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.statLabel, { color: palette.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
    </View>
  );
}

function NavLink({ id, label, align }: { id: string; label: string; align: 'left' | 'right' }) {
  const palette = usePalette();
  return (
    <Link href={{ pathname: '/period/[id]', params: { id } }} replace asChild>
      <Pressable accessibilityRole="link" style={styles.navPressable}>
        {({ pressed }) => (
          <View
            style={[
              styles.navButton,
              { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.6 : 1 },
            ]}>
            <Text style={[styles.navText, { color: palette.text, textAlign: align }]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 16,
    gap: 12,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    gap: 4,
  },
  era: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  navPressable: {
    flex: 1,
  },
  navButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  navSpacer: {
    flex: 1,
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
