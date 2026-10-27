// Earth–Moon distance through time, extrapolated linearly from today's value.
// Lunar laser ranging measures the Moon moving away at about 3.8 cm per year.
// The real rate has varied over Earth's history, so older values are only a rough guide.

export const EARTH_RADIUS_KM = 6371;
export const MOON_RADIUS_KM = 1737.4;
export const MOON_DISTANCE_TODAY_KM = 384_400;
export const RECESSION_CM_PER_YEAR = 3.8;

export function moonDistanceKm(timeMa: number): number {
  const years = timeMa * 1_000_000;
  return MOON_DISTANCE_TODAY_KM - (years * RECESSION_CM_PER_YEAR) / 100_000;
}
