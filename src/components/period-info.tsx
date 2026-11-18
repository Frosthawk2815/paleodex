import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { SeriesTimeline } from '@/components/series-timeline';
import { durationLabel, type Period, PERIODS, rangeLabel, textOn } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';
import { paperFont } from '@/lib/theme';
import { localTime, useLanguage, useT } from '@/lib/i18n';
import { localize } from '@/lib/content';

type Props = {
  period: Period;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
  backLabel?: string;
  // Open another period's page (the previous and next periods).
  onOpenPeriod: (id: string) => void;
  // Move the timeline and globe to the middle of a series or stage of this period.
  onSpan: (level: 'period' | 'series' | 'stage', startMa: number, endMa: number) => void;
};

// A geological period's page, shown under the globe like the other pages: what happened, its
// series and stages (tap one to travel to it), and how it ended.
export function PeriodInfo({ period: periodEn, onBack, onPrevious, previousLabel, backLabel, onOpenPeriod, onSpan }: Props) {
  const t = useT();
  const info = useInfoStyles();
  const palette = usePalette();
  const lang = useLanguage();
  const period = localize(lang, `period:${periodEn.id}`, periodEn);
  const index = PERIODS.findIndex((p) => p.id === periodEn.id);
  const prev = PERIODS[index - 1];
  const next = PERIODS[index + 1];
  const onColor = textOn(period.color);

  return (
    <View style={info.wrap}>
      <InfoNav onBack={onBack} onPrevious={onPrevious} previousLabel={previousLabel} backLabel={backLabel} />

      <Pressable
        onPress={() => onSpan('period', period.startMa, period.endMa)}
        accessibilityRole="button"
        accessibilityHint={t('Shows the middle of the {period} on the globe', { period: t(period.name) })}
        style={({ pressed }) => [styles.banner, { backgroundColor: period.color }, pressed && { opacity: 0.85 }]}>
        <Text style={[styles.era, { color: onColor }, paperFont(palette, 'heading')]}>{t('{era} Era', { era: t(period.era) })}</Text>
        <Text style={[styles.name, { color: onColor }, paperFont(palette, 'heading')]} accessibilityRole="header">
          {t(period.name)}
        </Text>
        <Text style={[styles.tagline, { color: onColor }, paperFont(palette, 'body')]}>{period.tagline}</Text>
      </Pressable>

      <View style={styles.stats}>
        <Stat label={t('When')} value={localTime(rangeLabel(period), t)} />
        <Stat label={period.endMa === 0 ? t('So far') : t('Lasted')} value={localTime(durationLabel(period), t)} />
      </View>

      <Text style={[styles.body, { color: palette.text }, paperFont(palette, 'body')]}>{period.summary}</Text>

      <SeriesTimeline period={period} onSpan={onSpan} />

      <Text style={[styles.heading, { color: palette.text }, paperFont(palette, 'heading')]}>{t('Life and events')}</Text>
      {period.highlights.map((h) => (
        <View key={h} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: period.color }]} />
          <Text style={[styles.body, styles.bulletText, { color: palette.text }, paperFont(palette, 'body')]}>{h}</Text>
        </View>
      ))}

      <Text style={[styles.heading, { color: palette.text }, paperFont(palette, 'heading')]}>
        {period.endMa === 0 ? t('Where it stands') : t('How it ended')}
      </Text>
      <Text style={[styles.body, { color: palette.text }, paperFont(palette, 'body')]}>{period.ending}</Text>

      <View style={styles.nav}>
        {prev ? <NavButton label={`← ${t(prev.name)}`} align="left" onPress={() => onOpenPeriod(prev.id)} /> : <View style={styles.navSpacer} />}
        {next ? <NavButton label={`${t(next.name)} →`} align="right" onPress={() => onOpenPeriod(next.id)} /> : <View style={styles.navSpacer} />}
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const palette = usePalette();
  return (
    <View style={[styles.stat, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.statLabel, { color: palette.muted }, paperFont(palette, 'bold')]}>{label}</Text>
      <Text style={[styles.statValue, { color: palette.text }, paperFont(palette, 'bold')]}>{value}</Text>
    </View>
  );
}

function NavButton({ label, align, onPress }: { label: string; align: 'left' | 'right'; onPress: () => void }) {
  const palette = usePalette();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.navPressable}>
      {({ pressed }) => (
        <View style={[styles.navButton, { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.6 : 1 }]}>
          <Text style={[styles.navText, { color: palette.text, textAlign: align }, paperFont(palette, 'bold')]}>{label}</Text>
        </View>
      )}
    </Pressable>
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
