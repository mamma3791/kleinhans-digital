import { NextResponse } from "next/server";

const content = `# Kleinhans Digital — Services

## Web Design
Custom-coded, mobile-first websites built from scratch for South African businesses. No templates, no page builders. Every site written specifically for your business.

**Included in all packages:**
- Mobile-first responsive design
- WhatsApp integration and click-to-chat
- Contact form with email notifications
- SSL certificate and hosting
- Google My Business setup
- Basic on-page SEO

**Starting from R6,500 once-off + R650/month**

---

## SEO (Search Engine Optimisation)
Built into every site from day one. Not an afterthought.

- Schema markup for local business
- Keyword structure and meta tags
- Google My Business setup and optimisation
- Local search optimisation for Johannesburg and Gauteng
- Monthly SEO reporting (Growth and Pro tiers)

---

## Branding and Identity
Logo, colour system, typography, and brand guidelines that make your business instantly recognisable.

- Logo design
- Colour palette and typography selection
- Brand guidelines document
- Application across website and digital assets

**Pricing: Consultative (varies by scope)**

---

## E-Commerce
Online stores built for the South African market.

- Product catalogue with categories and filtering
- WhatsApp checkout integration
- PayFast or Peach Payments integration
- Mobile-optimised shopping experience
- Inventory management

**From R5,000 add-on to base package**

---

## WhatsApp Integration
Turn website visitors into WhatsApp conversations.

- Click-to-chat buttons with pre-filled messages
- WhatsApp chatbot setup and automation
- Lead qualification flows
- Response automation

**Basic integration: Included in all packages**
**Chatbot setup: Consultative pricing**

---

## Lead Funnels
Landing pages designed to capture enquiries and convert visitors.

- Dedicated landing page
- Lead capture forms
- Email notification on submission
- Integration with CRM or WhatsApp

**R3,000 add-on**

---

## Google My Business
Get found on Google Maps and local search.

- GMB profile setup and optimisation
- Business category selection
- Photo optimisation
- Review management guidance

**Included in all packages**

---

## Monthly SEO Reporting
Know exactly how your site is performing.

- Google Analytics setup
- Looker Studio dashboard
- Monthly traffic and ranking report
- Recommendations for improvement

**R800/month add-on (included in Growth and Pro)**

---

## Pricing Summary

| Package | Once-off | Monthly |
|---------|----------|---------|
| Starter | R6,500 | R650 |
| Growth | R12,000 | R1,200 |
| Pro | R22,000 | R2,200 |
| Custom | Consultative | Consultative |

All prices exclude VAT. 50% deposit to begin.

---

**Contact:** info@kleinhansdigital.co.za | WhatsApp: +27 66 241 0344
**Website:** https://kleinhansdigital.co.za
`;

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
