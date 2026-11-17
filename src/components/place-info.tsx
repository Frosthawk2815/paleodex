import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { PointIcon } from '@/components/point-icon';
import { placeById } from '@/lib/places';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

type Props = {
  id: string;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
};

// Titles each kind of place counts towards, named on its page.
const TITLES_FOR = {
  museum: 'Museum Goer (1 museum), Gallery Regular (5 museums) and Globetrotter (museums or zoos in 3 countries)',
  zoo: 'Zoo Explorer (1 zoo), Conservation Champion (5 zoos) and Globetrotter (museums or zoos in 3 countries)',
} as const;

// The information section for a natural history museum or zoo tapped on the globe.
export function PlaceInfo({ id, onBack, onPrevious, previousLabel }: Props) {
  const info = useInfoStyles();
  const t = useT();
  const { profile } = useProfile();
  const place = placeById(id);
  if (!place || place.kind === 'site') return null;
  const visited = profile.places.includes(place.id);
  return (
    <View style={info.wrap}>
      <InfoNav onBack={onBack} onPrevious={onPrevious} previousLabel={previousLabel} />
      <View style={styles.head}>
        <PointIcon kind={place.kind} size={44} />
        <View style={styles.headText}>
          <Text style={info.kicker}>{place.kind === 'museum' ? t('Natural history museum') : t('Accredited zoo')}</Text>
          <Text style={info.title} accessibilityRole="header">
            {place.name}
          </Text>
        </View>
      </View>
      {place.country && <Text style={info.meta}>{place.country}</Text>}
      {place.accreditation && <Text style={info.meta}>{t('Accredited by {groups}', { groups: place.accreditation })}</Text>}
      {place.note && <Text style={info.body}>{place.note}</Text>}

      <Text style={info.heading}>{t('Visit and earn titles')}</Text>
      <Text style={info.body}>
        {t('Check in when you are here in person and it counts towards {titles}.', { titles: t(TITLES_FOR[place.kind]) })}
      </Text>
      {visited ? (
        <Text style={[info.body, { color: info.kicker.color, fontWeight: '700' }]}>{t('✓ You have checked in here')}</Text>
      ) : (
        <Pressable
          onPress={() => router.push('/profile/places')}
          accessibilityRole="button"
          style={({ pressed }) => [info.card, styles.button, pressed && info.pressed]}>
          <Text style={info.cardTitle}>{t('Check in ›')}</Text>
          <Text style={info.cardNote}>{t('Your location is read once, only when you tap Check in, and never leaves your phone.')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headText: { flex: 1 },
  button: { marginTop: 8 },
});
