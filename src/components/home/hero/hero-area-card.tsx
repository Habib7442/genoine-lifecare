"use client";

import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Droplet,
  HeartPulse,
  Leaf,
  Pill,
  ShieldPlus,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { createElement } from "react";

import { cn } from "@/lib/utils";

import { glass } from "./glass";
import { HERO_PRODUCTS_LINK } from "./hero-content";
import { SwapIn } from "./swap-in";
import type { HeroProduct } from "./types";

/** Icon by keyword in the therapeutic area title. Unknown areas get a pill. */
const AREA_ICONS: [RegExp, LucideIcon][] = [
  [/gastro|digest/i, Activity],
  [/diabet/i, Droplet],
  [/cardi|heart/i, HeartPulse],
  [/pain|ortho/i, Bone],
  [/antibio|infect/i, ShieldPlus],
  [/paed|pedia|child|kid|gyn|women/i, Baby],
  [/derma|skin/i, Sparkles],
  [/nutra|vitamin|wellness/i, Leaf],
  [/respir/i, Wind],
];

function AreaIcon({ area }: { area?: string }) {
  const match = area ? AREA_ICONS.find(([pattern]) => pattern.test(area)) : undefined;
  const props = { className: "size-5 text-white", "aria-hidden": true } as const;
  return match ? createElement(match[1], props) : <Pill {...props} />;
}

type HeroAreaCardProps = {
  product: HeroProduct;
  /** Fade the content in on product changes (false for the first render). */
  animateSwap: boolean;
  className?: string;
};

/** Small glass card for the active product's therapeutic area (desktop only). */
export function HeroAreaCard({ product, animateSwap, className }: HeroAreaCardProps) {
  return (
    <div className={cn(glass, "w-[180px] rounded-2xl p-4", className)}>
      <SwapIn key={product.id} animate={animateSwap}>
        <span className="flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/25">
          <AreaIcon area={product.therapeuticArea} />
        </span>
        <p className="mt-3 font-heading text-base font-medium text-white">
          {product.therapeuticArea ?? "Our range"}
        </p>
        {product.therapeuticAreaDescription && (
          <p className="mt-1 text-xs leading-snug text-white">
            {product.therapeuticAreaDescription}
          </p>
        )}
      </SwapIn>
      <Link
        href={HERO_PRODUCTS_LINK.href}
        className="mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-white underline underline-offset-4 outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
      >
        {HERO_PRODUCTS_LINK.label}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
