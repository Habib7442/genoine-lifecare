/** Static hero copy. Move to `siteSettings` in Phase 2 so the client can edit it. */
export const HERO_HEADLINE = ["Quality you", "can trust"] as const;

// TODO: confirm with client. Only show certifications the manufacturer actually holds.
export const HERO_TRUST_TEXT = "WHO-GMP certified manufacturing";

export const HERO_BACKGROUND = {
  desktop: "/hero/hero-bg.webp",
  /** Optional portrait crop for phones. Used only if the file exists in /public. */
  mobile: "/hero/hero-bg-mobile.webp",
};
