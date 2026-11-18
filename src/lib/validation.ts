/** 10-digit Indian mobile (starts 6–9), optionally prefixed with +91, 91 or 0. */
export function isIndianMobile(phone: string): boolean {
  if (!/^[\d\s()+-]+$/.test(phone.trim())) return false;
  const digits = phone.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
  return /^[6-9]\d{9}$/.test(local);
}

export const PHONE_ERROR = "Please enter a valid 10-digit mobile number (with or without +91).";

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
