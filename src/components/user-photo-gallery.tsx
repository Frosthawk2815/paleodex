import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useInfoStyles } from '@/components/info-styles';
import { useProfile, useTextScale } from '@/lib/profile';
import { type UserPhoto, useUserPhotos } from '@/lib/user-photos';

// The bottom of a species page: the user's own photos of it, and a button to add more. Tapping a
// photo opens it larger, where it can be shown at the top of the page or removed.
export function UserPhotoGallery({ speciesId, name }: { speciesId: string; name: string }) {
  const info = useInfoStyles();
  const scale = useTextScale();
  const { photosOf, addPhotos, removePhoto, setMain } = useUserPhotos();
  const { profile, update } = useProfile();
  const { photos, mainId } = photosOf(speciesId);
  const [open, setOpen] = useState<UserPhoto | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const insets = useSafeAreaInsets();

  const add = async () => {
    setBusy(true);
    setMessage((await addPhotos(speciesId)) ?? '');
    setBusy(false);
  };
  const close = () => {
    setOpen(null);
    setConfirming(false);
  };
  const isMain = open !== null && open.id === mainId;

  return (
    <View style={styles.wrap}>
      <Text style={info.heading}>Your pictures</Text>
      {photos.length === 0 ? (
        <Text style={info.note}>Seen one at a museum, or have one at home? Add your own photos of {name} here. They stay on this device.</Text>
      ) : (
        <View style={styles.grid}>
          {photos.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => setOpen(p)}
              accessibilityRole="button"
              accessibilityLabel={`Your photo of ${name}${p.id === mainId ? ', shown at the top of the page' : ''}. Open`}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
              <Image source={{ uri: p.uri }} style={styles.thumb} contentFit="cover" recyclingKey={p.id} />
              {p.id === mainId && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>At top</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      )}
      <Pressable
        onPress={add}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed, busy && styles.disabled]}>
        <Text style={[styles.addText, { fontSize: Math.round(15 * scale) }]}>{busy ? 'Adding…' : '＋ Use your own picture'}</Text>
      </Pressable>
      {!!message && <Text style={info.note}>{message}</Text>}

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
                  <Text style={styles.actionText}>{isMain ? 'Stop showing at top of page' : 'Show at top of page'}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '31.5%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#141A26' },
  thumb: { width: '100%', height: '100%' },
  badge: { position: 'absolute', left: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#FFD54F', fontSize: 11, fontWeight: '700' },
  addButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(156,200,255,0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156,200,255,0.5)',
  },
  addText: { color: '#9CC8FF', fontWeight: '700' },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.5 },
  viewer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', paddingHorizontal: 16, gap: 12 },
  full: { flex: 1, width: '100%' },
  actions: { gap: 8 },
  action: { paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center' },
  remove: { backgroundColor: 'rgba(229,57,53,0.35)' },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
