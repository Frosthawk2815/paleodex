import { use, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { PageEra } from '@/lib/era';
import { FontsReady } from '@/lib/fonts';
import { useProfile } from '@/lib/profile';
import { customPalette, DEFAULT_CUSTOM, type Palette, paperPalette, presetPalette } from '@/lib/theme';

export type { Palette } from '@/lib/theme';

// The colours for the user's theme: light, dark, the device's choice, their own custom colours, or
// paper, with high contrast applied. With mixed paper, pages about the ancient past are parchment
// and modern pages (and menus) a notebook.
export function usePalette(): Palette {
  const device = useColorScheme();
  const era = use(PageEra);
  const fontsReady = use(FontsReady);
  const { theme, highContrast, custom, paper } = useProfile().profile.settings;
  return useMemo(() => {
    if (theme === 'custom') return customPalette(custom ?? DEFAULT_CUSTOM, highContrast);
    if (theme === 'paper') {
      const style = paper ?? 'mixed';
      return paperPalette(style === 'mixed' ? (era ?? 'modern') : style, highContrast, fontsReady);
    }
    const scheme = theme === 'system' ? (device === 'dark' ? 'dark' : 'light') : theme;
    return presetPalette(scheme, highContrast);
  }, [theme, highContrast, custom, paper, era, fontsReady, device]);
}

// 'light' or 'dark': whether the theme's background is light or dark.
export function useScheme(): 'light' | 'dark' {
  return usePalette().dark ? 'dark' : 'light';
}
