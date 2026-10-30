import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PlacePicker } from '@/components/place-picker';
import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { formatDistance, MUSEUM_AND_ZOO_LIST, type Place, placeById, placesNear } from '@/lib/places';
import { useProfile } from '@/lib/profile';
import { TITLES } from '@/lib/titles';

const ICON: Record<Place['kind'], string> = { museum: '🏛️', zoo: '🦒', site: '⛏️' };
const KIND: Record<Place['kind'], string> = { museum: 'Natural history museum', zoo: 'Accredited zoo', site: 'Fossil site' };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

type Result = { here: Place[]; nearest: { place: Place; metres: number }[] } | { error: string };

// Checking in at museums, zoos and fossil sites in person. The location is read once, only when
// the user taps Check in, and is not stored or sent anywhere: only the places they were at are
// saved.
export default function PlacesScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const checkIn = async () => {
    setBusy(true);
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        setResult({ error: 'PaleoDex needs your location to check you in. You can allow it in your device’s settings.' });
        return;
      }
      const pos = await getCurrentPositionAsync({ accuracy: Accuracy.High });
      const { here, nearest } = placesNear(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      const ids = here.map((h) => h.place.id).filter((id) => !profile.places.includes(id));
      if (ids.length) update({ places: [...profile.places, ...ids] });
      setResult({ here: here.map((h) => h.place), nearest });
    } catch {
      setResult({ error: 'Your location couldn’t be found. Check that location is turned on and try again.' });
    } finally {
      setBusy(false);
    }
  };

  // Deletes the visited places, and if asked, the titles earned by visiting places.
  const deletePlaces = (withTitles: boolean) => {
    if (withTitles) {
      const placeTitles = new Set(TITLES.filter((x) => x.inPerson).map((x) => x.id));
      update({
        places: [],
        titles: profile.titles.filter((id) => !placeTitles.has(id)),
        title: profile.title && placeTitles.has(profile.title) ? null : profile.title,
      });
    } else {
      update({ places: [] });
    }
    setConfirmDelete(false);
    setResult(null);
  };

  const visited = profile.places.map(placeById).filter((p): p is Place => !!p);
  const counts = (kind: Place['kind']) => visited.filter((p) => p.kind === kind).length;
  const byCountry = useMemo(() => {
    const m = new Map<string, Place[]>();
    for (const p of MUSEUM_AND_ZOO_LIST) m.set(p.country ?? '', [...(m.get(p.country ?? '') ?? []), p]);
    return [...m].sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <View style={[st.card, { padding: 14, gap: 4 }]}>
        <Text style={st.rowTitle}>🔒 Your location stays with you</Text>
        <Text style={st.rowSub}>
          I don’t collect, store or sell your location data. Your location is read only when you tap a location button, and it never leaves your device.
          Your birthplace, your home and the places you’ve visited are kept only on this device, and you can delete them at any time, keeping or removing
          the titles they earned.
        </Text>
      </View>

      <Text style={st.heading}>Place of birth</Text>
      <Text style={st.muted}>Your birthplace and home appear on the globe with your profile picture, and travel with the continents through time.</Text>
      <PlacePicker label="Place of birth" value={profile.birthplace} onChange={(birthplace) => update({ birthplace })} />

      <Text style={st.heading}>Where you live now</Text>
      <PlacePicker label="Home" value={profile.home} onChange={(home) => update({ home })} />

      <Text style={st.heading}>Where you are now</Text>
      <Text style={st.text}>
        Visiting a natural history museum, an accredited zoo or one of the fossil sites in PaleoDex? Check in while you’re there to earn titles.
      </Text>
      <Pressable
        onPress={checkIn}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        style={({ pressed }) => [st.button, pressed && st.pressed, busy && { opacity: 0.6 }]}>
        <Text style={st.buttonText}>{busy ? 'Finding you…' : '📍 Check in here'}</Text>
      </Pressable>

      {result && 'error' in result && <Text style={st.muted}>{result.error}</Text>}
      {result && 'here' in result && (
        <View style={[st.card, { padding: 14, gap: 6 }]} accessibilityLiveRegion="polite">
          {result.here.length > 0 ? (
            result.here.map((p) => (
              <Text key={p.id} style={st.rowTitle}>
                {ICON[p.kind]} You’re at {p.name}{p.spot ? ` (${p.spot})` : ''}!
              </Text>
            ))
          ) : (
            <Text style={st.rowTitle}>No museum, zoo or fossil site here yet.</Text>
          )}
          <Text style={[st.rowSub, { marginTop: 4 }]}>Nearest to you:</Text>
          {result.nearest.map(({ place, metres }) => (
            <Text key={place.id} style={st.rowSub}>
              {ICON[place.kind]} {place.name}
              {place.spot ? ` (${place.spot})` : ''} · {formatDistance(metres)}
            </Text>
          ))}
        </View>
      )}


      <View style={[st.card, { padding: 14, gap: 4 }]}>
        <Text style={st.rowTitle}>⚠️ Stay safe</Text>
        <Text style={st.rowSub}>
          I don’t want to encourage you to put yourself in danger. Formations that aren’t publicly accessible, are in very remote areas or are in conflict
          zones don’t award titles. Please leave those to the professionals who make all of this possible.
        </Text>
        <Text style={st.rowSub}>
          You don’t need to reach the rocks themselves: you’re checked in anywhere within 25 km of a fossil site, so the nearest town or visitor centre is
          enough. Only visit places open to the public, never enter quarries, mines or private land without permission, and check the tides at coastal sites.
        </Text>
      </View>


      <Text style={st.heading}>Places you’ve visited</Text>
      <Text style={st.muted}>
        {plural(counts('museum'), 'museum')} · {plural(counts('zoo'), 'zoo')} · {plural(counts('site'), 'fossil site')}
      </Text>
      {visited.length > 0 && (
        <View style={st.card}>
          {visited.map((p, i) => (
            <View key={p.id}>
              {i > 0 && <View style={st.divider} />}
              <View style={st.row}>
                <Text style={{ fontSize: 22 }}>{ICON[p.kind]}</Text>
                <View style={st.rowText}>
                  <Text style={st.rowTitle}>{p.name}</Text>
                  <Text style={st.rowSub}>{[KIND[p.kind], p.country].filter(Boolean).join(' · ')}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {visited.length > 0 && !confirmDelete && (
        <Pressable onPress={() => setConfirmDelete(true)} accessibilityRole="button" hitSlop={6}>
          <Text style={[st.link, { color: palette.badge }]}>Delete my visited places</Text>
        </Pressable>
      )}
      {confirmDelete && (
        <View style={[st.card, { padding: 14, gap: 10 }]}>
          <Text style={st.rowTitle}>Delete your visited places?</Text>
          <Text style={st.rowSub}>Choose whether to keep the titles you earned by visiting them.</Text>
          <Pressable onPress={() => deletePlaces(false)} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
            <Text style={st.buttonText}>Delete places, keep my titles</Text>
          </Pressable>
          <Pressable
            onPress={() => deletePlaces(true)}
            accessibilityRole="button"
            style={({ pressed }) => [st.button, { backgroundColor: '#B3261E' }, pressed && st.pressed]}>
            <Text style={st.buttonText}>Delete places and their titles</Text>
          </Pressable>
          <Pressable onPress={() => setConfirmDelete(false)} accessibilityRole="button" hitSlop={6} style={{ alignSelf: 'center' }}>
            <Text style={st.link}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {MUSEUM_AND_ZOO_LIST.length > 0 && (
      <Pressable onPress={() => setShowAll((v) => !v)} accessibilityRole="button" accessibilityState={{ expanded: showAll }} hitSlop={6}>
        <Text style={st.link}>{showAll ? 'Hide the museums and zoos ▲' : `See all ${MUSEUM_AND_ZOO_LIST.length} museums and zoos ▼`}</Text>
      </Pressable>
      )}
      {showAll &&
        byCountry.map(([country, list]) => (
          <View key={country} style={{ gap: 4 }}>
            <Text style={st.rowTitle}>{country}</Text>
            {list.map((p) => (
              <Text key={p.id} style={[st.rowSub, profile.places.includes(p.id) && { color: palette.link }]}>
                {ICON[p.kind]} {p.name}
                {profile.places.includes(p.id) ? ' ✓' : ''}
              </Text>
            ))}
          </View>
        ))}
      {showAll && <Text style={st.muted}>Every fossil site in PaleoDex counts too: open a rock formation to see where it is.</Text>}
    </ScrollView>
  );
}
