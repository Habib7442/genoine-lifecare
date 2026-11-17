/**
 * Build a `wa.me` link with a prefilled message.
 * Returns null when no WhatsApp number is configured, so callers can fall back
 * (e.g. to /contact). Numbers are digits only with country code, e.g. 919876543210.
 *
 * Pass the number from `getSiteSettings()` (Sanity siteSettings, with env fallback) on the server.
 */
export function whatsappUrl(
  message: string,
  number: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const GENERAL_ENQUIRY_MESSAGE =
  "Hello Genoine Lifecare, I'd like to know more about your products.";
