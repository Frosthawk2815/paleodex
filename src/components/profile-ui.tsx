// Pieces shared by the profile screens: the profile picture, a row for a saved page, and section
// headings, all following the user's theme and text size.

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EVENTS } from '@/data/events';
import { type Palette, usePalette } from '@/hooks/use-palette';
import { imageOf } from '@/lib/images';
import { cladeById, speciesById } from '@/lib/life';
import { type Avatar, type OpenRequest, type PageRef, useProfile, useTextScale } from '@/lib/profile';
import { applyFonts } from '@/lib/theme';

// What to show for a saved page: its name, a short description and a picture if it has one.
export function pageInfo(page: PageRef): { title: string; subtitle: string; imageId?: string } | null {
  if (page.kind === 'species') {
    const s = speciesById(page.id);
    if (!s) return null;
    return { title: s.common || s.name, subtitle: s.common ? s.name : 'Species', imageId: imageOf(s.id) ? s.id : undefined };
  }
  if (page.kind === 'clade') {
    const c = cladeById(page.id);
    return c ? { title: c.common || c.name, subtitle: `Group · ${c.name}` } : null;
  }
  const e = EVENTS.find((x) => x.id === page.id);
  return e ? { title: e.title, subtitle: e.kind } : null;
}

// Font sizes and colours for the profile screens, scaled to the text size setting.
export function useProfileStyles() {
  const palette = usePalette();
  const scale = useTextScale();
  return useMemo(() => applyFonts(makeStyles(palette, scale), palette.fonts, ['title', 'heading']), [palette, scale]);
}

function makeStyles(p: Palette, s: number) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: p.background },
    content: { padding: 16, gap: 12, maxWidth: 720, width: '100%', alignSelf: 'center' },
    heading: { color: p.text, fontSize: Math.round(13 * s), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 8 },
    title: { color: p.text, fontSize: Math.round(22 * s), fontWeight: '700' },
    text: { color: p.text, fontSize: Math.round(16 * s) },
    muted: { color: p.muted, fontSize: Math.round(14 * s) },
    link: { color: p.link, fontSize: Math.round(16 * s), fontWeight: '600' },
    card: { backgroundColor: p.card, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: p.border, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 52 },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: p.border, marginLeft: 14 },
    rowText: { flex: 1, gap: 2 },
    rowTitle: { color: p.text, fontSize: Math.round(16 * s), fontWeight: '600' },
    rowSub: { color: p.muted, fontSize: Math.round(13 * s) },
    chevron: { color: p.muted, fontSize: Math.round(20 * s) },
    pressed: { opacity: 0.6 },
    input: {
      color: p.text,
      fontSize: Math.round(16 * s),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.border,
      backgroundColor: p.card,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    button: { backgroundColor: '#2F7DE1', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
    buttonText: { color: '#FFFFFF', fontSize: Math.round(16 * s), fontWeight: '700' },
    chip: { borderRadius: 18, borderWidth: 1, borderColor: p.border, paddingHorizontal: 14, paddingVertical: 8 },
    chipOn: { backgroundColor: '#2F7DE1', borderColor: '#2F7DE1' },
    chipText: { color: p.text, fontSize: Math.round(15 * s) },
    chipTextOn: { color: '#FFFFFF', fontWeight: '700' },
  });
}

// The picture behind a profile picture: a photo they uploaded or a species picture.
export const avatarUri = (avatar: Avatar) => (avatar?.kind === 'upload' ? avatar.uri : avatar?.kind === 'species' ? imageOf(avatar.id)?.thumb : undefined);

// Up to two initials from a name.
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

// The user's profile picture: a species picture, a photo they uploaded, or their initials.
export function AvatarImage({ avatar, name, size }: { avatar: Avatar; name: string; size: number }) {
  const palette = usePalette();
  const uri = avatarUri(avatar);
  const initials = initialsOf(name) || '🦖';
  const round = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[round, { backgroundColor: palette.track }]} contentFit="cover" accessibilityLabel="Profile picture" />;
  }
  return (
    <View style={[round, styles.initials, { backgroundColor: '#2F7DE1' }]} accessibilityLabel="Profile picture">
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.4, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

// A row linking to a saved page, with its picture when it has one.
export function PageRow({ page, onPress, onRemove }: { page: PageRef; onPress: () => void; onRemove?: () => void }) {
  const st = useProfileStyles();
  const palette = usePalette();
  const item = pageInfo(page);
  if (!item) return null;
  const thumb = item.imageId ? imageOf(item.imageId)?.thumb : undefined;
  return (
    <View style={st.row}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title}`}
        style={({ pressed }) => [styles.rowMain, pressed && st.pressed]}>
        {thumb ? (
          <Image source={{ uri: thumb }} style={[styles.thumb, { backgroundColor: palette.track }]} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, { backgroundColor: palette.track }]} />
        )}
        <View style={st.rowText}>
          <Text style={st.rowTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={st.rowSub} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </Pressable>
      {onRemove && (
        <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${item.title}`} hitSlop={8}>
          <Text style={st.muted}>Remove</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initials: { alignItems: 'center', justifyContent: 'center' },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 44, height: 44, borderRadius: 8 },
});

// Go back to the globe and show something there (a page, or a moment in time).
export function useShowOnGlobe() {
  const { setRequest } = useProfile();
  return (r: OpenRequest) => {
    setRequest(r);
    router.dismissTo('/');
  };
}
