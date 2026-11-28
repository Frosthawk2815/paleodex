// Bone War: animals that borrow another animal's traced skull (one with no skull of its own to draw,
// or a close relative the owner chose to share a drawing with)
// from src/lib/bone-war-traced.ts, for their armour and attacks once that one has been drawn.

export const SKULL_STAND_INS: Record<string, string> = {
  // Known only from hips, vertebrae and ribs, and probably Triceratops itself.
  'agathaumas-sylvestris': 'triceratops-horridus',
  // A close relative of Pentaceratops; the owner chose to use its skull.
  'bisticeratops-froeseorum': 'pentaceratops-sternbergii',
  // Known only from two brow horn cores and part of the back of the skull. The horn cores can't be
  // told apart from Albertaceratops's (Mallon et al. 2016), a long-horned relative from the same rocks
  // and age; an older study (Penkalski & Dodson 1999) linked it to Avaceratops instead.
  'ceratops-montanus': 'albertaceratops-nesmoi',
};

// The species whose traced skull this animal uses.
export const skullOf = (speciesId: string) => SKULL_STAND_INS[speciesId] ?? speciesId;
