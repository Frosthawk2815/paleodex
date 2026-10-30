// Fonts for the paper theme: a manuscript hand for old parchment pages, and handwriting for the
// notebook. Each face is its own family name so it works the same on phones and the web.

import { Caveat_700Bold } from '@expo-google-fonts/caveat/700Bold';
import { IMFellEnglish_400Regular } from '@expo-google-fonts/im-fell-english/400Regular';
import { IMFellEnglish_400Regular_Italic } from '@expo-google-fonts/im-fell-english/400Regular_Italic';
import { Kalam_400Regular } from '@expo-google-fonts/kalam/400Regular';
import { Kalam_700Bold } from '@expo-google-fonts/kalam/700Bold';
import { UncialAntiqua_400Regular } from '@expo-google-fonts/uncial-antiqua/400Regular';
import { createContext } from 'react';

export const PAPER_FONTS = {
  UncialAntiqua: UncialAntiqua_400Regular,
  IMFell: IMFellEnglish_400Regular,
  'IMFell-Italic': IMFellEnglish_400Regular_Italic,
  Kalam: Kalam_400Regular,
  'Kalam-Bold': Kalam_700Bold,
  'Caveat-Bold': Caveat_700Bold,
};

// Whether the paper fonts have loaded; until then the theme uses the normal font.
export const FontsReady = createContext(false);
