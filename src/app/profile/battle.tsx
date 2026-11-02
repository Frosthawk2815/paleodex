import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { PlayerAvatar } from '@/components/player-avatar';
import { AvatarImage, useProfileStyles } from '@/components/profile-ui';
import { categoryName, QuizPicker } from '@/components/quiz-picker';
import { QuestionView } from '@/components/quiz-question';
import { usePalette } from '@/hooks/use-palette';
import { type SharedAvatar, shareableAvatar } from '@/lib/battle/avatar';
import { type Link, type LinkState, newBattleCode, openLink } from '@/lib/battle/link';
import { imageOf } from '@/lib/images';
import { useProfile } from '@/lib/profile';
import { type Category, categoryKey, categorySize, DIFFICULTIES, type Difficulty, fiftyFifty, makeRound, type Question, replacementQuestion, switcherooQuiz } from '@/lib/quiz';
import { titleById } from '@/lib/titles';
import { toImperial } from '@/lib/units';
import { useOwnPicture } from '@/lib/user-photos';
import { type T, useT } from '@/lib/i18n';

type Pick = { category: Category; level: Difficulty };
type Role = 'host' | 'guest';
type Progress = { answered: number; score: number; done: boolean };
type PlayStage = Extract<Stage, { kind: 'play' }>;

// Seconds to answer each Bone War question.
const QUESTION_SECONDS = 30;

type Stage =
  | { kind: 'start' }
  | { kind: 'host'; code: string; status: 'connecting' | 'waiting' | 'joining' }
  | { kind: 'join'; status: 'idle' | 'connecting' }
  | { kind: 'pick' }
  // Both players are ready: show both choices, and if they differ, roll for odds or evens.
  | { kind: 'decide'; host: Pick; guest: Pick; roll: number | null; chosen: Pick }
  // hidden: answers removed by 50/50; switched: questions the other player changed, with where from.
  // picked is -1 when time ran out. deadline: when the 30 seconds for this question end. waiting:
  // this player is ready to move on but the other hasn't answered yet.
  | {
      kind: 'play';
      questions: Question[];
      chosen: Pick;
      index: number;
      picked: number | null;
      score: number;
      hidden: number[];
      switched: Record<number, string>;
      deadline: number;
      waiting: boolean;
    }
  | { kind: 'result'; chosen: Pick; score: number; total: number }
  | { kind: 'ended'; message: string };

const samePick = (a: Pick, b: Pick) => categoryKey(a.category) === categoryKey(b.category) && a.level === b.level;
const pickText = (p: Pick, t: T) => t('{quiz}, level {level} ({difficulty})', { quiz: categoryName(p.category, t), level: p.level, difficulty: t(DIFFICULTIES[p.level - 1]!.name) });
// Who goes first in the roll: the host has odds, the guest evens.
const winnerOf = (n: number): Role => (n % 2 === 1 ? 'host' : 'guest');

const ERRORS: Record<Extract<LinkState, { kind: 'error' }>['reason'], string> = {
  'code-taken': 'That battle code is already in use. Try hosting again for a new one.',
  'no-host': 'No game was found with that code. Check the code with the other player, and that their game is still waiting.',
  failed: 'The phones couldn’t connect to each other. Some mobile and work networks block direct connections: try both being on Wi-Fi.',
  server: 'The connection service couldn’t be reached. Check your internet connection and try again.',
};

