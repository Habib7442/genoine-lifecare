import "server-only";

import type { QueryParams } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

type SanityFetchOptions<T> = {
  query: string;
  params?: QueryParams;
  /** Cache tags, usually document `_type`s. Revalidated by the Sanity webhook. */
  tags: string[];
  /** Returned when Sanity is not configured or the request fails. */
  fallback: T;
};

/**
 * Read from Sanity in Server Components.
 * Successful results are cached until a webhook revalidates one of their tags.
 * Failures are not cached: the fallback is returned and the next request retries.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  fallback,
}: SanityFetchOptions<T>): Promise<T> {
  if (!isSanityConfigured) return fallback;

  try {
    return await cachedFetch<T>(query, params, tags);
  } catch (error) {
    console.error("[sanityFetch] request failed:", error);
    return fallback;
  }
}

async function cachedFetch<T>(
  query: string,
  params: QueryParams,
  tags: string[],
): Promise<T> {
  "use cache";
  cacheLife("max");
  cacheTag(...tags);
  return client.fetch<T>(query, params);
}
