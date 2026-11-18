import { LegalPlaceholder } from "@/components/legal/legal-placeholder";
import { buildMetadata } from "@/lib/seo";

// noindex until the client approves the final text.
export const metadata = buildMetadata({ title: "Privacy policy", path: "/privacy-policy", noIndex: true });

export default function PrivacyPolicyPage() {
  return <LegalPlaceholder title="Privacy policy" />;
}
