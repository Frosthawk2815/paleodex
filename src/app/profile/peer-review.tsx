import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { initialsOf, useProfileStyles } from '@/components/profile-ui';
import { categoryName, QuizPicker } from '@/components/quiz-picker';
import { QuestionView } from '@/components/quiz-question';
import { usePalette } from '@/hooks/use-palette';
import { type SharedAvatar, shareableAvatar } from '@/lib/battle/avatar';
import { type Hub, openHub } from '@/lib/battle/hub';
import { type Link, newBattleCode, openLink } from '@/lib/battle/link';
import { imageOf } from '@/lib/images';
import { useProfile } from '@/lib/profile';
import { type Category, categorySize, DIFFICULTIES, type Difficulty, fiftyFifty, makeRound, type Question, replacementQuestion, switcherooQuiz } from '@/lib/quiz';
import { titleById } from '@/lib/titles';
import { toImperial } from '@/lib/units';
import { useOwnPicture } from '@/lib/user-photos';

// Peer Review: one host and 2 to 29 other players (3 to 30 in all, about a classroom), five
// rounds of five questions on subjects the host chooses, with a leaderboard after each round.
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 30;
const ROUNDS = 5;
const PER_ROUND = 5;
const QUESTION_SECONDS = 30;
const HOST = 'host';

type Quiz = { category: Category; level: Difficulty };
type Player = { id: string; name: string; title: string; avatar: SharedAvatar; score: number; connected: boolean };
type Answer = { qid: string; choice: number };
type Used = { fifty: boolean; copy: boolean; swap: boolean; hurry: boolean };
type Stage =
  | { kind: 'start' }
  | { kind: 'join'; status: 'idle' | 'connecting' }
  | { kind: 'lobby' }
  | {
      kind: 'play';
      round: number;
      quiz: Quiz;
      questions: Question[];
      index: number;
      picked: number | null;
      hidden: number[];
      switched: Record<number, string>;
      deadline: number;
      waiting: boolean;
    }
  | { kind: 'board'; round: number }
  | { kind: 'ended'; message: string };
type PlayStage = Extract<Stage, { kind: 'play' }>;

const quizText = (q: Quiz) => `${categoryName(q.category)}, level ${q.level} (${DIFFICULTIES[q.level - 1]!.name})`;
const DEFAULT_ROUNDS: Quiz[] = [
  { category: { kind: 'dinosaurs' }, level: 1 },
  { category: { kind: 'mammals' }, level: 1 },
  { category: { kind: 'all' }, level: 2 },
  { category: { kind: 'dinosaurs' }, level: 3 },
  { category: { kind: 'all' }, level: 4 },
];
const NO_USED: Used = { fifty: false, copy: false, swap: false, hurry: false };

