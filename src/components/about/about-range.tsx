import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SpecialityTile } from "@/components/home/specialities/speciality-tile";
import type { SpecialityArea } from "@/components/home/specialities/types";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/components/product/types";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

/** Desktop columns: as many as there are areas, up to 3. */
const DESKTOP_COLS = ["lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3"];

/** Chip labels for the dosage forms in the product schema. */
const FORM_LABELS: Record<string, string> = {
  Tablet: "Tablets",
  Capsule: "Capsules",
  Syrup: "Syrups",
  Injection: "Injections",
  Suspension: "Suspensions",
  "Ointment/Cream": "Ointments & creams",
  Drops: "Drops",
  "Sachet/Powder": "Sachets & powders",
  Softgel: "Softgels",
};

type AboutRangeProps = {
  /** Only areas with at least one product. */
  areas: SpecialityArea[];
  forms: string[];
  /** Featured first, max 8. */
  products: ProductCardData[];
};

export function AboutRange({ areas, forms, products }: AboutRangeProps) {
  return (
    <section aria-labelledby="range-heading" className="pt-12 md:pt-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our range</p>
          <h2
            id="range-heading"
            className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
          >
            What we offer
          </h2>
        </FadeIn>

        {areas.length > 0 && (
          <FadeIn className="mt-8 md:mt-10">
            <ul
              aria-label="Therapeutic areas"
              className={cn(
                "grid gap-4 md:grid-cols-2 md:gap-5",
                DESKTOP_COLS[Math.min(areas.length, 3) - 1],
              )}
            >
              {areas.map((area, index) => (
                <li key={area.id}>
                  <SpecialityTile area={area} index={index} className="h-full" />
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        {products.length > 0 && (
          <FadeIn className="mt-12 md:mt-14">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">Our products</h3>
              <Link
                href="/products"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring"
              >
                View all <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            {forms.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Browse by dosage form">
                {forms.map((form) => (
                  <li key={form}>
                    <Link
                      href={`/products?form=${encodeURIComponent(form)}`}
                      className="inline-flex rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:border-primary/30 hover:bg-brand-tint hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {FORM_LABELS[form] ?? form}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Mobile: one swipeable row (~70% cards) so the page stays short. Desktop: 4 columns. */}
            <ul className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <li key={product.id} className="w-[70vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <ProductCard product={product} size="compact" />
                </li>
              ))}
            </ul>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
