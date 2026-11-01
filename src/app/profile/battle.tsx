import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { categoryName, QuizPicker } from '@/components/quiz-picker';
import { QuestionView } from '@/components/quiz-question';
import { usePalette } from '@/hooks/use-palette';
import { type Link, type LinkState, newBattleCode, openLink } from '@/lib/battle/link';
import { imageOf } from '@/lib/images';
import { useProfile } from '@/lib/profile';
import { type Category, categoryKey, categorySize, DIFFICULTIES, type Difficulty, makeRound, type Question } from '@/lib/quiz';
import { toImperial } from '@/lib/units';

type Pick = { category: Category; level: Difficulty };
type Role = 'host' | 'guest';
type Progress = { answered: number; score: number; done: boolean };

type Stage =
  | { kind: 'start' }
  | { kind: 'host'; code: string; status: 'connecting' | 'waiting' | 'joining' }
  | { kind: 'join'; status: 'idle' | 'connecting' }
  | { kind: 'pick' }
  // Both players are ready: show both choices, and if they differ, roll for odds or evens.
  | { kind: 'decide'; host: Pick; guest: Pick; roll: number | null; chosen: Pick }
  | { kind: 'play'; questions: Question[]; chosen: Pick; index: number; picked: number | null; score: number }
  | { kind: 'result'; chosen: Pick; score: number; total: number }
  | { kind: 'ended'; message: string };

const samePick = (a: Pick, b: Pick) => categoryKey(a.category) === categoryKey(b.category) && a.level === b.level;
const pickText = (p: Pick) => `${categoryName(p.category)}, level ${p.level} (${DIFFICULTIES[p.level - 1]!.name})`;
// Who goes first in the roll: the host has odds, the guest evens.
const winnerOf = (n: number): Role => (n % 2 === 1 ? 'host' : 'guest');

const ERRORS: Record<Extract<LinkState, { kind: 'error' }>['reason'], string> = {
  'code-taken': 'That battle code is already in use. Try hosting again for a new one.',
  'no-host': 'No game was found with that code. Check the code with your friend, and that their game is still waiting.',
  failed: 'The phones couldn’t connect to each other. Some mobile and work networks block direct connections: try both being on Wi-Fi.',
  server: 'The connection service couldn’t be reached. Check your internet connection and try again.',
};

