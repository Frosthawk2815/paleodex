import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { categoryName, QuizPicker } from '@/components/quiz-picker';
import { QuestionView } from '@/components/quiz-question';
import { useLeaveGuard } from '@/hooks/use-leave-guard';
import { usePalette } from '@/hooks/use-palette';
import { imageOf } from '@/lib/images';
import { CardRewards, type Earned } from '@/components/card-rewards';
import { cardFor, cardKeyForQuestion, cardName, ownsCard } from '@/lib/bone-war';
import { useProfile, useUnitText } from '@/lib/profile';
import { type Category, categoryKey, categorySize, DIFFICULTIES, type Difficulty, fiftyFifty, makeRound, type Question, questionAbout, replacementQuestion } from '@/lib/quiz';
import { useOwnPicture } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

type Stage =
  | { kind: 'menu' }
  | { kind: 'setup' }
  | { kind: 'favSetup' }
  | { kind: 'play'; questions: Question[]; index: number; chosen: number | null; score: number; hidden: number[]; earned: Earned[] }
  // Testing favourites: one favourite at a time, at `attempt` (the chosen level, one lower per retry).
  | { kind: 'fav'; keys: string[]; index: number; attempt: Difficulty; q: Question; chosen: number | null; score: number; earned: Earned[]; asked: string[] }
  | { kind: 'done'; mode: 'solo' | 'fav'; score: number; total: number; best: boolean; earned: Earned[] };

// A card won this round: added to the list (or raised, if the same card was won again).
const withEarned = (list: Earned[], e: Earned) => (list.some((x) => x.key === e.key) ? list.map((x) => (x.key === e.key ? { ...x, stars: Math.max(x.stars, e.stars) } : x)) : [...list, e]);

