// Plate rotations from the PALEOMAP Global Plate Model v2d3 (Scotese 2016), the model the
// PaleoDEM maps were built on. This mirrors how GPlates moves features by plate ID: each
// plate's rotation is interpolated between the model's finite rotations, then chained
// through its fixed plates down to the anchor plate 0.

import rotationsData from '@/data/globe/rotations.json';

export type Quat = [number, number, number, number]; // w, x, y, z
type Sample = number[]; // [time, poleLat, poleLon, angle]
type Sequence = { f: number; s: Sample[] };

const ROTATIONS = rotationsData as unknown as Record<string, Sequence[]>;
export const DEG = Math.PI / 180;
const IDENTITY: Quat = [1, 0, 0, 0];

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

export function rotate(q: Quat, x: number, y: number, z: number): [number, number, number] {
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

// Chicxulub crater, Yucatán (present-day centre), on plate 205 in the PALEOMAP model.
const CHICXULUB = { lon: -89.5, lat: 21.4, plate: 205 };

// Where the Chicxulub impact site was at `time` (lon, lat).
export function chicxulubAt(time: number): [number, number] {
  return rotatePoint(plateRotation(CHICXULUB.plate, time), CHICXULUB.lon, CHICXULUB.lat);
}
