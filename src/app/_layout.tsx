import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useScheme } from '@/hooks/use-palette';
import { ProfileProvider } from '@/lib/profile';
import { UserPhotosProvider } from '@/lib/user-photos';

function Screens() {
  const scheme = useScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'PaleoDex', headerShown: false }} />
        <Stack.Screen name="period/[id]" options={{ title: '' }} />
        <Stack.Screen name="credits" options={{ title: 'Credits' }} />
        <Stack.Screen name="review" options={{ title: 'Review pictures' }} />
        <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
        <Stack.Screen name="profile/favourites" options={{ title: 'Favourites' }} />
        <Stack.Screen name="profile/recent" options={{ title: 'Recently viewed' }} />
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
