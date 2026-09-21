import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "EVExpert — Comprendre. Comparer. Calculer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de partage générée au build (statique) : aucun coût à l'exécution.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#020617",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#34d399", fontWeight: 700 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, marginTop: 20 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#cbd5e1", marginTop: 24, maxWidth: 900 }}>
          Autonomie, recharge et coût réel des voitures électriques
        </div>
      </div>
    ),
    size,
  );
}
