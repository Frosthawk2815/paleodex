import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { BoneWarCard, STAT_LAYOUTS, StatDisplay } from '@/components/bone-war-card';
import { BoneWarRules } from '@/components/bone-war-rules';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { DECK_SIZE, MIN_DECK, ownedCards } from '@/lib/bone-war';
import { LOADOUT_SLOTS, type Loadout, useProfile } from '@/lib/profile';
import { SWATCHES } from '@/lib/theme';
import { useT } from '@/lib/i18n';

// T. rex's stats, for the layout previews.
const SAMPLE = { attack: 3, defence: 2, speed: 1, swim: 0 };

// Every colour offered for card backs and borders: each swatch's light and dark shade.
const COLOURS = SWATCHES.flatMap((s) => [s.dark, s.light]).concat(['#C9A227', '#8C1C13']);

// Building the Bone War deck from the card collection, choosing the cards' colours, and loadouts.
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
      <Text style={st.muted}>{t('⚔️ attack · 🛡️ defence · ⚡ speed · 🌊 swim. Each stat is 0 to 3. Your choice is used for every card you see, your opponent’s too.')}</Text>
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
          <Text style={st.text}>{t('You have no cards yet. Tap 🃏 Acquire card on an animal’s page, then win it in Quiz → Test your wishlist.')}</Text>
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
          <Text style={st.muted}>
            {t('Tap a card to add it to your deck or take it out.')}
          </Text>
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
      <Loadouts />
      <BoneWarRules />
    </ScrollView>
  );
}

// Five saved decks. Saving stores the current deck and card colours; loading brings both back.
function Loadouts() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const slots: (Loadout | null)[] = Array.from({ length: LOADOUT_SLOTS }, (_, i) => profile.loadouts?.[i] ?? null);
  const setSlot = (i: number, l: Loadout | null) => update({ loadouts: slots.map((x, k) => (k === i ? l : x)) });
  const same = (l: Loadout) => l.deck.length === profile.deck.length && l.deck.every((k) => profile.deck.includes(k)) && l.cardStyle.back === profile.cardStyle.back && l.cardStyle.border === profile.cardStyle.border;

  return (
    <>
      <Text style={st.heading}>{t('Loadouts')}</Text>
      <Text style={st.muted}>{t('Save your deck and its card colours in one of five slots, and switch between them.')}</Text>
      {slots.map((l, i) => (
        <View key={i} style={[st.card, { padding: 12, gap: 8 }, l && same(l) && { borderWidth: 2, borderColor: palette.accent }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{ width: 22, height: 30, borderRadius: 4, backgroundColor: l ? l.cardStyle.back : palette.track, borderWidth: 3, borderColor: l ? l.cardStyle.border : palette.border }}
              accessibilityElementsHidden
            />
            {l ? (
              <TextInput
                value={l.name}
                onChangeText={(name) => setSlot(i, { ...l, name: name.slice(0, 30) })}
                placeholder={t('Loadout {n}', { n: i + 1 })}
                placeholderTextColor={palette.muted}
                accessibilityLabel={t('Name of loadout {n}', { n: i + 1 })}
                style={[st.input, { flex: 1, paddingVertical: 6 }]}
              />
            ) : (
              <Text style={[st.rowTitle, { flex: 1, color: palette.muted }]}>{t('Empty slot {n}', { n: i + 1 })}</Text>
            )}
          </View>
          {l && (
            <Text style={st.rowSub}>
              {l.deck.length === 1 ? t('1 card') : t('{n} cards', { n: l.deck.length })}
              {same(l) ? ` · ${t('in use')}` : ''}
            </Text>
          )}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {l && (
              <Pressable
                onPress={() => update({ deck: l.deck, cardStyle: { ...l.cardStyle, layout: profile.cardStyle.layout } })}
                accessibilityRole="button"
                style={({ pressed }) => [st.button, { flex: 1, paddingVertical: 8 }, pressed && st.pressed]}>
                <Text style={st.buttonText}>{t('Load')}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => setSlot(i, { name: l?.name || t('Loadout {n}', { n: i + 1 }), deck: [...profile.deck], cardStyle: { back: profile.cardStyle.back, border: profile.cardStyle.border } })}
              disabled={profile.deck.length === 0}
              accessibilityRole="button"
              style={({ pressed }) => [st.button, { flex: 1, paddingVertical: 8, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }, pressed && st.pressed, profile.deck.length === 0 && { opacity: 0.5 }]}>
              <Text style={[st.buttonText, { color: palette.text }]}>{l ? t('Save here') : t('Save current deck')}</Text>
            </Pressable>
            {l && (
              <Pressable onPress={() => setSlot(i, null)} accessibilityRole="button" accessibilityLabel={t('Clear loadout {n}', { n: i + 1 })} hitSlop={6} style={{ justifyContent: 'center', paddingHorizontal: 6 }}>
                <Text style={[st.link, { color: palette.bad }]}>{t('Clear')}</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}
    </>
  );
}
