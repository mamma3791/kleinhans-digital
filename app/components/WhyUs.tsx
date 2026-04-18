"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reasons = [
  { num: "01", title: "Your data never leaves your building", desc: "We run AI models locally on your infrastructure. No data is sent to OpenAI, Google, or any third party. Fully POPIA compliant by design, not by policy." },
  { num: "02", title: "Built for your workflow, not ours", desc: "We sit with your team, watch how they work, and build software that fits. No forcing your business into someone else's template." },
  { num: "03", title: "You deal with a person, not a platform", desc: "Direct access to the person building your system. Questions get answered. Changes get made. No ticket queue, no support tiers." },
  { num: "04", title: "Same AI, fraction of the cost", desc: "Enterprise platforms charge R50k+ for setup alone. We deliver the same capability at SME pricing because we build lean and deploy smart." },
];

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "5rem 0 4rem", background: "var(--dark)" }}>
      <style>{`
        .kd-why-card {
          border: 1px solid rgba(245,244,239,0.07);
          border-radius: 1rem;
          padding: 1.5rem 1.75rem;
          transition: background 0.3s ease, border-color 0.3s ease;
          margin-bottom: 0.75rem;
        }
        .kd-why-card:last-child { margin-bottom: 0; }
        .kd-why-card:hover {
          background: rgba(245,244,239,0.04);
          border-color: rgba(93,191,136,0.25);
        }
        .kd-why-card:hover .kd-why-num { color: rgba(93,191,136,0.55); }
        .kd-why-card:hover .kd-why-title { color: var(--green3); }
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
        .kd-why-cta:hover { background: var(--green2); transform: scale(1.02); }
        .kd-why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        @media (max-width: 1023px) {
          .kd-why-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>

      <div className="kd-container">
        <div className="kd-why-grid">

          {/* Left — no sticky, centered vertically */}
          <div>
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
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "var(--cream)",
                marginBottom: "1.5rem",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Why businesses choose us.
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
                color: "rgba(245,244,239,0.45)",
                marginBottom: "2.25rem",
              }}
            >
              Most AI vendors send your data to the cloud and call it secure. We run models on your premises. That is a fundamental difference, not a feature checkbox.
            </motion.p>

            <motion.a
              href="#contact"
              className="kd-why-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Book a consultation
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
                      fontSize: "1.875rem",
                      color: "rgba(93,191,136,0.35)",
                      flexShrink: 0,
                      lineHeight: 1,
                      marginTop: "0.125rem",
                      transition: "color 0.3s ease",
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
                        transition: "color 0.3s ease",
                      }}
                    >
                      {r.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "rgba(245,244,239,0.48)",
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
