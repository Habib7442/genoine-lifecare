import { existsSync } from "node:fs";
import path from "node:path";

import { getImageProps } from "next/image";

import { SiteHeader } from "@/components/layout/site-header";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { HERO_PRODUCTS_QUERY } from "@/sanity/queries";

import {
  FALLBACK_HERO_PRODUCTS,
  HERO_BACKGROUND,
  defaultAreaDescription,
  fallbackBottle,
} from "./hero-content";
import { HeroShowcase } from "./hero-showcase";
import type { HeroProduct } from "./types";

type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
} | null;

type HeroProductResult = {
  _id: string;
  name: string;
  slug: string;
  composition: string;
  dosageForm?: string | null;
  packSize?: string | null;
  keyUse?: string | null;
  therapeuticArea?: string | null;
  therapeuticAreaDescription?: string | null;
  heroImage?: SanityImage;
};

function toHeroProduct(result: HeroProductResult, index: number): HeroProduct {
  const area = result.therapeuticArea ?? undefined;
  return {
    id: result._id,
    slug: result.slug,
    name: result.name,
    composition: result.composition,
    dosageForm: result.dosageForm ?? undefined,
    packSize: result.packSize ?? undefined,
    keyUse: result.keyUse ?? undefined,
    therapeuticArea: area,
    therapeuticAreaDescription:
      result.therapeuticAreaDescription || (area ? defaultAreaDescription(area) : undefined),
    // Until a product has a heroImage, use the static bottle for its position.
    image: result.heroImage?.asset
      ? {
          src: urlFor(result.heroImage).width(1000).auto("format").url(),
          alt: result.heroImage.alt ?? result.name,
        }
      : { src: fallbackBottle(index), alt: `${result.name} bottle` },
  };
}

async function getHeroProducts(): Promise<HeroProduct[]> {
  const results = await sanityFetch<HeroProductResult[]>({
    query: HERO_PRODUCTS_QUERY,
    tags: ["product", "therapeuticArea"],
    fallback: [],
  });
  return results.length > 0 ? results.map(toHeroProduct) : FALLBACK_HERO_PRODUCTS;
}

const hasMobileBackground = existsSync(
  path.join(process.cwd(), "public", HERO_BACKGROUND.mobile),
);

/** Sky background. Uses a portrait crop below md when `hero-bg-mobile.webp` exists. */
function HeroBackground() {
  const common = { alt: "", fill: true, sizes: "100vw", fetchPriority: "high" as const };
  const {
    props: { srcSet: desktopSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: HERO_BACKGROUND.desktop, quality: 80 });
  const mobileSrcSet = hasMobileBackground
    ? getImageProps({ ...common, src: HERO_BACKGROUND.mobile, quality: 75 }).props.srcSet
    : undefined;

  return (
    <picture>
      {mobileSrcSet && <source media="(max-width: 767px)" srcSet={mobileSrcSet} />}
      <source srcSet={desktopSrcSet} />
      <img
        {...imgProps}
        alt=""
        srcSet={desktopSrcSet}
        loading="eager"
        className="object-cover object-bottom"
      />
    </picture>
  );
}

/** Home page hero. Fetches featured products on the server; interaction lives in HeroShowcase. */
export async function Hero() {
  const products = await getHeroProducts();

  return (
    <HeroShowcase
      products={products}
      header={<SiteHeader variant="overlay" />}
      background={<HeroBackground />}
    />
  );
}
