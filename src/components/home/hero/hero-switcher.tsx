"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { glass } from "./glass";
import type { HeroShowcaseItem } from "./types";

type HeroSwitcherProps = {
  products: HeroShowcaseItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Show the 6s progress bar and advance when it completes. */
  autoRotate: boolean;
  paused: boolean;
  onAdvance: () => void;
  className?: string;
};

/**
 * Thumbnail switcher: a horizontal row below lg, a vertical rail on the right from lg.
 * Auto-rotate is driven by the CSS progress bar itself (`animationend` → next item),
 * so pausing the bar pauses the rotation exactly.
 */
export function HeroSwitcher({
  products,
  activeIndex,
  onSelect,
  autoRotate,
  paused,
  onAdvance,
  className,
}: HeroSwitcherProps) {
  if (products.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Specialities"
      className={cn(
        glass,
        "flex snap-x gap-2 overflow-x-auto rounded-2xl p-2 [scrollbar-width:none]",
        // Rail (lg+): no glass panel behind the tiles, just the tiles.
        "lg:flex-col lg:gap-3 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
        className,
      )}
    >
      {products.map((product, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={product.id}
            className="flex shrink-0 snap-start flex-col items-center gap-1.5 p-0.5 lg:flex-row lg:gap-2"
          >
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${product.title}`}
              aria-pressed={active}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border backdrop-blur transition outline-none md:size-[72px] lg:size-16",
                // Row (below lg): lighter tiles; rail (lg+): subtler glass.
                "border-white/70 bg-white/40 lg:border-white/40 lg:bg-white/20",
                "hover:opacity-100 focus-visible:ring-2 focus-visible:ring-white lg:hover:bg-white/30",
                active
                  ? "scale-105 ring-2 ring-brand-accent focus-visible:ring-brand-accent"
                  : "opacity-80 lg:opacity-70",
              )}
            >
              <Image src={product.image.src} alt="" fill sizes="72px" className="object-contain p-2" />
            </button>

            {/* Progress for the active tile (below it on mobile, on its left edge on the rail); its end advances the hero. */}
            <span
              className="h-0.5 w-10 overflow-hidden rounded-full bg-white/30 lg:order-first lg:h-12 lg:w-0.5"
              aria-hidden="true"
            >
              {active && autoRotate && (
                <span
                  key={activeIndex}
                  className="block h-full w-full origin-left rounded-full bg-white motion-safe:animate-hero-progress lg:origin-top motion-safe:lg:animate-hero-progress-y"
                  style={{ animationPlayState: paused ? "paused" : "running" }}
                  onAnimationEnd={onAdvance}
                />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
