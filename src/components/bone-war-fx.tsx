// Bone War animations: cards fading out when they're beaten, water splashing over cards a swimmer
// reveals (and swallowing one it ambushes), a dodging card, and each animal's own attack: closing
// teeth or talons, a claw slash, a stomping footprint, or a horn, tusk, antler, dome, club or spikes
// bashing up from below. Plus the crocodile eye that shows whether a card is hidden or revealed.

import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { Bash, Foot, Jaw, Weapon } from '@/lib/bone-war-weapons';
import type { EyeColours } from '@/lib/profile';

const native = Platform.OS !== 'web';
const run = (v: Animated.Value, to: number, ms: number, easing = Easing.out(Easing.quad), delay = 0) => Animated.timing(v, { toValue: to, duration: ms, easing, delay, useNativeDriver: native });
// A value that starts at `from` and is animated once when the component appears.
const useValue = (from: number) => useState(() => new Animated.Value(from))[0];

// When the weapon reaches its target, in ms from the start.
export const CONTACT_MS = 260;

const IVORY = '#F4EEDC';
const LINE = '#3A2E22';
const KERATIN = '#2E2824';
const WATER = '#2E86C1';

// ---- The crocodile eye: closed while a card is hidden, open once it's revealed. ----

export const DEFAULT_EYE: EyeColours = { light: '#7D8C45', dark: '#3F4A24', iris: '#C8B43A', sclera: '#E8E2B8' };

export function CrocEye({ open, size = 18, colours = DEFAULT_EYE, badge = true }: { open: boolean; size?: number; colours?: EyeColours; badge?: boolean }) {
  const { light, dark, iris, sclera } = colours;
  const svg = (
    <Svg width={size} height={size * 0.72} viewBox="0 0 24 17">
      {open ? (
        <>
          <Path d="M2 9.5 Q12 1 22 9.5 Q12 16 2 9.5 Z" fill={sclera} stroke={dark} strokeWidth={1} />
          <Ellipse cx={12} cy={9.4} rx={6.2} ry={4.6} fill={iris} />
          <Ellipse cx={12} cy={9.4} rx={1.5} ry={4.4} fill="#111" />
          <Circle cx={9.6} cy={7.6} r={0.9} fill="#FFFFFF99" />
          <Path d="M1 7 Q6 1.2 12 2 Q18 1.2 23 7" stroke={light} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <Path d="M5 4.6 L6 3.2 M9.5 3 L10 1.8 M14.5 3 L14 1.8 M19 4.6 L18 3.2" stroke={dark} strokeWidth={0.9} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path d="M2 9.5 Q12 2.5 22 9.5 Q12 13.5 2 9.5 Z" fill={light} stroke={dark} strokeWidth={1} />
          <Path d="M2 9.5 Q12 13.5 22 9.5" stroke={dark} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Path d="M6 7.4 L7 6 M10 6.4 L10.6 5 M14 6.4 L13.6 5 M18 7.4 L17 6" stroke={dark} strokeWidth={0.9} strokeLinecap="round" />
          <Path d="M1 7 Q6 1.2 12 2 Q18 1.2 23 7" stroke={light} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
  if (!badge) return svg;
  return (
    <View style={[styles.eyeBadge, { width: size + 4, height: size * 0.72 + 3, borderRadius: size / 3 }]} pointerEvents="none">
      {svg}
    </View>
  );
}

// ---- A beaten card fading out (drawn where it was). ----

export function FadeOut({ children, delay = 0, ambush = false }: { children: ReactNode; delay?: number; ambush?: boolean }) {
  const v = useValue(1);
  useEffect(() => {
    // An ambushed card vanishes while the water covers it.
    run(v, 0, ambush ? 260 : 900, Easing.in(Easing.quad), ambush ? 260 : delay).start();
  }, [v, delay, ambush]);
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: v, transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }] }]}>
      {children}
    </Animated.View>
  );
}

