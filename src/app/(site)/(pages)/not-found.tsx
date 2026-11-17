import { ArrowRight, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-24 text-center md:py-32">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <SearchX className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-heading text-[28px] font-semibold text-foreground md:text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The product or page you’re looking for doesn’t exist or may have been removed.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Browse all products <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