// A player's picture: their shrunken photo, PaleoDex's picture of their chosen species, or initials.
function PlayerAvatar({ player, size }: { player: Player; size: number }) {
  const palette = usePalette();
  const uri = player.avatar?.kind === 'image' ? player.avatar.uri : player.avatar?.kind === 'species' ? imageOf(player.avatar.id)?.thumb : undefined;
  const round = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={[round, { backgroundColor: palette.track }]} contentFit="cover" accessibilityLabel={`${player.name}’s picture`} />;
  return (
    <View style={[round, { backgroundColor: palette.link, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.38 }}>{initialsOf(player.name) || '🦖'}</Text>
    </View>
  );
}

export default function PeerReviewScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const { profile } = useProfile();
  const ownPicture = useOwnPicture();
  const [stage, setStage] = useState<Stage>({ kind: 'start' });
  const [role, setRole] = useState<'host' | 'guest'>('host');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [me, setMe] = useState(HOST);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Quiz[]>(DEFAULT_ROUNDS);
  const [editing, setEditing] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, Record<string, Answer>>>({});
  const [allIn, setAllIn] = useState<number[]>([]);
  const [used, setUsed] = useState<Used>(NO_USED);
  const [notice, setNotice] = useState<string | null>(null);
  const [targeting, setTargeting] = useState<'copy' | 'swap' | 'hurry' | null>(null);
  const [now, setNow] = useState(0);

  const hub = useRef<Hub | null>(null);
  const link = useRef<Link | null>(null);
  // Host only: which question each player got right, to undo a point after a last-question switch.
  const correct = useRef<Record<string, Record<string, boolean>>>({});
  const handle = useRef<(from: string, m: Record<string, unknown>) => void>(() => {});
  // The player list and answers, kept in refs as well as state so that messages arriving together
  // (many players answering at once) each build on the last instead of overwriting it.
  const playersRef = useRef<Player[]>([]);
  const answersRef = useRef<Record<number, Record<string, Answer>>>({});
  const putPlayers = (list: Player[]) => {
    playersRef.current = list;
    setPlayers(list);
  };
  const putAnswers = (a: Record<number, Record<string, Answer>>) => {
    answersRef.current = a;
    setAnswers(a);
  };
  const timeUp = useRef<() => void>(() => {});

  const myName = profile.name.trim();
  const myTitle = titleById(profile.title)?.name ?? '';
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? 'A player';

  useEffect(
    () => () => {
      hub.current?.close();
      link.current?.close();
    },
    [],
  );

  // ---- Messages. The host applies everything it broadcasts to itself too. ----

  const toHost = (m: object) => {
    if (role === 'host') handle.current(HOST, m as Record<string, unknown>);
    else link.current?.send(m);
  };
  const toAll = (m: object) => {
    hub.current?.broadcast(m);
    handle.current(HOST, { ...(m as Record<string, unknown>), _self: true });
  };
  const toPlayer = (id: string, m: object) => {
    if (id === HOST) handle.current(HOST, { ...(m as Record<string, unknown>), _self: true });
    else hub.current?.send(id, m);
  };

  const host = async () => {
    const c = newBattleCode();
    setRole('host');
    setMe(HOST);
    setCode(c);
    const avatar = await shareableAvatar(profile.avatar, ownPicture);
    putPlayers([{ id: HOST, name: myName || 'Host', title: myTitle, avatar, score: 0, connected: true }]);
    setStage({ kind: 'lobby' });
    hub.current = openHub(c, MAX_PLAYERS - 1, {
      onState: (s) => {
        if (s.kind === 'error') setStage({ kind: 'ended', message: s.reason === 'code-taken' ? 'That code is already in use. Try hosting again.' : 'The connection service couldn’t be reached. Check your internet connection.' });
      },
      onJoin: () => {},
      onLeave: (id) => handle.current(id, { t: 'left' }),
      onMessage: (id, m) => handle.current(id, m),
    });
  };

  const join = async () => {
    setRole('guest');
    setStage({ kind: 'join', status: 'connecting' });
    const avatar = await shareableAvatar(profile.avatar, ownPicture);
    link.current = openLink(
      'guest',
      code,
      (s) => {
        if (s.kind === 'open') link.current?.send({ t: 'hello', name: myName, title: myTitle, avatar });
        else if (s.kind === 'error')
          setStage({
            kind: 'ended',
            message: s.reason === 'no-host' ? 'No Peer Review was found with that code, or it has already started. Check the code with the host.' : 'The connection didn’t work. Try both being on Wi-Fi.',
          });
        else if (s.kind === 'closed') setStage((x) => (x.kind === 'ended' ? x : { kind: 'ended', message: 'The host has ended the Peer Review.' }));
      },
      (m) => handle.current(HOST, m),
    );
  };

  const leave = () => {
    hub.current?.close();
    link.current?.close();
    hub.current = null;
    link.current = null;
    if (router.canGoBack()) router.back();
    else router.replace('/profile/quiz');
  };

  // Host: start a round for everyone.
  const startRound = (round: number) => {
    const quiz = rounds[round]!;
    const questions = makeRound(quiz.category, quiz.level, (id) => imageOf(id)?.thumb, PER_ROUND, toImperial);
    toAll({ t: 'round', round, quiz, questions });
  };
  const beginPlay = (round: number, quiz: Quiz, questions: Question[]) => {
    putAnswers({});
    setAllIn([]);
    setNotice(null);
    setTargeting(null);
    if (round === 0) setUsed(NO_USED);
    setStage({ kind: 'play', round, quiz, questions, index: 0, picked: null, hidden: [], switched: {}, deadline: Date.now() + QUESTION_SECONDS * 1000, waiting: false });
  };

  const answer = (i: number) => {
    if (stage.kind !== 'play' || stage.picked !== null) return;
    const q = stage.questions[stage.index];
    if (!q) return;
    setStage({ ...stage, picked: i, hidden: stage.hidden.filter((h) => h !== i) });
    setTargeting(null);
    toHost({ t: 'answer', round: stage.round, index: stage.index, qid: q.id, choice: i, right: i === q.answer });
  };
  const advance = (p: PlayStage) => {
    setNotice(null);
    setTargeting(null);
    if (p.index + 1 < p.questions.length) setStage({ ...p, index: p.index + 1, picked: null, hidden: [], deadline: Date.now() + QUESTION_SECONDS * 1000, waiting: false });
    else setStage({ kind: 'board', round: p.round });
  };
  const next = () => {
    if (stage.kind !== 'play') return;
    if (allIn.includes(stage.index)) advance(stage);
    else setStage({ ...stage, waiting: true });
  };

  // Host: everyone still connected has answered this question?
  const checkAllIn = (index: number, a = answersRef.current, list = playersRef.current) => {
    const done = list.filter((p) => p.connected).every((p) => a[index]?.[p.id]);
    if (done) toAll({ t: 'all', index, players: list });
  };

  useEffect(() => {
    timeUp.current = () => answer(-1);
    handle.current = (from, m) => {
      const isHost = role === 'host';
      switch (m.t) {
        // ---- Host receives ----
        case 'hello': {
          if (!isHost) break;
          const n = playersRef.current.length + 1;
          const p: Player = {
            id: from,
            name: (typeof m.name === 'string' && m.name.trim().slice(0, 30)) || `Player ${n}`,
            title: typeof m.title === 'string' ? m.title.slice(0, 40) : '',
            avatar: (m.avatar as SharedAvatar) ?? null,
            score: 0,
            connected: true,
          };
          const list = [...playersRef.current.filter((x) => x.id !== from), p];
          putPlayers(list);
          hub.current?.send(from, { t: 'welcome', you: from, rounds });
          toAll({ t: 'roster', players: list });
          break;
        }
        case 'left': {
          if (!isHost) break;
          const list = playersRef.current.map((p) => (p.id === from ? { ...p, connected: false } : p));
          // In the lobby, someone who leaves is simply removed.
          const shown = stage.kind === 'lobby' ? list.filter((p) => p.id !== from) : list;
          putPlayers(shown);
          toAll({ t: 'roster', players: shown });
          if (stage.kind === 'play') checkAllIn(stage.index);
          break;
        }
        case 'answer': {
          if (!isHost) break;
          const index = Number(m.index);
          const prev = answersRef.current;
          const a = { ...prev, [index]: { ...prev[index], [from]: { qid: String(m.qid), choice: Number(m.choice) } } };
          putAnswers(a);
          const key = `${m.round}:${index}`;
          correct.current[from] = { ...correct.current[from], [key]: m.right === true };
          const list = playersRef.current.map((p) => (p.id === from && m.right === true ? { ...p, score: p.score + 1 } : p));
          putPlayers(list);
          hub.current?.broadcast({ t: 'answered', player: from, index, qid: m.qid, choice: m.choice });
          checkAllIn(index);
          break;
        }
        case 'unanswer': {
          // A player's answer to their last question no longer counts (they were switched).
          if (!isHost) break;
          const index = Number(m.index);
          const key = `${m.round}:${index}`;
          const lost = correct.current[from]?.[key] ? 1 : 0;
          if (correct.current[from]) delete correct.current[from][key];
          const prev = answersRef.current;
          putAnswers({ ...prev, [index]: Object.fromEntries(Object.entries(prev[index] ?? {}).filter(([k]) => k !== from)) });
          putPlayers(playersRef.current.map((p) => (p.id === from ? { ...p, score: p.score - lost } : p)));
          hub.current?.broadcast({ t: 'unanswered', player: from, index });
          break;
        }
        case 'swap':
        case 'hurry': {
          // A lifeline aimed at one player: pass it on.
          if (!isHost) break;
          const target = String(m.target);
          toPlayer(target, { ...m, from, t: m.t === 'swap' ? 'switch' : 'hurried' });
          break;
        }

        // ---- Everyone receives ----
        case 'welcome':
          setMe(String(m.you));
          setRounds(m.rounds as Quiz[]);
          setStage({ kind: 'lobby' });
          break;
        case 'rejected':
          setStage({ kind: 'ended', message: m.reason === 'full' ? `That Peer Review is full (${MAX_PLAYERS} players).` : 'That Peer Review has already started.' });
          link.current?.close();
          break;
        case 'roster':
          if (!isHost) putPlayers(m.players as Player[]);
          break;
        case 'rounds':
          setRounds(m.rounds as Quiz[]);
          break;
        case 'round':
          beginPlay(Number(m.round), m.quiz as Quiz, m.questions as Question[]);
          break;
        case 'answered': {
          const a = answersRef.current;
          const i = Number(m.index);
          putAnswers({ ...a, [i]: { ...a[i], [String(m.player)]: { qid: String(m.qid), choice: Number(m.choice) } } });
          break;
        }
        case 'unanswered': {
          const a = answersRef.current;
          const i = Number(m.index);
          putAnswers({ ...a, [i]: Object.fromEntries(Object.entries(a[i] ?? {}).filter(([k]) => k !== String(m.player))) });
          break;
        }
        case 'all': {
          const index = Number(m.index);
          setAllIn((x) => (x.includes(index) ? x : [...x, index]));
          if (!isHost) putPlayers(m.players as Player[]);
          if (stage.kind === 'play' && stage.waiting && stage.index === index) advance(stage);
          break;
        }
        case 'switch': {
          const question = m.question as Question;
          const label = String(m.label ?? '');
          const who = nameOf(String(m.from));
          if (stage.kind !== 'play' || !question) break;
          const last = stage.index + 1 >= stage.questions.length;
          const target = last ? stage.index : stage.index + 1;
          const switched = { ...stage, questions: stage.questions.map((x, i) => (i === target ? question : x)), switched: { ...stage.switched, [target]: `${label} (from ${who})` } };
          if (last) {
            const had = stage.picked !== null;
            if (had) toHost({ t: 'unanswer', round: stage.round, index: stage.index });
            setStage({ ...switched, picked: null, hidden: [], waiting: false, deadline: Date.now() + QUESTION_SECONDS * 1000 });
            setNotice(`🔀 ${who} used Switcheroo on you! ${had ? 'Your answer doesn’t count: here’s a new question.' : 'This question has been switched.'}`);
          } else {
            setStage(switched);
            setNotice(`🔀 ${who} used Switcheroo on you! Your next question is now from ${label}.`);
          }
          break;
        }
        case 'hurried':
          if (stage.kind === 'play' && stage.picked === null) {
            setStage({ ...stage, deadline: Date.now() + Math.max(1000, (stage.deadline - Date.now()) / 2) });
            setNotice(`⏳ ${nameOf(String(m.from))} used Hurry Up on you! Your time has been cut in half.`);
          }
          break;
        case 'lobby':
          if (!isHost) putPlayers((m.players as Player[]) ?? playersRef.current);
          setStage({ kind: 'lobby' });
          break;
        case 'bye':
          if (!isHost) setStage({ kind: 'ended', message: 'The host has ended the Peer Review.' });
          break;
      }
    };
  });

  // The question timer.
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

  const withMyPhoto = (q: Question): Question => {
    if (!q.image || !q.speciesId) return q;
    const own = ownPicture(q.speciesId);
    return own ? { ...q, image: own } : q;
  };

  const ranked = [...players].sort((a, b) => b.score - a.score);
  const PlayerLine = ({ p, rank }: { p: Player; rank?: number }) => (
    <View style={[st.row, !p.connected && { opacity: 0.45 }]}>
      {rank !== undefined && <Text style={[st.rowTitle, { width: 30 }]}>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`}</Text>}
      <PlayerAvatar player={p} size={40} />
      <View style={st.rowText}>
        <Text style={st.rowTitle}>
          {p.name}
          {p.id === me ? ' (you)' : ''}
          {p.id === HOST ? ' · host' : ''}
        </Text>
        <Text style={st.rowSub}>{p.connected ? p.title || 'No title yet' : 'Left the game'}</Text>
      </View>
      {rank !== undefined && <Text style={st.rowTitle}>{p.score}</Text>}
    </View>
  );

  // ---- Screens ----

  if (stage.kind === 'start') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={st.text}>
          A quiz for a group: {MIN_PLAYERS} to {MAX_PLAYERS} players on their own phones. The host chooses five rounds of five questions, and a leaderboard
          shows after each round.
        </Text>
        <Pressable onPress={host} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <Text style={{ fontSize: 28 }}>🏟️</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Host a Peer Review</Text>
            <Text style={st.rowSub}>Choose the rounds and share a battle code</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <Pressable onPress={() => setStage({ kind: 'join', status: 'idle' })} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
          <Text style={{ fontSize: 28 }}>🔑</Text>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>Join a Peer Review</Text>
            <Text style={st.rowSub}>Enter the host’s battle code</Text>
          </View>
          <Text style={st.chevron}>›</Text>
        </Pressable>
        <View style={[st.card, { padding: 14, gap: 4 }]}>
          <Text style={st.rowTitle}>🔒 How the connection works</Text>
          <Text style={st.rowSub}>
            Each phone connects directly to the host’s phone, which passes the game between players. To find each other, phones briefly use a free public
            connection service (PeerJS) and Google’s address lookup (STUN). Your name, title and a small copy of your profile picture are shared with the other
            players for the leaderboard. Nothing is stored.
          </Text>
        </View>
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
        <Pressable onPress={join} disabled={!valid || busy} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed, (!valid || busy) && { opacity: 0.5 }]}>
          <Text style={st.buttonText}>{busy ? 'Joining…' : 'Join'}</Text>
        </Pressable>
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>Cancel</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'lobby') {
    const isHost = role === 'host';
    const connected = players.filter((p) => p.connected);
    const enough = connected.length >= MIN_PLAYERS;
    const roundsOk = rounds.every((r) => categorySize(r.category) >= 8);
    const copy = async () => {
      await Clipboard.setStringAsync(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    const setRound = (i: number, q: Quiz) => {
      const list = rounds.map((r, j) => (j === i ? q : r));
      setRounds(list);
      hub.current?.broadcast({ t: 'rounds', rounds: list });
    };
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
        {isHost && (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={st.heading}>Battle code</Text>
            <Text style={[st.title, { fontSize: 40, letterSpacing: 8, fontVariant: ['tabular-nums'] }]} selectable accessibilityLabel={`Battle code ${code.split('').join(' ')}`}>
              {code}
            </Text>
            <Pressable onPress={copy} accessibilityRole="button" style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
              <Text style={st.buttonText}>{copied ? 'Copied!' : '📋 Copy code'}</Text>
            </Pressable>
          </View>
        )}
        <Text style={st.heading}>
          Players ({connected.length} of {MAX_PLAYERS})
        </Text>
        <View style={st.card}>
          {connected.map((p, i) => (
            <View key={p.id}>
              {i > 0 && <View style={st.divider} />}
              <PlayerLine p={p} />
            </View>
          ))}
        </View>

        <Text style={st.heading}>The rounds</Text>
        <View style={st.card}>
          {rounds.map((r, i) => (
            <View key={i}>
              {i > 0 && <View style={st.divider} />}
              <Pressable
                onPress={() => isHost && setEditing(editing === i ? null : i)}
                disabled={!isHost}
                accessibilityRole={isHost ? 'button' : undefined}
                style={({ pressed }) => [st.row, editing === i && { backgroundColor: palette.linkBg }, pressed && st.pressed]}>
                <Text style={[st.rowTitle, { width: 26 }]}>{i + 1}</Text>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{categoryName(r.category)}</Text>
                  <Text style={st.rowSub}>
                    Level {r.level}, {DIFFICULTIES[r.level - 1]!.name}
                  </Text>
                </View>
                {isHost && <Text style={st.link}>{editing === i ? 'Done' : 'Change'}</Text>}
              </Pressable>
              {isHost && editing === i && (
                <View style={{ padding: 12, gap: 8 }}>
                  <QuizPicker category={r.category} onCategory={(c) => setRound(i, { ...r, category: c })} level={r.level} onLevel={(d) => setRound(i, { ...r, level: d })} />
                </View>
              )}
            </View>
          ))}
        </View>

        {isHost ? (
          <>
            <Pressable
              onPress={() => {
                hub.current?.lock();
                setEditing(null);
                startRound(0);
              }}
              disabled={!enough || !roundsOk}
              accessibilityRole="button"
              style={({ pressed }) => [st.button, pressed && st.pressed, (!enough || !roundsOk) && { opacity: 0.5 }]}>
              <Text style={st.buttonText}>Start the Peer Review</Text>
            </Pressable>
            {!enough && <Text style={st.muted}>Waiting for at least {MIN_PLAYERS} players, including you. Share the code to invite them.</Text>}
            {!roundsOk && <Text style={st.muted}>Choose a group or period for every round.</Text>}
          </>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
            <ActivityIndicator color={palette.link} />
            <Text style={st.muted}>Waiting for the host to start…</Text>
          </View>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>{isHost ? 'Cancel the Peer Review' : 'Leave'}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage.kind === 'play') {
    const q = stage.questions[stage.index];
    const total = stage.questions.length;
    if (!q) {
      return (
        <View style={[st.screen, st.content]}>
          <Text style={st.text}>There weren’t enough questions for this round.</Text>
        </View>
      );
    }
    const others = players.filter((p) => p.connected && p.id !== me);
    const here = answers[stage.index] ?? {};
    const last = stage.index === total - 1;
    const answeredCount = players.filter((p) => p.connected && here[p.id]).length;
    // Who each lifeline can be aimed at.
    const targets = {
      copy: others.filter((p) => here[p.id] && here[p.id]!.qid === q.id && here[p.id]!.choice >= 0),
      swap: others,
      hurry: others.filter((p) => !here[p.id]),
    };
    const secondsLeft = Math.max(0, Math.min(QUESTION_SECONDS, Math.ceil((stage.deadline - now) / 1000)));
    const fire = (kind: 'copy' | 'swap' | 'hurry', target: Player) => {
      setTargeting(null);
      if (kind === 'copy') {
        const a = here[target.id];
        if (!a) return;
        setUsed((x) => ({ ...x, copy: true }));
        answer(a.choice);
      } else if (kind === 'swap') {
        // The round's quiz one level harder, or at level 5 a random other topic.
        const quiz = switcherooQuiz(stage.quiz, stage.quiz);
        const question = replacementQuestion(quiz.category, quiz.level, (id) => imageOf(id)?.thumb, stage.questions, toImperial);
        if (!question) return;
        const label = `${categoryName(quiz.category)}, level ${quiz.level}`;
        setUsed((x) => ({ ...x, swap: true }));
        toHost({ t: 'swap', target: target.id, question, label });
        setNotice(`🔀 Switcheroo sent: ${target.name}’s ${last ? 'question' : 'next question'} is now from ${label}.`);
      } else {
        setUsed((x) => ({ ...x, hurry: true }));
        toHost({ t: 'hurry', target: target.id });
        setNotice(`⏳ Hurry Up sent: ${target.name}’s time is cut in half.`);
      }
    };
    return (
      <QuestionView
        q={withMyPhoto(q)}
        index={stage.index}
        total={total}
        score={players.find((p) => p.id === me)?.score ?? 0}
        chosen={stage.picked}
        onChoose={answer}
        onNext={next}
        nextLabel={stage.waiting ? 'Waiting for everyone to answer…' : last ? 'See the leaderboard' : 'Next question'}
        nextDisabled={stage.waiting}
        allowReadMore={false}
        hidden={stage.hidden}
        lifelines={[
          {
            key: 'fifty',
            icon: '✂️',
            label: '50/50',
            hint: 'Remove two wrong answers',
            used: used.fifty,
            available: true,
            onPress: () => {
              setUsed((x) => ({ ...x, fifty: true }));
              setStage({ ...stage, hidden: fiftyFifty(q) });
            },
          },
          { key: 'copy', icon: '👀', label: 'Copy', hint: targets.copy.length ? 'Copy a player’s answer' : 'Once someone has answered', used: used.copy, available: targets.copy.length > 0, onPress: () => setTargeting('copy') },
          { key: 'hurry', icon: '⏳', label: 'Hurry Up', hint: 'Halve a player’s time', afterAnswer: true, used: used.hurry, available: targets.hurry.length > 0, onPress: () => setTargeting('hurry') },
          { key: 'swap', icon: '🔀', label: 'Switcheroo', hint: 'Switch a player’s question', used: used.swap, available: targets.swap.length > 0, onPress: () => setTargeting('swap') },
        ]}
        header={
          <>
            <Text style={st.muted}>
              Round {stage.round + 1} of {ROUNDS}: {quizText(stage.quiz)} · {answeredCount} of {players.filter((p) => p.connected).length} answered
            </Text>
            {stage.picked === null && (
              <View style={{ gap: 4 }} accessible accessibilityLabel={`${secondsLeft} seconds left`}>
                <Text style={[st.rowTitle, secondsLeft <= 5 && { color: '#C62828' }]}>⏱️ {secondsLeft} s</Text>
                <View style={{ height: 4, borderRadius: 2, backgroundColor: palette.track, overflow: 'hidden' }}>
                  <View style={{ width: `${(secondsLeft / QUESTION_SECONDS) * 100}%`, height: '100%', backgroundColor: secondsLeft <= 5 ? '#C62828' : palette.accent }} />
                </View>
              </View>
            )}
            {!!stage.switched[stage.index] && (
              <View style={[st.card, { padding: 10, borderColor: palette.accent, borderWidth: 2 }]}>
                <Text style={st.rowTitle}>🔀 Switched: {stage.switched[stage.index]}</Text>
              </View>
            )}
            {!!notice && (
              <Text style={[st.rowSub, { color: palette.accent }]} accessibilityLiveRegion="polite">
                {notice}
              </Text>
            )}
            {targeting && (
              <View style={[st.card, { padding: 10, gap: 6 }]}>
                <Text style={st.rowTitle}>
                  {targeting === 'copy' ? '👀 Copy whose answer?' : targeting === 'hurry' ? '⏳ Hurry up who?' : '🔀 Switch whose question?'}
                </Text>
                {targets[targeting].map((p) => (
                  <Pressable key={p.id} onPress={() => fire(targeting, p)} accessibilityRole="button" style={({ pressed }) => [pressed && st.pressed]}>
                    <PlayerLine p={p} />
                  </Pressable>
                ))}
                <Pressable onPress={() => setTargeting(null)} accessibilityRole="button" hitSlop={6}>
                  <Text style={st.link}>Cancel</Text>
                </Pressable>
              </View>
            )}
          </>
        }
      />
    );
  }

  if (stage.kind === 'board') {
    const final = stage.round + 1 >= ROUNDS;
    const isHost = role === 'host';
    const top = ranked[0];
    return (
      <ScrollView style={st.screen} contentContainerStyle={st.content}>
        <Text style={[st.title, { textAlign: 'center' }]}>{final ? `🏆 ${top?.id === me ? 'You win!' : `${top?.name ?? 'Nobody'} wins!`}` : `Leaderboard after round ${stage.round + 1}`}</Text>
        {!final && <Text style={[st.muted, { textAlign: 'center' }]}>Next: round {stage.round + 2}, {quizText(rounds[stage.round + 1]!)}</Text>}
        <View style={st.card}>
          {ranked.map((p, i) => (
            <View key={p.id}>
              {i > 0 && <View style={st.divider} />}
              <PlayerLine p={p} rank={ranked.findIndex((x) => x.score === p.score) + 1} />
            </View>
          ))}
        </View>
        {isHost ? (
          <Pressable
            onPress={() => {
              if (!final) startRound(stage.round + 1);
              else {
                const reset = players.filter((p) => p.connected).map((p) => ({ ...p, score: 0 }));
                correct.current = {};
                putPlayers(reset);
                toAll({ t: 'lobby', players: reset });
              }
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{final ? 'New Peer Review with these players' : `Start round ${stage.round + 2}`}</Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
            <ActivityIndicator color={palette.link} />
            <Text style={st.muted}>{final ? 'Thanks for playing!' : 'Waiting for the host to start the next round…'}</Text>
          </View>
        )}
        <Pressable onPress={leave} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
          <Text style={st.link}>{isHost ? 'End the Peer Review' : 'Leave'}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={st.screen} contentContainerStyle={[st.content, { alignItems: 'center' }]}>
      <Text style={{ fontSize: 48 }}>🔌</Text>
      <Text style={[st.text, { textAlign: 'center' }]}>{stage.message}</Text>
      <Pressable
        onPress={() => {
          hub.current = null;
          link.current = null;
          putPlayers([]);
          setStage({ kind: 'start' });
        }}
        accessibilityRole="button"
        style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
        <Text style={st.buttonText}>Back to Peer Review</Text>
      </Pressable>
    </ScrollView>
  );
}
