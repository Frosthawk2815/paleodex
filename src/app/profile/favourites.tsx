import { ScrollView, Text, View } from 'react-native';

import { PageRow, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { useProfile } from '@/lib/profile';

// Every page the user has starred, newest first.
export default function FavouritesScreen() {
  const st = useProfileStyles();
  const { profile, toggleFavourite } = useProfile();
  const showOnGlobe = useShowOnGlobe();
  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      {profile.favourites.length === 0 ? (
        <Text style={st.muted}>Nothing saved yet. Tap ☆ Save at the top of any species, group or formation page to keep it here.</Text>
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
