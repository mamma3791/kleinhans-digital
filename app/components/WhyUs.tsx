"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reasons = [
  { num: "01", title: "Built from scratch, every time", desc: "No page builders, no templates, no shortcuts. Your site is written in clean code built specifically for your business." },
  { num: "02", title: "You deal with a person, not a call centre", desc: "Direct access to the person who builds your site. Questions get answered. Changes get made. No ticket system." },
  { num: "03", title: "Fast delivery without cutting corners", desc: "Most projects go from brief to live in under 14 days. Speed comes from experience and process, not from rushing." },
  { num: "04", title: "SEO baked in from day one", desc: "Search visibility is not an afterthought. Schema markup, meta structure, Google My Business, and local SEO are built into every site." },
];

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 bg-[var(--dark)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green3)] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Why Kleinhans Digital
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.2rem,4vw,3.8rem)] text-[var(--cream)] mb-8 leading-[1.05]"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              The difference is in the details.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[var(--cream)]/40 text-base leading-relaxed mb-10"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
            >
              Most web design businesses use templates and call it custom. We do not. That difference shows in how the site looks, how fast it loads, and how many enquiries it generates.
            </motion.p>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-[var(--green)] hover:bg-[var(--green2)] text-[var(--cream)] font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Start a conversation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>

          {/* Right */}
          <div className="space-y-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="group border border-[var(--cream)]/5 rounded-2xl p-6 hover:bg-[var(--cream)]/3 hover:border-[var(--green)]/20 transition-all duration-400"
              >
                <div className="flex items-start gap-5">
                  <span
                    className="text-3xl text-[var(--green)]/20 group-hover:text-[var(--green)]/40 transition-colors font-normal flex-shrink-0 leading-none mt-1"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {r.num}
                  </span>
                  <div>
                    <h3 className="text-lg text-[var(--cream)] mb-2 group-hover:text-[var(--green3)] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {r.title}
                    </h3>
                    <p className="text-[var(--cream)]/40 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
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
