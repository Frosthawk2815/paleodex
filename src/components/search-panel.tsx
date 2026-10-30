import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { EVENTS, type HistoryEvent } from '@/data/events';
import { type Palette, usePalette } from '@/hooks/use-palette';
import { type Extinction, EXTINCTIONS } from '@/lib/extinctions';
import { type Unit, UNITS_BY_LEVEL } from '@/lib/time';
import { SHARED_SHORTHANDS } from '@/data/aka';
import { type Clade, CLADES, SPECIES, type Species } from '@/data/life';
import { speciesInClade } from '@/lib/life';
import { rangeOf } from '@/lib/ranges';

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

// A species still alive today: its range runs up to the present and it has no last sighting.
const isLiving = (s: Species) => {
  const r = rangeOf(s.id);
  return !!r && !r.lastSeen && r.phases[r.phases.length - 1]?.toMa === 0;
};

const ITEMS: Item[] = [
  // Species first, so "t rex" finds the animal before the places it's found.
  // Living animals are listed by their everyday name (e.g. “Ball python”) with the scientific name
  // underneath; extinct ones keep their scientific name first.
  ...SPECIES.map((s) => {
    const plain = isLiving(s) && !!s.common;
    const second = plain ? s.name : s.common;
    return {
      key: `species:${s.id}`,
      title: plain ? s.common! : s.name,
      subtitle: `Species${second ? ` · ${second}` : ''}${s.aka?.length ? ` · also ${s.aka.slice(0, 2).join(', ')}` : ''} · ${s.ageText.replace(/ \(.*\)$/, '')}`,
      words: [s.name, s.common ?? '', ...(s.aka ?? []), ...(s.keywords ?? [])].join(' ').toLowerCase(),
      names: [s.name, s.common ?? '', ...(s.aka ?? []), ...(s.akaSearch ?? [])].filter(Boolean),
      result: { kind: 'species' as const, species: s },
    };
  }),
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
const PREPARED = ITEMS.map((item, index) => {
  const names = (item.names ?? [item.title]).map(norm);
  return { item, index, names, nameWords: [...new Set(names.flatMap((n) => n.split(' ')))], words: norm(item.words) };
});

// Edit distance (insertions, deletions, substitutions and swapped neighbours), stopping early
// once it is clearly over `max`.
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur.push(v);
      best = Math.min(best, v);
    }
    if (best > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

// How far a typed word is from being the start of a name word ("simitar" → "scimitar" is 1,
// "tooth" → "toothed" is 0), or Infinity if too far. Short words must be exact; long ones may be
// two letters out. The compared start is never shorter than what was typed.
function closeness(typed: string, word: string): number {
  if (word.startsWith(typed)) return 0;
  if (typed.length < 4) return Infinity;
  const max = typed.length >= 8 ? 2 : 1;
  let best = Infinity;
  for (let len = typed.length; len <= typed.length + max && len <= word.length; len++) {
    best = Math.min(best, distance(typed, word.slice(0, len), max));
  }
  return best <= max ? best : Infinity;
}

function search(query: string): Item[] {
  const q = norm(query);
  if (!q) return ITEMS.filter((i) => i.result.kind === 'event' || i.result.kind === 'extinction' || i.result.kind === 'clade');
  // A shorthand several animals share lists them first, in a set order ("deino").
  const shared = SHARED_SHORTHANDS[q];
  if (shared) {
    const top = shared.map((id) => ITEMS.find((i) => i.key === `species:${id}`)).filter((i): i is Item => !!i);
    return [...top, ...searchAll(q).filter((i) => !top.includes(i))].slice(0, 30);
  }
  return searchAll(q);
}

function searchAll(q: string): Item[] {
  // A plural query also matches the singular ("sea scorpions" finds entries that say "sea scorpion").
  const singular = q
    .split(' ')
    .map((w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w))
    .join(' ');
  // The singular form ranks just below the same match on what was typed.
  return merge(searchFor(q), singular === q ? [] : searchFor(singular).map((x) => ({ ...x, r: x.r + 0.5 })));
}

// Results for both forms, best tier first, without repeats.
function merge(a: Ranked[], b: Ranked[]): Item[] {
  const best = new Map<number, Ranked>();
  for (const x of [...a, ...b]) if (!best.has(x.index) || best.get(x.index)!.r > x.r) best.set(x.index, x);
  return [...best.values()].sort((x, y) => x.r - y.r || x.index - y.index).slice(0, 30).map((x) => x.item);
}

type Ranked = { item: Item; index: number; r: number };

function searchFor(q: string): Ranked[] {
  const typed = q.split(' ');
  // Best first: a name that is exactly the query, a name that starts with it, a word that
  // starts with it, any mention, every typed word starting a name word (in any order), then
  // names that are close but misspelt. Within a tier, the original order (species first) holds.
  const wordStart = new RegExp(`(^|\\s)${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  // Misspelt matches score 5 plus how many letters were out in total, so the closest come first.
  const rank = ({ names, nameWords, words }: (typeof PREPARED)[number]) => {
    if (names.some((n) => n === q)) return 0;
    if (names.some((n) => n.startsWith(q))) return 1;
    if (wordStart.test(words)) return 2;
    if (words.includes(q)) return 3;
    if (typed.every((t) => nameWords.some((w) => w.startsWith(t)))) return 4;
    let off = 0;
    for (const t of typed) {
      off += Math.min(...nameWords.map((w) => closeness(t, w)));
      if (off === Infinity) return -1;
    }
    return 5 + off;
  };
  return PREPARED.map((p) => ({ item: p.item, index: p.index, r: rank(p) })).filter((x) => x.r >= 0);
}

type Props = {
  onSelect: (r: SearchResult) => void;
  onClose: () => void;
};

// Search for events, mass extinctions and units of geological time.
export function SearchPanel({ onSelect, onClose }: Props) {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const [query, setQuery] = useState('');
  const results = useMemo(() => search(query), [query]);

  return (
    <View style={styles.panel}>
      <View style={styles.bar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search events, extinctions, periods…"
          placeholderTextColor={palette.muted}
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
                            ? palette.badge
                            : item.result.kind === 'clade'
                              ? palette.chip
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

const makeStyles = (p: Palette) =>
  StyleSheet.create({
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
    color: p.text,
    fontSize: 16,
    backgroundColor: p.card,
  },
  close: {
    paddingVertical: 8,
  },
  closeText: {
    color: p.link,
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
    backgroundColor: p.pressed,
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
    color: p.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: p.muted,
    fontSize: 13,
  },
  empty: {
    color: p.muted,
    fontSize: 15,
    padding: 16,
  },
});
