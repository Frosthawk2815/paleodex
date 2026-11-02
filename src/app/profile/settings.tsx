import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { isDark } from '@/lib/colors';
import { type TextSize, type Theme, useProfile } from '@/lib/profile';
import { compatible, type CustomTheme, type PaperStyle, readableTextColors, resolveText, SWATCHES } from '@/lib/theme';
import type { Units } from '@/lib/units';
import { deviceLanguage, LANGUAGES, type LanguageSetting, useT } from '@/lib/i18n';

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
            aria-checked={on}
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

// Theme, text size, units and accessibility settings.
export default function SettingsScreen() {
  const st = useProfileStyles();
  const t = useT();
  const { profile, updateSettings } = useProfile();
  const s = profile.settings;
  return (
    <ScrollView style={st.screen} contentContainerStyle={st.content}>
      <Text style={st.heading}>{t('Language')}</Text>
      <Choice<LanguageSetting>
        options={[{ value: 'system', label: t('Match device') }, ...LANGUAGES.map((l) => ({ value: l.code, label: l.name }))]}
        value={s.language ?? 'system'}
        onChange={(language) => updateSettings({ language })}
      />
      <Text style={st.muted}>
        {t('Menus, buttons and screens. Species, group and formation write-ups are still in English for now.')}
        {(s.language ?? 'system') === 'system' ? ` ${t('Using: {language}.', { language: LANGUAGES.find((l) => l.code === deviceLanguage())!.name })}` : ''}
      </Text>

      <Text style={st.heading}>{t('Appearance')}</Text>
      <Choice<Theme>
        options={[
          { value: 'system', label: t('Match device') },
          { value: 'light', label: t('Light') },
          { value: 'dark', label: t('Dark') },
          { value: 'custom', label: t('Custom') },
          { value: 'paper', label: t('Paper') },
        ]}
        value={s.theme}
        onChange={(theme) => updateSettings({ theme })}
      />
      <Text style={st.muted}>{t('Applies to species, group and formation pages and these menus. The globe stays dark, like the night sky.')}</Text>
      {s.theme === 'custom' && <CustomColors />}
      {s.theme === 'paper' && (
        <View style={{ gap: 8, marginTop: 4 }}>
          <Choice<PaperStyle>
            options={[
              { value: 'mixed', label: t('Mixed') },
              { value: 'ancient', label: t('Ancient parchment') },
              { value: 'modern', label: t('Modern notebook') },
            ]}
            value={s.paper}
            onChange={(paper) => updateSettings({ paper })}
          />
          <Text style={st.muted}>
            {s.paper === 'mixed'
              ? t('Pages about prehistoric life look like old parchment written in a manuscript hand. Living animals and recent history look like a handwritten notebook, as do these menus.')
              : s.paper === 'ancient'
                ? t('Every page looks like old parchment, written in a manuscript hand.')
                : t('Every page looks like a lined notebook, written by hand.')}
          </Text>
        </View>
      )}

      <Text style={st.heading}>{t('Text size')}</Text>
      <Choice<TextSize>
        options={[
          { value: 'normal', label: t('Normal') },
          { value: 'large', label: t('Large') },
          { value: 'larger', label: t('Larger') },
        ]}
        value={s.textSize}
        onChange={(textSize) => updateSettings({ textSize })}
      />
      <Text style={st.muted}>{t('Enlarges species, group and formation pages and these menus. PaleoDex also follows your device’s text size.')}</Text>

      <Text style={st.heading}>{t('Units')}</Text>
      <Choice<Units>
        options={[
          { value: 'metric', label: t('Metric') },
          { value: 'imperial', label: t('Imperial') },
        ]}
        value={s.units}
        onChange={(units) => updateSettings({ units })}
      />
      <Text style={st.muted}>
        {s.units === 'metric'
          ? t('Sizes, weights and distances in metres, kilograms and kilometres.')
          : t('Sizes, weights and distances in feet, pounds and miles, converted from the metric figures and rounded, as most are estimates.')}
      </Text>

      <Text style={st.heading}>{t('Accessibility')}</Text>
      <View style={st.card}>
        <Toggle
          label={t('High contrast')}
          detail={t('Stronger text and borders on pages and menus. With custom colours, only the most readable text colours are offered.')}
          value={s.highContrast}
          onChange={(highContrast) => updateSettings({ highContrast })}
        />
        <View style={st.divider} />
        <Toggle
          label={t('Reduce motion')}
          detail={t('Jump straight to places and times instead of animating. Also on if your device asks for reduced motion.')}
          value={s.reduceMotion}
          onChange={(reduceMotion) => updateSettings({ reduceMotion })}
        />
      </View>
    </ScrollView>
  );
}

