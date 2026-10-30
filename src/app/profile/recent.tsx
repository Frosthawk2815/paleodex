import { Pressable, ScrollView, Text, View } from 'react-native';

import { PageRow, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { RECENT_LIMIT, useProfile } from '@/lib/profile';

// The last pages the user opened, most recent first.
export default function RecentScreen() {
  const st = useProfileStyles();
  const { profile, clearRecent } = useProfile();
  const showOnGlobe = useShowOnGlobe();
  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.muted}>Your last {RECENT_LIMIT} species, group and formation pages, most recent first.</Text>
      {profile.recent.length === 0 ? (
        <Text style={st.muted}>You haven’t opened any pages yet.</Text>
      ) : (
        <>
          <View style={st.card}>
            {profile.recent.map((page, i) => (
              <View key={`${page.kind}:${page.id}`}>
                {i > 0 && <View style={st.divider} />}
                <PageRow page={page} onPress={() => showOnGlobe({ kind: 'page', page })} />
              </View>
            ))}
          </View>
          <Pressable onPress={clearRecent} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
            <Text style={st.link}>Clear history</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
