import { ArrowRight, type LucideIcon, Mail, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";
import { getSiteSettings } from "@/sanity/lib/site-settings";

type Item = { key: string; icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>; value: ReactNode };

const LINK_CLASS = "rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Home: compact "Talk to our team" row under the distributor banner.
 * Only details actually set in Site settings (no fallbacks), plus WhatsApp when its number is configured.
 * Renders nothing when there is nothing to show.
 */
export async function ContactStrip() {
  const settings = await getSiteSettings();
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());

  const items: Item[] = [];
  if (whatsapp) {
    items.push({
      key: "whatsapp",
      icon: WhatsAppIcon,
      value: (
        <a href={whatsapp} {...WHATSAPP_LINK_PROPS} className={LINK_CLASS}>
          Chat on WhatsApp
        </a>
      ),
    });
  }
  if (settings.phone) {
    items.push({
      key: "phone",
      icon: PhoneCall,
      value: (
        <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={LINK_CLASS}>
          {settings.phone}
        </a>
      ),
    });
  }
  if (settings.studioEmail) {
    items.push({
      key: "email",
      icon: Mail,
      value: (
        <a href={`mailto:${settings.studioEmail}`} className={LINK_CLASS}>
          {settings.studioEmail}
        </a>
      ),
    });
  }
  if (settings.address) {
    items.push({ key: "address", icon: MapPin, value: <address className="not-italic">{settings.address}</address> });
  }
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="contact-strip-heading" className="pb-12 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-4 rounded-2xl border px-5 py-4 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:px-6">
          <h2 id="contact-strip-heading" className="shrink-0 font-heading text-lg font-semibold text-foreground">
            Talk to our team
          </h2>
          <ul className="flex flex-col gap-3 md:flex-1 md:flex-row md:flex-wrap md:items-center md:gap-x-8">
            {items.map(({ key, icon: Icon, value }) => (
              <li key={key} className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="min-w-0 break-words">{value}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring"
          >
            Contact us
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
