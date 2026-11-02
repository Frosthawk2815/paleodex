import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { categoryName, QuizPicker } from '@/components/quiz-picker';
import { QuestionView } from '@/components/quiz-question';
import { usePalette } from '@/hooks/use-palette';
import { imageOf } from '@/lib/images';
import { useProfile, useUnitText } from '@/lib/profile';
import { type Category, categoryKey, categorySize, DIFFICULTIES, type Difficulty, fiftyFifty, makeRound, type Question, replacementQuestion } from '@/lib/quiz';
import { useOwnPicture } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

type Stage = { kind: 'menu' } | { kind: 'setup' } | { kind: 'play'; questions: Question[]; index: number; chosen: number | null; score: number; hidden: number[] } | { kind: 'done'; score: number; total: number; best: boolean };

// The quiz: choose solo play, a Bone War game against one other player or a Peer Review game with a group, then for solo play a category
// and a difficulty, then answer ten questions built from PaleoDex's own data.
export default function QuizScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const ownPicture = useOwnPicture();
  const u = useUnitText();
  const [stage, setStage] = useState<Stage>({ kind: 'menu' });
  const [category, setCategory] = useState<Category>({ kind: 'dinosaurs' });
  const [level, setLevel] = useState<Difficulty>(1);
  // Lifelines used this round (each once per quiz).
  const [used, setUsed] = useState({ fifty: false, refresh: false });

  // The user's own photo of a species if they have one, otherwise PaleoDex's picture.
  const imageFor = (id: string) => ownPicture(id) ?? imageOf(id)?.thumb;
  const bestFor = (c: Category, d: Difficulty) => profile.quizBest[`${categoryKey(c)}:${d}`];

  const start = () => {
    const questions = makeRound(category, level, imageFor, 10, u);
    setUsed({ fifty: false, refresh: false });
    setStage({ kind: 'play', questions, index: 0, chosen: null, score: 0, hidden: [] });
  };

  if (stage.kind === 'menu') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>{t('How much do you know about prehistoric life? Questions are drawn from everything in PaleoDex, at five levels of difficulty.')}</Text>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Play solo')}</Text>
            <Text style={st.rowSub}>{t('Ten questions on the subject and level you choose')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile/battle')} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Bone War')}</Text>
            <Text style={st.rowSub}>{t('Play someone on another phone with a battle code')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile/peer-review')} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Peer Review')}</Text>
            <Text style={st.rowSub}>{t('A group game for 3 to 30 players, with a leaderboard after each round')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'setup') {
    const size = categorySize(category);
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <QuizPicker category={category} onCategory={setCategory} level={level} onLevel={setLevel} bestFor={bestFor} />
        <Pressable
          onPress={start}
          disabled={size < 8}
          accessibilityRole="button"
          style={({ pressed }) => [st.button, pressed && st.pressed, size < 8 && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>
            {t('Start: {quiz}, level {level}', { quiz: categoryName(category, t), level })}
          </Text>
        </Pressable>
        {size < 8 && <Text style={st.muted}>{t('Choose a group or period to start.')}</Text>}
      </ScrollView>
    );
  }

  if (stage.kind === 'done') {
    const message =
      stage.score === stage.total ? t('A perfect round!') : stage.score >= stage.total * 0.7 ? t('Great work.') : stage.score >= stage.total * 0.4 ? t('Not bad. Try again?') : t('A tough one. Try an easier level?');
    return (
      <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
        <Text style={{ fontSize: 56 }}>{stage.score === stage.total ? '🏆' : stage.score >= stage.total * 0.7 ? '🦴' : '🥚'}</Text>
        <Text style={st.title}>{t('{score} out of {total}', { score: stage.score, total: stage.total })}</Text>
        <Text style={st.text}>{message}</Text>
        {stage.best && <Text style={[st.rowTitle, { color: palette.accent }]}>{t('New best score for this quiz!')}</Text>}
        <Text style={st.muted}>
          {t('{quiz} · level {level}, {difficulty}', { quiz: categoryName(category, t), level, difficulty: t(DIFFICULTIES[level - 1]!.name) })}
        </Text>
        <Pressable onPress={start} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>{t('Play again')}</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>{t('Choose a different quiz')}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Playing.
  const q = stage.questions[stage.index];
  if (!q) {
    return (
      <View style={[st.screen, st.content]}>
        <Text style={st.text}>{t('There aren’t enough questions for this choice yet. Try another category or level.')}</Text>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button">
          <Text style={st.link}>{t('Back')}</Text>
        </Pressable>
      </View>
    );
  }
  const choose = (i: number) => {
    if (stage.chosen !== null) return;
    setStage({ ...stage, chosen: i, score: stage.score + (i === q.answer ? 1 : 0) });
  };
  const next = () => {
    if (stage.index + 1 < stage.questions.length) {
      setStage({ ...stage, index: stage.index + 1, chosen: null, hidden: [] });
      return;
    }
    const key = `${categoryKey(category)}:${level}`;
    const prev = profile.quizBest[key];
    const best = prev === undefined || stage.score > prev;
    if (best) update({ quizBest: { ...profile.quizBest, [key]: stage.score } });
    setStage({ kind: 'done', score: stage.score, total: stage.questions.length, best });
  };
  return (
    <QuestionView
      q={q}
      hidden={stage.hidden}
      lifelines={[
        {
          key: 'fifty',
          icon: '✂️',
          label: '50/50',
          hint: t('Remove two wrong answers'),
          used: used.fifty,
          available: true,
          onPress: () => {
            setUsed((x) => ({ ...x, fifty: true }));
            setStage({ ...stage, hidden: fiftyFifty(q) });
          },
        },
        {
          key: 'refresh',
          icon: '🔄',
          label: t('Refresh'),
          hint: t('Swap for a new question'),
          used: used.refresh,
          available: true,
          onPress: () => {
            const fresh = replacementQuestion(category, level, imageFor, stage.questions, u);
            if (!fresh) return;
            setUsed((x) => ({ ...x, refresh: true }));
            setStage({ ...stage, questions: stage.questions.map((x, i) => (i === stage.index ? fresh : x)), hidden: [] });
          },
        },
      ]}
      index={stage.index}
      total={stage.questions.length}
      score={stage.score}
      chosen={stage.chosen}
      onChoose={choose}
      onNext={next}
      nextLabel={stage.index + 1 < stage.questions.length ? t('Next question') : t('See your score')}
    />
  );
}
