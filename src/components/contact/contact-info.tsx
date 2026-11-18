import { Clock, type LucideIcon, Mail, MapPin, PhoneCall } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";

import { ContactMap } from "./contact-map";

type ContactInfoProps = {
  phone?: string;
  email?: string;
  address?: string;
  businessHours?: string;
  /** Address or "lat, lng" for the map; the map is hidden when empty. */
  mapQuery?: string;
};

const LINK_CLASS =
  "rounded-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring";

type Row = { key: string; icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>; content: ReactNode };

/** Left column of the contact card. Each row renders only when its value exists. */
export function ContactInfo({ phone, email, address, businessHours, mapQuery }: ContactInfoProps) {
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());

  const rows: Row[] = [];
  if (whatsapp) {
    rows.push({
      key: "whatsapp",
      icon: WhatsAppIcon,
      content: (
        <a href={whatsapp} {...WHATSAPP_LINK_PROPS} className={LINK_CLASS}>
          Chat on WhatsApp
        </a>
      ),
    });
  }
  if (phone?.trim()) {
    rows.push({
      key: "phone",
      icon: PhoneCall,
      content: (
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={LINK_CLASS}>
          {phone}
        </a>
      ),
    });
  }
  if (email?.trim()) {
    rows.push({
      key: "email",
      icon: Mail,
      content: (
        <a href={`mailto:${email}`} className={LINK_CLASS}>
          {email}
        </a>
      ),
    });
  }
  if (address?.trim()) {
    rows.push({ key: "address", icon: MapPin, content: <address className="not-italic">{address}</address> });
  }
  if (businessHours?.trim()) rows.push({ key: "hours", icon: Clock, content: businessHours });

  return (
    <div>
      <h2 className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[32px]">
        Contact information
      </h2>
      <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
        Questions about our products or partnering with us? Reach us by phone, WhatsApp or email, or visit our office.
      </p>

      {rows.length > 0 && (
        <ul className="mt-8 space-y-5">
          {rows.map(({ key, icon: Icon, content }) => (
            <li key={key} className="flex items-start gap-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-foreground/70" aria-hidden="true" />
              <span className="min-w-0 text-base font-medium break-words whitespace-pre-line text-foreground">
                {content}
              </span>
            </li>
          ))}
        </ul>
      )}

      <ContactMap query={mapQuery} />
    </div>
  );
}
