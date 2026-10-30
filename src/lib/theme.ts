// The colours of each theme, including the user's own custom theme, and the rules that keep text
// readable on whatever background they choose.

import { contrast, isDark, minContrast, mix, readable, withAlpha } from '@/lib/colors';

export type Palette = {
  background: string;
  // Cards, lists and panels on top of the background.
  card: string;
  text: string;
  // Secondary text: notes, labels, captions.
  muted: string;
  border: string;
  // Empty tracks and image placeholders.
  track: string;
  link: string;
  // Small headings such as "SPECIES".
  accent: string;
  // Group (family) chips.
  chip: string;
  // "Superstar" badges and similar.
  badge: string;
  linkBg: string;
  linkBorder: string;
  chipBg: string;
  chipBorder: string;
  pressed: string;
  dark: boolean;
};

// A colour the user can choose, in a lighter and a darker variant.
export type Swatch = { name: string; light: string; dark: string };
export const SWATCHES: Swatch[] = [
  { name: 'Grey', light: '#E8E6E1', dark: '#26262A' },
  { name: 'Red', light: '#F6D5D2', dark: '#561A1A' },
  { name: 'Orange', light: '#FADDC4', dark: '#5A2C0D' },
  { name: 'Yellow', light: '#F7EDBE', dark: '#4A3E0C' },
  { name: 'Green', light: '#D4EDD4', dark: '#163A20' },
  { name: 'Teal', light: '#CDEBE8', dark: '#0E3836' },
  { name: 'Blue', light: '#D2E2F7', dark: '#14284B' },
  { name: 'Purple', light: '#E2D7F4', dark: '#2C1C4B' },
  { name: 'Pink', light: '#F6D4E4', dark: '#4B1634' },
  { name: 'Brown', light: '#E8D9C8', dark: '#382516' },
];

// Text colours offered for a custom theme. Only the ones that are easy to read on the chosen
// background and panel colours are shown.
export const TEXT_COLORS: { name: string; color: string }[] = [
  { name: 'White', color: '#FFFFFF' },
  { name: 'Soft white', color: '#E6E3DD' },
  { name: 'Cream', color: '#FFF1CF' },
  { name: 'Ice blue', color: '#D9E9FF' },
  { name: 'Black', color: '#000000' },
  { name: 'Charcoal', color: '#2E2D2B' },
  { name: 'Navy', color: '#0E1D3B' },
  { name: 'Dark brown', color: '#3A2412' },
  { name: 'Forest', color: '#0F3019' },
];

export type CustomTheme = { primary: string; secondary: string; text: string | 'auto' };
export const DEFAULT_CUSTOM: CustomTheme = { primary: '#14284B', secondary: '#26262A', text: 'auto' };

// Normal text needs a contrast of 4.5; with high contrast on, 7.
export const textTarget = (highContrast: boolean) => (highContrast ? 7 : 4.5);

// Black or white, whichever reads better on both colours.
export function autoText(primary: string, secondary: string): string {
  return minContrast('#FFFFFF', [primary, secondary]) >= minContrast('#000000', [primary, secondary]) ? '#FFFFFF' : '#000000';
}

// The text colours that are readable on both the background and panel colours.
export function readableTextColors(primary: string, secondary: string, highContrast: boolean) {
  return TEXT_COLORS.filter((t) => minContrast(t.color, [primary, secondary]) >= textTarget(highContrast));
}

// Whether some text colour can be read on both colours (false for, say, a black background with
// white panels).
export function compatible(primary: string, secondary: string, highContrast: boolean): boolean {
  return minContrast(autoText(primary, secondary), [primary, secondary]) >= textTarget(highContrast);
}

// The text colour actually used: the user's choice if it is still readable, otherwise automatic.
export function resolveText(c: CustomTheme, highContrast: boolean): string {
  if (c.text !== 'auto' && minContrast(c.text, [c.primary, c.secondary]) >= textTarget(highContrast)) return c.text;
  return autoText(c.primary, c.secondary);
}

function finish(base: Omit<Palette, 'linkBg' | 'linkBorder' | 'chipBg' | 'chipBorder' | 'pressed' | 'dark'>): Palette {
  return {
    ...base,
    linkBg: withAlpha(base.link, 0.12),
    linkBorder: withAlpha(base.link, 0.45),
    chipBg: withAlpha(base.chip, 0.14),
    chipBorder: withAlpha(base.chip, 0.5),
    pressed: withAlpha(base.text, 0.14),
    dark: isDark(base.background),
  };
}

const LIGHT = finish({
  background: '#F7F5F0',
  card: '#FFFFFF',
  text: '#1C1B19',
  muted: '#6B675F',
  border: '#E3DFD6',
  track: '#ECE8DF',
  link: '#1F5FAF',
  accent: '#8A5A00',
  chip: '#5B3FB0',
  badge: '#A8305F',
});

const DARK = finish({
  background: '#121110',
  card: '#1D1C1A',
  text: '#F2EFE8',
  muted: '#A39E94',
  border: '#2E2C29',
  track: '#2A2825',
  link: '#9CC8FF',
  accent: '#FFD54A',
  chip: '#D9CCFF',
  badge: '#FF9EC7',
});

// High-contrast versions: pure black and white text, stronger secondary text and borders.
const LIGHT_CONTRAST: Palette = { ...LIGHT, background: '#FFFFFF', text: '#000000', muted: '#2B2925', border: '#7A756B', link: '#0B3F86', accent: '#5E3D00' };
const DARK_CONTRAST: Palette = { ...DARK, background: '#000000', card: '#111111', text: '#FFFFFF', muted: '#D6D1C7', border: '#8A857B', link: '#C4DEFF', accent: '#FFE08A' };

export function presetPalette(scheme: 'light' | 'dark', highContrast: boolean): Palette {
  if (scheme === 'dark') return highContrast ? DARK_CONTRAST : DARK;
  return highContrast ? LIGHT_CONTRAST : LIGHT;
}

// A full palette from the user's background, panel and text colours. Every other colour (links,
// headings, notes) is tinted to stay readable on both.
export function customPalette(c: CustomTheme, highContrast: boolean): Palette {
  const bgs = [c.primary, c.secondary];
  const target = textTarget(highContrast);
  const text = resolveText(c, highContrast);
  // Secondary text: a softer version of the text colour, but never below the readable minimum.
  let muted = text;
  for (const t of [0.4, 0.3, 0.2, 0.1]) {
    const m = mix(text, c.primary, t);
    if (minContrast(m, bgs) >= target) {
      muted = m;
      break;
    }
  }
  const dark = isDark(c.primary);
  return finish({
    background: c.primary,
    card: c.secondary,
    text,
    muted: highContrast ? text : muted,
    border: mix(c.secondary, text, highContrast ? 0.55 : 0.25),
    track: mix(c.secondary, text, 0.12),
    link: readable(dark ? '#9CC8FF' : '#1F5FAF', bgs, target),
    accent: readable(dark ? '#FFD54A' : '#8A5A00', bgs, target),
    chip: readable(dark ? '#D9CCFF' : '#5B3FB0', bgs, target),
    badge: readable(dark ? '#FF9EC7' : '#A8305F', bgs, target),
  });
}

export const describeContrast = (fg: string, bg: string) => `${contrast(fg, bg).toFixed(1)}:1`;
