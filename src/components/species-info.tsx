import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { info } from '@/components/info-styles';
import { PointIcon } from '@/components/point-icon';
import type { HistoryEvent } from '@/data/events';
import type { Species } from '@/data/life';
import { SpeciesRow } from '@/components/clade-info';
import { cladePath, eventById, familyOf, formationById, pastPointIndex, relativesOf, speciesById, trackwaysOf } from '@/lib/life';
import { badgeBg } from '@/lib/events';
import { rangeOf } from '@/lib/ranges';
import { timeLabel } from '@/lib/time';

type Props = {
  species: Species;
  onBack: () => void;
  onOpenClade: (id: string) => void;
  onOpenSpecies: (id: string) => void;
  // Jump the timeline and globe to where a formation was laid down.
  onJump: (formation: HistoryEvent, index: number) => void;
  // For modern species: show one phase of the range on the globe, or the last sighting.
  onJumpRange: (index: number) => void;
  onJumpLastSeen: () => void;
};

// The information section for a species: what it was and the formations it's found in.
export function SpeciesInfo({ species, onBack, onOpenClade, onOpenSpecies, onJump, onJumpRange, onJumpLastSeen }: Props) {
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

  return (
    <View style={info.wrap}>
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [info.back, pressed && info.pressed]}>
        <Text style={info.backText}>↑ Back to the globe</Text>
      </Pressable>

      <Text style={info.kicker}>{species.status === 'full' ? 'Species' : 'Species · short entry'}</Text>
      <Text style={[info.title, info.italic]} accessibilityRole="header">
        {species.name}
      </Text>
      {species.common && <Text style={info.subtitle}>{species.common}</Text>}

      <View style={info.crumbs}>
        {path.map((c, i) => (
          <Fragment key={c.id}>
            {i > 0 && <Text style={info.crumbSep}> › </Text>}
            <Text onPress={() => onOpenClade(c.id)} style={info.crumb} accessibilityRole="button">
              {c.common}
            </Text>
          </Fragment>
        ))}
      </View>

      <Text style={info.meta}>{species.ageText}</Text>
      <Text style={info.meta}>{species.placeText}</Text>

      {relatives.length > 0 && (
        <View style={info.tabs} accessibilityRole="tablist">
          {(['about', 'relatives'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
              style={[info.tab, tab === t && info.tabOn]}>
              <Text style={[info.tabText, tab === t && info.tabTextOn]}>
                {t === 'about' ? 'About' : `Relatives (${relatives.length})`}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {tab === 'relatives' && relatives.length > 0 ? (
        <>
          <Text style={info.note}>
            The rest of the {family?.common.toLowerCase()}, closest relatives first. The order is approximate: their family tree
            is still debated.
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
              <Text style={info.heading}>Found in</Text>
              {formations.map((f) => {
                const index = pastPointIndex(f);
                const point = f.points[index];
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => onJump(f, index)}
                    accessibilityRole="button"
                    accessibilityLabel={`${f.title}: jump to where it formed`}
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
              <Text style={info.heading}>Last seen alive</Text>
              <Pressable
                onPress={onJumpLastSeen}
                accessibilityRole="button"
                accessibilityLabel={`${range.lastSeen.text}: show on the globe`}
                style={({ pressed }) => [info.card, pressed && info.pressed]}>
                <View style={info.cardRow}>
                  <PointIcon kind="skull" size={30} />
                  <View style={info.cardText}>
                    <Text style={info.cardTitle}>{range.lastSeen.text} ›</Text>
                    <Text style={info.cardNote}>The skull marker sits at the centre of {range.lastSeen.country} until then</Text>
                  </View>
                </View>
              </Pressable>
            </>
          )}

          {range && (
            <>
              <Text style={info.heading}>Range over time</Text>
              <Text style={info.note}>Tap a stage to see it shaded on the globe. Ranges are approximate.</Text>
              {range.phases.map((p, i) => (
                <Pressable
                  key={p.label}
                  onPress={() => onJumpRange(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.label}: show on the globe`}
                  style={({ pressed }) => [info.card, pressed && info.pressed]}>
                  <View style={info.cardRow}>
                    <View style={styles.swatch} />
                    <View style={info.cardText}>
                      <Text style={info.cardTitle}>{p.label} ›</Text>
                      <Text style={info.cardNote}>
                        {timeLabel(p.fromMa)} to {p.toMa > 0 ? timeLabel(p.toMa) : 'today'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {events.length > 0 && (
            <>
              <Text style={info.heading}>Events</Text>
              {events.map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => onJump(e, 0)}
                  accessibilityRole="button"
                  accessibilityLabel={`${e.title}: show it`}
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
              {p}
            </Text>
          ))}

          {species.related && species.related.length > 0 && (
            <>
              <Text style={info.heading}>Related forms</Text>
              <View style={info.list}>
                {species.related.map((r) => {
                  const other = speciesById(r.id);
                  return other ? (
                    <View key={r.id}>
                      <SpeciesRow species={other} onPress={() => onOpenSpecies(r.id)} />
                      <Text style={[info.rowNote, styles.relatedNote]}>{r.note}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </>
          )}

          {species.facts && (
            <View style={info.facts}>
              {species.facts.map((f) => (
                <View key={f.label} style={info.factRow}>
                  <Text style={info.factLabel}>{f.label}</Text>
                  <Text style={info.factValue}>{f.value}</Text>
                </View>
              ))}
            </View>
          )}

          {species.status === 'brief' && (
            <Text style={[info.note, { marginTop: 12 }]}>A full entry for this species is still to come.</Text>
          )}
        </>
      )}
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
