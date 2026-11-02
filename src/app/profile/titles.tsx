import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { useProfile } from '@/lib/profile';
import { TITLES } from '@/lib/titles';

// Every title: the earned ones can be chosen to show under the user's name; locked ones say how
// to earn them (secret ones only hint).
export default function TitlesScreen() {
  const st = useProfileStyles();
  const palette = usePalette();
  const { profile, update } = useProfile();
  const earned = TITLES.filter((t) => profile.titles.includes(t.id));
  const lockedAll = TITLES.filter((t) => !profile.titles.includes(t.id));
  // Fully secret titles are not listed until earned; only how many are left is shown.
  const locked = lockedAll.filter((t) => !t.hidden);
  const hiddenLeft = lockedAll.length - locked.length;

  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.muted}>
        Earn titles by exploring. Choose one of yours to show under your name. {earned.length} of {TITLES.length} earned.
      </Text>

      <Text style={st.heading}>Your titles</Text>
      {earned.length === 0 ? (
        <Text style={st.muted}>None yet. Open a page to earn your first.</Text>
      ) : (
        <View style={st.card} accessibilityRole="radiogroup">
          {earned.map((t, i) => {
            const on = profile.title === t.id;
            return (
              <View key={t.id}>
                {i > 0 && <View style={st.divider} />}
                <Pressable
                  onPress={() => update({ title: on ? null : t.id })}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityHint={on ? 'Tap to stop showing this title' : 'Tap to show this title under your name'}
                  style={({ pressed }) => [st.row, pressed && st.pressed]}>
                  <Text style={{ fontSize: 22 }}>{t.level !== undefined ? '⭐' : '🏆'}</Text>
                  <View style={st.rowText}>
                    <Text style={st.rowTitle}>{t.name}</Text>
                    <Text style={st.rowSub}>{t.reveal ?? t.hint.replace(/^A secret\. /, '')}</Text>
                  </View>
                  <Text style={[st.rowSub, on && { color: palette.link, fontWeight: '700' }]}>{on ? 'Showing ✓' : 'Show'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {(locked.length > 0 || hiddenLeft > 0) && (
        <>
          <Text style={st.heading}>Still to earn</Text>
          <View style={st.card}>
            {locked.map((t, i) => (
              <View key={t.id}>
                {i > 0 && <View style={st.divider} />}
                <View style={st.row} accessible accessibilityLabel={`Locked: ${t.hint.startsWith('A secret') ? 'secret title' : t.name}. ${t.hint}`}>
                  <Text style={{ fontSize: 22, opacity: 0.6 }}>🔒</Text>
                  <View style={st.rowText}>
                    <Text style={[st.rowTitle, { color: palette.muted }]}>{t.hint.startsWith('A secret') ? '???' : t.name}</Text>
                    <Text style={st.rowSub}>{t.hint}</Text>
                  </View>
                </View>
              </View>
            ))}
            {hiddenLeft > 0 && (
              <View>
                {locked.length > 0 && <View style={st.divider} />}
                <View style={st.row} accessible accessibilityLabel={`${hiddenLeft} secret titles still to find`}>
                  <Text style={{ fontSize: 22, opacity: 0.6 }}>🔒</Text>
                  <View style={st.rowText}>
                    <Text style={[st.rowTitle, { color: palette.muted }]}>
                      {hiddenLeft} secret title{hiddenLeft === 1 ? '' : 's'} still to find
                    </Text>
                    <Text style={st.rowSub}>No clues: they turn up as you explore.</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
