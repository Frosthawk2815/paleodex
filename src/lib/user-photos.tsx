// The user's own photos of species (their pet, a museum skeleton...), kept on this device. On phones
// each photo is copied into the app's documents folder so it survives the picker's temporary files
// being cleared; the browser has no such folder, so there photos are kept as data in local storage,
// which has far less room.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type UserPhoto = { id: string; uri: string; width?: number; height?: number; addedAt: number };
// A species' photos, newest first, and the one shown at the top of its page (if any).
export type SpeciesPhotos = { photos: UserPhoto[]; mainId?: string };

const STORAGE_KEY = 'paleodex.userPhotos.v1';
const MAX_PICK = 10;
const isWeb = Platform.OS === 'web';

type UserPhotosContext = {
  photosOf: (speciesId: string) => SpeciesPhotos;
  // Asks the user to choose photos and adds them; returns a message if something went wrong.
  addPhotos: (speciesId: string) => Promise<string | null>;
  removePhoto: (speciesId: string, photoId: string) => void;
  // Show a photo at the top of the species page in place of the stock picture (or stop, with undefined).
  setMain: (speciesId: string, photoId: string | undefined) => void;
  // Every photo the user has added, with its species, newest first.
  allPhotos: (UserPhoto & { speciesId: string })[];
};

const EMPTY: SpeciesPhotos = { photos: [] };
const Context = createContext<UserPhotosContext | null>(null);

const folder = () => {
  const dir = new Directory(Paths.document, 'user-photos');
  if (!dir.exists) dir.create({ idempotent: true });
  return dir;
};

export function UserPhotosProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, SpeciesPhotos>>({});
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setStore(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => {});
  }, [store]);

  const photosOf = useCallback((speciesId: string) => store[speciesId] ?? EMPTY, [store]);

  const addPhotos = useCallback(async (speciesId: string) => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: MAX_PICK,
        quality: isWeb ? 0.5 : 0.7,
        base64: isWeb,
      });
      if (result.canceled) return null;
      const added: UserPhoto[] = [];
      for (const [i, asset] of result.assets.entries()) {
        const id = `${Date.now()}-${i}`;
        let uri = asset.uri;
        if (isWeb) {
          if (!asset.base64) continue;
          uri = `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
        } else {
          const ext = asset.mimeType === 'image/png' ? 'png' : 'jpg';
          const dest = new File(folder(), `${speciesId}-${id}.${ext}`);
          await new File(asset.uri).copy(dest);
          uri = dest.uri;
        }
        added.push({ id, uri, width: asset.width, height: asset.height, addedAt: Date.now() });
      }
      if (added.length === 0) return 'Those photos couldn’t be read. Try different ones.';
      setStore((s) => {
        const cur = s[speciesId] ?? EMPTY;
        return { ...s, [speciesId]: { ...cur, photos: [...added.reverse(), ...cur.photos] } };
      });
      return null;
    } catch {
      return 'Your photos couldn’t be opened or saved. Check that PaleoDex is allowed to use your photos, and that there is space on your device.';
    }
  }, []);

  const removePhoto = useCallback(
    (speciesId: string, photoId: string) => {
      const photo = store[speciesId]?.photos.find((p) => p.id === photoId);
      if (photo && !isWeb) {
        try {
          const f = new File(photo.uri);
          if (f.exists) f.delete();
        } catch {
          // The file may already be gone; the entry is removed either way.
        }
      }
      setStore((s) => {
        const cur = s[speciesId];
        if (!cur) return s;
        const photos = cur.photos.filter((p) => p.id !== photoId);
        const copy = { ...s };
        if (photos.length) copy[speciesId] = { photos, mainId: cur.mainId === photoId ? undefined : cur.mainId };
        else delete copy[speciesId];
        return copy;
      });
    },
    [store],
  );

  const setMain = useCallback((speciesId: string, photoId: string | undefined) => {
    setStore((s) => (s[speciesId] ? { ...s, [speciesId]: { ...s[speciesId], mainId: photoId } } : s));
  }, []);

  const allPhotos = useMemo(
    () =>
      Object.entries(store)
        .flatMap(([speciesId, sp]) => sp.photos.map((p) => ({ ...p, speciesId })))
        .sort((a, b) => b.addedAt - a.addedAt),
    [store],
  );
  const value = useMemo(() => ({ photosOf, addPhotos, removePhoto, setMain, allPhotos }), [photosOf, addPhotos, removePhoto, setMain, allPhotos]);
  return <Context value={value}>{children}</Context>;
}

export function useUserPhotos(): UserPhotosContext {
  const ctx = use(Context);
  if (!ctx) throw new Error('useUserPhotos must be used inside UserPhotosProvider');
  return ctx;
}

// The photo the user chose to show at the top of a species page, if any.
export function useMainUserPhoto(speciesId: string): UserPhoto | undefined {
  const { photos, mainId } = useUserPhotos().photosOf(speciesId);
  return mainId ? photos.find((p) => p.id === mainId) : undefined;
}
