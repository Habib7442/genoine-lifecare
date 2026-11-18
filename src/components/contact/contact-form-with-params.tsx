"use client";

import { useSearchParams } from "next/navigation";

import { ContactForm, SUBJECT_PARAMS } from "./contact-form";

/** Pre-selects the subject from ?subject=<key> (e.g. ?subject=distributor). */
export function ContactFormWithParams({ email }: { email: string }) {
  const key = useSearchParams().get("subject")?.toLowerCase() ?? "";
  const initialSubject = SUBJECT_PARAMS[key];
  // Remount when the subject changes so the initial state applies.
  return <ContactForm key={initialSubject ?? "default"} email={email} initialSubject={initialSubject} />;
}
