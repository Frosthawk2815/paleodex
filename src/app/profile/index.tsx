import { type Href, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AvatarImage, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { birthDateOf, birthMaOf, useProfile } from '@/lib/profile';
import { levelOf, tallyOf } from '@/lib/points';
import { titleById, TITLES } from '@/lib/titles';
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
    { label: 'Titles', detail: `${profile.titles.length} of ${TITLES.length} earned${titleById(profile.title) ? ` · showing ${titleById(profile.title)!.name}` : ''}`, href: '/profile/titles' },
    { label: 'Your Images', detail: allPhotos.length === 1 ? '1 photo' : `${allPhotos.length} photos`, href: '/profile/images' },
    { label: 'Settings', detail: 'Theme, text size and accessibility', href: '/profile/settings' },
    { label: 'Edit profile', detail: 'Name, birth date and picture', href: '/profile/edit' },
  ];

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
        <AvatarImage avatar={profile.avatar} name={profile.name} size={96} />
        <Text style={st.title}>{profile.name || 'Your profile'}</Text>
        {titleById(profile.title) && <Text style={[st.link, { fontStyle: 'italic' }]}>{titleById(profile.title)!.name}</Text>}
        <ProgressBar visited={profile.visited} />
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

// The exploration bar: points from every page opened for the first time, filling towards the next
// level. What each page is worth stays a surprise.
function ProgressBar({ visited }: { visited: string[] }) {
  const st = useProfileStyles();
  const palette = usePalette();
  const level = useMemo(() => levelOf(tallyOf(visited)), [visited]);
  const span = (level.to ?? level.points) - level.from;
  const fraction = span > 0 ? Math.min(1, (level.points - level.from) / span) : 1;
  const toGo = level.to !== null ? level.to - level.points : 0;
  return (
    <View
      style={{ alignSelf: 'stretch', gap: 6, marginTop: 4 }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Level ${level.level}, ${level.title}. ${level.points} points${level.to !== null ? `, ${toGo} to the next level` : ', the top level'}.`}
      accessibilityValue={{ min: level.from, max: level.to ?? level.points, now: level.points }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <Text style={st.rowTitle}>
          Level {level.level} · {level.title}
        </Text>
        <Text style={st.rowSub}>{level.points.toLocaleString()} points</Text>
      </View>
      <View style={{ height: 12, borderRadius: 6, backgroundColor: palette.track, borderWidth: 1, borderColor: palette.border, overflow: 'hidden' }}>
        <View style={{ width: `${Math.round(fraction * 100)}%`, height: '100%', borderRadius: 6, backgroundColor: palette.link }} />
      </View>
      <Text style={st.rowSub}>
        {level.to === null
          ? 'You’ve reached the top level. Keep exploring: your points still count.'
          : level.points === 0
            ? 'Open species, groups and places to earn points. Every new page you discover adds to your bar.'
            : `${toGo.toLocaleString()} points to level ${level.level + 1}. Discover new pages to fill the bar.`}
      </Text>
    </View>
  );
}
