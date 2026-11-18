import { existsSync } from "node:fs";
import path from "node:path";

import { getImageProps } from "next/image";

import { SiteHeader } from "@/components/layout/site-header";
import { generalEnquiryMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { HERO_SHOWCASE } from "@/content/heroShowcase";
import { sanityFetch } from "@/sanity/lib/fetch";
import { AREA_PRODUCT_COUNTS_QUERY } from "@/sanity/queries";

import { HERO_BACKGROUND } from "./hero-content";
import { HeroShowcase } from "./hero-showcase";
import type { HeroShowcaseItem } from "./types";

type AreaCount = { slug: string; count: number };

/** Static design bottles + live product count per speciality (0 when Sanity is unavailable). */
async function getHeroItems(): Promise<HeroShowcaseItem[]> {
  const counts = await sanityFetch<AreaCount[]>({
    query: AREA_PRODUCT_COUNTS_QUERY,
    params: { slugs: HERO_SHOWCASE.map((entry) => entry.areaSlug) },
    tags: ["product", "therapeuticArea"],
    fallback: [],
  });
  const bySlug = new Map(counts.map((row) => [row.slug, row.count]));
  return HERO_SHOWCASE.map((entry) => ({ ...entry, productCount: bySlug.get(entry.areaSlug) ?? 0 }));
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

/**
 * Home page hero: static design bottles (src/content/heroShowcase.ts), one per speciality.
 * Real products appear in "Featured products" below. "Contact us" opens a WhatsApp general enquiry.
 */
export async function Hero() {
  const items = await getHeroItems();
  const contactHref = getWhatsAppLink(generalEnquiryMessage()) ?? "/contact";

  return (
    <HeroShowcase
      products={items}
      header={<SiteHeader variant="overlay" />}
      background={<HeroBackground />}
      contactHref={contactHref}
    />
  );
}
