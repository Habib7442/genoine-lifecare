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
  className?: string;
};

export function SpecialityTile({ area, index, className }: SpecialityTileProps) {
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
        // min-h leaves room for the icon (top-5 + its size) above the fixed text block.
        "group relative flex min-h-[224px] flex-col overflow-hidden rounded-3xl p-6 md:min-h-[248px]",
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
          className="absolute top-5 right-5 size-[100px] motion-safe:animate-icon-bob md:size-[120px]"
        >
          <Image
            src={area.iconSrc}
            alt=""
            width={120}
            height={120}
            sizes="(min-width: 768px) 120px, 100px"
            className="size-full object-contain drop-shadow-[0_12px_16px_rgba(142,27,94,0.18)] transition-[translate,rotate] duration-300 ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-6"
          />
        </span>
      )}

      {/* Fixed structure pinned to the bottom: 1-line title + a 2-line description slot,
          so every title in a row sits at the same height. */}
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-xl font-semibold text-foreground">{area.title}</h3>
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
