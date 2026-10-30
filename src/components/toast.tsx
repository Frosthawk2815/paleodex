import { createContext, type ReactNode, use, useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePalette } from '@/hooks/use-palette';
import { useProfile } from '@/lib/profile';
import { paperFont } from '@/lib/theme';

export type Toast = { icon: string; title: string; detail: string };

const Context = createContext<(t: Toast) => void>(() => {});

const SHOW_MS = 3200;

// Short notices that slide down from the top of the screen and leave on their own, one at a time
// (e.g. a new title or level).
export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<(Toast & { id: number })[]>([]);
  const nextId = useRef(0);
  const show = useCallback((t: Toast) => {
    const id = nextId.current++;
    setQueue((q) => [...q, { ...t, id }]);
    AccessibilityInfo.announceForAccessibility(`${t.title}. ${t.detail}`);
  }, []);
  const done = useCallback(() => setQueue((q) => q.slice(1)), []);
  return (
    <Context value={show}>
      <View style={styles.fill}>
        {children}
        {queue[0] && <ToastView key={queue[0].id} toast={queue[0]} onDone={done} />}
      </View>
    </Context>
  );
}

export const useToast = () => use(Context);

function ToastView({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const palette = usePalette();
  const { reduceMotion } = useProfile();
  const insets = useSafeAreaInsets();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const step = (to: number) => Animated.timing(anim, { toValue: to, duration: reduceMotion ? 150 : 320, useNativeDriver: true });
    const run = Animated.sequence([step(1), Animated.delay(SHOW_MS), step(0)]);
    run.start(({ finished }) => finished && onDone());
    return () => run.stop();
  }, [anim, reduceMotion, onDone]);

  // Slides in from above, or with reduce motion simply fades.
  const motion = reduceMotion
    ? { opacity: anim }
    : { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) }] };

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { top: insets.top + 8 }, motion]} accessibilityLiveRegion="polite">
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={styles.icon}>{toast.icon}</Text>
        <View style={styles.text}>
          <Text style={[styles.title, { color: palette.accent }, paperFont(palette, 'heading')]}>{toast.title}</Text>
          <Text style={[styles.detail, { color: palette.text }, paperFont(palette, 'bold')]}>{toast.detail}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  wrap: { position: 'absolute', left: 12, right: 12, alignItems: 'center', zIndex: 1000, elevation: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    maxWidth: 480,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: { fontSize: 28 },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  detail: { fontSize: 16, fontWeight: '700' },
});
