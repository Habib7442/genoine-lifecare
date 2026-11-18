"use client";

import { MotionConfig, motion } from "motion/react";

import { cn } from "@/lib/utils";

import { SpecialityTile } from "./speciality-tile";
import type { SpecialityArea } from "./types";

type SpecialityGridProps = {
  areas: SpecialityArea[];
  /** Used by <SwipeHint targetId> to hide the hint after the first scroll. */
  id?: string;
  /** Desktop column class (default 3 columns). */
  desktopCols?: string;
};

/**
 * Mobile: two rows that scroll sideways (cards 44% wide, snap to the page padding).
 * Tablet: 2 columns. Desktop: 3 columns (3×3 for 9 areas).
 * Tiles fade up in a stagger as they scroll into view.
 */
export function SpecialityGrid({ areas, id, desktopCols = "lg:grid-cols-3" }: SpecialityGridProps) {
  return (
    // "user": the slide-up is skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <ul
        id={id}
        aria-label="Therapeutic areas"
        className={cn(
          "-mx-5 grid auto-cols-[44%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto px-5 pb-1",
          "snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:mx-0 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:grid-rows-none md:gap-5 md:overflow-visible md:px-0 md:pb-0",
          desktopCols,
        )}
      >
        {areas.map((area, index) => (
          <motion.li
            key={area.id}
            className="h-full snap-start"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <SpecialityTile area={area} index={index} className="h-full" />
          </motion.li>
        ))}
      </ul>
    </MotionConfig>
  );
}
