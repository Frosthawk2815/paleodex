import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ExtinctionIcon } from '@/components/extinction-icon';
import { type Card, cardName } from '@/lib/bone-war';
import type { Stats } from '@/lib/cards';
import { imageOf } from '@/lib/images';
import { useProfile } from '@/lib/profile';
import { useOwnPicture } from '@/lib/user-photos';

const ICON = require('../../assets/images/icon.png');

// Card proportions: 5 wide by 7 tall, like a playing card.
export const CARD_RATIO = 7 / 5;

// Black or white text, whichever reads better on a colour.
function inkOn(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111111' : '#FFFFFF';
}

export type StatLayout = 'squares' | 'rings' | 'cross' | 'bars' | 'numbers' | 'icons';
export const STAT_LAYOUTS: { id: StatLayout; name: string }[] = [
  { id: 'squares', name: 'Squares' },
  { id: 'rings', name: 'Rings' },
  { id: 'cross', name: 'Cross' },
  { id: 'bars', name: 'Bars' },
  { id: 'numbers', name: 'Numbers' },
  { id: 'icons', name: 'Icons' },
];
// The four stats, each with its symbol: attack (swords), defence (shield), speed (lightning) and
// swim (a wave).
export const STAT_ICONS = { attack: '⚔️', defence: '🛡️', speed: '⚡', swim: '🌊' } as const;
const ORDER = ['attack', 'defence', 'speed', 'swim'] as const;

// The four stats as an X: attack north, speed east, defence south, swim west. Each arm has three
// bars that fill from the centre out, with its symbol at the tip.
export function StatCross({ stats, size, color, empty }: { stats: Stats; size: number; color: string; empty: string }) {
  const c = size / 2;
  const bar = size * 0.065;
  const gap = size * 0.025;
  const len = size * 0.14;
  const icon = size * 0.17;
  const arms: { value: number; dx: number; dy: number; icon: string }[] = [
    { value: stats.attack, dx: 0, dy: -1, icon: STAT_ICONS.attack },
    { value: stats.speed, dx: 1, dy: 0, icon: STAT_ICONS.speed },
    { value: stats.defence, dx: 0, dy: 1, icon: STAT_ICONS.defence },
    { value: stats.swim, dx: -1, dy: 0, icon: STAT_ICONS.swim },
  ];
  const tip = size * 0.08 + 3 * (bar + gap) + icon * 0.6;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {arms.flatMap((a, ai) =>
          [0, 1, 2].map((i) => {
            const d = size * 0.07 + i * (bar + gap);
            const vertical = a.dy !== 0;
            const x = vertical ? c - len / 2 : a.dx > 0 ? c + d : c - d - bar;
            const y = vertical ? (a.dy > 0 ? c + d : c - d - bar) : c - len / 2;
            return <Rect key={`${ai}-${i}`} x={x} y={y} width={vertical ? len : bar} height={vertical ? bar : len} rx={bar / 3} fill={i < a.value ? color : empty} />;
          }),
        )}
        <Circle cx={c} cy={c} r={size * 0.045} fill={color} />
      </Svg>
      {arms.map((a) => (
        <Text
          key={a.icon}
          style={{ position: 'absolute', fontSize: icon, lineHeight: icon * 1.2, width: icon * 1.4, textAlign: 'center', left: c + a.dx * tip - icon * 0.7, top: c + a.dy * tip - icon * 0.6 }}>
          {a.icon}
        </Text>
      ))}
    </View>
  );
}

