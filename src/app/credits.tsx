import { Stack } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePalette } from '@/hooks/use-palette';
import { allImages, type SpeciesImage } from '@/lib/images';
import { speciesById } from '@/lib/life';

const open = (url?: string | null) => {
  if (url) openBrowserAsync(url).catch(() => {});
};

type Row = { id: string; name: string; common?: string; img: SpeciesImage };

// Every picture in the app with its artist, licence and source, plus the data behind the globe.
export default function CreditsScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const rows: Row[] = allImages()
    .map(([id, img]) => ({ id, img, name: speciesById(id)?.name ?? id, common: speciesById(id)?.common }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const header = (
    <View>
      <Text style={[styles.heading, { color: palette.text }]}>Map and timeline data</Text>
      <Text style={[styles.body, { color: palette.text }]}>
        Ancient land and sea: Scotese & Wright (2018), PALEOMAP PaleoAtlas. Sea level: Spratt & Lisiecki (2016); Bintanja & van de Wal
        (2008). Geological time scale and colours: ICS International Chronostratigraphic Chart.
      </Text>
      <Text style={[styles.heading, { color: palette.text }]}>Species pictures ({rows.length})</Text>
      <Text style={[styles.body, { color: palette.muted }]}>
        Freely licensed images from Wikimedia Commons and Wikipedia. Each is credited to its artist or photographer under the licence
        shown. Tap a licence or source to open it. Artists’ restorations are interpretations and may not match the latest science.
      </Text>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      contentInsetAdjustmentBehavior="automatic"
      data={rows}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={
        <>
          <Stack.Screen options={{ title: 'Credits' }} />
          {header}
        </>
      }
      initialNumToRender={20}
      renderItem={({ item }) => (
        <View style={[styles.row, { borderColor: palette.border }]}>
          <Text style={[styles.name, { color: palette.text }]}>
            <Text style={styles.italic}>{item.name}</Text>
            {item.common ? ` (${item.common})` : ''}
          </Text>
          <Text style={[styles.meta, { color: palette.muted }]}>
            {item.img.artist}
            {' · '}
            <Text style={styles.link} onPress={() => open(item.img.licenseUrl)} accessibilityRole="link">
              {item.img.license}
            </Text>
            {' · '}
            <Text style={styles.link} onPress={() => open(item.img.source)} accessibilityRole="link">
              {item.img.file.replace(/_/g, ' ')}
            </Text>
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  row: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  name: { fontSize: 15, fontWeight: '600' },
  italic: { fontStyle: 'italic' },
  meta: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  link: { color: '#3D8BFD' },
});
