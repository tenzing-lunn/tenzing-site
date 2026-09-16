import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, fontWeight: 500 }}>{site.name}</div>
          <div style={{ fontSize: 28, color: "#a3a3a3", marginTop: 24, maxWidth: 900 }}>
            {site.description}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#6b6b6b", fontFamily: "monospace" }}>
          ~/{site.username} ❯
        </div>
      </div>
    ),
    size,
  );
}
