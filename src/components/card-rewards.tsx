import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BoneWarCard, CardBackIcon } from '@/components/bone-war-card';
import { useProfileStyles } from '@/components/profile-ui';
import { useToast } from '@/components/toast';
import { usePalette } from '@/hooks/use-palette';
import { cardFor, cardName, ownsCard } from '@/lib/bone-war';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

// A Bone War card won in a quiz round: its key and stars, and whether it upgraded one already held.
export type Earned = { key: string; stars: number; upgrade: boolean };

// The reward pool under a quiz score. "Cards earned" holds cards the player has collected (new from a
// wishlist test, or upgraded); "Collect cards" holds cards for animals they haven't collected, each
// with a button that adds it to their collection. A section with nothing in it isn't shown.
export function CardRewards({ earned }: { earned: Earned[] }) {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const toast = useToast();
  const { profile, update } = useProfile();
  // Which section each card is in is decided once, when the results open, so a card that is
  // collected here stays in place (marked collected) rather than jumping to the other section.
  const [owned] = useState(() => new Set(earned.filter((e) => ownsCard(profile, e.key)).map((e) => e.key)));
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const cards = earned.flatMap((e) => {
    const card = cardFor(e.key, e.stars);
    return card ? [{ ...e, card }] : [];
  });
  const mine = cards.filter((c) => owned.has(c.key));
  const toCollect = cards.filter((c) => !owned.has(c.key));
  const width = 92;

  const collect = (key: string, stars: number) => {
    const card = cardFor(key, stars);
    if (!card || collected.has(key)) return;
    // Collected; a 5-star card also comes off the wishlist (lower ones stay, to be upgraded).
    update({ collection: [...new Set([...(profile.collection ?? []), key])], ...(stars >= 5 ? { wishlist: (profile.wishlist ?? []).filter((k) => k !== key) } : {}) });
    setCollected((s) => new Set(s).add(key));
    toast({ icon: <CardBackIcon size={34} />, title: t('Card acquired'), detail: `${cardName(card)} ${'★'.repeat(stars)}` });
  };

  if (!cards.length) return null;
  return (
    <View style={{ alignSelf: 'stretch', gap: 12 }}>
      {mine.length > 0 && (
        <View style={[st.card, { padding: 14, gap: 10 }]}>
          <Text style={st.rowTitle}>{t('Cards earned')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {mine.map((c) => (
              <View key={c.key} style={{ width, gap: 4, alignItems: 'center' }}>
                <BoneWarCard card={c.card} width={width} />
                <Text style={[st.rowSub, { color: palette.accent, textAlign: 'center' }]}>{c.upgrade ? t('Upgraded') : t('New')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {toCollect.length > 0 && (
        <View style={[st.card, { padding: 14, gap: 10 }]}>
          <Text style={st.rowTitle}>{t('Collect cards')}</Text>
          <Text style={st.muted}>{t('You answered these right. Collect a card to add it to your collection.')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {toCollect.map((c) => {
              const done = collected.has(c.key);
              return (
                <View key={c.key} style={{ width, gap: 6, alignItems: 'center' }}>
                  <View style={{ opacity: done ? 1 : 0.6 }}>
                    <BoneWarCard card={c.card} width={width} />
                  </View>
                  <Pressable
                    onPress={() => collect(c.key, c.stars)}
                    disabled={done}
                    accessibilityRole="button"
                    accessibilityLabel={done ? t('{name} collected', { name: cardName(c.card) }) : t('Collect {name}', { name: cardName(c.card) })}
                    style={({ pressed }) => [st.button, { paddingVertical: 6, paddingHorizontal: 10, alignSelf: 'stretch' }, done && { backgroundColor: palette.card }, pressed && st.pressed]}>
                    <Text style={[st.buttonText, { fontSize: 13 }, done && { color: palette.good }]}>{done ? t('Collected ✓') : t('Collect')}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
