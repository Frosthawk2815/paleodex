import { Pressable, StyleSheet, Text, View } from 'react-native';

import { info } from '@/components/info-styles';

type Props = {
  onBack: () => void;
  // Go back to the page shown before this one, if there was one.
  onPrevious?: () => void;
  previousLabel?: string;
};

// The buttons at the top of the information section.
export function InfoNav({ onBack, onPrevious, previousLabel }: Props) {
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    alignSelf: 'auto',
    flexShrink: 1,
  },
});
