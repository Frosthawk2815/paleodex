import { Link, router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeferredValue, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { CladeInfo } from '@/components/clade-info';
import { EventInfo } from '@/components/event-info';
import { ExtinctionInfo } from '@/components/extinction-info';
import { SpeciesInfo } from '@/components/species-info';
import { CAUSE_COLORS, ExtinctionIcon } from '@/components/extinction-icon';
import { Globe } from '@/components/globe';
import { PageSheet } from '@/components/paper-sheet';
import { AvatarImage, avatarUri, initialsOf } from '@/components/profile-ui';
import { usePalette } from '@/hooks/use-palette';
import { type SearchResult, SearchPanel } from '@/components/search-panel';
import { TimeBar, type TimeBarHandle } from '@/components/time-bar';
import { EVENTS, type HistoryEvent } from '@/data/events';
import { EXTINCTIONS, extinctionAt } from '@/lib/extinctions';
import { cladeEra, type Era, eventEra, speciesEra } from '@/lib/era';
import { cladeById, formationById, pastPointIndex, speciesById } from '@/lib/life';
import { birthMaOf, type PageRef, useProfile } from '@/lib/profile';
import { useOwnPicture } from '@/lib/user-photos';
import { lastSeenJumpMa, phaseJumpMa, rangeOf } from '@/lib/ranges';
import { contextAt, timeLabel } from '@/lib/time';
import { localTime, useT } from '@/lib/i18n';

// What the information section below the globe is showing.
// How long the timeline must rest somewhere before a card or title appears.
const LINGER_MS = 1300;

type Selection = { kind: 'event'; event: HistoryEvent } | { kind: 'species'; id: string } | { kind: 'clade'; id: string } | { kind: 'extinction'; id: string };

const sameSelection = (a: Selection, b: Selection) =>
  a.kind === b.kind && (a.kind === 'event' ? a.event.id === (b as typeof a).event.id : a.id === (b as typeof a).id);

// A short name for a page, shown on the "previous page" button.
function selectionLabel(s: Selection): string {
  if (s.kind === 'event') return s.event.title;
  if (s.kind === 'extinction') return EXTINCTIONS.find((x) => x.id === s.id)?.name ?? 'Extinction';
  const item = s.kind === 'species' ? speciesById(s.id) : cladeById(s.id);
  return item?.common || item?.name || 'Previous';
}

const pageOf = (s: Selection): PageRef => ({ kind: s.kind, id: s.kind === 'event' ? s.event.id : s.id });

type Focus = { kind: 'site' | 'moon' | 'event' | 'skull' | 'range' | 'user'; id: string; index?: number; n: number };

export default function GlobeScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const { profile, addRecent, request, setRequest, reduceMotion, markVisited } = useProfile();
  const ownPicture = useOwnPicture();
  // The user's birthplace and home, shown on the globe.
  const userPlaces = useMemo(
    () => [
      ...(profile.birthplace ? [{ key: 'birthplace', label: t('Born here'), color: '#FFD54F', place: profile.birthplace }] : []),
      ...(profile.home ? [{ key: 'home', label: t('Home'), color: '#4FC3F7', place: profile.home }] : []),
    ].map((u) => ({ ...u, image: avatarUri(profile.avatar, ownPicture), initials: initialsOf(profile.name) || '★' })),
    [profile.birthplace, profile.home, profile.avatar, profile.name, ownPicture, t],
  );
  const birthMa = birthMaOf(profile);
  // Height of the visible page; the globe section fills it. Measured, because the window size
  // isn't known when the web version is rendered ahead of time.
  const [pageHeight, setPageHeight] = useState(0);
  const [timeMa, setTimeMa] = useState(0);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [focus, setFocus] = useState<Focus | null>(null);
  const [selected, setSelected] = useState<Selection | null>(null);
  // Whether the open page is about the ancient past or the modern world (for the paper theme).
  const selectedEra = useMemo<Era>(() => {
    if (!selected) return 'ancient';
    if (selected.kind === 'event') return eventEra(selected.event);
    if (selected.kind === 'clade') return cladeEra(selected.id);
    if (selected.kind === 'extinction') return 'ancient';
    const s = speciesById(selected.id);
    return s ? speciesEra(s) : 'ancient';
  }, [selected]);
  // Pages shown before the current one, most recent last, for the "previous page" button.
  const [history, setHistory] = useState<Selection[]>([]);
  // A modern species whose range is shaded on the globe.
  const [rangeId, setRangeId] = useState<string | undefined>(undefined);
  const [searching, setSearching] = useState(false);
  // While the globe is being dragged, the page itself shouldn't scroll.
  const [dragging, setDragging] = useState(false);
  const page = useRef<ScrollViewInstance>(null);
  const bar = useRef<TimeBarHandle>(null);
  const infoY = useRef<number | null>(null);
  const scrollToInfo = useRef(false);
  // The globe can lag a frame behind the timeline so scrolling stays smooth.
  const globeTime = useDeferredValue(timeMa);
  // Resting on 69 million years ago for a moment (the same wait as the extinction card, so
  // scrolling past doesn't count) earns a title.
  const at69 = Math.floor(timeMa) === 69;
  useEffect(() => {
    if (!at69) return;
    const t = setTimeout(() => markVisited('time:69'), LINGER_MS);
    return () => clearTimeout(t);
  }, [at69, timeMa, markVisited]);
  const { period, series, stage } = contextAt(timeMa);
  const extinction = extinctionAt(timeMa);
  const extinctionId = extinction?.id;
  // A card offering the extinction's page appears only once the timeline has rested in the
  // extinction's window for a moment, so scrolling back and forth past it doesn't flood the screen.
  // It remembers the exact time it was earned at, so any further movement hides it until the
  // timeline rests again.
  const [lingered, setLingered] = useState<{ id: string; at: number } | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  useEffect(() => {
    if (!extinctionId) return;
    const t = setTimeout(() => setLingered({ id: extinctionId, at: timeMa }), LINGER_MS);
    return () => clearTimeout(t);
  }, [extinctionId, timeMa]);

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

  // Show something in the information section (remembering the page it replaces) and, unless
  // told otherwise, scroll down to it.
  // A range shown on the globe belongs to the species page it was opened from: opening another
  // species shows that one's range (or none), and opening a formation or event clears it.
  // Group pages leave it as it is.
  const syncRange = (next: Selection) => {
    if (next.kind === 'species') setRangeId(rangeOf(next.id) ? next.id : undefined);
    else if (next.kind === 'event' || next.kind === 'extinction') setRangeId(undefined);
  };
  const showInfo = (next: Selection, scroll = true) => {
    if (selected && !sameSelection(selected, next)) setHistory((h) => [...h, selected].slice(-50));
    setSelected(next);
    addRecent(pageOf(next));
    syncRange(next);
    if (!scroll) return;
    if (infoY.current !== null) page.current?.scrollTo({ y: infoY.current, animated: !reduceMotion });
    else scrollToInfo.current = true;
  };
  const selectEvent = (e: HistoryEvent) => showInfo({ kind: 'event', event: e });
  // Modern species: travel to just before the last sighting, or to one stage of the range.
  const goToLastSeen = (id: string) => {
    const lastSeen = rangeOf(id)?.lastSeen;
    if (!lastSeen) return;
    setRangeId(id);
    bar.current?.goToTime(lastSeenJumpMa(lastSeen));
    lookAt('skull', id);
  };
  const goToRange = (id: string, index: number) => {
    const phase = rangeOf(id)?.phases[index];
    if (!phase) return;
    setRangeId(id);
    bar.current?.goToTime(phaseJumpMa(phase));
    lookAt('range', id, index);
  };
  // Move the timeline and globe to a species: the formation it's found in (the one being looked
  // at if it's one of them, otherwise the first listed), or for modern species their last
  // sighting or the start of their range.
  const travelToSpecies = (id: string, preferFormation?: string) => {
    const species = speciesById(id);
    if (!species) return;
    const formations = species.formations.map(formationById).filter((f): f is HistoryEvent => f !== undefined);
    const formation = formations.find((f) => f.id === preferFormation) ?? formations[0];
    const range = rangeOf(id);
    if (formation) jumpToPoint(formation, pastPointIndex(formation));
    else if (range?.lastSeen) goToLastSeen(id);
    else if (range) {
      // Living species open on where they live today.
      const today = range.phases.findIndex((p) => p.toMa === 0);
      goToRange(id, today >= 0 ? today : 0);
    }
    if (range) setRangeId(id);
  };
  // Open a species page; the globe travels to it on its own.
  const openSpecies = (id: string, scroll = true) => {
    travelToSpecies(id, selected?.kind === 'event' ? selected.event.id : undefined);
    showInfo({ kind: 'species', id }, scroll);
  };
  // A species tapped on the globe is already in view, so the globe stays put.
  const openSpeciesHere = (id: string) => {
    if (rangeOf(id)) setRangeId(id);
    showInfo({ kind: 'species', id });
  };
  const openClade = (id: string) => showInfo({ kind: 'clade', id });
  const openExtinction = (id: string) => showInfo({ kind: 'extinction', id });
  const showPopup =
    extinction !== undefined &&
    lingered?.id === extinction.id &&
    lingered.at === timeMa &&
    !dismissed.includes(extinction.id) &&
    !(selected?.kind === 'extinction' && selected.id === extinction.id);

  // Go back to the page shown before this one, moving the globe back with it.
  const previous = history[history.length - 1];
  const goPrevious = () => {
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    setSelected(previous);
    addRecent(pageOf(previous));
    syncRange(previous);
    if (previous.kind === 'species') travelToSpecies(previous.id);
    else if (previous.kind === 'event') jumpToPoint(previous.event, 0);
    else if (previous.kind === 'extinction') {
      const x = EXTINCTIONS.find((e) => e.id === previous.id);
      if (x) bar.current?.jumpToExtinction(x);
    }
    if (infoY.current !== null) page.current?.scrollTo({ y: infoY.current, animated: !reduceMotion });
  };
  // Android's back button goes to the previous page while there is one.
  const onHardwareBack = useEffectEvent(goPrevious);
  const hasPrevious = previous !== undefined;
  useEffect(() => {
    if (!hasPrevious) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onHardwareBack();
      return true;
    });
    return () => sub.remove();
  }, [hasPrevious]);
  const nav = { onPrevious: previous ? goPrevious : undefined, previousLabel: previous ? selectionLabel(previous) : undefined };
  const backToGlobe = () => page.current?.scrollTo({ y: 0, animated: !reduceMotion });
  // Jump to a point and scroll back up to see it on the globe.
  const jumpAndShow = (e: HistoryEvent, index: number) => {
    jumpToPoint(e, index);
    backToGlobe();
  };

  const onInfoLayout = (e: LayoutChangeEvent) => {
    infoY.current = e.nativeEvent.layout.y;
    if (scrollToInfo.current) {
      scrollToInfo.current = false;
      page.current?.scrollTo({ y: e.nativeEvent.layout.y, animated: !reduceMotion });
    }
  };

  // Show what another screen asked for (e.g. a favourite chosen in the profile) on returning here.
  const showRequest = () => {
    if (!request) return;
    setRequest(null);
    if (request.kind === 'user') {
      lookAt('user', request.which);
      backToGlobe();
      return;
    }
    if (request.kind === 'time') {
      bar.current?.goToTime(request.ma);
      backToGlobe();
      return;
    }
    const { kind, id } = request.page;
    if (kind === 'species') openSpecies(id);
    else if (kind === 'clade') openClade(id);
    else if (kind === 'extinction') {
      const x = EXTINCTIONS.find((e) => e.id === id);
      if (x) bar.current?.jumpToExtinction(x);
      openExtinction(id);
    } else {
      const event = EVENTS.find((e) => e.id === id);
      if (event) {
        jumpToPoint(event, 0);
        showInfo({ kind: 'event', event });
      }
    }
  };
  // Runs whenever this screen is shown; it does nothing unless a request is waiting.
  useFocusEffect(showRequest);

  const onSearchSelect = (r: SearchResult) => {
    setSearching(false);
    if (r.kind === 'unit') bar.current?.zoomTo(r.unit);
    else if (r.kind === 'extinction') {
      bar.current?.jumpToExtinction(r.extinction);
      showInfo({ kind: 'extinction', id: r.extinction.id }, false);
    }
    else if (r.kind === 'event') {
      // Land at the event's first point (for formations, where they formed) with its marker showing.
      jumpToPoint(r.event, 0);
      showInfo({ kind: 'event', event: r.event }, false);
    } else if (r.kind === 'species') {
      // Land in the past at the first formation it's found in, and open its description.
      // Modern species land at their last sighting, or the start of their range.
      travelToSpecies(r.species.id);
      showInfo({ kind: 'species', id: r.species.id });
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
              accessibilityLabel={t('Search')}
              hitSlop={8}
              style={({ pressed }) => [styles.searchButton, pressed && styles.searchPressed]}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Circle cx={10.5} cy={10.5} r={6.5} stroke="#FFFFFF" strokeWidth={2.2} fill="none" />
                <Line x1={15.5} y1={15.5} x2={21} y2={21} stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <Pressable
                onPress={() => router.push('/profile')}
                accessibilityRole="button"
                accessibilityLabel={t('Your profile, favourites, settings and credits')}
                hitSlop={8}
                style={({ pressed }) => [styles.searchButton, styles.profileButton, pressed && styles.searchPressed]}>
                {profile.avatar ? (
                  <AvatarImage avatar={profile.avatar} name={profile.name} size={38} />
                ) : (
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Circle cx={12} cy={8} r={4} stroke="#FFFFFF" strokeWidth={2.2} fill="none" />
                    <Path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" />
                  </Svg>
                )}
            </Pressable>
            <Text style={styles.app}>Animal Almanac</Text>
            <Text style={styles.time} accessibilityLiveRegion="polite">
              {localTime(timeLabel(timeMa), t)}
            </Text>
            <Text style={styles.context} numberOfLines={1}>
              {period ? `${t('{era} Era', { era: t(period.era) })} · ${t(period.name)}` : ''}
            </Text>
            <Text style={styles.subContext} numberOfLines={1}>
              {[series?.name, stage?.name].filter(Boolean).join(' · ')}
            </Text>
            {extinction && (
              <Pressable
                onPress={() => openExtinction(extinction.id)}
                accessibilityRole="button"
                accessibilityHint={t('Opens the page about this extinction')}
                style={({ pressed }) => [styles.event, pressed && styles.searchPressed]}>
                <ExtinctionIcon cause={extinction.cause} size={16} />
                <Text style={[styles.impact, { color: CAUSE_COLORS[extinction.cause] }]} numberOfLines={2}>
                  {extinction.name} · {extinction.causeText}
                </Text>
              </Pressable>
            )}
            {period && (
              <Link href={{ pathname: '/period/[id]', params: { id: period.id } }} style={styles.link}>
                {t('About the {period} ›', { period: t(period.name) })}
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
                rangeId={rangeId}
                onClearRange={() => setRangeId(undefined)}
                onSelectSpecies={openSpeciesHere}
                reduceMotion={reduceMotion}
                userPlaces={userPlaces}
              />
            )}
            {showPopup && extinction && (
              <View style={styles.popup} accessibilityLiveRegion="polite">
                <Pressable
                  onPress={() => openExtinction(extinction.id)}
                  accessibilityRole="button"
                  accessibilityLabel={t('Read about the {name}', { name: t(extinction.name) })}
                  style={({ pressed }) => [styles.popupMain, pressed && styles.searchPressed]}>
                  <ExtinctionIcon cause={extinction.cause} size={22} />
                  <View style={styles.popupText}>
                    <Text style={styles.popupTitle} numberOfLines={1}>
                      {extinction.name}
                    </Text>
                    <Text style={[styles.popupLink, { color: CAUSE_COLORS[extinction.cause] }]}>{t('Read about it ›')}</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => setDismissed((d) => [...d, extinction.id])}
                  accessibilityRole="button"
                  accessibilityLabel={t('Close')}
                  hitSlop={8}
                  style={({ pressed }) => [styles.popupClose, pressed && styles.searchPressed]}>
                  <Text style={styles.popupCloseText}>×</Text>
                </Pressable>
              </View>
            )}
          </View>

          <TimeBar ref={bar} onChange={setTimeMa} onSite={(e) => lookAt('site', e.id)} reduceMotion={reduceMotion} birthMa={birthMa} />
          <Text style={styles.hint}>{t('Slide or tap the timeline to travel in time · drag to spin · pinch to zoom')}</Text>
        </View>

        {selected && (
          <PageSheet era={selectedEra} onLayout={onInfoLayout} style={styles.infoSheet}>
            {selected.kind === 'event' && (
              <EventInfo
                event={selected.event}
                timeMa={timeMa}
                onBack={backToGlobe}
                {...nav}
                onJump={(i) => jumpAndShow(selected.event, i)}
                onOpenSpecies={openSpecies}
                onOpenClade={openClade}
              />
            )}
            {selected.kind === 'species' && speciesById(selected.id) && (
              <SpeciesInfo
                key={selected.id}
                species={speciesById(selected.id)!}
                onBack={backToGlobe}
                {...nav}
                onOpenClade={openClade}
                onOpenSpecies={openSpecies}
                onOpenEvent={(e, i) => {
                  jumpToPoint(e, i);
                  showInfo({ kind: 'event', event: e });
                }}
                onJumpRange={(i) => {
                  goToRange(selected.id, i);
                  backToGlobe();
                }}
                onJumpLastSeen={() => {
                  goToLastSeen(selected.id);
                  backToGlobe();
                }}
              />
            )}
            {selected.kind === 'clade' && cladeById(selected.id) && (
              <CladeInfo clade={cladeById(selected.id)!} onBack={backToGlobe} {...nav} onOpenClade={openClade} onOpenSpecies={openSpecies} />
            )}
            {selected.kind === 'extinction' && EXTINCTIONS.find((x) => x.id === selected.id) && (
              <ExtinctionInfo
                extinction={EXTINCTIONS.find((x) => x.id === selected.id)!}
                onBack={backToGlobe}
                {...nav}
                onOpenClade={openClade}
                onShowOnTimeline={() => {
                  bar.current?.jumpToExtinction(EXTINCTIONS.find((x) => x.id === selected.id)!);
                  backToGlobe();
                }}
              />
            )}
          </PageSheet>
        )}
      </ScrollView>

      {searching && (
        <View style={[styles.searchLayer, { paddingTop: insets.top, backgroundColor: palette.background }]}>
          <SearchPanel onSelect={onSearchSelect} onClose={() => setSearching(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    maxWidth: 420,
    alignSelf: 'center',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 16, 28, 0.94)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
  },
  popupMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  popupText: {
    flex: 1,
    gap: 2,
  },
  popupTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  popupLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  popupClose: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  popupCloseText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
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
    left: 12,
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
  // Sits just below the search button.
  profileButton: {
    top: 48,
    overflow: 'hidden',
  },
  // The species, group or formation page below the globe, in the user's theme colours.
  infoSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});
