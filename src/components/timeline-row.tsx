import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { durationLabel, type Period, rangeLabel } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';

// Duration bars are scaled against the longest period (the Cretaceous).
const LONGEST_MY = 80;

type Props = {
  period: Period;
  isFirst: boolean;
  isLast: boolean;
};

export function TimelineRow({ period, isFirst, isLast }: Props) {
  const palette = usePalette();
  const durationMy = period.startMa - period.endMa;
  const barWidth = `${Math.max(2, Math.min(100, (durationMy / LONGEST_MY) * 100))}%` as const;

  return (
    <Link href={{ pathname: '/period/[id]', params: { id: period.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${period.name}, ${rangeLabel(period)}`}
        style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.row}>
          <View style={styles.rail}>
            <View
              style={[
                styles.stripe,
                { backgroundColor: period.color },
                isFirst && styles.stripeTop,
                isLast && styles.stripeBottom,
                period.informal && styles.stripeInformal,
              ]}
            />
            <View style={[styles.dot, { backgroundColor: period.color, borderColor: palette.background }]} />
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <View style={styles.titleLine}>
              <Text style={[styles.name, { color: palette.text }]}>{period.name}</Text>
              {period.informal && (
                <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>Informal</Text>
              )}
            </View>
            <Text style={[styles.tagline, { color: palette.muted }]}>{period.tagline}</Text>
            <Text style={[styles.meta, { color: palette.text }]}>
              {rangeLabel(period)} · {durationLabel(period)}
            </Text>
            <View style={[styles.track, { backgroundColor: palette.track }]}>
              <View style={[styles.bar, { width: barWidth, backgroundColor: period.color }]} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rail: {
    width: 28,
    alignItems: 'center',
  },
  stripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
  },
  stripeTop: {
    top: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  stripeBottom: {
    bottom: 24,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  stripeInformal: {
    opacity: 0.5,
  },
  dot: {
    marginTop: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  card: {
    flex: 1,
    marginLeft: 8,
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tagline: {
    fontSize: 14,
  },
  meta: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 2,
  },
});
