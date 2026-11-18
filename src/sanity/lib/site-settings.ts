import "server-only";

import { CONTACT_EMAIL } from "@/lib/company";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

export type SocialProfile = { platform: string; url: string };

export type SiteSettings = {
  companyName?: string;
  tagline?: string;
  phone?: string;
  /** Always set: Studio value, else CONTACT_EMAIL. */
  email: string;
  address?: string;
  businessHours?: string;
  /** Address or "lat, lng" for the Contact page map. */
  mapQuery?: string;
  cin?: string;
  /** Medical disclaimer for the footer and product pages. */
  disclaimer?: string;
  /** Line in the "Become a distributor" banner. */
  distributorCtaText?: string;
  /** Social profile URLs (Organization `sameAs`). */
  socialLinks: string[];
  /** Social profiles with their platform (footer icons). Only https URLs. */
  socialProfiles: SocialProfile[];
};

type SiteSettingsResult = {
  companyName?: string | null;
  tagline?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  businessHours?: string | null;
  mapQuery?: string | null;
  cin?: string | null;
  disclaimer?: string | null;
  distributorCtaText?: string | null;
  socialLinks?: ({ platform?: string | null; url?: string | null } | null)[] | null;
} | null;

/** Site-wide settings from the Sanity `siteSettings` singleton. Empty fields become undefined. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityFetch<SiteSettingsResult>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
    fallback: null,
  });
  const socialProfiles = (result?.socialLinks ?? []).flatMap((link) =>
    link?.url && link.url.startsWith("https://")
      ? [{ platform: link.platform || "Website", url: link.url }]
      : [],
  );
  return {
    companyName: result?.companyName || undefined,
    tagline: result?.tagline || undefined,
    phone: result?.phone || undefined,
    email: result?.email || CONTACT_EMAIL,
    address: result?.address || undefined,
    businessHours: result?.businessHours || undefined,
    mapQuery: result?.mapQuery?.trim() || undefined,
    cin: result?.cin || undefined,
    disclaimer: result?.disclaimer || undefined,
    distributorCtaText: result?.distributorCtaText || undefined,
    socialLinks: socialProfiles.map((profile) => profile.url),
    socialProfiles,
  };
}
