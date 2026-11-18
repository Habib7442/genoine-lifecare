import Image from "next/image";

import { HERO_SHOWCASE } from "@/content/heroShowcase";
import { cn } from "@/lib/utils";

/** Order on screen: left, centre (largest), right. */
const BOTTLES = [
  { id: "wellness", box: "left-0 bottom-2 h-[70%] w-[34%]", delay: "0.4s" },
  { id: "gastro-care", box: "left-1/2 bottom-6 z-10 h-full w-[40%] -translate-x-1/2", delay: "0s" },
  { id: "womens-care", box: "right-0 bottom-0 h-[76%] w-[34%]", delay: "0.8s" },
];

/** Decorative design bottles for the About header (static assets from the home hero). */
export function AboutHeaderBottles() {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[420px] lg:h-[340px]" aria-hidden="true">
      {BOTTLES.map((bottle) => {
        const entry = HERO_SHOWCASE.find((item) => item.id === bottle.id);
        if (!entry) return null;
        return (
          <div key={bottle.id} className={cn("absolute", bottle.box)}>
            <div className="relative size-full motion-safe:animate-icon-bob" style={{ animationDelay: bottle.delay }}>
              <Image
                src={entry.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 170px, 140px"
                className="object-contain object-bottom drop-shadow-[0_18px_22px_rgba(142,27,94,0.22)]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
