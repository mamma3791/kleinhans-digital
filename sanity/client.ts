import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "z24f1kn9",
  dataset: "production",
  apiVersion: "2024-04-11",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export const queries = {
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category,
    body,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }`,

  postsByCategory: `*[_type == "post" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category
  }`,
};
