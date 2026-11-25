// Bone War animations: cards fading out when they're beaten, water splashing over cards a swimmer
// reveals (and swallowing one it ambushes), a dodging card, and each animal's own attack: closing
// teeth or talons, a claw slash, a stomping footprint, or a horn, tusk, antler, dome, club or spikes
// bashing up from below. Plus the crocodile eye that shows whether a card is hidden or revealed.

import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { teeth } from '@/lib/bone-war-teeth';
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
    case 'spear':
      // A wooden shaft with a knapped stone point bound on with sinew.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M47.5 100 L47.5 30 L52.5 30 L52.5 100 Z" fill="#8B6A43" />
          <Path d="M43 34 L50 2 L57 34 L50 40 Z" fill="#8E8A84" />
          <Path d="M46 30 L50 18 M54 30 L50 18 M47 24 L53 24" stroke="#5E5A55" strokeWidth={0.8} />
          <Path d="M47 36 L53 39 M47 40 L53 43 M47 44 L53 47" stroke="#C9B48A" strokeWidth={1.4} />
        </G>
      );
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
          <Path d="M44 100 Q46 60 47.5 40 L52.5 40 Q54 60 56 100 Z" fill="#7C6A4E" />
          {/* The knob: two big bony plates either side, meeting in the middle, small ones at the tip. */}
          <Path d="M50 48 Q24 48 22 31 Q22 14 37 12 Q44 9 50 13 Q56 9 63 12 Q78 14 78 31 Q76 48 50 48 Z" fill="#8E7A58" />
          <Path d="M50 14 L50 46 M30 22 Q36 30 30 40 M70 22 Q64 30 70 40" stroke="#6E5C40" strokeWidth={1.2} fill="none" />
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
    case 'slap':
      // A whale's flukes seen from above, tail stock at the top, coming down flat.
      return (
        <G fill="#5C6B78" stroke={LINE} strokeWidth={1}>
          <Path d="M45 0 L55 0 L54 50 L46 50 Z" />
          <Path d="M50 46 Q24 50 3 72 Q26 64 47 74 L50 70 L53 74 Q74 64 97 72 Q76 50 50 46 Z" />
        </G>
      );
    case 'tailfin':
      // A shark's or big fish's tail: the stalk and an upright tail fin.
      return (
        <G fill="#66727C" stroke={LINE} strokeWidth={1}>
          <Path d="M45 100 L47 46 L53 46 L55 100 Z" />
          <Path d="M50 52 Q30 32 16 4 Q40 20 50 36 Q60 20 84 4 Q70 32 50 52 Z" />
        </G>
      );
    case 'thagomizer4':
      // Chungkingosaurus: three pairs of spikes pointing out and a last pair pointing back.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M43 100 Q46 50 49 10 L51 10 Q54 50 57 100 Z" fill="#7C6A4E" />
          <G fill="#CDB98E">
            <Path d="M46 58 L14 40 L47.5 51 Z" />
            <Path d="M54 58 L86 40 L52.5 51 Z" />
            <Path d="M47 44 L12 22 L48 37 Z" />
            <Path d="M53 44 L88 22 L52 37 Z" />
            <Path d="M47.5 30 L16 6 L49 23 Z" />
            <Path d="M52.5 30 L84 6 L51 23 Z" />
            <Path d="M48.5 18 L42 0 L50 12 Z" />
            <Path d="M51.5 18 L58 0 L50 12 Z" />
          </G>
        </G>
      );
    case 'kentro':
      // Kentrosaurus: pairs of spikes all along the back half of the tail, longest near the base.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M43 100 Q46 50 49 6 L51 6 Q54 50 57 100 Z" fill="#7C6A4E" />
          <G fill="#CDB98E">
            {[
              [84, 34],
              [68, 30],
              [52, 27],
              [37, 24],
              [22, 20],
              [9, 16],
            ].map(([y, len]) => (
              <G key={y}>
                <Path d={`M${46 + (100 - y!) * 0.03} ${y! + 4} L${50 - len!} ${y! - len! * 0.55} L${47 + (100 - y!) * 0.025} ${y! - 3} Z`} />
                <Path d={`M${54 - (100 - y!) * 0.03} ${y! + 4} L${50 + len!} ${y! - len! * 0.55} L${53 - (100 - y!) * 0.025} ${y! - 3} Z`} />
              </G>
            ))}
          </G>
        </G>
      );
    case 'macuahuitl':
      // Stegouros: the end of the tail encased in a flat frond of paired bony blades.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M44 100 Q46 70 47 56 L53 56 Q54 70 56 100 Z" fill="#7C6A4E" />
          <G fill="#A68D62">
            {[58, 48, 38, 28, 18, 9].map((y, i) => {
              const r = 16 - i * 1.8;
              return (
                <G key={y}>
                  <Path d={`M50 ${y + 6} L${50 - r} ${y + 4} Q${50 - r - 3} ${y - 2} ${50 - r + 2} ${y - 5} L50 ${y - 3} Z`} />
                  <Path d={`M50 ${y + 6} L${50 + r} ${y + 4} Q${50 + r + 3} ${y - 2} ${50 + r - 2} ${y - 5} L50 ${y - 3} Z`} />
                </G>
              );
            })}
          </G>
        </G>
      );
    case 'spikedclub':
      // Zuul: a tail club, with rows of spikes along the sides of the tail.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M44 100 Q46 60 47.5 40 L52.5 40 Q54 60 56 100 Z" fill="#7C6A4E" />
          <G fill="#B9A27A">
            {[86, 72, 58, 46].map((y) => (
              <G key={y}>
                <Path d={`M46 ${y + 4} L${34 - (100 - y) * 0.05} ${y - 4} L47 ${y - 3} Z`} />
                <Path d={`M54 ${y + 4} L${66 + (100 - y) * 0.05} ${y - 4} L53 ${y - 3} Z`} />
              </G>
            ))}
          </G>
          <Path d="M50 44 Q26 44 24 29 Q24 13 38 11 Q44 8 50 12 Q56 8 62 11 Q76 13 76 29 Q74 44 50 44 Z" fill="#8E7A58" />
          <Path d="M50 13 L50 42 M31 20 Q37 28 31 37 M69 20 Q63 28 69 37" stroke="#6E5C40" strokeWidth={1.2} fill="none" />
        </G>
      );
    case 'mace':
      // Doedicurus: armoured rings at the base, then a fused bony tube ending in a spiked mace.
      return (
        <G stroke={LINE} strokeWidth={1}>
          {[92, 84, 76].map((y, i) => (
            <Rect key={y} x={40 + i} y={y} width={20 - 2 * i} height={8} rx={2} fill="#9C8664" />
          ))}
          <Path d="M43 76 L40 26 Q50 14 60 26 L57 76 Z" fill="#8E7A58" />
          <G fill="#CDB98E">
            <Path d="M41 30 L26 18 L42 24 Z" />
            <Path d="M59 30 L74 18 L58 24 Z" />
            <Path d="M44 22 L36 4 L47 18 Z" />
            <Path d="M56 22 L64 4 L53 18 Z" />
            <Path d="M41 42 L28 36 L41 37 Z" />
            <Path d="M59 42 L72 36 L59 37 Z" />
          </G>
        </G>
      );
    case 'ringed':
      // Glyptotherium and most glyptodonts: a tail armoured in rings of bony plates, no club.
      return (
        <G stroke={LINE} strokeWidth={1} fill="#9C8664">
          {[90, 79, 68, 57, 46, 35, 24].map((y, i) => (
            <G key={y}>
              <Rect x={38 + i * 1.4} y={y} width={24 - i * 2.8} height={10} rx={3} />
              <Circle cx={39.5 + i * 1.4} cy={y + 5} r={2} fill="#7A6548" />
              <Circle cx={60.5 - i * 1.4} cy={y + 5} r={2} fill="#7A6548" />
            </G>
          ))}
          <Path d="M47 25 L48 12 Q50 9 52 12 L53 25 Z" />
        </G>
      );
    case 'humpback':
      // Humpback flukes: long, with a scalloped trailing edge.
      return (
        <G fill="#4F5B66" stroke={LINE} strokeWidth={1}>
          <Path d="M45 0 L55 0 L54 50 L46 50 Z" />
          <Path d="M50 46 Q24 48 2 70 Q8 72 12 69 Q16 74 22 70 Q27 75 32 71 Q38 76 43 72 Q47 76 50 70 Q53 76 57 72 Q62 76 68 71 Q73 75 78 70 Q84 74 88 69 Q92 72 98 70 Q76 48 50 46 Z" />
        </G>
      );
    case 'paddle':
      // A manatee's rounded paddle of a tail.
      return (
        <G fill="#7D8890" stroke={LINE} strokeWidth={1}>
          <Path d="M44 0 L56 0 L58 40 L42 40 Z" />
          <Ellipse cx={50} cy={60} rx={26} ry={24} />
        </G>
      );
    case 'manta':
      // A manta ray seen from above, wings spread, coming down on the card.
      return (
        <G fill="#2F3A45" stroke={LINE} strokeWidth={1}>
          <Path d="M50 30 Q30 36 2 62 Q30 60 44 76 L50 98 L56 76 Q70 60 98 62 Q70 36 50 30 Z" />
          <Path d="M44 32 L40 20 L46 30 M56 32 L60 20 L54 30" fill="none" />
          <Path d="M50 76 L50 100" fill="none" />
        </G>
      );
    case 'thresher':
      // A thresher shark's tail: a small lower lobe and a huge, scythe-shaped upper lobe.
      return (
        <G fill="#5E6E80" stroke={LINE} strokeWidth={1}>
          <Path d="M46 100 L47.5 64 L52.5 64 L54 100 Z" />
          <Path d="M50 68 Q38 62 33 52 Q43 57 50 61 Z" />
          <Path d="M49 68 Q54 42 64 20 Q72 6 86 0 Q74 14 66 36 Q59 54 53 68 Z" />
        </G>
      );
    case 'sharktail':
      // A shark's tail: the upper lobe longer than the lower.
      return (
        <G fill="#66727C" stroke={LINE} strokeWidth={1}>
          <Path d="M45 100 L47 46 L53 46 L55 100 Z" />
          <Path d="M50 52 Q36 34 34 22 Q44 32 50 38 Q58 22 86 0 Q70 32 50 52 Z" />
        </G>
      );
    case 'thagomizer':
      // A stegosaur's tail tip with its two pairs of long spikes splaying outwards.
      return (
        <G stroke={LINE} strokeWidth={1}>
          <Path d="M43 100 Q46 50 49 12 L51 12 Q54 50 57 100 Z" fill="#7C6A4E" />
          <G fill="#CDB98E">
            <Path d="M46.5 46 L10 20 L48 38 Z" />
            <Path d="M53.5 46 L90 20 L52 38 Z" />
            <Path d="M47.5 28 L20 2 L49 21 Z" />
            <Path d="M52.5 28 L80 2 L51 21 Z" />
          </G>
        </G>
      );
    case 'forked':
      return <Path d="M28 100 Q36 40 24 12 Q44 28 50 58 Q56 28 76 12 Q64 40 72 100 Z" fill="#7C6450" stroke={LINE} strokeWidth={1} />;
  }
}

