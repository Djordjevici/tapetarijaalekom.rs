import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/**
 * Politika privatnosti i kolačića imaju `robots: { index: false }` u svom
 * metadata — to je dovoljno i ispravno za skidanje sa indeksa. Da bi Google
 * uopšte video taj noindex, mora smeti da ih pročita, pa ih NE dodajemo u
 * disallow ovde (disallow + noindex zajedno mogu ostaviti URL indeksiran
 * bez sadržaja, jer robot nikad ne stigne do meta taga).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
