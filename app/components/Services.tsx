"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tag: "Core Service",
    title: "Web Design",
    desc: "Custom-coded, mobile-first websites. No templates, no page builders. Every site is built specifically for your business from scratch.",
    size: "large",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    tag: "Visibility",
    title: "SEO",
    desc: "Built-in from day one. Google My Business setup, schema markup, keyword structure, and local search optimisation.",
    size: "small",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    tag: "Identity",
    title: "Branding",
    desc: "Logo, colour system, typography, and brand guidelines that make your business instantly recognisable.",
    size: "small",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    tag: "Revenue",
    title: "E-Commerce",
    desc: "Online stores with product catalogues, WhatsApp checkout integration, and payment processing for the South African market.",
    size: "small",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-32 bg-[var(--cream)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green)] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              What We Do
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--dark)]"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              Services that grow<br />your business.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--muted)] max-w-sm text-base leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
          >
            Every engagement starts with understanding your business, your customers, and what growth actually looks like for you.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card — spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:row-span-2 bg-[var(--dark)] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] group hover:bg-[var(--dark2)] transition-colors duration-500"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--green)]/20 flex items-center justify-center text-[var(--green3)] mb-6 group-hover:bg-[var(--green)]/30 transition-colors">
                {services[0].icon}
              </div>
              <div className="text-xs text-[var(--green3)] font-semibold tracking-[3px] uppercase mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {services[0].tag}
              </div>
              <h3 className="text-[2rem] text-[var(--cream)] mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {services[0].title}
              </h3>
              <p className="text-[var(--cream)]/50 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                {services[0].desc}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[var(--green3)] text-sm font-semibold mt-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
              From R6,500
              <div className="w-8 h-8 rounded-full bg-[var(--green)]/20 flex items-center justify-center group-hover:bg-[var(--green)]/40 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Small cards */}
          {services.slice(1).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              className="bg-[var(--cream2)] rounded-3xl p-7 flex flex-col justify-between group hover:bg-[var(--green)]/5 transition-colors duration-300 border border-[var(--border)]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--green)]/10 flex items-center justify-center text-[var(--green)] mb-5 group-hover:bg-[var(--green)]/20 transition-colors">
                  {s.icon}
                </div>
                <div className="text-[10px] text-[var(--green)] font-semibold tracking-[3px] uppercase mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {s.tag}
                </div>
                <h3 className="text-xl text-[var(--dark)] mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {s.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap gap-px bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]"
        >
          {[
            { num: "14", label: "Days average delivery" },
            { num: "100%", label: "Custom built every time" },
            { num: "R0", label: "Monthly template cost" },
            { num: "6+", label: "Sites launched" },
          ].map((s, i) => (
            <div key={i} className="flex-1 min-w-[140px] bg-[var(--cream)] px-6 py-5 text-center">
              <div className="text-2xl text-[var(--green)] font-normal mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {s.num}
              </div>
              <div className="text-[var(--muted)] text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
