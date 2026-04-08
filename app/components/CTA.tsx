"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[var(--cream)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative noise-overlay bg-[var(--dark)] rounded-3xl overflow-hidden px-8 md:px-16 py-16 md:py-20 text-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,106,79,0.15) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green3)] mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ready to grow?
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-[clamp(2rem,5vw,4rem)] text-[var(--cream)] mb-6 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              Your business deserves<br />a website that <em>works.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[var(--cream)]/40 text-base max-w-md mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
            >
              From R6,500 once-off. Live in 14 days. Johannesburg based, available across South Africa.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 bg-[var(--green)] hover:bg-[var(--green2)] text-[var(--cream)] font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--green)]/20"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Start a Project Today
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#work"
                className="inline-flex items-center border border-[var(--cream)]/15 hover:border-[var(--cream)]/30 text-[var(--cream)]/60 hover:text-[var(--cream)] font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                View Our Work
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
