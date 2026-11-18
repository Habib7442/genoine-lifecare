import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalEnquiryMessage, getWhatsAppLink, WHATSAPP_LINK_PROPS } from "@/lib/whatsapp";
import { getSiteSettings } from "@/sanity/lib/site-settings";

const FALLBACK_TEXT = "Distributor and stockist enquiries are welcome across the Northeast.";

/** Magenta "Become a distributor" block (About page; reusable on Home). */
export async function DistributorCta() {
  const settings = await getSiteSettings();
  const whatsapp = getWhatsAppLink(generalEnquiryMessage());

  return (
    <section aria-labelledby="distributor-cta-heading" className="py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="rounded-[32px] bg-primary px-6 py-10 text-center text-primary-foreground md:px-12 md:py-16">
          <h2 id="distributor-cta-heading" className="font-heading text-[28px] leading-tight font-semibold md:text-[40px]">
            Become a distributor
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            {settings.distributorCtaText ?? FALLBACK_TEXT}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/distributor"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-accent px-6 text-sm font-semibold text-brand-accent-foreground transition-[filter] outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Become a distributor
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={whatsapp ?? "/contact"}
              {...(whatsapp ? WHATSAPP_LINK_PROPS : {})}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/60 px-6 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
