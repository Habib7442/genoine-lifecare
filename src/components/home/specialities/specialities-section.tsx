import { existsSync } from "node:fs";
import path from "node:path";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { THERAPEUTIC_AREAS_QUERY } from "@/sanity/queries";

import { SpecialityGrid } from "./speciality-grid";
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

async function getAreas(): Promise<SpecialityArea[]> {
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

/** Home: "Browse by therapeutic area", directly under the hero. */
export async function SpecialitiesSection() {
  const areas = await getAreas();

  return (
    <section aria-labelledby="specialities-heading" className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our specialities</p>
            <h2
              id="specialities-heading"
              className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
            >
              Find care by speciality
            </h2>
            <p className="mt-2 text-muted-foreground">Explore our range across key therapeutic areas.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all products <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <SpecialityGrid areas={areas} />
      </div>
    </section>
  );
}
