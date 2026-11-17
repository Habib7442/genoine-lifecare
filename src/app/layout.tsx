import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";

import { defaultMetadata } from "@/lib/seo";

import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site-wide defaults (metadataBase, title template, description, verification…).
 * Lives in the root layout so it applies to every route, including /studio.
 * Note: a title template only applies to *child* segments, which is why it is here
 * and not in (site)/layout.tsx (whose page.tsx would be the same segment).
 */
export const metadata: Metadata = defaultMetadata;

/**
 * Root layout: only <html>/<body>, fonts and global CSS.
 * The site chrome (header/footer) lives in src/app/(site)/layout.tsx so that
 * /studio renders without it.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} h-full antialiased`}
    >
      {/* Browser extensions often inject attributes on <body> (e.g. data-testim-*).
          This only ignores attribute mismatches on <body> itself, not its children. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
