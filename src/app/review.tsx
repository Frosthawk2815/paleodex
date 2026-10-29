import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CANDIDATE_DATA from '@/data/image-candidates.json';
import { usePalette } from '@/hooks/use-palette';
import { imageCaption, type SpeciesImage } from '@/lib/images';
import { speciesById } from '@/lib/life';

// The owner's review of candidate pictures: each one is marked "use it", "no", or "outdated"
// (an old restoration that no longer matches the science). Answers are saved on the phone and
// sent back as text, then copied into tools/images/decisions.json.

type Candidate = Omit<SpeciesImage, 'article'>;
type Vote = 'yes' | 'no' | 'outdated';

// Answers are kept per picture file, so a new picture for a species is asked about afresh.
// (v1 answers were imported before this version and are not reused.)
const STORAGE_KEY = 'paleodex.pictureReview.v2';
const CANDIDATES = CANDIDATE_DATA as Record<string, Candidate>;

const open = (url?: string | null) => {
  if (url) openBrowserAsync(url).catch(() => {});
};

const VOTES: { vote: Vote; label: string; colour: string }[] = [
  { vote: 'yes', label: '✓ Use it', colour: '#2E7D32' },
  { vote: 'outdated', label: 'Outdated', colour: '#B26A00' },
  { vote: 'no', label: '✗ No', colour: '#B3261E' },
];

// Answers are saved under the species and the picture's file.
const keyOf = (id: string) => `${id}|${CANDIDATES[id].file}`;

// The answers for the pictures now on offer, as text to send back: one line per answer type,
// listing species ids.
function resultsText(ids: string[], votes: Record<string, Vote>): string {
  const answeredIds = ids.filter((id) => votes[keyOf(id)]);
  const lines = (['yes', 'no', 'outdated'] as const).map(
    (v) => `${v}: ${answeredIds.filter((id) => votes[keyOf(id)] === v).sort().join(', ')}`,
  );
  return [`PaleoDex picture review (${answeredIds.length} answered)`, ...lines].join('\n');
}

