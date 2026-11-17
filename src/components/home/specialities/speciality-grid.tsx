"use client";

import { MotionConfig, motion } from "motion/react";

import { SpecialityTile } from "./speciality-tile";
import type { SpecialityArea } from "./types";

/**
 * Mobile: horizontal scroll-snap row (tiles ~70% wide, next tile peeks in).
 * Tablet: 3 columns. Desktop: 4 columns.
 * Tiles fade up in a stagger as they scroll into view.
 */
export function SpecialityGrid({ areas }: { areas: SpecialityArea[] }) {
  return (
    // "user": the slide-up is skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <ul
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        aria-label="Therapeutic areas"
      >
        {areas.map((area, index) => (
          <motion.li
            key={area.id}
            className="w-[70vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none"
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
