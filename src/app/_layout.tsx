import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useMemo } from 'react';

import { usePalette } from '@/hooks/use-palette';
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
        <Stack.Screen name="profile/settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="profile/edit" options={{ title: 'Edit profile' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ProfileProvider>
      <UserPhotosProvider>
        <Screens />
      </UserPhotosProvider>
    </ProfileProvider>
  );
}
