import { type Href, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AvatarImage, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { birthDateOf, birthMaOf, useProfile } from '@/lib/profile';
import { useUserPhotos } from '@/lib/user-photos';

// The profile menu: who the user is, their favourites and recent pages, settings, and credits.
export default function ProfileScreen() {
  const st = useProfileStyles();
  const { profile } = useProfile();
  const showOnGlobe = useShowOnGlobe();
  const { allPhotos } = useUserPhotos();
  const born = birthDateOf(profile);
  const bornMa = birthMaOf(profile);

  const rows: { label: string; detail?: string; href: Href }[] = [
    { label: 'Favourites', detail: `${profile.favourites.length} saved`, href: '/profile/favourites' },
    { label: 'Recently viewed', detail: profile.recent.length === 1 ? 'Your last page' : `Your last ${profile.recent.length} pages`, href: '/profile/recent' },
    { label: 'Your Images', detail: allPhotos.length === 1 ? '1 photo' : `${allPhotos.length} photos`, href: '/profile/images' },
    { label: 'Settings', detail: 'Theme, text size and accessibility', href: '/profile/settings' },
    { label: 'Edit profile', detail: 'Name, birth date and picture', href: '/profile/edit' },
  ];

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
        <AvatarImage avatar={profile.avatar} name={profile.name} size={96} />
        <Text style={st.title}>{profile.name || 'Your profile'}</Text>
        {born ? (
          <Pressable onPress={() => showOnGlobe({ kind: 'time', ma: bornMa! })} accessibilityRole="button" hitSlop={6}>
            <Text style={st.link}>
              Born {born.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} · Go to that year ›
            </Text>
          </Pressable>
        ) : (
          <Text style={st.muted}>Add your name, birth date and picture in Edit profile.</Text>
        )}
      </View>

      <View style={st.card}>
        {rows.map((r, i) => (
          <View key={r.label}>
            {i > 0 && <View style={st.divider} />}
            <Pressable onPress={() => router.push(r.href)} accessibilityRole="button" style={({ pressed }) => [st.row, pressed && st.pressed]}>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{r.label}</Text>
                  {r.detail && <Text style={st.rowSub}>{r.detail}</Text>}
                </View>
                <Text style={st.chevron}>›</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={st.heading}>Credits</Text>
      <View style={st.card}>
        <Pressable onPress={() => router.push('/credits')} accessibilityRole="button" style={({ pressed }) => [st.row, pressed && st.pressed]}>
            <View style={st.rowText}>
              <Text style={st.rowTitle}>Image and data credits</Text>
              <Text style={st.rowSub}>
                Pictures from Wikimedia Commons · Land and sea: Scotese & Wright (2018) PALEOMAP · Sea level: Spratt & Lisiecki (2016), Bintanja &
                van de Wal (2008)
              </Text>
            </View>
            <Text style={st.chevron}>›</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
