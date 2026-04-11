import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/onboarding"],
      },
    ],
    sitemap: "https://kleinhansdigital.co.za/sitemap.xml",
    host: "https://kleinhansdigital.co.za",
  };
}
