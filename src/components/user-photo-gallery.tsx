import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useInfoStyles } from '@/components/info-styles';
import { useProfile, useTextScale } from '@/lib/profile';
import { type UserPhoto, useUserPhotos } from '@/lib/user-photos';

// The bottom of a species page: a "+" that picks a photo from the device and shows it at the top
// of the page. The user's photos are managed in Profile › Your Images.
export function AddPhotoButton({ speciesId, name }: { speciesId: string; name: string }) {
  const info = useInfoStyles();
  const scale = useTextScale();
  const { addPhotos } = useUserPhotos();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    setBusy(true);
    setMessage((await addPhotos(speciesId)) ?? '');
    setBusy(false);
  };

  return (
    <View style={styles.addWrap}>
      <Pressable
        onPress={add}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={`Use your own picture of ${name}`}
        accessibilityState={{ disabled: busy, busy }}
        hitSlop={6}
        style={({ pressed }) => [styles.addRow, pressed && styles.pressed, busy && styles.disabled]}>
        <View style={styles.plus}>
          <Text style={styles.plusText}>+</Text>
        </View>
        <Text style={[styles.addText, { fontSize: Math.round(14 * scale) }]}>{busy ? 'Adding…' : 'Use your own picture'}</Text>
      </Pressable>
      {!!message && <Text style={info.note}>{message}</Text>}
    </View>
  );
}

// A grid of the user's photos of one species. Tapping a photo opens it larger, where it can be
// shown at the top of the species page or removed.
export function SpeciesPhotoGrid({ speciesId, name, tileColor }: { speciesId: string; name: string; tileColor: string }) {
  const { photosOf, removePhoto, setMain } = useUserPhotos();
  const { profile, update } = useProfile();
  const { photos, mainId } = photosOf(speciesId);
  const [open, setOpen] = useState<UserPhoto | null>(null);
  const [confirming, setConfirming] = useState(false);
  const insets = useSafeAreaInsets();

  const close = () => {
    setOpen(null);
    setConfirming(false);
  };
  const isMain = open !== null && open.id === mainId;

  return (
    <>
      <View style={styles.grid}>
        {photos.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setOpen(p)}
            accessibilityRole="button"
            accessibilityLabel={`Your photo of ${name}${p.id === mainId ? ', shown at the top of its page' : ''}. Open`}
            style={({ pressed }) => [styles.tile, { backgroundColor: tileColor }, pressed && styles.pressed]}>
            <Image source={{ uri: p.uri }} style={styles.thumb} contentFit="cover" recyclingKey={p.id} />
            {p.id === mainId && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>On page</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <Modal visible={open !== null} transparent animationType="fade" onRequestClose={close}>
        <View style={[styles.viewer, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          {open && (
            <>
              <Image source={{ uri: open.uri }} style={styles.full} contentFit="contain" accessibilityLabel={`Your photo of ${name}`} />
              <View style={styles.actions}>
                <Pressable
                  onPress={() => setMain(speciesId, isMain ? undefined : open.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
                  <Text style={styles.actionText}>{isMain ? 'Stop showing on species page' : 'Show on species page'}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (!confirming) return setConfirming(true);
                    removePhoto(speciesId, open.id);
                    // A removed photo can't stay as the profile picture.
                    if (profile.avatar?.kind === 'upload' && profile.avatar.uri === open.uri) update({ avatar: null });
                    close();
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.action, styles.remove, pressed && styles.pressed]}>
                  <Text style={styles.actionText}>{confirming ? 'Tap again to remove' : 'Remove photo'}</Text>
                </Pressable>
                <Pressable onPress={close} accessibilityRole="button" style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
                  <Text style={styles.actionText}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addWrap: { marginTop: 24, alignItems: 'center', gap: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  plus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(156,200,255,0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156,200,255,0.5)',
  },
  plusText: { color: '#9CC8FF', fontSize: 24, lineHeight: 26, fontWeight: '600' },
  addText: { color: '#9CC8FF', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '31.5%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  badge: { position: 'absolute', left: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#FFD54F', fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.5 },
  viewer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', paddingHorizontal: 16, gap: 12 },
  full: { flex: 1, width: '100%' },
  actions: { gap: 8 },
  action: { paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center' },
  remove: { backgroundColor: 'rgba(229,57,53,0.35)' },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
