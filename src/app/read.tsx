import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CladeInfo } from '@/components/clade-info';
import { EventInfo } from '@/components/event-info';
import { ExtinctionInfo } from '@/components/extinction-info';
import { PageSheet } from '@/components/paper-sheet';
import { SpeciesInfo } from '@/components/species-info';
import { EVENTS } from '@/data/events';
import { usePalette } from '@/hooks/use-palette';
import { cladeEra, type Era, eventEra, speciesEra } from '@/lib/era';
import { EXTINCTIONS } from '@/lib/extinctions';
import { cladeById, speciesById } from '@/lib/life';
import { type PageRef, useProfile } from '@/lib/profile';
import { useT } from '@/lib/i18n';

// A page opened on top of another screen (e.g. "Read about…" in the quiz), so going back returns
// there instead of leaving it. Links open further pages on top; globe-only actions are left out.
export default function ReadScreen() {
  const t = useT();
  const { kind, id } = useLocalSearchParams<{ kind: PageRef['kind']; id: string }>();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const { addRecent } = useProfile();

  useEffect(() => {
    if (kind && id) addRecent({ kind, id });
  }, [kind, id, addRecent]);

  const open = (k: PageRef['kind'], i: string) => router.push({ pathname: '/read', params: { kind: k, id: i } });
  const common = {
    onBack: () => router.back(),
    backLabel: '‹ Back',
    onOpenClade: (i: string) => open('clade', i),
    onOpenSpecies: (i: string) => open('species', i),
  };

  const species = kind === 'species' ? speciesById(id) : undefined;
  const clade = kind === 'clade' ? cladeById(id) : undefined;
  const event = kind === 'event' ? EVENTS.find((e) => e.id === id) : undefined;
  const extinction = kind === 'extinction' ? EXTINCTIONS.find((e) => e.id === id) : undefined;
  const era: Era = species ? speciesEra(species) : clade ? cladeEra(clade.id) : event ? eventEra(event) : 'ancient';
  const title = species ? species.common || species.name : clade ? clade.common : event ? event.title : (extinction?.name ?? '');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ title }} />
      <PageSheet era={era} style={{ flexGrow: 1 }}>
        {species && <SpeciesInfo key={species.id} species={species} {...common} onOpenEvent={(e) => open('event', e.id)} />}
        {clade && <CladeInfo clade={clade} {...common} />}
        {event && <EventInfo event={event} timeMa={0} {...common} />}
        {extinction && <ExtinctionInfo extinction={extinction} {...common} />}
        {!species && !clade && !event && !extinction && <Text style={{ color: palette.text, padding: 16 }}>{t('This page couldn’t be found.')}</Text>}
      </PageSheet>
    </ScrollView>
  );
}
