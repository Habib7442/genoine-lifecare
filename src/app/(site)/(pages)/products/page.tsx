import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ActiveFilters } from "@/components/product/active-filters";
import { FiltersSheet } from "@/components/product/filters-sheet";
import { ProductFiltersPanel } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBox } from "@/components/product/search-box";
import { Skeleton } from "@/components/ui/skeleton";
import { activeFilterCount, parseFilters, productsHref } from "@/lib/product-filters";
import { pageMetadata, therapeuticAreaMetadata } from "@/lib/seo";
import { getAreaBySlug, getFacets, getProducts } from "@/sanity/lib/catalogue";

/** ?area= shows "<Area> medicines"; canonical stays /products so filtered views aren't duplicates. */
export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const { area } = parseFilters(await searchParams);
  const match = area ? await getAreaBySlug(area) : null;
  return match ? therapeuticAreaMetadata(match) : pageMetadata.products;
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-8 pb-16 md:px-10 md:pt-12 md:pb-24">
      <Suspense fallback={<CatalogueSkeleton />}>
        <Catalogue searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/** Request-time part: reads the URL filters, then fetches (cached per filter combination). */
async function Catalogue({ searchParams }: { searchParams: PageProps<"/products">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  const [products, facets] = await Promise.all([getProducts(filters), getFacets()]);
  const areaTitle = filters.area ? facets.areas.find((a) => a.value === filters.area)?.label : undefined;
  const facetCount = activeFilterCount(filters);

  return (
    <>
      <header className="mb-6 md:mb-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our products</p>
        <h1 className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]">
          {areaTitle ? `${areaTitle} medicines` : "All products"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse by speciality, category or dosage form, or search by name or composition.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFiltersPanel facets={facets} filters={filters} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex gap-3">
            <SearchBox filters={filters} className="flex-1" />
            <div className="lg:hidden">
              <FiltersSheet activeCount={facetCount} resultCount={products.length}>
                <ProductFiltersPanel facets={facets} filters={filters} />
              </FiltersSheet>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <ActiveFilters filters={filters} facets={facets} />
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} columns={3} className="mt-5" />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center rounded-3xl bg-secondary px-6 py-16 text-center">
      <h2 className="font-heading text-xl font-semibold text-foreground">No products match</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try a different search or remove a filter to see more of our range.
      </p>
      <Link
        href={productsHref({})}
        scroll={false}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Clear filters
      </Link>
    </div>
  );
}

function CatalogueSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-10 w-64" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <div className="hidden flex-col gap-3 lg:flex">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <div>
          <Skeleton className="h-12 w-full rounded-full" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
