import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

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

// The four stats as an X: attack north, speed east, defence south, swim west. Each arm has three
// bars that fill from the centre out.
export function StatCross({ stats, size, color, empty }: { stats: Stats; size: number; color: string; empty: string }) {
  const c = size / 2;
  const bar = size * 0.11;
  const gap = size * 0.035;
  const len = size * 0.2;
  const arms: { value: number; dx: number; dy: number }[] = [
    { value: stats.attack, dx: 0, dy: -1 },
    { value: stats.speed, dx: 1, dy: 0 },
    { value: stats.defence, dx: 0, dy: 1 },
    { value: stats.swim, dx: -1, dy: 0 },
  ];
  return (
    <Svg width={size} height={size}>
      {arms.flatMap((a, ai) =>
        [0, 1, 2].map((i) => {
          const d = size * 0.11 + i * (bar + gap);
          const vertical = a.dy !== 0;
          const x = vertical ? c - len / 2 : a.dx > 0 ? c + d : c - d - bar;
          const y = vertical ? (a.dy > 0 ? c + d : c - d - bar) : c - len / 2;
          return (
            <Rect
              key={`${ai}-${i}`}
              x={x}
              y={y}
              width={vertical ? len : bar}
              height={vertical ? bar : len}
              rx={bar / 3}
              fill={i < a.value ? color : empty}
            />
          );
        }),
      )}
      <Circle cx={c} cy={c} r={size * 0.06} fill={color} />
    </Svg>
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
      <View style={[styles.picture, { height: height * 0.46, borderTopLeftRadius: radius * 0.7, borderTopRightRadius: radius * 0.7, backgroundColor: back }]}>
        {picture ? (
          <Image source={{ uri: picture }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : card.kind === 'extinction' ? (
          <ExtinctionIcon cause={card.event.cause} size={width * 0.45} />
        ) : (
          <Text style={{ fontSize: width * 0.3 }}>🦴</Text>
        )}
      </View>
      <Text style={[styles.name, { color: ink, fontSize: small ? width * 0.1 : width * 0.085 }]} numberOfLines={2}>
        {name}
      </Text>
      <Text style={[styles.stars, { color: ink, fontSize: width * 0.08 }]}>{stars}</Text>
      {card.kind === 'species' ? (
        <StatCross stats={card.stats} size={height * 0.3} color={ink} empty={ink === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.15)'} />
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