// Head to head: two players on different phones, connected directly (peer to peer) with a battle
// code, answer the same ten questions.
export default function BattleScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const { profile, reduceMotion } = useProfile();
  const [stage, setStage] = useState<Stage>({ kind: 'start' });
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState<Category>({ kind: 'dinosaurs' });
  const [level, setLevel] = useState<Difficulty>(1);
  const [ready, setReady] = useState(false);
  const [theirPick, setTheirPick] = useState<Pick | null>(null);
  const [theirName, setTheirName] = useState('');
  const [theirProgress, setTheirProgress] = useState<Progress>({ answered: 0, score: 0, done: false });
  const [shown, setShown] = useState<number | null>(null);

  const link = useRef<Link | null>(null);
  const [role, setRole] = useState<Role>('host');
  const handle = useRef<(msg: Record<string, unknown>) => void>(() => {});
  const onState = useRef<(s: LinkState) => void>(() => {});
  const myName = profile.name.trim();
  // The other player's name, or "your friend": `who` mid-sentence, `Who` at the start of one.
  const who = theirName || 'your friend';
  const Who = theirName || 'Your friend';
  // Set once the host has decided, so a late message can't start a second round.
  const deciding = useRef(false);
  const myPick: Pick = { category, level };

  // Close the connection when leaving the screen.
  useEffect(() => () => link.current?.close(), []);

  const connect = (r: Role, c: string) => {
    setRole(r);
    link.current?.close();
    link.current = openLink(
      r,
      c,
      (s) => onState.current(s),
      (m) => handle.current(m),
    );
  };

  const host = () => {
    const c = newBattleCode();
    setStage({ kind: 'host', code: c, status: 'connecting' });
    connect('host', c);
  };
  const join = () => {
    setStage({ kind: 'join', status: 'connecting' });
    connect('guest', code);
  };
  const leave = () => {
    link.current?.close();
    link.current = null;
    if (router.canGoBack()) router.back();
    else router.replace('/profile/quiz');
  };
  const backToPick = () => {
    deciding.current = false;
    setReady(false);
    setTheirPick(null);
    setTheirProgress({ answered: 0, score: 0, done: false });
    setStage({ kind: 'pick' });
  };

  // The host decides once both players are ready, and builds the questions so both get the same.
  const decide = (mine: Pick, theirs: Pick) => {
    if (deciding.current) return;
    deciding.current = true;
    const roll = samePick(mine, theirs) ? null : 1 + Math.floor(Math.random() * 100);
    const chosen = roll === null || winnerOf(roll) === 'host' ? mine : theirs;
    link.current?.send({ t: 'decide', host: mine, guest: theirs, roll });
    setStage({ kind: 'decide', host: mine, guest: theirs, roll, chosen });
    setTimeout(
      () => {
        // Questions use PaleoDex's pictures (a player's own photos stay on their phone), and are
        // checked to read differently in both metric and imperial.
        const questions = makeRound(chosen.category, chosen.level, (id) => imageOf(id)?.thumb, 10, toImperial);
        link.current?.send({ t: 'start', questions, chosen });
        setStage({ kind: 'play', questions, chosen, index: 0, picked: null, score: 0 });
      },
      roll === null ? 2000 : 4500,
    );
  };

  useEffect(() => {
    onState.current = (s) => {
      if (s.kind === 'waiting') setStage((x) => (x.kind === 'host' ? { ...x, status: 'waiting' } : x));
      else if (s.kind === 'connecting') setStage((x) => (x.kind === 'host' && x.status === 'waiting' ? { ...x, status: 'joining' } : x));
      else if (s.kind === 'open') {
        if (myName) link.current?.send({ t: 'hello', name: myName });
        backToPick();
      } else if (s.kind === 'error') setStage({ kind: 'ended', message: ERRORS[s.reason] });
      else if (s.kind === 'closed') setStage((x) => (x.kind === 'ended' || x.kind === 'start' ? x : { kind: 'ended', message: `${Who} has left the game.` }));
    };
    handle.current = (m) => {
      switch (m.t) {
        case 'hello':
          if (typeof m.name === 'string' && m.name.trim()) setTheirName(m.name.trim().slice(0, 30));
          break;
        case 'pick': {
          const p = (m.pick as Pick | null) ?? null;
          setTheirPick(p);
          if (role === 'host' && p && ready && stage.kind === 'pick') decide(myPick, p);
          break;
        }
        case 'decide':
          setStage({ kind: 'decide', host: m.host as Pick, guest: m.guest as Pick, roll: m.roll as number | null, chosen: m.roll === null || winnerOf(m.roll as number) === 'host' ? (m.host as Pick) : (m.guest as Pick) });
          break;
        case 'start':
          setTheirProgress({ answered: 0, score: 0, done: false });
          setStage({ kind: 'play', questions: m.questions as Question[], chosen: m.chosen as Pick, index: 0, picked: null, score: 0 });
          break;
        case 'progress':
          setTheirProgress((p) => ({ ...p, answered: Number(m.answered) || 0, score: Number(m.score) || 0 }));
          break;
        case 'done':
          setTheirProgress((p) => ({ ...p, score: Number(m.score) || 0, done: true }));
          break;
        case 'again':
          if (stage.kind === 'result') backToPick();
          else setTheirPick(null);
          break;
        case 'bye':
          setStage((x) => (x.kind === 'ended' ? x : { kind: 'ended', message: `${Who} has left the game.` }));
          break;
      }
    };
  });

  // The number roll: flick through numbers, then land on the real one.
  const roll = stage.kind === 'decide' ? stage.roll : null;
  useEffect(() => {
    // With reduce motion on, the number is shown straight away (see below).
    if (roll === null || reduceMotion) return;
    let ticks = 0;
    const id = setInterval(() => {
      ticks++;
      if (ticks >= 18) {
        clearInterval(id);
        setShown(roll);
      } else setShown(1 + Math.floor(Math.random() * 100));
    }, 90);
    return () => clearInterval(id);
  }, [roll, reduceMotion]);

  const setMyReady = (on: boolean) => {
    setReady(on);
    link.current?.send({ t: 'pick', pick: on ? myPick : null });
    if (on && role === 'host' && theirPick) decide(myPick, theirPick);
  };

  // ---- Screens ----

  if (stage.kind === 'start') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>Play a friend on another phone: you both answer the same ten questions, and the higher score wins.</Text>
        <Pressable onPress={host} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <Text style={{ fontSize: 28 }}>🏕️</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Host a game</Text>
            <Text style={st.rowSub}>Get a battle code to send to your friend</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'join', status: 'idle' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <Text style={{ fontSize: 28 }}>🔑</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Join a game</Text>
            <Text style={st.rowSub}>Enter the battle code your friend sent you</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <View style={[st.card, { padding: 14, gap: 4 }]}>
          <Text style={st.rowTitle}>🔒 How the connection works</Text>
          <Text style={st.rowSub}>
            The two phones connect directly to each other. To find each other they briefly use a free public connection service (PeerJS) and Google’s address
            lookup (STUN), which see your internet address, as any website does. Once connected, your choices, questions and answers go only between the two
            phones, and nothing is stored.
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (stage.kind === 'host') {
    const copy = async () => {
      await Clipboard.setStringAsync(stage.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
        <Text style={st.heading}>Your battle code</Text>
        <Text style={[st.title, { fontSize: 44, letterSpacing: 8, fontVariant: ['tabular-nums'] }]} accessibilityLabel={`Battle code ${stage.code.split('').join(' ')}`} selectable>
          {stage.code}
        </Text>
        <Pressable onPress={copy} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>{copied ? 'Copied!' : '📋 Copy code'}</Text>
        </Pressable>
        <Text style={[st.text, { textAlign: 'center' }]}>Send this code to your friend. They choose Join a game and type it in.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLiveRegion="polite">
          <ActivityIndicator color={palette.link} />
          <Text style={st.muted}>{stage.status === 'connecting' ? 'Setting up…' : stage.status === 'joining' ? 'Your friend is joining…' : 'Waiting for your friend to join…'}</Text>
        </View>
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>Cancel</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'join') {
    const valid = /^\d{6}$/.test(code);
    const busy = stage.status === 'connecting';
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <Text style={st.heading}>Enter the battle code</Text>
        <TextInput
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit code"
          placeholderTextColor={palette.muted}
          keyboardType="number-pad"
          maxLength={6}
          editable={!busy}
          autoFocus
          style={[st.input, { fontSize: 28, letterSpacing: 6, textAlign: 'center' }]}
          accessibilityLabel="Battle code"
          onSubmitEditing={() => valid && !busy && join()}
        />
        <Pressable
          onPress={join}
          disabled={!valid || busy}
          accessibilityRole="button"
          accessibilityState={{ disabled: !valid || busy, busy }}
          style={({ pressed }) => [st.button, pressed && st.pressed, (!valid || busy) && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>{busy ? 'Connecting…' : 'Join'}</Text>
        </Pressable>
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>Cancel</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'pick') {
    const size = categorySize(category);
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <View style={[st.card, { padding: 14, gap: 4 }]} accessibilityLiveRegion="polite">
          <Text style={st.rowTitle}>⚔️ Connected to {who}</Text>
          <Text style={st.rowSub}>
            {theirPick ? `${Who} has chosen and is ready.` : `${Who} is choosing.`} If you choose differently, a roll of odds or evens decides:{' '}
            {role === 'host' ? 'you have odds' : 'you have evens'}.
          </Text>
        </View>
        {ready ? (
          <View style={[st.card, { padding: 14, gap: 8 }]}>
            <Text style={st.rowTitle}>Your choice: {pickText(myPick)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color={palette.link} />
              <Text style={st.muted}>Waiting for {who}…</Text>
            </View>
            <Pressable onPress={() => setMyReady(false)} accessibilityRole="button" hitSlop={6}>
              <Text style={st.link}>Change my choice</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <QuizPicker category={category} onCategory={setCategory} level={level} onLevel={setLevel} />
            <Pressable
              onPress={() => setMyReady(true)}
              disabled={size < 8}
              accessibilityRole="button"
              style={({ pressed }) => [st.button, pressed && st.pressed, size < 8 && { opacity: 0.5 }]}>
              <Text style={st.buttonText}>Ready: {categoryName(category)}, level {level}</Text>
            </Pressable>
            {size < 8 && <Text style={st.muted}>Choose a group or period first.</Text>}
          </>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>Leave the game</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'decide') {
    const me = role;
    const mine = me === 'host' ? stage.host : stage.guest;
    const theirs = me === 'host' ? stage.guest : stage.host;
    const display = reduceMotion ? stage.roll : shown;
    const landed = stage.roll === null || display === stage.roll;
    const iWon = stage.roll !== null && winnerOf(stage.roll) === me;
    return (
      <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
        {stage.roll === null ? (
          <>
            <Text style={{ fontSize: 48 }}>🤝</Text>
            <Text style={[st.title, { textAlign: 'center' }]}>You both chose the same!</Text>
            <Text style={st.text}>{pickText(stage.chosen)}</Text>
          </>
        ) : (
          <>
            <Text style={st.heading}>You chose different quizzes</Text>
            <View style={[st.card, { alignSelf: 'stretch' }]}>
              <View style={st.row}>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>You ({me === 'host' ? 'odds' : 'evens'})</Text>
                  <Text style={st.rowSub}>{pickText(mine)}</Text>
                </View>
              </View>
              <View style={st.divider} />
              <View style={st.row}>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>
                    {Who} ({me === 'host' ? 'evens' : 'odds'})
                  </Text>
                  <Text style={st.rowSub}>{pickText(theirs)}</Text>
                </View>
              </View>
            </View>
            <Text style={[st.title, { fontSize: 64, fontVariant: ['tabular-nums'] }]} accessibilityLabel={landed ? `The number is ${stage.roll}` : 'Rolling a number'}>
              {display ?? '–'}
            </Text>
            {landed && (
              <Text style={[st.title, { textAlign: 'center' }]} accessibilityLiveRegion="polite">
                {stage.roll % 2 === 1 ? 'Odd' : 'Even'}: {iWon ? 'your quiz wins!' : `${who}’s quiz wins!`}
              </Text>
            )}
            {landed && <Text style={st.text}>{pickText(stage.chosen)}</Text>}
          </>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator color={palette.link} />
          <Text style={st.muted}>Starting…</Text>
        </View>
      </ScrollView>
    );
  }

  if (stage.kind === 'play') {
    const q = stage.questions[stage.index];
    const total = stage.questions.length;
    if (!q) {
      return (
        <View style={[st.screen, st.content]}>
          <Text style={st.text}>There weren’t enough questions for this choice. Choose again.</Text>
          <Pressable onPress={backToPick} accessibilityRole="button">
            <Text style={st.link}>Back</Text>
          </Pressable>
        </View>
      );
    }
    const choose = (i: number) => {
      if (stage.picked !== null) return;
      const score = stage.score + (i === q.answer ? 1 : 0);
      setStage({ ...stage, picked: i, score });
      link.current?.send({ t: 'progress', answered: stage.index + 1, score });
    };
    const next = () => {
      if (stage.index + 1 < total) setStage({ ...stage, index: stage.index + 1, picked: null });
      else {
        link.current?.send({ t: 'done', score: stage.score });
        setStage({ kind: 'result', chosen: stage.chosen, score: stage.score, total });
      }
    };
    return (
      <QuestionView
        q={q}
        index={stage.index}
        total={total}
        score={stage.score}
        chosen={stage.picked}
        onChoose={choose}
        onNext={next}
        nextLabel={stage.index + 1 < total ? 'Next question' : 'See the result'}
        allowReadMore={false}
        header={
          <Text style={st.muted}>
            ⚔️ {Who}: {theirProgress.done ? 'finished' : `${theirProgress.answered} of ${total} answered`} · score {theirProgress.score}
          </Text>
        }
      />
    );
  }

  if (stage.kind === 'result') {
    const theirs = theirProgress.score;
    const waiting = !theirProgress.done;
    const outcome = stage.score > theirs ? 'win' : stage.score < theirs ? 'lose' : 'draw';
    return (
      <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
        {waiting ? (
          <>
            <Text style={{ fontSize: 56 }}>⏳</Text>
            <Text style={st.title}>
              You scored {stage.score} out of {stage.total}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLiveRegion="polite">
              <ActivityIndicator color={palette.link} />
              <Text style={st.muted}>
                Waiting for {who} to finish ({theirProgress.answered} of {stage.total})…
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 56 }}>{outcome === 'win' ? '🏆' : outcome === 'draw' ? '🤝' : '🦴'}</Text>
            <Text style={st.title} accessibilityLiveRegion="polite">
              {outcome === 'win' ? 'You win!' : outcome === 'draw' ? 'It’s a draw!' : `${Who} wins!`}
            </Text>
            <View style={[st.card, { alignSelf: 'stretch' }]}>
              <View style={st.row}>
                <Text style={[st.rowTitle, { flex: 1 }]}>You</Text>
                <Text style={st.rowTitle}>
                  {stage.score} / {stage.total}
                </Text>
              </View>
              <View style={st.divider} />
              <View style={st.row}>
                <Text style={[st.rowTitle, { flex: 1 }]}>{Who}</Text>
                <Text style={st.rowTitle}>
                  {theirs} / {stage.total}
                </Text>
              </View>
            </View>
            <Text style={st.muted}>{pickText(stage.chosen)}</Text>
            <Pressable
              onPress={() => {
                link.current?.send({ t: 'again' });
                backToPick();
              }}
              accessibilityRole="button"
              style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
              <Text style={st.buttonText}>Play again</Text>
            </Pressable>
          </>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>Leave the game</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Ended: an error or the other player left.
  return (
    <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
      <Text style={{ fontSize: 48 }}>🔌</Text>
      <Text style={[st.text, { textAlign: 'center' }]}>{stage.message}</Text>
      <Pressable
        onPress={() => {
          link.current = null;
          setStage({ kind: 'start' });
        }}
        accessibilityRole="button"
        style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
        <Text style={st.buttonText}>Back to head to head</Text>
      </Pressable>
    </ScrollView>
  );
}
