"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const projects = [
  { tag: "Fashion · Web Design", title: "Shevans Luxury Streetwear", desc: "Premium streetwear brand site with immersive product showcase and mobile-optimised shopping experience.", url: "https://shevans.kleinhansdigital.co.za", bg: "#0a0a0a", accent: "#00d4ff" },
  { tag: "Corporate · Web Design", title: "LRW Group", desc: "Clean corporate holding company site with services showcase, professional tone, and strong brand presence.", url: "https://lrwgroup.kleinhansdigital.co.za", bg: "#111010", accent: "#c9a84c" },
  { tag: "E-Commerce · Branding", title: "Drip King", desc: "Fully featured online store with product catalogue, shopping cart, and brand identity built for the right market.", url: "https://dripking.kleinhansdigital.co.za", bg: "#0d0d0d", accent: "#e85d04" },
  { tag: "Retail · Web Design + SEO", title: "Bok Ballas Vapes", desc: "Striking retail site with product showcase, location finder, and local SEO to drive walk-in traffic.", url: "https://bokballas.kleinhansdigital.co.za", bg: "#0a1a0f", accent: "#4caf50" },
  { tag: "Hospitality · Web Design", title: "De Kleine Kaap Guest House", desc: "Cape Dutch guest house with WhatsApp booking integration, lightbox gallery, and mobile-first design for Lady Grey.", url: "https://de-kleine-kaap.kleinhansdigital.co.za", bg: "#1a1209", accent: "#d4a853" },
  { tag: "Pet Services · Web Design", title: "Jess's Pet Sitting", desc: "Warm, trust-building website for a professional pet sitting service. Easy to navigate, easy to contact, easy to book.", url: "https://jess.kleinhansdigital.co.za", bg: "#1a0f14", accent: "#ff85a1" },
];

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-32 bg-[var(--dark2)]" ref={ref}>
      <div className="kd-container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green3)] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Our Work
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--cream)]"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              Projects we are<br />proud of.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--cream)]/40 max-w-xs text-sm leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
          >
            Businesses taken from no online presence to a digital home they are proud to share.
          </motion.p>
        </div>

        {/* Project list */}
        <div className="space-y-px">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            >
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="port-card group flex items-center justify-between gap-6 py-6 border-b border-[var(--cream)]/5 hover:pl-4 transition-all duration-500"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  {/* Number */}
                  <span
                    className="text-[var(--cream)]/15 text-sm font-mono w-8 flex-shrink-0 group-hover:text-[var(--green3)] transition-colors duration-300"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    0{i + 1}
                  </span>

                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 transition-all duration-500 group-hover:scale-110"
                    style={{ background: project.bg, boxShadow: hoveredIndex === i ? `0 0 20px ${project.accent}30` : "none" }}
                  >
                    <div className="w-full h-full rounded-xl flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ background: project.accent }} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <div className="text-[10px] text-[var(--cream)]/30 tracking-[3px] uppercase mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {project.tag}
                    </div>
                    <h3
                      className="text-[var(--cream)] text-lg font-normal group-hover:text-[var(--green3)] transition-colors duration-300 truncate"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Description — hidden on small, shown on hover */}
                <p
                  className="hidden lg:block text-[var(--cream)]/30 text-sm max-w-xs leading-relaxed flex-shrink-0 group-hover:text-[var(--cream)]/50 transition-colors duration-300"
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
                >
                  {project.desc}
                </p>

                {/* Arrow */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--cream)]/10 flex items-center justify-center group-hover:border-[var(--green3)] group-hover:bg-[var(--green)]/10 transition-all duration-300">
                  <svg className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--green3)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
