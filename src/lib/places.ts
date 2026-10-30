// Real places the user can visit in person to earn titles: natural history museums, accredited
// zoos, and the fossil sites (rock formations) in PaleoDex. Checking in compares the user's
// location, read once when they tap Check in, with these places. Nothing leaves the device.

import placeData from '@/data/places.json';
import { EVENTS } from '@/data/events';

export type PlaceKind = 'museum' | 'zoo' | 'site';
export type Place = { id: string; kind: PlaceKind; name: string; country?: string; lat: number; lon: number; accreditation?: string };

const MUSEUMS_AND_ZOOS = placeData as Place[];

// Fossil sites that don't count for check-ins, so no one is tempted to go somewhere dangerous:
// war zones and places under "do not travel" government advisories, the polar regions, and deep
// desert or wilderness that takes a proper expedition to reach.
export const UNSAFE_SITES: Record<string, string> = {
  // Conflict, terrorism or "do not travel" advisories
  elrhaz: 'Niger: do-not-travel advisories, deep Sahara',
  echkar: 'Niger: do-not-travel advisories, deep Sahara',
  farak: 'Niger: do-not-travel advisories, deep Sahara (Spinosaurus mirabilis)',
  'kem-kem': 'Point lies in Algeria on the closed, militarised border with Morocco',
  kachin: 'Myanmar: civil war in Kachin State',
  sannine: 'Lebanon: do-not-travel advisories',
  hadar: 'Afar region, Ethiopia: conflict and extreme heat',
  bahariya: 'Egypt’s Western Desert: do-not-travel advisories',
  kuldana: 'Khyber Pakhtunkhwa, Pakistan: do-not-travel advisories',
  bugti: 'Balochistan, Pakistan: do-not-travel advisories',
  urumaco: 'Venezuela: do-not-travel advisories',
  sokolki: 'Russia: do-not-travel advisories',
  tsagayan: 'Russia: do-not-travel advisories',
  donguz: 'Russia: do-not-travel advisories',
  tendaguru: 'Remote bush near the Mozambique border, an area of insurgent attacks',
  'gres-superieurs': 'Rural Savannakhet, Laos: unexploded bombs off the roads',
  // Polar regions
  hanson: 'Antarctica',
  'lopez-de-bertodano': 'Antarctica',
  'sirius-passet': 'Far north Greenland, reached only by expedition',
  'britta-dal': 'Remote East Greenland',
  fram: 'Ellesmere Island, high Arctic',
  agardhfjellet: 'Svalbard: polar bears outside the settlements',
  'prince-creek': 'Alaska’s North Slope, no roads',
  // Deep desert and wilderness expeditions
  nemegt: 'Remote Gobi, expedition only',
  'barun-goyot': 'Remote Gobi, expedition only',
  'bayan-shireh': 'Remote Gobi, expedition only',
  shishugou: 'Junggar Basin desert, Xinjiang',
  xiagou: 'Remote Gobi in Gansu',
  bissekty: 'Kyzylkum Desert, expedition only',
  sakamena: 'Remote south-western Madagascar with few roads',
  manda: 'Remote Ruhuhu Basin, Tanzania, with no roads',
  'cerro-fortaleza': 'Remote Patagonian steppe, expedition only',
};

// Every other rock formation's present-day location is a fossil site. A formation with several
// localities gives several points with one id.
const SITES: Place[] = EVENTS.filter((e) => e.kind === 'Rock formation' && !UNSAFE_SITES[e.id]).flatMap((e) => {
  const seen = new Set<string>();
  return e.points
    .filter((p) => p.body === 'earth')
    .filter((p) => {
      const k = `${p.lon.toFixed(2)},${p.lat.toFixed(2)}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((p) => ({ id: `site-${e.id}`, kind: 'site' as const, name: e.title, lat: p.lat, lon: p.lon }));
});

export const PLACES: Place[] = [...MUSEUMS_AND_ZOOS, ...SITES];
export const placeById = (id: string) => PLACES.find((p) => p.id === id);
export const MUSEUM_AND_ZOO_LIST = MUSEUMS_AND_ZOOS;

// How close counts as being there, in metres. Fossil sites are whole outcrops, often kilometres
// across, and their points are approximate.
export const RADIUS: Record<PlaceKind, number> = { museum: 400, zoo: 1200, site: 25000 };

// Distance in metres between two points on Earth.
export function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(a));
}

// The places the user is at, allowing for how accurate their location is (up to 500 m), and the
// nearest places of each kind.
export function placesNear(lat: number, lon: number, accuracy: number | null) {
  const slack = Math.min(accuracy ?? 0, 500);
  const withDistance = PLACES.map((p) => ({ place: p, metres: distance(lat, lon, p.lat, p.lon) })).sort((a, b) => a.metres - b.metres);
  const here = withDistance.filter((d) => d.metres <= RADIUS[d.place.kind] + slack);
  // One entry per place (formations can have several points).
  const nearest: typeof withDistance = [];
  for (const d of withDistance) {
    if (nearest.some((n) => n.place.id === d.place.id)) continue;
    nearest.push(d);
    if (nearest.length === 5) break;
  }
  return { here: [...new Map(here.map((d) => [d.place.id, d])).values()], nearest };
}

export const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m)} m` : m < 100000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 1000).toLocaleString()} km`);
