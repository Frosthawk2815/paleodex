import { router } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { BoneWarCard, STAT_LAYOUTS, StatDisplay } from '@/components/bone-war-card';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { DECK_SIZE, MIN_DECK, ownedCards } from '@/lib/bone-war';
import { useProfile } from '@/lib/profile';
import { SWATCHES } from '@/lib/theme';
import { useT } from '@/lib/i18n';

// T. rex's stats, for the layout previews.
const SAMPLE = { attack: 3, defence: 2, speed: 1, swim: 0 };

// Every colour offered for card backs and borders: each swatch's light and dark shade.
const COLOURS = SWATCHES.flatMap((s) => [s.dark, s.light]).concat(['#C9A227', '#8C1C13']);

// Building the Bone War deck from the cards in Favourites, and choosing the cards' colours.
export default function BoneWarDeckScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const { profile, update } = useProfile();
  const owned = ownedCards(profile).sort((a, b) => b.stars - a.stars);
  const inDeck = new Set(profile.deck.filter((k) => owned.some((c) => c.key === k)));
  const cols = width > 700 ? 6 : width > 480 ? 4 : 3;
  const cardW = Math.min(150, (Math.min(width, 900) - 32 - (cols - 1) * 10) / cols);

  const toggle = (key: string) => {
    const deck = [...inDeck];
    if (inDeck.has(key)) update({ deck: deck.filter((k) => k !== key) });
    else if (deck.length < DECK_SIZE) update({ deck: [...deck, key] });
  };
  const fill = () => {
    const rest = owned.filter((c) => !inDeck.has(c.key)).map((c) => c.key);
    update({ deck: [...inDeck, ...rest].slice(0, DECK_SIZE) });
  };

  const swatchRow = (which: 'back' | 'border') => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {COLOURS.map((c) => {
        const on = profile.cardStyle[which].toLowerCase() === c.toLowerCase();
        return (
          <Pressable
            key={`${which}-${c}`}
            onPress={() => update({ cardStyle: { ...profile.cardStyle, [which]: c } })}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={c}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c, borderWidth: on ? 3 : 1, borderColor: on ? palette.accent : palette.border }}
          />
        );
      })}
    </View>
  );

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.heading}>{t('Card colours')}</Text>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <BoneWarCard card={owned[0] ?? null} width={88} faceDown={!owned[0]} />
        <BoneWarCard card={null} width={88} faceDown />
        <Text style={[st.muted, { flex: 1 }]}>{t('Your cards appear like this to you and your opponents.')}</Text>
      </View>
      <Text style={st.rowTitle}>{t('Card back')}</Text>
      {swatchRow('back')}
      <Text style={st.rowTitle}>{t('Card colour (face and border)')}</Text>
      {swatchRow('border')}
      <Text style={st.rowTitle}>{t('How stats are shown')}</Text>
      <Text style={st.muted}>{t('⚔️ attack · 🛡️ defence · ⚡ speed · 🏊 swim. Each stat is 0 to 3. Your choice is used for every card you see, your opponent’s too.')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {STAT_LAYOUTS.map((l) => {
          const on = (profile.cardStyle.layout ?? 'squares') === l.id;
          return (
            <Pressable
              key={l.id}
              onPress={() => update({ cardStyle: { ...profile.cardStyle, layout: l.id } })}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[st.card, { padding: 8, alignItems: 'center', gap: 4, width: 104, borderWidth: on ? 2 : 1, borderColor: on ? palette.accent : palette.border }]}>
              <StatDisplay layout={l.id} stats={SAMPLE} width={88} height={88} color={palette.text} empty={palette.track} />
              <Text style={[st.rowSub, on && { color: palette.accent, fontWeight: '700' }]}>{t(l.name)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={st.heading}>{t('Your deck')}</Text>
      {owned.length === 0 ? (
        <View style={{ gap: 8 }}>
          <Text style={st.text}>{t('You have no cards yet. Answer questions correctly in the solo quiz, and save those animals or extinctions to your Favourites, to collect them.')}</Text>
          <Pressable onPress={() => router.push('/profile/quiz')} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>{t('Go to the quiz')}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={[st.rowTitle, { color: inDeck.size >= MIN_DECK ? palette.accent : palette.muted }]}>
            {t('{n} of {max} cards in your deck', { n: inDeck.size, max: DECK_SIZE })}
            {inDeck.size < MIN_DECK ? ` · ${t('at least {min} to play', { min: MIN_DECK })}` : ''}
          </Text>
          <Text style={st.muted}>{t('Tap a card to add it to your deck or take it out. Your collection is every favourite you have earned a card for.')}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={fill} accessibilityRole="button" style={({ pressed }) => [st.button, { flex: 1 }, pressed && st.pressed]}>
              <Text style={st.buttonText}>{t('Fill with my best cards')}</Text>
            </Pressable>
            <Pressable onPress={() => update({ deck: [] })} accessibilityRole="button" style={({ pressed }) => [st.button, { flex: 1, backgroundColor: palette.card }, pressed && st.pressed]}>
              <Text style={[st.buttonText, { color: palette.text }]}>{t('Clear')}</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {owned.map((c) => {
              const on = inDeck.has(c.key);
              return (
                <Pressable key={c.key} onPress={() => toggle(c.key)} accessibilityRole="checkbox" accessibilityState={{ checked: on }} style={{ opacity: on ? 1 : 0.45 }}>
                  <BoneWarCard card={c} width={cardW} highlight={on ? palette.accent : undefined} />
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}
