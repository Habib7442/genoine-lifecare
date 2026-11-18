import type { Metadata } from "next";

import { ContactStrip } from "@/components/home/contact-strip";
import { FeaturedProductsSection } from "@/components/home/featured/featured-products-section";
import { Hero } from "@/components/home/hero/hero";
import { SpecialitiesSection } from "@/components/home/specialities/specialities-section";
import { WhyGenoineSection } from "@/components/home/why-genoine-section";
import { DistributorCta } from "@/components/shared/distributor-cta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecialitiesSection />
      <FeaturedProductsSection />
      <WhyGenoineSection />
      <DistributorCta />
      <ContactStrip />
    </>
  );
}
