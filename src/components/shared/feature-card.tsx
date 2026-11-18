import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Icon tile background (CSS colour or var); defaults to the pink tint. */
  tint?: string;
  titleClassName?: string;
  className?: string;
};

/** White card with an icon, title and one line (About values, home "Why Genoine"). */
export function FeatureCard({ icon: Icon, title, text, tint, titleClassName, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-3xl border bg-card p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(34,18,27,0.2)]",
        className,
      )}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-tint text-primary"
        style={tint ? { backgroundColor: tint } : undefined}
        aria-hidden="true"
      >
        <Icon className="size-6" />
      </span>
      <h3 className={cn("mt-5 font-heading text-lg font-semibold text-foreground", titleClassName)}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
