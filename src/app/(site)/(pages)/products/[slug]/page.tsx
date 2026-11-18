import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EnquireWhatsAppButton } from "@/components/product/enquire-whatsapp-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductEnquiryCta } from "@/components/product/product-enquiry-cta";
import { ProductGrid } from "@/components/product/product-grid";
import { ShareProductButton } from "@/components/product/share-product-button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { absoluteUrl, breadcrumbJsonLd, productJsonLd, productMetadata, type SeoProduct } from "@/lib/seo";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/sanity/lib/catalogue";
import { getSiteSettings } from "@/sanity/lib/site-settings";
import { FALLBACK_DISCLAIMER } from "@/lib/disclaimer";
import type { ProductDetail } from "@/components/product/types";

/**
 * With Cache Components this must return at least one param (an empty array fails the build).
 * Without products (e.g. Sanity not configured) we return a placeholder that resolves to notFound().
 */
const PLACEHOLDER_SLUG = "__no-products__";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getProductSlugs();
  return (slugs.length ? slugs : [PLACEHOLDER_SLUG]).map((slug) => ({ slug }));
}


function toSeoProduct(product: ProductDetail): SeoProduct {
  return {
    name: product.name,
    slug: product.slug,
    composition: product.composition,
    dosageForm: product.dosageForm,
    packSize: product.packSize,
    therapeuticArea: product.therapeuticArea?.title,
    shortDescription: product.shortDescription,
    seo: product.seo,
    image: product.imageSource ?? null,
  };
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? productMetadata(toSeoProduct(product)) : { title: "Product not found", robots: { index: false } };
}

/**
 * With Partial Prefetching on, `params` must be awaited inside <Suspense> so the route
 * has an instant static shell (otherwise Next reports "URL data during prerendering").
 * Known slugs are still prerendered via generateStaticParams; new ones stream behind the skeleton.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([getRelatedProducts(product), getSiteSettings()]);
  const seoProduct = toSeoProduct(product);
  const shareProps = {
    title: product.name,
    text: `${product.name} — ${product.composition}`,
    url: absoluteUrl(`/products/${product.slug}`),
  };

  const facts = [
    { label: "Composition", value: product.composition },
    { label: "Strength", value: product.strength },
    { label: "Dosage form", value: product.dosageForm },
    { label: "Pack size", value: product.packSize },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(seoProduct),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      {/* data-product-page: hides the floating WhatsApp bubble here (globals.css) */}
      <div data-product-page className="mx-auto w-full max-w-7xl px-5 pt-6 pb-16 md:px-10 md:pt-8 md:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li>
              <Link href="/products" className="rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring">
                Products
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li aria-current="page" className="truncate font-medium text-foreground">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.gallery} name={product.name} />

          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              {product.therapeuticArea && (
                <Badge asChild variant="secondary">
                  <Link href={`/products?area=${encodeURIComponent(product.therapeuticArea.slug)}`}>
                    {product.therapeuticArea.title}
                  </Link>
                </Badge>
              )}
              {product.category && (
                <Badge asChild variant="outline">
                  <Link href={`/products?category=${encodeURIComponent(product.category.slug)}`}>
                    {product.category.title}
                  </Link>
                </Badge>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <h1 className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-4xl">
                {product.name}
              </h1>
              {/* Mobile: compact round share button next to the name */}
              <ShareProductButton variant="icon" className="shrink-0 md:hidden" {...shareProps} />
            </div>
            <p className="mt-2 text-base leading-snug text-foreground/80 md:text-lg md:leading-normal">
              {product.composition}
            </p>
            {product.shortDescription && <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>}

            <dl className="mt-6 divide-y rounded-2xl border">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[120px_1fr] gap-4 px-4 py-3 text-sm sm:grid-cols-[150px_1fr]">
                  <dt className="text-muted-foreground">{fact.label}</dt>
                  <dd className="font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr]">
              <ProductEnquiryCta
                inline={<EnquireWhatsAppButton product={product} />}
                sticky={<EnquireWhatsAppButton product={product} />}
              />
              {/* Desktop: full share button (mobile uses the round one next to the name) */}
              <ShareProductButton className="hidden md:flex" {...shareProps} />
            </div>

            {product.indications.length > 0 && (
              <section className="mt-8">
                <h2 className="font-heading text-lg font-semibold text-foreground">Indications</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-foreground/85 marker:text-primary">
                  {product.indications.map((indication) => (
                    <li key={indication}>{indication}</li>
                  ))}
                </ul>
              </section>
            )}

            {product.usageNote && (
              <section className="mt-8">
                <h2 className="font-heading text-lg font-semibold text-foreground">Usage note</h2>
                <p className="mt-3 text-foreground/85">{product.usageNote}</p>
              </section>
            )}

            <p className="mt-8 rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground/75">
              {settings.disclaimer ?? FALLBACK_DISCLAIMER}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16 md:mt-24">
            <h2 id="related-heading" className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              More from {product.therapeuticArea?.title ?? "this range"}
            </h2>
            <ProductGrid products={related} className="mt-6" />
          </section>
        )}
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="mx-auto w-full max-w-7xl px-5 pt-6 pb-16 md:px-10 md:pt-8 md:pb-24">
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
