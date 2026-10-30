import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useInfoStyles } from '@/components/info-styles';
import { type PageRef, useProfile } from '@/lib/profile';

type Props = {
  onBack: () => void;
  // Go back to the page shown before this one, if there was one.
  onPrevious?: () => void;
  previousLabel?: string;
  // The page being shown, so it can be starred as a favourite.
  page?: PageRef;
};

// The buttons at the top of the information section.
export function InfoNav({ onBack, onPrevious, previousLabel, page }: Props) {
  const info = useInfoStyles();
  return (
    <View style={styles.row}>
      {onPrevious && (
        <Pressable
          onPress={onPrevious}
          accessibilityRole="button"
          accessibilityLabel={previousLabel ? `Previous page: ${previousLabel}` : 'Previous page'}
          style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
          <Text style={info.backText} numberOfLines={1}>
            ‹ {previousLabel ?? 'Previous'}
          </Text>
        </Pressable>
      )}
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
        <Text style={info.backText}>↑ Back to the globe</Text>
      </Pressable>
      {page && <StarButton page={page} />}
    </View>
  );
}

// Adds the page to the user's favourites, or removes it.
function StarButton({ page }: { page: PageRef }) {
  const info = useInfoStyles();
  const { isFavourite, toggleFavourite } = useProfile();
  const on = isFavourite(page);
  return (
    <Pressable
      onPress={() => toggleFavourite(page)}
      accessibilityRole="button"
      accessibilityLabel={on ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: on }}
      hitSlop={6}
      style={({ pressed }) => [info.back, styles.button, pressed && info.pressed]}>
      <Text style={[info.backText, on && styles.starOn]}>{on ? '★ Saved' : '☆ Save'}</Text>
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
  starOn: {
    color: '#FFD54F',
  },
});