// Bone War: two players on different phones, connected directly (peer to peer) with a battle
// code, answer the same ten questions.
export default function BattleScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, reduceMotion } = useProfile();
  const ownPicture = useOwnPicture();
  // Questions come from the host with PaleoDex's pictures; each player sees their own photo of the
  // animal instead, if they have one (photos never leave the phone).
  const withMyPhoto = (q: Question): Question => {
    if (!q.image || !q.speciesId) return q;
    const own = ownPicture(q.speciesId);
    return own ? { ...q, image: own } : q;
  };
  const [stage, setStage] = useState<Stage>({ kind: 'start' });
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState<Category>({ kind: 'dinosaurs' });
  const [level, setLevel] = useState<Difficulty>(1);
  const [ready, setReady] = useState(false);
  const [theirPick, setTheirPick] = useState<Pick | null>(null);
  // The other player's profile: name, title and picture (sent when the phones connect).
  const [them, setThem] = useState<{ name: string; title: string; avatar: SharedAvatar }>({ name: '', title: '', avatar: null });
  const [mine, setMine] = useState<SharedAvatar>(null);
  const [theirProgress, setTheirProgress] = useState<Progress>({ answered: 0, score: 0, done: false });
  const [shown, setShown] = useState<number | null>(null);
  // Lifelines used this game (each once per quiz), the other player's answers (for Copy), and a
  // message about a Switcheroo.
  const [used, setUsed] = useState({ fifty: false, copy: false, swap: false, hurry: false });
  const [theirAnswers, setTheirAnswers] = useState<Record<number, { qid: string; choice: number }>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const timeUp = useRef<() => void>(() => {});

  const link = useRef<Link | null>(null);
  const [role, setRole] = useState<Role>('host');
  const handle = useRef<(msg: Record<string, unknown>) => void>(() => {});
  const onState = useRef<(s: LinkState) => void>(() => {});
  const myName = profile.name.trim();
  // The other player's name, or if they haven't set one, "the host" or "the challenger": `who`
  // mid-sentence, `Who` at the start of one.
  const fallback = role === 'host' ? t('the challenger') : t('the host');
  const who = them.name || fallback;
  const Who = them.name || fallback.charAt(0).toUpperCase() + fallback.slice(1);
  // Set once the host has decided, so a late message can't start a second round.
  const deciding = useRef(false);
  const myPick: Pick = { category, level };

  // Close the connection when leaving the screen.
  useEffect(() => () => link.current?.close(), []);

  const connect = async (r: Role, c: string) => {
    // A small copy of my picture, ready to send when the phones connect.
    setMine(await shareableAvatar(profile.avatar, ownPicture));
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

  // Answer the current question (-1: time ran out), and tell the other player.
  const answer = (i: number) => {
    if (stage.kind !== 'play' || stage.picked !== null) return;
    const q = stage.questions[stage.index];
    if (!q) return;
    const score = stage.score + (i === q.answer ? 1 : 0);
    setStage({ ...stage, picked: i, score, hidden: stage.hidden.filter((h) => h !== i) });
    link.current?.send({ t: 'progress', answered: stage.index + 1, score, index: stage.index, qid: q.id, choice: i });
  };
  const advance = (p: PlayStage) => {
    setNotice(null);
    if (p.index + 1 < p.questions.length) {
      setStage({ ...p, index: p.index + 1, picked: null, hidden: [], deadline: Date.now() + QUESTION_SECONDS * 1000, waiting: false });
    } else {
      link.current?.send({ t: 'done', score: p.score });
      setStage({ kind: 'result', chosen: p.chosen, score: p.score, total: p.questions.length });
    }
  };
  // Both players move on together: once both have answered (or run out of time).
  const next = () => {
    if (stage.kind !== 'play') return;
    if (theirAnswers[stage.index] !== undefined) advance(stage);
    else setStage({ ...stage, waiting: true });
  };

  const startPlay = (questions: Question[], chosen: Pick) => {
    setUsed({ fifty: false, copy: false, swap: false, hurry: false });
    setTheirAnswers({});
    setNotice(null);
    setTheirProgress({ answered: 0, score: 0, done: false });
    setStage({ kind: 'play', questions, chosen, index: 0, picked: null, score: 0, hidden: [], switched: {}, deadline: Date.now() + QUESTION_SECONDS * 1000, waiting: false });
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
        startPlay(questions, chosen);
      },
      roll === null ? 2000 : 4500,
    );
  };

  useEffect(() => {
    onState.current = (s) => {
      if (s.kind === 'waiting') setStage((x) => (x.kind === 'host' ? { ...x, status: 'waiting' } : x));
      else if (s.kind === 'connecting') setStage((x) => (x.kind === 'host' && x.status === 'waiting' ? { ...x, status: 'joining' } : x));
      else if (s.kind === 'open') {
        link.current?.send({ t: 'hello', name: myName, title: titleById(profile.title)?.name ?? '', avatar: mine });
        backToPick();
      } else if (s.kind === 'error') setStage({ kind: 'ended', message: t(ERRORS[s.reason]) });
      else if (s.kind === 'closed') setStage((x) => (x.kind === 'ended' || x.kind === 'start' ? x : { kind: 'ended', message: t('{who} has left the game.', { who: Who }) }));
    };
    timeUp.current = () => answer(-1);
    handle.current = (m) => {
      switch (m.t) {
        case 'hello':
          setThem({
            name: typeof m.name === 'string' ? m.name.trim().slice(0, 30) : '',
            title: typeof m.title === 'string' ? m.title.slice(0, 40) : '',
            avatar: (m.avatar as SharedAvatar) ?? null,
          });
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
          startPlay(m.questions as Question[], m.chosen as Pick);
          break;
        case 'progress':
          setTheirProgress((p) => ({ ...p, answered: Number(m.answered) || 0, score: Number(m.score) || 0 }));
          if (typeof m.qid === 'string' && typeof m.index === 'number' && typeof m.choice === 'number') {
            setTheirAnswers((a) => ({ ...a, [m.index as number]: { qid: m.qid as string, choice: m.choice as number } }));
            // I was waiting for them to answer this question: move on now.
            if (stage.kind === 'play' && stage.waiting && m.index === stage.index) advance(stage);
          }
          break;
        case 'switch': {
          // Switcheroo from the other player.
          const question = m.question as Question | null;
          const label = String(m.label ?? '');
          if (stage.kind !== 'play' || !question) {
            link.current?.send({ t: 'switch-missed' });
            break;
          }
          // My next question, or on the last question, the one on screen. If I had already
          // answered it, that answer no longer counts and I get the new question instead.
          const last = stage.index + 1 >= stage.questions.length;
          const target = last ? stage.index : stage.index + 1;
          const switched = { ...stage, questions: stage.questions.map((x, i) => (i === target ? question : x)), switched: { ...stage.switched, [target]: label } };
          if (last) {
            const hadAnswered = stage.picked !== null;
            const lost = stage.picked !== null && stage.picked === stage.questions[stage.index]?.answer ? 1 : 0;
            // A switched question on screen gets a fresh 30 seconds.
            setStage({ ...switched, picked: null, score: stage.score - lost, hidden: [], waiting: false, deadline: Date.now() + QUESTION_SECONDS * 1000 });
            if (lost) link.current?.send({ t: 'score', score: stage.score - lost });
            setNotice(`🔀 ${t('{who} used Switcheroo!', { who: Who })} ${hadAnswered ? t('Your answer doesn’t count: here’s a new last question.') : t('Your last question has been switched.')}`);
          } else {
            setStage(switched);
            setNotice(`🔀 ${t('{who} used Switcheroo! Your next question is now from {quiz}.', { who: Who, quiz: label })}`);
          }
          break;
        }
        case 'hurry':
          // Hurry Up: my time for this question is cut in half.
          if (stage.kind === 'play' && m.index === stage.index && stage.picked === null) {
            const left = Math.max(1000, (stage.deadline - Date.now()) / 2);
            setStage({ ...stage, deadline: Date.now() + left });
            setNotice(`⏳ ${t('{who} used Hurry Up! Your time has been cut in half.', { who: Who })}`);
          }
          break;
        case 'switch-missed':
          setUsed((x) => ({ ...x, swap: false }));
          setNotice(t('Too late: {who} had already reached their last question, so your Switcheroo is back.', { who }));
          break;
        case 'score':
          setTheirProgress((p) => ({ ...p, score: Number(m.score) || 0 }));
          break;
        case 'done':
          setTheirProgress((p) => ({ ...p, score: Number(m.score) || 0, done: true }));
          break;
        case 'again':
          if (stage.kind === 'result') backToPick();
          else setTheirPick(null);
          break;
        case 'bye':
          setStage((x) => (x.kind === 'ended' ? x : { kind: 'ended', message: t('{who} has left the game.', { who: Who }) }));
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

  // The question timer: ticks while the current question is unanswered, and answers it as
  // "time's up" when the 30 seconds run out.
  const deadline = stage.kind === 'play' && stage.picked === null ? stage.deadline : null;
  useEffect(() => {
    if (deadline === null) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= deadline) timeUp.current();
    }, 250);
    return () => clearInterval(id);
  }, [deadline]);

  const setMyReady = (on: boolean) => {
    setReady(on);
    link.current?.send({ t: 'pick', pick: on ? myPick : null });
    if (on && role === 'host' && theirPick) decide(myPick, theirPick);
  };

  // ---- Screens ----

  if (stage.kind === 'start') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>{t('Play someone on another phone: you both answer the same ten questions, and the higher score wins.')}</Text>
        <Text style={st.muted}>
          {t('Named after the Bone Wars of the late 1800s, when rival fossil hunters Edward Drinker Cope and Othniel Marsh raced, spied on and sabotaged each other to find new dinosaurs. Between them they named more than 130 new species, from Stegosaurus and Triceratops to Camarasaurus.')}
        </Text>
        <Pressable onPress={host} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Host a game')}</Text>
            <Text style={st.rowSub}>{t('Get a battle code to send to the other player')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'join', status: 'idle' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{t('Join a game')}</Text>
            <Text style={st.rowSub}>{t('Enter the battle code you were sent')}</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <View style={[st.card, { padding: 14, gap: 4 }]}>
          <Text style={st.rowTitle}>{t('🔒 How the connection works')}</Text>
          <Text style={st.rowSub}>
            {t('The two phones connect directly to each other. To find each other they briefly use a free public connection service (PeerJS) and Google’s address lookup (STUN), which see your internet address, as any website does. Once connected, your choices, questions and answers go only between the two phones, and nothing is stored.')}
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
        <Text style={st.heading}>{t('Your battle code')}</Text>
        <Text style={[st.title, { fontSize: 44, letterSpacing: 8, fontVariant: ['tabular-nums'] }]} accessibilityLabel={t('Battle code {code}', { code: stage.code.split('').join(' ') })} selectable>
          {stage.code}
        </Text>
        <Pressable onPress={copy} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
          <Text style={st.buttonText}>{copied ? t('Copied!') : t('📋 Copy code')}</Text>
        </Pressable>
        <Text style={[st.text, { textAlign: 'center' }]}>{t('Send this code to the other player. They choose Join a game and type it in.')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLiveRegion="polite">
          <ActivityIndicator color={palette.link} />
          <Text style={st.muted}>{stage.status === 'connecting' ? t('Setting up…') : stage.status === 'joining' ? t('Someone is joining…') : t('Waiting for someone to join…')}</Text>
        </View>
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>{t('Cancel')}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'join') {
    const valid = /^\d{6}$/.test(code);
    const busy = stage.status === 'connecting';
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <Text style={st.heading}>{t('Enter the battle code')}</Text>
        <TextInput
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          placeholder={t('6-digit code')}
          placeholderTextColor={palette.muted}
          keyboardType="number-pad"
          maxLength={6}
          editable={!busy}
          autoFocus
          style={[st.input, { fontSize: 28, letterSpacing: 6, textAlign: 'center' }]}
          accessibilityLabel={t('Battle code')}
          onSubmitEditing={() => valid && !busy && join()}
        />
        <Pressable
          onPress={join}
          disabled={!valid || busy}
          accessibilityRole="button"
          accessibilityState={{ disabled: !valid || busy, busy }}
          style={({ pressed }) => [st.button, pressed && st.pressed, (!valid || busy) && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>{busy ? t('Connecting…') : t('Join')}</Text>
        </Pressable>
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>{t('Cancel')}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'pick') {
    const size = categorySize(category);
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        <View style={[st.card, { padding: 14, gap: 4 }]} accessibilityLiveRegion="polite">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <PlayerAvatar name={them.name} avatar={them.avatar} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={st.rowTitle}>⚔️ {t('Connected to {who}', { who })}</Text>
              {!!them.title && <Text style={st.rowSub}>{them.title}</Text>}
            </View>
          </View>
          <Text style={st.rowSub}>
            {theirPick ? t('{who} has chosen and is ready.', { who: Who }) : t('{who} is choosing.', { who: Who })}{' '}
            {role === 'host' ? t('If you choose differently, a roll of odds or evens decides: you have odds.') : t('If you choose differently, a roll of odds or evens decides: you have evens.')}
          </Text>
        </View>
        {ready ? (
          <View style={[st.card, { padding: 14, gap: 8 }]}>
            <Text style={st.rowTitle}>{t('Your choice: {quiz}', { quiz: pickText(myPick, t) })}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color={palette.link} />
              <Text style={st.muted}>{t('Waiting for {who}…', { who })}</Text>
            </View>
            <Pressable onPress={() => setMyReady(false)} accessibilityRole="button" hitSlop={6}>
              <Text style={st.link}>{t('Change my choice')}</Text>
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
              <Text style={st.buttonText}>{t('Ready: {quiz}, level {level}', { quiz: categoryName(category, t), level })}</Text>
            </Pressable>
            {size < 8 && <Text style={st.muted}>{t('Choose a group or period first.')}</Text>}
          </>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>{t('Leave the game')}</Text>
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
            <Text style={[st.title, { textAlign: 'center' }]}>{t('You both chose the same!')}</Text>
            <Text style={st.text}>{pickText(stage.chosen, t)}</Text>
          </>
        ) : (
          <>
            <Text style={st.heading}>{t('You chose different quizzes')}</Text>
            <View style={[st.card, { alignSelf: 'stretch' }]}>
              <View style={st.row}>
                <AvatarImage avatar={profile.avatar} name={profile.name} size={36} />
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{me === 'host' ? t('You (odds)') : t('You (evens)')}</Text>
                  <Text style={st.rowSub}>{pickText(mine, t)}</Text>
                </View>
              </View>
              <View style={st.divider} />
              <View style={st.row}>
                <PlayerAvatar name={them.name} avatar={them.avatar} size={36} />
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{me === 'host' ? t('{who} (evens)', { who: Who }) : t('{who} (odds)', { who: Who })}</Text>
                  <Text style={st.rowSub}>{pickText(theirs, t)}</Text>
                </View>
              </View>
            </View>
            <Text style={[st.title, { fontSize: 64, fontVariant: ['tabular-nums'] }]} accessibilityLabel={landed ? t('The number is {n}', { n: stage.roll ?? '' }) : t('Rolling a number')}>
              {display ?? '–'}
            </Text>
            {landed && (
              <Text style={[st.title, { textAlign: 'center' }]} accessibilityLiveRegion="polite">
                {stage.roll % 2 === 1 ? t('Odd') : t('Even')}: {iWon ? t('your quiz wins!') : t('{who}’s quiz wins!', { who })}
              </Text>
            )}
            {landed && <Text style={st.text}>{pickText(stage.chosen, t)}</Text>}
          </>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator color={palette.link} />
          <Text style={st.muted}>{t('Starting…')}</Text>
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
          <Text style={st.text}>{t('There weren’t enough questions for this choice. Choose again.')}</Text>
          <Pressable onPress={backToPick} accessibilityRole="button">
            <Text style={st.link}>{t('Back')}</Text>
          </Pressable>
        </View>
      );
    }
    // Copy works once the other player has answered this same question (not one they were
    // switched, and not one where their time ran out).
    const theirAnswer = theirAnswers[stage.index];
    const canCopy = !!theirAnswer && theirAnswer.qid === q.id && theirAnswer.choice >= 0;
    // Switcheroo changes the other player's next question, or on the last question, their current
    // one, even if they have answered it (that answer then doesn't count).
    const last = stage.index === total - 1;
    const canSwap = !theirProgress.done;
    const secondsLeft = Math.max(0, Math.min(QUESTION_SECONDS, Math.ceil((stage.deadline - now) / 1000)));
    const choose = answer;
    return (
      <QuestionView
        q={withMyPhoto(q)}
        index={stage.index}
        total={total}
        score={stage.score}
        chosen={stage.picked}
        onChoose={choose}
        onNext={next}
        nextLabel={stage.waiting ? t('Waiting for {who} to answer…', { who }) : stage.index + 1 < total ? t('Next question') : t('See the result')}
        nextDisabled={stage.waiting}
        allowReadMore={false}
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
            key: 'copy',
            icon: '👀',
            label: t('Copy'),
            hint: canCopy ? t('Use {who}’s answer', { who }) : t('Once {who} has answered', { who }),
            used: used.copy,
            available: canCopy,
            onPress: () => {
              if (!theirAnswer) return;
              setUsed((x) => ({ ...x, copy: true }));
              choose(theirAnswer.choice);
            },
          },
          {
            key: 'hurry',
            icon: '⏳',
            label: t('Hurry Up'),
            hint: t('Halve {who}’s time', { who }),
            afterAnswer: true,
            used: used.hurry,
            available: theirAnswers[stage.index] === undefined && !theirProgress.done,
            onPress: () => {
              setUsed((x) => ({ ...x, hurry: true }));
              link.current?.send({ t: 'hurry', index: stage.index });
              setNotice(`⏳ ${t('Hurry Up sent: {who}’s time for this question is cut in half.', { who })}`);
            },
          },
          {
            key: 'swap',
            icon: '🔀',
            label: t('Switcheroo'),
            hint: last ? t('Change {who}’s last question', { who }) : t('Change {who}’s next question', { who }),
            used: used.swap,
            available: canSwap,
            onPress: () => {
              const target = switcherooQuiz(myPick, stage.chosen);
              const question = replacementQuestion(target.category, target.level, (id) => imageOf(id)?.thumb, stage.questions, toImperial);
              if (!question) return;
              const label = t('{quiz}, level {level}', { quiz: categoryName(target.category, t), level: target.level });
              setUsed((x) => ({ ...x, swap: true }));
              link.current?.send({ t: 'switch', index: theirProgress.answered, question, label });
              // On the last question their earlier answer no longer counts: wait for their new one.
              if (last) setTheirAnswers((a) => Object.fromEntries(Object.entries(a).filter(([k]) => Number(k) !== stage.index)));
              setNotice(`🔀 ${last ? t('Switcheroo sent: {who}’s last question is now from {quiz}.', { who, quiz: label }) : t('Switcheroo sent: {who}’s next question is now from {quiz}.', { who, quiz: label })}`);
            },
          },
        ]}
        header={
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <PlayerAvatar name={them.name} avatar={them.avatar} size={24} />
              <Text style={[st.muted, { flex: 1 }]}>
                {theirAnswers[stage.index] !== undefined ? t('{who}: has answered · score {score}', { who: Who, score: theirProgress.score }) : t('{who}: still answering · score {score}', { who: Who, score: theirProgress.score })}
              </Text>
            </View>
            {stage.picked === null && (
              <View style={{ gap: 4 }} accessibilityLabel={t('{n} seconds left', { n: secondsLeft })} accessible>
                <Text style={[st.rowTitle, secondsLeft <= 5 && { color: palette.bad }]}>⏱️ {secondsLeft} s</Text>
                <View style={{ height: 4, borderRadius: 2, backgroundColor: palette.track, overflow: 'hidden' }}>
                  <View style={{ width: `${(secondsLeft / QUESTION_SECONDS) * 100}%`, height: '100%', backgroundColor: secondsLeft <= 5 ? palette.bad : palette.accent }} />
                </View>
              </View>
            )}
            {!!stage.switched[stage.index] && (
              <View style={[st.card, { padding: 10, borderColor: palette.accent, borderWidth: 2 }]}>
                <Text style={st.rowTitle}>
                  🔀 {t('Switched by {who}: {quiz}', { who, quiz: stage.switched[stage.index]! })}
                </Text>
              </View>
            )}
            {!!notice && (
              <Text style={[st.rowSub, { color: palette.accent }]} accessibilityLiveRegion="polite">
                {notice}
              </Text>
            )}
          </>
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
            <Text style={st.title}>{t('You scored {score} out of {total}', { score: stage.score, total: stage.total })}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLiveRegion="polite">
              <ActivityIndicator color={palette.link} />
              <Text style={st.muted}>
                {t('Waiting for {who} to finish ({n} of {total})…', { who, n: theirProgress.answered, total: stage.total })}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 56 }}>{outcome === 'win' ? '🏆' : outcome === 'draw' ? '🤝' : '🦴'}</Text>
            <Text style={st.title} accessibilityLiveRegion="polite">
              {outcome === 'win' ? t('You win!') : outcome === 'draw' ? t('It’s a draw!') : t('{who} wins!', { who: Who })}
            </Text>
            <View style={[st.card, { alignSelf: 'stretch' }]}>
              <View style={st.row}>
                <AvatarImage avatar={profile.avatar} name={profile.name} size={36} />
                <Text style={[st.rowTitle, { flex: 1 }]}>{t('You')}</Text>
                <Text style={st.rowTitle}>
                  {stage.score} / {stage.total}
                </Text>
              </View>
              <View style={st.divider} />
              <View style={st.row}>
                <PlayerAvatar name={them.name} avatar={them.avatar} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={st.rowTitle}>{Who}</Text>
                  {!!them.title && <Text style={st.rowSub}>{them.title}</Text>}
                </View>
                <Text style={st.rowTitle}>
                  {theirs} / {stage.total}
                </Text>
              </View>
            </View>
            <Text style={st.muted}>{pickText(stage.chosen, t)}</Text>
            <Pressable
              onPress={() => {
                link.current?.send({ t: 'again' });
                backToPick();
              }}
              accessibilityRole="button"
              style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
              <Text style={st.buttonText}>{t('Play again')}</Text>
            </Pressable>
          </>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>{t('Leave the game')}</Text>
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
        <Text style={st.buttonText}>{t('Back to Bone War')}</Text>
      </Pressable>
    </ScrollView>
  );
}
