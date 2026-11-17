import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BoneWarCard } from '@/components/bone-war-card';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { DECK_SIZE, deckCards, MIN_DECK, ownedCards } from '@/lib/bone-war';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

// Bone War: the card game's home. New players are shown how to earn cards and build a deck.
export default function BoneWarScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile } = useProfile();
  const owned = ownedCards(profile);
  const deck = deckCards(profile);
  const sample = owned.slice(0, 3);
  const ready = deck.length >= MIN_DECK;

  const row = (title: string, sub: string, onPress: () => void, disabled = false) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [st.card, st.row, pressed && st.pressed, disabled && { opacity: 0.5 }]}>
      <View style={st.rowText}>
        <Text style={st.rowTitle}>{title}</Text>
        <Text style={st.rowSub}>{sub}</Text>
      </View>
      <Text style={st.chevron}>›</Text>
    </Pressable>
  );

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.text}>{t('Use your knowledge to defeat enemy animals. Collect cards, build a deck of up to 30 and battle the computer or a friend.')}</Text>
      <Text style={st.muted}>
        {t('Named after the Bone Wars of the late 1800s, when rival fossil hunters Edward Drinker Cope and Othniel Marsh raced, spied on and sabotaged each other to find new dinosaurs. Between them they named more than 130 new species, from Stegosaurus and Triceratops to Camarasaurus.')}
      </Text>

      {sample.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
          {sample.map((c) => (
            <BoneWarCard key={c.key} card={c} width={96} />
          ))}
        </View>
      )}

      {owned.length === 0 ? (
        <View style={[st.card, { padding: 16, gap: 8 }]}>
          <Text style={st.rowTitle}>{t('How to get your first cards')}</Text>
          <Text style={st.text}>{t('1. Play the solo quiz. Every animal or mass extinction you answer a question about correctly can become a card.')}</Text>
          <Text style={st.text}>{t('2. Save that animal or extinction to your Favourites (☆ Save at the top of its page). The card is yours.')}</Text>
          <Text style={st.text}>{t('3. Its stars match the level of the question: a level 1 question earns a 1-star card, level 5 a 5-star card. Answer a harder question later to upgrade it.')}</Text>
          <Text style={st.text}>{t('4. Build a deck of {min} to {max} cards from your Favourites, then play.', { min: MIN_DECK, max: DECK_SIZE })}</Text>
          <Pressable onPress={() => router.push('/profile/quiz')} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{t('Go to the quiz')}</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[st.rowTitle, { color: palette.accent }]}>
          {t('{n} cards collected · deck {d} of {max}', { n: owned.length, d: deck.length, max: DECK_SIZE })}
        </Text>
      )}

      {owned.length > 0 && !ready && (
        <Text style={st.muted}>{t('You need at least {min} cards in your deck to play. Earn more in the solo quiz, then add them to your deck.', { min: MIN_DECK })}</Text>
      )}

      {row(t('Play the computer'), ready ? t('A practice battle against Animal Almanac') : t('Build a deck first'), () => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'ai' } }), !ready)}
      {row(t('Play a friend'), ready ? t('Two phones, connected with a battle code') : t('Build a deck first'), () => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'friend' } }), !ready)}
      {row(t('Build your deck'), t('Choose up to {max} cards from your Favourites, and the colours of your cards', { max: DECK_SIZE }), () => router.push('/profile/bone-war-deck'))}

      <Text style={st.heading}>{t('How to play')}</Text>
      <View style={[st.card, { padding: 16, gap: 8 }]}>
        <Text style={st.text}>{t('Each player starts with 20 HP, a hand of 5 cards and two actions a turn, and draws 2 at the end of each turn.')}</Text>
        <Text style={st.text}>{t('Cards go face down: up to 6 in your front line, the question line, and 3 in your backline, the player line. A backline card can move to the front, but never back.')}</Text>
        <Text style={st.text}>{t('Challenge a card in your opponent’s front line by answering a question about it at its star level. Right: it is knocked out and they lose 2 HP. Wrong: it stays, and another try brings a new question.')}</Text>
        <Text style={st.text}>{t('When their front line is empty, strike with a backline card: its attack wears down their defence for the turn, and the rest comes off their HP. A card can’t strike on the turn it was played.')}</Text>
        <Text style={st.text}>{t('Backline stats: ▲ attack makes your opponents’ questions easier and powers strikes; ▼ defence blocks strikes each turn; ▶ speed adds a second per point to your answer time and takes one from your opponent’s (20 seconds to start); ◀ swim reveals that many of their face-down cards, once per card.')}</Text>
        <Text style={st.text}>{t('Extinction cards go in the front line. Your opponent must answer at once: wrong, and every animal they have in play that the extinction wiped out is gone. Right, and you must answer a saving question or lose your own.')}</Text>
        <Text style={st.text}>{t('The Humans card (Homo sapiens) is an extinction card too: it wipes out the animals people helped drive extinct: the Ice Age giants, from mammoths and sabre-tooths to giant ground sloths, moa and Diprotodon, those lost since, such as the dodo, Steller’s sea cow and the thylacine, and every other human species, from Homo erectus to the Neanderthals. Living apes are safe.')}</Text>
        <Text style={st.text}>{t('Bring their HP to 0 to win. When both decks run out there are six more turns; then the higher HP wins.')}</Text>
      </View>
    </ScrollView>
  );
}
