"use client";

import { motion } from "motion/react";
import Image from "next/image";

import type { HeroShowcaseItem } from "./types";

const FLOAT = { duration: 5, ease: "easeInOut", repeat: Infinity } as const;

type HeroProductImageProps = {
  product: HeroShowcaseItem;
  float: boolean;
  /** First product shown: also gets high fetch priority (it is the likely LCP element). */
  eager: boolean;
  /** Fade the new bottle in on product changes (false for the first render). */
  animateSwap: boolean;
  className?: string;
};

/**
 * Floating bottle with a soft shadow on the clouds. The shadow shrinks and fades
 * as the bottle rises and grows as it comes down (same 5s loop).
 */
export function HeroProductImage({ product, float, eager, animateSwap, className }: HeroProductImageProps) {
  return (
    <div className={className}>
      <div className="relative size-full">
        {/* Shadow under the bottle: 60% of its width. Tall enough that blur-2xl doesn't wash it out;
            a little stronger on mobile, where it sits on open sky instead of clouds. */}
        <div
          className="absolute inset-x-[22.5%] -bottom-[6%] h-[10%] md:inset-x-[20%] md:-bottom-[7%] md:h-[13%] lg:-bottom-[10%] lg:h-[20%]"
          aria-hidden="true"
        >
          {/* Mobile: 55% wide, softer (blur-xl); md+: the original cloud-bed shadow */}
          <motion.div
            className="size-full rounded-[50%] bg-hero-shadow/20 blur-xl md:bg-hero-shadow/25 md:blur-2xl"
            animate={float ? { scale: [1, 0.82, 1], opacity: [1, 0.55, 1] } : { scale: 1, opacity: 1 }}
            transition={float ? FLOAT : undefined}
          />
        </div>

        <motion.div
          className="relative size-full"
          animate={float ? { y: [0, -14, 0] } : { y: 0 }}
          transition={float ? FLOAT : undefined}
        >
          {/* Exactly one image, keyed by the active product: it can never show a stale bottle.
              (An overlapping crossfade could leave the old bottle on top after fast switches.) */}
          <motion.div
            key={product.id}
            className="absolute inset-0"
            initial={animateSwap ? { opacity: 0, scale: 0.95, y: 10 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              // Every hero bottle is above the fold and can become the LCP after a rotation: always eager.
              loading="eager"
              fetchPriority={eager ? "high" : "auto"}
              sizes="(min-width: 1024px) 32vw, 64vw"
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
