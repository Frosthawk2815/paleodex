import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { type TextSize, type Theme, useProfile } from '@/lib/profile';

// A row of options where one is chosen.
function Choice<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const st = useProfileStyles();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="radiogroup">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            style={({ pressed }) => [st.chip, on && st.chipOn, pressed && st.pressed]}>
            <Text style={[st.chipText, on && st.chipTextOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// A setting that is on or off.
function Toggle({ label, detail, value, onChange }: { label: string; detail: string; value: boolean; onChange: (v: boolean) => void }) {
  const st = useProfileStyles();
  return (
    <View style={st.row}>
      <View style={st.rowText}>
        <Text style={st.rowTitle}>{label}</Text>
        <Text style={st.rowSub}>{detail}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

// Theme, text size and accessibility settings.
export default function SettingsScreen() {
  const st = useProfileStyles();
  const { profile, updateSettings } = useProfile();
  const s = profile.settings;
  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.heading}>Appearance</Text>
      <Choice<Theme>
        options={[
          { value: 'system', label: 'Match device' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        value={s.theme}
        onChange={(theme) => updateSettings({ theme })}
      />
      <Text style={st.muted}>Applies to menus and secondary pages. The globe screen stays dark, like the night sky.</Text>

      <Text style={st.heading}>Text size</Text>
      <Choice<TextSize>
        options={[
          { value: 'normal', label: 'Normal' },
          { value: 'large', label: 'Large' },
          { value: 'larger', label: 'Larger' },
        ]}
        value={s.textSize}
        onChange={(textSize) => updateSettings({ textSize })}
      />
      <Text style={st.muted}>Enlarges species, group and formation pages and these menus. PaleoDex also follows your device’s text size.</Text>

      <Text style={st.heading}>Accessibility</Text>
      <View style={st.card}>
        <Toggle
          label="High contrast"
          detail="Stronger text and borders on menus and secondary pages."
          value={s.highContrast}
          onChange={(highContrast) => updateSettings({ highContrast })}
        />
        <View style={st.divider} />
        <Toggle
          label="Reduce motion"
          detail="Jump straight to places and times instead of animating. Also on if your device asks for reduced motion."
          value={s.reduceMotion}
          onChange={(reduceMotion) => updateSettings({ reduceMotion })}
        />
      </View>
    </ScrollView>
  );
}
