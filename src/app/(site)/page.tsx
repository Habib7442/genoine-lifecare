import type { Metadata } from "next";

import { Hero } from "@/components/home/hero/hero";
import { SpecialitiesSection } from "@/components/home/specialities/specialities-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecialitiesSection />
    </>
  );
}
