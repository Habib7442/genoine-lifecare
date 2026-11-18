import { type LucideIcon, MapPinned, MessagesSquare, Pill, ShieldCheck } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { FeatureCard } from "@/components/shared/feature-card";
import { DISTRIBUTOR_BENEFITS, type DistributorBenefitIcon } from "@/content/distributor";

const ICONS: Record<DistributorBenefitIcon, LucideIcon> = {
  range: Pill,
  quality: ShieldCheck,
  communication: MessagesSquare,
  region: MapPinned,
};

export function DistributorBenefits() {
  return (
    <section aria-labelledby="benefits-heading">
      <FadeIn>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">Why Genoine</p>
        <h2
          id="benefits-heading"
          className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
        >
          Why partner with us
        </h2>
      </FadeIn>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8">
        {DISTRIBUTOR_BENEFITS.map((benefit, index) => (
          <li key={benefit.title}>
            <FadeIn delay={(index % 2) * 0.08} className="h-full">
              <FeatureCard icon={ICONS[benefit.icon]} title={benefit.title} text={benefit.text} />
            </FadeIn>
          </li>
        ))}
      </ul>
    </section>
  );
}
