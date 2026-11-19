import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import type { AboutLeader } from "@/sanity/lib/about";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ProfileLink({ leader }: { leader: AboutLeader }) {
  if (!leader.profileUrl) return null;
  return (
    <a
      href={leader.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      View profile
      <ArrowUpRight className="size-4" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Photo, or initials on the tint when there is no photo yet. */
function LeaderPhoto({ leader, sizes }: { leader: AboutLeader; sizes: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-tint">
      {leader.photo ? (
        <Image src={leader.photo.src} alt={leader.photo.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-full items-center justify-center font-heading text-5xl font-semibold text-primary/60"
        >
          {initials(leader.name)}
        </span>
      )}
    </div>
  );
}

/** Site name for the profile button, from the link's domain. */
function profileLabel(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const known: Record<string, string> = {
    "researchgate.net": "ResearchGate",
    "linkedin.com": "LinkedIn",
    "scholar.google.com": "Google Scholar",
    "orcid.org": "ORCID",
  };
  return known[host] ?? host;
}

/** Highlighted person: avatar, name and a profile button. No titles or labels. */
function FounderCard({ leader }: { leader: AboutLeader }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-primary/15 bg-card p-6 text-center shadow-[0_24px_50px_-30px_rgba(142,27,94,0.35)] sm:w-fit sm:flex-row sm:gap-6 sm:pr-8 sm:text-left">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-brand-tint ring-4 ring-brand-tint">
        {leader.photo ? (
          <Image src={leader.photo.src} alt={leader.photo.alt} fill sizes="96px" className="object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-full items-center justify-center font-heading text-3xl font-semibold text-primary/70"
          >
            {initials(leader.name)}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-heading text-2xl font-semibold text-foreground">{leader.name}</h3>
        {leader.bio && <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{leader.bio}</p>}
        {leader.profileUrl && (
          <a
            href={leader.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View {profileLabel(leader.profileUrl)} profile
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}

/** "Our leadership". Founders first in a large card; renders nothing while Studio has no leaders. */
export function AboutLeaders({ leaders }: { leaders: AboutLeader[] }) {
  if (leaders.length === 0) return null;
  const founders = leaders.filter((leader) => leader.isFounder);
  const others = leaders.filter((leader) => !leader.isFounder);

  // Only highlighted people: one compact band (heading left, card right) instead of a mostly empty grid.
  const compact = others.length === 0;

  return (
    <section aria-labelledby="leaders-heading" className="mt-12 bg-brand-tint py-12 md:mt-24 md:py-16">
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-5 md:px-10",
          compact && "md:flex md:items-center md:justify-between md:gap-12",
        )}
      >
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Leadership</p>
          <h2
            id="leaders-heading"
            className="mt-2 font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
          >
            The people behind Genoine
          </h2>
        </FadeIn>

        {founders.length > 0 && (
          <ul className={cn("grid gap-5", compact ? "mt-8 shrink-0 md:mt-0" : "mt-8 md:mt-10")}>
            {founders.map((leader) => (
              <li key={leader.key}>
                <FadeIn>
                  <FounderCard leader={leader} />
                </FadeIn>
              </li>
            ))}
          </ul>
        )}

        {others.length > 0 && (
          <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((leader, index) => (
              <li key={leader.key}>
                <FadeIn delay={(index % 3) * 0.08} className="h-full rounded-3xl border bg-card p-5">
                  {leader.photo && (
                    <LeaderPhoto leader={leader} sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw" />
                  )}
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{leader.name}</h3>
                  <p className="text-sm font-medium text-primary">{leader.role}</p>
                  {leader.bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{leader.bio}</p>}
                  <ProfileLink leader={leader} />
                </FadeIn>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
