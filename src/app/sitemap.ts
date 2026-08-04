import type { MetadataRoute } from "next";

import { flags, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const sada = new Date();
  const strane: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: sada, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/usluge`,
      lastModified: sada,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/kontakt`,
      lastModified: sada,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  // /radovi ulazi u sitemap tek kad ima pravog sadržaja
  if (flags.worksInNav) {
    strane.push({
      url: `${site.url}/radovi`,
      lastModified: sada,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return strane;
}