// ---- A card reacting to an attack: dodging left (a miss), shaking, or jolted up or down. ----

export function Jolt({ kind, w, children }: { kind: 'dodge' | 'shake' | 'up' | 'down'; w: number; children: ReactNode }) {
  const v = useValue(0);
  useEffect(() => {
    const out = kind === 'dodge' ? 180 : 90;
    Animated.sequence([
      Animated.delay(kind === 'dodge' ? CONTACT_MS - 140 : CONTACT_MS),
      run(v, 1, out, Easing.out(Easing.quad)),
      ...(kind === 'shake' ? [run(v, -1, 80), run(v, 0.6, 70), run(v, 0, 70)] : [run(v, 0, kind === 'dodge' ? 320 : 200, Easing.inOut(Easing.quad))]),
    ]).start();
  }, [v, kind]);
  const d = kind === 'dodge' ? -w * 0.45 : kind === 'shake' ? w * 0.06 : 0;
  const y = kind === 'up' ? -w * 0.12 : kind === 'down' ? w * 0.06 : 0;
  return (
    <Animated.View
      style={{
        transform: [
          { translateX: v.interpolate({ inputRange: [-1, 1], outputRange: [-d, d] }) },
          { translateY: v.interpolate({ inputRange: [-1, 1], outputRange: [-y, y] }) },
        ],
      }}>
      {children}
    </Animated.View>
  );
}

// ---- Water: a splash over a revealed card, or a wave that swallows an ambushed one. ----

const DROPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function Splash({ w, h, big = false }: { w: number; h: number; big?: boolean }) {
  const v = useValue(0);
  const wave = useValue(0);
  useEffect(() => {
    run(v, 1, big ? 900 : 700, Easing.out(Easing.cubic)).start();
    if (big) Animated.sequence([run(wave, 1, 280, Easing.out(Easing.quad)), Animated.delay(260), run(wave, 2, 420, Easing.in(Easing.quad))]).start();
  }, [v, wave, big]);
  const n = big ? 12 : 8;
  const r = big ? w * 0.09 : w * 0.06;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'visible' }]}>
      {/* A wash of water over the card. */}
      <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 8, backgroundColor: WATER, opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, big ? 0.55 : 0.45, 0] }) }]} />
      {/* The ambush: a wave rises over the card, holds, then drains away. */}
      {big && (
        <Animated.View
          style={{
            position: 'absolute',
            left: -w * 0.1,
            width: w * 1.2,
            top: 0,
            height: h,
            opacity: wave.interpolate({ inputRange: [0, 0.2, 1, 1.6, 2], outputRange: [0, 0.95, 0.95, 0.7, 0] }),
            transform: [{ translateY: wave.interpolate({ inputRange: [0, 1, 2], outputRange: [h, -h * 0.08, h * 0.6] }) }],
          }}>
          <Svg width={w * 1.2} height={h * 1.1} viewBox="0 0 120 154" preserveAspectRatio="none">
            <Path d="M0 18 Q15 2 30 16 Q45 30 60 14 Q75 0 90 16 Q105 30 120 14 L120 154 L0 154 Z" fill={WATER} />
            <Path d="M0 18 Q15 2 30 16 Q45 30 60 14 Q75 0 90 16 Q105 30 120 14" stroke="#BFE6FF" strokeWidth={4} fill="none" />
          </Svg>
        </Animated.View>
      )}
      {/* Droplets thrown outwards. */}
      {DROPS.slice(0, n).map((i) => {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const dist = (big ? 0.75 : 0.55) * w * (0.8 + ((i * 37) % 10) / 25);
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: w / 2 - r / 2,
              top: h * 0.55 - r / 2,
              width: r,
              height: r * 1.3,
              borderRadius: r,
              backgroundColor: i % 3 ? WATER : '#9AD3F5',
              opacity: v.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 0.8, 0] }),
              transform: [
                { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * dist] }) },
                // Thrown up, then falling.
                { translateY: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, Math.sin(a) * dist - w * 0.35, Math.sin(a) * dist + w * 0.1] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

