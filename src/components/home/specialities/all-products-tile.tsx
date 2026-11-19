import { ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Closing tile for a speciality grid: same shape as SpecialityTile, magenta, links to the full range. */
export function AllProductsTile({ className }: { className?: string }) {
  return (
    <Link
      href="/products"
      aria-label="All products: browse the full range"
      className={cn(
        "group flex flex-col items-start gap-3 rounded-2xl bg-primary p-4 text-primary-foreground",
        "md:min-h-[140px] md:flex-row md:items-center md:gap-4 md:rounded-3xl md:p-5",
        "transition-colors duration-300 outline-none hover:bg-brand-primary-light",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 transition-transform duration-300 ease-out motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-3 md:size-[104px]"
      >
        <LayoutGrid className="size-7 md:size-10" />
      </span>

      <div className="w-full min-w-0 md:flex-1">
        <h3 className="truncate font-heading text-base font-semibold md:text-xl">All products</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-primary-foreground/80 md:text-sm">
          Browse the full range
        </p>
      </div>

      <span
        aria-hidden="true"
        className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm md:flex"
      >
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
