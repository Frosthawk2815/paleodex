import { useColorScheme } from 'react-native';

import { useProfile } from '@/lib/profile';

const light = {
  background: '#F7F5F0',
  card: '#FFFFFF',
  text: '#1C1B19',
  muted: '#6B675F',
  border: '#E3DFD6',
  track: '#ECE8DF',
};

const dark: typeof light = {
  background: '#121110',
  card: '#1D1C1A',
  text: '#F2EFE8',
  muted: '#A39E94',
  border: '#2E2C29',
  track: '#2A2825',
};

// High-contrast versions: pure black and white text, stronger secondary text and borders.
const lightContrast: typeof light = { ...light, background: '#FFFFFF', text: '#000000', muted: '#2B2925', border: '#7A756B' };
const darkContrast: typeof light = { ...dark, background: '#000000', card: '#111111', text: '#FFFFFF', muted: '#D6D1C7', border: '#8A857B' };

export type Palette = typeof light;

// 'light' or 'dark': the user's choice in settings, or the device's setting.
export function useScheme(): 'light' | 'dark' {
  const device = useColorScheme();
  const { theme } = useProfile().profile.settings;
  return theme === 'system' ? (device === 'dark' ? 'dark' : 'light') : theme;
}

export function usePalette(): Palette {
  const scheme = useScheme();
  const { highContrast } = useProfile().profile.settings;
  if (scheme === 'dark') return highContrast ? darkContrast : dark;
  return highContrast ? lightContrast : light;
}
