import Image from "next/image";

import { cn } from "@/lib/utils";

export const LOGO_SRC = "/brand/logo.webp";

/**
 * The circular company seal. Decorative (alt=""): it always sits next to the
 * "Genoine Lifecare" name, which is the accessible label.
 */
export function BrandSeal({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={96}
      height={96}
      sizes="56px"
      preload={preload}
      className={cn("size-10 shrink-0 object-contain", className)}
    />
  );
}
