export type HeroImage = {
  src: string;
  alt: string;
};

/** Plain, serialisable product data passed from the server to the hero client component. */
export type HeroProduct = {
  id: string;
  slug: string;
  name: string;
  composition: string;
  dosageForm?: string;
  packSize?: string;
  /** Short use shown in the product info block, e.g. "Nerve pain relief". */
  keyUse?: string;
  therapeuticArea?: string;
  therapeuticAreaDescription?: string;
  /** Transparent bottle/pack cut-out (3:4). Sanity `heroImage`, or a static bottle fallback. */
  image: HeroImage;
};
