import { ExternalLink } from "lucide-react";

import { siteConfig } from "@/lib/seo";

/** "24.8649, 92.3591" → "24.8649,92.3591"; anything else → null. */
function asCoordinates(query: string): string | null {
  const match = query.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  return match ? `${match[1]},${match[2]}` : null;
}

/**
 * Keyless Google Maps embed. Coordinates get the business name as the pin label
 * ("lat,lng(Name)"); an address is searched as-is so Google can find it.
 */
function buildEmbed(query: string): { src: string; link: string } {
  const coordinates = asCoordinates(query);
  const q = coordinates ? `${coordinates}(${siteConfig.name})` : query;
  return {
    src: `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&hl=en&output=embed`,
    link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates ?? query)}`,
  };
}

/** Contact page map. Renders nothing without a location. */
export function ContactMap({ query }: { query?: string }) {
  const location = query?.trim();
  if (!location) return null;
  const { src, link } = buildEmbed(location);

  return (
    <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border bg-brand-tint sm:aspect-[2/1]">
      <iframe
        src={src}
        title={`Map: ${siteConfig.name}, ${location}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm outline-none hover:bg-brand-tint focus-visible:ring-2 focus-visible:ring-ring"
      >
        View larger map
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}
