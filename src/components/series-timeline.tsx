import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ANTHROPOCENE, type Period, spanDuration, spanRange } from '@/data/periods';
import { type Series, SERIES_BY_PERIOD, type Stage } from '@/data/subdivisions';
import { type Palette, usePalette } from '@/hooks/use-palette';

type Segment = { key: string; color: string; weight: number; faded?: boolean };

// A thin bar split into coloured segments sized by how long each one lasted.
function ProportionBar({ segments, height }: { segments: Segment[]; height: number }) {
  // Flex weights below 1 in total don't fill the row, so scale them to percentages.
  const total = segments.reduce((sum, s) => sum + s.weight, 0) || 1;
  return (
    <View style={[styles.bar, { height, borderRadius: height / 2 }]}>
      {segments.map((s) => (
        <View
          key={s.key}
          style={{ flexGrow: (s.weight / total) * 100, flexBasis: 0, minWidth: 3, backgroundColor: s.color, opacity: s.faded ? 0.5 : 1 }}
        />
      ))}
    </View>
  );
}

export function SeriesTimeline({ period }: { period: Period }) {
  const palette = usePalette();
  const series = SERIES_BY_PERIOD[period.id] ?? [];
  const [open, setOpen] = useState<Set<string>>(new Set());
  const showAnthropocene = period.id === 'quaternary';

  if (series.length === 0) return null;

  const toggle = (name: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const segments: Segment[] = series.map((s) => ({ key: s.name, color: s.color, weight: s.startMa - s.endMa }));
  if (showAnthropocene) segments.push({ key: ANTHROPOCENE.name, color: ANTHROPOCENE.color, weight: 0, faded: true });

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: palette.text }]}>Series and stages</Text>
      <Text style={[styles.hint, { color: palette.muted }]}>
        The {period.name} is divided into {series.length} series
        {showAnthropocene ? ', plus the informal Anthropocene' : ''}. Tap one to see its stages.
      </Text>

      <ProportionBar segments={segments} height={10} />

      <View style={styles.list}>
        {series.map((s, i) => (
          <View key={s.name}>
            {s.group && s.group !== series[i - 1]?.group && (
              <Text style={[styles.group, { color: palette.muted }]}>{s.group} sub-period</Text>
            )}
            <SeriesRow series={s} expanded={open.has(s.name)} onToggle={() => toggle(s.name)} palette={palette} />
          </View>
        ))}
        {showAnthropocene && (
          <AnthropoceneRow
            expanded={open.has(ANTHROPOCENE.name)}
            onToggle={() => toggle(ANTHROPOCENE.name)}
            palette={palette}
          />
        )}
      </View>
    </View>
  );
}

function SeriesRow({
  series,
  expanded,
  onToggle,
  palette,
}: {
  series: Series;
  expanded: boolean;
  onToggle: () => void;
  palette: Palette;
}) {
  const hasStages = series.stages.length > 0;
  const stageCount = series.stages.length === 1 ? '1 stage' : `${series.stages.length} stages`;

  return (
    <View style={styles.row}>
      <View style={[styles.rail, { backgroundColor: series.color }]} />
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Pressable
          disabled={!hasStages}
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityState={{ expanded, disabled: !hasStages }}
          accessibilityLabel={`${series.name}, ${spanRange(series.startMa, series.endMa)}, ${hasStages ? stageCount : 'no stages'}`}>
          {({ pressed }) => (
            <View style={[styles.cardHeader, pressed && styles.pressed]}>
              <View style={styles.cardText}>
                <Text style={[styles.name, { color: palette.text }]}>{series.name}</Text>
                <Text style={[styles.meta, { color: palette.muted }]}>
                  {spanRange(series.startMa, series.endMa)} · {spanDuration(series.startMa, series.endMa)}
                </Text>
                <Text style={[styles.meta, { color: palette.muted }]}>
                  {hasStages ? stageCount : 'Not divided into stages'}
                </Text>
              </View>
              {hasStages && <Text style={[styles.chevron, { color: palette.muted }]}>{expanded ? '−' : '+'}</Text>}
            </View>
          )}
        </Pressable>

        {expanded && hasStages && <StageTimeline stages={series.stages} palette={palette} />}
      </View>
    </View>
  );
}

function StageTimeline({ stages, palette }: { stages: Stage[]; palette: Palette }) {
  return (
    <View style={[styles.stages, { borderTopColor: palette.border }]}>
      <ProportionBar
        segments={stages.map((s) => ({ key: s.name, color: s.color, weight: s.startMa - s.endMa }))}
        height={6}
      />
      {stages.map((s) => (
        <View key={s.name} style={styles.stageRow}>
          <View style={[styles.stageRail, { backgroundColor: s.color }]} />
          <View style={styles.stageText}>
            <Text style={[styles.stageName, { color: palette.text }]}>{s.name}</Text>
            <Text style={[styles.stageMeta, { color: palette.muted }]}>
              {spanRange(s.startMa, s.endMa)} · {spanDuration(s.startMa, s.endMa)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function AnthropoceneRow({
  expanded,
  onToggle,
  palette,
}: {
  expanded: boolean;
  onToggle: () => void;
  palette: Palette;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rail, styles.railInformal, { backgroundColor: ANTHROPOCENE.color }]} />
      <View style={[styles.card, styles.cardInformal, { borderColor: palette.muted }]}>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${ANTHROPOCENE.name}, informal series, ${ANTHROPOCENE.rangeLabel}`}>
          {({ pressed }) => (
            <View style={[styles.cardHeader, pressed && styles.pressed]}>
              <View style={styles.cardText}>
                <View style={styles.titleLine}>
                  <Text style={[styles.name, { color: palette.text }]}>{ANTHROPOCENE.name}</Text>
                  <Text style={[styles.badge, { color: palette.muted, borderColor: palette.border }]}>Informal</Text>
                </View>
                <Text style={[styles.meta, { color: palette.muted }]}>
                  {ANTHROPOCENE.rangeLabel} · {ANTHROPOCENE.durationLabel}
                </Text>
                <Text style={[styles.meta, { color: palette.muted }]}>Proposed, not on the official chart</Text>
              </View>
              <Text style={[styles.chevron, { color: palette.muted }]}>{expanded ? '−' : '+'}</Text>
            </View>
          )}
        </Pressable>

        {expanded && (
          <View style={[styles.stages, { borderTopColor: palette.border }]}>
            <Text style={[styles.note, { color: palette.text }]}>{ANTHROPOCENE.note}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginTop: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
  },
  bar: {
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 1,
  },
  list: {
    marginTop: 4,
  },
  group: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rail: {
    width: 6,
    borderRadius: 3,
    marginVertical: 2,
  },
  railInformal: {
    opacity: 0.5,
  },
  card: {
    flex: 1,
    marginLeft: 10,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  cardInformal: {
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderRadius: 6,
  },
  meta: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  chevron: {
    fontSize: 22,
    fontWeight: '400',
    width: 20,
    textAlign: 'center',
  },
  stages: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 6,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  stageRail: {
    width: 4,
    borderRadius: 2,
  },
  stageText: {
    flex: 1,
    paddingVertical: 2,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '600',
  },
  stageMeta: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
  },
});
