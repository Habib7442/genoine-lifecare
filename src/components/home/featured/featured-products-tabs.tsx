"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FeaturedTab = { value: string; label: string };
export type FeaturedItem = { id: string; area?: string; card: ReactNode };

const ALL = "all";

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/** Speciality pill tabs + animated grid of server-rendered product cards. */
export function FeaturedProductsTabs({ tabs, items }: { tabs: FeaturedTab[]; items: FeaturedItem[] }) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? items : items.filter((item) => item.area === active);
  const allTabs: FeaturedTab[] = [{ value: ALL, label: "All" }, ...tabs];

  return (
    // "user": the slide-up and layout motion are skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      {tabs.length > 0 && (
        <div
          role="tablist"
          aria-label="Filter featured products by speciality"
          className="-mx-5 mb-6 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {allTabs.map((tab) => {
            const selected = tab.value === active;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="featured-grid"
                onClick={() => setActive(tab.value)}
                className={cn(
                  "h-10 shrink-0 snap-start rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-brand-tint text-foreground hover:bg-brand-tint-strong",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <motion.ul
        id="featured-grid"
        role="tabpanel"
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: 0.07 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <motion.li
              key={item.id}
              layout
              variants={itemVariants}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.card}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </MotionConfig>
  );
}
