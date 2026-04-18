"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "6rem 0", background: "var(--cream)" }}>
      <style>{`
        .kd-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .kd-cta-primary:hover {
          background: var(--green2);
          transform: scale(1.02);
          box-shadow: 0 12px 32px rgba(45,106,79,0.25);
        }
        .kd-cta-secondary {
          display: inline-flex;
          align-items: center;
          color: rgba(245,244,239,0.55);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: 9999px;
          border: 1px solid rgba(245,244,239,0.14);
          text-decoration: none;
          transition: border-color 0.25s ease, color 0.25s ease;
        }
        .kd-cta-secondary:hover {
          border-color: rgba(245,244,239,0.3);
          color: var(--cream);
        }
      `}</style>

      <div className="kd-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{
            position: "relative",
            background: "var(--dark)",
            borderRadius: "1.75rem",
            overflow: "hidden",
            padding: "5rem 2rem",
            textAlign: "center",
          }}
        >
          {/* Noise texture */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            opacity: 0.4, zIndex: 0,
          }} />

          {/* Glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,106,79,0.16) 0%, transparent 70%)",
          }} />

          <div style={{ position: "relative", zIndex: 10 }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--green3)",
                marginBottom: "1.5rem",
              }}
            >
              Ready to grow?
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "var(--cream)",
                marginBottom: "1.5rem",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Ready to automate<br />the busywork<em>?</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(245,244,239,0.38)",
                maxWidth: "28rem",
                margin: "0 auto 2.5rem",
              }}
            >
              Custom software and AI workflows for South African SMEs. Your data stays local, your team stays productive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}
            >
              <a href="#contact" className="kd-cta-primary">
                Book a Consultation
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#demo" className="kd-cta-secondary">
                Try the Demo
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
