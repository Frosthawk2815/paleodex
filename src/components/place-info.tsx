import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { PointIcon } from '@/components/point-icon';
import { type Highlight, PLACE_DETAILS } from '@/data/place-details';
import { placeById } from '@/lib/places';
import { speciesById } from '@/lib/life';
import { useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

type Props = {
  id: string;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
  onOpenSpecies: (id: string) => void;
};

// Titles each kind of place counts towards, named on its page.
const TITLES_FOR = {
  museum: 'Museum Goer (1 museum), Gallery Regular (5 museums) and Globetrotter (museums or zoos in 3 countries)',
  zoo: 'Zoo Explorer (1 zoo), Conservation Champion (5 zoos) and Globetrotter (museums or zoos in 3 countries)',
} as const;

// The information section for a natural history museum or zoo tapped on the globe.
export function PlaceInfo({ id, onBack, onPrevious, previousLabel, onOpenSpecies }: Props) {
  const info = useInfoStyles();
  const t = useT();
  const { profile } = useProfile();
  const place = placeById(id);
  if (!place || place.kind === 'site') return null;
  const visited = profile.places.includes(place.id);
  const detail = PLACE_DETAILS[place.id];
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
      {detail ? (
        <Text style={info.meta} selectable>
          {detail.address}
        </Text>
      ) : (
        place.country && <Text style={info.meta}>{place.country}</Text>
      )}
      {place.accreditation && <Text style={info.meta}>{t('Accredited by {groups}', { groups: place.accreditation })}</Text>}
      {place.note && <Text style={info.body}>{place.note}</Text>}

      {detail && (
        <>
          <Text style={info.heading}>{t('History')}</Text>
          {detail.history.map((p) => (
            <Text key={p} style={info.body}>
              {p}
            </Text>
          ))}
          <Highlights heading={t('Notable exhibits')} items={detail.exhibits} onOpenSpecies={onOpenSpecies} />
          <Highlights heading={t('Conservation')} items={detail.conservation} onOpenSpecies={onOpenSpecies} />
          {detail.website && (
            <Pressable
              onPress={() => Linking.openURL(detail.website!).catch(() => {})}
              accessibilityRole="link"
              accessibilityLabel={t('Open the website of {name}', { name: place.name })}
              style={({ pressed }) => [info.card, styles.button, pressed && info.pressed]}>
              <Text style={info.cardTitle}>{t('Official website ↗')}</Text>
              <Text style={info.cardNote}>{detail.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</Text>
            </Pressable>
          )}
        </>
      )}

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

// A list of exhibits or conservation work, each with links to the species it mentions.
function Highlights({ heading, items, onOpenSpecies }: { heading: string; items?: Highlight[]; onOpenSpecies: (id: string) => void }) {
  const info = useInfoStyles();
  const t = useT();
  if (!items?.length) return null;
  return (
    <>
      <Text style={info.heading}>{heading}</Text>
      {items.map((h) => (
        <View key={h.text} style={styles.item}>
          <Text style={info.body}>{h.text}</Text>
          {!!h.species?.length && (
            <View style={info.chips}>
              {h.species.map((sid) => {
                const s = speciesById(sid);
                if (!s) return null;
                const name = s.common ?? s.name;
                return (
                  <Pressable
                    key={sid}
                    onPress={() => onOpenSpecies(sid)}
                    accessibilityRole="button"
                    accessibilityLabel={t('Open {name}', { name })}
                    style={({ pressed }) => [info.chip, pressed && info.pressed]}>
                    <Text style={info.chipText}>{name} ›</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  item: { gap: 6 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headText: { flex: 1 },
  button: { marginTop: 8 },
});
