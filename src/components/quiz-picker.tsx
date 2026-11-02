import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { PERIODS } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';
import { cladeById } from '@/lib/life';
import { type Category, categoryKey, DIFFICULTIES, type Difficulty, LIVING_GROUPS, QUIZ_GROUPS } from '@/lib/quiz';

export const categoryName = (c: Category) =>
  c.kind === 'all'
    ? 'All of prehistoric life'
    : c.kind === 'dinosaurs'
      ? 'Dinosaurs'
      : c.kind === 'mammals'
        ? 'Mammals'
        : c.kind === 'alive'
          ? c.id
            ? `Alive today: ${cladeById(c.id)?.common ?? c.id}`
            : 'Alive today'
          : c.kind === 'clade'
          ? (cladeById(c.id)?.common ?? c.id)
          : `The ${PERIODS.find((p) => p.id === c.id)?.name ?? c.id}`;

// Choosing what to be quizzed on (everything, dinosaurs, mammals, a group or a period) and how hard.
export function QuizPicker({
  category,
  onCategory,
  level,
  onLevel,
  bestFor,
}: {
  category: Category;
  onCategory: (c: Category) => void;
  level: Difficulty;
  onLevel: (d: Difficulty) => void;
  bestFor?: (c: Category, d: Difficulty) => number | undefined;
}) {
  const st = useProfileStyles();
  const palette = usePalette();
  const [picking, setPicking] = useState<'group' | 'period' | 'living' | null>(null);
  const [search, setSearch] = useState('');
  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return QUIZ_GROUPS.filter((c) => !q || `${c.common} ${c.name}`.toLowerCase().includes(q)).slice(0, 40);
  }, [search]);
  const [livingSearch, setLivingSearch] = useState('');
  const livingGroups = useMemo(() => {
    const q = livingSearch.trim().toLowerCase();
    return LIVING_GROUPS.filter((c) => !q || `${c.common} ${c.name}`.toLowerCase().includes(q)).slice(0, 40);
  }, [livingSearch]);

  const choice = (c: Category, title: string, detail: string, onPress?: () => void) => {
    // A picker row is on while one of its choices is chosen ("All living animals" has its own row).
    const on = categoryKey(c) === categoryKey(category) || (onPress && category.kind === c.kind && (category.kind !== 'alive' || !!category.id));
    return (
      <Pressable
        onPress={onPress ?? (() => onCategory(c))}
        accessibilityRole="radio"
        accessibilityState={{ checked: !!on }}
        style={({ pressed }) => [st.row, on && { backgroundColor: palette.linkBg }, pressed && st.pressed]}>
        <View style={st.rowText}>
          <Text style={st.rowTitle}>{title}</Text>
          <Text style={st.rowSub}>{detail}</Text>
        </View>
        {on && <Text style={[st.rowTitle, { color: palette.link }]}>✓</Text>}
      </Pressable>
    );
  };

  return (
    <>
      <Text style={st.heading}>What do you want to be tested on?</Text>
      <View style={st.card}>
        {choice({ kind: 'all' }, 'Everything', 'All of prehistoric (and living) life in PaleoDex')}
        <View style={st.divider} />
        {choice({ kind: 'dinosaurs' }, 'Dinosaurs', 'From the earliest dinosaurs to the last')}
        <View style={st.divider} />
        {choice({ kind: 'mammals' }, 'Mammals', 'Mammals past and present, and their early synapsid relatives such as Dimetrodon')}
        <View style={st.divider} />
        {choice(
          category.kind === 'clade' ? category : { kind: 'clade', id: '' },
          category.kind === 'clade' ? `Group: ${categoryName(category)}` : 'A particular group',
          'Tyrannosaurs, pterosaurs, sharks and more',
          () => setPicking(picking === 'group' ? null : 'group'),
        )}
        <View style={st.divider} />
        {choice(
          category.kind === 'period' ? category : { kind: 'period', id: '' },
          category.kind === 'period' ? `Period: ${categoryName(category).replace(/^The /, '')}` : 'A period of time',
          'The animals and timescale of one period',
          () => setPicking(picking === 'period' ? null : 'period'),
        )}
      </View>

      {picking === 'group' && (
        <View style={{ gap: 8 }}>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search groups…" placeholderTextColor={palette.muted} style={st.input} accessibilityLabel="Search groups" />
          <View style={st.card}>
            {groups.map((c, i) => (
              <View key={c.id}>
                {i > 0 && <View style={st.divider} />}
                <Pressable
                  onPress={() => {
                    onCategory({ kind: 'clade', id: c.id });
                    setPicking(null);
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [st.row, pressed && st.pressed]}>
                  <View style={st.rowText}>
                    <Text style={st.rowTitle}>{c.common || c.name}</Text>
                    <Text style={st.rowSub}>{c.name}</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
      {picking === 'period' && (
        <View style={st.card}>
          {PERIODS.map((p, i) => (
            <View key={p.id}>
              {i > 0 && <View style={st.divider} />}
              <Pressable
                onPress={() => {
                  onCategory({ kind: 'period', id: p.id });
                  setPicking(null);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [st.row, pressed && st.pressed]}>
                <View style={[{ width: 14, height: 14, borderRadius: 3, backgroundColor: p.color }]} />
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{p.name}</Text>
                  <Text style={st.rowSub}>
                    {p.era} Era · {Math.round(p.startMa)} to {Math.round(p.endMa)} million years ago
                  </Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Text style={st.heading}>Or: animals alive today</Text>
      <View style={st.card}>
        {choice({ kind: 'alive' }, 'All living animals', 'Animals living in the wild now: what they are, and where they live')}
        <View style={st.divider} />
        {choice(
          category.kind === 'alive' && category.id ? category : { kind: 'alive', id: '' },
          category.kind === 'alive' && category.id ? categoryName(category) : 'A particular living group',
          'Cats, primates, birds of prey, whales and more',
          () => setPicking(picking === 'living' ? null : 'living'),
        )}
      </View>
      {picking === 'living' && (
        <View style={{ gap: 8 }}>
          <TextInput
            value={livingSearch}
            onChangeText={setLivingSearch}
            placeholder="Search living groups…"
            placeholderTextColor={palette.muted}
            style={st.input}
            accessibilityLabel="Search living groups"
          />
          <View style={st.card}>
            {livingGroups.map((c, i) => (
              <View key={c.id}>
                {i > 0 && <View style={st.divider} />}
                <Pressable
                  onPress={() => {
                    onCategory({ kind: 'alive', id: c.id });
                    setPicking(null);
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [st.row, pressed && st.pressed]}>
                  <View style={st.rowText}>
                    <Text style={st.rowTitle}>{c.common || c.name}</Text>
                    <Text style={st.rowSub}>{c.name}</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={st.heading}>Difficulty</Text>
      <View style={st.card}>
        {DIFFICULTIES.map((d, i) => {
          const on = d.level === level;
          const best = bestFor?.(category, d.level);
          return (
            <View key={d.level}>
              {i > 0 && <View style={st.divider} />}
              <Pressable
                onPress={() => onLevel(d.level)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={({ pressed }) => [st.row, on && { backgroundColor: palette.linkBg }, pressed && st.pressed]}>
                <Text style={[st.rowTitle, { width: 26 }]}>{d.level}</Text>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{d.name}</Text>
                  <Text style={st.rowSub}>{d.detail}</Text>
                </View>
                {best !== undefined && <Text style={st.rowSub}>Best {best}/10</Text>}
              </Pressable>
            </View>
          );
        })}
      </View>
    </>
  );
}
