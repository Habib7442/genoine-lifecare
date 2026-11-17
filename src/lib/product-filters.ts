/**
 * /products filters live in the URL: ?area=<slug>&category=<slug>&form=<Tablet…>&q=<text>.
 * One value per facet keeps links short and shareable (AGENTS.md §7).
 */

export type ProductFilters = {
  area?: string;
  category?: string;
  form?: string;
  q?: string;
};

export const FILTER_KEYS = ["area", "category", "form", "q"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

type RawSearchParams = Record<string, string | string[] | undefined>;

const MAX_QUERY_LENGTH = 60;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  const trimmed = v?.trim();
  return trimmed ? trimmed : undefined;
}

/** Read filters from Next's `searchParams`, ignoring empty or unknown values. */
export function parseFilters(params: RawSearchParams): ProductFilters {
  return {
    area: first(params.area),
    category: first(params.category),
    form: first(params.form),
    q: first(params.q)?.slice(0, MAX_QUERY_LENGTH),
  };
}

export function activeFilterCount(filters: ProductFilters, { includeSearch = false } = {}): number {
  return FILTER_KEYS.filter((key) => (includeSearch || key !== "q") && filters[key]).length;
}

/** `/products?...` URL for the given filters (stable key order, empty values dropped). */
export function productsHref(filters: ProductFilters): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

/** URL with one filter set (or removed when `value` is undefined); other filters are kept. */
export function withFilter(filters: ProductFilters, key: FilterKey, value: string | undefined): string {
  return productsHref({ ...filters, [key]: value });
}

/**
 * GROQ `match` pattern for the search box: each word becomes a prefix match,
 * so "panto 40" finds "Pantoprazole 40mg". Returns null when there's nothing to search.
 */
export function searchPattern(q: string | undefined): string[] | null {
  const words = (q ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.+-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);
  return words.length ? words.map((word) => `${word}*`) : null;
}
