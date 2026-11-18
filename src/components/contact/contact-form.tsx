"use client";

import { BookOpen, Building2, Mail, Phone, User } from "lucide-react";
import { type FormEvent, type ReactNode, useId, useState } from "react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { contactEnquiryMessage, getWhatsAppLink } from "@/lib/whatsapp";

export const SUBJECTS = ["General question", "Product enquiry", "Become a distributor", "Other"] as const;

/** ?subject=<key> pre-selects a subject, e.g. /contact?subject=distributor. */
export const SUBJECT_PARAMS: Record<string, (typeof SUBJECTS)[number]> = {
  general: "General question",
  product: "Product enquiry",
  distributor: "Become a distributor",
  other: "Other",
};

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  subject: SUBJECTS[0],
  message: "",
};

/** 10-digit Indian mobile (starts 6–9), optionally prefixed with +91, 91 or 0. */
function isIndianMobile(phone: string): boolean {
  if (!/^[\d\s()+-]+$/.test(phone.trim())) return false;
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return /^[6-9]\d{9}$/.test(local);
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!isIndianMobile(values.phone)) errors.phone = "Please enter a valid 10-digit mobile number (with or without +91).";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please write a short message.";
  return errors;
}

const FIELD_CLASS = "h-12 rounded-xl pl-11 text-base md:text-sm";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, required, error, icon, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground [&_svg]:size-[18px]" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type ContactFormProps = {
  /** Fallback when no WhatsApp number is configured. */
  email: string;
  initialSubject?: (typeof SUBJECTS)[number];
};

/** "Send us a message": validates, then opens WhatsApp (or email) with the details prefilled. Nothing is stored. */
export function ContactForm({ email, initialSubject }: ContactFormProps) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ ...EMPTY, subject: initialSubject ?? EMPTY.subject });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const id = (name: keyof Values) => `${uid}-${name}`;
  const set = (name: keyof Values) => (value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setSent(false);
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const a11y = (name: keyof Values) => ({
    id: id(name),
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstError = (Object.keys(found) as (keyof Values)[])[0];
    if (firstError) {
      document.getElementById(id(firstError))?.focus();
      return;
    }

    const text = contactEnquiryMessage({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      subject: values.subject,
      message: values.message.trim(),
    });
    const whatsapp = getWhatsAppLink(text);
    if (whatsapp) {
      window.open(whatsapp, "_blank", "noopener,noreferrer");
      setSent(true);
    } else {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${values.subject}`)}&body=${encodeURIComponent(text)}`;
    }
  }

  return (
    <div>
      <h2 className="font-heading text-[28px] leading-tight font-semibold text-foreground md:text-[32px]">
        Send us a message
      </h2>
      <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
        Fill in the form and we&apos;ll reply on WhatsApp.
      </p>

      <form noValidate onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id={id("firstName")} label="First name" required error={errors.firstName} icon={<User />}>
          <Input
            {...a11y("firstName")}
            autoComplete="given-name"
            placeholder="Enter first name"
            value={values.firstName}
            onChange={(event) => set("firstName")(event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id={id("lastName")} label="Last name" icon={<User />}>
          <Input
            {...a11y("lastName")}
            autoComplete="family-name"
            placeholder="Enter last name"
            value={values.lastName}
            onChange={(event) => set("lastName")(event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email} icon={<Mail />}>
          <Input
            {...a11y("email")}
            type="email"
            autoComplete="email"
            placeholder="Enter email"
            value={values.email}
            onChange={(event) => set("email")(event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id={id("phone")} label="Phone" required error={errors.phone} icon={<Phone />}>
          <Input
            {...a11y("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter phone"
            value={values.phone}
            onChange={(event) => set("phone")(event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id={id("company")} label="Firm / company name" icon={<Building2 />}>
          <Input
            {...a11y("company")}
            autoComplete="organization"
            placeholder="Enter firm name"
            value={values.company}
            onChange={(event) => set("company")(event.target.value)}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id={id("subject")} label="Subject" icon={<BookOpen />}>
          <Select value={values.subject} onValueChange={set("subject")}>
            <SelectTrigger id={id("subject")} className="h-12! w-full rounded-xl pl-11 text-base md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id={id("message")} label="Message" required error={errors.message} className="sm:col-span-2">
          <Textarea
            {...a11y("message")}
            placeholder="Type here…"
            value={values.message}
            onChange={(event) => set("message")(event.target.value)}
            className="min-h-36 rounded-xl px-4 py-3 text-base md:text-sm"
          />
        </Field>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-colors outline-none hover:bg-brand-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            Send on WhatsApp
          </button>
          <p role="status" className="mt-3 text-sm font-medium text-primary empty:hidden">
            {sent ? "WhatsApp opened — send the message to reach us." : ""}
          </p>
        </div>
      </form>
    </div>
  );
}
