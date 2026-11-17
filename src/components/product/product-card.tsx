import { Pill } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { EnquireWhatsAppButton } from "./enquire-whatsapp-button";
import type { ProductCardData } from "./types";

type ProductCardProps = {
  product: ProductCardData;
  /** Load the image eagerly (first row above the fold). */
  priority?: boolean;
  className?: string;
};

/**
 * Shared product card. The image and text link to the product page; the WhatsApp
 * "Enquire" button sits below as a sibling, so it never triggers navigation.
 */
export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300",
        "hover:border-primary/30 hover:shadow-[0_18px_40px_-22px_rgba(34,18,27,0.3)]",
        className,
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="relative aspect-square bg-white">
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              loading={priority ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className="object-contain p-5 transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-secondary text-primary/40">
              <Pill className="size-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 border-t px-4 pt-3 pb-4">
          <h3 className="font-heading text-base leading-snug font-semibold text-foreground">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.composition}</p>
          {(product.dosageForm || product.packSize) && (
            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1.5">
              {product.dosageForm && <Badge variant="secondary">{product.dosageForm}</Badge>}
              {product.packSize && <span className="text-xs text-muted-foreground">{product.packSize}</span>}
            </div>
          )}
        </div>
      </Link>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <EnquireWhatsAppButton product={product} size="sm" />
      </div>
    </article>
  );
}
