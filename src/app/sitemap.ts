import type { MetadataRoute } from "next";

import { hasPublishedRealProjects } from "@/data/projects";
import { flags, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Ažurirati kada se sadržaj promeni; ne koristiti vreme svakog builda kao lažni signal.
  const sada = new Date("2026-08-19");
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

  // Demo projekti nisu portfolio i ne smeju u indeks pre originalnih radova.
  if (flags.worksInNav && hasPublishedRealProjects) {
    strane.push({
      url: `${site.url}/radovi`,
      lastModified: sada,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return strane;
}
