// Moves present-day coastlines back to where they were at a given time, using the
// plate rotation model (Merdith et al. 2021). This mirrors how GPlates reconstructs
// features by plate ID: each plate's rotation is interpolated between the model's
// finite rotations, then chained through its fixed plates down to the anchor plate 0.

import coastlinesData from '@/data/globe/coastlines.json';
import rotationsData from '@/data/globe/rotations.json';

type Quat = [number, number, number, number]; // w, x, y, z
type Sample = number[]; // [time, poleLat, poleLon, angle]
type Sequence = { f: number; s: Sample[] };
type Coastline = { p: number; b: number | null; e: number; r: number[] };

const ROTATIONS = rotationsData as unknown as Record<string, Sequence[]>;
const COASTLINES = coastlinesData as unknown as Coastline[];
const SCALE = 100;
const DEG = Math.PI / 180;
const IDENTITY: Quat = [1, 0, 0, 0];

// Present-day coastline points as unit vectors, computed once.
const COAST_XYZ = COASTLINES.map((c) => {
  const out = new Float64Array((c.r.length / 2) * 3);
  for (let i = 0, j = 0; i < c.r.length; i += 2, j += 3) {
    const lon = (c.r[i] / SCALE) * DEG;
    const lat = (c.r[i + 1] / SCALE) * DEG;
    out[j] = Math.cos(lat) * Math.cos(lon);
    out[j + 1] = Math.cos(lat) * Math.sin(lon);
    out[j + 2] = Math.sin(lat);
  }
  return out;
});

function fromPole(lat: number, lon: number, angle: number): Quat {
  const la = lat * DEG;
  const lo = lon * DEG;
  const h = (angle * DEG) / 2;
  const s = Math.sin(h);
  return [Math.cos(h), s * Math.cos(la) * Math.cos(lo), s * Math.cos(la) * Math.sin(lo), s * Math.sin(la)];
}

function multiply(a: Quat, b: Quat): Quat {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}

function slerp(a: Quat, b: Quat, t: number): Quat {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let bb = b;
  if (dot < 0) {
    dot = -dot;
    bb = [-b[0], -b[1], -b[2], -b[3]];
  }
  if (dot > 0.9999995) {
    const q: Quat = [a[0] + t * (bb[0] - a[0]), a[1] + t * (bb[1] - a[1]), a[2] + t * (bb[2] - a[2]), a[3] + t * (bb[3] - a[3])];
    const n = Math.hypot(...q);
    return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
  }
  const theta = Math.acos(dot);
  const s = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / s;
  const wb = Math.sin(t * theta) / s;
  return [wa * a[0] + wb * bb[0], wa * a[1] + wb * bb[1], wa * a[2] + wb * bb[2], wa * a[3] + wb * bb[3]];
}

// Rotation of a plate relative to its fixed plate at `time`, or undefined if the model has none.
function relativeRotation(plate: number, time: number): { q: Quat; fixed: number } | undefined {
  const sequences = ROTATIONS[plate];
  if (!sequences) return undefined;
  for (const seq of sequences) {
    const s = seq.s;
    if (time < s[0][0] || time > s[s.length - 1][0]) continue;
    for (let i = 0; i < s.length - 1; i++) {
      const [t0, la0, lo0, a0] = s[i];
      const [t1, la1, lo1, a1] = s[i + 1];
      if (time >= t0 && time <= t1) {
        const f = t1 === t0 ? 0 : (time - t0) / (t1 - t0);
        return { q: slerp(fromPole(la0, lo0, a0), fromPole(la1, lo1, a1), f), fixed: seq.f };
      }
    }
    if (s.length === 1 && time === s[0][0]) return { q: fromPole(s[0][1], s[0][2], s[0][3]), fixed: seq.f };
  }
  return undefined;
}

// Total rotation of a plate relative to the anchor plate (0) at a given time.
export function plateRotation(plate: number, time: number, cache = new Map<number, Quat>(), depth = 0): Quat {
  if (plate === 0 || depth > 64) return IDENTITY;
  const hit = cache.get(plate);
  if (hit) return hit;
  const rel = relativeRotation(plate, time);
  const q = rel ? multiply(plateRotation(rel.fixed, time, cache, depth + 1), rel.q) : IDENTITY;
  cache.set(plate, q);
  return q;
}

function rotate(q: Quat, x: number, y: number, z: number): [number, number, number] {
  const [w, qx, qy, qz] = q;
  // v' = v + 2w(q×v) + 2q×(q×v)
  const cx = qy * z - qz * y;
  const cy = qz * x - qx * z;
  const cz = qx * y - qy * x;
  return [
    x + 2 * (w * cx + qy * cz - qz * cy),
    y + 2 * (w * cy + qz * cx - qx * cz),
    z + 2 * (w * cz + qx * cy - qy * cx),
  ];
}

export function rotatePoint(q: Quat, lon: number, lat: number): [number, number] {
  const la = lat * DEG;
  const lo = lon * DEG;
  const [x, y, z] = rotate(q, Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la));
  return [Math.atan2(y, x) / DEG, Math.asin(Math.max(-1, Math.min(1, z))) / DEG];
}

export type Ring = [number, number][]; // [lon, lat]

// All coastline polygons that existed at `time`, moved to their positions then.
export function reconstructCoastlines(time: number): Ring[] {
  const cache = new Map<number, Quat>();
  const rings: Ring[] = [];
  COASTLINES.forEach((c, idx) => {
    if (c.e > time || (c.b !== null && c.b < time)) return;
    const q = plateRotation(c.p, time, cache);
    const xyz = COAST_XYZ[idx];
    const ring: Ring = [];
    for (let j = 0; j < xyz.length; j += 3) {
      const [x, y, z] = rotate(q, xyz[j], xyz[j + 1], xyz[j + 2]);
      ring.push([Math.atan2(y, x) / DEG, Math.asin(Math.max(-1, Math.min(1, z))) / DEG]);
    }
    ring.push(ring[0]);
    rings.push(ring);
  });
  return rings;
}

// Average position of the land at `time`, used to turn the globe towards the continents.
export function landCentre(rings: Ring[]): [number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
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
