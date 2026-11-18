/** Public registration facts (from the certificate of incorporation). */

/** Default contact email (company domain). Studio → Site settings → Email overrides it. */
export const CONTACT_EMAIL = "support@genoinelifecare.com";

/** Shown as the location when Site settings has no address. */
export const FALLBACK_ADDRESS = "Karimganj, Assam, India";

/** Registrar of Companies for the CIN. */
export const REGISTRAR = "ROC Guwahati";

/** Date of incorporation (ISO). Editable in Studio → About page; this is the fallback. */
export const INCORPORATED_ON = "2026-05-04";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-05-04" → "4 May 2026". Static data only (never the current clock). */
export function formatIsoDate(iso: string): string {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}
