import IMAGE_DATA from '@/data/images.json';

// A freely licensed picture of a species, with what's needed to credit it.
// Filled by tools/images/fetch_images.py from Wikipedia lead images and Wikimedia Commons.
export type SpeciesImage = {
  thumb: string;
  width: number;
  height: number;
  artist: string;
  license: string;
  licenseUrl?: string | null;
  // The file's page on Wikimedia Commons (or Wikipedia), where the image was found.
  source: string;
  file: string;
  // The Wikipedia article whose lead image this is.
  article: string;
  // 'genus' when the picture comes from the genus article, so it may show a related species.
  scope: 'species' | 'genus';
  // What the picture shows, when its description says.
  kind?: 'restoration' | 'skeletal' | 'fossil';
};

const IMAGES = IMAGE_DATA as Record<string, SpeciesImage>;

export const imageOf = (speciesId: string): SpeciesImage | undefined => IMAGES[speciesId];
export const allImages = (): [string, SpeciesImage][] => Object.entries(IMAGES);

// A short note on what the picture is, flagging artists' restorations as interpretation.
export function imageCaption(img: SpeciesImage, genus: string): string | undefined {
  const what =
    img.kind === 'restoration'
      ? 'Life restoration: an artist’s interpretation'
      : img.kind === 'skeletal'
        ? 'Skeletal reconstruction'
        : img.kind === 'fossil'
          ? 'Fossil specimen'
          : undefined;
  const scope = img.scope === 'genus' ? `Picture of the genus ${genus}; it may show a related species` : undefined;
  return [what, scope].filter(Boolean).join(' · ') || undefined;
}
