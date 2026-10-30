import { Image } from 'expo-image';
import { openBrowserAsync } from 'expo-web-browser';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type Palette, usePalette } from '@/hooks/use-palette';

import { imageCaption, imageOf } from '@/lib/images';
import { applyFonts } from '@/lib/theme';
import { useMainUserPhoto } from '@/lib/user-photos';

const sourceName = (url: string) => (url.includes('commons.wikimedia.org') ? 'Wikimedia Commons' : 'Wikipedia');
const open = (url?: string | null) => {
  if (url) openBrowserAsync(url).catch(() => {});
};

// A species' picture with its credit: who made it, its licence, and where it was found.
export function SpeciesImage({ speciesId, name }: { speciesId: string; name: string }) {
  const mine = useMainUserPhoto(speciesId);
  const palette = usePalette();
  const styles = useMemo(() => applyFonts(makeStyles(palette), palette.fonts, []), [palette]);
  const img = imageOf(speciesId);
  // A photo the user chose to show here replaces the stock picture.
  if (mine) {
    const r = mine.width && mine.height ? Math.min(2, Math.max(0.8, mine.width / mine.height)) : 4 / 3;
    return (
      <View style={styles.wrap}>
        <Image
          source={{ uri: mine.uri }}
          style={[styles.image, { aspectRatio: r }]}
          contentFit="contain"
          transition={200}
          recyclingKey={`mine:${mine.id}`}
          accessibilityLabel={`Your photo of ${name}`}
        />
        <Text style={styles.credit}>Your photo · manage it in Profile › Your Images</Text>
      </View>
    );
  }
  if (!img) return null;
  const caption = imageCaption(img, name.split(' ')[0]);
  // Keep very tall or very wide pictures to a sensible box; the whole image stays visible.
  const ratio = Math.min(2, Math.max(0.8, img.width / img.height));
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: img.thumb }}
        style={[styles.image, { aspectRatio: ratio }]}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={speciesId}
        accessibilityLabel={`Picture of ${name}${caption ? `. ${caption}` : ''}`}
      />
      {!!caption && <Text style={styles.caption}>{caption}</Text>}
      <Text style={styles.credit}>
        {'Image: '}
        <Text style={styles.creditStrong}>{img.artist}</Text>
        {' · '}
        <Text style={styles.link} onPress={() => open(img.licenseUrl)} accessibilityRole="link">
          {img.license}
        </Text>
        {' · Source: '}
        <Text style={styles.link} onPress={() => open(img.source)} accessibilityRole="link">
          {sourceName(img.source)}
        </Text>
      </Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    wrap: { marginBottom: 14 },
    image: { width: '100%', borderRadius: 12, backgroundColor: p.track },
    caption: { color: p.text, fontSize: 13, fontStyle: 'italic', marginTop: 6 },
    credit: { color: p.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
    creditStrong: { color: p.text },
    link: { color: p.link },
  });
