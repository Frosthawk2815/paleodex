import { useEffect, useRef } from 'react';

import { useToast } from '@/components/toast';
import { useProfile } from '@/lib/profile';
import { levelOf, tallyOf } from '@/lib/points';
import { earnedTitles } from '@/lib/titles';
import { useUserPhotos } from '@/lib/user-photos';

// Watches the profile for new titles and levels: saves titles as they are earned, and shows a
// notice for each new title and each new level.
export function AchievementWatcher() {
  const { profile, update, loaded } = useProfile();
  const { allPhotos } = useUserPhotos();
  const toast = useToast();
  const lastLevel = useRef<number | null>(null);
  const photoSpecies = new Set(allPhotos.map((p) => p.speciesId)).size;
  const { visited, favourites, titles } = profile;

  useEffect(() => {
    if (!loaded) return;
    const points = tallyOf(visited);
    const level = levelOf(points);
    // The level on opening the app is the starting point; only later rises get a notice.
    if (lastLevel.current !== null && level.level > lastLevel.current) {
      toast({ icon: '⭐', title: `Level ${level.level} reached`, detail: `${level.title} · new title unlocked` });
    }
    lastLevel.current = level.level;

    const fresh = earnedTitles({ visited: new Set(visited), favourites: favourites.length, photoSpecies, points }).filter((t) => !titles.includes(t.id));
    if (fresh.length === 0) return;
    update({ titles: [...titles, ...fresh.map((t) => t.id)] });
    // Level titles are announced with the level itself.
    for (const t of fresh) if (t.level === undefined) toast({ icon: '🏆', title: 'Title earned', detail: t.name });
  }, [loaded, visited, favourites.length, photoSpecies, titles, update, toast]);

  return null;
}
