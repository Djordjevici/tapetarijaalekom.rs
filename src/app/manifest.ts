import type { MetadataRoute } from "next";

import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description:
      "Tapetarska radionica u Petrovaradinu. Presvlačenje i tapaciranje nameštaja.",
    start_url: "/",
    display: "standalone",
    background_color: "#12151A",
    theme_color: "#1C2F2A",
    lang: "sr-Latn-RS",
    icons: [
      { src: "/logo/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
