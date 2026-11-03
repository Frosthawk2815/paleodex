import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useMemo } from 'react';

import { AchievementWatcher } from '@/components/achievements';
import { ToastProvider } from '@/components/toast';
import { usePalette } from '@/hooks/use-palette';
import { FontsReady, PAPER_FONTS } from '@/lib/fonts';
import { ProfileProvider } from '@/lib/profile';
import { UserPhotosProvider } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

function Screens() {
  const p = usePalette();
  const t = useT();
  // Headers and screen backgrounds follow the user's theme, including custom colours.
  const navTheme = useMemo(() => {
    const base = p.dark ? DarkTheme : DefaultTheme;
    return { ...base, colors: { ...base.colors, background: p.background, card: p.card, text: p.text, border: p.border, primary: p.link } };
  }, [p]);
  return (
    <ThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'PaleoDex', headerShown: false }} />
        <Stack.Screen name="period/[id]" options={{ title: '' }} />
        <Stack.Screen name="read" options={{ title: '' }} />
        <Stack.Screen name="credits" options={{ title: t('Credits') }} />
        <Stack.Screen name="profile/index" options={{ title: t('Profile') }} />
        <Stack.Screen name="profile/favourites" options={{ title: t('Favourites') }} />
        <Stack.Screen name="profile/recent" options={{ title: t('Recently viewed') }} />
        <Stack.Screen name="profile/images" options={{ title: t('Your Images') }} />
        <Stack.Screen name="profile/titles" options={{ title: t('Titles') }} />
        <Stack.Screen name="profile/places" options={{ title: t('Places') }} />
        <Stack.Screen name="profile/quiz" options={{ title: t('Quiz') }} />
        <Stack.Screen name="profile/battle" options={{ title: t('Bone War') }} />
        <Stack.Screen name="profile/peer-review" options={{ title: t('Peer Review') }} />
        <Stack.Screen name="profile/settings" options={{ title: t('Settings') }} />
        <Stack.Screen name="profile/edit" options={{ title: t('Edit profile') }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // The paper theme's fonts load in the background; the app shows straight away.
  const [fontsLoaded] = useFonts(PAPER_FONTS);
  return (
    <FontsReady value={fontsLoaded}>
      <ProfileProvider>
        <UserPhotosProvider>
          <ToastProvider>
            <Screens />
            <AchievementWatcher />
          </ToastProvider>
        </UserPhotosProvider>
      </ProfileProvider>
    </FontsReady>
  );
}
