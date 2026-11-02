import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CladeCrumbs } from '@/components/clade-crumbs';
import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { type Clade, CLADES, type Species } from '@/data/life';
import { childClades, cladeById, cladePath, speciesInClade } from '@/lib/life';
import { speciesMa } from '@/lib/quiz';
import { useUnitText } from '@/lib/profile';

type Props = {
  clade: Clade;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
  onOpenClade: (id: string) => void;
  onOpenSpecies: (id: string) => void;
  backLabel?: string;
};

// The information section for a group: where it sits in the tree and every species in it.
// When a species first appears, in millions of years, read from its date text: "About 37 to 35
// million years ago" -> 37, "About 400,000 to 4,000 years ago" -> 0.4, "Living today" -> 0.
function startMa(text: string): number | null {
  if (/^living/i.test(text)) return 0;
  const m = text.match(/([\d.,]+)\s*(million)?(?:\s*(?:to|–|-)\s*[\d.,]+\s*(million)?)?\s*years/i);
  if (!m) return null;
  const n = Number(m[1]!.replace(/,/g, ''));
  return m[2] || m[3] ? n : n / 1e6;
}

export function CladeInfo({ clade, onBack, onPrevious, previousLabel, onOpenClade, onOpenSpecies, backLabel }: Props) {
  const info = useInfoStyles();
  const u = useUnitText();
  const path = cladePath(clade.id);
  const children = childClades(clade.id);
  const species = speciesInClade(clade.id);

  // List species under the group they belong to, in family-tree order, and within each group from
  // oldest to youngest so the list reads as an evolutionary story (living species last).
  const age = (s: Species) => startMa(s.ageText) ?? speciesMa(s) ?? -1;
  const sections = CLADES.map((c) => ({
    clade: c,
    members: species.filter((s) => s.clade === c.id).sort((a, b) => age(b) - age(a)),
  })).filter((s) => s.members.length > 0);

  return (
    <View style={info.wrap}>
      <InfoNav onBack={onBack} onPrevious={onPrevious} previousLabel={previousLabel} backLabel={backLabel} page={{ kind: 'clade', id: clade.id }} />

      <Text style={info.kicker}>Group</Text>
      <Text style={info.title} accessibilityRole="header">
        {clade.common}
      </Text>
      <Text style={[info.subtitle, info.italic]}>{clade.name}</Text>
      {!!clade.aka?.length && <Text style={info.meta}>Also called {clade.aka.join(', ')}</Text>}
      {!!clade.akaNote && <Text style={info.note}>{clade.akaNote}</Text>}

      {path.length > 1 && <CladeCrumbs path={path.slice(0, -1)} onOpenClade={onOpenClade} />}

      <Text style={info.body}>{u(clade.description)}</Text>

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
  const info = useInfoStyles();
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
