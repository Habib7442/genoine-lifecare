import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import { AboutHeaderBottles } from "./about-header-bottles";

/** Group shot of the design bottles. Falls back to the separate bottles if the file is removed. */
const FAMILY_IMAGE = "/about/family.webp";
const hasFamilyImage = existsSync(path.join(process.cwd(), "public", FAMILY_IMAGE));

/** Decorative visual on the right of the About header (md and up). */
export function AboutHeaderVisual() {
  if (!hasFamilyImage) return <AboutHeaderBottles />;

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px] motion-safe:animate-icon-bob" aria-hidden="true">
      <Image
        src={FAMILY_IMAGE}
        alt=""
        fill
        preload
        sizes="(min-width: 1280px) 480px, 40vw"
        className="object-contain drop-shadow-[0_24px_30px_rgba(142,27,94,0.2)]"
      />
    </div>
  );
}
