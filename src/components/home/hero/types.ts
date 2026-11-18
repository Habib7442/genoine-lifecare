import type { HeroShowcaseEntry } from "@/content/heroShowcase";

/** A hero showcase bottle plus the number of Sanity products in its speciality. */
/** A real product from Sanity shown in the hero's glass card. */
export type HeroFeaturedProduct = {
  name: string;
  slug: string;
  dosageForm?: string;
  packSize?: string;
  image?: { src: string; alt: string };
};

export type HeroShowcaseItem = HeroShowcaseEntry & {
  /** Products in this speciality ("Explore N products" from 3 up). */
  productCount: number;
  /** First featured product in the speciality (else the first product); none hides the card. */
  featured?: HeroFeaturedProduct;
};
