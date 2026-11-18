import "server-only";

import type {
  FacetOption,
  GalleryImage,
  ProductCardData,
  ProductDetail,
  ProductFacets,
} from "@/components/product/types";
import { type ProductFilters, searchPattern } from "@/lib/product-filters";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  AREA_BY_SLUG_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_DETAIL_QUERY,
  PRODUCT_FACETS_QUERY,
  PRODUCT_LIST_QUERY,
  PRODUCT_SITEMAP_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/sanity/queries";

const CATALOGUE_TAGS = ["product", "category", "therapeuticArea"];

type SanityImage = { _key?: string; asset?: { _ref: string }; alt?: string | null } | null;

type CardResult = {
  _id: string;
  name: string;
  slug: string;
  composition: string;
  dosageForm?: string | null;
  packSize?: string | null;
  image?: SanityImage;
  heroImage?: SanityImage;
};

function cardImage(result: CardResult): ProductCardData["image"] {
  const source = result.image?.asset ? result.image : result.heroImage?.asset ? result.heroImage : null;
  if (!source) return undefined;
  return {
    src: urlFor(source).width(600).fit("max").auto("format").url(),
    alt: source.alt || `${result.name} pack`,
  };
}

function toCard(result: CardResult): ProductCardData {
  return {
    id: result._id,
    name: result.name,
    slug: result.slug,
    composition: result.composition,
    dosageForm: result.dosageForm ?? undefined,
    packSize: result.packSize ?? undefined,
    image: cardImage(result),
  };
}

/* ---------------------------------- list ---------------------------------- */

export async function getProducts(filters: ProductFilters): Promise<ProductCardData[]> {
  const results = await sanityFetch<CardResult[]>({
    query: PRODUCT_LIST_QUERY,
    params: {
      area: filters.area ?? null,
      category: filters.category ?? null,
      form: filters.form ?? null,
      q: searchPattern(filters.q),
    },
    tags: CATALOGUE_TAGS,
    fallback: [],
  });
  return results.map(toCard);
}

type FacetsResult = {
  areas: { title: string; slug: string; count: number }[];
  categories: { title: string; slug: string; count: number }[];
  forms: string[];
};

export async function getFacets(): Promise<ProductFacets> {
  const result = await sanityFetch<FacetsResult>({
    query: PRODUCT_FACETS_QUERY,
    tags: CATALOGUE_TAGS,
    fallback: { areas: [], categories: [], forms: [] },
  });
  const toOption = (item: { title: string; slug: string; count: number }): FacetOption => ({
    label: item.title,
    value: item.slug,
    count: item.count,
  });
  const formCounts = new Map<string, number>();
  for (const form of result.forms) formCounts.set(form, (formCounts.get(form) ?? 0) + 1);

  return {
    areas: result.areas.map(toOption),
    categories: result.categories.map(toOption),
    forms: [...formCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([form, count]) => ({ label: form, value: form, count })),
  };
}

export async function getAreaBySlug(
  slug: string,
): Promise<{ title: string; slug: string; description?: string | null } | null> {
  return sanityFetch({
    query: AREA_BY_SLUG_QUERY,
    params: { slug },
    tags: ["therapeuticArea"],
    fallback: null,
  });
}

/* --------------------------------- detail --------------------------------- */

type DetailResult = CardResult & {
  strength?: string | null;
  keyUse?: string | null;
  shortDescription?: string | null;
  indications?: string[] | null;
  usageNote?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  category?: { title: string; slug: string } | null;
  therapeuticArea?: { _id: string; title: string; slug: string } | null;
  images?: SanityImage[] | null;
};

function gallery(result: DetailResult): GalleryImage[] {
  const images = (result.images ?? []).filter((img): img is NonNullable<SanityImage> => Boolean(img?.asset));
  const sources = images.length ? images : result.heroImage?.asset ? [result.heroImage] : [];
  return sources.map((img, index) => ({
    key: img._key ?? `img-${index}`,
    src: urlFor(img).width(1000).fit("max").auto("format").url(),
    thumb: urlFor(img).width(200).height(200).fit("max").auto("format").url(),
    alt: img.alt || `${result.name} — image ${index + 1}`,
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const result = await sanityFetch<DetailResult | null>({
    query: PRODUCT_DETAIL_QUERY,
    params: { slug },
    tags: CATALOGUE_TAGS,
    fallback: null,
  });
  if (!result) return null;

  const images = gallery(result);
  const firstImage = (result.images ?? []).find((img) => img?.asset) ?? (result.heroImage?.asset ? result.heroImage : null);

  return {
    ...toCard(result),
    strength: result.strength ?? undefined,
    keyUse: result.keyUse ?? undefined,
    shortDescription: result.shortDescription ?? undefined,
    indications: (result.indications ?? []).filter(Boolean),
    usageNote: result.usageNote ?? undefined,
    category: result.category ?? undefined,
    therapeuticArea: result.therapeuticArea
      ? { id: result.therapeuticArea._id, title: result.therapeuticArea.title, slug: result.therapeuticArea.slug }
      : undefined,
    gallery: images,
    seo: result.seo,
    imageSource: firstImage,
  };
}

export async function getRelatedProducts(product: ProductDetail): Promise<ProductCardData[]> {
  if (!product.therapeuticArea) return [];
  const results = await sanityFetch<CardResult[]>({
    query: RELATED_PRODUCTS_QUERY,
    params: { areaId: product.therapeuticArea.id, id: product.id },
    tags: CATALOGUE_TAGS,
    fallback: [],
  });
  return results.map(toCard);
}

/** All product slugs (for generateStaticParams). */
export async function getProductSlugs(): Promise<string[]> {
  const results = await sanityFetch<{ slug: string }[]>({
    query: PRODUCT_SITEMAP_QUERY,
    tags: ["product"],
    fallback: [],
  });
  return results.map((r) => r.slug);
}

/* -------------------------------- featured -------------------------------- */

export type FeaturedProduct = ProductCardData & {
  area?: { title: string; slug: string; order: number };
};

type FeaturedResult = CardResult & { area?: { title: string; slug: string; order: number } | null };

/** Up to 8 featured products (home "Featured products"), each with its therapeutic area for the tabs. */
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const results = await sanityFetch<FeaturedResult[]>({
    query: FEATURED_PRODUCTS_QUERY,
    tags: CATALOGUE_TAGS,
    fallback: [],
  });
  return results.map((result) => ({ ...toCard(result), area: result.area ?? undefined }));
}
