import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { speciesById } from '@/lib/life';
import { useUnitText } from '@/lib/profile';
import type { Question } from '@/lib/quiz';

const GOOD = '#2E7D32';
const BAD = '#C62828';

// A lifeline (50/50, Refresh, Copy, Switcheroo): each can be used once per quiz.
export type Lifeline = { key: string; icon: string; label: string; used: boolean; available: boolean; onPress: () => void; hint: string };

function LifelineBar({ lifelines }: { lifelines: Lifeline[] }) {
  const st = useProfileStyles();
  const palette = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {lifelines.map((l) => {
        const off = l.used || !l.available;
        return (
          <Pressable
            key={l.key}
            onPress={l.onPress}
            disabled={off}
            accessibilityRole="button"
            accessibilityLabel={`${l.label}${l.used ? ', already used' : ''}. ${l.hint}`}
            accessibilityState={{ disabled: off }}
            style={({ pressed }) => [
              {
                flexGrow: 1,
                flexBasis: 90,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: palette.border,
                backgroundColor: palette.card,
                alignItems: 'center',
              },
              off && { opacity: 0.4 },
              pressed && st.pressed,
            ]}>
            <Text style={st.rowTitle}>
              {l.icon} {l.label}
            </Text>
            <Text style={[st.rowSub, { fontSize: 11 }]}>{l.used ? 'Used' : l.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// One quiz question: progress bar, picture, prompt and answers, then the explanation once answered.
export function QuestionView({
  q,
  index,
  total,
  score,
  chosen,
  onChoose,
  onNext,
  nextLabel,
  header,
  allowReadMore = true,
  hidden = [],
  lifelines,
}: {
  q: Question;
  index: number;
  total: number;
  score: number;
  chosen: number | null;
  onChoose: (i: number) => void;
  onNext: () => void;
  nextLabel: string;
  // Extra line under the progress bar (e.g. the opponent's score).
  header?: ReactNode;
  // "Read about…" leaves the quiz, so it is hidden during a live game.
  allowReadMore?: boolean;
  // Answers taken away by 50/50.
  hidden?: number[];
  lifelines?: Lifeline[];
}) {
  const st = useProfileStyles();
  const palette = usePalette();
  const showOnGlobe = useShowOnGlobe();
  // Questions, answers and explanations are written in metric and shown in the user's units.
  const u = useUnitText();
  const answered = chosen !== null;
  const subject = q.speciesId ? speciesById(q.speciesId) : undefined;

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.muted}>
        Question {index + 1} of {total} · score {score}
      </Text>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: palette.track, overflow: 'hidden' }}>
        <View style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%`, height: '100%', backgroundColor: palette.link }} />
      </View>
      {header}
      {lifelines && !answered && <LifelineBar lifelines={lifelines} />}
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
          if (hidden.includes(i)) return null;
          const isRight = i === q.answer;
          const isChosen = i === chosen;
          const color = answered && isRight ? GOOD : answered && isChosen ? BAD : undefined;
          return (
            <Pressable
              key={o}
              onPress={() => onChoose(i)}
              disabled={answered}
              accessibilityRole="button"
              accessibilityLabel={`${u(o)}${answered && isRight ? ', correct answer' : answered && isChosen ? ', your answer, wrong' : ''}`}
              style={({ pressed }) => [st.card, st.row, color && { borderColor: color, borderWidth: 2, backgroundColor: `${color}22` }, pressed && st.pressed]}>
              <Text style={[st.rowTitle, { flex: 1 }]}>{u(o)}</Text>
              {answered && isRight && <Text style={[st.rowTitle, { color: GOOD }]}>✓</Text>}
              {answered && isChosen && !isRight && <Text style={[st.rowTitle, { color: BAD }]}>✗</Text>}
            </Pressable>
          );
        })}
      </View>
      {answered && (
        <View style={[st.card, { padding: 14, gap: 6 }]} accessibilityLiveRegion="polite">
          <Text style={[st.rowTitle, { color: chosen === q.answer ? GOOD : BAD }]}>
            {chosen === q.answer ? 'Correct!' : `The answer is ${u(q.options[q.answer]!).replace(/^(A|An|About) /, (w) => w.toLowerCase())}.`}
          </Text>
          <Text style={st.rowSub}>{u(q.explanation)}</Text>
          {allowReadMore && subject && (
            <Pressable onPress={() => showOnGlobe({ kind: 'page', page: { kind: 'species', id: subject.id } })} accessibilityRole="button" hitSlop={6}>
              <Text style={st.link}>Read about {subject.common || subject.name} ›</Text>
            </Pressable>
          )}
        </View>
      )}
      {answered && (
        <Pressable onPress={onNext} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
          <Text style={st.buttonText}>{nextLabel}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
