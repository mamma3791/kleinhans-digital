import type { Metadata } from "next";
import "./globals.css";
import Cursor from "./components/Cursor";
import LenisProvider from "./components/LenisProvider";

export const metadata: Metadata = {
  title: "Web Design Johannesburg | Kleinhans Digital | Websites That Work",
  description: "Kleinhans Digital builds custom websites for Johannesburg businesses. Mobile ready, SEO optimised, live in 14 days. From R6,500. No templates, no agencies.",
  keywords: "web design Johannesburg, website design South Africa, SEO Johannesburg, small business website",
  openGraph: {
    title: "Web Design Johannesburg | Kleinhans Digital",
    description: "Custom websites for South African businesses. Mobile ready, SEO optimised, live in 14 days.",
    url: "https://kleinhansdigital.co.za",
    siteName: "Kleinhans Digital",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="geo.region" content="ZA-GP" />
        <meta name="geo.placename" content="Johannesburg" />
      </head>
      <body>
        <LenisProvider />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
