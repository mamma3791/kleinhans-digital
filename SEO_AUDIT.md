# SEO Audit — Kleinhans Digital
**Audit date:** 14 April 2026  
**Auditor:** Claude Code (automated full-codebase audit)  
**Status:** All actionable code changes implemented in this commit.

---

## Executive Summary

The site had solid bones — good content, a clear service offering, local SEO signals (geo meta tags, Johannesburg-specific copy), and a fast tech stack (Next.js 16 / React 19). However, several significant structural SEO gaps were present that would have meaningfully suppressed search visibility. All addressable code issues have been fixed. One outstanding item requires a design asset (OG image).

**Severity scoring:** 🔴 Critical · 🟡 Medium · 🟢 Low / informational

---

## Issues Found and Fixed

### 🔴 1. Homepage missing H1 — FIXED

**File:** `app/components/Hero.tsx`

The entire hero headline ("Your business deserves a website that actually works.") was rendered inside `<motion.div>` elements with no semantic heading element. Google uses the H1 as a primary ranking signal. A page with no H1 tells crawlers there is no clear topic.

**Fix:** Wrapped the headline in `<h1>` and changed the inner animated elements from `<motion.div>` / `<div>` to `<motion.span>` / `<span>` with `display: block` to preserve the line-by-line animation. No visual change.

---

### 🔴 2. No JSON-LD structured data anywhere — FIXED

**Files:** `app/page.tsx`, `app/blog/[slug]/page.tsx`

The site had zero structured data. This suppresses rich results (star ratings, business panels, article cards) in Google Search.

**Fixes:**
- Added `LocalBusiness` + `ProfessionalService` schema to homepage with full address, geo coordinates, phone, email, price range, opening hours, offer catalog (all three pricing tiers), and `sameAs` social link.
- Added `WebSite` schema to homepage.
- Added `BlogPosting` Article schema to each blog post page (dynamically populated from Sanity: headline, description, datePublished, author, publisher, canonical URL).
- Added `BreadcrumbList` schema to each blog post page.

---

### 🔴 3. Blog post pages had no metadata — FIXED

**File:** `app/blog/[slug]/page.tsx`

Blog posts had no `<title>`, no `<meta description>`, and no Open Graph tags. Every blog post was effectively invisible to social share previews and would compete poorly in search.

**Fix:** Added `generateMetadata()` that fetches post data from Sanity and populates:
- Dynamic `title` (becomes "Post Title | Kleinhans Digital" via layout template)
- Dynamic `description` from the post excerpt
- Canonical URL
- Open Graph: title, description, URL, `type: "article"`, `publishedTime`, `authors`, `tags`
- Twitter card: `summary_large_image`

---

### 🔴 4. Blog post pages had no static params generation — FIXED

**File:** `app/blog/[slug]/page.tsx`

No `generateStaticParams()` meant all blog posts were server-rendered on first request, creating cold-start latency and preventing Next.js from pre-rendering known posts at build time.

**Fix:** Added `generateStaticParams()` that fetches all post slugs from Sanity and returns them for pre-rendering.

---

### 🟡 5. Root layout metadata missing title template, Twitter cards, and metadataBase — FIXED

**File:** `app/layout.tsx`

**Problems:**
- No `metadataBase` — relative URLs in `og:image` etc. would not resolve correctly
- No title template — blog posts could not inherit "Post Title | Kleinhans Digital" format
- No Twitter card metadata
- No `robots` metadata
- No `authors`, `creator`, `publisher` fields

**Fix:** Rewrote the metadata export with:
- `metadataBase: new URL("https://kleinhansdigital.co.za")`
- `title: { template: "%s | Kleinhans Digital", default: "..." }`
- `twitter: { card: "summary_large_image", ... }`
- `robots: { googleBot: { "max-image-preview": "large", ... } }`
- `authors`, `creator`, `publisher`

---

### 🟡 6. Blog list page had no metadata — FIXED

**File:** `app/blog/page.tsx`

The blog index page had no title, description, or Open Graph tags. Also, the post cards used `<h2>` for post titles which is correct, but the page header "Insights for SA business owners." was in a raw `<h1>` style div, not an actual `<h1>`.

**Fix:**
- Added `export const metadata: Metadata` with title, description, canonical, Open Graph and Twitter fields.
- Fixed page `<h1>` to use the semantic heading element.

---

### 🟡 7. Privacy Policy and Terms of Service pages did not exist — FIXED

**Files created:** `app/privacy-policy/page.tsx`, `app/terms-of-service/page.tsx`

The login page and footer both referenced these pages but they returned 404. Links to 404 pages are a soft 404 signal that Google notes. Additionally, operating without accessible privacy policy pages is a POPIA compliance risk.

