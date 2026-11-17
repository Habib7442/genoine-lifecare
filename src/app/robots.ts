import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/seo";

/** Preview deployments (*.vercel.app) and local dev must never be indexed. */
const isNonProduction = /vercel\.app|localhost|127\.0\.0\.1/.test(siteConfig.url);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isNonProduction
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
