import { FadeIn } from "@/components/shared/fade-in";
import { DISTRIBUTOR_STEPS } from "@/content/distributor";

/** "How it works": vertical timeline on mobile, a row of three from md. */
export function DistributorSteps() {
  return (
    <section aria-labelledby="steps-heading" className="mt-12 md:mt-16">
      <FadeIn>
        <h2 id="steps-heading" className="font-heading text-2xl font-semibold text-foreground">
          How it works
        </h2>
        {/* Mobile: ml-5 keeps the 40px circles (centred on the line) inside the container. */}
        <ol className="mt-6 ml-5 grid gap-6 border-l border-primary/20 pl-8 md:ml-0 md:grid-cols-3 md:border-l-0 md:pl-0">
          {DISTRIBUTOR_STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                className="absolute top-0 -left-[52px] flex size-10 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground md:static"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="font-heading font-semibold text-foreground md:mt-4">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </FadeIn>
    </section>
  );
}
