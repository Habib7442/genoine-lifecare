"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { HEADER_CTA, NAV_LINKS, isActiveLink } from "./nav-links";

type MobileNavProps = {
  tone: "light" | "dark";
  className?: string;
};

export function MobileNav({ tone, className }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Open menu"
          className={cn(
            "rounded-full",
            tone === "light" &&
              "border border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:text-white",
            className,
          )}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg text-primary">
            Genoine Lifecare
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="block rounded-md px-2 py-3 text-base text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:font-medium aria-[current=page]:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto p-4">
          <Button asChild variant="accent" size="lg" className="h-11 w-full rounded-full">
            <Link href={HEADER_CTA.href} onClick={() => setOpen(false)}>
              {HEADER_CTA.label} <ArrowRight />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
