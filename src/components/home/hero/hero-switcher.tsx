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
 * Thumbnail switcher. Auto-rotate is driven by the CSS progress bar itself
 * (`animationend` → next product), so pausing the bar pauses the rotation exactly.
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
      aria-label="Featured products"
      className={cn(
        glass,
        "flex snap-x gap-2 overflow-x-auto rounded-2xl p-2 [scrollbar-width:none]",
        className,
      )}
    >
      {products.map((product, index) => {
        const active = index === activeIndex;
        return (
          <div key={product.id} className="flex shrink-0 snap-start flex-col items-center gap-1.5 p-0.5">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${product.title}`}
              aria-pressed={active}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border border-white/40 bg-white/20 backdrop-blur transition outline-none md:size-[72px]",
                "hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white",
                active && "scale-105 ring-2 ring-brand-accent focus-visible:ring-brand-accent",
              )}
            >
              <Image
                src={product.image.src}
                alt=""
                fill
                sizes="72px"
                className="object-contain p-2"
              />
            </button>

            {/* Progress for the active tile; its end advances the hero. */}
            <span className="h-0.5 w-10 overflow-hidden rounded-full bg-white/30" aria-hidden="true">
              {active && autoRotate && (
                <span
                  key={activeIndex}
                  className="block h-full w-full origin-left rounded-full bg-white motion-safe:animate-hero-progress"
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
