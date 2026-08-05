import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import FloatingContact from "@/components/layout/FloatingContact";
import MobileActionBar from "@/components/layout/MobileActionBar";
import CookieConsent from "@/components/layout/CookieConsent";
import { site } from "@/data/site";
import { localBusinessSchema, meta, websiteSchema } from "@/lib/seo";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...meta({
    title: "Tapetarija Alekom — presvlačenje nameštaja, Novi Sad",
    description:
      "Tapetarska radionica u Petrovaradinu od 2006. Presvlačenje kauča, fotelja i stolica, restauracija i šivenje po meri. Pošaljite fotografiju i zatražite procenu.",
  }),
  icons: {
    icon: [
      { url: "/logo/alekom-mark-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // Safari na iOS ne rasterizuje SVG za apple-touch-icon — mora PNG.
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1C2F2A",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr-Latn-RS" className={`${display.variable} ${body.variable}`}>
      {/* suppressHydrationWarning: className se namerno menja inline skriptom ispod pre hidratacije */}
      <body className="bez-js" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema(), websiteSchema()]),
          }}
        />
        {/* Skida oznaku bez-js pre prvog slikanja, da reveal ne bljesne. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.remove('bez-js')`,
          }}
        />

        <a
          href="#sadrzaj"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-sumrak focus:px-4 focus:py-2 focus:text-platno"
        >
          Preskoči na sadržaj
        </a>

        <Header />
        <main id="sadrzaj">{children}</main>
        <Footer />
        <FloatingContact />
        <MobileActionBar />
        <CookieConsent />
      </body>
    </html>
  );
}
