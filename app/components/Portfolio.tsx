"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  { tag: "Fashion · Web Design", title: "Shevans Luxury Streetwear", desc: "Premium streetwear brand site with immersive product showcase and mobile optimised shopping experience.", url: "https://shevans.kleinhansdigital.co.za", bg: "#0a0a0a", accent: "#00d4ff" },
  { tag: "Corporate · Web Design", title: "LRW Group", desc: "Clean corporate holding company site with services showcase, professional tone, and strong brand presence.", url: "https://lrwgroup.kleinhansdigital.co.za", bg: "#111010", accent: "#c9a84c" },
  { tag: "E-Commerce · Branding", title: "Drip King", desc: "Fully featured online store with product catalogue, shopping cart, and brand identity built for the right market.", url: "https://dripking.kleinhansdigital.co.za", bg: "#0d0d0d", accent: "#e85d04" },
  { tag: "Retail · Web Design + SEO", title: "Bok Ballas Vapes", desc: "Striking retail site with product showcase, location finder, and local SEO to drive walk-in traffic.", url: "https://bokballas.kleinhansdigital.co.za", bg: "#0a1a0f", accent: "#4caf50" },
  { tag: "Hospitality · Web Design", title: "De Kleine Kaap Guest House", desc: "Cape Dutch guest house with WhatsApp booking integration, lightbox gallery, and mobile first design for Lady Grey.", url: "https://de-kleine-kaap.kleinhansdigital.co.za", bg: "#1a1209", accent: "#d4a853" },
  { tag: "Pet Services · Web Design", title: "Jess's Pet Sitting", desc: "A warm, professional website for a pet sitting service built to reassure pet owners and make booking effortless.", url: "https://jess.kleinhansdigital.co.za", bg: "#1a0f14", accent: "#ff85a1" },
];

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="work"
      ref={ref}
      style={{
        padding: "5rem 0 6rem",
        background: "var(--dark)",
        borderTop: "1px solid rgba(245,244,239,0.07)",
      }}
    >
      <style>{`
        .kd-port-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.375rem 1rem;
          border-bottom: 1px solid rgba(245,244,239,0.06);
          text-decoration: none;
          border-radius: 0.75rem;
          transition: background 0.3s ease, padding-left 0.4s ease;
          margin: 0 -1rem;
        }
        .kd-port-row:first-child { border-top: 1px solid rgba(245,244,239,0.06); }
        .kd-port-row:hover {
          background: rgba(245,244,239,0.03);
          padding-left: 1.75rem;
        }
        .kd-port-num {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: rgba(245,244,239,0.2);
          width: 2rem;
          flex-shrink: 0;
          transition: color 0.3s ease;
          font-variant-numeric: tabular-nums;
        }
        .kd-port-row:hover .kd-port-num { color: var(--green3); }
        .kd-port-tag {
          font-family: var(--font-sans);
          font-size: 0.625rem;
          color: rgba(245,244,239,0.35);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 0.3rem;
        }
        .kd-port-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: rgba(245,244,239,0.9);
          transition: color 0.3s ease;
          margin: 0;
        }
        .kd-port-row:hover .kd-port-title { color: var(--green3); }
        .kd-port-desc {
          font-family: var(--font-sans);
          font-weight: 300;
          font-size: 0.8125rem;
          line-height: 1.65;
          color: rgba(245,244,239,0.42);
          max-width: 20rem;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }
        .kd-port-row:hover .kd-port-desc { color: rgba(245,244,239,0.65); }
        .kd-port-arrow {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 1px solid rgba(245,244,239,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .kd-port-row:hover .kd-port-arrow {
          border-color: var(--green3);
          background: rgba(93,191,136,0.1);
        }
        .kd-port-arrow-icon {
          color: rgba(245,244,239,0.3);
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .kd-port-row:hover .kd-port-arrow-icon {
          color: var(--green3);
          transform: translate(2px, -2px);
        }
        .kd-port-swatch {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kd-port-row:hover .kd-port-swatch { transform: scale(1.1); }
        .kd-port-desc-col { display: block; }
        @media (max-width: 1023px) { .kd-port-desc-col { display: none !important; } }
        @media (max-width: 639px) { .kd-port-title { font-size: 1rem; } }
      `}</style>

      <div className="kd-container">

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        }}>
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
                marginBottom: "1rem",
              }}
            >
              Our Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "var(--cream)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Projects we are<br />proud of.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "rgba(245,244,239,0.45)",
              maxWidth: "18rem",
              margin: 0,
            }}
          >
            Businesses taken from no online presence to a digital home they are proud to share.
          </motion.p>
        </div>

        {/* Project rows */}
        <div>
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="kd-port-row"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="kd-port-num">0{i + 1}</span>

              <div
                className="kd-port-swatch"
                style={{
                  background: project.bg,
                  boxShadow: hovered === i ? `0 0 16px ${project.accent}40` : "none",
                }}
              >
                <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: project.accent }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="kd-port-tag">{project.tag}</p>
                <h3 className="kd-port-title">{project.title}</h3>
              </div>

              <p className="kd-port-desc kd-port-desc-col">{project.desc}</p>

              <div className="kd-port-arrow">
                <svg className="kd-port-arrow-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
