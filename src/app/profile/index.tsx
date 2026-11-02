import { type Href, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AvatarImage, useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { birthDateOf, birthMaOf, useProfile } from '@/lib/profile';
import { levelOf, tallyOf } from '@/lib/points';
import { titleById, TITLES } from '@/lib/titles';
import { useUserPhotos } from '@/lib/user-photos';
import { useLanguage, useT } from '@/lib/i18n';

// The profile menu: who the user is, their favourites and recent pages, settings, and credits.
export default function ProfileScreen() {
  const st = useProfileStyles();
  const t = useT();
  const lang = useLanguage();
  const { profile } = useProfile();
  const showOnGlobe = useShowOnGlobe();
  const { allPhotos } = useUserPhotos();
  const born = birthDateOf(profile);
  const bornMa = birthMaOf(profile);

  const rows: { label: string; detail?: string; href: Href }[] = [
    { label: t('Favourites'), detail: t('{n} saved', { n: profile.favourites.length }), href: '/profile/favourites' },
    { label: t('Recently viewed'), detail: profile.recent.length === 1 ? t('Your last page') : t('Your last {n} pages', { n: profile.recent.length }), href: '/profile/recent' },
    { label: t('Quiz'), detail: t('Test what you know: dinosaurs, groups and periods, at five levels'), href: '/profile/quiz' },
    { label: t('Titles'), detail: t('{n} of {total} earned', { n: profile.titles.length, total: TITLES.length }) + (titleById(profile.title) ? ` · ${t('showing {title}', { title: titleById(profile.title)!.name })}` : ''), href: '/profile/titles' },
    { label: t('Places'), detail: profile.places.length ? t('Birthplace, home and check-ins · {n} visited', { n: profile.places.length }) : t('Birthplace, home and check-ins at museums, zoos and fossil sites'), href: '/profile/places' },
    { label: t('Your Images'), detail: allPhotos.length === 1 ? t('1 photo') : t('{n} photos', { n: allPhotos.length }), href: '/profile/images' },
    { label: t('Settings'), detail: t('Theme, text size, units and accessibility'), href: '/profile/settings' },
    { label: t('Edit profile'), detail: t('Name, birth date and picture'), href: '/profile/edit' },
  ];

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
        <AvatarImage avatar={profile.avatar} name={profile.name} size={96} />
        <Text style={st.title}>{profile.name || t('Your profile')}</Text>
        {titleById(profile.title) && <Text style={[st.link, { fontStyle: 'italic' }]}>{titleById(profile.title)!.name}</Text>}
        <ProgressBar visited={profile.visited} />
        {born ? (
          <Pressable onPress={() => showOnGlobe({ kind: 'time', ma: bornMa! })} accessibilityRole="button" hitSlop={6}>
            <Text style={st.link}>
              {t('Born {date} · Go to that year ›', { date: born.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) })}
            </Text>
          </Pressable>
        ) : (
          <Text style={st.muted}>{t('Add your name, birth date and picture in Edit profile.')}</Text>
        )}
        {profile.birthplace && (
          <Pressable onPress={() => showOnGlobe({ kind: 'user', which: 'birthplace' })} accessibilityRole="button" hitSlop={6}>
            <Text style={st.link}>{t('Born in {place} · See it through time ›', { place: profile.birthplace.label.replace(/^Near /, 'near ') })}</Text>
          </Pressable>
        )}
        {profile.home && (
          <Pressable onPress={() => showOnGlobe({ kind: 'user', which: 'home' })} accessibilityRole="button" hitSlop={6}>
            <Text style={st.link}>{t('Home: {place} · See it through time ›', { place: profile.home.label.replace(/^Near /, 'near ') })}</Text>
          </Pressable>
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

      <Text style={st.heading}>{t('Credits')}</Text>
      <View style={st.card}>
        <Pressable onPress={() => router.push('/credits')} accessibilityRole="button" style={({ pressed }) => [st.row, pressed && st.pressed]}>
            <View style={st.rowText}>
              <Text style={st.rowTitle}>{t('Image and data credits')}</Text>
              <Text style={st.rowSub}>
                {t('Pictures from Wikimedia Commons · Land and sea: Scotese & Wright (2018) PALEOMAP · Sea level: Spratt & Lisiecki (2016), Bintanja & van de Wal (2008)')}
              </Text>
            </View>
            <Text style={st.chevron}>›</Text>
        </Pressable>
      </View>

      <Text style={st.heading}>{t('A note from the maker')}</Text>
      <Text style={st.muted}>
        {t('This app is not intended to be a one-stop shop for all information related to prehistoric or modern animals. I encourage you to do more research. This was built on my knowledge and aided by AI (it was nice to out-niche-pick an LLM with access to the internet lol, but I couldn’t have coded this without it, or simulated Earth’s geography through time). Go forth, dear user, and discover!')}
      </Text>
    </ScrollView>
  );
}

// The exploration bar: points from every page opened for the first time, filling towards the next
// level. What each page is worth stays a surprise.
function ProgressBar({ visited }: { visited: string[] }) {
  const st = useProfileStyles();
  const t = useT();
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
      accessibilityLabel={level.to !== null ? t('Level {level}, {title}. {points} points, {toGo} to the next level.', { level: level.level, title: t(level.title), points: level.points, toGo }) : t('Level {level}, {title}. {points} points, the top level.', { level: level.level, title: t(level.title), points: level.points })}
      accessibilityValue={{ min: level.from, max: level.to ?? level.points, now: level.points }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <Text style={st.rowTitle}>{t('Level {level} · {title}', { level: level.level, title: t(level.title) })}</Text>
        <Text style={st.rowSub}>{t('{n} points', { n: level.points.toLocaleString() })}</Text>
      </View>
      <View style={{ height: 12, borderRadius: 6, backgroundColor: palette.track, borderWidth: 1, borderColor: palette.border, overflow: 'hidden' }}>
        <View style={{ width: `${Math.round(fraction * 100)}%`, height: '100%', borderRadius: 6, backgroundColor: palette.link }} />
      </View>
      <Text style={st.rowSub}>
        {level.to === null
          ? t('You’ve reached the top level. Keep exploring: your points still count.')
          : level.points === 0
            ? t('Open species, groups and places to earn points. Every new page you discover adds to your bar.')
            : t('{n} points to level {level}. Discover new pages to fill the bar.', { n: toGo.toLocaleString(), level: level.level + 1 })}
      </Text>
    </View>
  );
}
