export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/distributor", label: "Distributor" },
  { href: "/contact", label: "Contact" },
];

/** Header call to action label. Its link is a WhatsApp general enquiry (built in SiteHeader). */
export const HEADER_CTA_LABEL = "Enquire now";

export function isActiveLink(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
