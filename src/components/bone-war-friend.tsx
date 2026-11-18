import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ShareCodeButton } from '@/components/share-code';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { AI_LOOK, deckCards, extinctionPagesOf, type Look, lookOf } from '@/lib/bone-war';
import { shrink } from '@/lib/battle/avatar';
import { useOwnPicture } from '@/lib/user-photos';
import { type Action, apply, type GameState, newGame } from '@/lib/bone-war-game';
import { type Link, newBattleCode, openLink } from '@/lib/battle/link';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';
import { Board } from '@/components/bone-war-board';

type Style = { back: string; border: string };
type Stage =
  | { kind: 'start' }
  | { kind: 'host'; code: string; status: string }
  | { kind: 'join'; status: string }
  | { kind: 'play' }
  | { kind: 'error'; message: string };

// Bone War between two phones. The host's phone runs the game: the guest sends its moves and
// answers, and the host sends back the new state after every change.
export function BoneWarFriend() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile } = useProfile();
  const [stage, setStage] = useState<Stage>({ kind: 'start' });
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<GameState | null>(null);
  const [theirStyle, setTheirStyle] = useState<Style>({ back: '#561A1A', border: '#E8D9C8' });
  // The other player's theme colours and their own photos for the animals in their deck.
  const [theirLook, setTheirLook] = useState<Look>(AI_LOOK);
  const [theirArt, setTheirArt] = useState<Record<string, string>>({});
  const own = useOwnPicture();
  const link = useRef<Link | null>(null);
  const role = useRef<'host' | 'guest'>('host');
  const [me, setMe] = useState<0 | 1>(0);
  const stateRef = useRef<GameState | null>(null);
  const myDeck = deckCards(profile).map((c) => ({ key: c.key, stars: c.stars }));

  useEffect(() => () => link.current?.close(), []);

  const publish = (s: GameState) => {
    stateRef.current = s;
    setState(s);
    link.current?.send({ t: 'bw-state', state: s, style: profile.cardStyle });
  };

  // Sends my theme, then a small copy of each of my photos for animals in my deck (one message each,
  // so the game can start while they arrive).
  const sendLook = async () => {
    link.current?.send({ t: 'bw-look', look: lookOf(palette) });
    for (const c of deckCards(profile)) {
      const id = c.kind === 'species' ? c.id : (c.speciesId ?? `extinction:${c.id}`);
      const photo = c.kind === 'extinction' && !c.speciesId ? extinctionPagesOf(c.id).map((p) => own(`extinction:${p}`)).find(Boolean) : own(id);
      const uri = photo ? await shrink(photo, 240) : null;
      if (uri) link.current?.send({ t: 'bw-art', id, uri });
    }
  };

  const handle = (m: Record<string, unknown>) => {
    if (m.t === 'bw-look') {
      setTheirLook(m.look as Look);
      return;
    }
    if (m.t === 'bw-art') {
      setTheirArt((a) => ({ ...a, [String(m.id)]: String(m.uri) }));
      return;
    }
    if (role.current === 'host') {
      if (m.t === 'bw-hello') {
        setTheirStyle(m.style as Style);
        const s = newGame([
          { name: profile.name.trim() || t('Host'), cards: myDeck },
          { name: String(m.name || t('Challenger')), cards: m.deck as { key: string; stars: number }[] },
        ]);
        setStage({ kind: 'play' });
        publish(s);
        sendLook();
      } else if (m.t === 'bw-act' && stateRef.current) {
        const next = apply(stateRef.current, 1, m.a as Action);
        if (next !== stateRef.current) publish(next);
      } else if (m.t === 'hello' || m.t === 'decide') {
        setStage({ kind: 'error', message: t('The other phone is playing Head to Head. Both players need to choose Bone War.') });
      }
    } else if (m.t === 'bw-state') {
      setTheirStyle(m.style as Style);
      stateRef.current = m.state as GameState;
      setState(m.state as GameState);
      setStage({ kind: 'play' });
    }
  };

  const connect = (r: 'host' | 'guest', c: string) => {
    role.current = r;
    setMe(r === 'host' ? 0 : 1);
    link.current?.close();
    link.current = openLink(
      r,
      c,
      (s) => {
        if (s.kind === 'open' && r === 'guest') {
          link.current?.send({ t: 'bw-hello', name: profile.name.trim(), deck: myDeck, style: profile.cardStyle });
          sendLook();
        }
        if (s.kind === 'open' && r === 'host') setStage((x) => (x.kind === 'host' ? { ...x, status: t('Connected! Starting…') } : x));
        if (s.kind === 'waiting') setStage((x) => (x.kind === 'host' ? { ...x, status: t('Waiting for the other player…') } : x));
        if (s.kind === 'error')
          setStage({
            kind: 'error',
            message:
              s.reason === 'no-host'
                ? t('No game was found with that code. Check it with the other player.')
                : s.reason === 'code-taken'
                  ? t('That code is in use. Try hosting again.')
                  : t('The connection failed. Check both phones are online and try again.'),
          });
        if (s.kind === 'closed') setStage((x) => (x.kind === 'play' ? { kind: 'error', message: t('The other player left the game.') } : x));
      },
      handle,
    );
  };

  const act = (a: Action) => {
    if (!stateRef.current) return;
    if (role.current === 'host') {
      const next = apply(stateRef.current, 0, a);
      if (next !== stateRef.current) publish(next);
    } else link.current?.send({ t: 'bw-act', a });
  };

  if (stage.kind === 'play' && state) return <Board state={state} me={me} act={act} oppStyle={theirStyle} oppLook={theirLook} oppArt={theirArt} onExit={() => router.back()} />;

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
      {stage.kind === 'start' && (
        <>
          <Text style={st.text}>{t('Play a friend on another phone. One of you hosts and sends the battle code; the other joins with it.')}</Text>
          <Pressable
            onPress={() => {
              const c = newBattleCode();
              setStage({ kind: 'host', code: c, status: t('Connecting…') });
              connect('host', c);
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
            <View style={st.rowText}>
              <Text style={st.rowTitle}>{t('Host a game')}</Text>
              <Text style={st.rowSub}>{t('Get a battle code to send to the other player')}</Text>
            </View>
            <Text style={st.chevron}>›</Text>
          </Pressable>
          <Text style={st.heading}>{t('Join a game')}</Text>
          <TextInput
            value={code}
            onChangeText={(x) => setCode(x.replace(/\D/g, '').slice(0, 6))}
            placeholder={t('6-digit code')}
            placeholderTextColor={palette.muted}
            keyboardType="number-pad"
            style={st.input}
            accessibilityLabel={t('Battle code')}
          />
          <Pressable
            disabled={!/^\d{6}$/.test(code)}
            onPress={() => {
              setStage({ kind: 'join', status: t('Connecting…') });
              connect('guest', code);
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, pressed && st.pressed, !/^\d{6}$/.test(code) && { opacity: 0.5 }]}>
            <Text style={st.buttonText}>{t('Join')}</Text>
          </Pressable>
        </>
      )}
      {stage.kind === 'host' && (
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Text style={st.heading}>{t('Your battle code')}</Text>
          <Text style={[st.title, { fontSize: 44, letterSpacing: 8 }]} selectable>
            {stage.code}
          </Text>
          <ShareCodeButton code={stage.code} game={t('Bone War')} />
          <Pressable
            onPress={async () => {
              await Clipboard.setStringAsync(stage.code);
              setCopied(true);
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, { alignSelf: 'stretch', backgroundColor: palette.card }, pressed && st.pressed]}>
            <Text style={[st.buttonText, { color: palette.text }]}>{copied ? t('Copied!') : t('📋 Copy code')}</Text>
          </Pressable>
          <Text style={[st.muted, { textAlign: 'center' }]}>{t('Keep Animal Almanac open (switching apps is fine) until they join.')}</Text>
          <Text style={st.muted}>{stage.status}</Text>
        </View>
      )}
      {stage.kind === 'join' && <Text style={st.muted}>{stage.status}</Text>}
      {stage.kind === 'error' && (
        <>
          <Text style={st.text}>{stage.message}</Text>
          <Pressable
            onPress={() => {
              link.current?.close();
              setStage({ kind: 'start' });
            }}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{t('Try again')}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
