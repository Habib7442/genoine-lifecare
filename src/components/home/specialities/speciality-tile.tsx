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

/**
 * Mobile: small vertical card (icon, title, description; the whole tile is the link).
 * md+: compact horizontal row (icon box, text, arrow). Used on Home and About.
 */
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
        "group flex flex-col items-start gap-3 rounded-2xl p-4",
        "md:min-h-[140px] md:flex-row md:items-center md:gap-4 md:rounded-3xl md:p-5",
        "transition-shadow duration-300 outline-none hover:shadow-[0_18px_40px_-18px_rgba(34,18,27,0.25)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {area.iconSrc && (
        // Mobile: bare 56px icon. md+: 88px icon in a 104px white/60 box.
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center transition-transform duration-300 ease-out motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-3 md:size-[104px] md:rounded-2xl md:bg-white/60"
        >
          <Image
            src={area.iconSrc}
            alt=""
            width={88}
            height={88}
            sizes="(min-width: 768px) 88px, 56px"
            className="size-14 object-contain drop-shadow-[0_8px_12px_rgba(142,27,94,0.18)] md:size-[88px]"
          />
        </span>
      )}

      <div className="w-full min-w-0 md:flex-1">
        <h3 className="truncate font-heading text-base font-semibold text-foreground md:text-xl">{area.title}</h3>
        {area.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-foreground/60 md:text-sm">{area.description}</p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground md:flex"
      >
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
