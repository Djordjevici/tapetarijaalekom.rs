import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Samostalni izlaz — kopira samo fajlove koje `next start` stvarno koristi
   * u `.next/standalone`. Bez ovoga Docker slika mora da nosi ceo
   * `node_modules`, što je znatno veće i sporije za deploy na Hetzner VM.
   */
  output: "standalone",
};

export default nextConfig;
