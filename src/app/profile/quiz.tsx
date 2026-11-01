import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { PERIODS } from '@/data/periods';
import { usePalette } from '@/hooks/use-palette';
import { imageOf } from '@/lib/images';
import { cladeById, speciesById } from '@/lib/life';
import { useProfile, useUnitText } from '@/lib/profile';
import { type Category, categoryKey, categorySize, DIFFICULTIES, type Difficulty, makeRound, QUIZ_GROUPS, type Question } from '@/lib/quiz';
import { useUserPhotos } from '@/lib/user-photos';

type Stage = { kind: 'menu' } | { kind: 'setup' } | { kind: 'play'; questions: Question[]; index: number; chosen: number | null; score: number } | { kind: 'done'; score: number; total: number; best: boolean };

const categoryName = (c: Category) =>
  c.kind === 'all'
    ? 'All of prehistoric life'
    : c.kind === 'dinosaurs'
      ? 'Dinosaurs'
      : c.kind === 'clade'
        ? (cladeById(c.id)?.common ?? c.id)
        : `The ${PERIODS.find((p) => p.id === c.id)?.name ?? c.id}`;

// The quiz: choose solo play (more ways to play will come later), a category and a difficulty, then
// answer ten questions built from PaleoDex's own data.
export default function QuizScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const showOnGlobe = useShowOnGlobe();
  const { profile, update } = useProfile();
  const { photosOf } = useUserPhotos();
  // Questions, answers and explanations are written in metric and shown in the user's units.
  const u = useUnitText();
  const [stage, setStage] = useState<Stage>({ kind: 'menu' });
  const [category, setCategory] = useState<Category>({ kind: 'dinosaurs' });
  const [level, setLevel] = useState<Difficulty>(1);
  const [picking, setPicking] = useState<'group' | 'period' | null>(null);
  const [search, setSearch] = useState('');

  // The user's own photo of a species if they have one, otherwise PaleoDex's picture.
  const imageFor = (id: string) => {
    const mine = photosOf(id);
    const own = mine.photos.find((p) => p.id === mine.mainId) ?? mine.photos[0];
    return own?.uri ?? imageOf(id)?.thumb;
  };
  const bestFor = (c: Category, d: Difficulty) => profile.quizBest[`${categoryKey(c)}:${d}`];

  const start = () => {
    const questions = makeRound(category, level, imageFor, 10, u);
    setStage({ kind: 'play', questions, index: 0, chosen: null, score: 0 });
  };

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return QUIZ_GROUPS.filter((c) => !q || `${c.common} ${c.name}`.toLowerCase().includes(q)).slice(0, 40);
  }, [search]);

  if (stage.kind === 'menu') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>How much do you know about prehistoric life? Questions are drawn from everything in PaleoDex, at five levels of difficulty.</Text>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <Text style={{ fontSize: 28 }}>🦖</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Play solo</Text>
            <Text style={st.rowSub}>Ten questions on the subject and level you choose</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <View style={[st.card, st.row, { opacity: 0.5 }]} accessible accessibilityLabel="Play with friends, coming soon">
          <Text style={{ fontSize: 28 }}>👥</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Play with friends</Text>
            <Text style={st.rowSub}>Coming soon</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (stage.kind === 'setup') {
    const choice = (c: Category, title: string, detail: string, onPress?: () => void) => {
      const on = categoryKey(c) === categoryKey(category) || (onPress && category.kind === c.kind);
      return (
        <Pressable
          onPress={onPress ?? (() => setCategory(c))}
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
    const size = categorySize(category);
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <Text style={st.heading}>What do you want to be tested on?</Text>
        <View style={st.card}>
          {choice({ kind: 'all' }, 'Everything', 'All of prehistoric (and living) life in PaleoDex')}
          <View style={st.divider} />
          {choice({ kind: 'dinosaurs' }, 'Dinosaurs', 'From the earliest dinosaurs to the last')}
          <View style={st.divider} />
          {choice(
            category.kind === 'clade' ? category : { kind: 'clade', id: '' },
            category.kind === 'clade' ? `Group: ${categoryName(category)}` : 'A particular group',
            'Tyrannosaurs, pterosaurs, mammals and more',
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
                      setCategory({ kind: 'clade', id: c.id });
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
                    setCategory({ kind: 'period', id: p.id });
                    setPicking(null);
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [st.row, pressed && st.pressed]}>
                  <View style={[{ width: 14, height: 14, borderRadius: 3, backgroundColor: p.color }]} />
                  <View style={st.rowText}>
                    <Text style={st.rowTitle}>{p.name}</Text>
                    <Text style={st.rowSub}>{p.era} Era · {Math.round(p.startMa)} to {Math.round(p.endMa)} million years ago</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Text style={st.heading}>Difficulty</Text>
        <View style={st.card}>
          {DIFFICULTIES.map((d, i) => {
            const on = d.level === level;
            const best = bestFor(category, d.level);
            return (
              <View key={d.level}>
                {i > 0 && <View style={st.divider} />}
                <Pressable
                  onPress={() => setLevel(d.level)}
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

        <Pressable
          onPress={start}
          disabled={size < 8}
          accessibilityRole="button"
          style={({ pressed }) => [st.button, pressed && st.pressed, size < 8 && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>Start: {categoryName(category)}, level {level}</Text>
        </Pressable>
        {size < 8 && <Text style={st.muted}>Choose a group or period to start.</Text>}
      </ScrollView>
    );
  }

  if (stage.kind === 'done') {
    const message =
      stage.score === stage.total ? 'A perfect round!' : stage.score >= stage.total * 0.7 ? 'Great work.' : stage.score >= stage.total * 0.4 ? 'Not bad. Try again?' : 'A tough one. Try an easier level?';
    return (
      <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
        <Text style={{ fontSize: 56 }}>{stage.score === stage.total ? '🏆' : stage.score >= stage.total * 0.7 ? '🦴' : '🥚'}</Text>
        <Text style={st.title}>
          {stage.score} out of {stage.total}
        </Text>
        <Text style={st.text}>{message}</Text>
        {stage.best && <Text style={[st.rowTitle, { color: palette.accent }]}>New best score for this quiz!</Text>}
        <Text style={st.muted}>
          {categoryName(category)} · level {level}, {DIFFICULTIES[level - 1]!.name}
        </Text>
        <Pressable onPress={start} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>Play again</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>Choose a different quiz</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Playing.
  const q = stage.questions[stage.index];
  if (!q) {
    return (
      <View style={[st.screen, st.content]}>
        <Text style={st.text}>There aren’t enough questions for this choice yet. Try another category or level.</Text>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button">
          <Text style={st.link}>Back</Text>
        </Pressable>
      </View>
    );
  }
  const answered = stage.chosen !== null;
  const choose = (i: number) => {
    if (answered) return;
    setStage({ ...stage, chosen: i, score: stage.score + (i === q.answer ? 1 : 0) });
  };
  const next = () => {
    if (stage.index + 1 < stage.questions.length) {
      setStage({ ...stage, index: stage.index + 1, chosen: null });
      return;
    }
    const key = `${categoryKey(category)}:${level}`;
    const prev = profile.quizBest[key];
    const best = prev === undefined || stage.score > prev;
    if (best) update({ quizBest: { ...profile.quizBest, [key]: stage.score } });
    setStage({ kind: 'done', score: stage.score, total: stage.questions.length, best });
  };
  const subject = q.speciesId ? speciesById(q.speciesId) : undefined;
  const good = '#2E7D32';
  const bad = '#C62828';

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.muted}>
        Question {stage.index + 1} of {stage.questions.length} · score {stage.score}
      </Text>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: palette.track, overflow: 'hidden' }}>
        <View style={{ width: `${((stage.index + (answered ? 1 : 0)) / stage.questions.length) * 100}%`, height: '100%', backgroundColor: palette.link }} />
      </View>
      {q.image && (
        <Image
          source={{ uri: q.image }}
          style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 12, backgroundColor: palette.track }}
          contentFit="contain"
          accessibilityLabel={answered && subject ? `Picture of ${subject.common || subject.name}` : 'Picture for this question'}
        />
      )}
      <Text style={st.title} accessibilityRole="header">
        {u(q.prompt)}
      </Text>
      <View style={{ gap: 8 }}>
        {q.options.map((o, i) => {
          const isRight = i === q.answer;
          const isChosen = i === stage.chosen;
          const color = answered && isRight ? good : answered && isChosen ? bad : undefined;
          return (
            <Pressable
              key={o}
              onPress={() => choose(i)}
              disabled={answered}
              accessibilityRole="button"
              accessibilityLabel={`${u(o)}${answered && isRight ? ', correct answer' : answered && isChosen ? ', your answer, wrong' : ''}`}
              style={({ pressed }) => [
                st.card,
                st.row,
                color && { borderColor: color, borderWidth: 2, backgroundColor: `${color}22` },
                pressed && st.pressed,
              ]}>
              <Text style={[st.rowTitle, { flex: 1 }]}>{u(o)}</Text>
              {answered && isRight && <Text style={[st.rowTitle, { color: good }]}>✓</Text>}
              {answered && isChosen && !isRight && <Text style={[st.rowTitle, { color: bad }]}>✗</Text>}
            </Pressable>
          );
        })}
      </View>
      {answered && (
        <View style={[st.card, { padding: 14, gap: 6 }]} accessibilityLiveRegion="polite">
          <Text style={[st.rowTitle, { color: stage.chosen === q.answer ? good : bad }]}>{stage.chosen === q.answer ? 'Correct!' : `The answer is ${u(q.options[q.answer])}.`}</Text>
          <Text style={st.rowSub}>{u(q.explanation)}</Text>
          {subject && (
            <Pressable onPress={() => showOnGlobe({ kind: 'page', page: { kind: 'species', id: subject.id } })} accessibilityRole="button" hitSlop={6}>
              <Text style={st.link}>Read about {subject.common || subject.name} ›</Text>
            </Pressable>
          )}
        </View>
      )}
      {answered && (
        <Pressable onPress={next} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
          <Text style={st.buttonText}>{stage.index + 1 < stage.questions.length ? 'Next question' : 'See your score'}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