**Fix:** Created both pages with:
- Full POPIA-compliant Privacy Policy (10 sections)
- Full Terms of Service (13 sections) covering payment, IP, cancellation, governing law
- Design matching the existing site (cream background, DM Serif Display headings, Outfit body, green accents)
- Proper `<h1>` → `<h2>` → `<h3>` heading hierarchy
- `metadata` exports with title, description, canonical, and `robots: { follow: false }`
- Cross-links between the two pages

---

### 🟡 8. Footer Privacy Policy and Terms links were `<span>` elements — FIXED

**File:** `app/components/Footer.tsx`

The footer links were rendering as `<span>` elements with `cursor: pointer` styling — not actual links. These are not crawlable by search engines.

**Fix:** Replaced with `<Link href="/privacy-policy">` and `<Link href="/terms-of-service">`.

---

### 🟡 9. Login/dashboard/onboarding pages had no metadata or noindex — FIXED

**Files created:** `app/login/layout.tsx`, `app/dashboard/layout.tsx`, `app/onboarding/layout.tsx`

These pages should not be indexed. Dashboard and onboarding redirect unauthenticated users anyway, but without explicit `noindex` metadata, crawlers may waste crawl budget on them.

**Fix:** Created segment layouts for each with:
- Descriptive titles (for authenticated users who see browser tabs)
- `robots: { index: false, follow: false }`

---

### 🟡 10. Configure page had no metadata — FIXED

**File created:** `app/configure/layout.tsx`

The configure page is a high-intent conversion page (`/configure?tier=starter`) but had no title, description, or Open Graph tags because the page component uses `"use client"` and cannot export metadata directly.

**Fix:** Created a server-side segment layout that exports:
- Title: "Get a Quote"
- Description with pricing and offer details
- Canonical URL
- Open Graph tags

---

### 🟡 11. robots.ts not disallowing API and auth routes — FIXED

**File:** `app/robots.ts`

`/auth/` (OAuth callback) and `/api/` (internal webhook routes) were crawlable. While Google generally ignores these, explicit disallow rules prevent crawl budget waste and avoid callback URLs appearing in search indexes.

**Fix:** Added `/auth/` and `/api/` to the disallow list.

---

### 🟡 12. Sitemap missing legal pages — FIXED

**File:** `app/sitemap.ts`

