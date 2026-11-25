import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Board } from '@/components/bone-war-board';
import { BoneWarFriend } from '@/components/bone-war-friend';
import { SPECIES } from '@/data/life';
import { deckCards, EXTINCTION_CARD_KEYS, lookOf } from '@/lib/bone-war';
import { CHAMPIONS, championAnswers, championDeck, championMove, type ChampionStyle, BLACK, SHADOW, SHADOW_CARDS, shadowStyle } from '@/lib/bone-war-champions';
import { useLeaveGuard } from '@/hooks/use-leave-guard';
import { usePalette } from '@/hooks/use-palette';
import { type Action, aiAnswers, aiDeck, aiMove, apply, type GameState, newGame } from '@/lib/bone-war-game';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

const NO_ART: Record<string, string> = {};
const ME = 0 as const;
const AI = 1 as const;

export default function BoneWarGameScreen() {
  const { mode, style } = useLocalSearchParams<{ mode?: string; style?: string }>();
  const { loaded } = useProfile();
  // The deck comes from the saved profile, so wait for it.
  if (!loaded) return null;
  if (mode === 'friend') return <BoneWarFriend />;
  if (mode === 'champion' && style === SHADOW) return <ComputerGame key={SHADOW} shadow />;
  const champion = mode === 'champion' ? CHAMPIONS.find((c) => c.style === style) : undefined;
  return <ComputerGame key={champion?.style ?? 'ai'} champion={champion?.style} />;
}

// A game against the computer: the practice opponent, a champion, or the secret shadow champion.
function ComputerGame({ champion: style, shadow = false }: { champion?: ChampionStyle; shadow?: boolean }) {
  const { profile, update } = useProfile();
  const palette = usePalette();
  const t = useT();
  // The shadow plays the style of the champion the player lost to most.
  const [shadowOf] = useState(() => shadowStyle(profile.championLosses ?? {}));
  const base = CHAMPIONS.find((c) => c.style === (shadow ? shadowOf : style));
  const champion = useMemo(
    () =>
      base && shadow
        ? { ...base, name: profile.name || t('You'), look: BLACK, cardStyle: SHADOW_CARDS }
        : base,
    [base, shadow, profile.name, t],
  );
  const key = shadow ? SHADOW : champion?.style;
  const deck = useMemo(() => deckCards(profile), [profile]);
  const [state, setState] = useState<GameState>(() => {
    const stars = deck.length ? deck.reduce((n, c) => n + c.stars, 0) / deck.length : 2;
    const species = SPECIES.filter((s) => s.status === 'full').map((s) => s.id);
    const extinctions = EXTINCTION_CARD_KEYS;
    const pool = [...species.map((id) => `species:${id}`), ...extinctions];
    return newGame([
      { name: profile.name || t('You'), cards: deck.map((c) => ({ key: c.key, stars: c.stars })) },
      champion
        ? { name: shadow ? champion.name : t(champion.name), cards: championDeck(champion.style, stars, species, [...extinctions, 'species:homo-sapiens'], Math.random, shadow ? 5 : undefined) }
        : { name: t('Animal Almanac'), cards: aiDeck(Math.max(deck.length, 20), stars, pool) },
    ]);
  });

  // The computer plays its turn (and answers its questions) with short pauses.
  useEffect(() => {
    if (state.over) return;
    const p = state.pending;
    if (p && p.answerer === AI) {
      const id = setTimeout(() => setState((s) => apply(s, AI, { type: 'answer', correct: champion ? championAnswers(p.level) : aiAnswers(p.level) })), 1400);
      return () => clearTimeout(id);
    }
    if (!p && state.turn === AI) {
      const id = setTimeout(() => {
        setState((s) => {
          const a = champion ? championMove(s, AI, champion.style) : aiMove(s, AI);
          const next = apply(s, AI, a);
          return next === s ? apply(s, AI, { type: 'end' }) : next;
        });
        // A longer pause after an animated move, so it plays out before the next one.
      }, state.fx?.length ? 1700 : 900);
      return () => clearTimeout(id);
    }
  }, [state, champion]);

  // Beating a champion is remembered, which earns its title; losses are counted, to choose the
  // shadow champion's style.
  const won = state.over && state.winner === ME;
  const lost = state.over && state.winner === AI;
  const { champions, championLosses } = profile;
  const counted = useRef(false);
  useEffect(() => {
    if (!key) return;
    if (won && !champions.includes(key)) update({ champions: [...champions, key] });
    if (lost && !counted.current) {
      counted.current = true;
      const losses = championLosses ?? {};
      update({ championLosses: { ...losses, [key]: (losses[key] ?? 0) + 1 } });
    }
  }, [won, lost, key, champions, championLosses, update]);

  const act = (a: Action) => setState((s) => apply(s, ME, a));
  useLeaveGuard(!state.over, true);
  // The practice computer plays in the player's own colours; a champion in their own.
  const oppStyle = champion ? { ...champion.cardStyle, layout: profile.cardStyle.layout } : profile.cardStyle;
  return <Board state={state} me={ME} act={act} oppStyle={oppStyle} oppLook={champion ? champion.look : lookOf(palette)} oppArt={NO_ART} onExit={() => router.back()} oppGlitch={shadow} />;
}

