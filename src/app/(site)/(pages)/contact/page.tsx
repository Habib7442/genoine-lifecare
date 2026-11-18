import { Suspense } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactFormWithParams } from "@/components/contact/contact-form-with-params";
import { ContactInfo } from "@/components/contact/contact-info";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/JsonLd";
import { FALLBACK_ADDRESS } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/sanity/lib/site-settings";

export const metadata = pageMetadata.contact;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const address = settings.address ?? FALLBACK_ADDRESS;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact us"
        title="Get in touch"
        intro="Product questions, distribution enquiries or anything else: we're happy to help."
        background={{ desktop: "/banners/contact.webp", mobile: "/banners/contact-mobile.webp" }}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
          <div className="grid gap-12 rounded-[32px] border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(34,18,27,0.25)] md:p-10 lg:grid-cols-2 lg:gap-16">
            <ContactInfo
              phone={settings.phone}
              email={settings.email}
              address={address}
              businessHours={settings.businessHours}
              mapQuery={settings.mapQuery ?? address}
            />
            {/* The static shell renders the default form; ?subject= swaps in the pre-selected one. */}
            <Suspense fallback={<ContactForm email={settings.email} />}>
              <ContactFormWithParams email={settings.email} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
