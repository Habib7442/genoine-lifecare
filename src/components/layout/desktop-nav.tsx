"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_LINKS, isActiveLink } from "./nav-links";

type DesktopNavProps = {
  tone: "light" | "dark";
  className?: string;
};

export function DesktopNav({ tone, className }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-7">
        {NAV_LINKS.map((link) => {
          const active = isActiveLink(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm text-sm transition-colors outline-none focus-visible:ring-2",
                  tone === "light"
                    ? "text-white/80 hover:text-white focus-visible:ring-white aria-[current=page]:font-medium aria-[current=page]:text-white"
                    : "text-muted-foreground hover:text-primary focus-visible:ring-ring aria-[current=page]:text-primary",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
