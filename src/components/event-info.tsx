import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HistoryEvent, InvertebrateNote } from '@/data/events';
import { badgeBg, pointVisible } from '@/lib/events';
import { PointIcon } from '@/components/point-icon';
import { SpeciesRow } from '@/components/clade-info';
import { info } from '@/components/info-styles';
import type { Clade, Species } from '@/data/life';
import { familyOf, speciesAtEvent, speciesById, speciesInFormation } from '@/lib/life';

const CERTAINTY = { known: 'Trackmaker', likely: 'Likely trackmaker', possible: 'Possible trackmaker' } as const;

type Props = {
  event: HistoryEvent;
  timeMa: number;
  onBack: () => void;
  // Jump the timeline and globe to one of the event's points.
  onJump: (index: number) => void;
  onOpenSpecies: (id: string) => void;
  onOpenClade: (id: string) => void;
};

// The information section shown below the globe for a selected event.
export function EventInfo({ event, timeMa, onBack, onJump, onOpenSpecies, onOpenClade }: Props) {
  // Species found here, grouped by family (e.g. tyrannosaurs).
  const families: { family: Clade | undefined; members: Species[] }[] = [];
  for (const s of speciesInFormation(event.id)) {
    const family = familyOf(s);
    const group = families.find((f) => f.family?.id === family?.id);
    if (group) group.members.push(s);
    else families.push({ family, members: [s] });
  }

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Text style={styles.backText}>↑ Back to the globe</Text>
      </Pressable>

      <Text style={styles.kicker}>{event.kind}</Text>
      <Text style={styles.title} accessibilityRole="header">
        {event.title}
      </Text>
      <Text style={styles.meta}>{event.dateText}</Text>
      <Text style={styles.meta}>{event.placeText}</Text>

      {event.points.length > 1 && (
        <View style={styles.jumps}>
          {event.points.map((p, i) => {
            const here = pointVisible(p, timeMa);
            return (
              <Pressable
                key={i}
                onPress={() => onJump(i)}
                accessibilityRole="button"
                accessibilityLabel={`Jump to ${p.jumpLabel}`}
                style={({ pressed }) => [styles.jump, here && styles.jumpHere, pressed && styles.pressed]}>
                <View style={styles.jumpRow}>
                  <PointIcon kind={p.icon ?? 'flag'} size={26} bg={badgeBg(event, p)} />
                  <View style={styles.jumpLabels}>
                    <Text style={styles.jumpText}>{here ? p.jumpLabel : `${p.jumpLabel} ›`}</Text>
                    {here && <Text style={styles.jumpNote}>Showing on the globe now</Text>}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {event.summary.map((p) => (
        <Text key={p} style={styles.body}>
          {p}
        </Text>
      ))}

      {event.trackmakers && event.trackmakers.length > 0 && (
        <>
          <Text style={info.heading}>Who made the tracks</Text>
          <View style={info.list}>
            {event.trackmakers.map((t) => {
              const s = speciesById(t.id);
              return s ? (
                <View key={t.id}>
                  <SpeciesRow species={s} onPress={() => onOpenSpecies(t.id)} />
                  <Text style={[info.rowNote, styles.trackNote]}>
                    {CERTAINTY[t.certainty]}. {t.note}
                  </Text>
                </View>
              ) : null;
            })}
          </View>
        </>
      )}

      {speciesAtEvent(event.id).filter((s) => !event.trackmakers?.some((t) => t.id === s.id)).length > 0 && (
        <>
          <Text style={info.heading}>Who was there</Text>
          <View style={info.list}>
            {speciesAtEvent(event.id).filter((s) => !event.trackmakers?.some((t) => t.id === s.id)).map((s) => (
              <SpeciesRow key={s.id} species={s} onPress={() => onOpenSpecies(s.id)} />
            ))}
          </View>
        </>
      )}

      {families.length > 0 && (
        <>
          <Text style={info.heading}>Life found here</Text>
          {families.map(({ family, members }) => (
            <View key={family?.id ?? 'other'} style={{ gap: 6 }}>
              {family && (
                <View style={info.chips}>
                  <Pressable
                    onPress={() => onOpenClade(family.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`All ${family.common.toLowerCase()}`}
                    style={({ pressed }) => [info.chip, pressed && info.pressed]}>
                    <Text style={info.chipText}>{family.common} ›</Text>
                  </Pressable>
                </View>
              )}
              <View style={info.list}>
                {members.map((s) => (
                  <SpeciesRow key={s.id} species={s} onPress={() => onOpenSpecies(s.id)} />
                ))}
              </View>
            </View>
          ))}
        </>
      )}

      <TierNotes heading="Invertebrates" notes={event.invertebrates} />
      <TierNotes heading="Bats, rodents and other crowded groups" notes={event.groupNotes} />

      <View style={styles.facts}>
        {event.facts.map((f) => (
          <View key={f.label} style={styles.factRow}>
            <Text style={styles.factLabel}>{f.label}</Text>
            <Text style={styles.factValue}>{f.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Notes in three tiers: superstars as cards, microcelebs as short explainers, plebs as a list.
function TierNotes({ heading, notes }: { heading: string; notes?: InvertebrateNote[] }) {
  if (!notes || notes.length === 0) return null;
  const plebs = notes.filter((n) => n.tier === 'pleb');
  return (
    <>
      <Text style={info.heading}>{heading}</Text>
      {notes
        .filter((n) => n.tier === 'superstar')
        .map((n) => (
          <View key={n.title} style={info.card}>
            <Text style={info.kicker}>★ Superstar</Text>
            <Text style={[info.rowTitle, { fontSize: 17, marginTop: 4 }]}>{n.title}</Text>
            <Text style={info.body}>{n.text}</Text>
          </View>
        ))}
      {notes
        .filter((n) => n.tier === 'microceleb')
        .map((n) => (
          <View key={n.title} style={{ gap: 2 }}>
            <Text style={info.rowTitle}>{n.title}</Text>
            <Text style={[info.body, { marginTop: 0, fontSize: 15, lineHeight: 22 }]}>{n.text}</Text>
          </View>
        ))}
      {plebs.length > 0 && (
        <Text style={info.meta}>
          Also present: {plebs.map((n) => n.text.replace(/\.$/, '').toLowerCase()).join(', ')}.
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trackNote: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginTop: -6,
  },
  wrap: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 10,
  },
  back: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    color: '#9CC8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  jumps: {
    gap: 8,
    marginTop: 8,
  },
  jump: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(156,200,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156,200,255,0.4)',
  },
  jumpHere: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  jumpLabels: {
    flex: 1,
  },
  jumpText: {
    color: '#9CC8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  jumpNote: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  kicker: {
    color: '#FFD54A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  meta: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
  },
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  facts: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
  },
  factRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  factLabel: {
    width: 120,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  factValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
