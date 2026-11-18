import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/sonner";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/sanity/lib/site-settings";

/**
 * Main site layout (footer, toasts, site-wide structured data). Every public page
 * lives in the (site) route group; /studio is deliberately outside it.
 *
 * The header is not rendered here: the home page places <SiteHeader variant="overlay" />
 * inside its hero, and other pages will add <SiteHeader variant="solid" /> (Phase 5).
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />

      <main className="flex-1">{children}</main>

      <SiteFooter settings={settings} />

      <WhatsAppFloat />
      <Toaster />
    </>
  );
}
