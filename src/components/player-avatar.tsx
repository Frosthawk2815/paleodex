import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { initialsOf } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import type { SharedAvatar } from '@/lib/battle/avatar';
import { imageOf } from '@/lib/images';

// Another player's picture in Bone War and Peer Review: their own photo (sent shrunk), PaleoDex's
// picture of the species they chose, or their initials.
export function PlayerAvatar({ name, avatar, size }: { name: string; avatar: SharedAvatar; size: number }) {
  const palette = usePalette();
  const uri = avatar?.kind === 'image' ? avatar.uri : avatar?.kind === 'species' ? imageOf(avatar.id)?.thumb : undefined;
  const round = { width: size, height: size, borderRadius: size / 2 };
  const label = `${name || 'Player'}’s picture`;
  if (uri) return <Image source={{ uri }} style={[round, { backgroundColor: palette.track }]} contentFit="cover" accessibilityLabel={label} />;
  return (
    <View style={[round, { backgroundColor: palette.link, alignItems: 'center', justifyContent: 'center' }]} accessibilityLabel={label}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.38 }}>{initialsOf(name) || '🦖'}</Text>
    </View>
  );
}
