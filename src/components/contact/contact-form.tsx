"use client";

import { BookOpen, Building2, Mail, Phone, User } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { FIELD_CLASS, FormField as Field, SELECT_TRIGGER_CLASS, TEXTAREA_CLASS } from "@/components/forms/form-field";
import { WhatsAppSubmit } from "@/components/forms/whatsapp-submit";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isEmail, isIndianMobile, PHONE_ERROR } from "@/lib/validation";
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

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!isIndianMobile(values.phone)) errors.phone = PHONE_ERROR;
  if (values.email.trim() && !isEmail(values.email))
    errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please write a short message.";
  return errors;
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
            <SelectTrigger id={id("subject")} className={SELECT_TRIGGER_CLASS}>
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
            className={TEXTAREA_CLASS}
          />
        </Field>

        <WhatsAppSubmit sent={sent} />
      </form>
    </div>
  );
}
