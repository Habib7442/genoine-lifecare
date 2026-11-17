import type { Metadata } from "next";

import { urlFor } from "@/sanity/lib/image";

/* ==========================================================================
   Site config: single source of truth for SEO.
   Contact details and social links come from Sanity `siteSettings` at runtime
   (see getSiteSettings); never hard-code a street address here.
   ========================================================================== */

export const siteConfig = {
  name: "Genoine Lifecare",
  legalName: "Genoine Lifecare Private Limited",
  // `||` (not `??`): an empty NEXT_PUBLIC_SITE_URL= must fall back too.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, ""),
  tagline: "Quality medicines you can trust",
  description:
    "Genoine Lifecare is a pharmaceutical company offering quality tablets, capsules, syrups and nutraceuticals across key therapeutic areas for doctors, chemists and distributors.",
  locale: "en_IN",
  cin: "U21001AS2026PTC030380",
  // JPEG keeps it small enough for WhatsApp link previews (~300 KB limit).
  ogImage: "/opengraph-image.jpg",
  /** Brand icon (app/icon.png, 512×512). */
  logo: "/icon.png",
  keywords: [
    "pharmaceutical company Assam",
    "pharma company Northeast India",
    "pharma distributor Assam",
    "PCD pharma franchise Assam",
    "tablets capsules syrups manufacturer",
    "Genoine Lifecare",
  ],
} as const;

const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Full URL for a site path, e.g. absoluteUrl("/products") → https://…/products */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trim to `max` characters at a word boundary (meta descriptions: 160). */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

type BuildMetadataOptions = {
  /** Page title; the root template adds " | Genoine Lifecare". Pass `absolute` to skip the template. */
  title: string | { absolute: string };
  description?: string;
  /** Site path for the canonical URL, e.g. "/about". */
  path: string;
  /** Absolute URL or site path; defaults to the site OG image. */
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  keywords?: string[];
};

/** Page metadata: title, description, canonical, Open Graph, Twitter, robots, keywords. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path,
  image = siteConfig.ogImage,
  imageAlt,
  noIndex = false,
  type = "website",
  keywords = [],
}: BuildMetadataOptions): Metadata {
  const plainTitle = typeof title === "string" ? title : title.absolute;
  const desc = truncate(description);
  const url = absoluteUrl(path);
  const images = [{ url: absoluteUrl(image), ...OG_IMAGE_SIZE, alt: imageAlt ?? plainTitle }];

  return {
    title,
    description: desc,
    keywords: [...new Set([...keywords, ...siteConfig.keywords])],
    alternates: { canonical: url },
    openGraph: {
      title: plainTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description: desc,
      images: images.map((img) => img.url),
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

/** Root layout metadata (applies to every route). Icons come from app/icon.png, app/apple-icon.png, app/favicon.ico. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [...siteConfig.keywords],
  formatDetection: { telephone: false },
  category: "health",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

/* -------------------------------------------------------------------------- */
/* Page metadata (ready for pages that are built in later phases)             */
/* -------------------------------------------------------------------------- */

