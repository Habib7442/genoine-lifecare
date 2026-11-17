import type { HeroProduct } from "./types";

/** Static hero copy. Move to `siteSettings` in Phase 2 so the client can edit it. */
export const HERO_HEADLINE = ["Quality you", "can trust"] as const;

// TODO: confirm with client. Only show certifications the manufacturer actually holds.
export const HERO_TRUST_TEXT = "WHO-GMP certified manufacturing";

export const HERO_BACKGROUND = {
  desktop: "/hero/hero-bg.webp",
  /** Optional portrait crop for phones. Used only if the file exists in /public. */
  mobile: "/hero/hero-bg-mobile.webp",
};

export const HERO_PRODUCTS_LINK = { label: "View all products", href: "/products" };

/** Static product cut-outs (3:4, transparent), used until a product has a `heroImage` in Sanity. */
export const HERO_BOTTLES = [
  "/hero/gastro-care-bottle.webp",
  "/hero/womens-care-bottle.webp",
  "/hero/kids-care-syrup.webp",
  "/hero/wellness-bottle.webp",
] as const;

export function fallbackBottle(index: number): string {
  return HERO_BOTTLES[index % HERO_BOTTLES.length];
}

/** Side-card line when a therapeutic area has no description in Sanity. */
export function defaultAreaDescription(area: string): string {
  return `Explore our ${area.toLowerCase()} range.`;
}

/**
 * Shown when Sanity has no featured products (or is not configured yet).
 * Deliberately generic "Sample" names: never present placeholders as real products.
 */
export const FALLBACK_HERO_PRODUCTS: HeroProduct[] = [
  // Each sample matches what is printed on its bottle image (form + pack).
  {
    id: "sample-product-a",
    slug: "sample-product-a",
    name: "Sample Product A",
    composition: "Pantoprazole 40mg + Domperidone 10mg",
    dosageForm: "Tablet",
    packSize: "30 tablets",
    keyUse: "Acidity and reflux",
    therapeuticArea: "Gastro care",
    therapeuticAreaDescription: "Our range for digestive care.",
    image: { src: fallbackBottle(0), alt: "Sample Product A gastro care tablet bottle" },
  },
  {
    id: "sample-product-b",
    slug: "sample-product-b",
    name: "Sample Product B",
    composition: "Omega-3 + Folic Acid + Vitamin D3",
    dosageForm: "Softgel",
    packSize: "30 softgels",
    keyUse: "Women's nutrition",
    therapeuticArea: "Women's care",
    therapeuticAreaDescription: "Our range for women's health.",
    image: { src: fallbackBottle(1), alt: "Sample Product B women's care softgel bottle" },
  },
  {
    id: "sample-product-c",
    slug: "sample-product-c",
    name: "Sample Product C",
    composition: "Paracetamol 250mg / 5ml",
    dosageForm: "Syrup",
    packSize: "100 ml",
    keyUse: "Fever in children",
    therapeuticArea: "Kids care",
    therapeuticAreaDescription: "Our range for children's health.",
    image: { src: fallbackBottle(2), alt: "Sample Product C kids care syrup bottle" },
  },
  {
    id: "sample-product-d",
    slug: "sample-product-d",
    name: "Sample Product D",
    composition: "Multivitamin + Multimineral",
    dosageForm: "Capsule",
    packSize: "30 capsules",
    keyUse: "Daily nutrition",
    therapeuticArea: "Wellness",
    therapeuticAreaDescription: "Our range for everyday wellness.",
    image: { src: fallbackBottle(3), alt: "Sample Product D wellness capsule bottle" },
  },
];
