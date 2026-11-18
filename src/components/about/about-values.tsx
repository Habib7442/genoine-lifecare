import { HeartHandshake, type LucideIcon, ShieldCheck, Truck, Users } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { FeatureCard } from "@/components/shared/feature-card";
import type { AboutValue, AboutValueIcon } from "@/content/about";

const ICONS: Record<AboutValueIcon, LucideIcon> = {
  quality: ShieldCheck,
  integrity: HeartHandshake,
  partnership: Users,
  reliability: Truck,
};

type AboutValuesProps = { heading: string; values: AboutValue[] };

export function AboutValues({ heading, values }: AboutValuesProps) {
  return (
    <section aria-labelledby="values-heading" className="bg-brand-tint py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our values</p>
          <h2
            id="values-heading"
            className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
          >
            {heading}
          </h2>
        </FadeIn>
        <ul className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <li key={value.title}>
              <FadeIn delay={(index % 4) * 0.08} className="h-full">
                <FeatureCard icon={ICONS[value.icon]} title={value.title} text={value.text} />
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
