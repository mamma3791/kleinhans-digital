import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import Workflow from "./components/Workflow";
import Demo from "./components/Demo";
import Process from "./components/Process";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WAButton from "./components/WAButton";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://kleinhansdigital.co.za/#business",
  "name": "Kleinhans Digital",
  "alternateName": "LRWKleinhans (Pty) Ltd",
  "description": "Custom software development and AI workflow automation for South African SMEs. Local AI deployment, complete data privacy, POPIA compliant.",
  "url": "https://kleinhansdigital.co.za",
  "telephone": "+27662410344",
  "email": "info@kleinhansdigital.co.za",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Johannesburg",
    "addressRegion": "Gauteng",
    "addressCountry": "ZA",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-26.2041",
    "longitude": "28.0473",
  },
  "areaServed": [
    { "@type": "Country", "name": "South Africa" },
    { "@type": "City", "name": "Johannesburg" },
  ],
  "priceRange": "R6,500 - R50,000+",
  "currenciesAccepted": "ZAR",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00",
    },
  ],
  "sameAs": [
    "https://www.instagram.com/kleinhans_digital",
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Development & AI Workflow Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Intelligent Website",
        "description": "Custom-coded website with built-in AI lead qualification, smart forms, WhatsApp integration, SEO, and analytics.",
        "price": "6500",
        "priceCurrency": "ZAR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "6500",
          "priceCurrency": "ZAR",
          "unitText": "once-off",
        },
      },
      {
        "@type": "Offer",
        "name": "AI Workflow Automation",
        "description": "Custom AI workflow for document extraction, process automation, or admin tasks. Local AI deployment, POPIA compliant.",
        "price": "8000",
        "priceCurrency": "ZAR",
      },
      {
        "@type": "Offer",
        "name": "Full System",
        "description": "End-to-end workflow automation with multiple AI processes, client portal, reporting, and on-premise AI deployment.",
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://kleinhansdigital.co.za/#website",
  "url": "https://kleinhansdigital.co.za",
  "name": "Kleinhans Digital",
  "description": "Custom software and AI workflow automation for South African SMEs. Local AI deployment, data privacy.",
  "publisher": {
    "@id": "https://kleinhansdigital.co.za/#business",
  },
  "inLanguage": "en-ZA",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <WhyUs />
        <Workflow />
        <Demo />
        <Process />
        <Pricing />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WAButton />
    </>
  );
}
