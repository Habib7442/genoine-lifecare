/** Entrance sequence timings (seconds), in the order things appear. */
export const HERO_TIMING = {
  card: 0,
  headline: 0.25,
  product: 0.45,
  panels: 1.35,
} as const;

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Product switch: fade + slight scale in. */
export const swapTransition = { duration: 0.4, ease: EASE_OUT };

export const swapVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
};
