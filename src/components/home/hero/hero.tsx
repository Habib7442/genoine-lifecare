import { existsSync } from "node:fs";
import path from "node:path";

import { getImageProps } from "next/image";

import { SiteHeader } from "@/components/layout/site-header";
import { generalEnquiryMessage, getWhatsAppLink } from "@/lib/whatsapp";

import { HERO_BACKGROUND, HERO_SHOWCASE_PRODUCTS } from "./hero-content";
import { HeroShowcase } from "./hero-showcase";

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
 * Home page hero. A design showcase: it always shows the static designed bottles
 * (HERO_SHOWCASE_PRODUCTS), never catalogue products from Sanity. Real products
 * live on /products. "Contact us" opens a WhatsApp general enquiry.
 */
export function Hero() {
  const products = HERO_SHOWCASE_PRODUCTS;
  const contactHref = getWhatsAppLink(generalEnquiryMessage()) ?? "/contact";

  return (
    <HeroShowcase
      products={products}
      header={<SiteHeader variant="overlay" />}
      background={<HeroBackground />}
      contactHref={contactHref}
    />
  );
}
