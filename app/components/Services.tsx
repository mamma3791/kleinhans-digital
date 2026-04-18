"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    tag: "Core Service",
    title: "AI Workflow Automation",
    desc: "Replace repetitive manual work with AI that reads documents, processes data, and handles admin tasks. Your staff focuses on decisions, not data entry.",
    price: "From R8,000/mo",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tag: "Digital Presence",
    title: "Intelligent Websites",
    desc: "Not just a brochure. Websites with built-in AI: lead qualification, smart forms, automated follow-ups, and real-time analytics.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    tag: "Bespoke",
    title: "Custom Software",
    desc: "Dashboards, client portals, internal tools, and integrations built specifically for how your business operates. No off-the-shelf compromises.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    tag: "Intelligence",
    title: "Document Extraction",
    desc: "AI reads your waybills, invoices, quotes, and paperwork. Extracts every field, structures the data, and feeds it into your systems automatically.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    tag: "Privacy First",
    title: "Local AI",
    desc: "Your AI runs on your premises. No sensitive data leaves your organisation. Fully POPIA compliant, fully under your control.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} style={{ padding: "7rem 0", background: "var(--cream)" }}>
      <style>{`
        .kd-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 0.875rem;
        }
        .kd-services-hero {
          grid-column: 1;
          grid-row: 1 / 3;
        }
        .kd-services-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 0.875rem;
          border-radius: 1.25rem;
          overflow: hidden;
          border: 1px solid var(--border);
          gap: 1px;
          background: var(--border);
        }
        .kd-small-card {
          background: var(--cream2);
          border-radius: 1.375rem;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .kd-small-card:hover {
          background: rgba(45,106,79,0.04);
          border-color: rgba(45,106,79,0.28);
        }
        @media (max-width: 767px) {
          .kd-services-grid {
            grid-template-columns: 1fr;
          }
          .kd-services-hero {
            grid-column: 1;
            grid-row: auto;
          }
          .kd-services-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="kd-container">

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "var(--green)",
              marginBottom: "1.25rem",
            }}
          >
            What We Do
          </motion.p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--dark)",
                margin: 0,
              }}
            >
              Software that works<br />harder than people.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "0.975rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: "24rem",
                margin: 0,
              }}
            >
              We build AI-powered tools and custom software that automate the work your team does manually today. Less admin, more output, complete data privacy.
            </motion.p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="kd-services-grid">

          {/* Large hero card — Web Design, spans rows 1 and 2 */}
          <motion.div
            className="kd-services-hero"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              background: "var(--dark)",
              borderRadius: "1.375rem",
              padding: "2.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "400px",
            }}
          >
            <div>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.875rem",
                background: "rgba(61,122,94,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--green3)",
                marginBottom: "1.75rem",
              }}>
                {services[0].icon}
              </div>

              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--green3)",
                marginBottom: "0.625rem",
              }}>
                {services[0].tag}
              </p>

              <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.25rem",
                color: "var(--cream)",
                marginBottom: "1rem",
                lineHeight: 1.1,
              }}>
                {services[0].title}
              </h3>

              <p style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "0.875rem",
                lineHeight: 1.75,
                color: "rgba(245,244,239,0.52)",
              }}>
                {services[0].desc}
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginTop: "2rem",
              color: "var(--green3)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}>
              {services[0].price}
              <div style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "rgba(45,106,79,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* 4 small cards — auto-place into cols 2 and 3, rows 1 and 2 */}
          {services.slice(1).map((s, i) => (
            <motion.div
              key={s.title}
              className="kd-small-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 + i * 0.09 }}
            >
              <div style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.75rem",
                background: "rgba(45,106,79,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--green)",
                marginBottom: "1.25rem",
                flexShrink: 0,
              }}>
                {s.icon}
              </div>

              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--green)",
                marginBottom: "0.4rem",
              }}>
                {s.tag}
              </p>

              <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.375rem",
                color: "var(--dark)",
                marginBottom: "0.625rem",
                lineHeight: 1.15,
              }}>
                {s.title}
              </h3>

              <p style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "0.845rem",
                lineHeight: 1.65,
                color: "var(--muted)",
                margin: 0,
              }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          className="kd-services-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          {[
            { num: "80%", label: "Reduction in manual work" },
            { num: "100%", label: "Data stays on premises" },
            { num: "3x", label: "Output with same team" },
            { num: "0", label: "Sensitive data shared externally" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--cream)", padding: "1.375rem 1rem", textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.4rem, 2vw, 1.875rem)",
                color: "var(--green)",
                marginBottom: "0.25rem",
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.73rem",
                color: "var(--muted)",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
