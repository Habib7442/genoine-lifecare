import Link from "next/link";
import type { ReactNode } from "react";

type LegalPlaceholderProps = {
  title: string;
  children?: ReactNode;
};

/** Plain legal page shell. The final text is pending client approval, so these pages are noindex. */
export function LegalPlaceholder({ title, children }: LegalPlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-12 md:px-10 md:py-20">
      <h1 className="text-3xl font-semibold text-primary md:text-4xl">{title}</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
        {children}
        <p>
          The full {title.toLowerCase()} is being prepared and will be published here soon. For any
          questions in the meantime, please{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