// ---- Attacks ----

// One tooth hanging from the jaw line at the top: centre x, base width, length, and how far the tip curves.
const tooth = (x: number, wd: number, len: number, curve = 0) => `M${x - wd / 2} 0 Q${x + curve - wd * 0.1} ${len * 0.6} ${x + curve} ${len} Q${x + curve * 0.4 + wd * 0.2} ${len * 0.5} ${x + wd / 2} 0 Z`;
// A tyrannosaur tooth (and, longer, a sabre): thick and swollen at the base like a banana, narrowing to a sharp,
// slightly backward-curving point.
const crusher = (x: number, wd: number, len: number, curve: number) =>
  `M${x - wd / 2} 0 C${x - wd * 0.62} ${len * 0.35} ${x - wd * 0.3} ${len * 0.75} ${x + curve} ${len} C${x + wd * 0.42} ${len * 0.7} ${x + wd * 0.62} ${len * 0.3} ${x + wd / 2} 0 Z`;
const row = (xs: number[], wd: number, len: number | ((i: number) => number), curve = 0) => xs.map((x, i) => tooth(x, wd, typeof len === 'number' ? len : len(i), curve));
const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

// The teeth of one jaw, in a 100 × 70 box, hanging from the top (the lower jaw is drawn flipped).
function teeth(jaw: Jaw, lower: boolean): { paths: string[]; fill: string; back?: string[] } {
  switch (jaw) {
    case 'crusher':
      // Tyrannosaurs: thick, banana-shaped teeth with sharp points, for crushing bone.
      return { paths: range(10, 90, 16).map((x, i) => crusher(x, 14, [36, 48, 56, 50, 42, 34][i] ?? 34, lower ? -3 : 3)), fill: IVORY };
    case 'serrated':
      return { paths: row(range(9, 93, 12), 10, (i) => [30, 40, 50, 54, 46, 40, 34, 28][i] ?? 30, lower ? -5 : 5), fill: IVORY };
    case 'conical':
      return { paths: row(range(6, 94, 8), 7, (i) => 24 + ((i * 7) % 3) * 5), fill: IVORY };
    case 'shark':
      return { paths: row(range(8, 92, 12), 12, 34), back: row(range(14, 86, 12), 9, 20), fill: '#FBF8EE' };
    case 'fangs':
      return { paths: [...row([8, 14, 86, 92], 6, 12), ...row([38, 46, 54, 62], 7, 14), ...row([25, 75], 12, 46, lower ? -3 : 3)], fill: IVORY };
    case 'sabre':
      return lower ? { paths: row(range(20, 80, 8), 6, 12), fill: IVORY } : { paths: [...row(range(40, 60, 7), 6, 10), crusher(27, 15, 68, -3), crusher(73, 15, 68, 3)], fill: IVORY };
    case 'venom':
      return lower ? { paths: [], fill: IVORY } : { paths: row([38, 62], 7, 52, 4), fill: '#FFFDF6' };
    case 'incisors':
      return { paths: [`M39 0 L39 36 Q44 42 49 36 L49 0 Z`, `M51 0 L51 36 Q56 42 61 36 L61 0 Z`], fill: lower ? '#F2E2B0' : '#F0D27A' };
    case 'blades':
      return { paths: [lower ? 'M0 10 L18 30 L34 18 L50 46 L66 18 L82 30 L100 10 Z' : 'M0 10 L20 40 L36 22 L50 58 L64 22 L80 40 L100 10 Z'], fill: '#D8CDB2' };
    case 'beak':
      return {
        paths: [lower ? 'M0 0 L100 0 L100 8 Q66 12 50 44 Q34 12 0 8 Z' : 'M0 0 L100 0 L100 10 Q70 14 54 60 L50 68 L46 58 Q32 14 0 10 Z'],
        fill: lower ? '#4A433C' : KERATIN,
      };
  }
}

