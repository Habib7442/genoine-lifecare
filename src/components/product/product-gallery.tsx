"use client";

import { Pill } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { GalleryImage } from "./types";

/** Main image + thumbnail buttons. Images sit on white so pack shots stay true to colour. */
export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border bg-secondary text-primary/40">
        <Pill className="size-16" aria-hidden="true" />
        <span className="sr-only">No image available for {name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border bg-brand-tint md:bg-white">
        <Image
          key={current.key}
          src={current.src}
          alt={current.alt}
          fill
          preload={active === 0}
          sizes="(min-width: 1024px) 45vw, 100vw"
          // Mobile: image fills ~85% of the panel (7.5% padding each side).
          className="object-contain p-[7.5%] md:p-12"
        />
      </div>

      {images.length > 1 && (
        <div role="group" aria-label="Product images" className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.key}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === active}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border bg-white transition outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring",
                index === active ? "border-primary ring-1 ring-primary" : "hover:border-primary/40",
              )}
            >
              <Image src={image.thumb} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
