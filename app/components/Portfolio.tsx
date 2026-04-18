"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    tag: "Corporate · Intelligent Website",
    title: "LRW Group",
    desc: "Holding company platform with clear services architecture, investor-focused design, and integrated contact workflows.",
    url: "https://lrwgroup.kleinhansdigital.co.za",
    accent: "#c9a84c",
    bg: "#111010",
  },
  {
    tag: "E-Commerce · Custom Software",
    title: "Drip King",
    desc: "Full e-commerce platform with product management, shopping cart, payment processing, and brand identity system built from scratch.",
    url: "https://dripking.kleinhansdigital.co.za",
    accent: "#e85d04",
    bg: "#0d0d0d",
  },
  {
    tag: "Fashion · Digital Platform",
    title: "Shevans Luxury Streetwear",
    desc: "Product showcase platform with immersive editorial layout and mobile-optimised shopping experience for the SA market.",
    url: "https://shevans.kleinhansdigital.co.za",
    accent: "#00d4ff",
    bg: "#0a0a0a",
  },
  {
    tag: "Retail · Web + SEO",
    title: "Bok Ballas Vapes",
    desc: "Retail platform with product catalogue, location finder, and local SEO to drive walk-in traffic. Built to convert.",
    url: "https://bokballas.kleinhansdigital.co.za",
    accent: "#4caf50",
    bg: "#0a1a0f",
  },
  {
    tag: "Hospitality · Booking Platform",
    title: "De Kleine Kaap",
    desc: "Guest house platform with WhatsApp booking integration, lightbox gallery, and mobile-first design for a Lady Grey property.",
    url: "https://de-kleine-kaap.kleinhansdigital.co.za",
    accent: "#d4a853",
    bg: "#1a1209",
  },
  {
    tag: "Services · Lead Generation",
    title: "Jess's Pet Sitting",
    desc: "Service booking platform with automated enquiry handling and client trust-building design.",
    url: "https://jess.kleinhansdigital.co.za",
    accent: "#ff85a1",
    bg: "#1a0f14",
  },
];

function screenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  const project = projects[active];

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
        .kd-port-thumb {
          flex-shrink: 0;
          width: 10rem;
          border-radius: 0.875rem;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.25s ease, transform 0.25s ease, opacity 0.25s ease;
          opacity: 0.5;
          background: #111;
        }
        .kd-port-thumb:hover { opacity: 0.75; transform: translateY(-2px); }
        .kd-port-thumb.active { border-color: var(--green3); opacity: 1; }
        .kd-port-thumb-img {
          width: 100%;
          aspect-ratio: 16/10;
          object-fit: cover;
          object-position: top;
          display: block;
        }
        .kd-port-thumb-label {
          padding: 0.625rem 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(245,244,239,0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kd-port-thumb.active .kd-port-thumb-label { color: var(--green3); }
        .kd-port-thumbs {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
        }
        .kd-port-thumbs::-webkit-scrollbar { display: none; }
        .kd-port-visit {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .kd-port-visit:hover { background: var(--green2); transform: scale(1.02); }
        .kd-port-browser {
          background: #1e1e1e;
          border-radius: 0.875rem;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .kd-port-browser-bar {
          background: #2a2a2a;
          padding: 0.625rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .kd-port-browser-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .kd-port-browser-url {
          flex: 1;
          background: #1a1a1a;
          border-radius: 0.375rem;
          padding: 0.25rem 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          margin: 0 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kd-port-featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
          background: rgba(245,244,239,0.03);
          border: 1px solid rgba(245,244,239,0.07);
          border-radius: 1.375rem;
          padding: 2rem;
          min-height: 26rem;
        }
        .kd-port-cta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: nowrap;
        }
        @media (max-width: 767px) {
          .kd-port-featured-grid {
            grid-template-columns: 1fr !important;
            min-height: unset !important;
            padding: 1.25rem !important;
            gap: 1.25rem !important;
          }
          .kd-port-thumb { width: 7.5rem !important; }
        }
      `}</style>

      <div className="kd-container">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1rem" }}
            >
              Our Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "var(--cream)", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}
            >
              Recent builds.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(245,244,239,0.45)", maxWidth: "18rem", margin: 0 }}
          >
            A sample of the websites and platforms we have built. AI workflow demos available on request.
          </motion.p>
        </div>

        {/* Featured card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ marginBottom: "1.25rem" }}
        >
          <div className="kd-port-featured-grid">

            {/* Screenshot */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="kd-port-browser"
              >
                <div className="kd-port-browser-bar">
                  <div className="kd-port-browser-dot" style={{ background: "#ff5f57" }} />
                  <div className="kd-port-browser-dot" style={{ background: "#febc2e" }} />
                  <div className="kd-port-browser-dot" style={{ background: "#28c840" }} />
                  <div className="kd-port-browser-url">{project.url.replace("https://", "")}</div>
                </div>
                <img
                  src={screenshotUrl(project.url)}
                  alt={project.title}
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active + "-info"}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "0.875rem" }}>
                  {project.tag}
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--cream)", marginBottom: "1rem", lineHeight: 1.15 }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(245,244,239,0.52)", marginBottom: "1.75rem" }}>
                  {project.desc}
                </p>
                <div className="kd-port-cta-row">
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="kd-port-visit">
                    View live site
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.25)" }}>
                    {active + 1} / {projects.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Thumbnail row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="kd-port-thumbs"
        >
          {projects.map((p, i) => (
            <button
              key={p.title}
              className={`kd-port-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View ${p.title}`}
              style={{ border: i === active ? `2px solid var(--green3)` : "2px solid transparent" }}
            >
              <img
                src={screenshotUrl(p.url)}
                alt={p.title}
                className="kd-port-thumb-img"
                loading="lazy"
              />
              <div className="kd-port-thumb-label">{p.title}</div>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