// Tail weapons that swing: from the bottom corner, in an arc up and across the card.
const SWINGS: Bash[] = ['thagomizer', 'thagomizer4', 'kentro', 'macuahuitl', 'club', 'spikedclub', 'mace', 'ringed', 'tailfin', 'sharktail', 'thresher'];
// Tails that move up and down slap down from above.
const SLAPS: Bash[] = ['slap', 'humpback', 'paddle', 'manta'];

function BashUp({ shape, w, h, v }: { shape: Bash; w: number; h: number; v: Animated.Value }) {
  if (SWINGS.includes(shape)) {
    const s = w;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: -s / 2,
          top: h - s,
          width: s,
          height: s,
          opacity: v.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 1, 1] }),
          // Pivoting where the tail meets the body, at the card's bottom corner.
          transformOrigin: '50% 100%',
          transform: [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-100deg', '35deg'] }) }],
        }}>
        <Svg width={s} height={s} viewBox="0 0 100 100">
          {basher(shape)}
        </Svg>
      </Animated.View>
    );
  }
  if (SLAPS.includes(shape)) {
    // Flukes coming down from above onto the middle of the card.
    const bw = w * 1.1;
    const bh = h * 0.7;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: -w * 0.05,
          top: 0,
          width: bw,
          height: bh,
          opacity: v.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 1, 1] }),
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-h * 0.9, -h * 0.02] }) }],
        }}>
        <Svg width={bw} height={bh} viewBox="0 0 100 100" preserveAspectRatio="none">
          {basher(shape)}
        </Svg>
      </Animated.View>
    );
  }
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

