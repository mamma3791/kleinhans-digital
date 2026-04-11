"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const tiers = [
  {
    name: "Starter",
    price: "R6,500",
    monthly: "R650/mo",
    tag: "Once off",
    desc: "Everything you need to get online and look professional from day one.",
    features: [
      "Up to 5 pages",
      "Mobile first design",
      "WhatsApp integration",
      "Contact form",
      "Google My Business setup",
      "SSL and hosting included",
      "Basic on-page SEO",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Growth",
    price: "R12,000",
    monthly: "R1,200/mo",
    tag: "Most popular",
    desc: "For businesses ready to generate leads and track their online performance.",
    features: [
      "Everything in Starter",
      "Social media integration",
      "Lead capture forms",
      "Google Analytics setup",
      "Looker Studio dashboard",
      "SEO reporting",
      "2 content revisions per month",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Pro",
    price: "R22,000",
    monthly: "R2,200/mo",
    tag: "Full service",
    desc: "A complete digital presence with paid ads, automation, and a full sales funnel.",
    features: [
      "Everything in Growth",
      "Full lead funnel build",
      "Google Ads management",
      "WhatsApp automation",
      "E-commerce integration",
      "Monthly strategy call",
      "Priority turnaround",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Custom",
    price: "Let's talk",
    monthly: "Consultative",
    tag: "Tailored",
    desc: "Not sure what you need, or need something outside the standard tiers? We will figure it out together.",
    features: [
      "Scaled-down or simplified builds",
      "WhatsApp chatbot setup",
      "Landing page only builds",
      "Multi-location or franchise sites",
      "Ongoing retainer support only",
      "Anything that doesn't fit a box",
    ],
    cta: "Chat on WhatsApp",
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
    <section id="pricing" ref={ref} style={{ padding: "7rem 0", background: "var(--cream2)" }}>
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
            Simple, honest pricing.
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
            Once-off build fee, then a low monthly retainer for hosting, maintenance, and updates. No surprises.
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
                  fontSize: tier.isCustom ? "1.75rem" : "2.25rem",
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
                href={tier.isCustom ? "https://wa.me/27662410344?text=Hi%20Kleinhans%20Digital%2C%20I%27d%20like%20to%20discuss%20a%20custom%20project." : "#contact"}
                target={tier.isCustom ? "_blank" : undefined}
                rel={tier.isCustom ? "noopener noreferrer" : undefined}
                className={`kd-price-cta ${tier.featured ? "dark" : tier.isCustom ? "wa" : "light"}`}
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
          All prices exclude VAT. 50% deposit required to begin. Monthly retainer starts from launch date.
        </motion.p>
      </div>
    </section>
  );
}
