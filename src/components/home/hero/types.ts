import type { HeroShowcaseEntry } from "@/content/heroShowcase";

/** A hero showcase bottle plus the number of Sanity products in its speciality. */
export type HeroShowcaseItem = HeroShowcaseEntry & {
  /** 0 hides "Explore N products". */
  productCount: number;
};
