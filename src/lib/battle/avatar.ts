// Profile pictures for Peer Review leaderboards. A photo on the phone can't be shown on other
// phones, so it is shrunk to a small JPEG and sent with the player's name; a species picture is
// sent as the species, and each phone shows PaleoDex's picture of it.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import type { Avatar } from '@/lib/profile';

export type SharedAvatar = { kind: 'species'; id: string } | { kind: 'image'; uri: string } | null;

async function shrink(uri: string): Promise<string | null> {
  try {
    const ctx = ImageManipulator.manipulate(uri);
    ctx.resize({ width: 96 });
    const image = await ctx.renderAsync();
    const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.6, base64: true });
    return saved.base64 ? `data:image/jpeg;base64,${saved.base64}` : null;
  } catch {
    return null;
  }
}

export async function shareableAvatar(avatar: Avatar, ownPicture: (id: string) => string | undefined): Promise<SharedAvatar> {
  if (avatar?.kind === 'upload') {
    const uri = await shrink(avatar.uri);
    return uri ? { kind: 'image', uri } : null;
  }
  if (avatar?.kind === 'species') {
    const own = ownPicture(avatar.id);
    const uri = own ? await shrink(own) : null;
    return uri ? { kind: 'image', uri } : { kind: 'species', id: avatar.id };
  }
  return null;
}
