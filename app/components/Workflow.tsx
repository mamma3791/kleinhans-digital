"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const oldSteps = [
  { icon: "📧", label: "Quote request arrives via email", time: "0 min" },
  { icon: "👀", label: "Coordinator reads and interprets request", time: "+5 min" },
  { icon: "📋", label: "Opens spreadsheet, looks up rate card", time: "+8 min" },
  { icon: "🔢", label: "Manually calculates costs per item", time: "+6 min" },
  { icon: "📝", label: "Types up quote in Word or email", time: "+10 min" },
  { icon: "✉️", label: "Sends quote back to client", time: "+2 min" },
  { icon: "📂", label: "Files quote in folder system", time: "+3 min" },
  { icon: "🔄", label: "Repeats 30-50 times per day", time: "" },
];

const newSteps = [
  { icon: "📧", label: "Quote request arrives via email or WhatsApp", time: "0 min", auto: true },
  { icon: "🤖", label: "AI reads request, extracts all requirements", time: "+3 sec", auto: true },
  { icon: "⚡", label: "Matches to your rate card automatically", time: "+1 sec", auto: true },
  { icon: "📄", label: "Generates formatted quote", time: "+2 sec", auto: true },
  { icon: "👤", label: "Coordinator reviews and clicks approve", time: "+1 min", auto: false },
  { icon: "✅", label: "Quote sent, logged, tracked automatically", time: "+1 sec", auto: true },
];

export default function Workflow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState<"old" | "new">("old");

  return (
    <section ref={ref} style={{ padding: "6rem 0", background: "var(--cream)" }}>
      <style>{`
        .kd-wf-tab {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.625rem 1.5rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .kd-wf-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 0.375rem;
          transition: background 0.2s;
        }
        .kd-wf-step:hover { background: rgba(45,106,79,0.04); }
        .kd-wf-connector {
          position: absolute;
          left: 2.15rem;
          top: 2.5rem;
          bottom: 0.5rem;
          width: 1px;
        }
        @media (max-width: 767px) {
          .kd-wf-compare { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="kd-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "1rem" }}
          >
            Before and After
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--dark)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}
          >
            What changes when AI takes over the admin.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "36rem", margin: "0 auto" }}
          >
            This is a real example of how a logistics company processes quote requests. The left side is what happens today. The right side is what happens with our AI.
          </motion.p>
        </div>

        {/* Mobile tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }} className="kd-wf-mobile-tabs">
          <button
            className="kd-wf-tab"
            onClick={() => setActiveTab("old")}
            style={{
              background: activeTab === "old" ? "rgba(220,60,60,0.1)" : "rgba(45,106,79,0.06)",
              color: activeTab === "old" ? "#dc4a4a" : "var(--muted)",
            }}
          >
            Without AI
          </button>
          <button
            className="kd-wf-tab"
            onClick={() => setActiveTab("new")}
            style={{
              background: activeTab === "new" ? "rgba(58,138,98,0.12)" : "rgba(45,106,79,0.06)",
              color: activeTab === "new" ? "var(--green)" : "var(--muted)",
            }}
          >
            With AI
          </button>
        </div>

        {/* Comparison */}
        <motion.div
          className="kd-wf-compare"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "62rem", margin: "0 auto" }}
        >
          {/* Old way */}
          <div style={{
            background: activeTab === "old" ? "var(--cream)" : "var(--cream)",
            border: "1px solid rgba(220,60,60,0.15)",
            borderRadius: "1.25rem",
            padding: "1.75rem",
            opacity: activeTab === "new" ? 0.4 : 1,
            transition: "opacity 0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#dc4a4a" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#dc4a4a" }}>
                Manual process
              </span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "#dc4a4a", background: "rgba(220,60,60,0.08)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                ~34 min per quote
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <div className="kd-wf-connector" style={{ background: "rgba(220,60,60,0.12)" }} />
              {oldSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="kd-wf-step"
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <span style={{ fontSize: "1.125rem", flexShrink: 0, width: "1.75rem", textAlign: "center" }}>{step.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--dark)", fontWeight: 400, lineHeight: 1.5 }}>
                      {step.label}
                    </div>
                  </div>
                  {step.time && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", flexShrink: 0, marginTop: "0.1rem" }}>
                      {step.time}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom summary */}
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(220,60,60,0.04)", borderRadius: "0.75rem", border: "1px solid rgba(220,60,60,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "#dc4a4a" }}>Daily cost (40 quotes)</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "#dc4a4a" }}>22+ hours</span>
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
                3 coordinators at R25k/month each = R75,000/month in salary for quote processing alone
              </div>
            </div>
          </div>

          {/* New way */}
          <div style={{
            background: "var(--cream)",
            border: "1.5px solid rgba(58,138,98,0.25)",
            borderRadius: "1.25rem",
            padding: "1.75rem",
            opacity: activeTab === "old" ? 0.4 : 1,
            transition: "opacity 0.3s",
            boxShadow: activeTab === "new" ? "0 8px 32px rgba(58,138,98,0.08)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--green)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)" }}>
                AI-powered
              </span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "var(--green)", background: "rgba(58,138,98,0.08)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                ~1 min per quote
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <div className="kd-wf-connector" style={{ background: "rgba(58,138,98,0.15)" }} />
              {newSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="kd-wf-step"
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ background: step.auto ? "rgba(58,138,98,0.03)" : "transparent" }}
                >
                  <span style={{ fontSize: "1.125rem", flexShrink: 0, width: "1.75rem", textAlign: "center" }}>{step.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--dark)", fontWeight: 400, lineHeight: 1.5 }}>
                      {step.label}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                    {step.auto && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700, color: "var(--green)", background: "rgba(58,138,98,0.1)", padding: "0.15rem 0.5rem", borderRadius: "9999px", letterSpacing: "0.5px" }}>
                        AUTO
                      </span>
                    )}
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: step.auto ? "var(--green)" : "var(--muted)", marginTop: "0.1rem" }}>
                      {step.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom summary */}
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(58,138,98,0.04)", borderRadius: "0.75rem", border: "1px solid rgba(58,138,98,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "var(--green)" }}>Daily cost (40 quotes)</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--green)" }}>~40 min</span>
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
                1 coordinator reviewing AI output = R25,000/month. Save R50,000/month instantly.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Savings callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          style={{ maxWidth: "62rem", margin: "2rem auto 0", textAlign: "center" }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2rem",
            background: "var(--dark)",
            borderRadius: "1rem",
            padding: "1.5rem 2.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "#dc4a4a", textDecoration: "line-through", opacity: 0.6 }}>R75k</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>Old monthly cost</div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M5 12h14m-4-4l4 4-4 4" stroke="var(--green3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--green3)" }}>R33k</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>New monthly cost</div>
            </div>
            <div style={{ width: "1px", height: "2.5rem", background: "rgba(245,244,239,0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "#f5f4ef" }}>R504k</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>Saved per year</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
