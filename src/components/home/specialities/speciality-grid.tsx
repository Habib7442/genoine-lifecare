"use client";

import { MotionConfig, motion } from "motion/react";

import { SpecialityTile } from "./speciality-tile";
import type { SpecialityArea } from "./types";

/**
 * Compact rows: 1 column on mobile, 2 on tablet, 3 on desktop (3×3 for 9 areas).
 * Tiles fade up in a stagger as they scroll into view.
 */
export function SpecialityGrid({ areas }: { areas: SpecialityArea[] }) {
  return (
    // "user": the slide-up is skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <ul
        className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3"
        aria-label="Therapeutic areas"
      >
        {areas.map((area, index) => (
          <motion.li
            key={area.id}
            className="h-full"
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
