import { type ReactNode, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, Line, LinearGradient, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

import { usePalette } from '@/hooks/use-palette';
import { type Era, PageEra } from '@/lib/era';
import type { Paper } from '@/lib/theme';

// A page in the user's theme. Pages say whether they are about the ancient past or the modern
// world, which the mixed paper theme uses to choose parchment or a notebook.
export function PageSheet({ era, style, onLayout, children }: { era: Era; style?: ViewStyle; onLayout?: (e: LayoutChangeEvent) => void; children: ReactNode }) {
  return (
    <PageEra value={era}>
      <Sheet style={style} onLayout={onLayout}>
        {children}
      </Sheet>
    </PageEra>
  );
}

function Sheet({ style, onLayout, children }: { style?: ViewStyle; onLayout?: (e: LayoutChangeEvent) => void; children: ReactNode }) {
  const palette = usePalette();
  return (
    <View onLayout={onLayout} style={[style, { backgroundColor: palette.background, overflow: 'hidden' }]}>
      {palette.paper && <PaperBackground kind={palette.paper} />}
      {children}
    </View>
  );
}

// Faint stains scattered down a parchment page, the same every time.
function stains(width: number, height: number) {
  const out: { x: number; y: number; rx: number; ry: number; o: number }[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const count = Math.max(4, Math.round(height / 220));
  for (let i = 0; i < count; i++) {
    out.push({ x: rand() * width, y: rand() * height, rx: 30 + rand() * 90, ry: 20 + rand() * 60, o: 0.06 + rand() * 0.08 });
  }
  return out;
}

// The paper drawn behind a page: aged parchment with darkened edges and stains, or lined notebook
// paper with a red margin.
export function PaperBackground({ kind }: { kind: Paper }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };
  const { width, height } = size;
  // Line up the margin with the page's text column (720 wide at most, centred).
  const margin = Math.max(0, (width - 720) / 2) + 10;

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      {width > 0 && height > 0 && (
        <Svg width={width} height={height}>
          {kind === 'ancient' ? (
            <>
              <Defs>
                <RadialGradient id="stain" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor="#8A5A24" stopOpacity="1" />
                  <Stop offset="0.6" stopColor="#8A5A24" stopOpacity="0.5" />
                  <Stop offset="1" stopColor="#8A5A24" stopOpacity="0" />
                </RadialGradient>
                <LinearGradient id="sides" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#6B4316" stopOpacity="0.38" />
                  <Stop offset="0.1" stopColor="#6B4316" stopOpacity="0" />
                  <Stop offset="0.9" stopColor="#6B4316" stopOpacity="0" />
                  <Stop offset="1" stopColor="#6B4316" stopOpacity="0.38" />
                </LinearGradient>
                <LinearGradient id="top" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#6B4316" stopOpacity="0.3" />
                  <Stop offset="1" stopColor="#6B4316" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              {stains(width, height).map((s, i) => (
                <Ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="url(#stain)" opacity={s.o} />
              ))}
              <Rect x={0} y={0} width={width} height={height} fill="url(#sides)" />
              <Rect x={0} y={0} width={width} height={60} fill="url(#top)" />
            </>
          ) : (
            <>
              <Defs>
                <Pattern id="lines" x={0} y={0} width={width} height={28} patternUnits="userSpaceOnUse">
                  <Line x1={0} y1={27.5} x2={width} y2={27.5} stroke="#A8C4E6" strokeWidth={1} />
                </Pattern>
              </Defs>
              <Rect x={0} y={56} width={width} height={Math.max(0, height - 56)} fill="url(#lines)" />
              <Line x1={margin} y1={0} x2={margin} y2={height} stroke="#E59393" strokeWidth={1.5} />
            </>
          )}
        </Svg>
      )}
    </View>
  );
}
