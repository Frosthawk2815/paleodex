import { useColorScheme } from 'react-native';

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

export type Palette = typeof light;

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
