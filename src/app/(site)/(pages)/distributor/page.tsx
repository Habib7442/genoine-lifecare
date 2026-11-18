import { existsSync } from "node:fs";
import path from "node:path";

import { PhoneCall } from "lucide-react";

import { AboutHeaderVisual } from "@/components/about/about-header-visual";
import { DistributorBenefits } from "@/components/distributor/distributor-benefits";
import { DistributorForm } from "@/components/distributor/distributor-form";
import { DistributorSteps } from "@/components/distributor/distributor-steps";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";
import { getSiteSettings } from "@/sanity/lib/site-settings";

export const metadata = pageMetadata.distributor;

/** Drop this file in to switch the header to the banner style (like Contact). */
const BANNER = "/banners/distributor.webp";
const hasBanner = existsSync(path.join(process.cwd(), "public", BANNER));

const LINK_CLASS =
  "inline-flex items-center gap-1.5 rounded-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring";

export default async function DistributorPage() {
  const settings = await getSiteSettings();
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Distributor", path: "/distributor" },
        ])}
      />

      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Distributor" }]}
        eyebrow="Partner with us"
        title="Become a distributor"
        intro="Distributor and stockist enquiries are welcome across the Northeast. Share your details and our team will get in touch."
        {...(hasBanner
          ? { background: { desktop: BANNER, mobile: "/banners/distributor-mobile.webp" } }
          : { aside: <AboutHeaderVisual /> })}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <DistributorBenefits />
            <DistributorSteps />
          </div>

          <div
            id="apply"
            className="scroll-mt-24 rounded-[32px] border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(34,18,27,0.25)] md:p-10 lg:sticky lg:top-24"
          >
            <h2 className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[32px]">
              Send your details
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              Fill in the form and it opens WhatsApp with your details ready to send.
            </p>

            <DistributorForm email={settings.email} />

            {(whatsapp || settings.phone) && (
              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5 text-sm text-muted-foreground">
                Prefer to talk?
                {whatsapp && (
                  <a href={whatsapp} {...WHATSAPP_LINK_PROPS} className={LINK_CLASS}>
                    <WhatsAppIcon className="size-4" />
                    Chat on WhatsApp
                  </a>
                )}
                {settings.phone && (
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={LINK_CLASS}>
                    <PhoneCall className="size-4" aria-hidden="true" />
                    {settings.phone}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
