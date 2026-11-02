import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useInfoStyles } from '@/components/info-styles';
import { type PageRef, useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

type Props = {
  onBack: () => void;
  // Go back to the page shown before this one, if there was one.
  onPrevious?: () => void;
  previousLabel?: string;
  // The page being shown, so it can be starred as a favourite.
  page?: PageRef;
  // Label for the back button (default: back to the globe).
  backLabel?: string;
};

// The buttons at the top of the information section.
export function InfoNav({ onBack, onPrevious, previousLabel, page, backLabel = '↑ Back to the globe' }: Props) {
  const info = useInfoStyles();
  const t = useT();
  return (
    <View style={styles.row}>
      {onPrevious && (
        <Pressable
          onPress={onPrevious}
          accessibilityRole="button"
          accessibilityLabel={previousLabel ? t('Previous page: {name}', { name: previousLabel }) : t('Previous page')}
          style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
          <Text style={info.backText} numberOfLines={1}>
            ‹ {previousLabel ?? 'Previous'}
          </Text>
        </Pressable>
      )}
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
        <Text style={info.backText}>{backLabel}</Text>
      </Pressable>
      {page && <StarButton page={page} />}
    </View>
  );
}

// Adds the page to the user's favourites, or removes it.
function StarButton({ page }: { page: PageRef }) {
  const info = useInfoStyles();
  const t = useT();
  const { isFavourite, toggleFavourite } = useProfile();
  const on = isFavourite(page);
  return (
    <Pressable
      onPress={() => toggleFavourite(page)}
      accessibilityRole="button"
      accessibilityLabel={on ? t('Remove from favourites') : t('Add to favourites')}
      accessibilityState={{ selected: on }}
      hitSlop={6}
      style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
      <Text style={[info.backText, on && { color: info.kicker.color }]}>{on ? '★ Saved' : '☆ Save'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    alignSelf: 'auto',
    flexShrink: 1,
  },
});
