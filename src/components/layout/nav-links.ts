export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/distributor", label: "Distributor" },
  { href: "/contact", label: "Contact" },
];

/** Primary header call to action. Points to the distributor page until the enquiry sheet exists (Phase 4). */
export const HEADER_CTA: NavLink = { href: "/distributor", label: "Enquire now" };

export function isActiveLink(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
