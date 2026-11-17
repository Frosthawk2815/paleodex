import { Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { DECK_SIZE, MIN_DECK } from '@/lib/bone-war';
import { useT } from '@/lib/i18n';

// The basic rules of Bone War, shown on the Bone War menu and under the deck builder.
export function BoneWarRules() {
  const st = useProfileStyles();
  const t = useT();
  const lines = [
    t('A deck holds {min} to {max} cards. A card’s stars (1 to 5) are the level of the questions it asks, so higher-star cards are harder to knock out.', { min: MIN_DECK, max: DECK_SIZE }),
    t('Each player starts with 20 HP, a hand of 5 cards and two actions a turn, and draws 2 at the end of each turn.'),
    t('Cards go face down: up to 6 in your front line, the question line, and 3 in your backline, the player line. A backline card can move to the front, but never back.'),
    t('Challenge a card in your opponent’s front line by answering a question about it at its star level. Right: it is knocked out and they lose 1 HP. Wrong: it stays and you lose 1 HP. A card you have already seen asks a question one level easier.'),
    t('Or attack it with one of your backline cards: if its defence is lower than your card’s attack it is knocked off, but if it is faster than your card it may dodge, wasting your action.'),
    t('When their front line is down to one card or none, strike with a backline card: its attack wears down their defence for the turn, and the rest comes off their HP. A card can’t strike or attack on the turn it was played.'),
    t('Backline stats: ⚔️ attack makes your opponents’ questions easier and powers strikes; 🛡️ defence blocks strikes each turn; ⚡ speed adds a second per point to your answer time and takes one from your opponent’s (20 seconds to start); 🌊 swim reveals that many of their face-down cards, once per card.'),
    t('Extinction cards go in the front line. Your opponent must answer at once: wrong, and every animal they have in play that the extinction wiped out is gone. Right, and you must answer a saving question or lose your own.'),
    t('Bring their HP to 0 to win. When both decks run out there are six more turns; then the higher HP wins.'),
  ];
  return (
    <>
      <Text style={st.heading}>{t('How to play')}</Text>
      <View style={[st.card, { padding: 16, gap: 8 }]}>
        {lines.map((l) => (
          <Text key={l} style={st.text}>
            {l}
          </Text>
        ))}
      </View>
    </>
  );
}
