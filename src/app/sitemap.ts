import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/auth/login", lastModified: new Date(), priority: 1 },
    { url: "/auth/sign-up", lastModified: new Date(), priority: 0.8 },
    { url: "/auth/reset", lastModified: new Date(), priority: 0.5 },
  ];
}
