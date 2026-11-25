import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BoneWarCard } from '@/components/bone-war-card';
import { BoneWarRules } from '@/components/bone-war-rules';
import { GlitchOverlay, GlitchText, useGlitch } from '@/components/glitch';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { DECK_SIZE, deckCards, loadoutInUse, MIN_DECK, ownedCards } from '@/lib/bone-war';
import { BLACK, CHAMPIONS, HEART_OF_THE_CARDS, SHADOW, SHADOW_CARDS } from '@/lib/bone-war-champions';
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
  const heart = profile.titles.includes(HEART_OF_THE_CARDS) || CHAMPIONS.every((c) => profile.champions.includes(c.style));

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
          <Text style={st.text}>{t('1. Tap Acquire card at the top of any animal or mass extinction page to put it on your card wishlist.')}</Text>
          <Text style={st.text}>{t('2. In the quiz, choose Test your wishlist and answer a question on each one. Get it right and the card is yours. You can also collect cards for animals you answer right in a normal quiz.')}</Text>
          <Text style={st.text}>{t('3. Its stars match the level of the question: a level 1 question earns a 1-star card, level 5 a 5-star card. Answer a harder question later to upgrade it.')}</Text>
          <Text style={st.text}>{t('4. Build a deck of {min} to {max} cards from your collection, then play.', { min: MIN_DECK, max: DECK_SIZE })}</Text>
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

      <LoadoutPicker />

      {row(t('Play the computer'), ready ? t('A practice battle against Animal Almanac') : t('Build a deck first'), () => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'ai' } }), !ready)}
      {row(t('Play a friend'), ready ? t('Two phones, connected with a battle code') : t('Build a deck first'), () => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'friend' } }), !ready)}

      <Text style={st.heading}>{t('Champions')}</Text>
      <Text style={st.muted}>
        {t('Hardcore battles against the computer playing one style with a deck built for it. Beat a champion to earn their title, and all five to become Heart of the Cards.')}
      </Text>
      {CHAMPIONS.map((c) => {
        const beaten = profile.champions.includes(c.style);
        return (
          <Pressable
            key={c.style}
            onPress={() => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'champion', style: c.style } })}
            disabled={!ready}
            accessibilityRole="button"
            accessibilityState={{ disabled: !ready }}
            accessibilityLabel={`${t(c.name)}. ${t(c.blurb)} ${beaten ? t('Beaten: {title}', { title: t(c.titleName) }) : t('Title: {title}', { title: t(c.titleName) })}`}
            style={({ pressed }) => [st.card, st.row, { backgroundColor: c.look.background, borderColor: c.cardStyle.border, borderWidth: 2 }, pressed && st.pressed, !ready && { opacity: 0.5 }]}>
            <View style={{ width: 14, height: 40, borderRadius: 4, backgroundColor: c.cardStyle.back, borderWidth: 2, borderColor: c.cardStyle.border }} />
            <View style={st.rowText}>
              <Text style={[st.rowTitle, { color: c.look.text }]}>
                {beaten ? '✓ ' : ''}
                {t(c.name)}
              </Text>
              <Text style={[st.rowSub, { color: c.look.muted }]}>{t(c.blurb)}</Text>
              <Text style={[st.rowSub, { color: c.look.accent, fontWeight: '700' }]}>{beaten ? t('Beaten: {title}', { title: t(c.titleName) }) : t('Title: {title}', { title: t(c.titleName) })}</Text>
            </View>
            <Text style={[st.chevron, { color: c.look.muted }]}>›</Text>
          </Pressable>
        );
      })}
      {heart && <Text style={[st.rowTitle, { color: palette.accent, textAlign: 'center' }]}>{t('♥ Heart of the Cards: every champion beaten')}</Text>}
      {heart && <ShadowRow ready={ready} />}

      <BoneWarRules />
    </ScrollView>
  );
}

