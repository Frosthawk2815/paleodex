import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AvatarImage, useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { imageOf } from '@/lib/images';
import { speciesById } from '@/lib/life';
import { useProfile } from '@/lib/profile';

const pad = (n: number) => String(n).padStart(2, '0');

// A valid 'YYYY-MM-DD' date from day, month and year boxes, or null.
function toDate(day: string, month: string, year: string): string | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y) || y < 1900 || y > new Date().getFullYear()) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d || date > new Date()) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

// Change the user's name, birth date and profile picture.
export default function EditProfileScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const [y0, m0, d0] = profile.birthDate?.split('-') ?? ['', '', ''];
  const [day, setDay] = useState(d0 ? String(Number(d0)) : '');
  const [month, setMonth] = useState(m0 ? String(Number(m0)) : '');
  const [year, setYear] = useState(y0 ?? '');
  const [dateMessage, setDateMessage] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');

  // Favourite species that have a picture can be used as the profile picture.
  const pictures = profile.favourites.filter((f) => f.kind === 'species' && imageOf(f.id)).map((f) => f.id);

  const saveDate = () => {
    if (!day && !month && !year) {
      update({ birthDate: null });
      setDateMessage('Birth date removed.');
      return;
    }
    const date = toDate(day, month, year);
    if (!date) {
      setDateMessage('That doesn’t look like a real date. Check the day, month and year.');
      return;
    }
    update({ birthDate: date });
    setDateMessage('Saved. It’s marked on the timeline, and you can jump to it from your profile.');
  };

  const pickPhoto = async () => {
    setPhotoMessage('');
    try {
      const result = await launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset?.base64) {
        setPhotoMessage('That photo couldn’t be read. Try another one.');
        return;
      }
      // Kept as data in the saved profile, so it survives the app clearing its temporary files.
      update({ avatar: { kind: 'upload', uri: `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}` } });
    } catch {
      setPhotoMessage('Your photos couldn’t be opened. Check that PaleoDex is allowed to use your photos.');
    }
  };

  const dateBox = (value: string, onChange: (v: string) => void, label: string, placeholder: string, width: number) => (
    <View style={{ gap: 4 }}>
      <Text style={st.rowSub}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/\D/g, ''))}
        keyboardType="number-pad"
        maxLength={placeholder.length}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        accessibilityLabel={`Birth ${label.toLowerCase()}`}
        style={[st.input, { width }]}
      />
    </View>
  );

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <AvatarImage avatar={profile.avatar} name={profile.name} size={96} />
      </View>

      <Text style={st.heading}>Name</Text>
      <TextInput
        value={profile.name}
        onChangeText={(name) => update({ name })}
        placeholder="Your name"
        placeholderTextColor={palette.muted}
        accessibilityLabel="Your name"
        autoComplete="name"
        maxLength={40}
        style={st.input}
      />

      <Text style={st.heading}>Birth date</Text>
      <Text style={st.muted}>Optional. Marks the year you were born on the timeline. It stays on this device.</Text>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {dateBox(day, setDay, 'Day', 'DD', 64)}
        {dateBox(month, setMonth, 'Month', 'MM', 64)}
        {dateBox(year, setYear, 'Year', 'YYYY', 90)}
        <Pressable onPress={saveDate} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
          <Text style={st.buttonText}>Save date</Text>
        </Pressable>
      </View>
      {!!dateMessage && <Text style={st.muted}>{dateMessage}</Text>}
      {profile.birthDate && (
        <Pressable
          onPress={() => {
            setDay('');
            setMonth('');
            setYear('');
            update({ birthDate: null });
            setDateMessage('Birth date removed.');
          }}
          accessibilityRole="button"
          hitSlop={6}>
          <Text style={st.link}>Remove birth date</Text>
        </Pressable>
      )}

      <Text style={st.heading}>Profile picture</Text>
      <Pressable onPress={pickPhoto} accessibilityRole="button" style={({ pressed }) => [st.button, pressed && st.pressed]}>
        <Text style={st.buttonText}>Choose a photo from your device</Text>
      </Pressable>
      {!!photoMessage && <Text style={st.muted}>{photoMessage}</Text>}
      <Text style={st.muted}>
        {pictures.length > 0 ? 'Or use a picture of one of your favourite species:' : 'Star species with pictures to choose them as your profile picture here.'}
      </Text>
      {pictures.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {pictures.map((id) => {
            const on = profile.avatar?.kind === 'species' && profile.avatar.id === id;
            const s = speciesById(id);
            return (
              <Pressable
                key={id}
                onPress={() => update({ avatar: { kind: 'species', id } })}
                accessibilityRole="button"
                accessibilityLabel={`Use ${s?.common || s?.name} as your profile picture`}
                accessibilityState={{ selected: on }}
                style={({ pressed }) => [{ borderRadius: 40, borderWidth: 3, borderColor: on ? '#2F7DE1' : 'transparent' }, pressed && st.pressed]}>
                <Image source={{ uri: imageOf(id)!.thumb }} style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: palette.track }} contentFit="cover" />
              </Pressable>
            );
          })}
        </View>
      )}
      {profile.avatar && (
        <Pressable onPress={() => update({ avatar: null })} accessibilityRole="button" hitSlop={6}>
          <Text style={st.link}>Remove profile picture</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
