import Link from "next/link";

import { type FilterKey, type ProductFilters, activeFilterCount, productsHref, withFilter } from "@/lib/product-filters";
import { cn } from "@/lib/utils";

import type { FacetOption, ProductFacets } from "./types";

type FacetGroupProps = {
  title: string;
  filterKey: FilterKey;
  options: FacetOption[];
  filters: ProductFilters;
};

/** One facet: links that set (or, when active, clear) a single filter value. */
function FacetGroup({ title, filterKey, options: allOptions, filters }: FacetGroupProps) {
  const active = filters[filterKey];
  // Hide empty options (dead ends), but keep the active one so it can be cleared.
  const options = allOptions.filter((option) => option.count > 0 || option.value === active);
  if (!options.length) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">{title}</h3>
      <ul className="flex flex-col gap-0.5">
        {options.map((option) => {
          const isActive = active === option.value;
          return (
            <li key={option.value}>
              <Link
                href={withFilter(filters, filterKey, isActive ? undefined : option.value)}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors outline-none",
                  "hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "bg-secondary font-medium text-primary" : "text-foreground",
                )}
              >
                <span>{option.label}</span>
                <span className={cn("text-xs tabular-nums", isActive ? "text-primary" : "text-muted-foreground")}>
                  {option.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ProductFiltersPanelProps = {
  facets: ProductFacets;
  filters: ProductFilters;
  className?: string;
};

/** All facets (used in the desktop sidebar and inside the mobile sheet). */
export function ProductFiltersPanel({ facets, filters, className }: ProductFiltersPanelProps) {
  const hasActive = activeFilterCount(filters, { includeSearch: true }) > 0;

  return (
    <nav aria-label="Product filters" className={cn("flex flex-col gap-6", className)}>
      <FacetGroup title="Therapeutic area" filterKey="area" options={facets.areas} filters={filters} />
      <FacetGroup title="Category" filterKey="category" options={facets.categories} filters={filters} />
      <FacetGroup title="Dosage form" filterKey="form" options={facets.forms} filters={filters} />
      {hasActive && (
        <Link
          href={productsHref({})}
          scroll={false}
          className="self-start rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Clear all filters
        </Link>
      )}
    </nav>
  );
}
