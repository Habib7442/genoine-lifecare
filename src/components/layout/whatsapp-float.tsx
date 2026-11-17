import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";

/** Floating green WhatsApp bubble (bottom-right on every public page). Hidden when no number is set. */
export function WhatsAppFloat() {
  const href = getWhatsAppLink(generalEnquiryMessage());
  if (!href) return null;

  return (
    <a
      href={href}
      {...WHATSAPP_LINK_PROPS}
      aria-label="Chat with Genoine Lifecare on WhatsApp (opens in a new tab)"
      data-whatsapp-float
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgba(18,140,126,0.6)] transition-[background-color,translate] outline-none hover:bg-whatsapp-hover focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
