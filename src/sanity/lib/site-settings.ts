import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

export type SiteSettings = {
  phone?: string;
  email?: string;
  /** Medical disclaimer for the footer and product pages. */
  disclaimer?: string;
  /** Social profile URLs (Organization `sameAs`). */
  socialLinks: string[];
};

type SiteSettingsResult = {
  phone?: string | null;
  email?: string | null;
  disclaimer?: string | null;
  socialLinks?: (string | null)[] | null;
} | null;

/** Site-wide settings from the Sanity `siteSettings` singleton, with env fallbacks. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityFetch<SiteSettingsResult>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
    fallback: null,
  });
  return {
    phone: result?.phone || undefined,
    email: result?.email || undefined,
    disclaimer: result?.disclaimer || undefined,
    socialLinks: (result?.socialLinks ?? []).filter((url): url is string => Boolean(url)),
  };
}
