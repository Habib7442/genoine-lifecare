import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Input/trigger styling for fields with a leading icon. */
export const FIELD_CLASS = "h-12 rounded-xl pl-11 text-base md:text-sm";
export const SELECT_TRIGGER_CLASS = "h-12! w-full rounded-xl pl-11 text-base md:text-sm";
export const TEXTAREA_CLASS = "min-h-36 rounded-xl px-4 py-3 text-base md:text-sm";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label, optional leading icon, control and inline error (id `<id>-error` for aria-describedby). */
export function FormField({ id, label, required, error, icon, className, children }: FormFieldProps) {
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
          <span
            className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:size-[18px]"
            aria-hidden="true"
          >
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
