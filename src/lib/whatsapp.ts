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

export type ContactEnquiry = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
};

/** Contact page form → WhatsApp / email text. Empty optional fields are left out. */
export function contactEnquiryMessage(enquiry: ContactEnquiry): string {
  const name = [enquiry.firstName, enquiry.lastName].filter(Boolean).join(" ");
  return [
    "Hello Genoine Lifecare,",
    `Name: ${name}`,
    `Phone: ${enquiry.phone}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    enquiry.company ? `Firm: ${enquiry.company}` : null,
    `Subject: ${enquiry.subject}`,
    `Message: ${enquiry.message}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export type DistributorEnquiry = {
  name: string;
  firm: string;
  phone: string;
  city: string;
  state: string;
  businessType: string;
  message?: string;
};

/** Distributor page form → WhatsApp / email text. The message line is left out when empty. */
export function distributorEnquiryMessage(enquiry: DistributorEnquiry): string {
  return [
    "Hello Genoine Lifecare, I'd like to become a partner.",
    `Name: ${enquiry.name}`,
    `Firm: ${enquiry.firm}`,
    `Phone: ${enquiry.phone}`,
    `City / district: ${enquiry.city}`,
    `State: ${enquiry.state}`,
    `Business type: ${enquiry.businessType}`,
    enquiry.message ? `Message: ${enquiry.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
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
