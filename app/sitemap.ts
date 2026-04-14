import { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://kleinhansdigital.co.za";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/configure`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts: { slug: { current: string }; publishedAt: string }[] = await sanityClient.fetch(
      `*[_type == "post"] { slug, publishedAt }`
    );
    postRoutes = posts.map((post) => ({
      url: `${base}/blog/${post.slug.current}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity unavailable — return static routes only
  }

  return [...staticRoutes, ...postRoutes];
}
