import { ChevronRight } from "lucide-react";
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
  className?: string;
};

/** Blush banner at the top of inner pages: breadcrumb, eyebrow, h1, intro. */
export function PageHeader({ breadcrumb, eyebrow, title, intro, aside, className }: PageHeaderProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 pt-6 md:px-10 md:pt-8", className)}>
      <div className="relative overflow-hidden rounded-[32px] bg-brand-tint px-6 py-10 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-8 md:px-12 md:py-16">
        <div>
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

        {aside && <div className="hidden md:block">{aside}</div>}
      </div>
    </div>
  );
}
