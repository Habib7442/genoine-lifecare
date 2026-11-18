import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/sanity/lib/catalogue";

import { FeaturedProductsTabs, type FeaturedItem, type FeaturedTab } from "./featured-products-tabs";

/**
 * Home: "Featured products", after "Find care by speciality".
 * All data is fetched once on the server; cards are server-rendered and the client
 * component only filters them by speciality tab.
 */
export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  // Tabs: only specialities that have at least one featured product, in speciality order.
  const tabs = new Map<string, FeaturedTab & { order: number }>();
  for (const product of products) {
    if (product.area && !tabs.has(product.area.slug)) {
      tabs.set(product.area.slug, { value: product.area.slug, label: product.area.title, order: product.area.order });
    }
  }
  const sortedTabs: FeaturedTab[] = [...tabs.values()]
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
    .map(({ value, label }) => ({ value, label }));

  const items: FeaturedItem[] = products.map((product, index) => ({
    id: product.id,
    area: product.area?.slug,
    card: <ProductCard product={product} priority={index < 2} />,
  }));

  return (
    <section aria-labelledby="featured-heading" className="pt-2 pb-12 md:pt-8 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our range</p>
            <h2
              id="featured-heading"
              className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
            >
              Featured products
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all products <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <FeaturedProductsTabs tabs={sortedTabs} items={items} />

        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-primary px-7 text-[15px] font-medium text-primary transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore full range <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
