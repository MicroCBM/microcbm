import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MicroCBM — Condition-Based Maintenance",
    short_name: "MicroCBM",
    description:
      "Predict failures, extend asset life, and lower maintenance costs with smart condition monitoring.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1565d8",
    icons: [
      {
        src: "/assets/svg/new_logo_white.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
