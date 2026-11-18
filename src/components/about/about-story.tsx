import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";

type Fact = { value: string; label: string };

/** Below this many products, show qualitative facts instead of small counts. */
const MIN_PRODUCTS_FOR_COUNTS = 15;

type AboutStoryProps = {
  heading: string;
  paragraphs: string[];
  image: { src: string; alt: string };
  /** Year from the incorporation date. */
  established: string;
  areaCount: number;
  productCount: number;
};

function buildFacts(established: string, areaCount: number, productCount: number): Fact[] {
  const founded = { value: `Est. ${established}`, label: "Incorporated in Assam" };
  if (productCount < MIN_PRODUCTS_FOR_COUNTS) {
    return [
      founded,
      { value: "Certified partners", label: "Quality-assured manufacturing" },
      { value: "Growing range", label: "Tablets, syrups and more" },
    ];
  }
  return [
    founded,
    ...(areaCount > 0
      ? [{ value: `${areaCount} ${areaCount === 1 ? "speciality" : "specialities"}`, label: "Across key therapeutic areas" }]
      : []),
    { value: `${productCount} products`, label: "And growing" },
  ];
}

export function AboutStory({ heading, paragraphs, image, established, areaCount, productCount }: AboutStoryProps) {
  const facts = buildFacts(established, areaCount, productCount);

  return (
    <section aria-labelledby="story-heading" className="py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-16">
          <FadeIn className="md:pt-8">
            <h2
              id="story-heading"
              className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[40px]"
            >
              {heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative aspect-[5/6] overflow-hidden rounded-3xl bg-brand-tint">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <dl className="mt-10 grid divide-y rounded-3xl border md:mt-14 md:grid-cols-3 md:divide-x md:divide-y-0">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-1 px-6 py-5 md:px-8 md:py-7">
                <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="font-heading text-2xl font-semibold text-primary">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
