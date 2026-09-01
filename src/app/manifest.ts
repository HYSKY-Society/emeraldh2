import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emerald H2 — Fuel Up Smarter",
    short_name: "Emerald H2",
    description:
      "Locate hydrogen stations, reserve fuel, and connect with the Emerald H2 community.",
    start_url: "/app",
    scope: "/app",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b3f26",
    theme_color: "#0b8a4b",
    categories: ["utilities", "travel", "social"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
