import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "TechNext '28 — National Industrial Expo & Innovation Showcase, VIT Vellore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logos/technext-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #001733 0%, #002147 55%, #0D2E5C 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={617} height={119} alt="" style={{ marginBottom: 40 }} />
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2, maxWidth: 1000 }}>
          TechNext &apos;28 · National Industrial Expo &amp; Innovation Showcase
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 32, fontWeight: 700, color: "#84E320" }}>
          VIT Vellore, India
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: "rgba(255,255,255,0.8)" }}>
          Industry, startup &amp; student stalls · alongside ic-ETITE&apos;28
        </div>
      </div>
    ),
    size
  );
}
