import { sanityClient, queries } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = null;
  try {
    post = await sanityClient.fetch(queries.postBySlug, { slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--cream)", borderBottom: "1px solid rgba(45,106,79,0.1)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--dark)" }}>
            Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
          </span>
        </Link>
        <Link href="/blog" style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          All posts
        </Link>
      </nav>

      {/* Article */}
      <article style={{ maxWidth: "44rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* Meta */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)", background: "rgba(58,138,98,0.08)", borderRadius: "9999px", padding: "0.25rem 0.75rem" }}>
              {categoryLabels[post.category] || post.category}
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
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
