/**
 * Home hero showcase: static design bottles (assets in /public/hero), not Sanity products.
 * Each bottle represents a speciality; "View products" links to /products?area=<areaSlug>,
 * and the product count for that area comes from Sanity at render time.
 */
export type HeroShowcaseEntry = {
  id: string;
  /** Speciality shown in the hero info block, e.g. "Gastro care". */
  title: string;
  /** One short, plain line (no health claims). */
  line: string;
  /** Therapeutic area slug in Sanity (for the link and the product count). */
  areaSlug: string;
  /** 3D speciality icon (same files as the "Find care by speciality" tiles). */
  icon: string;
  image: { src: string; alt: string };
};

export const HERO_SHOWCASE: HeroShowcaseEntry[] = [
  {
    id: "gastro-care",
    title: "Gastro care",
    line: "Acidity, reflux and digestion",
    areaSlug: "gastro",
    icon: "/specialities/gastro.webp",
    image: { src: "/hero/gastro-care-bottle.webp", alt: "Gastro care bottle" },
  },
  {
    id: "womens-care",
    title: "Women's care",
    line: "Women's and reproductive health",
    areaSlug: "gynae",
    icon: "/specialities/gynae.webp",
    image: { src: "/hero/womens-care-bottle.webp", alt: "Women's care bottle" },
  },
  {
    id: "kids-care",
    title: "Kids care",
    line: "Care for infants and children",
    areaSlug: "paediatric",
    icon: "/specialities/paediatric.webp",
    image: { src: "/hero/kids-care-syrup.webp", alt: "Kids care syrup bottle" },
  },
  {
    id: "wellness",
    title: "Wellness",
    line: "Vitamins and daily wellness",
    areaSlug: "nutraceuticals",
    icon: "/specialities/nutraceuticals.webp",
    image: { src: "/hero/wellness-bottle.webp", alt: "Wellness capsule bottle" },
  },
];
