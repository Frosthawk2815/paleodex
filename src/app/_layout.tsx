import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'PaleoDex', headerShown: false }} />
        <Stack.Screen name="period/[id]" options={{ title: '' }} />
        <Stack.Screen name="credits" options={{ title: 'Credits' }} />
        <Stack.Screen name="review" options={{ title: 'Review pictures' }} />
      </Stack>
    </ThemeProvider>
  );
}
