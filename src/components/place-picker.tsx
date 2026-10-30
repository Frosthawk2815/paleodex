import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { makePlace, nearestCity, searchCities, type UserPlace } from '@/lib/user-places';

// Choose a place by searching for a town or city, or from the device's location (read once, only
// when tapped). Shows the chosen place with a button to remove it.
export function PlacePicker({ label, value, onChange }: { label: string; value: UserPlace | null; onChange: (p: UserPlace | null) => void }) {
  const st = useProfileStyles();
  const palette = usePalette();
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const results = useMemo(() => searchCities(query), [query]);

  const useLocation = async () => {
    setBusy(true);
    setMessage('');
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        setMessage('PaleoDex needs your location for this. You can allow it in your device’s settings, or search for a town instead.');
        return;
      }
      const pos = await getCurrentPositionAsync({ accuracy: Accuracy.Balanced });
      onChange(makePlace(nearestCity(pos.coords.latitude, pos.coords.longitude), pos.coords.latitude, pos.coords.longitude));
      setQuery('');
    } catch {
      setMessage('Your location couldn’t be found. Try again, or search for a town instead.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      {value ? (
        <View style={[st.card, st.row]}>
          <View style={st.rowText}>
            <Text style={st.rowTitle}>{value.label}</Text>
          </View>
          <Pressable onPress={() => onChange(null)} accessibilityRole="button" accessibilityLabel={`Remove your ${label.toLowerCase()}`} hitSlop={8}>
            <Text style={[st.link, { color: palette.badge }]}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={st.muted}>Not set.</Text>
      )}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={value ? 'Search to change it…' : 'Search for a town or city…'}
        placeholderTextColor={palette.muted}
        autoCorrect={false}
        style={st.input}
        accessibilityLabel={`Search for your ${label.toLowerCase()}`}
      />
      {results.length > 0 && (
        <View style={st.card}>
          {results.map((r, i) => (
            <View key={`${r.label}${i}`}>
              {i > 0 && <View style={st.divider} />}
              <Pressable
                onPress={() => {
                  onChange(makePlace(r.label, r.lat, r.lon));
                  setQuery('');
                }}
                accessibilityRole="button"
                style={({ pressed }) => [st.row, pressed && st.pressed]}>
                <Text style={st.rowTitle}>{r.label}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {query.trim().length >= 2 && results.length === 0 && <Text style={st.muted}>No town found. Try a nearby larger town.</Text>}
      <Pressable onPress={useLocation} disabled={busy} accessibilityRole="button" hitSlop={6}>
        <Text style={st.link}>{busy ? 'Finding you…' : '📍 Use where I am now'}</Text>
      </Pressable>
      {!!message && <Text style={st.muted}>{message}</Text>}
    </View>
  );
}
