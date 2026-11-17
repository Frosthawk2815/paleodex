import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoneWarCard } from '@/components/bone-war-card';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { cardFor, type Look } from '@/lib/bone-war';
import { type Action, backMax, backTotal, cardOf, type GameState, type GCard, legal, levelFor, secondsFor, START_HP } from '@/lib/bone-war-game';
import { imageOf } from '@/lib/images';
import { type Question, questionAbout } from '@/lib/quiz';
import { useOwnPicture } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

// A card the player has tapped: where it is.
type Pick = { where: 'hand' | 'front' | 'back' | 'oppFront' | 'oppBack'; i: number };

// The field of play, shared by games against the computer and against a friend.
export function Board({
  state,
  me,
  act,
  oppStyle,
  oppLook,
  oppArt,
  onExit,
}: {
  state: GameState;
  me: 0 | 1;
  act: (a: Action) => void;
  oppStyle: { back: string; border: string };
  // The opponent's theme colours, for their side of the board, and their own photos for their cards.
  oppLook: Look;
  oppArt: Record<string, string>;
  onExit: () => void;
}) {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [pick, setPick] = useState<Pick | null>(null);
  // Questions already asked this game, so a second try at a card brings a new one.
  const [asked] = useState(() => new Set<string>());
  const opp = (1 - me) as 0 | 1;
  const mine = state.players[me]!;
  const theirs = state.players[opp]!;
  const W = Math.min(width, 640) - 24;
  const slotW = Math.floor((W - 5 * 6) / 6);
  const backW = Math.min(slotW * 1.25, 90);
  const handW = Math.min(Math.floor((W - 4 * 8) / 5), 96);
  const myTurn = state.turn === me && !state.pending && !state.over;

  const card = (
    g: GCard | null,
    face: boolean,
    w: number,
    style: { back: string; border: string } | undefined,
    onPress: (() => void) | undefined,
    on = false,
    key?: string,
    outline?: string,
  ) => (
    <Pressable key={key} onPress={onPress} disabled={!onPress} accessibilityRole="button" style={{ width: w }}>
      {g ? (
        <View>
          <BoneWarCard card={cardOf(g)} width={w} faceDown={!face} cardStyle={style} art={style ? oppArt : undefined} highlight={on ? palette.accent : undefined} />
          {face && style === undefined && !g.seen && !key?.startsWith('hand') && <Text style={styles.hiddenTag}>🙈</Text>}
        </View>
      ) : (
        <View style={[styles.empty, { width: w, height: w * 1.4, borderColor: outline ?? palette.border }]} />
      )}
    </Pressable>
  );

  const row = (cards: (GCard | null)[], where: Pick['where'], faceFor: (g: GCard) => boolean, w: number, style?: { back: string; border: string }, outline?: string) => (
    <View style={styles.row}>
      {cards.map((g, i) =>
        card(
          g,
          !!g && faceFor(g),
          w,
          style,
          g || (pick?.where === 'hand' && (where === 'front' || where === 'back')) || (pick?.where === 'back' && where === 'front') ? () => tapSlot(where, i) : undefined,
          pick?.where === where && pick.i === i,
          `${where}-${i}`,
          outline,
        ),
      )}
    </View>
  );

  // Tapping an empty slot with a hand card (or a backline card) picked places it there.
  const tapSlot = (where: Pick['where'], i: number) => {
    const row = where === 'front' ? mine.front : where === 'back' ? mine.back : where === 'oppFront' ? theirs.front : where === 'oppBack' ? theirs.back : mine.hand;
    if (!row[i] && pick && myTurn) {
      if (pick.where === 'hand' && (where === 'front' || where === 'back')) act({ type: 'play', hand: pick.i, row: where, slot: i });
      else if (pick.where === 'back' && where === 'front') act({ type: 'advance', from: pick.i, to: i });
      setPick(null);
      return;
    }
    setPick(row[i] ? { where, i } : null);
  };

  // The tapped card, large, with what can be done with it.
  const panel = () => {
    if (!pick) return null;
    const g =
      pick.where === 'hand' ? mine.hand[pick.i] : pick.where === 'front' ? mine.front[pick.i] : pick.where === 'back' ? mine.back[pick.i] : pick.where === 'oppFront' ? theirs.front[pick.i] : theirs.back[pick.i];
    if (!g) return null;
    const ours = pick.where === 'hand' || pick.where === 'front' || pick.where === 'back';
    const face = ours || g.seen;
    const c = cardOf(g);
    const buttons: { label: string; a: Action }[] = [];
    if (pick.where === 'hand') {
      const f = mine.front.findIndex((x) => !x);
      const b = mine.back.findIndex((x) => !x);
      if (f >= 0) buttons.push({ label: t('Play to front line'), a: { type: 'play', hand: pick.i, row: 'front', slot: f } });
      if (b >= 0) buttons.push({ label: t('Play to backline'), a: { type: 'play', hand: pick.i, row: 'back', slot: b } });
    }
    if (pick.where === 'back') {
      buttons.push({ label: t('Strike ({n})', { n: c && c.kind === 'species' ? c.stats.attack : 0 }), a: { type: 'strike', slot: pick.i } });
      buttons.push({ label: t('Swim: reveal {n}', { n: c && c.kind === 'species' ? c.stats.swim : 0 }), a: { type: 'swim', slot: pick.i } });
      const f = mine.front.findIndex((x) => !x);
      if (f >= 0) buttons.push({ label: t('Move to front line'), a: { type: 'advance', from: pick.i, to: f } });
    }
    if (pick.where === 'oppFront') {
      buttons.push({ label: t('Challenge: level {l}, {s} s', { l: levelFor(state, me, g), s: secondsFor(state, me) }), a: { type: 'challenge', slot: pick.i } });
    }
    const usable = buttons.filter((b) => legal(state, me, b.a));
    return (
      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <BoneWarCard card={c} width={130} faceDown={!face} cardStyle={ours ? undefined : oppStyle} art={ours ? undefined : oppArt} />
        <View style={{ flex: 1, gap: 8 }}>
          {face && c?.kind === 'species' && (
            <Text style={st.rowSub}>
              {t('⚔️ Attack {a} · 🛡️ Defence {d} · ⚡ Speed {s} · 🏊 Swim {w}', { a: c.stats.attack, d: c.stats.defence, s: c.stats.speed, w: c.stats.swim })}
            </Text>
          )}
          {face && c?.kind === 'extinction' && <Text style={st.rowSub}>{t('Front line only. Wipes out the opponent’s animals that died in it if they answer wrong.')}</Text>}
          {!face && <Text style={st.rowSub}>{t('Face down. Challenge it to find out what it is, or reveal it with a swimmer.')}</Text>}
          {pick.where === 'back' && g.playedTurn === state.round && <Text style={st.rowSub}>{t('Just played: it can strike next turn.')}</Text>}
          {myTurn &&
            usable.map((b) => (
              <Pressable
                key={b.label}
                onPress={() => {
                  act(b.a);
                  setPick(null);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [st.button, { paddingVertical: 8 }, pressed && st.pressed]}>
                <Text style={st.buttonText}>{b.label}</Text>
              </Pressable>
            ))}
          {myTurn && pick.where === 'hand' && <Text style={st.muted}>{t('Or tap an empty slot to place it.')}</Text>}
        </View>
      </View>
    );
  };

  const hp = (p: typeof mine, who: string, look?: Look) => (
    <View style={styles.hpRow}>
      <Text style={[st.rowTitle, { flex: 1 }, look && { color: look.text }]} numberOfLines={1}>
        {who}
      </Text>
      <View
        style={[styles.hpTrack, { backgroundColor: (look ?? palette).track }]}
        accessibilityRole="progressbar"
        accessibilityLabel={t('{name}: {hp} of {max} HP', { name: who, hp: p.hp, max: START_HP })}>
        <View style={{ width: `${(Math.max(0, p.hp) / START_HP) * 100}%`, height: '100%', borderRadius: 6, backgroundColor: p.hp > START_HP / 2 ? palette.good : p.hp > START_HP / 4 ? '#E0A030' : palette.bad }} />
      </View>
      <Text style={[st.rowTitle, { minWidth: 56, textAlign: 'right' }, look && { color: look.text }]}>
        {p.hp}/{START_HP}
      </Text>
    </View>
  );

  if (state.over) {
    const won = state.winner === me;
    return (
      <View style={[st.screen, st.content, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <Text style={{ fontSize: 56 }}>{state.winner === null ? '🤝' : won ? '🏆' : '🦴'}</Text>
        <Text style={st.title}>{state.winner === null ? t('A draw') : won ? t('You won the Bone War!') : t('{name} won this time', { name: theirs.name })}</Text>
        <Text style={st.muted}>{state.log.slice(-1)[0]}</Text>
        <Pressable onPress={onExit} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>{t('Back to Bone War')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={st.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
        {/* Everything above the line is the opponent's, in their colours, edge to edge. */}
        <View style={{ backgroundColor: oppLook.background, paddingTop: insets.top + 6 }}>
        <View style={[styles.board, { width: W + 24, alignSelf: 'center' }]}>
          <Pressable
            onPress={() => {
              setPick(null);
              act({ type: 'forfeit' });
            }}
            accessibilityRole="button"
            accessibilityHint={t('Ends the game and gives the win to your opponent')}
            hitSlop={8}
            style={{ alignSelf: 'flex-start' }}>
            <Text style={[st.rowSub, { color: oppLook.muted }]}>{t('🏳 Forfeit')}</Text>
          </Pressable>
          {hp(theirs, theirs.name, oppLook)}
          <Text style={[st.muted, { color: oppLook.muted }]}>
            {t('Hand {h} · deck {d} · defence {def} · speed {s}', { h: theirs.hand.length, d: theirs.deck.length, def: backMax(theirs, 'defence'), s: backTotal(theirs, 'speed') })}
          </Text>
          {row(theirs.back, 'oppBack', (g) => g.seen, backW, oppStyle, oppLook.border)}
          {row(theirs.front, 'oppFront', (g) => g.seen, slotW, oppStyle, oppLook.border)}
        </View>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.accent }]} />
        <View style={[styles.board, { width: W + 24, alignSelf: 'center' }]}>
        {row(mine.front, 'front', () => true, slotW)}
        {row(mine.back, 'back', () => true, backW)}
        {hp(mine, mine.name)}
        <Text style={st.muted}>
          {state.turn === me
            ? t('Your turn · {n} actions left · deck {d}', { n: state.actions, d: mine.deck.length })
            : t('{name} is playing…', { name: theirs.name })}
          {state.finalTurns !== null ? ` · ${t('{n} turns left', { n: state.finalTurns })}` : ''}
        </Text>
        <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
          {mine.hand.map((g, i) => card(g, true, handW, undefined, () => setPick({ where: 'hand', i }), pick?.where === 'hand' && pick.i === i, `hand-${g.uid}`))}
        </ScrollView>
        {panel()}
        <Text style={st.muted} numberOfLines={2}>
          {state.log.slice(-1)[0] ?? t('Tap a card in your hand to play it.')}
        </Text>
        {myTurn && (
          <Pressable
            onPress={() => {
              setPick(null);
              act({ type: 'end' });
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{t('End turn')}</Text>
          </Pressable>
        )}
        </View>
      </ScrollView>
      {state.pending && state.pending.answerer === me && <QuestionOverlay key={state.seq} state={state} asked={asked} art={state.pending.card.uid.startsWith(`${opp}-`) ? oppArt : undefined} onAnswer={(correct) => act({ type: 'answer', correct })} />}
      {state.pending && state.pending.answerer !== me && (
        <View style={[styles.waiting, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={st.rowTitle}>{t('{name} is answering…', { name: theirs.name })}</Text>
        </View>
      )}
    </View>
  );
}

// The question for a challenge, extinction or saving throw, with a countdown.
function QuestionOverlay({ state, asked, art, onAnswer }: { state: GameState; asked: Set<string>; art?: Record<string, string>; onAnswer: (correct: boolean) => void }) {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const own = useOwnPicture();
  const insets = useSafeAreaInsets();
  const p = state.pending!;
  // A question about the opponent's card shows their photo of the animal, if they have one.
  const imageFor = useCallback((id: string) => (art ? art[id] : own(id)) ?? imageOf(id)?.thumb, [own, art]);
  const [q] = useState<Question | null>(() => {
    const made = questionAbout(p.card.key, p.level, imageFor, asked);
    if (made) asked.add(made.id);
    return made;
  });
  const [left, setLeft] = useState(p.seconds);
  const [chosen, setChosen] = useState<number | null>(null);

  useEffect(() => {
    if (chosen !== null || left <= 0) return;
    const id = setTimeout(() => {
      setLeft((x) => x - 1);
      // Out of time counts as a wrong answer.
      if (left <= 1) setChosen(-1);
    }, 1000);
    return () => clearTimeout(id);
  }, [left, chosen]);

  const card = cardFor(p.card.key, p.card.stars);
  const why =
    p.purpose === 'challenge'
      ? t('Challenge: answer right to knock this card out.')
      : p.purpose === 'extinction'
        ? t('Extinction! Answer right, or lose every animal you have in play that it wiped out.')
        : t('Saving question: answer right, or the extinction blows back on you.');

  if (!q) {
    // No question could be made: count it as answered right.
    return (
      <View style={[styles.overlay, { backgroundColor: palette.background }]}>
        <Text style={st.text}>{t('No question was available for this card, so it counts as answered.')}</Text>
        <Pressable onPress={() => onAnswer(true)} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
          <Text style={st.buttonText}>{t('Continue')}</Text>
        </Pressable>
      </View>
    );
  }
  const right = chosen === q.answer;
  return (
    <ScrollView style={[styles.overlay, { backgroundColor: palette.background }]} contentContainerStyle={{ gap: 10, padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}>
      <Text style={[st.rowTitle, { color: palette.accent }]}>{why}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: palette.track }}>
          <View style={{ width: `${(Math.max(0, left) / p.seconds) * 100}%`, height: 8, borderRadius: 4, backgroundColor: left <= 5 ? palette.bad : palette.accent }} />
        </View>
        <Text style={st.rowTitle}>{chosen === null ? `${left}s` : ''}</Text>
      </View>
      <Text style={st.muted}>{t('Level {l}', { l: p.level })}</Text>
      {q.image && <Image source={{ uri: q.image }} style={{ width: '100%', height: 180, borderRadius: 10 }} contentFit="contain" />}
      <Text style={st.title}>{q.prompt}</Text>
      {q.hints?.map((h) => (
        <Text key={h} style={st.muted}>
          {h}
        </Text>
      ))}
      {q.options.map((o, i) => {
        const shown = chosen !== null;
        const bg = shown && i === q.answer ? palette.goodBg : shown && i === chosen ? palette.badBg : palette.card;
        return (
          <Pressable
            key={o}
            disabled={shown}
            onPress={() => setChosen(i)}
            accessibilityRole="button"
            style={({ pressed }) => [st.card, { padding: 12, backgroundColor: bg }, pressed && st.pressed]}>
            <Text style={st.text}>{o}</Text>
          </Pressable>
        );
      })}
      {chosen !== null && (
        <>
          <Text style={[st.rowTitle, { color: right ? palette.good : palette.bad }]}>{chosen === -1 ? t('Out of time!') : right ? t('Right!') : t('Not quite.')}</Text>
          <Text style={st.text}>{q.explanation}</Text>
          {card && <Text style={st.muted}>{t('The card was {name}.', { name: card.kind === 'species' ? card.species.common || card.species.name : card.event.name })}</Text>}
          <Pressable onPress={() => onAnswer(right)} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{t('Continue')}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  board: { padding: 12, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  empty: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 8 },
  divider: { height: 2 },
  hpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hpTrack: { flex: 1.4, height: 12, borderRadius: 6, overflow: 'hidden' },
  panel: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  hiddenTag: { position: 'absolute', right: 2, bottom: 2, fontSize: 10 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  waiting: { position: 'absolute', left: 16, right: 16, bottom: 24, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
});
