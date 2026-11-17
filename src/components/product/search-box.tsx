"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { type ProductFilters, withFilter } from "@/lib/product-filters";
import { cn } from "@/lib/utils";

type SearchBoxProps = {
  filters: ProductFilters;
  className?: string;
};

const DEBOUNCE_MS = 350;

/** Searches name + composition. Updates `?q=` (keeping other filters) after a short pause in typing. */
export function SearchBox({ filters, className }: SearchBoxProps) {
  const router = useRouter();
  const [value, setValue] = useState(filters.q ?? "");
  const [isPending, startTransition] = useTransition();
  const timer = useRef<number | undefined>(undefined);

  // The query this box last sent to the URL. When results for it arrive, the user may
  // already have typed more, so that URL change must not overwrite the box.
  const [sentQ, setSentQ] = useState(filters.q);

  // Keep the box in sync only when the URL changes from elsewhere (chips, "Clear all", back button).
  const [lastQ, setLastQ] = useState(filters.q);
  if (filters.q !== lastQ) {
    setLastQ(filters.q);
    if (filters.q !== sentQ) {
      setSentQ(filters.q);
      setValue(filters.q ?? "");
    }
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function navigate(next: string) {
    const q = next.trim() || undefined;
    if (q === filters.q) return; // nothing changed (e.g. only a trailing space)
    setSentQ(q);
    startTransition(() => router.replace(withFilter(filters, "q", q), { scroll: false }));
  }

  function onChange(next: string) {
    setValue(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => navigate(next), DEBOUNCE_MS);
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        window.clearTimeout(timer.current);
        navigate(value);
      }}
      className={cn("relative", className)}
    >
      <label htmlFor="product-search" className="sr-only">
        Search products by name or composition
      </label>
      <Search
        className={cn("pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2", isPending ? "text-primary" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or composition"
        autoComplete="off"
        maxLength={60}
        className="h-12 w-full rounded-full border bg-white pr-11 pl-11 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}
