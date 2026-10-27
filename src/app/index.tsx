import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimelineRow } from '@/components/timeline-row';
import { ERAS, OLDEST_MA, PERIODS } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';

export default function TimelineScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
      <Text style={[styles.intro, { color: palette.muted }]}>
        {OLDEST_MA} million years of life, from the Cambrian explosion to today. Tap a period to explore it.
      </Text>

      {ERAS.map((era) => {
        const periods = PERIODS.filter((p) => p.era === era.name);
        return (
          <View key={era.name} style={styles.era}>
            <Text style={[styles.eraName, { color: palette.text }]}>{era.name} Era</Text>
            <Text style={[styles.eraBlurb, { color: palette.muted }]}>{era.blurb}</Text>
            {periods.map((period, i) => (
              <TimelineRow
                key={period.id}
                period={period}
                isFirst={i === 0}
                isLast={i === periods.length - 1}
              />
            ))}
          </View>
        );
      })}

      <Text style={[styles.footnote, { color: palette.muted }]}>
        Ma = millions of years ago. Dates from the International Chronostratigraphic Chart (2023).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  intro: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 8,
  },
  era: {
    marginTop: 20,
  },
  eraName: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  eraBlurb: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  footnote: {
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
  },
});
