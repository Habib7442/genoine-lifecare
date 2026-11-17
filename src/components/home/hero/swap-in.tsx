"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { swapTransition, swapVariants } from "./motion";

type SwapInProps = {
  children: ReactNode;
  /** False on the first render, so content doesn't fade in twice during the entrance sequence. */
  animate: boolean;
  className?: string;
};

/**
 * Fades its content in when its React `key` changes (give it `key={product.id}`).
 *
 * Deliberately no exit animation: `AnimatePresence mode="wait"` can get stuck with
 * nothing rendered when the key changes again mid-exit (fast clicks, auto-rotate),
 * leaving empty panels. A keyed fade-in always shows the active product.
 */
export function SwapIn({ children, animate, className }: SwapInProps) {
  return (
    <motion.div
      className={className}
      variants={swapVariants}
      initial={animate ? "initial" : false}
      animate="animate"
      transition={swapTransition}
    >
      {children}
    </motion.div>
  );
}
