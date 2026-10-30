// Colour arithmetic for themes: contrast checks (WCAG), mixing, and nudging a colour until it is
// readable on a background.

type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Relative luminance, 0 (black) to 1 (white).
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

// Contrast ratio between two colours, 1 to 21. Normal text needs 4.5, high contrast 7.
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

// The lowest contrast of a colour against several backgrounds.
export const minContrast = (fg: string, bgs: string[]) => Math.min(...bgs.map((bg) => contrast(fg, bg)));

// Blend a towards b; amount 0 gives a, 1 gives b.
export function mix(a: string, b: string, amount: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => x[i]! + (y[i]! - x[i]!) * amount) as RGB);
}

// A colour with transparency, for tints and overlays.
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const isDark = (hex: string) => luminance(hex) < 0.2;

// Keep the colour's hue but lighten it (on dark backgrounds) or darken it (on light ones) just
// enough to reach the target contrast on every background. Falls back to black or white.
export function readable(color: string, bgs: string[], target = 4.5): string {
  const towards = isDark(bgs[0]!) ? '#FFFFFF' : '#000000';
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const c = mix(color, towards, t);
    if (minContrast(c, bgs) >= target) return c;
  }
  return towards;
}
