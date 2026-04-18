"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Discovery", desc: "We sit with your team and watch how they work. We identify the repetitive, time-consuming tasks that AI can handle." },
  { num: "02", title: "Design", desc: "We map out the workflow: what the AI handles, what humans review, and how it fits into your existing systems." },
  { num: "03", title: "Build", desc: "Custom software, trained on your processes. We build, test, and iterate with your team until the output is reliable." },
  { num: "04", title: "Deploy", desc: "AI runs on your premises or in a private environment. We handle the infrastructure so your data stays under your control." },
  { num: "05", title: "Optimise", desc: "We monitor performance, fine-tune accuracy, and expand into new workflows as your team sees what is possible." },
];

export default function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" ref={ref} style={{ padding: "7rem 0 5rem", background: "var(--cream2)" }}>
      <style>{`
        .kd-process-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 0.625rem;
        }
        .kd-process-circle {
          flex-shrink: 0;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          border: 2px solid rgba(45,106,79,0.15);
          background: var(--cream2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .kd-process-step:hover .kd-process-circle {
          border-color: var(--green);
          background: var(--green);
        }
        .kd-process-circle-num {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--muted);
          transition: color 0.3s ease;
        }
        .kd-process-step:hover .kd-process-circle-num { color: var(--cream); }
        .kd-process-card {
          flex: 1;
          background: var(--cream);
          border-radius: 1.125rem;
          padding: 1.5rem;
          border: 1px solid rgba(45,106,79,0.1);
          transition: box-shadow 0.3s ease;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.125rem;
        }
        .kd-process-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .kd-process-ghost {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          color: rgba(45,106,79,0.07);
          line-height: 1;
          flex-shrink: 0;
          user-select: none;
        }
        @media (max-width: 767px) {
          .kd-process-circle { display: none !important; }
          .kd-process-line { display: none !important; }
          .kd-process-step { gap: 0; }
        }
      `}</style>

      <div className="kd-container">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", marginBottom: "4rem", flexWrap: "wrap" }}>
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
                color: "var(--green)",
                marginBottom: "1.25rem",
              }}
            >
              How It Works
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
                margin: 0,
              }}
            >
              From manual process<br />to automated workflow.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "1.125rem",
              background: "var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--cream)" }}>5</span>
          </motion.div>
        </div>

        {/* Steps with vertical line */}
        <div style={{ position: "relative" }}>
          {/* Background line — starts and ends at circle centers (1.375rem = half circle height) */}
          <div
            className="kd-process-line"
            style={{
              position: "absolute",
              left: "1.3125rem",
              top: "1.375rem",
              bottom: "1.375rem",
              width: "1px",
              background: "rgba(45,106,79,0.12)",
            }}
          />
          {/* Animated foreground line */}
          <motion.div
            className="kd-process-line"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
            style={{
              position: "absolute",
              left: "1.3125rem",
              top: "1.375rem",
              bottom: "1.375rem",
              width: "1px",
              background: "var(--green)",
              transformOrigin: "top",
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="kd-process-step"
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.12 }}
            >
              {/* Circle */}
              <div className="kd-process-circle">
                <span className="kd-process-circle-num">{i + 1}</span>
              </div>

              {/* Card */}
              <div className="kd-process-card">
                <div>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "var(--green)",
                    marginBottom: "0.5rem",
                  }}>
                    Step {step.num}
                  </p>
                  <h3 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.25rem",
                    color: "var(--dark)",
                    marginBottom: "0.5rem",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "var(--muted)",
                    margin: 0,
                  }}>
                    {step.desc}
                  </p>
                </div>
                <span className="kd-process-ghost">{step.num}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
