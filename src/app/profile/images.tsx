import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles, useShowOnGlobe } from '@/components/profile-ui';
import { SpeciesPhotoGrid } from '@/components/user-photo-gallery';
import { usePalette } from '@/hooks/use-palette';
import { EXTINCTIONS } from '@/lib/extinctions';
import { speciesById } from '@/lib/life';
import { useUserPhotos } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

// Every photo the user has added, grouped by species, newest species first.
export default function YourImagesScreen() {
  const st = useProfileStyles();
  const t = useT();
  const palette = usePalette();
  const showOnGlobe = useShowOnGlobe();
  const { allPhotos } = useUserPhotos();
  const speciesIds = [...new Set(allPhotos.map((p) => p.speciesId))];

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      {speciesIds.length === 0 ? (
        <Text style={st.muted}>
          {t('No images yet. Tap ＋ at the bottom of any species page to add your own photo, such as your pet or a skeleton you saw at a museum.')}
        </Text>
      ) : (
        <Text style={st.muted}>{t('Photos you added. They stay on this device. Tap one to show it on its species page or remove it.')}</Text>
      )}
      {speciesIds.map((id) => {
        const s = speciesById(id);
        // Extinction pages' photos are kept under "extinction:id".
        const ext = id.startsWith('extinction:') ? EXTINCTIONS.find((e) => `extinction:${e.id}` === id) : undefined;
        const name = s ? s.common || s.name : ext ? t(ext.name) : id;
        return (
          <View key={id} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
              <Text style={[st.rowTitle, { flex: 1 }]} numberOfLines={1}>
                {name}
              </Text>
              {(s || ext) && (
                <Pressable
                  onPress={() => showOnGlobe({ kind: 'page', page: ext ? { kind: 'extinction', id: ext.id } : { kind: 'species', id } })}
                  accessibilityRole="button"
                  accessibilityLabel={t('Open the {name} page', { name })}
                  hitSlop={6}>
                  <Text style={st.link}>{t('Open page ›')}</Text>
                </Pressable>
              )}
            </View>
            <SpeciesPhotoGrid speciesId={id} name={name} tileColor={palette.track} />
          </View>
        );
      })}
    </ScrollView>
  );
}
