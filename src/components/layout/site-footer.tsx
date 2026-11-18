import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SocialIcon } from "@/components/icons/social-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FALLBACK_DISCLAIMER } from "@/lib/disclaimer";
import { FALLBACK_ADDRESS, REGISTRAR } from "@/lib/company";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/seo";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import type { SiteSettings } from "@/sanity/lib/site-settings";
import { FOOTER_AREAS_QUERY } from "@/sanity/queries";

import { BrandSeal } from "./brand-seal";
import { NAV_LINKS } from "./nav-links";

/** Static: Cache Components doesn't allow reading the clock during prerender. Update yearly. */
const COPYRIGHT_YEAR = 2026;


const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const LINK_CLASS =
  "rounded-sm text-sm text-primary-foreground/80 outline-none transition-colors hover:text-primary-foreground hover:underline focus-visible:ring-2 focus-visible:ring-white";

type FooterArea = { title: string; slug: string };

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 font-heading text-sm font-semibold tracking-wide text-primary-foreground uppercase">
      {children}
    </h2>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
      <span className="mt-0.5 shrink-0 text-primary-foreground/70" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 break-words whitespace-pre-line">{children}</span>
    </li>
  );
}

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const areas = await sanityFetch<FooterArea[]>({
    query: FOOTER_AREAS_QUERY,
    tags: ["therapeuticArea", "product"],
    fallback: [],
  });
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());
  const companyName = settings.companyName ?? siteConfig.legalName;
  const cin = settings.cin ?? siteConfig.cin;
  const iconClass = "size-4";

  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 pt-12 md:px-10 md:pt-16">
        {/* Mobile: brand, contact, then quick links + specialities side by side. Desktop: brand, links, specialities, contact. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-sm font-heading text-xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <BrandSeal className="size-14" />
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              {settings.tagline ?? siteConfig.tagline}
            </p>
            <a
              href={whatsapp ?? "/contact"}
              {...(whatsapp ? WHATSAPP_LINK_PROPS : {})}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-primary transition-colors outline-none hover:bg-brand-tint focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact: email + location always; phone, hours and socials only when set in Site settings */}
          <div className="col-span-2 md:col-span-1 lg:order-last">
            <FooterHeading>Contact</FooterHeading>
              <ul className="space-y-3">
                <ContactRow icon={<MapPin className={iconClass} />}>
                  <address className="not-italic">{settings.address ?? FALLBACK_ADDRESS}</address>
                </ContactRow>
                {settings.phone && (
                  <ContactRow icon={<Phone className={iconClass} />}>
                    <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={LINK_CLASS}>
                      {settings.phone}
                    </a>
                  </ContactRow>
                )}
                <ContactRow icon={<Mail className={iconClass} />}>
                  <a href={`mailto:${settings.email}`} className={LINK_CLASS}>
                    {settings.email}
                  </a>
                </ContactRow>
                {settings.businessHours && (
                  <ContactRow icon={<Clock className={iconClass} />}>{settings.businessHours}</ContactRow>
                )}
              </ul>

              {settings.socialProfiles.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {settings.socialProfiles.map((profile) => (
                    <li key={profile.url}>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${profile.platform} (opens in a new tab)`}
                        className="flex size-9 items-center justify-center rounded-full bg-white/10 text-primary-foreground transition-colors outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <SocialIcon platform={profile.platform} className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <FooterHeading>Quick links</FooterHeading>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Specialities: every area with at least one product */}
          {areas.length > 0 && (
            <div>
              <FooterHeading>Specialities</FooterHeading>
              <ul className="space-y-2.5">
                {areas.map((area) => (
                  <li key={area.slug}>
                    <Link href={`/products?area=${encodeURIComponent(area.slug)}`} className={LINK_CLASS}>
                      {area.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-primary-foreground/70 md:mx-0 md:text-left">
            {settings.disclaimer ?? FALLBACK_DISCLAIMER}
          </p>
        </div>

        {/* Bottom bar. The wordmark below plus pb-24 / md:pb-20 of space keep it clear of the floating WhatsApp bubble. */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center text-xs text-primary-foreground/70 md:flex-row md:justify-between md:text-left">
          <p>
            © {COPYRIGHT_YEAR} {companyName}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-2">
            {LEGAL_LINKS.map((link, index) => (
              <li key={link.href} className="flex items-center gap-x-2">
                {index > 0 && <span aria-hidden="true">·</span>}
                <Link href={link.href} className={cn(LINK_CLASS, "text-xs")}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            CIN: {cin} · {REGISTRAR}
          </p>
        </div>
      </div>

      {/* Decorative wordmark: SVG text stretched to exactly the container width (textLength),
          baseline below the viewBox so the letters are cut off at the footer's bottom edge. */}
      <div aria-hidden="true" className="pointer-events-none mx-auto mt-8 max-w-7xl px-5 select-none md:px-10">
        <svg viewBox="0 0 1000 190" className="block w-full text-white/[0.08]" focusable="false">
          <text
            x="0"
            y="215"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            className="font-heading font-bold"
            fontSize="250"
          >
            Genoine
          </text>
        </svg>
      </div>
    </footer>
  );
}
