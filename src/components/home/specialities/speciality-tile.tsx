import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { SpecialityArea } from "./types";

/** Rotation used when an area has no tint in Sanity (CSS tokens in globals.css). */
const TINT_VARS = ["--tint-blush", "--tint-yellow", "--tint-lilac", "--tint-mint"];

type SpecialityTileProps = {
  area: SpecialityArea;
  index: number;
  /** `compact`: smaller tile and icon (About page range row). */
  size?: "default" | "compact";
  className?: string;
};

export function SpecialityTile({ area, index, size = "default", className }: SpecialityTileProps) {
  const compact = size === "compact";
  const background = area.tint ?? `var(${TINT_VARS[index % TINT_VARS.length]})`;
  const count =
    area.productCount === undefined
      ? undefined
      : area.productCount === 0
        ? "Range coming soon"
        : `${area.productCount} ${area.productCount === 1 ? "product" : "products"}`;

  return (
    <Link
      href={`/products?area=${encodeURIComponent(area.slug)}`}
      aria-label={[area.title, area.description, count].filter(Boolean).join(": ")}
      style={{ backgroundColor: background }}
      className={cn(
        // Mobile 180px (arrow bottom-aligned to clear the 96px icon); desktop leaves room for the 120px icon.
        "group relative flex flex-col overflow-hidden rounded-3xl",
        compact ? "min-h-[150px] p-4 md:min-h-[170px] md:p-5" : "min-h-[180px] p-5 md:min-h-[248px] md:p-6",
        "transition-shadow duration-300 outline-none hover:shadow-[0_18px_40px_-18px_rgba(34,18,27,0.25)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {area.iconSrc && (
        // Outer span: gentle idle bob (staggered per tile). Inner image: hover float + tilt.
        <span
          aria-hidden="true"
          style={{ animationDelay: `${index * 0.3}s` }}
          className={cn(
            "absolute motion-safe:animate-icon-bob",
            compact ? "top-3 right-3 size-[72px]" : "top-4 right-4 size-24 md:top-5 md:right-5 md:size-[120px]",
          )}
        >
          <Image
            src={area.iconSrc}
            alt=""
            width={120}
            height={120}
            sizes={compact ? "72px" : "(min-width: 768px) 120px, 96px"}
            className="size-full object-contain drop-shadow-[0_12px_16px_rgba(142,27,94,0.18)] transition-[translate,rotate] duration-300 ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-6"
          />
        </span>
      )}

      {/* Fixed structure pinned to the bottom: 1-line title + a 2-line description slot,
          so every title in a row sits at the same height. */}
      <div className="relative z-10 mt-auto flex items-end justify-between gap-3 md:items-center">
        <div className="min-w-0">
          <h3 className={cn("truncate font-heading font-semibold text-foreground", compact ? "text-lg" : "text-xl")}>{area.title}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm leading-[1.375rem] text-foreground/60">
            {area.description}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
