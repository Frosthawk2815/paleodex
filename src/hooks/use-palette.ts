import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useProfile } from '@/lib/profile';
import { customPalette, DEFAULT_CUSTOM, type Palette, presetPalette } from '@/lib/theme';

export type { Palette } from '@/lib/theme';

// The colours for the user's theme: light, dark, the device's choice, or their own custom colours,
// with high contrast applied.
export function usePalette(): Palette {
  const device = useColorScheme();
  const { theme, highContrast, custom } = useProfile().profile.settings;
  return useMemo(() => {
    if (theme === 'custom') return customPalette(custom ?? DEFAULT_CUSTOM, highContrast);
    const scheme = theme === 'system' ? (device === 'dark' ? 'dark' : 'light') : theme;
    return presetPalette(scheme, highContrast);
  }, [theme, highContrast, custom, device]);
}

// 'light' or 'dark': whether the theme's background is light or dark.
export function useScheme(): 'light' | 'dark' {
  return usePalette().dark ? 'dark' : 'light';
}
