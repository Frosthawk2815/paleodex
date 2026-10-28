import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HistoryEvent } from '@/data/events';
import { pointVisible } from '@/lib/events';

type Props = {
  event: HistoryEvent;
  timeMa: number;
  onBack: () => void;
  // Jump the timeline and globe to one of the event's points.
  onJump: (index: number) => void;
};

// The information section shown below the globe for a selected event.
export function EventInfo({ event, timeMa, onBack, onJump }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Text style={styles.backText}>↑ Back to the globe</Text>
      </Pressable>

      <Text style={styles.kicker}>{event.kind}</Text>
      <Text style={styles.title} accessibilityRole="header">
        {event.title}
      </Text>
      <Text style={styles.meta}>{event.dateText}</Text>
      <Text style={styles.meta}>{event.placeText}</Text>

      {event.points.length > 1 && (
        <View style={styles.jumps}>
          {event.points.map((p, i) => {
            const here = pointVisible(p, timeMa);
            return (
              <Pressable
                key={p.label}
                onPress={() => onJump(i)}
                accessibilityRole="button"
                accessibilityLabel={`Jump to ${p.jumpLabel}`}
                style={({ pressed }) => [styles.jump, here && styles.jumpHere, pressed && styles.pressed]}>
                <Text style={styles.jumpText}>{here ? `● ${p.jumpLabel}` : `${p.jumpLabel} ›`}</Text>
                {here && <Text style={styles.jumpNote}>Showing on the globe now</Text>}
              </Pressable>
            );
          })}
        </View>
      )}

      {event.summary.map((p) => (
        <Text key={p} style={styles.body}>
          {p}
        </Text>
      ))}

      <View style={styles.facts}>
        {event.facts.map((f) => (
          <View key={f.label} style={styles.factRow}>
            <Text style={styles.factLabel}>{f.label}</Text>
            <Text style={styles.factValue}>{f.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    color: '#9CC8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  jumps: {
    gap: 8,
    marginTop: 8,
  },
  jump: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(156,200,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156,200,255,0.4)',
  },
  jumpHere: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  jumpText: {
    color: '#9CC8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  jumpNote: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  kicker: {
    color: '#FFD54A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  meta: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
  },
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  facts: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
  },
  factRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  factLabel: {
    width: 120,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  factValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
