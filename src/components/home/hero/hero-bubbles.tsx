import { cn } from "@/lib/utils";

/**
 * Two decorative glass bubbles in open sky: top-right, and between the headline
 * and the bottle. Desktop only (on mobile the panels fill the lower card).
 * Pure CSS; the float stops under reduced motion.
 */
const BUBBLES = [
  { className: "top-[20%] right-[14%] size-7", delay: "0s" },
  { className: "top-[25%] left-[37%] size-4", delay: "-4s" },
];

export function HeroBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {BUBBLES.map((bubble, index) => (
        <span
          key={index}
          style={{ animationDelay: bubble.delay }}
          className={cn(
            "absolute rounded-full border border-white/50",
            "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_35%,transparent_70%)]",
            "motion-safe:animate-hero-bubble",
            bubble.className,
          )}
        />
      ))}
    </div>
  );
}
