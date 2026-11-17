import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { Board } from '@/components/bone-war-board';
import { BoneWarFriend } from '@/components/bone-war-friend';
import { SPECIES } from '@/data/life';
import { deckCards, NOT_CARDS } from '@/lib/bone-war';
import { type Action, aiAnswers, aiDeck, aiMove, apply, type GameState, newGame } from '@/lib/bone-war-game';
import { EXTINCTIONS } from '@/lib/extinctions';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

const AI_STYLE = { back: '#561A1A', border: '#E8D9C8' };
const ME = 0 as const;
const AI = 1 as const;

export default function BoneWarGameScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  if (mode === 'friend') return <BoneWarFriend />;
  return <ComputerGame />;
}

// A game against the computer.
function ComputerGame() {
  const { profile } = useProfile();
  const t = useT();
  const deck = useMemo(() => deckCards(profile), [profile]);
  const [state, setState] = useState<GameState>(() => {
    const stars = deck.length ? deck.reduce((n, c) => n + c.stars, 0) / deck.length : 2;
    const pool = [...SPECIES.filter((s) => s.status === 'full' && !NOT_CARDS.has(s.id)).map((s) => `species:${s.id}`), ...EXTINCTIONS.map((e) => `extinction:${e.id}`)];
    return newGame([
      { name: profile.name || t('You'), cards: deck.map((c) => ({ key: c.key, stars: c.stars })) },
      { name: t('Animal Almanac'), cards: aiDeck(Math.max(deck.length, 20), stars, pool) },
    ]);
  });

  // The computer plays its turn (and answers its questions) with short pauses.
  useEffect(() => {
    if (state.over) return;
    const p = state.pending;
    if (p && p.answerer === AI) {
      const id = setTimeout(() => setState((s) => apply(s, AI, { type: 'answer', correct: aiAnswers(p.level) })), 1400);
      return () => clearTimeout(id);
    }
    if (!p && state.turn === AI) {
      const id = setTimeout(() => {
        setState((s) => {
          const a = aiMove(s, AI);
          const next = apply(s, AI, a);
          return next === s ? apply(s, AI, { type: 'end' }) : next;
        });
      }, 900);
      return () => clearTimeout(id);
    }
  }, [state]);

  const act = (a: Action) => setState((s) => apply(s, ME, a));
  return <Board state={state} me={ME} act={act} oppStyle={AI_STYLE} onExit={() => router.back()} />;
}

