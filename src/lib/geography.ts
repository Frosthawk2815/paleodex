// Land and shallow seas through time.
//
// Before the Quaternary the maps come from the PALEOMAP PaleoDEMs (Scotese & Wright 2018), one
// every 5 million years; the nearest map is used and its pieces ride on their plates, so the
// continents move smoothly while coastlines change every 5 million years.
//
// In the Quaternary (the last 2.58 million years) the modern map is used at the sea level of the
// time, from a sea-level curve (Spratt & Lisiecki 2016; Bintanja & van de Wal 2008 before 798 ka).
// That is what exposes land bridges such as Doggerland during ice ages.

import paleoData from '@/data/globe/paleogeography.json';
import seaLevelData from '@/data/globe/sealevel.json';
import { DEG, plateRotation, type Quat, rotate } from '@/lib/plates';

export const QUATERNARY_MA = 2.58;

type RawPolygon = (number | string)[]; // [plate, exterior ring, ...holes]; rings are base64
type Layer = RawPolygon[];
type Slice = { age: number; land: Layer; shelf: Layer };
type SeaLevelStep = { minSeaLevel: number; land: Layer; shelf: Layer };

const DATA = paleoData as unknown as { slices: Slice[]; quaternary: SeaLevelStep[] };
const SEA_LEVEL = seaLevelData as { stepKa: number; metres: number[] };

export type Ring = [number, number][]; // [lon, lat]
export type Polygon = Ring[]; // exterior then holes

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_INDEX = new Uint8Array(128);
for (let i = 0; i < B64.length; i++) B64_INDEX[B64.charCodeAt(i)] = i;

// A ring is int16 little-endian values in hundredths of a degree: the first point, then deltas.
// Returns the raw bytes.
function ringBytes(s: string): Uint8Array {
  const len = s.length;
  const pad = s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0;
  const bytes = new Uint8Array((len / 4) * 3 - pad);
  for (let i = 0, j = 0; i < len; i += 4) {
    const n =
      (B64_INDEX[s.charCodeAt(i)] << 18) |
      (B64_INDEX[s.charCodeAt(i + 1)] << 12) |
      (B64_INDEX[s.charCodeAt(i + 2)] << 6) |
      B64_INDEX[s.charCodeAt(i + 3)];
    if (j < bytes.length) bytes[j++] = (n >> 16) & 255;
    if (j < bytes.length) bytes[j++] = (n >> 8) & 255;
    if (j < bytes.length) bytes[j++] = n & 255;
  }
  return bytes;
}

// Decodes a ring to its points as [lon, lat] in degrees, closed (last point = first).
export function decodeLonLatRing(s: string): Ring {
  const bytes = ringBytes(s);
  const ring: Ring = [];
  let x = 0;
  let y = 0;
  for (let k = 0; k < bytes.length / 4; k++) {
    let dx = bytes[k * 4] | (bytes[k * 4 + 1] << 8);
    let dy = bytes[k * 4 + 2] | (bytes[k * 4 + 3] << 8);
    if (dx > 32767) dx -= 65536;
    if (dy > 32767) dy -= 65536;
    x += dx;
    y += dy;
    ring.push([(((x / 100 + 540) % 360) - 180), y / 100]);
  }
  if (ring.length > 0) ring.push(ring[0]);
  return ring;
}

// Decodes a ring to its points as unit vectors (x, y, z per point).
function decodeRing(s: string): Float64Array {
  const bytes = ringBytes(s);
  const count = bytes.length / 4;
  const out = new Float64Array(count * 3);
  let x = 0;
  let y = 0;
  for (let k = 0; k < count; k++) {
    let dx = bytes[k * 4] | (bytes[k * 4 + 1] << 8);
    let dy = bytes[k * 4 + 2] | (bytes[k * 4 + 3] << 8);
    if (dx > 32767) dx -= 65536;
    if (dy > 32767) dy -= 65536;
    x += dx;
    y += dy;
    const lon = (x / 100) * DEG;
    const lat = (y / 100) * DEG;
    out[k * 3] = Math.cos(lat) * Math.cos(lon);
    out[k * 3 + 1] = Math.cos(lat) * Math.sin(lon);
    out[k * 3 + 2] = Math.sin(lat);
  }
  return out;
}

type Decoded = { plate: number; rings: Float64Array[] }[];
const decoded = new Map<Layer, Decoded>();

function decodeLayer(layer: Layer): Decoded {
  let d = decoded.get(layer);
  if (!d) {
    d = layer.map(([plate, ...rings]) => ({ plate: plate as number, rings: (rings as string[]).map(decodeRing) }));
    decoded.set(layer, d);
  }
  return d;
}

function reconstruct(layer: Layer, time: number, cache: Map<number, Quat>): Polygon[] {
  return decodeLayer(layer).map(({ plate, rings }) => {
    const q = plateRotation(plate, time, cache);
    return rings.map((xyz) => {
      const ring: Ring = [];
      for (let j = 0; j < xyz.length; j += 3) {
        const [x, y, z] = rotate(q, xyz[j], xyz[j + 1], xyz[j + 2]);
        ring.push([Math.atan2(y, x) / DEG, Math.asin(Math.max(-1, Math.min(1, z))) / DEG]);
      }
      ring.push(ring[0]);
      return ring;
    });
  });
}

// Global sea level in metres relative to today, for times in the Quaternary.
export function seaLevelAt(timeMa: number): number {
  const values = SEA_LEVEL.metres;
  const pos = Math.min(Math.max((timeMa * 1000) / SEA_LEVEL.stepKa, 0), values.length - 1);
  const i = Math.floor(pos);
  const f = pos - i;
  return i + 1 < values.length ? values[i] * (1 - f) + values[i + 1] * f : values[i];
}

export type Geography = {
  land: Polygon[];
  shelf: Polygon[];
  // Set in the Quaternary: the global sea level used.
  seaLevel?: number;
  // Age of the PaleoDEM map used before the Quaternary.
  mapAge?: number;
};

export function geographyAt(timeMa: number): Geography {
  const cache = new Map<number, Quat>();
  if (timeMa <= QUATERNARY_MA) {
    const seaLevel = seaLevelAt(timeMa);
    const step = DATA.quaternary.find((s) => seaLevel >= s.minSeaLevel) ?? DATA.quaternary[DATA.quaternary.length - 1];
    return { land: reconstruct(step.land, timeMa, cache), shelf: reconstruct(step.shelf, timeMa, cache), seaLevel };
  }
  let slice = DATA.slices[0];
  for (const s of DATA.slices) if (Math.abs(s.age - timeMa) < Math.abs(slice.age - timeMa)) slice = s;
  return { land: reconstruct(slice.land, timeMa, cache), shelf: reconstruct(slice.shelf, timeMa, cache), mapAge: slice.age };
}

// Average position of the land, used to turn the globe towards the continents.
export function landCentre(land: Polygon[]): [number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const polygon of land) {
    for (const [lon, lat] of polygon[0]) {
      const la = lat * DEG;
      const lo = lon * DEG;
      x += Math.cos(la) * Math.cos(lo);
      y += Math.cos(la) * Math.sin(lo);
      z += Math.sin(la);
    }
  }
  const n = Math.hypot(x, y, z) || 1;
  return [Math.atan2(y, x) / DEG, Math.asin(z / n) / DEG];
}