function Jaws({ jaw, w, h, v }: { jaw: Jaw; w: number; h: number; v: Animated.Value }) {
  const half = (lower: boolean) => {
    const t = teeth(jaw, lower);
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: -w * 0.06,
          width: w * 1.12,
          height: h * 0.52,
          ...(lower ? { bottom: 0 } : { top: 0 }),
          opacity: v.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1] }),
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [lower ? h * 0.5 : -h * 0.5, 0] }) }],
        }}>
        <Svg width={w * 1.12} height={h * 0.52} viewBox="0 0 100 70" preserveAspectRatio="none" style={lower ? { transform: [{ scaleY: -1 }] } : undefined}>
          {t.back?.map((d, i) => <Path key={`b${i}`} d={d} fill="#E7DFC8" stroke={LINE} strokeWidth={0.6} />)}
          {t.paths.map((d, i) => (
            <Path key={i} d={d} fill={t.fill} stroke={LINE} strokeWidth={0.8} />
          ))}
        </Svg>
      </Animated.View>
    );
  };
  return (
    <>
      {half(false)}
      {half(true)}
    </>
  );
}

// Talons (three toes against one) or pincers, closing from the sides.
function Grip({ style, w, h, v }: { style: 'talons' | 'pincer'; w: number; h: number; v: Animated.Value }) {
  const side = (right: boolean) => (
    <Animated.View
      style={{
        position: 'absolute',
        top: h * 0.1,
        height: h * 0.8,
        width: w * 0.62,
        ...(right ? { right: -w * 0.04 } : { left: -w * 0.04 }),
        opacity: v.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1] }),
        transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [right ? w * 0.55 : -w * 0.55, 0] }) }],
      }}>
      <Svg width={w * 0.62} height={h * 0.8} viewBox="0 0 60 110" preserveAspectRatio="none" style={right ? { transform: [{ scaleX: -1 }] } : undefined}>
        {style === 'talons' ? (
          right ? (
            // The back toe, opposing the three in front.
            <G>
              <Rect x={0} y={46} width={20} height={14} rx={6} fill="#D9B44A" />
              <Path d="M16 46 Q50 40 56 70 Q44 56 16 60 Z" fill={KERATIN} />
            </G>
          ) : (
            <G>
              {[14, 46, 78].map((y) => (
                <G key={y}>
                  <Rect x={0} y={y} width={22} height={13} rx={6} fill="#D9B44A" />
                  <Path d={`M18 ${y} Q52 ${y - 8} 58 ${y + 24} Q44 ${y + 8} 18 ${y + 13} Z`} fill={KERATIN} />
                </G>
              ))}
            </G>
          )
        ) : (
          <Path d={right ? 'M0 40 Q46 30 58 58 Q40 50 0 66 Z' : 'M0 34 Q50 14 60 56 Q46 40 0 52 M0 56 Q44 56 54 80 Q36 70 0 76 Z'} fill="#B5462E" stroke="#5A1E12" strokeWidth={1.2} />
        )}
      </Svg>
    </Animated.View>
  );
  return (
    <>
      {side(false)}
      {side(true)}
    </>
  );
}

