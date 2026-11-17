import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Read-only client for fetching published content via the Sanity CDN.
 * Use `sanityFetch` from `./fetch` in Server Components rather than calling
 * this directly: it handles caching and the "not configured" case.
 *
 * `projectId` falls back to a dummy value so importing this module never
 * throws; `sanityFetch` never calls it unless Sanity is configured.
 */
export const client = createClient({
  projectId: projectId || "not-configured",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
