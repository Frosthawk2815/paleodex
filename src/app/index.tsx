import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeferredValue, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';

import { CladeInfo } from '@/components/clade-info';
import { EventInfo } from '@/components/event-info';
import { SpeciesInfo } from '@/components/species-info';
import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { Globe } from '@/components/globe';
import { type SearchResult, SearchPanel } from '@/components/search-panel';
import { TimeBar, type TimeBarHandle } from '@/components/time-bar';
import type { HistoryEvent } from '@/data/events';
import { extinctionAt } from '@/lib/extinctions';
import { cladeById, formationById, pastPointIndex, speciesById } from '@/lib/life';
import { contextAt, timeLabel } from '@/lib/time';

// What the information section below the globe is showing.
type Selection = { kind: 'event'; event: HistoryEvent } | { kind: 'species'; id: string } | { kind: 'clade'; id: string };

type Focus = { kind: 'site' | 'moon' | 'event'; id: string; index?: number; n: number };

export default function GlobeScreen() {
  const insets = useSafeAreaInsets();
  // Height of the visible page; the globe section fills it. Measured, because the window size
  // isn't known when the web version is rendered ahead of time.
  const [pageHeight, setPageHeight] = useState(0);
  const [timeMa, setTimeMa] = useState(0);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [focus, setFocus] = useState<Focus | null>(null);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [searching, setSearching] = useState(false);
  // While the globe is being dragged, the page itself shouldn't scroll.
  const [dragging, setDragging] = useState(false);
  const page = useRef<ScrollViewInstance>(null);
  const bar = useRef<TimeBarHandle>(null);
  const infoY = useRef<number | null>(null);
  const scrollToInfo = useRef(false);
  // The globe can lag a frame behind the timeline so scrolling stays smooth.
  const globeTime = useDeferredValue(timeMa);
  const { period, series, stage } = contextAt(timeMa);
  const extinction = extinctionAt(timeMa);

  const lookAt = (kind: Focus['kind'], id: string, index?: number) => setFocus((f) => ({ kind, id, index, n: (f?.n ?? 0) + 1 }));

  // Move the timeline to one of an event's points and turn the globe (or Moon) to it.
  const jumpToPoint = (e: HistoryEvent, index: number) => {
    bar.current?.goToTime(e.points[index].jumpMa);
    lookAt('event', e.id, index);
  };

  const onGlobeArea = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea({ width: Math.floor(width), height: Math.floor(height) });
  };

  // Show something in the information section and scroll down to it.
  const openInfo = (next: Selection) => {
    setSelected(next);
    if (infoY.current !== null) page.current?.scrollTo({ y: infoY.current, animated: true });
    else scrollToInfo.current = true;
  };
  const selectEvent = (e: HistoryEvent) => openInfo({ kind: 'event', event: e });
  const openSpecies = (id: string) => openInfo({ kind: 'species', id });
  const openClade = (id: string) => openInfo({ kind: 'clade', id });
  const backToGlobe = () => page.current?.scrollTo({ y: 0, animated: true });
  // Jump to a point and scroll back up to see it on the globe.
  const jumpAndShow = (e: HistoryEvent, index: number) => {
    jumpToPoint(e, index);
    backToGlobe();
  };

  const onInfoLayout = (e: LayoutChangeEvent) => {
    infoY.current = e.nativeEvent.layout.y;
    if (scrollToInfo.current) {
      scrollToInfo.current = false;
      page.current?.scrollTo({ y: e.nativeEvent.layout.y, animated: true });
    }
  };

  const onSearchSelect = (r: SearchResult) => {
    setSearching(false);
    if (r.kind === 'unit') bar.current?.zoomTo(r.unit);
    else if (r.kind === 'extinction') bar.current?.jumpToExtinction(r.extinction);
    else if (r.kind === 'event') {
      // Land at the event's first point (for formations, where they formed) with its marker showing.
      jumpToPoint(r.event, 0);
      setSelected({ kind: 'event', event: r.event });
    } else if (r.kind === 'species') {
      // Land in the past at the first formation it's found in, and open its description.
      const formation = r.species.formations.map(formationById).find((f) => f !== undefined);
      if (formation) jumpToPoint(formation, pastPointIndex(formation));
      openSpecies(r.species.id);
    } else {
      openClade(r.clade.id);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        ref={page}
        scrollEnabled={!dragging}
        showsVerticalScrollIndicator={false}
        onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
        contentContainerStyle={styles.pageContent}>
        <View
          style={[
            pageHeight > 0 ? { height: pageHeight } : styles.fill,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 8 },
          ]}>
          <View style={styles.header}>
            <Pressable
              onPress={() => setSearching(true)}
              accessibilityRole="button"
              accessibilityLabel="Search"
              hitSlop={8}
              style={({ pressed }) => [styles.searchButton, pressed && styles.searchPressed]}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Circle cx={10.5} cy={10.5} r={6.5} stroke="#FFFFFF" strokeWidth={2.2} fill="none" />
                <Line x1={15.5} y1={15.5} x2={21} y2={21} stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <Text style={styles.app}>PaleoDex</Text>
            <Text style={styles.time} accessibilityLiveRegion="polite">
              {timeLabel(timeMa)}
            </Text>
            <Text style={styles.context} numberOfLines={1}>
              {period ? `${period.era} Era · ${period.name}` : ''}
            </Text>
            <Text style={styles.subContext} numberOfLines={1}>
              {[series?.name, stage?.name].filter(Boolean).join(' · ')}
            </Text>
            {extinction && (
              <View style={styles.event}>
                <ExtinctionIcon cause={extinction.cause} size={16} />
                <Text style={[styles.impact, { color: CAUSE_COLORS[extinction.cause] }]} numberOfLines={2}>
                  {extinction.name} · {extinction.causeText}
                </Text>
              </View>
            )}
            {period && (
              <Link href={{ pathname: '/period/[id]', params: { id: period.id } }} style={styles.link}>
                About the {period.name} ›
              </Link>
            )}
          </View>

          <View style={styles.globeArea} onLayout={onGlobeArea}>
            {area.width > 0 && (
              <Globe
                timeMa={globeTime}
                width={area.width}
                height={area.height}
                focus={focus}
                onSelectEvent={selectEvent}
                onDragging={setDragging}
              />
            )}
          </View>

          <TimeBar ref={bar} onChange={setTimeMa} onSite={(e) => lookAt('site', e.id)} />
          <Text style={styles.hint}>Slide or tap the timeline to travel in time · drag to spin · pinch to zoom</Text>
          <Text style={styles.credit}>
            Land and sea: Scotese & Wright (2018) PALEOMAP · Sea level: Spratt & Lisiecki (2016), Bintanja & van de Wal (2008)
          </Text>
        </View>

        {selected && (
          <View onLayout={onInfoLayout}>
            {selected.kind === 'event' && (
              <EventInfo
                event={selected.event}
                timeMa={timeMa}
                onBack={backToGlobe}
                onJump={(i) => jumpAndShow(selected.event, i)}
                onOpenSpecies={openSpecies}
                onOpenClade={openClade}
              />
            )}
            {selected.kind === 'species' && speciesById(selected.id) && (
              <SpeciesInfo species={speciesById(selected.id)!} onBack={backToGlobe} onOpenClade={openClade} onJump={jumpAndShow} />
            )}
            {selected.kind === 'clade' && cladeById(selected.id) && (
              <CladeInfo clade={cladeById(selected.id)!} onBack={backToGlobe} onOpenClade={openClade} onOpenSpecies={openSpecies} />
            )}
          </View>
        )}
      </ScrollView>

      {searching && (
        <View style={[styles.searchLayer, { paddingTop: insets.top }]}>
          <SearchPanel onSelect={onSearchSelect} onClose={() => setSearching(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070D',
    // Dragging the globe with a mouse shouldn't select the page's text on the web.
    userSelect: 'none',
  },
  pageContent: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 2,
  },
  searchButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
  },
  searchPressed: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  searchLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#05070D',
  },
  app: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
  context: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
  },
  subContext: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  link: {
    color: '#9CC8FF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    paddingVertical: 4,
  },
  globeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 6,
    marginTop: 4,
  },
  impact: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  credit: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
