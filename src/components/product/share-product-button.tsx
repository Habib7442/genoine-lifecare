"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type ShareProductButtonProps = {
  title: string;
  text: string;
  /** Absolute product URL. */
  url: string;
  /** `full`: labelled button (desktop). `icon`: small round button next to the product name (mobile). */
  variant?: "full" | "icon";
  className?: string;
};

/** Native share sheet where available (most phones); otherwise copies the link. */
export function ShareProductButton({ title, text, url, variant = "full", className }: ShareProductButtonProps) {
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User closed the share sheet: nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: title });
    } catch {
      toast.error("Couldn't copy the link", { description: url });
    }
  }

  const base = cn(
    "items-center justify-center border border-primary/30 bg-white text-primary transition-colors outline-none",
    "hover:border-primary hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  );

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={share}
        aria-label={`Share ${title}`}
        className={cn(base, "flex size-10 rounded-full", className)}
      >
        <Share2 className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(base, "flex h-12 w-full gap-2 rounded-full px-6 text-[15px] font-medium", className)}
    >
      <Share2 className="size-4" aria-hidden="true" />
      Share product
    </button>
  );
}
