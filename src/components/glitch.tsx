import { useEffect, useState } from 'react';
import { StyleSheet, Text, type TextStyle, View, type StyleProp } from 'react-native';

// A deliberate, stylised "glitch" for the secret shadow champion: split red and cyan text, faint
// scan lines, and every few seconds a short burst where the text jumps, a line tears sideways and a
// few letters scramble. It stays readable, and calms to a still split with reduce motion on.

const RED = '#FF2A55';
const CYAN = '#22E5FF';
const NOISE = '#%&@$*!?/<>{}[]=+0123456789';

export type Burst = { dx: number; split: number; tearTop: number; tearHeight: number; tearDx: number; seed: number } | null;

// Every 2 to 5 seconds, a glitch burst of a few quick frames.
export function useGlitch(still: boolean): Burst {
  const [burst, setBurst] = useState<Burst>(null);
  useEffect(() => {
    if (still) return;
    let timer: ReturnType<typeof setTimeout>;
    const frame = (left: number) => {
      if (left <= 0) {
        setBurst(null);
        timer = setTimeout(() => frame(2 + Math.floor(Math.random() * 3)), 2000 + Math.random() * 3000);
        return;
      }
      setBurst({
        dx: (Math.random() - 0.5) * 8,
        split: 2 + Math.random() * 3,
        tearTop: Math.random() * 70,
        tearHeight: 4 + Math.random() * 10,
        tearDx: (Math.random() - 0.5) * 30,
        seed: Math.random(),
      });
      timer = setTimeout(() => frame(left - 1), 60 + Math.random() * 60);
    };
    timer = setTimeout(() => frame(3), 1200);
    return () => clearTimeout(timer);
  }, [still]);
  return burst;
}

// Swaps a few letters for symbols during a burst.
function scramble(text: string, seed: number) {
  let n = Math.floor(seed * 1000);
  return [...text]
    .map((ch) => {
      n = (n * 9301 + 49297) % 233280;
      return ch !== ' ' && n / 233280 < 0.18 ? NOISE[n % NOISE.length]! : ch;
    })
    .join('');
}

// clean: never scramble the letters (just split and jump). quiet: plain text between bursts.
export function GlitchText({
  text,
  style,
  color,
  burst,
  clean = false,
  quiet = false,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  color: string;
  burst: Burst;
  clean?: boolean;
  quiet?: boolean;
}) {
  if (quiet && !burst)
    return (
      <Text style={[style, { color }]} numberOfLines={1}>
        {text}
      </Text>
    );
  const shown = burst && !clean ? scramble(text, burst.seed) : text;
  const split = burst ? burst.split : 1;
  const ghost = (c: string, dx: number) => (
    <Text style={[style, styles.ghost, { color: c, transform: [{ translateX: dx }] }]} numberOfLines={1} aria-hidden importantForAccessibility="no-hide-descendants">
      {shown}
    </Text>
  );
  return (
    <View style={{ transform: [{ translateX: burst ? burst.dx : 0 }] }} accessible accessibilityLabel={text}>
      {ghost(RED, -split)}
      {ghost(CYAN, split)}
      <Text style={[style, { color }]} numberOfLines={1}>
        {shown}
      </Text>
    </View>
  );
}

// Scan lines across the whole row, and the sideways tear during a burst.
export function GlitchOverlay({ burst, tint }: { burst: Burst; tint: string }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, styles.lines]}>
        {Array.from({ length: 40 }, (_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>
      {burst && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${burst.tearTop}%`,
            height: burst.tearHeight,
            backgroundColor: tint,
            opacity: 0.35,
            transform: [{ translateX: burst.tearDx }],
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ghost: { position: 'absolute', left: 0, top: 0, opacity: 0.75 },
  lines: { overflow: 'hidden', justifyContent: 'space-between' },
  line: { height: 1, backgroundColor: '#FFFFFF', opacity: 0.05 },
});
