import { Pressable, Text, View } from 'react-native';

import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { InfoNav } from '@/components/info-nav';
import { useInfoStyles } from '@/components/info-styles';
import { EXTINCTION_DETAILS, type GroupNote } from '@/data/extinction-details';
import type { Extinction } from '@/lib/extinctions';
import { cladeById } from '@/lib/life';
import { useUnitText } from '@/lib/profile';

type Props = {
  extinction: Extinction;
  onBack: () => void;
  onPrevious?: () => void;
  previousLabel?: string;
  // Move the timeline to the extinction and scroll up to the globe.
  onShowOnTimeline: () => void;
  onOpenClade: (id: string) => void;
};

// The page for a mass extinction: how much life was lost, what caused it, and who did and didn't
// make it through.
export function ExtinctionInfo({ extinction, onBack, onPrevious, previousLabel, onShowOnTimeline, onOpenClade }: Props) {
  const info = useInfoStyles();
  const u = useUnitText();
  const detail = EXTINCTION_DETAILS[extinction.id];

  return (
    <View style={info.wrap}>
      <InfoNav onBack={onBack} onPrevious={onPrevious} previousLabel={previousLabel} page={{ kind: 'extinction', id: extinction.id }} />

      <Text style={info.kicker}>{extinction.bigFive ? 'Mass extinction · one of the Big Five' : 'Extinction event'}</Text>
      <Text style={info.title} accessibilityRole="header">
        {extinction.name}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <ExtinctionIcon cause={extinction.cause} size={18} />
        <Text style={[info.meta, { color: CAUSE_COLORS[extinction.cause] }]}>{extinction.causeText}</Text>
      </View>
      {detail && <Text style={[info.subtitle, { textAlign: 'center' }]}>{detail.loss}</Text>}

      <Pressable onPress={onShowOnTimeline} accessibilityRole="button" style={({ pressed }) => [info.card, pressed && info.pressed]}>
        <Text style={info.cardTitle}>Show it on the timeline ›</Text>
      </Pressable>

      {detail?.summary.map((p) => (
        <Text key={p} style={info.body}>
          {u(p)}
        </Text>
      ))}

      {detail && <Groups heading="Lost" notes={detail.lost} onOpenClade={onOpenClade} />}
      {detail && <Groups heading="Made it through" notes={detail.survived} onOpenClade={onOpenClade} />}

      {detail && (
        <View style={info.facts}>
          {detail.facts.map((f) => (
            <View key={f.label} style={info.factRow}>
              <Text style={info.factLabel}>{f.label}</Text>
              <Text style={info.factValue}>{u(f.value)}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={info.note}>Loss figures are estimates and vary between studies.</Text>
    </View>
  );
}

function Groups({ heading, notes, onOpenClade }: { heading: string; notes: GroupNote[]; onOpenClade: (id: string) => void }) {
  const info = useInfoStyles();
  return (
    <>
      <Text style={info.heading}>{heading}</Text>
      <View style={info.list}>
        {notes.map((g) => {
          const linked = g.clade && cladeById(g.clade) ? g.clade : undefined;
          const body = (
            <>
              <Text style={info.rowTitle}>{linked ? `${g.name} ›` : g.name}</Text>
              <Text style={info.rowNote}>{g.note}</Text>
            </>
          );
          return linked ? (
            <Pressable
              key={g.name}
              onPress={() => onOpenClade(linked)}
              accessibilityRole="button"
              accessibilityLabel={`${g.name}, open group page`}
              style={({ pressed }) => [info.row, pressed && info.pressed]}>
              {body}
            </Pressable>
          ) : (
            <View key={g.name} style={info.row}>
              {body}
            </View>
          );
        })}
      </View>
    </>
  );
}
