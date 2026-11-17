import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Genoine Lifecare Private Limited",
    template: "%s | Genoine Lifecare",
  },
  description:
    "Genoine Lifecare Private Limited — pharmaceutical marketing company in Assam, India.",
};

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
