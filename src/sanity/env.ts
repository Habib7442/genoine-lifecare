/**
 * Sanity environment variables, shared by the client, the Studio config and
 * the CLI config.
 *
 * This module never throws, so the site renders fallback content and /studio
 * shows a setup message before Sanity is configured. Check
 * `isSanityConfigured` before anything that needs a real project.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so each one must be read
 * with a literal `process.env.NAME` expression (no dynamic lookups).
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Empty string when not configured. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const isSanityConfigured = projectId !== "";

/** Server-only. Undefined in the browser. */
export const readToken = process.env.SANITY_API_READ_TOKEN;