// Claw marks raked diagonally across the card.
function Slash({ claws, w, h, v }: { claws: number; w: number; h: number; v: Animated.Value }) {
  const n = Math.max(1, claws);
  // Along the diagonal from top right to bottom left, spaced across it.
  const [sx, sy, ex, ey] = [88, 14, 12, 126];
  const len = Math.hypot(ex - sx, ey - sy);
  const px = -(ey - sy) / len;
  const py = (ex - sx) / len;
  const marks = Array.from({ length: n }, (_, i) => {
    const d = (i - (n - 1) / 2) * (n > 3 ? 13 : 16);
    const [ax, ay, bx, by] = [sx + px * d, sy + py * d, ex + px * d, ey + py * d];
    const [mx, my] = [(ax + bx) / 2, (ay + by) / 2];
    const wd = n === 1 ? 7 : 4.5;
    return `M${ax} ${ay} Q${mx + px * wd} ${my + py * wd} ${bx} ${by} Q${mx - px * wd} ${my - py * wd} ${ax} ${ay} Z`;
  });
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: v,
          transform: [
            { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [w * 0.3, 0] }) },
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-h * 0.3, 0] }) },
          ],
        },
      ]}>
      <Svg width={w} height={h} viewBox="0 0 100 140" preserveAspectRatio="none">
        {marks.map((d, i) => (
          <Path key={i} d={d} fill="#7A0F0F" stroke="#FFFFFF99" strokeWidth={0.8} />
        ))}
      </Svg>
    </Animated.View>
  );
}

// Footprints, in a 100 × 100 box, toes at the top.
function footprint(foot: Foot): ReactNode {
  const ink = '#3E2A1E';
  switch (foot) {
    case 'sauropod':
      return (
        <G fill={ink}>
          <Ellipse cx={52} cy={60} rx={36} ry={30} />
          <Ellipse cx={24} cy={26} rx={6} ry={10} rotation={-30} origin="24,26" />
          <Ellipse cx={40} cy={18} rx={6} ry={10} rotation={-10} origin="40,18" />
          <Ellipse cx={57} cy={18} rx={6} ry={10} />
        </G>
      );
    case 'elephant':
      return (
        <G fill={ink}>
          <Circle cx={50} cy={56} r={34} />
          {[-60, -30, 0, 30, 60].map((a) => (
            <Ellipse key={a} cx={50 + Math.sin((a * Math.PI) / 180) * 38} cy={56 - Math.cos((a * Math.PI) / 180) * 38} rx={6} ry={5} />
          ))}
        </G>
      );
    case 'ornithopod':
      return (
        <G fill={ink}>
          <Ellipse cx={50} cy={72} rx={22} ry={17} />
          <Ellipse cx={26} cy={42} rx={10} ry={22} rotation={-25} origin="26,42" />
          <Ellipse cx={50} cy={30} rx={11} ry={26} />
          <Ellipse cx={74} cy={42} rx={10} ry={22} rotation={25} origin="74,42" />
        </G>
      );
    case 'bird':
      return <Path d="M50 74 L20 22 M50 74 L50 8 M50 74 L80 22 M50 74 L50 94" stroke={ink} strokeWidth={9} strokeLinecap="round" fill="none" />;
    case 'ostrich':
      return (
        <G stroke={ink} strokeLinecap="round" fill="none">
          <Path d="M48 84 L54 12" strokeWidth={15} />
          <Path d="M50 80 L78 38" strokeWidth={9} />
        </G>
      );
    case 'rhino':
      return (
        <G fill={ink}>
          <Ellipse cx={50} cy={66} rx={27} ry={22} />
          <Circle cx={24} cy={32} r={11} />
          <Circle cx={50} cy={22} r={12} />
          <Circle cx={76} cy={32} r={11} />
        </G>
      );
    case 'horse':
      return <Path d="M18 34 Q50 -4 82 34 L82 90 L64 90 L64 44 Q50 28 36 44 L36 90 L18 90 Z" fill={ink} />;
    case 'cloven':
      return (
        <G fill={ink}>
          <Path d="M47 10 Q16 30 22 90 L46 90 Z" />
          <Path d="M53 10 Q84 30 78 90 L54 90 Z" />
        </G>
      );
    case 'wombat':
      return (
        <G fill={ink}>
          <Ellipse cx={50} cy={64} rx={28} ry={24} />
          {[18, 34, 50, 66, 82].map((x, i) => (
            <Circle key={x} cx={x} cy={[34, 22, 18, 22, 34][i]} r={7} />
          ))}
        </G>
      );
    case 'kangaroo':
      return (
        <G fill={ink}>
          <Ellipse cx={50} cy={58} rx={14} ry={38} />
          <Circle cx={50} cy={12} r={9} />
          <Circle cx={68} cy={28} r={6} />
        </G>
      );
  }
}

