import { useEffect, useRef } from 'react';

import { useToast } from '@/components/toast';
import { useProfile } from '@/lib/profile';
import { levelOf, tallyOf } from '@/lib/points';
import { earnedTitles } from '@/lib/titles';
import { useUserPhotos } from '@/lib/user-photos';
import { useT } from '@/lib/i18n';

// Watches the profile for new titles and levels: saves titles as they are earned, and shows a
// notice for each new title and each new level.
export function AchievementWatcher() {
  const t = useT();
  const { profile, update, loaded } = useProfile();
  const { allPhotos } = useUserPhotos();
  const toast = useToast();
  const lastLevel = useRef<number | null>(null);
  const photoSpecies = new Set(allPhotos.map((p) => p.speciesId)).size;
  const { visited, favourites, titles, places } = profile;

  useEffect(() => {
    if (!loaded) return;
    const points = tallyOf(visited);
    const level = levelOf(points);
    // The level on opening the app is the starting point; only later rises get a notice.
    if (lastLevel.current !== null && level.level > lastLevel.current) {
      toast({ icon: '⭐', title: t('Level {n} reached', { n: level.level }), detail: t('{title} · new title unlocked', { title: t(level.title) }) });
    }
    lastLevel.current = level.level;

    const fresh = earnedTitles({ visited: new Set(visited), favourites: favourites.length, photoSpecies, points, places: new Set(places) }).filter((t) => !titles.includes(t.id));
    if (fresh.length === 0) return;
    update({ titles: [...titles, ...fresh.map((ti) => ti.id)] });
    // Level titles are announced with the level itself.
    for (const ti of fresh) if (ti.level === undefined) toast({ icon: '🏆', title: t('Title earned'), detail: ti.name });
  }, [loaded, visited, favourites.length, photoSpecies, titles, places, update, toast, t]);

  return null;
}
