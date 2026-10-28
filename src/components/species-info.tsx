import { Fragment, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { info } from '@/components/info-styles';
import { PointIcon } from '@/components/point-icon';
import type { HistoryEvent } from '@/data/events';
import type { Species } from '@/data/life';
import { SpeciesRow } from '@/components/clade-info';
import { cladePath, familyOf, formationById, pastPointIndex, relativesOf } from '@/lib/life';

type Props = {
  species: Species;
  onBack: () => void;
  onOpenClade: (id: string) => void;
  onOpenSpecies: (id: string) => void;
  // Jump the timeline and globe to where a formation was laid down.
  onJump: (formation: HistoryEvent, index: number) => void;
};

// The information section for a species: what it was and the formations it's found in.
export function SpeciesInfo({ species, onBack, onOpenClade, onOpenSpecies, onJump }: Props) {
  const [tab, setTab] = useState<'about' | 'relatives'>('about');
  const path = cladePath(species.clade);
  const family = familyOf(species);
  const relatives = relativesOf(species);
  const formations = species.formations.map(formationById).filter((f): f is HistoryEvent => f !== undefined);

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
                      <PointIcon kind={point.icon ?? 'flag'} size={28} />
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

          {species.summary.map((p) => (
            <Text key={p} style={info.body}>
              {p}
            </Text>
          ))}

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