export default function ReviewScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  // Species with a candidate picture, in name order.
  const ids = useMemo(
    () =>
      Object.keys(CANDIDATES)
        .filter((id) => speciesById(id))
        .sort((a, b) => speciesById(a)!.name.localeCompare(speciesById(b)!.name)),
    [],
  );
  const [votes, setVotes] = useState<Record<string, Vote> | null>(null);
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  // Load saved answers and start at the first picture not yet answered.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw): Record<string, Vote> => (raw ? JSON.parse(raw) : {}))
      .catch((): Record<string, Vote> => ({}))
      .then((saved) => {
        setVotes(saved);
        const first = ids.findIndex((id) => !saved[keyOf(id)]);
        setIndex(first >= 0 ? first : 0);
      });
  }, [ids]);

  if (!votes) return <View style={[styles.fill, { backgroundColor: palette.background }]} />;
  if (ids.length === 0) {
    return (
      <View style={[styles.fill, styles.content, { backgroundColor: palette.background }]}>
        <Stack.Screen options={{ title: 'Review pictures' }} />
        <Text style={[styles.name, { color: palette.text }]}>Nothing to review right now</Text>
        <Text style={[styles.credit, { color: palette.muted }]}>New pictures will appear here when they are found.</Text>
      </View>
    );
  }

  const id = ids[index];
  const img = CANDIDATES[id];
  const species = speciesById(id)!;
  const answered = ids.filter((other) => votes[keyOf(other)]).length;
  const count = (v: Vote) => ids.filter((other) => votes[keyOf(other)] === v).length;
  const caption = imageCaption(img, species.name.split(' ')[0]);
  const ratio = Math.min(2, Math.max(0.75, img.width / img.height));

  const answer = (vote: Vote) => {
    const next = { ...votes, [keyOf(id)]: vote };
    setVotes(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    // Move on to the next picture not yet answered (or simply the next one).
    const after = ids.findIndex((other, i) => i > index && !next[keyOf(other)]);
    setIndex(after >= 0 ? after : Math.min(index + 1, ids.length - 1));
  };

  const send = () => {
    Share.share({ message: resultsText(ids, votes) }).catch(() => setShowText(true));
  };

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
      <Stack.Screen options={{ title: 'Review pictures' }} />

      <Text style={[styles.progress, { color: palette.muted }]}>
        Picture {index + 1} of {ids.length} · {answered} answered ({count('yes')} yes, {count('outdated')} outdated, {count('no')} no)
      </Text>

      <Image
        source={{ uri: img.thumb }}
        style={[styles.image, { aspectRatio: ratio }]}
        contentFit="contain"
        transition={150}
        cachePolicy="memory-disk"
        recyclingKey={id}
        accessibilityLabel={`Candidate picture for ${species.name}`}
      />

      <Text style={[styles.name, { color: palette.text }]}>
        <Text style={styles.italic}>{species.name}</Text>
        {species.common && species.common !== species.name ? ` · ${species.common}` : ''}
      </Text>
      {!!caption && <Text style={[styles.caption, { color: palette.muted }]}>{caption}</Text>}
      <Text style={[styles.credit, { color: palette.muted }]}>
        {img.artist} · {img.license} ·{' '}
        <Text style={styles.link} onPress={() => open(img.source)} accessibilityRole="link">
          Source
        </Text>
      </Text>
      {votes[keyOf(id)] && <Text style={[styles.current, { color: palette.text }]}>Your answer: {votes[keyOf(id)]}</Text>}

      <View style={styles.votes}>
        {VOTES.map((v) => (
          <Pressable
            key={v.vote}
            onPress={() => answer(v.vote)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.vote, { backgroundColor: v.colour }, pressed && styles.pressed]}>
            <Text style={styles.voteText}>{v.label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.hint, { color: palette.muted }]}>
        “Outdated” means the restoration no longer matches the science (for example scaly raptors or an old-style Spinosaurus).
      </Text>

      <View style={styles.nav}>
        <Pressable
          onPress={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          accessibilityRole="button"
          style={({ pressed }) => [styles.navButton, { borderColor: palette.border }, pressed && styles.pressed]}>
          <Text style={[styles.navText, { color: palette.text }]}>‹ Back</Text>
        </Pressable>
        <Pressable
          onPress={() => setIndex(Math.min(ids.length - 1, index + 1))}
          accessibilityRole="button"
          style={({ pressed }) => [styles.navButton, { borderColor: palette.border }, pressed && styles.pressed]}>
          <Text style={[styles.navText, { color: palette.text }]}>Skip ›</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={send}
        accessibilityRole="button"
        style={({ pressed }) => [styles.send, pressed && styles.pressed]}>
        <Text style={styles.sendText}>Send my answers</Text>
      </Pressable>
      <Pressable onPress={() => setShowText((s) => !s)} accessibilityRole="button">
        <Text style={[styles.link, styles.toggle]}>{showText ? 'Hide answers as text' : 'Show answers as text'}</Text>
      </Pressable>
      {showText && (
        <Text selectable style={[styles.results, { color: palette.text, borderColor: palette.border }]}>
          {resultsText(ids, votes)}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 16, gap: 8 },
  progress: { fontSize: 13 },
  image: { width: '100%', borderRadius: 12, backgroundColor: '#141A26' },
  name: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  italic: { fontStyle: 'italic' },
  caption: { fontSize: 13, fontStyle: 'italic' },
  credit: { fontSize: 13 },
  current: { fontSize: 14, fontWeight: '600' },
  votes: { flexDirection: 'row', gap: 8, marginTop: 8 },
  vote: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  voteText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  hint: { fontSize: 12, lineHeight: 17 },
  nav: { flexDirection: 'row', gap: 8, marginTop: 4 },
  navButton: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  navText: { fontSize: 15, fontWeight: '600' },
  send: { marginTop: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#3D8BFD' },
  sendText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  link: { color: '#3D8BFD' },
  toggle: { textAlign: 'center', paddingVertical: 8, fontSize: 14 },
  results: { fontSize: 12, borderWidth: 1, borderRadius: 8, padding: 10 },
});
