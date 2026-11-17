import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_SITEMAP_QUERY } from "@/sanity/queries";

type ProductEntry = { slug: string; _updatedAt: string };

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/distributor", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await sanityFetch<ProductEntry[]>({
    query: PRODUCT_SITEMAP_QUERY,
    tags: ["product"],
    fallback: [],
  });

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(product._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
