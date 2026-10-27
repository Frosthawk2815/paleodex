// The Chicxulub asteroid impact that ended the Cretaceous (the K/T, or K–Pg, boundary).
export const IMPACT_MA = 66.0;

// The asteroid is drawn from the boundary to a little before it, so it can be found on the timeline.
export function asteroidVisible(timeMa: number): boolean {
  return timeMa >= IMPACT_MA && timeMa <= IMPACT_MA + 0.6;
}
