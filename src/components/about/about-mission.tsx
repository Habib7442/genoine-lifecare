import { Eye, type LucideIcon, Target } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

type AboutMissionProps = { mission: string; vision: string };

function StatementCard({
  icon: Icon,
  title,
  text,
  className,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <div className={cn("h-full rounded-3xl p-6 md:p-8", className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm" aria-hidden="true">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-base leading-relaxed text-foreground/75 md:text-lg">{text}</p>
    </div>
  );
}

export function AboutMission({ mission, vision }: AboutMissionProps) {
  return (
    <section aria-label="Mission and vision" className="pb-12 md:pb-24">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 md:grid-cols-2 md:px-10">
        <FadeIn>
          <StatementCard icon={Target} title="Our mission" text={mission} className="bg-brand-tint" />
        </FadeIn>
        <FadeIn delay={0.08}>
          <StatementCard icon={Eye} title="Our vision" text={vision} className="bg-[var(--tint-yellow)]" />
        </FadeIn>
      </div>
    </section>
  );
}
