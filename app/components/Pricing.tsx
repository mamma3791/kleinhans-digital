"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const tiers = [
  {
    name: "Intelligent Website",
    price: "From R6,500",
    monthly: "R650/mo hosting",
    tag: "Digital presence",
    desc: "More than a brochure. A website that qualifies leads, automates follow-ups, and reports on performance. Built from scratch, not a template.",
    features: [
      "Custom-coded, mobile-first website",
      "AI-powered lead qualification forms",
      "Automated email follow-ups on enquiries",
      "WhatsApp click-to-chat with pre-filled messages",
      "Real-time analytics dashboard",
      "SEO optimised with schema markup",
      "Client portal with login (proposals, invoices, messaging)",
      "SSL, hosting, backups, and maintenance",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "AI Workflow",
    price: "From R8,000",
    monthly: "Per month",
    tag: "Save 80% on admin",
    desc: "We take one of your manual, repetitive business processes and automate it with AI. The model runs locally. Your data never leaves your building.",
    features: [
      "Full workflow audit with your team",
      "Custom AI pipeline (document extraction, data processing, or admin automation)",
      "Integrates with your existing tools (email, WhatsApp, Sage, Xero, Excel)",
      "Local AI model deployed on your premises",
      "Review dashboard for human oversight",
      "Staff training and onboarding included",
      "POPIA compliant by design",
      "Monthly optimisation, monitoring, and support",
    ],
    cta: "Book a consultation",
    featured: true,
  },
  {
    name: "Full Platform",
    price: "From R18,000",
    monthly: "Per month",
    tag: "End to end",
    desc: "Multiple AI workflows, a custom portal for your clients or staff, automated reporting, and a website that drives it all. Your entire operation, streamlined.",
    features: [
      "Everything in AI Workflow",
      "Multiple automated processes",
      "Custom client or staff portal",
      "Automated invoicing and payment tracking",
      "Real-time reporting and anomaly alerts",
      "On-premise AI deployment with SLA",
      "Dedicated account manager",
      "Monthly strategy sessions for expansion",
    ],
    cta: "Book a consultation",
    featured: false,
  },
  {
    name: "Custom Build",
    price: "Let's scope it",
    monthly: "Project based",
    tag: "Bespoke",
    desc: "Internal tools, system integrations, chatbots, or a full product MVP. If you can describe it, we can build it.",
    features: [
      "Custom software development from scratch",
      "API integrations and data pipelines",
      "WhatsApp, Telegram, or web chatbots",
      "Legacy system modernisation",
      "Product MVP for startups",
      "E-commerce with AI-powered recommendations",
      "Ongoing retainer and support available",
    ],
    cta: "Start a conversation",
    featured: false,
    isCustom: true,
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ flexShrink: 0, marginTop: "1px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} style={{ padding: "3rem 0 7rem", background: "var(--cream2)" }}>
      <style>{`
        .kd-price-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          align-items: start;
        }
        .kd-price-card {
          background: var(--cream);
          border: 1px solid rgba(45,106,79,0.12);
          border-radius: 1.375rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .kd-price-card:hover {
          box-shadow: 0 8px 32px rgba(26,36,32,0.1);
          transform: translateY(-3px);
        }
        .kd-price-card.featured {
          background: var(--dark);
          border-color: var(--green);
          border-width: 1.5px;
        }
        .kd-price-card.featured:hover {
          box-shadow: 0 12px 40px rgba(58,138,98,0.2);
        }
        .kd-price-feature {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          font-family: var(--font-sans);
          font-size: 0.825rem;
          font-weight: 300;
          line-height: 1.5;
          margin-bottom: 0.625rem;
        }
        .kd-price-cta {
          display: block;
          text-align: center;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.875rem 1rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease;
          margin-top: auto;
        }
        .kd-price-cta.light {
          background: var(--green);
          color: var(--cream);
        }
        .kd-price-cta.light:hover { background: var(--green2); transform: scale(1.02); }
        .kd-price-cta.dark {
          background: var(--green3);
          color: var(--dark);
        }
        .kd-price-cta.dark:hover { background: #4db07a; transform: scale(1.02); }
        .kd-price-cta.outline {
          background: transparent;
          color: var(--green);
          border: 1.5px solid rgba(58,138,98,0.3);
        }
        .kd-price-cta.outline:hover {
          background: rgba(58,138,98,0.06);
          border-color: var(--green);
          transform: scale(1.02);
        }
        .kd-price-cta.wa {
          background: #25D366;
          color: white;
        }
        .kd-price-cta.wa:hover { background: #20bd5a; transform: scale(1.02); }
        @media (max-width: 1199px) {
          .kd-price-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .kd-price-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="kd-container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "var(--green)",
              marginBottom: "1rem",
            }}
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              color: "var(--dark)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            Clear, honest pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            Websites are a once-off build plus monthly hosting. AI workflows are priced monthly based on scope. No hidden fees, no lock-in contracts.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="kd-price-grid">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`kd-price-card${tier.featured ? " featured" : ""}`}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
            >
              {/* Tag */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: tier.featured ? "var(--green3)" : tier.isCustom ? "var(--muted)" : "var(--green)",
                  display: "block",
                  marginBottom: "0.625rem",
                }}>
                  {tier.tag}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  color: tier.featured ? "var(--cream)" : "var(--dark)",
                  marginBottom: "0.375rem",
                }}>
                  {tier.name}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  fontSize: "0.825rem",
                  lineHeight: 1.6,
                  color: tier.featured ? "rgba(245,244,239,0.5)" : "var(--muted)",
                }}>
                  {tier.desc}
                </p>
              </div>

              {/* Price */}
              <div style={{
                padding: "1.25rem 0",
                borderTop: `1px solid ${tier.featured ? "rgba(245,244,239,0.08)" : "rgba(45,106,79,0.1)"}`,
                borderBottom: `1px solid ${tier.featured ? "rgba(245,244,239,0.08)" : "rgba(45,106,79,0.1)"}`,
                marginBottom: "1.5rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.25rem",
                  color: tier.featured ? "var(--cream)" : "var(--dark)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}>
                  {tier.price}
                </div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  color: tier.featured ? "rgba(245,244,239,0.4)" : "var(--muted)",
                }}>
                  {tier.monthly}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: "2rem", flex: 1 }}>
                {tier.features.map((f) => (
                  <div key={f} className="kd-price-feature" style={{ color: tier.featured ? "rgba(245,244,239,0.65)" : "var(--muted)" }}>
                    <span style={{ color: tier.featured ? "var(--green3)" : "var(--green)", marginTop: "1px" }}>
                      <CheckIcon />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={`/configure?tier=${tier.name.toLowerCase()}`}
                className={`kd-price-cta ${tier.featured ? "dark" : "light"}`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          All prices exclude VAT. 20% deposit required to begin. Pricing scales with your needs, not our margins.
        </motion.p>
      </div>
    </section>
  );
}