// The quiz: choose solo play, a Head to Head game against one other player or a Peer Review game with a group, then for solo play a category
// and a difficulty, then answer ten questions built from Animal Almanac's own data.
export default function QuizScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const ownPicture = useOwnPicture();
  const u = useUnitText();
  const [stage, setStage] = useState<Stage>({ kind: 'menu' });
  useLeaveGuard(stage.kind === 'play' || stage.kind === 'fav');
  const [category, setCategory] = useState<Category>({ kind: 'dinosaurs' });
  const [level, setLevel] = useState<Difficulty>(1);
  // Lifelines used this round (each once per quiz).
  const [used, setUsed] = useState({ fifty: false, refresh: false });

  // The user's own photo of a species if they have one, otherwise Animal Almanac's picture.
  const imageFor = (id: string) => ownPicture(id) ?? imageOf(id)?.thumb;
  const bestFor = (c: Category, d: Difficulty) => profile.quizBest[`${categoryKey(c)}:${d}`];

  const start = () => {
    const questions = makeRound(category, level, imageFor, 10, u);
    setUsed({ fifty: false, refresh: false });
    setStage({ kind: 'play', questions, index: 0, chosen: null, score: 0, hidden: [], earned: [] });
  };

  // Bone War: a correct answer earns (or upgrades) a card of that level for the animal or
  // extinction it was about. It's shown in the reward pool when the round ends; animals not yet
  // collected can be collected there.
  // In a wishlist test the card is collected at once (and comes off the wishlist).
  const award = (key: string | null, stars: number, earned: Earned[], collect = false): Earned[] => {
    if (!key || !cardFor(key, stars)) return earned;
    const better = (profile.cards[key] ?? 0) < stars;
    // Not yet collected: offered (in a solo quiz) or collected (in a wishlist test) even if its stars
    // aren't new.
    const fresh = !ownsCard(profile, key);
    if (!better && !fresh) {
      if (collect) update({ wishlist: (profile.wishlist ?? []).filter((k) => k !== key) });
      return earned;
    }
    const upgrade = !!profile.cards[key] && ownsCard(profile, key);
    update({
      cards: better ? { ...profile.cards, [key]: stars } : profile.cards,
      ...(collect ? { collection: [...new Set([...(profile.collection ?? []), key])], wishlist: (profile.wishlist ?? []).filter((k) => k !== key) } : {}),
    });
    return withEarned(earned, { key, stars: Math.max(stars, profile.cards[key] ?? 0), upgrade });
  };

  // The card wishlist (animals and mass extinctions added with "Acquire card" on their pages).
  const favKeys = (profile.wishlist ?? []).filter((k) => !!cardFor(k, 1));
  // The next favourite from `from` that has a question, at `attempt`.
  const favQuestion = (keys: string[], from: number, attempt: Difficulty, asked: string[]) => {
    for (let i = from; i < keys.length; i++) {
      const q = questionAbout(keys[i]!, attempt, imageFor, new Set(asked));
      if (q) return { index: i, q };
    }
    return null;
  };
  const startFav = () => {
    const keys = [...favKeys].sort(() => Math.random() - 0.5);
    const first = favQuestion(keys, 0, level, []);
    if (!first) return;
    setStage({ kind: 'fav', keys, index: first.index, attempt: level, q: first.q, chosen: null, score: 0, earned: [], asked: [first.q.id] });
  };

  if (stage.kind === 'menu') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>{t('How much do you know about prehistoric life? Questions are drawn from everything in Animal Almanac, at five levels of difficulty.')}</Text>
        <Pressable onPress={() => setStage({ kind: 'setup' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Play solo')}</Text>
            <Text style={st.rowSub}>{t('Ten questions on the subject and level you choose')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'favSetup' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Test your wishlist')}</Text>
            <Text style={st.rowSub}>{t('A question on each card on your wishlist, to win the Bone War cards you want')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile/bone-war')} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Bone War')}</Text>
            <Text style={st.rowSub}>{t('A card battle with the animals you have collected')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile/battle')} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Head to Head')}</Text>
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

  if (stage.kind === 'favSetup') {
    const count = favKeys.length;
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>
          {t('Every animal and mass extinction on your card wishlist gets one question at the level you choose. Answer right to win its Bone War card with that many stars (or upgrade it).')}
        </Text>
        <Text style={st.muted}>{t('Get one wrong and you can try again with an easier question, one level lower, for a card with one star fewer. Each new card starts back at your chosen level.')}</Text>
        <Text style={st.rowTitle}>{t('Level')}</Text>
        <View style={{ gap: 8 }}>
          {DIFFICULTIES.map((d) => {
            const on = level === d.level;
            return (
              <Pressable
                key={d.level}
                onPress={() => setLevel(d.level)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={({ pressed }) => [st.card, st.row, { borderWidth: on ? 2 : 1, borderColor: on ? palette.accent : palette.border }, pressed && st.pressed]}>
                <View style={st.rowText}>
                  <Text style={[st.rowTitle, on && { color: palette.accent }]}>
                    {d.level} · {t(d.name)} {'★'.repeat(d.level)}
                  </Text>
                  <Text style={st.rowSub}>{t(d.detail)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={startFav} disabled={count === 0} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed, count === 0 && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>{t('Start: {n} cards, level {level}', { n: count, level })}</Text>
        </Pressable>
        {count === 0 && <Text style={st.muted}>{t('Your wishlist is empty. Tap Acquire card at the top of any animal or mass extinction page to add it.')}</Text>}
        {count > 0 && (
          <>
            <Text style={st.rowTitle}>{t('Your wishlist ({n})', { n: count })}</Text>
            {favKeys.map((k) => (
              <View key={k} style={[st.card, st.row, { paddingVertical: 8 }]}>
                <Text style={[st.rowTitle, { flex: 1 }]}>
                  {cardName(cardFor(k, 1)!)}
                  {profile.cards[k] && ownsCard(profile, k) ? ` ${'★'.repeat(profile.cards[k]!)}` : ''}
                </Text>
                <Pressable
                  onPress={() => update({ wishlist: (profile.wishlist ?? []).filter((x) => x !== k) })}
                  accessibilityRole="button"
                  accessibilityLabel={t('Remove {name} from your wishlist', { name: cardName(cardFor(k, 1)!) })}
                  hitSlop={8}>
                  <Text style={[st.link, { color: palette.bad }]}>✕</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}
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
          {stage.mode === 'fav'
            ? t('Your wishlist · level {level}, {difficulty}', { level, difficulty: t(DIFFICULTIES[level - 1]!.name) })
            : t('{quiz} · level {level}, {difficulty}', { quiz: categoryName(category, t), level, difficulty: t(DIFFICULTIES[level - 1]!.name) })}
        </Text>
        <CardRewards earned={stage.earned} />
        <Pressable onPress={stage.mode === 'fav' ? startFav : start} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>{t('Play again')}</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: stage.mode === 'fav' ? 'favSetup' : 'setup' })} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>{stage.mode === 'fav' ? t('Choose a different level') : t('Choose a different quiz')}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'fav') {
    const f = stage;
    const right = f.chosen !== null && f.chosen === f.q.answer;
    const finish = (score: number, earned: Earned[]) => setStage({ kind: 'done', mode: 'fav', score, total: f.keys.length, best: false, earned });
    // On to the next card, back at the chosen level.
    const nextFavourite = () => {
      const n = favQuestion(f.keys, f.index + 1, level, f.asked);
      if (!n) return finish(f.score, f.earned);
      setStage({ ...f, index: n.index, attempt: level, q: n.q, chosen: null, asked: [...f.asked, n.q.id] });
    };
    // Another go at the same favourite: an easier question, for a card with one star fewer.
    const retry = () => {
      const easier = (f.attempt - 1) as Difficulty;
      const q = questionAbout(f.keys[f.index]!, easier, imageFor, new Set(f.asked));
      if (!q) return nextFavourite();
      setStage({ ...f, attempt: easier, q, chosen: null, asked: [...f.asked, q.id] });
    };
    const canRetry = f.chosen !== null && !right && f.attempt > 1;
    const last = f.index + 1 >= f.keys.length;
    return (
      <QuestionView
        q={f.q}
        index={f.index}
        total={f.keys.length}
        score={f.score}
        chosen={f.chosen}
        header={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Text style={[st.rowSub, { color: palette.accent }]}>{t('Level {level} · for a {stars} card', { level: f.attempt, stars: '★'.repeat(f.attempt) })}</Text>
            <Pressable onPress={() => finish(f.score, f.earned)} accessibilityRole="button" hitSlop={6}>
              <Text style={st.link}>{t('Finish')}</Text>
            </Pressable>
          </View>
        }
        onChoose={(i) => {
          if (f.chosen !== null) return;
          const ok = i === f.q.answer;
          const earned = ok ? award(f.keys[f.index]!, f.attempt, f.earned, true) : f.earned;
          setStage({ ...f, chosen: i, score: f.score + (ok ? 1 : 0), earned });
        }}
        onNext={canRetry ? retry : nextFavourite}
        nextLabel={canRetry ? t('Try again: level {level}, for a {stars} card', { level: f.attempt - 1, stars: '★'.repeat(f.attempt - 1) }) : last ? t('See your rewards') : t('Next card')}
        secondary={canRetry ? { label: last ? t('See your rewards') : t('Next card'), onPress: nextFavourite } : undefined}
      />
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
    const ok = i === q.answer;
    const earned = ok ? award(cardKeyForQuestion(q), level, stage.earned) : stage.earned;
    setStage({ ...stage, chosen: i, score: stage.score + (ok ? 1 : 0), earned });
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
    setStage({ kind: 'done', mode: 'solo', score: stage.score, total: stage.questions.length, best, earned: stage.earned });
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
