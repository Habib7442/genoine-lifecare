"use client";

import { ArrowRight, Pill } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SwapIn } from "./swap-in";
import type { HeroShowcaseItem } from "./types";

type HeroProductCardProps = {
  item: HeroShowcaseItem;
  /** Fade on speciality changes (not on first render). */
  animateSwap: boolean;
};

/** Glass card with one real Sanity product from the active speciality. Hidden when there is none. */
export function HeroProductCard({ item, animateSwap }: HeroProductCardProps) {
  const product = item.featured;
  if (!product) return null;
  const meta = [product.dosageForm, product.packSize].filter(Boolean).join(" · ");

  return (
    <SwapIn
      key={item.id}
      animate={animateSwap}
      className="w-[260px] rounded-2xl border border-white bg-white/90 p-5 shadow-[0_20px_40px_-12px_rgba(30,58,95,0.25)] backdrop-blur-md text-shadow-none"
    >
      <p className="text-xs font-semibold tracking-wider text-primary uppercase">Featured in {item.title}</p>

      <div className="relative mt-3 h-[120px] overflow-hidden rounded-xl bg-brand-tint">
        {product.image ? (
          <Image src={product.image.src} alt={product.image.alt} fill sizes="208px" className="object-contain p-2" />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/40">
            <Pill className="size-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <p className="mt-3 font-heading text-lg leading-snug font-semibold text-foreground">{product.name}</p>
      {meta && <p className="mt-0.5 text-sm text-foreground/60">{meta}</p>}

      <Link
        href={`/products/${product.slug}`}
        className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        View product
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </SwapIn>
  );
}
