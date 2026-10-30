import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useMemo } from 'react';

import { AchievementWatcher } from '@/components/achievements';
import { ToastProvider } from '@/components/toast';
import { usePalette } from '@/hooks/use-palette';
import { FontsReady, PAPER_FONTS } from '@/lib/fonts';
import { ProfileProvider } from '@/lib/profile';
import { UserPhotosProvider } from '@/lib/user-photos';

function Screens() {
  const p = usePalette();
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
        <Stack.Screen name="credits" options={{ title: 'Credits' }} />
        <Stack.Screen name="review" options={{ title: 'Review pictures' }} />
        <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
        <Stack.Screen name="profile/favourites" options={{ title: 'Favourites' }} />
        <Stack.Screen name="profile/recent" options={{ title: 'Recently viewed' }} />
        <Stack.Screen name="profile/images" options={{ title: 'Your Images' }} />
        <Stack.Screen name="profile/titles" options={{ title: 'Titles' }} />
        <Stack.Screen name="profile/places" options={{ title: 'Places' }} />
        <Stack.Screen name="profile/settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="profile/edit" options={{ title: 'Edit profile' }} />
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
