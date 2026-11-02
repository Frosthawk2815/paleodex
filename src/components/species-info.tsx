import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { PointIcon } from '@/components/point-icon';
import type { HistoryEvent } from '@/data/events';
import type { Species } from '@/data/life';
import { SpeciesRow } from '@/components/clade-info';
import { CladeCrumbs } from '@/components/clade-crumbs';
import { SpeciesImage } from '@/components/species-image';
import { AddPhotoButton } from '@/components/user-photo-gallery';
import { cladePath, eventById, familyOf, formationById, pastPointIndex, relativesOf, speciesById, trackwaysOf } from '@/lib/life';
import { badgeBg } from '@/lib/events';
import { rangeOf } from '@/lib/ranges';
import { nameMeaning, nameMeaningText } from '@/lib/names';
import { useUnitText } from '@/lib/profile';
import { timeLabel } from '@/lib/time';
import { localTime, useT } from '@/lib/i18n';
import { useLocalized } from '@/lib/content';

type Props = {
  species: Species;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
  onOpenClade: (id: string) => void;
  onOpenSpecies: (id: string) => void;
  // Open a formation's or event's page, moving the timeline and globe to one of its points.
  onOpenEvent: (event: HistoryEvent, index: number) => void;
  backLabel?: string;
  // For modern species: show one phase of the range on the globe, or the last sighting.
  // Globe actions; left out when the page is read away from the globe (e.g. from the quiz).
  onJumpRange?: (index: number) => void;
  onJumpLastSeen?: () => void;
};

