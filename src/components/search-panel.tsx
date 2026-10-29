import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { EVENTS, type HistoryEvent } from '@/data/events';
import { type Extinction, EXTINCTIONS } from '@/lib/extinctions';
import { type Unit, UNITS_BY_LEVEL } from '@/lib/time';
import { type Clade, CLADES, SPECIES, type Species } from '@/data/life';
import { speciesInClade } from '@/lib/life';

export type SearchResult =
  | { kind: 'event'; event: HistoryEvent }
  | { kind: 'extinction'; extinction: Extinction }
  | { kind: 'unit'; unit: Unit }
  | { kind: 'species'; species: Species }
  | { kind: 'clade'; clade: Clade };

// `names`: what the thing is called (scientific, common and other everyday names, e.g. "raptors"
// for Dromaeosaurs, "Tasmanian tiger" for the thylacine); these rank above other mentions.
type Item = { key: string; title: string; subtitle: string; words: string; names?: string[]; result: SearchResult };

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
  // Species first, so "t rex" finds the animal before the places it's found.
  ...SPECIES.map((s) => ({
    key: `species:${s.id}`,
    title: s.name,
    subtitle: `Species${s.common ? ` · ${s.common}` : ''}${s.aka?.length ? ` · also ${s.aka.slice(0, 2).join(', ')}` : ''} · ${s.ageText.replace(/ \(.*\)$/, '')}`,
    words: [s.name, s.common ?? '', ...(s.aka ?? []), ...(s.keywords ?? [])].join(' ').toLowerCase(),
    names: [s.name, s.common ?? '', ...(s.aka ?? []), ...(s.akaSearch ?? [])].filter(Boolean),
    result: { kind: 'species' as const, species: s },
  })),
  ...CLADES.map((c) => ({
    key: `clade:${c.id}`,
    title: c.common,
    subtitle: `Group · ${c.name}${c.aka?.length ? ` · also called ${c.aka[0]}` : ''} · ${speciesInClade(c.id).length} species`,
    words: [c.common, c.name, ...(c.aka ?? [])].join(' ').toLowerCase(),
    names: [c.common, c.name, ...(c.aka ?? []), ...(c.akaSearch ?? [])],
    result: { kind: 'clade' as const, clade: c },
  })),
  ...EVENTS.map((e) => ({
    key: `event:${e.id}`,
    title: e.title,
    subtitle: `Event · ${e.dateText}`,
    words: [e.title, ...e.keywords, ...(e.invertebrates ?? []).map((n) => n.title)].join(' ').toLowerCase(),
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

// Punctuation-insensitive form, so "t rex", "t-rex" and "T. rex" all match.
const norm = (t: string) => t.toLowerCase().replace(/[.\-’'_]/g, ' ').replace(/\s+/g, ' ').trim();

// Normalised names and words for each item, worked out once.
const PREPARED = ITEMS.map((item, index) => ({ item, index, names: (item.names ?? [item.title]).map(norm), words: norm(item.words) }));

function search(query: string): Item[] {
  const q = norm(query);
  if (!q) return ITEMS.filter((i) => i.result.kind === 'event' || i.result.kind === 'extinction' || i.result.kind === 'clade');
  // Best first: a name that is exactly the query, a name that starts with it, a word that
  // starts with it, then any mention. Within a tier, the original order (species first) holds.
  const wordStart = new RegExp(`(^|\\s)${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  const rank = ({ names, words }: (typeof PREPARED)[number]) => {
    if (names.some((n) => n === q)) return 0;
    if (names.some((n) => n.startsWith(q))) return 1;
    if (wordStart.test(words)) return 2;
    if (words.includes(q)) return 3;
    return -1;
  };
  return PREPARED.map((p) => ({ item: p.item, index: p.index, r: rank(p) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.index - b.index)
    .slice(0, 30)
    .map((x) => x.item);
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
                    {
                      backgroundColor:
                        item.result.kind === 'unit'
                          ? item.result.unit.color
                          : item.result.kind === 'species'
                            ? '#FF9EC7'
                            : item.result.kind === 'clade'
                              ? '#C9B6FF'
                              : CAUSE_COLORS.sun,
                      borderRadius: item.result.kind === 'species' || item.result.kind === 'clade' ? 7 : 4,
                    },
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
