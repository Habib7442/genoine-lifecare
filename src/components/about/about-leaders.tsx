import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";
import type { AboutLeader } from "@/sanity/lib/about";

/** "Our leadership". Renders nothing while Studio has no leaders (no placeholders). */
export function AboutLeaders({ leaders }: { leaders: AboutLeader[] }) {
  if (leaders.length === 0) return null;

  return (
    <section aria-labelledby="leaders-heading" className="mt-12 bg-brand-tint py-12 md:mt-24 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <FadeIn>
          <h2
            id="leaders-heading"
            className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
          >
            Our leadership
          </h2>
        </FadeIn>
        <ul className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader, index) => (
            <li key={leader.key}>
              <FadeIn delay={(index % 3) * 0.08} className="h-full rounded-3xl border bg-card p-5">
                {leader.photo && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-tint">
                    <Image
                      src={leader.photo.src}
                      alt={leader.photo.alt}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{leader.name}</h3>
                <p className="text-sm font-medium text-primary">{leader.role}</p>
                {leader.bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{leader.bio}</p>}
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
