import { ArrowRight, Handshake, type LucideIcon, Pill, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { FeatureCard } from "@/components/shared/feature-card";
import { WHY_GENOINE, type WhyIcon } from "@/content/home";

const ICONS: Record<WhyIcon, LucideIcon> = {
  quality: ShieldCheck,
  range: Pill,
  supply: Truck,
  support: Handshake,
};

/** Icon tile tints, rotated per card (tokens in globals.css). */
const TINTS = ["var(--tint-blush)", "var(--tint-yellow)", "var(--tint-lilac)", "var(--tint-mint)"];

/** Lifestyle photo (static asset). */
const WHY_IMAGE = "/home/why-genoine.webp";

/**
 * Home: "Why Genoine". Desktop: text + lifestyle photo on the left (~40%), 2×2 cards on the right.
 * Mobile: text, then cards, then the image.
 */
export function WhyGenoineSection() {
  return (
    <section aria-labelledby="why-heading" className="bg-brand-tint py-12 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 md:px-10 lg:grid-cols-[2fr_3fr] lg:items-stretch lg:gap-10">
        {/* Left column. On mobile its two parts are split around the cards via `contents` + order. */}
        <div className="contents lg:flex lg:flex-col lg:gap-8">
          <FadeIn className="order-1">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Why Genoine</p>
            <h2
              id="why-heading"
              className="mt-2 max-w-[14ch] font-heading text-[28px] leading-tight font-semibold text-balance text-foreground md:text-[40px]"
            >
              A partner you can rely on
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              We work with doctors, chemists and distributors across the Northeast, with a focused range and a
              team you can reach directly.
            </p>
            <Link
              href="/distributor"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Become a distributor
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </FadeIn>

          {/* Desktop: fills the rest of the column so its bottom lines up with the cards */}
          <FadeIn className="order-3 lg:flex lg:flex-1 lg:flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgba(34,18,27,0.3)] lg:aspect-auto lg:min-h-[240px] lg:flex-1">
              {/* Photo fills the panel; focal point on the mother and baby (right of centre). */}
              <Image
                src={WHY_IMAGE}
                alt="A mother laughing as she lifts her smiling baby at home"
                fill
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 90vw"
                className="object-cover object-[62%_center]"
              />
            </div>
          </FadeIn>
        </div>

        {/* Desktop: 2×2 with equal rows stretched to the column height, so all cards match */}
        <ul className="order-2 grid gap-4 sm:grid-cols-2 md:gap-5 lg:h-full lg:grid-rows-2">
          {WHY_GENOINE.map((point, index) => (
            <li key={point.title}>
              <FadeIn delay={(index % 2) * 0.08} className="h-full">
                <FeatureCard
                  icon={ICONS[point.icon]}
                  title={point.title}
                  text={point.text}
                  tint={TINTS[index % TINTS.length]}
                  titleClassName="text-xl"
                />
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
