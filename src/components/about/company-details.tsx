import { FadeIn } from "@/components/shared/fade-in";

type CompanyDetailsProps = {
  legalName: string;
  cin: string;
  registrar: string;
  /** Already formatted, e.g. "4 May 2026". */
  incorporated: string;
  address?: string;
};

/** "Company information": public registration facts. Never show share capital. */
export function CompanyDetails({ legalName, cin, registrar, incorporated, address }: CompanyDetailsProps) {
  const rows = [
    { term: "Legal name", value: legalName },
    { term: "CIN", value: cin },
    { term: "Registrar", value: registrar },
    { term: "Incorporated", value: incorporated },
    ...(address ? [{ term: "Registered office", value: address }] : []),
  ];

  return (
    <section aria-labelledby="company-heading" className="pt-12 md:pt-24">
      <FadeIn className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="rounded-3xl border bg-card p-6 md:p-10">
          <h2 id="company-heading" className="font-heading text-2xl font-semibold text-foreground md:text-[28px]">
            Company information
          </h2>
          <dl className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {rows.map((row) => (
              <div key={row.term} className="border-b pb-4 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                <dt className="text-sm text-muted-foreground">{row.term}</dt>
                <dd className="mt-1 font-medium break-words whitespace-pre-line text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </FadeIn>
    </section>
  );
}