function Stomp({ foot, w, h, v }: { foot: Foot; w: number; h: number; v: Animated.Value }) {
  const s = w * 0.92;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: (w - s) / 2,
        top: (h - s) / 2,
        width: s,
        height: s,
        opacity: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.4, 0.88] }),
        transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] }) }],
      }}>
      <Svg width={s} height={s} viewBox="0 0 100 100">
        {footprint(foot)}
      </Svg>
    </Animated.View>
  );
}

// Weapons that bash up from below, in a 100 × 100 box, pointing up.
function basher(shape: Bash): ReactNode {
  const horn = '#6B5E4E';
  switch (shape) {
    case 'ceratopsian':
      return (
        <G>
          <Path d="M6 100 Q6 38 50 34 Q94 38 94 100 Z" fill="#8A6A4A" stroke={LINE} strokeWidth={1.2} />
          <Path d="M34 74 L26 2 L44 66 Z" fill={IVORY} stroke={LINE} strokeWidth={1} />
          <Path d="M66 74 L74 2 L56 66 Z" fill={IVORY} stroke={LINE} strokeWidth={1} />
          <Path d="M45 92 L50 56 L55 92 Z" fill={IVORY} stroke={LINE} strokeWidth={1} />
        </G>
      );
    case 'rhino':
      return (
        <G fill={horn} stroke={LINE} strokeWidth={1}>
          <Path d="M64 100 L76 46 L86 100 Z" />
          <Path d="M30 100 Q40 44 52 2 Q58 52 68 100 Z" />
        </G>
      );
    case 'twin':
      return (
        <G fill={horn} stroke={LINE} strokeWidth={1}>
          <Path d="M20 100 L33 6 L46 100 Z" />
          <Path d="M54 100 L67 6 L80 100 Z" />
        </G>
      );
    case 'bovid':
      return (
        <G fill="#CFC2A3" stroke={LINE} strokeWidth={1}>
          <Path d="M46 100 Q8 72 12 10 Q24 62 54 86 Z" />
          <Path d="M54 100 Q92 72 88 10 Q76 62 46 86 Z" />
        </G>
      );
    case 'antlers':
      return (
        <G stroke="#7A5C3A" strokeWidth={6} strokeLinecap="round" fill="none">
          <Path d="M42 100 Q20 60 26 6 M31 64 L10 48 M27 40 L8 28 M26 22 L40 8" />
          <Path d="M58 100 Q80 60 74 6 M69 64 L90 48 M73 40 L92 28 M74 22 L60 8" />
        </G>
      );
    case 'dome':
      return (
        <G>
          <Path d="M12 100 A38 38 0 0 1 88 100 Z" fill="#A07A52" stroke={LINE} strokeWidth={1.2} />
          {[20, 32, 50, 68, 80].map((x, i) => (
            <Circle key={x} cx={x} cy={[86, 72, 66, 72, 86][i]} r={4} fill="#7A5A3A" />
          ))}
        </G>
      );
    case 'club':
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M42 100 L46 42 L54 42 L58 100 Z" fill="#7C6A4E" />
          <Ellipse cx={50} cy={30} rx={28} ry={19} fill="#8E7A58" />
          <Ellipse cx={36} cy={30} rx={9} ry={12} fill="#9E8A66" />
          <Ellipse cx={64} cy={30} rx={9} ry={12} fill="#9E8A66" />
        </G>
      );
    case 'spikes':
      return (
        <G fill="#B9A27A" stroke={LINE} strokeWidth={1}>
          <Path d="M20 100 L6 22 L32 100 Z" />
          <Path d="M38 100 L34 4 L50 100 Z" />
          <Path d="M50 100 L66 4 L62 100 Z" />
          <Path d="M68 100 L94 22 L80 100 Z" />
        </G>
      );
    case 'tusks':
      return (
        <G fill={IVORY} stroke={LINE} strokeWidth={1}>
          <Path d="M28 100 Q16 40 46 8 Q30 46 42 100 Z" />
          <Path d="M72 100 Q84 40 54 8 Q70 46 58 100 Z" />
        </G>
      );
    case 'lance':
      return (
        <G>
          <Path d="M45 100 L50 0 L55 100 Z" fill={IVORY} stroke={LINE} strokeWidth={1} />
          <Path d="M46 84 L54 78 M47 64 L53 58 M48 44 L52 38 M49 24 L51 20" stroke={LINE} strokeWidth={1} />
        </G>
      );
    case 'fluke':
      return (
        <G fill="#5C6B78" stroke={LINE} strokeWidth={1}>
          <Path d="M43 100 L45 50 L55 50 L57 100 Z" />
          <Path d="M50 54 Q20 32 2 8 Q30 18 50 32 Q70 18 98 8 Q80 32 50 54 Z" />
        </G>
      );
    case 'forked':
      return <Path d="M28 100 Q36 40 24 12 Q44 28 50 58 Q56 28 76 12 Q64 40 72 100 Z" fill="#7C6450" stroke={LINE} strokeWidth={1} />;
  }
}

