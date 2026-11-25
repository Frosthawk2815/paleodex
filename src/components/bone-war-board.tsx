import { Image } from 'expo-image';
import { use, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoneWarCard } from '@/components/bone-war-card';
import { CrocEye, DefenceFx, FadeOut, Jolt, joltFor, Splash, WeaponFx } from '@/components/bone-war-fx';
import { GlitchText, useGlitch } from '@/components/glitch';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { cardFor, type Look } from '@/lib/bone-war';
import { type Action, backMax, backTotal, cardOf, type Fx, type GameState, type GCard, legal, levelFor, secondsFor, START_HP } from '@/lib/bone-war-game';
import { defenceOf } from '@/lib/bone-war-defences';
import { weaponOf } from '@/lib/bone-war-weapons';
import { FontsReady, PAPER_FONTS } from '@/lib/fonts';
import { imageOf } from '@/lib/images';
import { type Question, questionAbout } from '@/lib/quiz';
import { useOwnPicture } from '@/lib/user-photos';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

const HP_RED = '#D32F2F';

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
  oppGlitch = false,
}: {
  state: GameState;
  me: 0 | 1;
  act: (a: Action) => void;
  oppStyle: { back: string; border: string };
  // The opponent's theme colours, for their side of the board, and their own photos for their cards.
  oppLook: Look;
  oppArt: Record<string, string>;
  onExit: () => void;
  // The secret shadow champion: its health bar is hidden, and below half it glitches into view.
  oppGlitch?: boolean;
}) {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { reduceMotion, profile } = useProfile();
  const theirsLow = state.players[1 - me]!.hp < START_HP / 2;
  // Glitch bursts only run for the shadow once it is below half health.
  const burst = useGlitch(!oppGlitch || !theirsLow || reduceMotion);
  // The shadow's bar: hidden, then flickering into view below half (steady with reduce motion).
  // The shadow's name glitches now and then (it shares the player's name, which is the point).
  const nameBurst = useGlitch(!oppGlitch || reduceMotion);
  const showOppBar = !oppGlitch || (theirsLow && (reduceMotion || !!burst));
  // Against the shadow, the latest message never says how much damage was done.
  const lastLog = (() => {
    const m = state.log.slice(-1)[0];
    return m && oppGlitch ? m.replace(/ for \d+ damage\./, '.').replace(/ and took \d+ HP\./, '.').replace(/, lost \d+ HP,/, ',') : m;
  })();
  // The opponent's paper-theme fonts, once the fonts have loaded (only fonts the app has: a friend's
  // phone sends these names).
  const fontsReady = use(FontsReady);
  const known = (f?: string) => (fontsReady && f && f in PAPER_FONTS ? f : undefined);
  const oppFont = known(oppLook.font);
  const oppHeading = known(oppLook.headingFont);
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
  const myAttack = backMax(mine, 'attack');
  const myDefence = backMax(mine, 'defence');
  // Defence is worn down during the opponent's turn and fresh again for their next one.
  const myShield = state.turn === me ? myDefence : Math.min(mine.shield, myDefence);
  const mySpeed = backTotal(mine, 'speed');
  // Swim left: backline cards whose swim hasn't been used.
  const mySwim = mine.back.reduce((n, g) => {
    const c = g && !g.swimUsed ? cardOf(g) : null;
    return n + (c && c.kind === 'species' ? c.stats.swim : 0);
  }, 0);

  // The last action's animations (none with reduce motion on). Each is keyed to the action, so it
  // plays once when it happens.
  const fx: Fx[] = reduceMotion ? [] : (state.fx ?? []);
  const fxAt = (where: Pick['where'], i: number) => {
    const side = where === 'oppFront' || where === 'oppBack' ? opp : me;
    const r = where === 'front' || where === 'oppFront' ? 'front' : where === 'back' || where === 'oppBack' ? 'back' : null;
    return fx.filter((f) => f.t !== 'strike' && f.side === side && (f.t === 'weapon' ? r === 'front' : f.row === r) && f.slot === i);
  };

  const card = (
    g: GCard | null,
    face: boolean,
    w: number,
    style: { back: string; border: string } | undefined,
    onPress: (() => void) | undefined,
    on = false,
    key?: string,
    outline?: string,
    at?: { where: Pick['where']; i: number },
  ) => {
    const h = w * 1.4;
    const here = at ? fxAt(at.where, at.i) : [];
    const weapon = here.find((f) => f.t === 'weapon');
    const gone = here.find((f) => f.t === 'gone');
    const splash = here.find((f) => f.t === 'splash');
    const look = (x: GCard, shown: boolean) => (
      <BoneWarCard card={cardOf(x)} width={w} faceDown={!shown} cardStyle={style} art={style ? oppArt : undefined} font={style ? oppFont : undefined} highlight={on ? palette.accent : undefined} />
    );
    const fxKey = `${state.seq}`;
    return (
      <Pressable key={key} onPress={onPress} disabled={!onPress} accessibilityRole="button" style={{ width: w, zIndex: here.length ? 2 : 0 }}>
        {g ? (
          <View>
            {weapon ? (
              <Jolt key={fxKey} kind={joltFor(weaponOf(weapon.by), weapon.result)} w={w}>
                {look(g, face)}
              </Jolt>
            ) : (
              look(g, face)
            )}
            {/* On your cards in play, a crocodile eye: closed while the opponent hasn't seen the card,
                open once it has been revealed. */}
            {!!at && style === undefined && <CrocEye open={g.seen} size={Math.max(8, Math.min(11, w * 0.114))} colours={profile.cardStyle.eye} />}
          </View>
        ) : (
          <View style={[styles.empty, { width: w, height: h, borderColor: outline ?? palette.border }]} />
        )}
        {/* A card just beaten, fading out where it was (or vanishing under an ambush). */}
        {!g && gone && (
          <FadeOut key={fxKey} delay={gone.delay} ambush={gone.how === 'ambush'}>
            {look(gone.card, gone.card.seen || style === undefined)}
          </FadeOut>
        )}
        {/* An attack the target's defence held off: its armour shows and the attack bounces off it. */}
        {weapon?.result === 'held' && g && defenceOf(g.key) && <DefenceFx key={`d${fxKey}`} defence={defenceOf(g.key)!} w={w} h={h} speciesId={g.key.split(':')[1]} />}
        {weapon && <WeaponFx key={`w${fxKey}`} weapon={weaponOf(weapon.by)} w={w} h={h} blocked={weapon.result === 'held'} />}
        {(splash || gone?.how === 'ambush') && <Splash key={`s${fxKey}`} w={w} h={h} big={gone?.how === 'ambush'} />}
      </Pressable>
    );
  };

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
          { where, i },
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
      buttons.push({ label: t('Swim: reveal {n} and ambush', { n: c && c.kind === 'species' ? c.stats.swim : 0 }), a: { type: 'swim', slot: pick.i } });
      const f = mine.front.findIndex((x) => !x);
      if (f >= 0) buttons.push({ label: t('Move to front line'), a: { type: 'advance', from: pick.i, to: f } });
    }
    if (pick.where === 'oppFront') {
      buttons.push({ label: t('Challenge: level {l}, {s} s', { l: levelFor(state, me, g), s: secondsFor(state, me) }), a: { type: 'challenge', slot: pick.i } });
      // Attack it with a backline card instead: it's knocked off if its defence is lower than the attack.
      mine.back.forEach((b, i) => {
        const bc = b ? cardOf(b) : null;
        if (!b || bc?.kind !== 'species') return;
        buttons.push({ label: t('Attack with {name} (⚔️ {n})', { name: bc.species.common || bc.species.name, n: bc.stats.attack }), a: { type: 'attack', from: i, slot: pick.i } });
      });
    }
    const usable = buttons.filter((b) => legal(state, me, b.a));
    return (
      <View style={[styles.panel, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <BoneWarCard card={c} width={130} faceDown={!face} cardStyle={ours ? undefined : oppStyle} art={ours ? undefined : oppArt} />
        <View style={{ flex: 1, gap: 8 }}>
          {face && c?.kind === 'species' && (
            <Text style={st.rowSub}>
              {t('⚔️ Attack {a} · 🛡️ Defence {d} · ⚡ Speed {s} · 🌊 Swim {w}', { a: c.stats.attack, d: c.stats.defence, s: c.stats.speed, w: c.stats.swim })}
            </Text>
          )}
          {face && c?.kind === 'extinction' && <Text style={st.rowSub}>{t('Front line only. Wipes out the opponent’s animals that died in it if they answer wrong.')}</Text>}
          {!face && <Text style={st.rowSub}>{t('Face down. Challenge it to find out what it is, or reveal it with a swimmer.')}</Text>}
          {pick.where === 'oppFront' && <Text style={st.muted}>{t('An attack knocks it off if its defence is lower than your card’s attack. A faster card may dodge.')}</Text>}
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

  const struck = (p: typeof mine) => fx.find((f): f is Extract<Fx, { t: 'strike' }> => f.t === 'strike' && state.players[f.side] === p);
  const hp = (p: typeof mine, who: string, look?: Look) => (
    <View style={styles.hpRow}>
      {/* A strike lands on the player's health bar. */}
      {!!struck(p) && (
        <View pointerEvents="none" style={styles.strikeBox}>
          <WeaponFx key={state.seq} weapon={weaponOf(struck(p)!.by)} w={84} h={64} />
        </View>
      )}
      {look && oppGlitch ? (
        <View style={{ flex: 1 }}>
          <GlitchText text={who} style={st.rowTitle} color={look.text} burst={nameBurst} quiet />
        </View>
      ) : (
        <Text style={[st.rowTitle, { flex: 1 }, look && { color: look.text }, look && oppHeading ? { fontFamily: oppHeading, fontWeight: 'normal' } : null]} numberOfLines={1}>
          {who}
        </Text>
      )}
      {look && !showOppBar ? (
        // Hidden: an empty space where the bar would be.
        <View style={[styles.hpTrack, { backgroundColor: 'transparent' }]} />
      ) : (
        <View
          style={[styles.hpTrack, { backgroundColor: (look ?? palette).track }, look && oppGlitch && burst ? { transform: [{ translateX: burst.dx * 2 }], borderWidth: 1, borderColor: burst.seed > 0.5 ? '#22E5FF' : '#FF2A55' } : null]}
          accessibilityRole="progressbar"
          accessibilityLabel={look ? t('{name}’s health', { name: who }) : t('{name}: {hp} of {max} HP', { name: who, hp: p.hp, max: START_HP })}>
          <View style={{ width: `${(Math.max(0, p.hp) / START_HP) * 100}%`, height: '100%', borderRadius: 6, backgroundColor: HP_RED }} />
        </View>
      )}
      {/* Damage taken this turn, seen by both players. */}
      {/* …except the shadow champion's, which stays hidden. */}
      {!!p.hit && !(look && oppGlitch) && <Text style={[st.rowTitle, { color: HP_RED, minWidth: 30 }]}>−{p.hit}</Text>}
      {/* Only your own HP is shown as a number; the opponent's is just the bar. */}
      {!look && <Text style={[st.rowTitle, { minWidth: 56, textAlign: 'right' }]}>{p.hp}/{START_HP}</Text>}
    </View>
  );

  if (state.over) {
    const won = state.winner === me;
    return (
      <View style={[st.screen, st.content, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <Text style={{ fontSize: 56 }}>{state.winner === null ? '🤝' : won ? '🏆' : '🦴'}</Text>
        <Text style={st.title}>{state.winner === null ? t('A draw') : won ? t('You won the Bone War!') : oppGlitch ? t('Your shadow won this time') : t('{name} won this time', { name: theirs.name })}</Text>
        <Text style={st.muted}>{lastLog}</Text>
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
            <Text style={[st.rowSub, { color: oppLook.muted }, oppFont ? { fontFamily: oppFont } : null]}>{t('🏳 Forfeit')}</Text>
          </Pressable>
          {hp(theirs, theirs.name, oppLook)}
          <Text style={[st.muted, { color: oppLook.muted }, oppFont ? { fontFamily: oppFont } : null]}>{t('Hand {h} · deck {d}', { h: theirs.hand.length, d: theirs.deck.length })}</Text>
          {row(theirs.back, 'oppBack', (g) => g.seen, backW, oppStyle, oppLook.border)}
          {row(theirs.front, 'oppFront', (g) => g.seen, slotW, oppStyle, oppLook.border)}
        </View>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.accent }]} />
        <View style={[styles.board, { width: W + 24, alignSelf: 'center' }]}>
        {row(mine.front, 'front', () => true, slotW)}
        {row(mine.back, 'back', () => true, backW)}
        {hp(mine, mine.name)}
        {/* Your backline together, seen only by you: best attack, defence left this turn, total speed
            and the swim you still have to use. */}
        <View style={styles.statsRow} accessibilityLabel={t('Your backline: attack {a}, defence {d} of {dm}, speed {s}, swim {w} left', { a: myAttack, d: myShield, dm: myDefence, s: mySpeed, w: mySwim })}>
          <Text style={st.rowTitle}>⚔️ {myAttack}</Text>
          <Text style={[st.rowTitle, myShield < myDefence && { color: HP_RED }]}>
            🛡️ {myShield}
            {myShield < myDefence ? `/${myDefence}` : ''}
          </Text>
          <Text style={st.rowTitle}>⚡ {mySpeed}</Text>
          <Text style={st.rowTitle}>🌊 {mySwim}</Text>
        </View>
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
          {lastLog ?? t('Tap a card in your hand to play it.')}
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
        <View style={[styles.waiting, { bottom: 24 + insets.bottom, backgroundColor: palette.card, borderColor: palette.border }]}>
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
  statsRow: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end' },
  hpTrack: { flex: 1.4, height: 12, borderRadius: 6, overflow: 'hidden' },
  panel: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  strikeBox: { position: 'absolute', left: '50%', marginLeft: -42, top: -26, width: 84, height: 64, zIndex: 3 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  waiting: { position: 'absolute', left: 16, right: 16, bottom: 24, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
});
