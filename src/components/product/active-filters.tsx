import { X } from "lucide-react";
import Link from "next/link";

import { type FilterKey, type ProductFilters, withFilter } from "@/lib/product-filters";

import type { ProductFacets } from "./types";

type ActiveFiltersProps = {
  filters: ProductFilters;
  facets: ProductFacets;
};

/** Removable chips for the active filters (labels resolved from the facets). */
export function ActiveFilters({ filters, facets }: ActiveFiltersProps) {
  const label = (key: FilterKey, value: string): string => {
    const options = key === "area" ? facets.areas : key === "category" ? facets.categories : facets.forms;
    return options.find((o) => o.value === value)?.label ?? value;
  };

  const chips = (["area", "category", "form", "q"] as const)
    .filter((key) => filters[key])
    .map((key) => ({
      key,
      text: key === "q" ? `“${filters.q}”` : label(key, filters[key] as string),
    }));

  if (!chips.length) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={withFilter(filters, chip.key, undefined)}
            scroll={false}
            aria-label={`Remove filter ${chip.text}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary py-1 pr-2 pl-3 text-sm text-primary transition-colors outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chip.text}
            <X className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
