import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import Portfolio from "./components/Portfolio";
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
  "description": "Custom websites for South African businesses. Mobile ready, SEO optimised, live in 14 days. From R6,500. No templates, no agencies.",
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
  "priceRange": "R6,500 - R22,000+",
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
    "name": "Web Design & Digital Marketing Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Starter Website Package",
        "description": "Up to 5 pages, mobile-first design, WhatsApp integration, contact form, Google My Business setup, SSL and hosting, basic on-page SEO.",
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
        "name": "Growth Website Package",
        "description": "Everything in Starter plus social media integration, lead capture forms, Google Analytics, Looker Studio dashboard, SEO reporting.",
        "price": "12000",
        "priceCurrency": "ZAR",
      },
      {
        "@type": "Offer",
        "name": "Pro Website Package",
        "description": "Full digital presence with lead funnel, Google Ads management, WhatsApp automation, e-commerce integration, monthly strategy call.",
        "price": "22000",
        "priceCurrency": "ZAR",
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
  "description": "Custom websites for South African businesses. Mobile ready, SEO optimised, live in 14 days.",
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
        <Portfolio />
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