export const pageMetadata = {
  home: buildMetadata({ title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` }, path: "/" }),
  products: buildMetadata({
    title: "All products",
    description:
      "Browse the Genoine Lifecare range of tablets, capsules, syrups and nutraceuticals by therapeutic area. Enquire about distribution on WhatsApp.",
    path: "/products",
  }),
  about: buildMetadata({
    title: "About us",
    description:
      "Genoine Lifecare Private Limited is a pharmaceutical marketing company in Assam, India, focused on quality medicines for doctors, chemists and distributors.",
    path: "/about",
  }),
  distributor: buildMetadata({
    title: "Become a distributor",
    description:
      "Partner with Genoine Lifecare. Distributor, stockist and PCD franchise enquiries for our range of quality medicines across Assam and Northeast India.",
    path: "/distributor",
  }),
  contact: buildMetadata({
    title: "Contact us",
    description:
      "Contact Genoine Lifecare for product information and distribution enquiries by phone, WhatsApp or email.",
    path: "/contact",
  }),
} satisfies Record<string, Metadata>;

/* -------------------------------------------------------------------------- */
/* Product and therapeutic area metadata                                      */
/* -------------------------------------------------------------------------- */

/** Fields a product page passes in (shape of its Sanity query result). */
export type SeoProduct = {
  name: string;
  slug: string;
  composition: string;
  dosageForm?: string | null;
  packSize?: string | null;
  therapeuticArea?: string | null;
  shortDescription?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  /** First product image (Sanity image object). */
  image?: Parameters<typeof urlFor>[0] | null;
};

function productDescription(product: SeoProduct): string {
  const form = [product.dosageForm, product.packSize].filter(Boolean).join(", ");
  const area = product.therapeuticArea ? ` ${product.therapeuticArea} range by Genoine Lifecare.` : " By Genoine Lifecare.";
  return `${product.name} (${product.composition})${form ? ` — ${form}.` : "."}${area} Enquire for distribution.`;
}

/** 1200×630 share image from the product photo, padded on white so pack shots aren't cropped. */
function productImageUrl(product: SeoProduct): string {
  if (!product.image) return siteConfig.ogImage;
  return urlFor(product.image).width(1200).height(630).fit("fill").bg("ffffff").auto("format").url();
}

export function productMetadata(product: SeoProduct): Metadata {
  return buildMetadata({
    title: product.seo?.title || `${product.name} — ${product.composition}`,
    description: product.seo?.description || productDescription(product),
    path: `/products/${product.slug}`,
    image: productImageUrl(product),
    imageAlt: `${product.name} — ${product.composition}`,
    keywords: [product.name, product.composition, product.therapeuticArea ?? ""].filter(Boolean),
  });
}

/** /products?area=<slug>: canonical is /products (no query), so filtered views aren't duplicate pages. */
export function therapeuticAreaMetadata(area: { title: string; slug: string; description?: string | null }): Metadata {
  return buildMetadata({
    title: `${area.title} medicines`,
    description:
      area.description ||
      `Browse Genoine Lifecare ${area.title.toLowerCase()} medicines: compositions, dosage forms and pack sizes. Enquire about distribution on WhatsApp.`,
    path: "/products",
    keywords: [`${area.title} medicines`],
  });
}

/* -------------------------------------------------------------------------- */
/* JSON-LD (plain objects; render with <JsonLd />)                            */
/* -------------------------------------------------------------------------- */

type JsonLd = Record<string, unknown>;

type OrganizationContact = {
  phone?: string;
  email?: string;
  /** Social profile URLs. */
  socialLinks?: string[];
};

export function organizationJsonLd(contact: OrganizationContact = {}): JsonLd {
  const hasContact = Boolean(contact.phone || contact.email);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CIN",
      value: siteConfig.cin,
    },
    ...(hasContact
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            ...(contact.phone ? { telephone: contact.phone } : {}),
            ...(contact.email ? { email: contact.email } : {}),
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["en", "hi", "bn", "as"],
          },
        }
      : {}),
    ...(contact.socialLinks?.length ? { sameAs: contact.socialLinks } : {}),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

/**
 * Product structured data. Deliberately no `offers`, `price`, `aggregateRating`
 * or `review`: we show no prices and have no reviews, and must never invent them.
 */
export function productJsonLd(product: SeoProduct): JsonLd {
  const properties = [
    { name: "Composition", value: product.composition },
    { name: "Dosage form", value: product.dosageForm },
    { name: "Pack size", value: product.packSize },
  ].filter((p): p is { name: string; value: string } => Boolean(p.value));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || productDescription(product),
    url: absoluteUrl(`/products/${product.slug}`),
    image: absoluteUrl(productImageUrl(product)),
    brand: { "@type": "Brand", name: siteConfig.name },
    manufacturer: { "@id": `${absoluteUrl("/")}#organization` },
    ...(product.therapeuticArea ? { category: product.therapeuticArea } : {}),
    additionalProperty: properties.map((p) => ({ "@type": "PropertyValue", ...p })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