// The four stats as a target split by an X into four wedges (attack top, speed right, defence bottom,
// swim left), each in three rings that fill from the centre out; square or round. Each wedge's symbol
// sits just outside it.
export function StatTarget({ stats, size, color, empty, round }: { stats: Stats; size: number; color: string; empty: string; round: boolean }) {
  const c = size / 2;
  const icon = size * 0.17;
  const R = [0, size * 0.1, size * 0.19, size * 0.28];
  const wedges: { value: number; angle: number; icon: string }[] = [
    { value: stats.attack, angle: -90, icon: STAT_ICONS.attack },
    { value: stats.speed, angle: 0, icon: STAT_ICONS.speed },
    { value: stats.defence, angle: 90, icon: STAT_ICONS.defence },
    { value: stats.swim, angle: 180, icon: STAT_ICONS.swim },
  ];
  const pt = (r: number, deg: number) => {
    const t = (deg * Math.PI) / 180;
    return `${c + r * Math.cos(t)} ${c + r * Math.sin(t)}`;
  };
  // A band between radius a and b, in the wedge facing `angle`.
  const band = (a: number, b: number, angle: number) => {
    if (round) {
      const [t1, t2] = [angle - 45, angle + 45];
      return a === 0
        ? `M ${c} ${c} L ${pt(b, t1)} A ${b} ${b} 0 0 1 ${pt(b, t2)} Z`
        : `M ${pt(b, t1)} A ${b} ${b} 0 0 1 ${pt(b, t2)} L ${pt(a, t2)} A ${a} ${a} 0 0 0 ${pt(a, t1)} Z`;
    }
    // Squares: corners sit on the diagonals, at √2 times the half-width.
    const k = Math.SQRT2;
    return `M ${pt(b * k, angle - 45)} L ${pt(b * k, angle + 45)} L ${pt(a * k, angle + 45)} L ${pt(a * k, angle - 45)} Z`;
  };
  const tip = R[3]! + icon * 0.72;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {wedges.flatMap((w, wi) =>
          [0, 1, 2].map((i) => (
            <Path key={`${wi}-${i}`} d={band(R[i]!, R[i + 1]!, w.angle)} fill={i < w.value ? color : empty} stroke={color} strokeWidth={Math.max(0.6, size * 0.008)} strokeOpacity={0.55} />
          )),
        )}
      </Svg>
      {wedges.map((w) => {
        const t = (w.angle * Math.PI) / 180;
        return (
          <Text
            key={w.icon}
            style={{ position: 'absolute', fontSize: icon, lineHeight: icon * 1.2, width: icon * 1.4, textAlign: 'center', left: c + tip * Math.cos(t) - icon * 0.7, top: c + tip * Math.sin(t) - icon * 0.6 }}>
            {w.icon}
          </Text>
        );
      })}
    </View>
  );
}

// The stats in the player's chosen layout, fitted into a box `width` wide and `height` tall.
export function StatDisplay({ stats, layout, width, height, color, empty }: { stats: Stats; layout: StatLayout; width: number; height: number; color: string; empty: string }) {
  if (layout === 'cross') return <StatCross stats={stats} size={Math.min(width, height)} color={color} empty={empty} />;
  if (layout === 'squares' || layout === 'rings') return <StatTarget stats={stats} size={Math.min(width, height)} color={color} empty={empty} round={layout === 'rings'} />;
  if (layout === 'numbers') {
    const f = Math.min(width / 7.5, height / 3.4);
    return (
      <View style={{ width, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', height }}>
        {ORDER.map((k) => (
          <View key={k} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Text style={{ fontSize: f }}>{STAT_ICONS[k]}</Text>
            <Text style={{ fontSize: f * 1.05, fontWeight: '800', color: stats[k] ? color : empty }}>{stats[k] ? `+${stats[k]}` : '0'}</Text>
          </View>
        ))}
      </View>
    );
  }
  // Bars and icons: one row per stat.
  const rowH = height / 4;
  const f = Math.min(rowH * 0.78, width / 5);
  return (
    <View style={{ width, height, justifyContent: 'center' }}>
      {ORDER.map((k) => (
        <View key={k} style={{ height: rowH, flexDirection: 'row', alignItems: 'center', gap: f * 0.3, paddingHorizontal: width * 0.06 }}>
          {layout === 'bars' ? (
            <>
              <Text style={{ fontSize: f, width: f * 1.35, textAlign: 'center' }}>{STAT_ICONS[k]}</Text>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ flex: 1, height: rowH * 0.45, borderRadius: rowH * 0.15, backgroundColor: i < stats[k] ? color : empty }} />
              ))}
            </>
          ) : (
            [0, 1, 2].map((i) => (
              <Text key={i} style={{ fontSize: f, opacity: i < stats[k] ? 1 : 0.18, flex: 1, textAlign: 'center' }}>
                {STAT_ICONS[k]}
              </Text>
            ))
          )}
        </View>
      ))}
    </View>
  );
}

