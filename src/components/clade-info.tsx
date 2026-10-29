import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CladeCrumbs } from '@/components/clade-crumbs';
import { info } from '@/components/info-styles';
import { type Clade, CLADES, type Species } from '@/data/life';
import { childClades, cladeById, cladePath, speciesInClade } from '@/lib/life';

type Props = {
  clade: Clade;
  onBack: () => void;
  onOpenClade: (id: string) => void;
  onOpenSpecies: (id: string) => void;
};

// The information section for a group: where it sits in the tree and every species in it.
export function CladeInfo({ clade, onBack, onOpenClade, onOpenSpecies }: Props) {
  const path = cladePath(clade.id);
  const children = childClades(clade.id);
  const species = speciesInClade(clade.id);

  // List species under the group they belong to, in family-tree order.
  const sections = CLADES.map((c) => ({ clade: c, members: species.filter((s) => s.clade === c.id) })).filter(
    (s) => s.members.length > 0,
  );

  return (
    <View style={info.wrap}>
      <Pressable onPress={onBack} accessibilityRole="button" style={({ pressed }) => [info.back, pressed && info.pressed]}>
        <Text style={info.backText}>↑ Back to the globe</Text>
      </Pressable>

      <Text style={info.kicker}>Group</Text>
      <Text style={info.title} accessibilityRole="header">
        {clade.common}
      </Text>
      <Text style={[info.subtitle, info.italic]}>{clade.name}</Text>
      {!!clade.akaNote && <Text style={info.meta}>{clade.akaNote}</Text>}

      {path.length > 1 && <CladeCrumbs path={path.slice(0, -1)} onOpenClade={onOpenClade} />}

      <Text style={info.body}>{clade.description}</Text>

      {children.length > 0 && (
        <>
          <Text style={info.heading}>Groups within</Text>
          <View style={info.chips}>
            {children.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => onOpenClade(c.id)}
                accessibilityRole="button"
                style={({ pressed }) => [info.chip, pressed && info.pressed]}>
                <Text style={info.chipText}>
                  {c.common} ({speciesInClade(c.id).length})
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Text style={info.heading}>
        {species.length} {species.length === 1 ? 'species' : 'species'} in PaleoDex
      </Text>
      {sections.map(({ clade: c, members }) => (
        <View key={c.id} style={{ gap: 6 }}>
          {sections.length > 1 && <Text style={info.meta}>{c.id === clade.id ? `Other ${clade.common.toLowerCase()}` : c.common}</Text>}
          <View style={info.list}>
            {members.map((s) => (
              <SpeciesRow key={s.id} species={s} onPress={() => onOpenSpecies(s.id)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export function SpeciesRow({ species, onPress }: { species: Species; onPress: () => void }) {
  const group = cladeById(species.clade);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${species.name}${species.common ? `, ${species.common}` : ''}`}
      style={({ pressed }) => [info.row, pressed && info.pressed]}>
      <Text style={info.rowTitle}>
        <Text style={info.italic}>{species.name}</Text>
        {species.status === 'full' && <Text style={info.badge}>{'  '}FULL ENTRY</Text>}
      </Text>
      <Text style={info.rowNote} numberOfLines={2}>
        {[species.ageText.replace(/ \(.*\)$/, ''), species.placeText, group?.common].filter(Boolean).join(' · ')}
      </Text>
    </Pressable>
  );
}
