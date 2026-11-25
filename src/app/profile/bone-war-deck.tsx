import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { BoneWarCard, STAT_LAYOUTS, StatDisplay } from '@/components/bone-war-card';
import { CrocEye, DEFAULT_EYE } from '@/components/bone-war-fx';
import { BoneWarRules } from '@/components/bone-war-rules';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { type Card, cardKeyOf, cardName, DECK_SIZE, loadoutInUse, MIN_DECK, ownedCards } from '@/lib/bone-war';
import { type EyeColours, LOADOUT_SLOTS, type Loadout, useProfile } from '@/lib/profile';
import { SWATCHES } from '@/lib/theme';
import { useT } from '@/lib/i18n';

// T. rex's stats, for the layout previews.
const SAMPLE = { attack: 3, defence: 2, speed: 1, swim: 0 };

// Every colour offered for card backs and borders: each swatch's light and dark shade.
const COLOURS = SWATCHES.flatMap((s) => [s.dark, s.light]).concat(['#C9A227', '#8C1C13']);

// Choices for the crocodile eye on your cards in play.
const EYE_CHOICES: Record<keyof EyeColours, string[]> = {
  light: ['#7D8C45', '#A3A86B', '#5E7A3A', '#8C7A4A', '#B59A5C', '#9A8F7A', '#6F8A8A', '#C9C2A8'],
  dark: ['#3F4A24', '#2B3318', '#4A3B22', '#33302A', '#1F2A22', '#5A3A22', '#2A2A2A', '#24343F'],
  iris: ['#C8B43A', '#E8E070', '#D9A030', '#8FB03A', '#B05A2A', '#C23B2B', '#3A8FB0', '#7A5ACC'],
  sclera: ['#E8E2B8', '#F4F1E6', '#D9CFA0', '#C9D9B0', '#E6C9A8', '#BFBFBF', '#F0D8D8', '#2E2E2E'],
};