// The secret champion, you in the dark, shown with a deliberate glitch.
function ShadowRow({ ready }: { ready: boolean }) {
  const st = useProfileStyles();
  const t = useT();
  const { profile, reduceMotion } = useProfile();
  const burst = useGlitch(reduceMotion);
  const look = BLACK;
  const cards = SHADOW_CARDS;
  const beaten = profile.champions.includes(SHADOW);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/profile/bone-war-game', params: { mode: 'champion', style: SHADOW } })}
      disabled={!ready}
      accessibilityRole="button"
      accessibilityState={{ disabled: !ready }}
      accessibilityLabel={`${t('Shadow {name}', { name: profile.name || t('You') })}${beaten ? `. ${t('Beaten: {title}', { title: t('Banisher of Shadows') })}` : ''}`}
      style={({ pressed }) => [st.card, st.row, { backgroundColor: look.background, borderColor: cards.border, borderWidth: 2, overflow: 'hidden' }, pressed && st.pressed, !ready && { opacity: 0.5 }]}>
      <View style={{ width: 14, height: 40, borderRadius: 4, backgroundColor: cards.back, borderWidth: 2, borderColor: cards.border, transform: [{ translateX: burst ? -burst.dx : 0 }] }} />
      <View style={st.rowText}>
        <GlitchText text={`${beaten ? '✓ ' : ''}${t('Shadow {name}', { name: profile.name || t('You') })}`} style={st.rowTitle} color={look.text} burst={burst} />
        {/* No description: only a laugh that flickers in during a glitch. */}
        <View style={{ minHeight: 20 }}>{burst && <GlitchText text="hahahaha" style={st.rowSub} color={look.muted} burst={burst} clean />}</View>
        {beaten && <Text style={[st.rowSub, { color: look.accent, fontWeight: '700' }]}>{t('Beaten: {title}', { title: t('Banisher of Shadows') })}</Text>}
      </View>
      <Text style={[st.chevron, { color: look.muted }]}>›</Text>
      <GlitchOverlay burst={burst} tint="#22E5FF" />
    </Pressable>
  );
}

// Which saved loadout to play with. Decks are built and saved in Profile › Bone War cards.
function LoadoutPicker() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const saved = (profile.loadouts ?? []).flatMap((l, i) => (l ? [{ l, i }] : []));
  const unsaved = profile.deck.length > 0 && !saved.some(({ l }) => loadoutInUse(profile, l));
  const owned = new Set(ownedCards(profile).map((c) => c.key));
  const swatch = (back: string, border: string) => <View style={{ width: 18, height: 26, borderRadius: 4, backgroundColor: back, borderWidth: 3, borderColor: border }} />;
  return (
    <>
      <Text style={st.heading}>{t('Your loadout')}</Text>
      {saved.length === 0 && !unsaved && <Text style={st.muted}>{t('No decks yet. Build one and save it as a loadout in Profile › Bone War cards.')}</Text>}
      {saved.map(({ l, i }) => {
        const on = loadoutInUse(profile, l);
        const size = l.deck.filter((k) => owned.has(k)).length;
        return (
          <Pressable
            key={i}
            onPress={() => update({ deck: l.deck, cardStyle: { ...l.cardStyle, layout: profile.cardStyle.layout, eye: profile.cardStyle.eye } })}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            style={({ pressed }) => [st.card, st.row, { borderWidth: on ? 2 : 1, borderColor: on ? palette.accent : palette.border }, pressed && st.pressed]}>
            {swatch(l.cardStyle.back, l.cardStyle.border)}
            <View style={st.rowText}>
              <Text style={[st.rowTitle, on && { color: palette.accent }]}>{l.name || t('Loadout {n}', { n: i + 1 })}</Text>
              <Text style={st.rowSub}>
                {size === 1 ? t('1 card') : t('{n} cards', { n: size })}
                {size < MIN_DECK ? ` · ${t('at least {min} to play', { min: MIN_DECK })}` : ''}
              </Text>
            </View>
            {on && <Text style={[st.rowTitle, { color: palette.accent }]}>✓</Text>}
          </Pressable>
        );
      })}
      {unsaved && (
        <View style={[st.card, st.row, { borderWidth: 2, borderColor: palette.accent }]}>
          {swatch(profile.cardStyle.back, profile.cardStyle.border)}
          <View style={st.rowText}>
            <Text style={[st.rowTitle, { color: palette.accent }]}>{t('Current deck (not saved)')}</Text>
            <Text style={st.rowSub}>{t('{n} cards', { n: deckCards(profile).length })}</Text>
          </View>
          <Text style={[st.rowTitle, { color: palette.accent }]}>✓</Text>
        </View>
      )}
      <Pressable onPress={() => router.push('/profile/bone-war-deck')} accessibilityRole="button" hitSlop={6}>
        <Text style={st.link}>{t('Build and manage decks ›')}</Text>
      </Pressable>
    </>
  );
}