// A grid of colours, each in a lighter and a darker variant. Colours that would make text hard to
// read are shown faded and can't be chosen.
function SwatchPicker({ label, value, onChange, allowed }: { label: string; value: string; onChange: (c: string) => void; allowed: (c: string) => boolean }) {
  const st = useProfileStyles();
  const t = useT();
  const p = usePalette();
  return (
    <View style={{ gap: 6 }}>
      {(['light', 'dark'] as const).map((variant) => (
        <View key={variant} style={{ gap: 6 }}>
          <Text style={st.rowSub}>{variant === 'light' ? 'Lighter' : 'Darker'}</Text>
          <View style={styles.swatches}>
            {SWATCHES.map((sw) => {
              const c = sw[variant];
              const on = c === value;
              const ok = allowed(c);
              return (
                <Pressable
                  key={c}
                  onPress={() => ok && onChange(c)}
                  disabled={!ok}
                  accessibilityRole="radio"
                  accessibilityLabel={`${label}: ${t((variant === 'light' ? sw.lightName : sw.darkName) ?? `${variant} ${sw.name.toLowerCase()}`)}${ok ? '' : t(', not available with your other colours')}`}
                  accessibilityState={{ checked: on, disabled: !ok }}
                  aria-checked={on}
                  hitSlop={3}
                  style={({ pressed }) => [
                    styles.swatch,
                    { backgroundColor: c, borderColor: on ? p.link : p.border, borderWidth: on ? 3 : StyleSheet.hairlineWidth },
                    !ok && styles.unavailable,
                    pressed && st.pressed,
                  ]}>
                  {on && <Text style={{ color: isDark(c) ? '#FFFFFF' : '#000000', fontWeight: '800' }}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

// The user's own theme: background, panel and text colours, with a preview.
function CustomColors() {
  const st = useProfileStyles();
  const t = useT();
  const p = usePalette();
  const { profile, updateSettings } = useProfile();
  const { custom: c, highContrast } = profile.settings;
  const set = (changes: Partial<CustomTheme>) => updateSettings({ custom: { ...c, ...changes } });

  const setPrimary = (primary: string) => {
    if (compatible(primary, c.secondary, highContrast)) return set({ primary });
    // Keep the panel's colour but switch it to the variant that matches the new background.
    const sw = SWATCHES.find((x) => x.light === c.secondary || x.dark === c.secondary) ?? SWATCHES[0]!;
    set({ primary, secondary: isDark(primary) ? sw.dark : sw.light });
  };
  const textOptions = readableTextColors(c.primary, c.secondary, highContrast);
  const chosenText = resolveText(c, highContrast);
  const textChoices = [{ name: 'Automatic', color: 'auto' }, ...textOptions];

  return (
    <View style={{ gap: 12, marginTop: 4 }}>
      <Text style={st.rowTitle}>{t('Background')}</Text>
      <SwatchPicker label={t('Background')} value={c.primary} onChange={setPrimary} allowed={() => true} />

      <Text style={st.rowTitle}>{t('Panels and cards')}</Text>
      <SwatchPicker label={t('Panels')} value={c.secondary} onChange={(secondary) => set({ secondary })} allowed={(x) => compatible(c.primary, x, highContrast)} />
      <Text style={st.muted}>{t('Faded colours are too different from your background for any text to be readable on both.')}</Text>

      <Text style={st.rowTitle}>{t('Text')}</Text>
      <View style={styles.swatches} accessibilityRole="radiogroup">
        {textChoices.map((choice) => {
          const on = choice.color === 'auto' ? c.text === 'auto' || chosenText !== c.text : c.text === choice.color;
          const shown = choice.color === 'auto' ? resolveText({ ...c, text: 'auto' }, highContrast) : choice.color;
          return (
            <Pressable
              key={choice.name}
              onPress={() => set({ text: choice.color })}
              accessibilityRole="radio"
              accessibilityLabel={choice.color === 'auto' ? t('Automatic, the most readable text colour') : t('{colour} text', { colour: t(choice.name) })}
              accessibilityState={{ checked: on }}
            aria-checked={on}
              style={({ pressed }) => [
                styles.textChoice,
                { backgroundColor: c.primary, borderColor: on ? p.link : p.border, borderWidth: on ? 3 : StyleSheet.hairlineWidth },
                pressed && st.pressed,
              ]}>
              <Text style={{ color: shown, fontWeight: '700', fontSize: 15 }}>Aa</Text>
              <Text style={{ color: shown, fontSize: 12 }}>{t(choice.name)}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={st.muted}>
        {highContrast
          ? t('Only text colours that are easy to read on your background and panels are offered (with high contrast on, only the strongest). If you change your colours, text that would become hard to read switches to Automatic.')
          : t('Only text colours that are easy to read on your background and panels are offered. If you change your colours, text that would become hard to read switches to Automatic.')}
      </Text>

      <Text style={st.rowTitle}>{t('Preview')}</Text>
      <View style={[styles.preview, { backgroundColor: p.background, borderColor: p.border }]}>
        <Text style={{ color: p.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>{t('SPECIES')}</Text>
        <Text style={{ color: p.text, fontSize: 22, fontWeight: '800', fontStyle: 'italic' }}>Tyrannosaurus rex</Text>
        <Text style={{ color: p.muted, fontSize: 14 }}>{t('68 to 66 million years ago')}</Text>
        <View style={[styles.previewCard, { backgroundColor: p.card, borderColor: p.border }]}>
          <Text style={{ color: p.text, fontSize: 15 }}>{t('One of the largest meat-eating dinosaurs.')}</Text>
          <Text style={{ color: p.link, fontSize: 15, fontWeight: '600', marginTop: 4 }}>{t('Hell Creek Formation ›')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatch: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  unavailable: { opacity: 0.2 },
  textChoice: { minWidth: 72, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  preview: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 4 },
  previewCard: { borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, padding: 12, marginTop: 8 },
});
