import { BadgeCheck, FlaskConical, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

import { glass } from "./glass";
import { HERO_TRUST_TEXT } from "./hero-content";

const BADGES = [ShieldCheck, FlaskConical, BadgeCheck];

type HeroTrustPanelProps = {
  /** Single-line, smaller pill (mobile, under the headline). */
  compact?: boolean;
  className?: string;
};

export function HeroTrustPanel({ compact = false, className }: HeroTrustPanelProps) {
  return (
    <div
      className={cn(
        glass,
        "flex w-fit items-center rounded-full",
        compact ? "gap-2 py-1 pr-3.5 pl-1" : "gap-3 py-1.5 pr-5 pl-1.5",
        className,
      )}
    >
      <div className="flex -space-x-2" aria-hidden="true">
        {BADGES.map((Icon, index) => (
          <span
            key={index}
            className={cn(
              "flex items-center justify-center rounded-full border border-white/50 bg-white/25 backdrop-blur-md",
              compact ? "size-7" : "size-9",
            )}
          >
            <Icon className={cn("text-white", compact ? "size-3.5" : "size-4")} />
          </span>
        ))}
      </div>
      <p
        className={cn(
          "text-xs leading-tight font-medium text-white",
          compact ? "whitespace-nowrap" : "max-w-[11rem]",
        )}
      >
        {HERO_TRUST_TEXT}
      </p>
    </div>
  );
}
