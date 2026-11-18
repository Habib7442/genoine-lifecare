import { LegalPlaceholder } from "@/components/legal/legal-placeholder";
import { FALLBACK_DISCLAIMER } from "@/lib/disclaimer";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/sanity/lib/site-settings";

// noindex until the client approves the final text.
export const metadata = buildMetadata({ title: "Disclaimer", path: "/disclaimer", noIndex: true });

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();
  return (
    <LegalPlaceholder title="Disclaimer">
      {/* The medical disclaimer from Site settings is already approved content. */}
      <p>{settings.disclaimer ?? FALLBACK_DISCLAIMER}</p>
    </LegalPlaceholder>
  );
}
