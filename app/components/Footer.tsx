"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--dark2)", borderTop: "1px solid rgba(245,244,239,0.07)" }}>
      <style>{`
        .kd-footer-link {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: rgba(245,244,239,0.35);
          text-decoration: none;
          transition: color 0.2s ease;
          display: block;
        }
        .kd-footer-link:hover { color: rgba(245,244,239,0.65); }
        .kd-footer-label {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(245,244,239,0.4);
          margin-bottom: 1.25rem;
        }
        .kd-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 3rem;
          padding: 4rem 0 3rem;
        }
        .kd-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(245,244,239,0.06);
          flex-wrap: wrap;
        }
        @media (max-width: 767px) {
          .kd-footer-grid { grid-template-columns: 1fr; gap: 2rem; padding: 3rem 0 2rem; }
          .kd-footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
        }
      `}</style>

      <div className="kd-container">
        <div className="kd-footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "1rem" }}>
              <div style={{
                width: "2.25rem", height: "2.25rem",
                borderRadius: "0.625rem",
                background: "var(--green)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", color: "var(--cream)", fontWeight: 600, fontSize: "0.9375rem" }}>
                Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
              </span>
            </Link>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "rgba(245,244,239,0.32)",
              maxWidth: "18rem",
            }}>
              Custom software and AI workflow automation for South African businesses. Your data stays local.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="kd-footer-label">Services</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "AI Workflow Automation", href: "#services" },
                { label: "Intelligent Websites", href: "#services" },
                { label: "Custom Software", href: "#services" },
                { label: "Document Extraction", href: "#services" },
                { label: "Local AI Deployment", href: "#services" },
                { label: "Process Automation", href: "#services" },
              ].map((s) => (
                <a key={s.label} href={s.href} className="kd-footer-link">{s.label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="kd-footer-label">Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a href="mailto:info@kleinhansdigital.co.za" className="kd-footer-link">
                info@kleinhansdigital.co.za
              </a>
              <a href="https://wa.me/27726340848" className="kd-footer-link">
                072 634 0848
              </a>
              <a href="https://www.instagram.com/kleinhans_digital" target="_blank" rel="noopener noreferrer" className="kd-footer-link">
                @kleinhans_digital
              </a>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.32)" }}>
                Johannesburg, Gauteng
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="kd-footer-bottom">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.2)" }}>
            &copy; {new Date().getFullYear()} LRWKleinhans (Pty) Ltd. Trading as Kleinhans Digital.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy-policy" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.2)", textDecoration: "none", transition: "color 0.2s ease" }}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.2)", textDecoration: "none", transition: "color 0.2s ease" }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