// The information section for a species: what it was and the formations it's found in.
export function SpeciesInfo({ species: speciesEn, onBack, onPrevious, previousLabel, onOpenClade, onOpenSpecies, onOpenEvent, onJumpRange, onJumpLastSeen, backLabel }: Props) {
  const info = useInfoStyles();
  const t = useT();
  const u = useUnitText();
  // The page's text in the user's language where it has been translated.
  const species = useLocalized(`species:${speciesEn.id}`, speciesEn);
  const meaning = nameMeaning(species);
  const [tab, setTab] = useState<'about' | 'relatives'>('about');
  const path = cladePath(species.clade);
  const family = familyOf(species);
  const relatives = relativesOf(species);
  const formations = species.formations.map(formationById).filter((f): f is HistoryEvent => f !== undefined);
  // Events it is linked to, plus trackways it made (without repeats).
  const events = [...(species.events ?? []).map(eventById), ...trackwaysOf(species.id)]
    .filter((e): e is HistoryEvent => e !== undefined)
    .filter((e, i, all) => all.findIndex((o) => o.id === e.id) === i);
  const range = rangeOf(species.id);
  // Living species list where they live today first, then their earlier ranges, newest first.
  const phaseOrder = range ? range.phases.map((p, i) => ({ p, i })) : [];
  if (phaseOrder.some(({ p }) => p.toMa === 0)) phaseOrder.reverse();

  return (
    <View style={info.wrap}>
      <InfoNav onBack={onBack} onPrevious={onPrevious} previousLabel={previousLabel} backLabel={backLabel} page={{ kind: 'species', id: species.id }} />

      <SpeciesImage speciesId={species.id} name={species.name} />

      <Text style={info.kicker}>{species.status === 'full' ? t('Species') : t('Species · short entry')}</Text>
      <Text style={[info.title, info.italic]} accessibilityRole="header">
        {species.name}
      </Text>
      {!!species.common && <Text style={info.subtitle}>{species.common}</Text>}
      {meaning && <Text style={info.meta}>Name means: {nameMeaningText(meaning)}</Text>}
      {!!meaning?.notes.length && <Text style={info.note}>{meaning.notes.join(' ')}</Text>}
      {!!species.aka?.length && <Text style={info.meta}>Also called {species.aka.join(', ')}</Text>}
      {!!species.akaNote && <Text style={info.note}>{species.akaNote}</Text>}

      <CladeCrumbs path={path} onOpenClade={onOpenClade} />

      <Text style={info.meta}>{species.ageText}</Text>
      <Text style={info.meta}>{species.placeText}</Text>

      {relatives.length > 0 && (
        <View style={info.tabs} accessibilityRole="tablist">
          {(['about', 'relatives'] as const).map((k) => (
            <Pressable
              key={k}
              onPress={() => setTab(k)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === k }}
              style={[info.tab, tab === k && info.tabOn]}>
              <Text style={[info.tabText, tab === k && info.tabTextOn]}>
                {k === 'about' ? t('About') : t('Relatives ({n})', { n: relatives.length })}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {tab === 'relatives' && relatives.length > 0 ? (
        <>
          <Text style={info.note}>
            {t('The rest of the {family}, closest relatives first. The order is approximate: their family tree is still debated.', { family: family?.common.toLowerCase() ?? '' })}
          </Text>
          <View style={info.list}>
            {relatives.map((r) => (
              <SpeciesRow key={r.id} species={r} onPress={() => onOpenSpecies(r.id)} />
            ))}
          </View>
        </>
      ) : (
        <>
          {formations.length > 0 && (
            <>
              <Text style={info.heading}>{t('Found in')}</Text>
              {formations.map((f) => {
                const index = pastPointIndex(f);
                const point = f.points[index];
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => onOpenEvent(f, index)}
                    accessibilityRole="button"
                    accessibilityLabel={`${f.title}: ${t('read more')}`}
                    style={({ pressed }) => [info.card, pressed && info.pressed]}>
                    <View style={info.cardRow}>
                      <PointIcon kind={point.icon ?? 'flag'} size={28} bg={badgeBg(f, point)} />
                      <View style={info.cardText}>
                        <Text style={info.cardTitle}>{f.title} ›</Text>
                        <Text style={info.cardNote}>{point.jumpLabel}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </>
          )}

          {range?.lastSeen && (
            <>
              <Text style={info.heading}>{t('Last seen alive')}</Text>
              <Pressable
                onPress={onJumpLastSeen}
                disabled={!onJumpLastSeen}
                accessibilityRole={onJumpLastSeen ? 'button' : 'text'}
                accessibilityLabel={`${range.lastSeen.text}: ${t('show on the globe')}`}
                style={({ pressed }) => [info.card, pressed && info.pressed]}>
                <View style={info.cardRow}>
                  <PointIcon kind="skull" size={30} />
                  <View style={info.cardText}>
                    <Text style={info.cardTitle}>{range.lastSeen.text}{onJumpLastSeen ? ' ›' : ''}</Text>
                    {onJumpLastSeen && <Text style={info.cardNote}>{t('The skull marker shows on the globe up to that date')}</Text>}
                  </View>
                </View>
              </Pressable>
            </>
          )}

          {range && (
            <>
              <Text style={info.heading}>{phaseOrder.length > 1 ? t('Range over time') : t('Range')}</Text>
              <Text style={info.note}>
                {!onJumpRange ? '' : phaseOrder.length > 1 ? `${t('Tap a stage to see it shaded on the globe.')} ` : `${t('Tap to see it shaded on the globe.')} `}
                {t('Ranges are approximate.')}
              </Text>
              {phaseOrder.map(({ p, i }) => (
                <Pressable
                  key={p.label}
                  onPress={() => onJumpRange?.(i)}
                  disabled={!onJumpRange}
                  accessibilityRole={onJumpRange ? 'button' : 'text'}
                  accessibilityLabel={`${p.label}: ${t('show on the globe')}`}
                  style={({ pressed }) => [info.card, pressed && info.pressed]}>
                  <View style={info.cardRow}>
                    <View style={styles.swatch} />
                    <View style={info.cardText}>
                      <Text style={info.cardTitle}>{p.label}{onJumpRange ? ' ›' : ''}</Text>
                      <Text style={info.cardNote}>
                        {t('{from} to {to}', { from: localTime(timeLabel(p.fromMa), t), to: p.toMa > 0 ? localTime(timeLabel(p.toMa), t) : t('today') })}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {events.length > 0 && (
            <>
              <Text style={info.heading}>{t('Events')}</Text>
              {events.map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => onOpenEvent(e, 0)}
                  accessibilityRole="button"
                  accessibilityLabel={`${e.title}: ${t('read more')}`}
                  style={({ pressed }) => [info.card, pressed && info.pressed]}>
                  <View style={info.cardRow}>
                    <PointIcon kind={e.points[0].icon ?? 'flag'} size={28} bg={badgeBg(e, e.points[0])} />
                    <View style={info.cardText}>
                      <Text style={info.cardTitle}>{e.title} ›</Text>
                      <Text style={info.cardNote}>{e.points[0].jumpLabel}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {species.summary.map((p) => (
            <Text key={p} style={info.body}>
              {u(p)}
            </Text>
          ))}

          {species.related && species.related.length > 0 && (
            <>
              <Text style={info.heading}>{t('Related forms')}</Text>
              <View style={info.list}>
                {species.related.map((r) => {
                  const other = speciesById(r.id);
                  return other ? (
                    <View key={r.id}>
                      <SpeciesRow species={other} onPress={() => onOpenSpecies(r.id)} />
                      <Text style={[info.rowNote, styles.relatedNote]}>{u(r.note)}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </>
          )}

          {species.facts && (
            <View style={info.facts}>
              {species.facts
                // A "Name means" fact is replaced by the translation under the name.
                .filter((f) => !(meaning && /^name means$/i.test(f.label)))
                .map((f) => (
                  <View key={f.label} style={info.factRow}>
                    <Text style={info.factLabel}>{f.label}</Text>
                    <Text style={info.factValue}>{u(f.value)}</Text>
                  </View>
                ))}
            </View>
          )}

          {species.status === 'brief' && (
            <Text style={[info.note, { marginTop: 12 }]}>{t('A full entry for this species is still to come.')}</Text>
          )}
        </>
      )}

      <AddPhotoButton speciesId={species.id} name={species.common || species.name} />
    </View>
  );
}

const styles = StyleSheet.create({
  relatedNote: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginTop: -6,
  },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,112,67,0.6)',
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
});