// One splash of water where a fluke slaps down.
function SlapSplash({ w, h }: { w: number; h: number }) {
  const v = useValue(0);
  useEffect(() => {
    Animated.sequence([Animated.delay(CONTACT_MS - 20), run(v, 1, 520, Easing.out(Easing.cubic))]).start();
  }, [v]);
  const s = w * 1.2;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: (w - s) / 2,
        top: h / 2 - s * 0.62,
        width: s,
        height: s * 0.7,
        opacity: v.interpolate({ inputRange: [0, 0.05, 0.6, 1], outputRange: [0, 0.95, 0.8, 0] }),
        transformOrigin: '50% 100%',
        transform: [{ scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.15] }) }, { scaleY: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1, 1.1] }) }],
      }}>
      <Svg width={s} height={s * 0.7} viewBox="0 0 100 70">
        <Path d="M4 70 Q14 44 10 26 Q22 40 26 34 Q24 14 34 4 Q38 26 44 24 Q46 8 52 0 Q56 22 60 24 Q66 8 74 6 Q72 28 78 34 Q86 26 92 22 Q86 44 96 70 Z" fill={WATER} stroke="#BFE6FF" strokeWidth={1.5} />
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
      {weapon.kind === 'bash' && <BashUp shape={weapon.shape} w={w} h={h} v={v} />}
      {weapon.kind === 'bash' && SLAPS.includes(weapon.shape) && <SlapSplash w={w} h={h} />}
    </Animated.View>
  );
}

// How the target card reacts to each kind of attack.
export const joltFor = (weapon: Weapon, result: 'hit' | 'held' | 'miss'): 'dodge' | 'shake' | 'up' | 'down' =>
  result === 'miss'
    ? 'dodge'
    : weapon.kind === 'bash'
      ? SLAPS.includes(weapon.shape)
        ? 'down'
        : SWINGS.includes(weapon.shape)
          ? 'shake'
          : 'up'
      : weapon.kind === 'stomp'
        ? 'down'
        : 'shake';

const styles = StyleSheet.create({
  eyeBadge: { position: 'absolute', right: 2, bottom: 2, backgroundColor: '#00000099', alignItems: 'center', justifyContent: 'center' },
});
