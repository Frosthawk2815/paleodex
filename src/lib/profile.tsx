// The user's profile, kept on this device: their name, birth date and picture, favourite pages, the
// pages they viewed most recently, and their display and accessibility settings.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { type CustomTheme, DEFAULT_CUSTOM, type PaperStyle } from '@/lib/theme';
import { yearToMa } from '@/lib/time';

// A page in the information section: a species, a group, or an event (formation, trackway...).
export type PageRef = { kind: 'species' | 'clade' | 'event'; id: string };
// A picture of one of their favourite species, or a photo they chose from their device.
export type Avatar = { kind: 'species'; id: string } | { kind: 'upload'; uri: string } | null;
export type Theme = 'system' | 'light' | 'dark' | 'custom' | 'paper';
export type TextSize = 'normal' | 'large' | 'larger';
export type Settings = { theme: Theme; textSize: TextSize; highContrast: boolean; reduceMotion: boolean; custom: CustomTheme; paper: PaperStyle };
export type Profile = {
  name: string;
  // 'YYYY-MM-DD', or null if they haven't set one.
  birthDate: string | null;
  avatar: Avatar;
  favourites: PageRef[];
  // Most recent first.
  recent: PageRef[];
  settings: Settings;
};
// Something another screen (e.g. the profile) asks the main screen to show when it returns to it.
export type OpenRequest = { kind: 'page'; page: PageRef } | { kind: 'time'; ma: number };

export const RECENT_LIMIT = 10;
export const TEXT_SCALE: Record<TextSize, number> = { normal: 1, large: 1.15, larger: 1.3 };

const STORAGE_KEY = 'paleodex.profile.v1';
const DEFAULT: Profile = {
  name: '',
  birthDate: null,
  avatar: null,
  favourites: [],
  recent: [],
  settings: { theme: 'system', textSize: 'normal', highContrast: false, reduceMotion: false, custom: DEFAULT_CUSTOM, paper: 'mixed' },
};

const samePage = (a: PageRef, b: PageRef) => a.kind === b.kind && a.id === b.id;

type ProfileContext = {
  profile: Profile;
  update: (changes: Partial<Omit<Profile, 'settings'>>) => void;
  updateSettings: (changes: Partial<Settings>) => void;
  isFavourite: (page: PageRef) => boolean;
  toggleFavourite: (page: PageRef) => void;
  addRecent: (page: PageRef) => void;
  clearRecent: () => void;
  // Reduce motion is on if the user turned it on here or in their device's settings.
  reduceMotion: boolean;
  request: OpenRequest | null;
  setRequest: (r: OpenRequest | null) => void;
};

const Context = createContext<ProfileContext | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT);
  const [request, setRequest] = useState<OpenRequest | null>(null);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const loaded = useRef(false);

  // Load the saved profile once; storage can be unavailable (e.g. private browsing), so fall back
  // to the defaults.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<Profile>;
        setProfile({ ...DEFAULT, ...saved, settings: { ...DEFAULT.settings, ...saved.settings } });
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  // Save every change after the first load.
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch(() => {});
  }, [profile]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setSystemReduceMotion)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReduceMotion);
    return () => sub.remove();
  }, []);

  const update = useCallback((changes: Partial<Omit<Profile, 'settings'>>) => setProfile((p) => ({ ...p, ...changes })), []);
  const updateSettings = useCallback(
    (changes: Partial<Settings>) => setProfile((p) => ({ ...p, settings: { ...p.settings, ...changes } })),
    [],
  );
  const isFavourite = useCallback((page: PageRef) => profile.favourites.some((f) => samePage(f, page)), [profile.favourites]);
  const toggleFavourite = useCallback(
    (page: PageRef) =>
      setProfile((p) => ({
        ...p,
        favourites: p.favourites.some((f) => samePage(f, page)) ? p.favourites.filter((f) => !samePage(f, page)) : [page, ...p.favourites],
      })),
    [],
  );
  const addRecent = useCallback(
    (page: PageRef) =>
      setProfile((p) => {
        if (p.recent[0] && samePage(p.recent[0], page)) return p;
        return { ...p, recent: [page, ...p.recent.filter((r) => !samePage(r, page))].slice(0, RECENT_LIMIT) };
      }),
    [],
  );
  const clearRecent = useCallback(() => setProfile((p) => ({ ...p, recent: [] })), []);

  const value = useMemo(
    () => ({
      profile,
      update,
      updateSettings,
      isFavourite,
      toggleFavourite,
      addRecent,
      clearRecent,
      reduceMotion: profile.settings.reduceMotion || systemReduceMotion,
      request,
      setRequest,
    }),
    [profile, update, updateSettings, isFavourite, toggleFavourite, addRecent, clearRecent, systemReduceMotion, request],
  );
  return <Context value={value}>{children}</Context>;
}

export function useProfile(): ProfileContext {
  const ctx = use(Context);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

// How much to enlarge text, from the text size setting.
export function useTextScale(): number {
  return TEXT_SCALE[useProfile().profile.settings.textSize];
}

// A birth date as a Date, if it is set and valid.
export function birthDateOf(profile: Profile): Date | null {
  if (!profile.birthDate) return null;
  const d = new Date(`${profile.birthDate}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// The birth date as a time on the timeline (in millions of years ago), if set.
export function birthMaOf(profile: Profile): number | undefined {
  const d = birthDateOf(profile);
  if (!d) return undefined;
  const start = new Date(d.getFullYear(), 0, 1).getTime();
  const fraction = (d.getTime() - start) / (365.25 * 24 * 3600 * 1000);
  return yearToMa(d.getFullYear() + fraction);
}
