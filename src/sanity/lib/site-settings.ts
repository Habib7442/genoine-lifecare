import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

export type SiteSettings = {
  phone?: string;
  email?: string;
  /** Digits only with country code; falls back to NEXT_PUBLIC_WHATSAPP_NUMBER. */
  whatsappNumber?: string;
  /** Social profile URLs (Organization `sameAs`). */
  socialLinks: string[];
};

type SiteSettingsResult = {
  phone?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
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
    whatsappNumber: result?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined,
    socialLinks: (result?.socialLinks ?? []).filter((url): url is string => Boolean(url)),
  };
}
