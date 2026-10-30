// Real places the user can visit in person to earn titles: natural history museums, accredited
// zoos, and the fossil sites (rock formations) in PaleoDex. Checking in compares the user's
// location, read once when they tap Check in, with these places. Nothing leaves the device.

import placeData from '@/data/places.json';
import { EVENTS } from '@/data/events';

export type PlaceKind = 'museum' | 'zoo' | 'site';
// spot names the public access point a fossil site was checked in at, when it isn't the main one.
export type Place = { id: string; kind: PlaceKind; name: string; spot?: string; country?: string; lat: number; lon: number; accreditation?: string };

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

// Extra check-in points for formations that stretch across whole regions: well-known public
// places (parks, visitor centres, museums built on the rock) where people see that formation, so
// a visit there counts even far from the formation's main map point.
export const ACCESS_POINTS: Record<string, { spot: string; lat: number; lon: number }[]> = {
  morrison: [
    { spot: 'Dinosaur Ridge, Colorado', lat: 39.677, lon: -105.195 },
    { spot: 'Garden Park Fossil Area, Colorado', lat: 38.53, lon: -105.22 },
    { spot: 'Rabbit Valley, Colorado', lat: 39.183, lon: -109.017 },
    { spot: 'Jurassic National Monument (Cleveland-Lloyd Quarry), Utah', lat: 39.323, lon: -110.688 },
    { spot: 'Wyoming Dinosaur Center, Thermopolis', lat: 43.646, lon: -108.213 },
    { spot: 'Como Bluff, Wyoming', lat: 41.87, lon: -106.08 },
  ],
  'hell-creek': [
    { spot: 'Makoshika State Park, Montana', lat: 47.08, lon: -104.69 },
    { spot: 'Fort Peck Interpretive Center, Montana', lat: 48.0, lon: -106.45 },
    { spot: 'Marmarth, North Dakota', lat: 46.296, lon: -103.92 },
  ],
  chinle: [
    { spot: 'Petrified Forest National Park, Arizona', lat: 34.98, lon: -109.79 },
    { spot: 'Capitol Reef National Park, Utah', lat: 38.29, lon: -111.26 },
  ],
  'judith-river': [{ spot: 'Phillips County Museum, Malta, Montana', lat: 48.36, lon: -107.87 }],
  wahweap: [{ spot: 'Big Water Visitor Center, Utah', lat: 37.08, lon: -111.66 }],
  kaiparowits: [{ spot: 'Escalante Interagency Visitor Center, Utah', lat: 37.77, lon: -111.61 }],
  niobrara: [{ spot: 'Sternberg Museum of Natural History, Hays, Kansas', lat: 38.9, lon: -99.3 }],
  'white-river': [{ spot: 'Toadstool Geologic Park, Nebraska', lat: 42.86, lon: -103.58 }],
  chalk: [
    { spot: 'Seven Sisters and Birling Gap, Sussex', lat: 50.743, lon: 0.2 },
    { spot: 'Flamborough Head, Yorkshire', lat: 54.116, lon: -0.08 },
  ],
  muschelkalk: [{ spot: 'Muschelkalkmuseum, Ingelfingen', lat: 49.3, lon: 9.65 }],
  lameta: [{ spot: 'Balasinor Dinosaur Fossil Park, Raiyoli, Gujarat', lat: 22.97, lon: 73.36 }],
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
    .map((p): Place => ({ id: `site-${e.id}`, kind: 'site', name: e.title, lat: p.lat, lon: p.lon }))
    .concat((ACCESS_POINTS[e.id] ?? []).map((a) => ({ id: `site-${e.id}`, kind: 'site', name: e.title, spot: a.spot, lat: a.lat, lon: a.lon })));
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
  // One entry per place, at its closest point.
  return { here: [...new Map([...here].reverse().map((d) => [d.place.id, d])).values()].reverse(), nearest };
}

export const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m)} m` : m < 100000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 1000).toLocaleString()} km`);
