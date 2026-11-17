"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FiltersSheetProps = {
  /** Number of active facet filters (shown on the trigger). */
  activeCount: number;
  resultCount: number;
  /** Server-rendered filter panel. */
  children: ReactNode;
};

/** Mobile/tablet: filters in a slide-in sheet. Filter links update the URL; the list behind updates live. */
export function FiltersSheet({ activeCount, resultCount, children }: FiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-12 shrink-0 rounded-full px-4 text-[15px]">
          <SlidersHorizontal />
          Filters
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">Filters</SheetTitle>
          <SheetDescription>Narrow the list by speciality, category or dosage form.</SheetDescription>
        </SheetHeader>
        <div className="scrollbar-brand flex-1 overflow-y-auto px-4">{children}</div>
        <SheetFooter>
          <Button onClick={() => setOpen(false)} className="h-12 rounded-full text-[15px]">
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
