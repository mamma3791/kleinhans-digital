import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kleinhansdigital.co.za";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/configure`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
