import { existsSync } from "node:fs";
import path from "node:path";

import { getImageProps } from "next/image";

import { SiteHeader } from "@/components/layout/site-header";
import { generalEnquiryMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { HERO_SHOWCASE } from "@/content/heroShowcase";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { HERO_AREAS_QUERY } from "@/sanity/queries";

import { HERO_BACKGROUND } from "./hero-content";
import { HeroShowcase } from "./hero-showcase";
import type { HeroFeaturedProduct, HeroShowcaseItem } from "./types";

type SanityImage = { asset?: { _ref: string }; alt?: string | null } | null;

type HeroAreaResult = {
  slug: string;
  count: number;
  product?: {
    name: string;
    slug: string;
    dosageForm?: string | null;
    packSize?: string | null;
    image?: SanityImage;
    heroImage?: SanityImage;
  } | null;
};

function toFeatured(product: NonNullable<HeroAreaResult["product"]>): HeroFeaturedProduct {
  const source = product.image?.asset ? product.image : product.heroImage?.asset ? product.heroImage : null;
  return {
    name: product.name,
    slug: product.slug,
    dosageForm: product.dosageForm ?? undefined,
    packSize: product.packSize ?? undefined,
    image: source
      ? { src: urlFor(source).width(400).fit("max").auto("format").url(), alt: source.alt || `${product.name} pack` }
      : undefined,
  };
}

/** Static design bottles + live product count and one real product per speciality (none when Sanity is unavailable). */
async function getHeroItems(): Promise<HeroShowcaseItem[]> {
  const areas = await sanityFetch<HeroAreaResult[]>({
    query: HERO_AREAS_QUERY,
    params: { slugs: HERO_SHOWCASE.map((entry) => entry.areaSlug) },
    tags: ["product", "therapeuticArea"],
    fallback: [],
  });
  const bySlug = new Map(areas.map((area) => [area.slug, area]));
  return HERO_SHOWCASE.map((entry) => {
    const area = bySlug.get(entry.areaSlug);
    return {
      ...entry,
      productCount: area?.count ?? 0,
      featured: area?.product ? toFeatured(area.product) : undefined,
    };
  });
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
 * The glass card shows one real product from that speciality (Sanity). "Contact us" opens a WhatsApp general enquiry.
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
