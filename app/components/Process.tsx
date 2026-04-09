"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Discovery", desc: "We learn about your business, your customers, and your goals. A clear brief means a better outcome." },
  { num: "02", title: "Design", desc: "A custom design built around your brand. You review, give feedback, and we refine until it is right." },
  { num: "03", title: "Development", desc: "Clean, fast code. Mobile ready. Built for search. Every integration tested thoroughly before launch." },
  { num: "04", title: "Launch", desc: "We handle domain, hosting, and going live. Delivered on a global network — fast anywhere in the world." },
  { num: "05", title: "Support", desc: "You are not on your own after launch. We are available for updates, changes, and growing your presence further." },
];

export default function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-32 bg-[var(--cream2)]" ref={ref}>
      <div className="kd-container">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green)] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              How It Works
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--dark)]"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              From brief to live<br />in 14 days.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[var(--green)] flex items-center justify-center"
          >
            <span className="text-3xl text-[var(--cream)]" style={{ fontFamily: "'DM Serif Display', serif" }}>14</span>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-[var(--border)] hidden md:block" />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="absolute left-[22px] top-0 bottom-0 w-px bg-[var(--green)] hidden md:block origin-top"
          />

          <div className="space-y-2">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="flex gap-8 md:gap-12 items-start group"
              >
                {/* Circle */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-[var(--border)] bg-[var(--cream2)] flex items-center justify-center z-10 group-hover:border-[var(--green)] group-hover:bg-[var(--green)] transition-all duration-300 hidden md:flex">
                  <span
                    className="text-[var(--muted)] text-xs font-bold group-hover:text-[var(--cream)] transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-[var(--cream)] rounded-2xl p-6 mb-2 hover:shadow-md transition-shadow duration-300 border border-[var(--border)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-[var(--green)] font-bold tracking-[3px] uppercase mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Step {step.num}
                      </div>
                      <h3 className="text-xl text-[var(--dark)] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {step.title}
                      </h3>
                      <p className="text-[var(--muted)] text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                        {step.desc}
                      </p>
                    </div>
                    <span
                      className="text-[3rem] text-[var(--green)]/10 font-normal flex-shrink-0 leading-none"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {step.num}
                    </span>
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
