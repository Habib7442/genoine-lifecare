import { AboutHeaderVisual } from "@/components/about/about-header-visual";
import { AboutLeaders } from "@/components/about/about-leaders";
import { AboutMission } from "@/components/about/about-mission";
import { AboutRange } from "@/components/about/about-range";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { CompanyDetails } from "@/components/about/company-details";
import { getSpecialityAreas } from "@/components/home/specialities/get-speciality-areas";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/JsonLd";
import { DistributorCta } from "@/components/shared/distributor-cta";
import { formatIsoDate, REGISTRAR } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata, siteConfig } from "@/lib/seo";
import { getAboutPage, getAboutStats } from "@/sanity/lib/about";
import { getShowcaseProducts } from "@/sanity/lib/catalogue";
import { getSiteSettings } from "@/sanity/lib/site-settings";

export const metadata = pageMetadata.about;

export default async function AboutPage() {
  const [about, stats, areas, settings, products] = await Promise.all([
    getAboutPage(),
    getAboutStats(),
    getSpecialityAreas(),
    getSiteSettings(),
    getShowcaseProducts(),
  ]);
  const rangeAreas = areas.filter((area) => (area.productCount ?? 0) > 0);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow={about.eyebrow}
        title={about.heading}
        intro={about.intro}
        aside={<AboutHeaderVisual />}
      />

      <AboutStory
        heading={about.storyHeading}
        paragraphs={about.storyParagraphs}
        image={about.storyImage}
        established={about.incorporatedOn.slice(0, 4)}
        areaCount={stats.areaCount}
        productCount={stats.productCount}
      />
      <AboutMission mission={about.mission} vision={about.vision} />
      <AboutValues heading={about.valuesHeading} values={about.values} />
      <AboutRange areas={rangeAreas} forms={stats.forms} products={products} />
      <AboutLeaders leaders={about.leaders} />
      <CompanyDetails
        legalName={settings.companyName ?? siteConfig.legalName}
        cin={settings.cin ?? siteConfig.cin}
        registrar={REGISTRAR}
        incorporated={formatIsoDate(about.incorporatedOn)}
        address={settings.address}
      />
      <DistributorCta />
    </>
  );
}