// One Bone War card, face up or face down, at a given width.
export function BoneWarCard({
  card,
  width,
  faceDown = false,
  highlight,
  cardStyle,
  art,
}: {
  card: Card | null;
  width: number;
  faceDown?: boolean;
  highlight?: string;
  // Another player's colours (default: this player's).
  cardStyle?: { back: string; border: string };
  // Another player's photos (species id to picture); their cards never show this player's photos.
  art?: Record<string, string>;
}) {
  const { profile } = useProfile();
  const own = useOwnPicture();
  const { back, border } = cardStyle ?? profile.cardStyle;
  const height = width * CARD_RATIO;
  const radius = width * 0.08;
  const edge = Math.max(2, width * 0.04);
  const ring = highlight ? { borderColor: highlight, borderWidth: edge * 1.4 } : { borderColor: border, borderWidth: edge };

  if (faceDown || !card) {
    return (
      <View style={[styles.card, { width, height, borderRadius: radius, backgroundColor: back }, ring]} accessibilityLabel="Face-down card">
        <Image source={ICON} style={{ width: width * 0.62, height: width * 0.62, borderRadius: width * 0.14 }} contentFit="contain" />
      </View>
    );
  }

  const ink = inkOn(border);
  const name = cardName(card);
  const stars = '★'.repeat(card.stars);
  const pictured = card.kind === 'species' ? card.id : card.speciesId;
  const picture = pictured ? (art ? art[pictured] : own(pictured)) ?? imageOf(pictured)?.thumb : undefined;
  const small = width < 90;
  return (
    <View
      style={[styles.card, { width, height, borderRadius: radius, backgroundColor: border, justifyContent: 'flex-start' }, ring]}
      accessibilityLabel={
        card.kind === 'species'
          ? `${name}, ${card.stars} stars. Attack ${card.stats.attack}, defence ${card.stats.defence}, speed ${card.stats.speed}, swim ${card.stats.swim}.`
          : `${name} extinction card, ${card.stars} stars.`
      }>
      <View style={[styles.picture, { height: height * 0.4, borderTopLeftRadius: radius * 0.7, borderTopRightRadius: radius * 0.7, backgroundColor: back }]}>
        {picture ? (
          <Image source={{ uri: picture }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : card.kind === 'extinction' ? (
          <ExtinctionIcon cause={card.event.cause} size={width * 0.45} />
        ) : (
          <Text style={{ fontSize: width * 0.3 }}>🦴</Text>
        )}
      </View>
      <Text style={[styles.name, { color: ink, fontSize: small ? width * 0.1 : width * 0.085 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {name}
      </Text>
      <Text style={[styles.stars, { color: ink, fontSize: width * 0.08 }]}>{stars}</Text>
      {card.kind === 'species' ? (
        <StatDisplay
          stats={card.stats}
          layout={profile.cardStyle.layout ?? 'squares'}
          width={width * 0.92}
          height={height * 0.35}
          color={ink}
          empty={ink === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.15)'}
        />
      ) : (
        <Text style={[styles.extinct, { color: ink, fontSize: width * 0.075 }]} numberOfLines={2}>
          {card.speciesId ? 'Extinction by humans' : 'Mass extinction'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  picture: { width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  name: { fontWeight: '800', textAlign: 'center', marginTop: 3, paddingHorizontal: 3 },
  stars: { letterSpacing: 1 },
  extinct: { fontWeight: '700', textAlign: 'center', marginTop: 6, paddingHorizontal: 4 },
});
