// Bone War: animals that borrow another animal's traced skull (one with no skull of its own to draw,
// or a close relative the owner chose to share a drawing with)
// from src/lib/bone-war-traced.ts, for their armour and attacks once that one has been drawn.

export const SKULL_STAND_INS: Record<string, string> = {
  // Known only from hips, vertebrae and ribs, and probably Triceratops itself.
  'agathaumas-sylvestris': 'triceratops-horridus',
  // A close relative of Pentaceratops; the owner chose to use its skull.
  'bisticeratops-froeseorum': 'pentaceratops-sternbergii',
};

// The species whose traced skull this animal uses.
export const skullOf = (speciesId: string) => SKULL_STAND_INS[speciesId] ?? speciesId;
