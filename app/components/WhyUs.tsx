"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reasons = [
  { num: "01", title: "Built from scratch, every time", desc: "No page builders, no templates, no shortcuts. Your site is written in clean code built specifically for your business." },
  { num: "02", title: "You deal with a person, not a call centre", desc: "Direct access to the person who builds your site. Questions get answered. Changes get made. No ticket system." },
  { num: "03", title: "Fast delivery without cutting corners", desc: "Most projects go from brief to live in under 14 days. Speed comes from experience and process, not from rushing." },
  { num: "04", title: "SEO baked in from day one", desc: "Search visibility is not an afterthought. Schema markup, meta structure, Google My Business, and local SEO are built into every site." },
];

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "7rem 0", background: "var(--dark)" }}>
      <style>{`
        .kd-why-card {
          border: 1px solid rgba(245,244,239,0.06);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: background 0.35s ease, border-color 0.35s ease;
          margin-bottom: 0.625rem;
        }
        .kd-why-card:hover {
          background: rgba(245,244,239,0.03);
          border-color: rgba(45,106,79,0.22);
        }
        .kd-why-card:hover .kd-why-num {
          color: rgba(45,106,79,0.45);
        }
        .kd-why-card:hover .kd-why-title {
          color: var(--green3);
        }
        .kd-why-left {
          position: sticky;
          top: 8rem;
        }
        .kd-why-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.875rem 1.75rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .kd-why-cta:hover {
          background: var(--green2);
          transform: scale(1.02);
        }
        @media (max-width: 1023px) {
          .kd-why-left { position: static; }
          .kd-why-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>

      <div className="kd-container">
        <div
          className="kd-why-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
          }}
        >
          {/* Left sticky */}
          <div className="kd-why-left">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--green3)",
                marginBottom: "1.25rem",
              }}
            >
              Why Kleinhans Digital
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
                color: "var(--cream)",
                marginBottom: "1.75rem",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              The difference is in the details.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "rgba(245,244,239,0.38)",
                marginBottom: "2.5rem",
                maxWidth: "28rem",
              }}
            >
              Most web design businesses use templates and call it custom. We do not. That difference shows in how the site looks, how fast it loads, and how many enquiries it generates.
            </motion.p>

            <motion.a
              href="#contact"
              className="kd-why-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Start a conversation
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>

          {/* Right cards */}
          <div>
            {reasons.map((r, i) => (
              <motion.div
                key={r.num}
                className="kd-why-card"
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                  <span
                    className="kd-why-num"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "2rem",
                      color: "rgba(45,106,79,0.18)",
                      flexShrink: 0,
                      lineHeight: 1,
                      marginTop: "0.125rem",
                      transition: "color 0.35s ease",
                    }}
                  >
                    {r.num}
                  </span>
                  <div>
                    <h3
                      className="kd-why-title"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.125rem",
                        color: "var(--cream)",
                        marginBottom: "0.5rem",
                        transition: "color 0.35s ease",
                      }}
                    >
                      {r.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "rgba(245,244,239,0.38)",
                      margin: 0,
                    }}>
                      {r.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
