import { useMemo } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';

import { type Palette, usePalette } from '@/hooks/use-palette';
import { useTextScale } from '@/lib/profile';
import { applyFonts } from '@/lib/theme';

// Styles shared by the information sections below the globe, in the user's theme colours.
const makeInfo = (p: Palette) =>
  StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 10,
  },
  back: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: p.linkBg,
    marginBottom: 12,
  },
  pressed: {
    backgroundColor: p.pressed,
  },
  backText: {
    color: p.link,
    fontSize: 14,
    fontWeight: '600',
  },
  kicker: {
    color: p.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: p.text,
    fontSize: 26,
    fontWeight: '800',
  },
  italic: {
    fontStyle: 'italic',
  },
  subtitle: {
    color: p.text,
    fontSize: 17,
    fontWeight: '600',
  },
  meta: {
    color: p.muted,
    fontSize: 15,
  },
  heading: {
    color: p.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
  },
  body: {
    color: p.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  note: {
    color: p.muted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  crumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  crumb: {
    color: p.link,
    fontSize: 14,
  },
  crumbSep: {
    color: p.muted,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 3,
    borderRadius: 12,
    backgroundColor: p.track,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabOn: {
    backgroundColor: p.card,
  },
  tabText: {
    color: p.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextOn: {
    color: p.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: p.chipBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.chipBorder,
  },
  chipText: {
    color: p.chip,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: p.linkBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.linkBorder,
  },
  // A card for the place already showing on the globe.
  cardHere: {
    backgroundColor: p.card,
    borderColor: p.border,
  },
  jumps: {
    gap: 8,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: p.link,
    fontSize: 15,
    fontWeight: '600',
  },
  cardNote: {
    color: p.muted,
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    borderRadius: 12,
    backgroundColor: p.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.border,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: p.border,
  },
  rowTitle: {
    color: p.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rowNote: {
    color: p.muted,
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    color: p.badge,
    fontSize: 11,
    fontWeight: '700',
  },
  facts: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: p.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.border,
    paddingHorizontal: 14,
  },
  factRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: p.border,
    gap: 12,
  },
  factLabel: {
    width: 120,
    color: p.muted,
    fontSize: 14,
  },
  factValue: {
    flex: 1,
    color: p.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

type InfoStyles = ReturnType<typeof makeInfo>;

// The shared styles in the user's theme, with text enlarged to their text size setting.
export function useInfoStyles(): InfoStyles {
  const scale = useTextScale();
  const palette = usePalette();
  return useMemo(() => {
    const base = applyFonts(makeInfo(palette), palette.fonts, ['title', 'heading', 'kicker', 'subtitle']);
    if (scale === 1) return base;
    const out = {} as Record<string, TextStyle>;
    for (const [key, style] of Object.entries(base) as [string, TextStyle][]) {
      out[key] = {
        ...style,
        ...(style.fontSize ? { fontSize: Math.round(style.fontSize * scale) } : {}),
        ...(style.lineHeight ? { lineHeight: Math.round(style.lineHeight * scale) } : {}),
      };
    }
    return StyleSheet.create(out) as unknown as InfoStyles;
  }, [scale, palette]);
}
