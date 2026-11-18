"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Mobile-only "Swipe →" hint; disappears after the target list is scrolled once. */
export function SwipeHint({ targetId, className }: { targetId: string; className?: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const onScroll = () => setHidden(true);
    target.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "text-xs text-muted-foreground transition-opacity duration-300 md:hidden",
        hidden && "opacity-0",
        className,
      )}
    >
      Swipe →
    </span>
  );
}
