import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getSpecialityAreas } from "./get-speciality-areas";
import { SpecialityGrid } from "./speciality-grid";

/** Home: "Browse by therapeutic area", directly under the hero. */
export async function SpecialitiesSection() {
  const areas = await getSpecialityAreas();

  return (
    <section aria-labelledby="specialities-heading" className="py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Our specialities</p>
            <h2
              id="specialities-heading"
              className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
            >
              Find care by speciality
            </h2>
            <p className="mt-2 text-muted-foreground">Explore our range across key therapeutic areas.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:text-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all products <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <SpecialityGrid areas={areas} />
      </div>
    </section>
  );
}
