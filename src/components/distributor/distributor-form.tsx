"use client";

import { Briefcase, Building2, MapPin, Map as MapIcon, Phone, User } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { FIELD_CLASS, FormField, SELECT_TRIGGER_CLASS, TEXTAREA_CLASS } from "@/components/forms/form-field";
import { WhatsAppSubmit } from "@/components/forms/whatsapp-submit";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_TYPES, DISTRIBUTOR_STATES } from "@/content/distributor";
import { isIndianMobile, PHONE_ERROR } from "@/lib/validation";
import { distributorEnquiryMessage, getWhatsAppLink } from "@/lib/whatsapp";

type Values = {
  name: string;
  firm: string;
  phone: string;
  city: string;
  state: string;
  businessType: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  firm: "",
  phone: "",
  city: "",
  state: DISTRIBUTOR_STATES[0],
  businessType: "",
  message: "",
};

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.firm.trim()) errors.firm = "Please enter your firm name.";
  if (!isIndianMobile(values.phone)) errors.phone = PHONE_ERROR;
  if (!values.city.trim()) errors.city = "Please enter your city or district.";
  if (!values.state) errors.state = "Please choose your state.";
  if (!values.businessType) errors.businessType = "Please choose your business type.";
  return errors;
}

/** Distributor enquiry: validates, then opens WhatsApp (or email) with the details prefilled. Nothing is stored. */
export function DistributorForm({ email }: { email: string }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
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

    const text = distributorEnquiryMessage({
      name: values.name.trim(),
      firm: values.firm.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      state: values.state,
      businessType: values.businessType,
      message: values.message.trim() || undefined,
    });
    const whatsapp = getWhatsAppLink(text);
    if (whatsapp) {
      window.open(whatsapp, "_blank", "noopener,noreferrer");
      setSent(true);
    } else {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent("Distributor enquiry")}&body=${encodeURIComponent(text)}`;
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <FormField id={id("name")} label="Your name" required error={errors.name} icon={<User />}>
        <Input
          {...a11y("name")}
          autoComplete="name"
          placeholder="Enter your name"
          value={values.name}
          onChange={(event) => set("name")(event.target.value)}
          className={FIELD_CLASS}
        />
      </FormField>
      <FormField id={id("firm")} label="Firm name" required error={errors.firm} icon={<Building2 />}>
        <Input
          {...a11y("firm")}
          autoComplete="organization"
          placeholder="Enter firm name"
          value={values.firm}
          onChange={(event) => set("firm")(event.target.value)}
          className={FIELD_CLASS}
        />
      </FormField>
      <FormField id={id("phone")} label="Phone" required error={errors.phone} icon={<Phone />}>
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
      </FormField>
      <FormField id={id("city")} label="City / district" required error={errors.city} icon={<MapPin />}>
        <Input
          {...a11y("city")}
          autoComplete="address-level2"
          placeholder="Enter city or district"
          value={values.city}
          onChange={(event) => set("city")(event.target.value)}
          className={FIELD_CLASS}
        />
      </FormField>
      <FormField id={id("state")} label="State" required error={errors.state} icon={<MapIcon />}>
        <Select value={values.state} onValueChange={set("state")}>
          <SelectTrigger {...a11y("state")} className={SELECT_TRIGGER_CLASS}>
            <SelectValue placeholder="Choose state" />
          </SelectTrigger>
          <SelectContent>
            {DISTRIBUTOR_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField
        id={id("businessType")}
        label="Business type"
        required
        error={errors.businessType}
        icon={<Briefcase />}
      >
        <Select value={values.businessType} onValueChange={set("businessType")}>
          <SelectTrigger {...a11y("businessType")} className={SELECT_TRIGGER_CLASS}>
            <SelectValue placeholder="Choose business type" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField id={id("message")} label="Message" className="sm:col-span-2">
        <Textarea
          {...a11y("message")}
          placeholder="Areas you cover, products you're interested in… (optional)"
          value={values.message}
          onChange={(event) => set("message")(event.target.value)}
          className={TEXTAREA_CLASS}
        />
      </FormField>

      <WhatsAppSubmit sent={sent} />
    </form>
  );
}