The privacy policy and terms of service pages were not in the sitemap (they didn't exist before, but added now).

**Fix:** Added `/privacy-policy` and `/terms-of-service` to the static routes with `priority: 0.2` and `changeFrequency: "yearly"`.

---

### 🟢 13. Breadcrumb navigation missing from blog posts — FIXED

**File:** `app/blog/[slug]/page.tsx`

Blog posts had no breadcrumb trail (Home › Blog › Category), making it harder for users and crawlers to understand site structure.

**Fix:** Added a visible `<nav aria-label="Breadcrumb">` with `<ol>` breadcrumb list above the article, plus the corresponding `BreadcrumbList` JSON-LD schema.

---

### 🟢 14. SVG logo icons missing accessible labels — FIXED

**Files:** `app/blog/[slug]/page.tsx`, `app/blog/page.tsx`, `app/privacy-policy/page.tsx`, `app/terms-of-service/page.tsx`

Inline SVG icons inside navigation `<Link>` components had no `aria-label` or `aria-hidden` attributes. Added `aria-hidden="true"` to decorative SVGs and `aria-label` to the nav links themselves on new pages.

---

## Outstanding Items (Require Manual Action)

### ⚠️ OG Image / Social Share Image

**Priority: High**

There is no social share image (`og:image` / `twitter:image`) configured. When the site is shared on WhatsApp, LinkedIn, X (Twitter), or Facebook, no preview image appears — just text. This significantly reduces click-through rates from social shares.

**Action required:**
1. Create a 1200×630px image (`public/og-image.jpg`) matching the brand (dark green background, white Kleinhans Digital wordmark, tagline)
2. Add to `app/layout.tsx` metadata:
   ```tsx
   openGraph: {
     images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Kleinhans Digital" }],
   },
   twitter: {
     images: ["/og-image.jpg"],
   },
   ```
3. Optionally use Next.js `app/opengraph-image.tsx` to auto-generate it using `@vercel/og`

---

### ⚠️ Google Search Console Verification

**Priority: High**

Search Console should be set up to:
- Confirm the sitemap is being read
- Monitor indexing status for all pages
- Track click-through rates and search queries
- Identify any crawl errors

**Action required:** Add the Google Search Console verification meta tag to `app/layout.tsx` under `verification`:
```tsx
verification: {
  google: "your-verification-code-here",
},
```

---

### ⚠️ Blog Not Populated

**Priority: Medium — SEO opportunity**

The blog exists in the codebase (Sanity CMS connected) but has no posts. The footer links to blog posts for specific service keywords (e.g., `/blog/web-design-johannesburg`, `/blog/seo-optimisation-south-africa`) but these pages do not exist.

Each blog post targeting a specific Johannesburg service keyword is a significant ranking opportunity. Recommended content plan:
- "Web Design in Johannesburg: What Does It Actually Cost?" → `/blog/web-design-johannesburg`
- "How to Set Up Google My Business for a South African Business" → `/blog/google-my-business-setup`
- "Why Local SEO Matters for Johannesburg Small Businesses" → `/blog/seo-optimisation-south-africa`
- "What to Look for in a Web Designer in South Africa" → `/blog/branding-identity-small-business`

---

### ⚠️ Portfolio Images via Third-Party API

**Priority: Low — monitor**

The Portfolio section loads screenshots via `https://api.microlink.io/`. This means:
- Portfolio images are not cached at the edge by default
- If Microlink is slow or down, the portfolio shows broken images
- Google cannot index these as properly owned images

**Recommendation:** For production, capture and host static screenshots in `public/portfolio/` and use Next.js `<Image>` component with `width`, `height`, and meaningful `alt` text for each project. This also improves Core Web Vitals (LCP).

---

### ⚠️ No `og:image` for Blog Posts

**Priority: Medium**

Until blog posts have featured images in Sanity (a `mainImage` field), blog post Open Graph tags will have no image. Add a `mainImage` field to the Sanity post schema and surface it in `generateMetadata`.

---

## Performance Notes (No Code Changes Required)

| Item | Status | Note |
|------|--------|------|
| Font loading | ✅ Good | `display=swap` in Google Fonts URL |
| Smooth scroll | ✅ Good | Lenis via `LenisProvider`, no duplicate library |
| `useInView` once | ✅ Good | All Framer Motion animations use `{ once: true }` |
| Tailwind v4 | ✅ Good | Minimal CSS output |
| ISR on blog | ✅ Good | `revalidate = 60` on blog pages |
| Hero particle canvas | 🟡 Monitor | O(n²) connection loop — acceptable at current particle count but watch on low-end mobile |
| Image domains | ✅ Good | `cdn.sanity.io` added to `next.config.ts` |
| Security headers | ✅ Good | X-Frame-Options, X-Content-Type-Options etc. added to `next.config.ts` |

---

## Heading Hierarchy Summary

| Page | H1 | H2 | H3 | Status |
|------|----|----|----|--------|
| Homepage | ✅ (Hero — fixed) | ✅ (Services, WhyUs, Portfolio, Process, Pricing, CTA) | ✅ (cards) | Good |
| Blog list | ✅ | ✅ (post titles) | — | Good |
| Blog post | ✅ (post title) | ✅ (body sections) | ✅ (sub-sections) | Good |
| Configure | — | ✅ (steps) | — | Acceptable (no H1 needed for this flow) |
| Privacy Policy | ✅ | ✅ (sections) | ✅ (sub-sections) | Good |
| Terms of Service | ✅ | ✅ (sections) | ✅ (sub-sections) | Good |

---

## Internal Linking Summary

| From | To | Status |
|------|----|--------|
| Homepage → Blog | ✅ (Nav) | Good |
| Homepage → Configure | ✅ (Nav CTA, Hero, CTA section, Pricing) | Good |
| Blog post → Configure | ✅ (in-article CTA) | Good |
| Blog post → Blog list | ✅ (breadcrumb + back link — added) | Good |
| Footer → Legal pages | ✅ (fixed) | Good |
| Legal pages → each other | ✅ (added cross-links) | Good |
| Blog list → Homepage | ✅ ("Back to site" nav) | Good |

---

## Canonical URL Coverage

| Page | Canonical | Status |
|------|-----------|--------|
| Homepage | `https://kleinhansdigital.co.za` (via layout) | ✅ |
| Blog list | `https://kleinhansdigital.co.za/blog` | ✅ |
| Blog post | Dynamic per slug | ✅ |
| Configure | `https://kleinhansdigital.co.za/configure` | ✅ |
| Privacy Policy | `https://kleinhansdigital.co.za/privacy-policy` | ✅ |
| Terms of Service | `https://kleinhansdigital.co.za/terms-of-service` | ✅ |
| Login / Dashboard / Onboarding | noindex (no canonical needed) | ✅ |

---

## Structured Data Coverage

| Schema Type | Page | Status |
|-------------|------|--------|
| `LocalBusiness` + `ProfessionalService` | Homepage | ✅ Added |
| `WebSite` | Homepage | ✅ Added |
| `BlogPosting` (Article) | Blog posts | ✅ Added dynamically |
| `BreadcrumbList` | Blog posts | ✅ Added |
| `FAQPage` | — | Consider adding to pricing/services section |
| `Service` | — | Consider adding per-service schema |

---

*This audit was generated automatically from a full static analysis of the kleinhans-digital codebase on 14 April 2026.*
