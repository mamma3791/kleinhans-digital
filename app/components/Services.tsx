"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tag: "Core Service",
    title: "Web Design",
    desc: "Custom-coded, mobile-first websites. No templates, no page builders. Every site is built specifically for your business from scratch.",
    price: "From R6,500",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    tag: "Visibility",
    title: "SEO",
    desc: "Built-in from day one. Google My Business setup, schema markup, keyword structure, and local search optimisation.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    tag: "Identity",
    title: "Branding",
    desc: "Logo, colour system, typography, and brand guidelines that make your business instantly recognisable.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    tag: "Revenue",
    title: "E-Commerce",
    desc: "Online stores with product catalogues, WhatsApp checkout integration, and payment processing for the South African market.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    tag: "Automation",
    title: "WhatsApp",
    desc: "Click-to-chat buttons, pre-filled messages, and chatbot flows that turn enquiries into customers while you sleep.",
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
              Services that grow<br />your business.
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
              Every engagement starts with understanding your business, your customers, and what growth actually looks like for you.
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
            { num: "14", label: "Days average delivery" },
            { num: "100%", label: "Custom built every time" },
            { num: "R650", label: "Monthly retainer from" },
            { num: "6+", label: "Sites launched" },
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
