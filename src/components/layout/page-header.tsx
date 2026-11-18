import { existsSync } from "node:fs";
import path from "node:path";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  /** Last item is the current page (no href). */
  breadcrumb: Crumb[];
  eyebrow: string;
  title: string;
  intro?: string;
  /** Optional visual on the right (md and up). */
  aside?: ReactNode;
  /**
   * Full-bleed banner image (path in /public). `mobile` is used below md only if the
   * file exists; otherwise phones get the plain blush banner.
   */
  background?: { desktop: string; mobile?: string };
  className?: string;
};

function publicFileExists(file: string): boolean {
  return existsSync(path.join(process.cwd(), "public", file));
}

/** Decorative banner image(s). Eager + high priority: it is the page's largest visual. */
function HeaderBackground({ desktop, mobile }: { desktop: string; mobile?: string }) {
  const hasMobile = Boolean(mobile && publicFileExists(mobile));
  return (
    <div aria-hidden="true">
      {hasMobile && mobile && (
        <Image
          src={mobile}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-bottom md:hidden"
        />
      )}
      <Image
        src={desktop}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="hidden object-cover object-right md:block"
      />
      {/* Keeps the heading readable over the image's faint line art. */}
      <div className="absolute inset-0 hidden bg-linear-to-r from-brand-tint/85 to-transparent to-55% md:block" />
      {hasMobile && <div className="absolute inset-0 bg-brand-tint/60 md:hidden" />}
    </div>
  );
}

/** Blush banner at the top of inner pages: breadcrumb, eyebrow, h1, intro. */
export function PageHeader({ breadcrumb, eyebrow, title, intro, aside, background, className }: PageHeaderProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 pt-6 md:px-10 md:pt-8", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[32px] bg-brand-tint px-6 py-12 md:px-12 md:py-16",
          background
            ? "md:flex md:min-h-[360px] md:items-center"
            : "md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-8",
        )}
      >
        {background && <HeaderBackground desktop={background.desktop} mobile={background.mobile} />}
        <div className={cn(background && "relative z-10 max-w-xl")}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded-sm outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-foreground">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <p className="mt-6 text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-[32px] leading-tight font-semibold text-foreground md:text-[48px]">
            {title}
          </h1>
          {intro && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{intro}</p>}
        </div>

        {aside && !background && <div className="hidden md:block">{aside}</div>}
      </div>
    </div>
  );
}
