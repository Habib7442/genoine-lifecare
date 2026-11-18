import { LegalPlaceholder } from "@/components/legal/legal-placeholder";
import { buildMetadata } from "@/lib/seo";

// noindex until the client approves the final text.
export const metadata = buildMetadata({ title: "Terms of use", path: "/terms", noIndex: true });

export default function TermsPage() {
  return <LegalPlaceholder title="Terms of use" />;
}
