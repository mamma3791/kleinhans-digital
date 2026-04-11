import { NextResponse } from "next/server";

const content = `# About Kleinhans Digital

## Who We Are
Kleinhans Digital is a boutique web design studio based in Johannesburg, Gauteng, South Africa. Registered as LRWKleinhans (Pty) Ltd, trading as Kleinhans Digital.

Founded and run by Jason Kleinhans, we build custom websites for South African SMEs — businesses that need a professional online presence but don't have an in-house digital team.

## What Makes Us Different

**No templates. Ever.**
Every site is written from scratch in clean code. No WordPress, no page builders, no themes. Your site is built specifically for your business.

**You deal with a person, not a call centre.**
Direct access to the person who builds your site. Questions get answered. Changes get made. No ticket systems, no account managers.

**Fast delivery without cutting corners.**
Most projects go from brief to live in under 14 days. Speed comes from experience and process, not from rushing.

**SEO baked in from day one.**
Schema markup, meta structure, Google My Business, and local SEO are built into every site — not sold as an expensive extra.

## Our Process

1. **Discovery** — We learn about your business, customers, and goals. A clear brief means a better outcome.
2. **Design** — A custom design built around your brand. You review, give feedback, and we refine until it is right.
3. **Development** — Clean, fast code. Mobile ready. Built for search. Every integration tested before launch.
4. **Launch** — We handle domain, hosting, and going live. Delivered on a global network.
5. **Support** — Available for updates, changes, and growing your presence after launch.

## Location
- **Office**: Johannesburg, Gauteng, South Africa
- **Service area**: All of South Africa (remote)
- **International**: UK and Australia (coming 2027)

## Contact
- Email: info@kleinhansdigital.co.za
- WhatsApp: +27 66 241 0344
- Website: https://kleinhansdigital.co.za
- Instagram: @kleinhans_digital
- Google My Business: Kleinhans Digital, Johannesburg

## Credentials
- Registered: LRWKleinhans (Pty) Ltd
- POPIA compliant
- Google My Business verified
- 6+ sites launched across Gauteng and Eastern Cape
`;

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
