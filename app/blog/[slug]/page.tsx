import { sanityClient, queries } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "../../components/Nav";

export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  "web-design": "Web Design",
  "seo": "SEO",
  "branding": "Branding",
  "ecommerce": "E-Commerce",
  "whatsapp": "WhatsApp",
  "google-my-business": "Google My Business",
  "digital-marketing": "Digital Marketing",
};

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--dark)", marginTop: "2.5rem", marginBottom: "1rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "var(--dark)", marginTop: "2rem", marginBottom: "0.75rem", lineHeight: 1.25 }}>{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1.0625rem", lineHeight: 1.85, color: "var(--dark)", marginBottom: "1.5rem" }}>{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote style={{ borderLeft: "3px solid var(--green)", paddingLeft: "1.5rem", marginLeft: 0, marginRight: 0, marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.7 }}>{children}</p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol style={{ paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--dark)", marginBottom: "0.5rem" }}>{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--dark)", marginBottom: "0.5rem" }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600, color: "var(--dark)" }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ color: "var(--green3)", fontStyle: "italic" }}>{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", textDecoration: "underline" }}>{children}</a>
    ),
  },
};

export async function generateStaticParams() {
  try {
    const posts: { slug: { current: string } }[] = await sanityClient.fetch(
      `*[_type == "post"] { slug }`
    );
    return posts.map((post) => ({ slug: post.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await sanityClient.fetch(queries.postBySlug, { slug });
  } catch {
    return {};
  }
  if (!post) return {};

  const category = categoryLabels[post.category] || post.category;
  const canonicalUrl = `https://kleinhansdigital.co.za/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Kleinhans Digital"],
      tags: [category, "Web Design", "South Africa"],
      siteName: "Kleinhans Digital",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = null;
  try {
    post = await sanityClient.fetch(queries.postBySlug, { slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  const canonicalUrl = `https://kleinhansdigital.co.za/blog/${slug}`;
  const category = categoryLabels[post.category] || post.category;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "url": canonicalUrl,
    "inLanguage": "en-ZA",
    "author": {
      "@type": "Organization",
      "name": "Kleinhans Digital",
      "url": "https://kleinhansdigital.co.za",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kleinhans Digital",
      "url": "https://kleinhansdigital.co.za",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kleinhansdigital.co.za/favicon.ico",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kleinhansdigital.co.za",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://kleinhansdigital.co.za/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonicalUrl,
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Nav />

      {/* Article */}
      <article style={{ maxWidth: "44rem", margin: "0 auto", padding: "7rem 1.5rem 6rem" }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <ol style={{ display: "flex", gap: "0.5rem", alignItems: "center", listStyle: "none", padding: 0, margin: 0, flexWrap: "wrap" }}>
            <li>
              <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            </li>
            <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }} aria-hidden="true">›</li>
            <li>
              <Link href="/blog" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
            </li>
            <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }} aria-hidden="true">›</li>
            <li>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green)" }}>{category}</span>
            </li>
          </ol>
        </nav>

        {/* Meta */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)", background: "rgba(58,138,98,0.08)", borderRadius: "9999px", padding: "0.25rem 0.75rem" }}>
              {category}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>
              {new Date(post.publishedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>
              {post.estimatedReadingTime || 5} min read
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
            {post.title}
          </h1>

          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1.1rem", lineHeight: 1.75, color: "var(--muted)", paddingBottom: "2rem", borderBottom: "1px solid rgba(45,106,79,0.12)" }}>
            {post.excerpt}
          </p>
        </div>

        {/* Body */}
        <div>
          <PortableText value={post.body} components={portableTextComponents} />
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: "3rem", marginBottom: "-1rem" }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All posts
          </Link>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "4rem", padding: "2.5rem", background: "var(--dark)", borderRadius: "1.375rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1rem" }}>
            Ready to get started?
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--cream)", marginBottom: "1rem", lineHeight: 1.2 }}>
            Let us build this for your business.
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.9rem", color: "rgba(245,244,239,0.5)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
            From R6,500 once-off. Live in 14 days. Johannesburg based.
          </p>
          <Link href="/configure" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", padding: "0.875rem 1.75rem", borderRadius: "9999px", textDecoration: "none" }}>
            Get a quote
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
