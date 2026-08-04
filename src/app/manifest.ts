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
      { src: "/logo/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/logo/alekom-mark.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
