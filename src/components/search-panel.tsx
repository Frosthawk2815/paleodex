import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { EVENTS, type HistoryEvent } from '@/data/events';
import { type Extinction, EXTINCTIONS } from '@/lib/extinctions';
import { type Unit, UNITS_BY_LEVEL } from '@/lib/time';

export type SearchResult =
  | { kind: 'event'; event: HistoryEvent }
  | { kind: 'extinction'; extinction: Extinction }
  | { kind: 'unit'; unit: Unit };

type Item = { key: string; title: string; subtitle: string; words: string; result: SearchResult };

const LEVEL_NAMES = { all: '', era: 'Era', period: 'Period', series: 'Series', stage: 'Stage' };

// Extra words people might search for.
const EXTINCTION_WORDS: Record<string, string> = {
  'end-permian': 'great dying siberian traps',
  'k-pg': 'dinosaurs asteroid chicxulub k/t kt cretaceous paleogene',
  'end-triassic': 'camp central atlantic',
  kellwasser: 'frasnian famennian devonian',
  hangenberg: 'devonian carboniferous',
  'end-ordovician': 'ice age glaciation hirnantian',
};

const fmtMa = (ma: number) => (ma >= 1 ? `${Number(ma.toPrecision(5))} Ma` : `${Math.round(ma * 1_000_000).toLocaleString('en-US')} years ago`);

const ITEMS: Item[] = [
  ...EVENTS.map((e) => ({
    key: `event:${e.id}`,
    title: e.title,
    subtitle: `Event · ${e.dateText}`,
    words: [e.title, ...e.keywords].join(' ').toLowerCase(),
    result: { kind: 'event' as const, event: e },
  })),
  ...EXTINCTIONS.map((e) => ({
    key: `extinction:${e.id}`,
    title: e.name,
    subtitle: `Mass extinction · ${fmtMa(e.ma)} · ${e.causeText}`,
    words: [e.name, e.short, e.causeText, 'mass extinction', EXTINCTION_WORDS[e.id] ?? ''].join(' ').toLowerCase(),
    result: { kind: 'extinction' as const, extinction: e },
  })),
  ...(['era', 'period', 'series', 'stage'] as const).flatMap((level) =>
    UNITS_BY_LEVEL[level].map((u) => ({
      key: u.key,
      title: u.name,
      subtitle: `${LEVEL_NAMES[level]} · ${fmtMa(u.startMa)} – ${u.endMa === 0 ? 'today' : fmtMa(u.endMa)}`,
      words: u.name.toLowerCase(),
      result: { kind: 'unit' as const, unit: u },
    })),
  ),
];

function search(query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return ITEMS.filter((i) => i.result.kind !== 'unit');
  const starts = ITEMS.filter((i) => i.title.toLowerCase().startsWith(q));
  const contains = ITEMS.filter((i) => !starts.includes(i) && i.words.includes(q));
  return [...starts, ...contains].slice(0, 30);
}

type Props = {
  onSelect: (r: SearchResult) => void;
  onClose: () => void;
};

// Search for events, mass extinctions and units of geological time.
export function SearchPanel({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => search(query), [query]);

  return (
    <View style={styles.panel}>
      <View style={styles.bar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search events, extinctions, periods…"
          placeholderTextColor="rgba(255,255,255,0.45)"
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => results[0] && onSelect(results[0].result)}
          style={styles.input}
          accessibilityLabel="Search"
        />
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close search" hitSlop={8} style={styles.close}>
          <Text style={styles.closeText}>Cancel</Text>
        </Pressable>
      </View>
      <FlatList
        data={results}
        keyExtractor={(i) => i.key}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>Nothing found for “{query}”.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect(item.result)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <View style={styles.icon}>
              {item.result.kind === 'extinction' ? (
                <ExtinctionIcon cause={item.result.extinction.cause} size={18} />
              ) : (
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: item.result.kind === 'unit' ? item.result.unit.color : CAUSE_COLORS.sun },
                  ]}
                />
              )}
            </View>
            <View style={styles.rowText}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  close: {
    paddingVertical: 8,
  },
  closeText: {
    color: '#9CC8FF',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  icon: {
    width: 22,
    alignItems: 'center',
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  rowText: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
  empty: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    padding: 16,
  },
});
