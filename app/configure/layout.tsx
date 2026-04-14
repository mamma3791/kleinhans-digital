import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Build and price your website project online. Choose a base package, add extras, and get an instant estimate. From R6,500 — no commitment required.",
  alternates: { canonical: "https://kleinhansdigital.co.za/configure" },
  openGraph: {
    title: "Get a Website Quote | Kleinhans Digital",
    description: "Build and price your website project online. From R6,500. No commitment required.",
    url: "https://kleinhansdigital.co.za/configure",
    type: "website",
  },
};

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
