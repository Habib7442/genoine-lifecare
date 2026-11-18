"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Seconds, for staggering siblings. */
  delay?: number;
};

/** Fades its content up once when it scrolls into view. Skipped when the OS asks for reduced motion. */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
