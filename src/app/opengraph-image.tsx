import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name} — presvlačenje nameštaja, Novi Sad`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#12151A",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            color: "#9AA49C",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Tapetarija · Petrovaradin
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#E7E6E0",
              fontSize: 76,
              lineHeight: 1.06,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Presvlačimo nameštaj</span>
            <span style={{ color: "#D08B5C" }}>koji vredi zadržati.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 8,
            }}
          >
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                style={{ width: 18, height: 2, background: "#BE7242" }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#9AA49C",
            fontSize: 26,
          }}
        >
          <span style={{ color: "#E7E6E0" }}>{site.name}</span>
          <span>
            {site.phone.display} · {site.foundedLabel}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
