import { MessageCircle } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { type EnquiryProduct, getWhatsAppLink, productEnquiryMessage, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";

type EnquireWhatsAppButtonProps = {
  product: EnquiryProduct;
  /** `lg`: product page. `sm`: product card. */
  size?: "lg" | "sm";
  className?: string;
};

/** Magenta "Enquire on WhatsApp": opens WhatsApp with this product prefilled. Falls back to /contact without a number. */
export function EnquireWhatsAppButton({ product, size = "lg", className }: EnquireWhatsAppButtonProps) {
  const href = getWhatsAppLink(productEnquiryMessage(product));
  const base = cn(
    "flex w-full items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    size === "lg" ? "h-12 gap-2 px-6 text-[15px]" : "h-10 gap-1.5 px-3 text-sm",
  );

  if (!href) {
    return (
      <a href="/contact" className={cn(base, "border border-primary/30 bg-white text-primary hover:bg-secondary", className)}>
        <MessageCircle className="size-4" aria-hidden="true" />
        Contact us to enquire
      </a>
    );
  }

  return (
    <a
      href={href}
      {...WHATSAPP_LINK_PROPS}
      aria-label={`Enquire about ${product.name} on WhatsApp (opens in a new tab)`}
      className={cn(base, "bg-primary text-primary-foreground hover:bg-brand-primary-light", className)}
    >
      <WhatsAppIcon className={size === "lg" ? "size-5" : "size-4"} />
      {size === "lg" ? (
        "Enquire on WhatsApp"
      ) : (
        // Narrow 2-column cards on phones can't fit the full label on one line.
        <>
          <span className="sm:hidden">Enquire</span>
          <span className="hidden sm:inline">Enquire on WhatsApp</span>
        </>
      )}
    </a>
  );
}
