import { cn } from "@/lib/utils";

import { ProductCard } from "./product-card";
import type { ProductCardData } from "./types";

type ProductGridProps = {
  products: ProductCardData[];
  /** Columns at large sizes: 3 next to the filter sidebar, 4 full width. */
  columns?: 3 | 4;
  className?: string;
};

export function ProductGrid({ products, columns = 4, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5",
        columns === 4 && "xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}
