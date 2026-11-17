import { absoluteUrl } from "@/lib/seo";

/**
 * Every WhatsApp link on the site is built here. Enquiries go straight to WhatsApp
 * (there is no enquiry list). The number comes from NEXT_PUBLIC_WHATSAPP_NUMBER.
 */

const INDIA_COUNTRY_CODE = "91";

/**
 * Digits only, with country code. A bare 10-digit Indian mobile number gets "91" added,
 * because wa.me links without a country code open a broken chat.
 */
function whatsappNumber(): string | null {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return digits.length === 10 ? `${INDIA_COUNTRY_CODE}${digits}` : digits;
}

/** `https://wa.me/<number>?text=<message>`, or null when no number is configured (callers fall back to /contact). */
export function getWhatsAppLink(message: string): string | null {
  const number = whatsappNumber();
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

/** Props for every WhatsApp link: open in a new tab without giving it access to this page. */
export const WHATSAPP_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

export function generalEnquiryMessage(): string {
  return "Hello Genoine Lifecare, I'd like to know more about your products.";
}

export type EnquiryProduct = {
  name: string;
  slug: string;
  composition: string;
  dosageForm?: string;
  packSize?: string;
};

/** Single-product enquiry (fixed format, see AGENTS.md §9). Empty parts are left out. */
export function productEnquiryMessage(product: EnquiryProduct): string {
  const details = [product.dosageForm, product.packSize].filter(Boolean).join(", ");
  return [
    "Hello Genoine Lifecare, I'd like to enquire about:",
    `*${product.name}*${details ? ` (${details})` : ""}`,
    `Composition: ${product.composition}`,
    `Link: ${absoluteUrl(`/products/${product.slug}`)}`,
    "Name:",
    "City:",
  ].join("\n");
}