// Building the Bone War deck from the card collection, choosing the cards' colours, and loadouts.
export default function BoneWarDeckScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const { profile, update } = useProfile();
  const owned = ownedCards(profile).sort((a, b) => b.stars - a.stars);
  const eye = profile.cardStyle.eye ?? DEFAULT_EYE;
  const inDeck = new Set(profile.deck.filter((k) => owned.some((c) => c.key === k)));
  // Its own search box, separate from the app's main search: filters and sorts the collection.
  const [query, setQuery] = useState('');
  const favourite = new Set(profile.favourites.map(cardKeyOf));
  const shown = sortCollection(owned, query, favourite);
  const cols = width > 700 ? 6 : width > 480 ? 4 : 3;
  const cardW = Math.min(150, (Math.min(width, 900) - 32 - (cols - 1) * 10) / cols);

  const toggle = (key: string) => {
    const deck = [...inDeck];
    if (inDeck.has(key)) update({ deck: deck.filter((k) => k !== key) });
    else if (deck.length < DECK_SIZE) update({ deck: [...deck, key] });
  };
  const fill = () => {
    // The highest-star cards, whatever the search.
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
      <Text style={st.rowTitle}>{t('Crocodile eye')}</Text>
      <Text style={st.muted}>{t('Shown on your cards in play: closed while your opponent hasn’t seen the card, open once it’s revealed. Only you see it.')}</Text>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <CrocEye open={false} size={56} colours={eye} badge={false} />
        <CrocEye open size={56} colours={eye} badge={false} />
      </View>
      {(
        [
          ['light', t('Light scales')],
          ['dark', t('Dark scales')],
          ['iris', t('Iris')],
          ['sclera', t('White of the eye')],
        ] as const
      ).map(([part, label]) => (
        <View key={part} style={{ gap: 6 }}>
          <Text style={st.rowSub}>{label}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {EYE_CHOICES[part].map((c) => {
              const on = eye[part].toLowerCase() === c.toLowerCase();
              return (
                <Pressable
                  key={`${part}-${c}`}
                  onPress={() => update({ cardStyle: { ...profile.cardStyle, eye: { ...eye, [part]: c } } })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${label} ${c}`}
                  style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: on ? 3 : 1, borderColor: on ? palette.accent : palette.border }}
                />
              );
            })}
          </View>
        </View>
      ))}
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
          <Text style={st.text}>{t('You have no cards yet. Tap Acquire card on an animal’s page, then win it in Quiz → Test your wishlist.')}</Text>
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
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('Search your cards, or type a stat')}
            placeholderTextColor={palette.muted}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            accessibilityLabel={t('Search your cards')}
            style={st.input}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Text style={st.rowSub}>{t('Sort by')}</Text>
            {STAT_SORTS.map((x) => {
              const on = statOf(query) === x.stat;
              return (
                <Pressable
                  key={x.stat}
                  onPress={() => setQuery(on ? '' : x.word)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={t('Sort by {stat}', { stat: t(x.word) })}
                  style={({ pressed }) => [st.card, { paddingVertical: 6, paddingHorizontal: 10, borderWidth: on ? 2 : 1, borderColor: on ? palette.accent : palette.border }, pressed && st.pressed]}>
                  <Text style={[st.rowSub, on && { color: palette.accent, fontWeight: '700' }]}>
                    {x.icon} {t(x.word)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {query.trim() !== '' && (
            <Text style={st.muted}>
              {shown.length === 0 ? t('No cards match “{q}”.', { q: query.trim() }) : t('Showing {n} of {total} cards', { n: shown.length, total: owned.length })}
            </Text>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {shown.map((c) => {
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

type StatName = 'attack' | 'defence' | 'speed' | 'swim';
const STAT_SORTS: { stat: StatName; word: string; icon: string }[] = [
  { stat: 'attack', word: 'Attack', icon: '⚔️' },
  { stat: 'defence', word: 'Defence', icon: '🛡️' },
  { stat: 'speed', word: 'Speed', icon: '⚡' },
  { stat: 'swim', word: 'Swim', icon: '🌊' },
];
// A search that names one of the four stats (a word, its start, or its symbol).
function statOf(query: string): StatName | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (q.includes('⚔')) return 'attack';
  if (q.includes('🛡')) return 'defence';
  if (q.includes('⚡')) return 'speed';
  if (q.includes('🌊')) return 'swim';
  const words: [StatName, string[]][] = [
    ['attack', ['attack', 'atk']],
    ['defence', ['defence', 'defense', 'def']],
    ['speed', ['speed', 'spd', 'fast']],
    ['swim', ['swim', 'swimming']],
  ];
  for (const [stat, ws] of words) if (ws.some((w) => w === q || (q.length >= 3 && w.startsWith(q)))) return stat;
  return null;
}

// The collection to show: a stat search lists the cards with that stat, highest first; any other
// search keeps the cards whose animal, scientific name or keywords match. Favourited animals come
// first, then higher stars.
function sortCollection(cards: Card[], query: string, favourite: Set<string>): Card[] {
  const fav = (c: Card) => (favourite.has(c.key) ? 1 : 0);
  const base = (a: Card, b: Card) => fav(b) - fav(a) || b.stars - a.stars || cardName(a).localeCompare(cardName(b));
  const stat = statOf(query);
  if (stat) {
    const value = (c: Card) => (c.kind === 'species' ? c.stats[stat] : 0);
    return cards.filter((c) => value(c) > 0).sort((a, b) => value(b) - value(a) || base(a, b));
  }
  const q = query.trim().toLowerCase();
  const match = (c: Card) =>
    !q ||
    cardName(c).toLowerCase().includes(q) ||
    (c.kind === 'species' ? [c.species.name, ...(c.species.keywords ?? [])] : [c.event.name]).some((x) => x.toLowerCase().includes(q));
  return cards.filter(match).sort(base);
}

// Five saved decks. Saving stores the current deck and card colours; loading brings both back.
function Loadouts() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const slots: (Loadout | null)[] = Array.from({ length: LOADOUT_SLOTS }, (_, i) => profile.loadouts?.[i] ?? null);
  const setSlot = (i: number, l: Loadout | null) => update({ loadouts: slots.map((x, k) => (k === i ? l : x)) });
  const same = (l: Loadout) => loadoutInUse(profile, l);

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
                onPress={() => update({ deck: l.deck, cardStyle: { ...l.cardStyle, layout: profile.cardStyle.layout, eye: profile.cardStyle.eye } })}
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
