import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { THERAPEUTIC_AREAS_QUERY } from "@/sanity/queries";

import type { SpecialityArea } from "./types";

type AreaResult = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  tint?: string | null;
  icon?: { asset?: { _ref: string } } | null;
  productCount: number;
};

/** Shown until therapeutic areas exist in Sanity. Icons live in /public/specialities/<slug>.webp. */
const FALLBACK_AREAS: { title: string; slug: string }[] = [
  { title: "Gastro", slug: "gastro" },
  { title: "Diabetes", slug: "diabetes" },
  { title: "Cardiac", slug: "cardiac" },
  { title: "Pain & Ortho", slug: "pain-ortho" },
  { title: "Gynae", slug: "gynae" },
  { title: "Paediatric", slug: "paediatric" },
  { title: "Respiratory", slug: "respiratory" },
  { title: "Nutraceuticals", slug: "nutraceuticals" },
];

/** Tile line by slug, used when Sanity has no shortDescription/description for an area. */
const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  gastro: "Acidity, reflux and digestion",
  diabetes: "Blood sugar management",
  cardiac: "Heart and blood pressure care",
  "pain-ortho": "Pain relief, joints and bones",
  gynae: "Women's and reproductive health",
  paediatric: "Care for infants and children",
  respiratory: "Cough, cold and breathing",
  nutraceuticals: "Vitamins and daily wellness",
  urology: "Kidney and urinary tract care",
};

/** Local 3D icon for a slug, if one has been added to /public/specialities. */
function localIcon(slug: string): string | undefined {
  const file = path.join(process.cwd(), "public", "specialities", `${slug}.webp`);
  return existsSync(file) ? `/specialities/${slug}.webp` : undefined;
}

function toArea(result: AreaResult): SpecialityArea {
  return {
    id: result._id,
    title: result.title,
    slug: result.slug,
    description:
      result.shortDescription || result.description || FALLBACK_DESCRIPTIONS[result.slug],
    tint: result.tint ?? undefined,
    iconSrc: result.icon?.asset
      ? urlFor(result.icon).width(240).height(240).fit("max").auto("format").url()
      : localIcon(result.slug),
    productCount: result.productCount,
  };
}

/** Areas for the tiles (Sanity, else the fallback list). */
export async function getSpecialityAreas(): Promise<SpecialityArea[]> {
  const results = await sanityFetch<AreaResult[]>({
    query: THERAPEUTIC_AREAS_QUERY,
    tags: ["therapeuticArea", "product"],
    fallback: [],
  });
  if (results.length > 0) return results.map(toArea);
  return FALLBACK_AREAS.map((area) => ({
    id: `fallback-${area.slug}`,
    title: area.title,
    slug: area.slug,
    description: FALLBACK_DESCRIPTIONS[area.slug],
    iconSrc: localIcon(area.slug),
  }));
}
