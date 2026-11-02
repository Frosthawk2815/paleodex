import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { useProfile } from '@/lib/profile';
import { TITLES } from '@/lib/titles';
import { useT } from '@/lib/i18n';

// Every title: the earned ones can be chosen to show under the user's name; locked ones say how
// to earn them (secret ones only hint).
export default function TitlesScreen() {
  const st = useProfileStyles();
  const t = useT();
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
        {t('Earn titles by exploring. Choose one of yours to show under your name. {n} of {total} earned.', { n: earned.length, total: TITLES.length })}
      </Text>

      <Text style={st.heading}>{t('Your titles')}</Text>
      {earned.length === 0 ? (
        <Text style={st.muted}>{t('None yet. Open a page to earn your first.')}</Text>
      ) : (
        <View style={st.card} accessibilityRole="radiogroup">
          {earned.map((ti, i) => {
            const on = profile.title === ti.id;
            return (
              <View key={ti.id}>
                {i > 0 && <View style={st.divider} />}
                <Pressable
                  onPress={() => update({ title: on ? null : ti.id })}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityHint={on ? t('Tap to stop showing this title') : t('Tap to show this title under your name')}
                  style={({ pressed }) => [st.row, pressed && st.pressed]}>
                  <Text style={{ fontSize: 22 }}>{ti.level !== undefined ? '⭐' : '🏆'}</Text>
                  <View style={st.rowText}>
                    <Text style={st.rowTitle}>{ti.level !== undefined ? t(ti.name) : ti.name}</Text>
                    <Text style={st.rowSub}>{t(ti.reveal ?? ti.hint.replace(/^A secret\. /, ''))}</Text>
                  </View>
                  <Text style={[st.rowSub, on && { color: palette.link, fontWeight: '700' }]}>{on ? t('Showing ✓') : t('Show')}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {(locked.length > 0 || hiddenLeft > 0) && (
        <>
          <Text style={st.heading}>{t('Still to earn')}</Text>
          <View style={st.card}>
            {locked.map((ti, i) => (
              <View key={ti.id}>
                {i > 0 && <View style={st.divider} />}
                <View style={st.row} accessible accessibilityLabel={t('Locked: {name}. {hint}', { name: ti.hint.startsWith('A secret') ? t('secret title') : ti.level !== undefined ? t(ti.name) : ti.name, hint: t(ti.hint) })}>
                  <Text style={{ fontSize: 22, opacity: 0.6 }}>🔒</Text>
                  <View style={st.rowText}>
                    <Text style={[st.rowTitle, { color: palette.muted }]}>{ti.hint.startsWith('A secret') ? '???' : ti.level !== undefined ? t(ti.name) : ti.name}</Text>
                    <Text style={st.rowSub}>{t(ti.hint)}</Text>
                  </View>
                </View>
              </View>
            ))}
            {hiddenLeft > 0 && (
              <View>
                {locked.length > 0 && <View style={st.divider} />}
                <View style={st.row} accessible accessibilityLabel={t('{n} secret titles still to find', { n: hiddenLeft })}>
                  <Text style={{ fontSize: 22, opacity: 0.6 }}>🔒</Text>
                  <View style={st.rowText}>
                    <Text style={[st.rowTitle, { color: palette.muted }]}>
                      {hiddenLeft === 1 ? t('1 secret title still to find') : t('{n} secret titles still to find', { n: hiddenLeft })}
                    </Text>
                    <Text style={st.rowSub}>{t('No clues: they turn up as you explore.')}</Text>
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