function BashUp({ shape, w, v }: { shape: Bash; w: number; v: Animated.Value }) {
  const s = w * 0.9;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: (w - s) / 2,
        bottom: 0,
        width: s,
        height: s,
        opacity: v.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
        // From below the card until its tip reaches the middle.
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [s, w * 0.2] }) }],
      }}>
      <Svg width={s} height={s} viewBox="0 0 100 100">
        {basher(shape)}
      </Svg>
    </Animated.View>
  );
}

// The attack itself over the target (w × h): in to CONTACT_MS, a short hold, then away.
export function WeaponFx({ weapon, w, h }: { weapon: Weapon; w: number; h: number }) {
  const v = useValue(0);
  const fade = useValue(1);
  useEffect(() => {
    const stays = weapon.kind === 'slash' || weapon.kind === 'stomp';
    Animated.sequence([
      run(v, 1, CONTACT_MS, weapon.kind === 'stomp' ? Easing.in(Easing.cubic) : Easing.in(Easing.quad)),
      Animated.delay(stays ? 300 : 160),
      // Marks and footprints fade where they are; jaws, talons and bashing weapons pull away.
      stays ? run(fade, 0, 450) : run(v, 0, 260, Easing.inOut(Easing.quad)),
    ]).start();
  }, [v, fade, weapon.kind]);
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: fade, overflow: 'visible' }]}>
      {weapon.kind === 'bite' && <Jaws jaw={weapon.jaw} w={w} h={h} v={v} />}
      {weapon.kind === 'grip' && <Grip style={weapon.style} w={w} h={h} v={v} />}
      {weapon.kind === 'slash' && <Slash claws={weapon.claws} w={w} h={h} v={v} />}
      {weapon.kind === 'stomp' && <Stomp foot={weapon.foot} w={w} h={h} v={v} />}
      {weapon.kind === 'bash' && <BashUp shape={weapon.shape} w={w} v={v} />}
    </Animated.View>
  );
}

// How the target card reacts to each kind of attack.
export const joltFor = (weapon: Weapon, result: 'hit' | 'held' | 'miss'): 'dodge' | 'shake' | 'up' | 'down' =>
  result === 'miss' ? 'dodge' : weapon.kind === 'bash' ? 'up' : weapon.kind === 'stomp' ? 'down' : 'shake';

const styles = StyleSheet.create({
  eyeBadge: { position: 'absolute', right: 2, bottom: 2, backgroundColor: '#00000099', alignItems: 'center', justifyContent: 'center' },
});
