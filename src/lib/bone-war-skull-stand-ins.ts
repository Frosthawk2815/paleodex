// Bone War: animals with no skull of their own to draw, which borrow another animal's traced skull
// (from src/lib/bone-war-traced.ts) for their armour and attacks once that one has been drawn.

export const SKULL_STAND_INS: Record<string, string> = {
  // Known only from hips, vertebrae and ribs, and probably Triceratops itself.
  'agathaumas-sylvestris': 'triceratops-horridus',
};

// The species whose traced skull this animal uses.
export const skullOf = (speciesId: string) => SKULL_STAND_INS[speciesId] ?? speciesId;
