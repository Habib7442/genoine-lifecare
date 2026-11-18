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

/** Compact horizontal tile: icon box, title + description, arrow. Used on Home and About. */
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
        "group flex min-h-[140px] items-center gap-4 rounded-3xl p-5",
        "transition-shadow duration-300 outline-none hover:shadow-[0_18px_40px_-18px_rgba(34,18,27,0.25)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {area.iconSrc && (
        // 88px box on small phones so the text keeps room; 104px from sm.
        <span
          aria-hidden="true"
          className="flex size-[88px] shrink-0 items-center justify-center rounded-2xl bg-white/60 transition-transform duration-300 ease-out motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-3 sm:size-[104px]"
        >
          <Image
            src={area.iconSrc}
            alt=""
            width={88}
            height={88}
            sizes="(min-width: 640px) 88px, 72px"
            className="size-[72px] object-contain drop-shadow-[0_8px_12px_rgba(142,27,94,0.18)] sm:size-[88px]"
          />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-heading text-xl font-semibold text-foreground">{area.title}</h3>
        {area.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-foreground/60">{area.description}</p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
      >
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
