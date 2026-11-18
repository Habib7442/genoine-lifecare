import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";

/**
 * Floating green WhatsApp bubble: fixed bottom-right on every public page (product pages too).
 * Hidden only when no number is set. 52px on mobile, inset by the safe area.
 */
export function WhatsAppFloat() {
  const href = getWhatsAppLink(generalEnquiryMessage());
  if (!href) return null;

  return (
    <a
      href={href}
      {...WHATSAPP_LINK_PROPS}
      aria-label="Chat with Genoine Lifecare on WhatsApp (opens in a new tab)"
      data-whatsapp-float
      className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex size-[52px] items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgba(18,140,126,0.6)] transition-[background-color,translate,bottom] outline-none hover:bg-whatsapp-hover focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 md:right-6 md:bottom-6 md:size-14"
    >
      <WhatsAppIcon className="size-6 md:size-7" />
    </a>
  );
}
