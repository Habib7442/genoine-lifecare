import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { HEADER_CTA_LABEL } from "./nav-links";

type SiteHeaderProps = {
  /**
   * `overlay`: transparent with white text, placed on top of an image (home hero).
   * `solid`: white bar for regular pages (Phase 5).
   */
  variant?: "overlay" | "solid";
  className?: string;
};

export function SiteHeader({ variant = "solid", className }: SiteHeaderProps) {
  const tone = variant === "overlay" ? "light" : "dark";
  // "Enquire now" opens a WhatsApp general enquiry; without a number it goes to /contact.
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());
  const ctaHref = whatsapp ?? "/contact";

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4",
        // Solid: the sticky bar, border and background come from the wrapper in (pages)/layout.tsx.
        variant === "solid" && "h-16",
        variant === "overlay" &&
          "rounded-2xl border border-white/30 bg-white/15 py-2.5 pr-2.5 pl-5 backdrop-blur-md",
        className,
      )}
    >
      <Link
        href="/"
        className={cn(
          "rounded-sm font-heading text-lg font-semibold tracking-tight whitespace-nowrap outline-none focus-visible:ring-2",
          tone === "light"
            ? "text-white focus-visible:ring-white"
            : "text-primary focus-visible:ring-ring",
        )}
      >
        Genoine Lifecare
      </Link>

      <DesktopNav tone={tone} className="hidden lg:block" />

      <a
        href={ctaHref}
        {...(whatsapp ? WHATSAPP_LINK_PROPS : {})}
        className={cn(
          "hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:inline-flex",
          tone === "light"
            ? "bg-primary text-primary-foreground hover:bg-brand-primary-light focus-visible:ring-white focus-visible:ring-offset-transparent"
            : "bg-primary text-primary-foreground hover:bg-brand-primary-light focus-visible:ring-ring",
        )}
      >
        <WhatsAppIcon className="size-4" />
        {HEADER_CTA_LABEL}
      </a>

      <MobileNav tone={tone} ctaHref={ctaHref} className="lg:hidden" />
    </header>
  );
}
