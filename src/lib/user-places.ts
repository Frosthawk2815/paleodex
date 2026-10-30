// The user's own places, their birthplace and home, which ride their tectonic plate back through
// time on the globe. Like check-ins, these are kept only on the device and can be deleted.

import cityData from '@/data/cities.json';
import plateGrid from '@/data/globe/plate-grid.json';
import { siteAt } from '@/lib/plates';

// lat/lon rounded to two decimals (about 1 km), which is plenty for a globe and keeps less detail.
export type UserPlace = { label: string; lat: number; lon: number; plate: number };

type City = [name: string, region: string, country: string, lat: number, lon: number];
const CITIES = cityData as City[];

const GRID = plateGrid as { res: number; rows: number[][] };

// The tectonic plate under a present-day point.
export function plateAt(lat: number, lon: number): number {
  const row = GRID.rows[Math.min(GRID.rows.length - 1, Math.max(0, Math.floor((90 - lat) / GRID.res)))]!;
  let col = Math.floor((((lon + 180) % 360) + 360) % 360 / GRID.res);
  for (let i = 0; i < row.length; i += 2) {
    if (col < row[i + 1]!) return row[i]!;
    col -= row[i + 1]!;
  }
  return row[row.length - 2]!;
}

const round = (v: number) => Math.round(v * 100) / 100;

export function makePlace(label: string, lat: number, lon: number): UserPlace {
  return { label, lat: round(lat), lon: round(lon), plate: plateAt(lat, lon) };
}

const cityLabel = (c: City) => [c[0], c[1] && c[1] !== c[0] ? c[1] : '', c[2]].filter(Boolean).join(', ');

// Towns and cities whose name starts with (then contains) the search, biggest first.
export function searchCities(query: string, limit = 8): { label: string; lat: number; lon: number }[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts = CITIES.filter((c) => c[0].toLowerCase().startsWith(q));
  const contains = starts.length >= limit ? [] : CITIES.filter((c) => !c[0].toLowerCase().startsWith(q) && cityLabel(c).toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, limit).map((c) => ({ label: cityLabel(c), lat: c[3], lon: c[4] }));
}

// The nearest town or city, to name a place found from the device's location.
export function nearestCity(lat: number, lon: number): string {
  let best: City | undefined;
  let bestD = Infinity;
  const k = Math.cos((lat * Math.PI) / 180);
  for (const c of CITIES) {
    const d = (c[3] - lat) ** 2 + ((c[4] - lon) * k) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best ? `Near ${cityLabel(best)}` : 'Your location';
}

// Where a place was at a time in the past (lon, lat).
export const userPlaceAt = (p: UserPlace, ma: number) => siteAt(p, ma);
