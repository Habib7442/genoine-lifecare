"use client";

import { Menu } from "lucide-react";
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
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";

import { BrandSeal } from "./brand-seal";
import { HEADER_CTA_LABEL, NAV_LINKS, isActiveLink } from "./nav-links";

type MobileNavProps = {
  tone: "light" | "dark";
  /** "Enquire now" target: a WhatsApp link (new tab), or /contact when no number is set. */
  ctaHref: string;
  className?: string;
};

export function MobileNav({ tone, ctaHref, className }: MobileNavProps) {
  const ctaIsWhatsApp = ctaHref.startsWith("https://wa.me/");
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
          <SheetTitle className="flex items-center gap-2.5 font-heading text-lg text-primary">
            <BrandSeal className="size-9" />
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
          <Button asChild size="lg" className="h-11 w-full rounded-full">
            <a
              href={ctaHref}
              onClick={() => setOpen(false)}
              {...(ctaIsWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <WhatsAppIcon className="size-4" /> {HEADER_CTA_LABEL}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
