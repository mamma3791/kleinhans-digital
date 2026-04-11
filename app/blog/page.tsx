import { sanityClient, queries } from "@/sanity/client";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  category: string;
  estimatedReadingTime: number;
}

const categoryLabels: Record<string, string> = {
  "web-design": "Web Design",
  "seo": "SEO",
  "branding": "Branding",
  "ecommerce": "E-Commerce",
  "whatsapp": "WhatsApp",
  "google-my-business": "Google My Business",
  "digital-marketing": "Digital Marketing",
};

export const revalidate = 60;

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await sanityClient.fetch(queries.allPosts);
  } catch {
    posts = [];
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{`
        .kd-blog-card {
          background: var(--cream);
          border: 1px solid rgba(45,106,79,0.12);
          border-radius: 1.125rem;
          padding: 2rem;
          text-decoration: none;
          display: block;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .kd-blog-card:hover {
          border-color: var(--green);
          box-shadow: 0 8px 32px rgba(26,36,32,0.08);
          transform: translateY(-2px);
        }
        .kd-blog-tag {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--green);
          background: rgba(58,138,98,0.08);
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0.875rem;
        }
        @media (max-width: 767px) {
          .kd-blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

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
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          Back to site
        </Link>
      </nav>

      <div className="kd-container" style={{ padding: "5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ maxWidth: "40rem", marginBottom: "4rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "1rem" }}>
            Resources
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "var(--dark)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}>
            Insights for SA business owners.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)" }}>
            Practical guides on web design, SEO, and digital marketing for South African businesses.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Posts coming soon.</p>
            <p style={{ fontSize: "0.875rem" }}>Check back shortly.</p>
          </div>
        ) : (
          <div className="kd-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="kd-blog-card">
                <span className="kd-blog-tag">{categoryLabels[post.category] || post.category}</span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--dark)", lineHeight: 1.3, marginBottom: "0.75rem" }}>
                  {post.title}
                </h2>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.875rem", lineHeight: 1.65, color: "var(--muted)", marginBottom: "1.5rem" }}>
                  {post.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>
                    {new Date(post.publishedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green)" }}>
                    {post.estimatedReadingTime || 5} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
