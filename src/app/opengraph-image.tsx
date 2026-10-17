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
          background: "#ffffff",
          color: "#0c0c0c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9 }}>{site.name}</div>
          <div style={{ fontSize: 28, color: "#3b3b3b", marginTop: 24, maxWidth: 900 }}>
            {site.description}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#6f6f6f" }}>{new URL(site.url).host}</div>
      </div>
    ),
    size,
  );
}
