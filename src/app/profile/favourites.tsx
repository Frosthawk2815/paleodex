import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PageRow, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { ownedCards } from '@/lib/bone-war';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

// Every page the user has starred, newest first.
export default function FavouritesScreen() {
  const st = useProfileStyles();
  const t = useT();
  const { profile, toggleFavourite } = useProfile();
  const showOnGlobe = useShowOnGlobe();
  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Pressable onPress={() => router.push('/profile/bone-war-deck')} accessibilityRole="button" style={({ pressed }) => [st.card, st.row, pressed && st.pressed]}>
        <View style={st.rowText}>
          <Text style={st.rowTitle}>{t('🃏 Build your Bone War deck')}</Text>
          <Text style={st.rowSub}>{t('{n} of your favourites are Bone War cards', { n: ownedCards(profile).length })}</Text>
        </View>
        <Text style={st.chevron}>›</Text>
      </Pressable>
      {profile.favourites.length === 0 ? (
        <Text style={st.muted}>{t('Nothing saved yet. Tap ☆ Save at the top of any species, group or formation page to keep it here.')}</Text>
      ) : (
        <View style={st.card}>
          {profile.favourites.map((page, i) => (
            <View key={`${page.kind}:${page.id}`}>
              {i > 0 && <View style={st.divider} />}
              <PageRow page={page} onPress={() => showOnGlobe({ kind: 'page', page })} onRemove={() => toggleFavourite(page)} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
