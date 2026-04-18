"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const channels = [
  { icon: "📧", label: "Email" },
  { icon: "💬", label: "WhatsApp" },
  { icon: "🌐", label: "Web form" },
  { icon: "📞", label: "Phone/voicemail" },
];

const workflows = [
  {
    id: "quotes",
    label: "Quote requests",
    icon: "📄",
    manual: {
      steps: ["Read email, figure out what they want", "Open spreadsheet, find rate card", "Calculate each line item manually", "Type quote in Word", "Email it back", "Log in folder, hope you remember to follow up"],
      time: "34 min each",
      daily: "40 requests/day = 22+ hours",
      problems: ["Typos in pricing", "Forgot to follow up on 6 quotes", "Client waited 4 hours for a response"],
    },
    ai: {
      steps: ["AI reads request, extracts requirements", "Matches to your rate card instantly", "Generates branded PDF quote", "Sends to coordinator for one-click approval", "Auto-sends to client via email + WhatsApp", "Schedules follow-up if no response in 24h"],
      time: "~1 min each",
      daily: "40 requests/day = 40 min total",
    },
  },
  {
    id: "tracking",
    label: "Shipment tracking",
    icon: "📍",
    manual: {
      steps: ["Client calls asking where their load is", "Phone driver, wait for answer", "Call client back with update", "Repeat 20+ times per day", "No record of what was communicated"],
      time: "8 min each",
      daily: "20 calls/day = 2.5+ hours",
      problems: ["Driver didn't answer, client called back 3 times", "Gave wrong ETA from memory", "No audit trail"],
    },
    ai: {
      steps: ["Client sends WhatsApp: 'Where is my load?'", "AI checks GPS/last known status", "Sends real-time update automatically", "If no GPS data, AI messages driver for ETA", "Logs every interaction with timestamp"],
      time: "Instant",
      daily: "20 queries/day = 0 staff time",
    },
  },
  {
    id: "pods",
    label: "POD collection",
    icon: "📸",
    manual: {
      steps: ["Driver takes photo of signed POD", "WhatsApps it to the office", "Admin downloads, renames, files it", "Types delivery details into system", "Chases drivers who forgot to send PODs"],
      time: "12 min each",
      daily: "30 deliveries/day = 6 hours",
      problems: ["5 PODs missing at month-end", "Blurry photo, need to ask driver again", "Invoice delayed because POD wasn't filed"],
    },
    ai: {
      steps: ["Driver uploads photo via WhatsApp or app", "AI extracts: recipient, date, signature, condition", "Auto-files with correct reference number", "Updates delivery status in your system", "Flags missing PODs and chases drivers automatically"],
      time: "~10 sec each",
      daily: "30 deliveries/day = 5 min review",
    },
  },
  {
    id: "invoicing",
    label: "Invoicing & payments",
    icon: "💰",
    manual: {
      steps: ["Check which deliveries are complete", "Cross-reference PODs and rates", "Create invoice in Sage/Xero manually", "Email to client", "Track who's paid in a spreadsheet", "Chase overdue invoices by phone"],
      time: "15 min each",
      daily: "Invoicing backlog of 2-3 days",
      problems: ["Missed R45k in unbilled deliveries", "Client disputes invoice, no POD attached", "Overdue payments discovered at month-end"],
    },
    ai: {
      steps: ["AI detects completed delivery + POD received", "Auto-generates invoice with POD attached", "Sends to client via email with payment link", "Tracks payment status in real time", "Sends polite reminder at 7, 14, 21 days overdue", "Escalates to you at 30 days with full history"],
      time: "Automatic",
      daily: "Invoices go out same day, every day",
    },
  },
  {
    id: "feedback",
    label: "Client & staff feedback",
    icon: "⭐",
    manual: {
      steps: ["Nobody asks for feedback", "Problems surface as complaints", "No record of service quality trends", "Staff issues only caught when someone quits"],
      time: "Never happens",
      daily: "0 data collected",
      problems: ["Lost 3 clients before anyone noticed they were unhappy", "Driver was consistently late, discovered after 4 months"],
    },
    ai: {
      steps: ["AI sends delivery rating request to client automatically", "Collects driver performance scores per delivery", "Aggregates trends: on-time %, satisfaction, complaints", "Alerts you to declining scores before clients leave", "Monthly report: top performers, problem areas, at-risk clients"],
      time: "Automatic",
      daily: "Every delivery generates data",
    },
  },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={color} style={{ flexShrink: 0, marginTop: "2px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#dc4a4a" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Workflow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const wf = workflows[active];

  return (
    <section ref={ref} style={{ padding: "6rem 0", background: "var(--cream)" }}>
      <style>{`
        .kd-wf-tab-btn {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.625rem 1.125rem;
          border-radius: 0.75rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        .kd-wf-tab-btn:hover { background: rgba(45,106,79,0.04); }
        .kd-wf-tab-btn.active {
          background: var(--dark);
          color: var(--cream);
          border-color: var(--dark);
          font-weight: 600;
        }
        .kd-wf-step {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          font-family: var(--font-sans);
          font-size: 0.825rem;
          font-weight: 300;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          color: var(--muted);
        }
        .kd-wf-channel {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--green);
          background: rgba(58,138,98,0.06);
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
        }
        .kd-wf-problem {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: #dc4a4a;
          line-height: 1.5;
          margin-bottom: 0.375rem;
        }
        .kd-wf-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .kd-wf-tabs-row {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }
        .kd-wf-tabs-row::-webkit-scrollbar { display: none; }
        @media (max-width: 899px) {
          .kd-wf-main { grid-template-columns: 1fr; }
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
            What You Get
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--dark)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}
          >
            One AI system. Every workflow handled.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "40rem", margin: "0 auto" }}
          >
            This is not a single automation. It is an AI employee that handles quotes, tracking, PODs, invoicing, follow-ups, and feedback collection across email, WhatsApp, and web. Here is what changes for each workflow.
          </motion.p>
        </div>

        {/* Incoming channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", alignSelf: "center", marginRight: "0.25rem" }}>
            Incoming from:
          </span>
          {channels.map((ch) => (
            <span key={ch.label} className="kd-wf-channel">
              <span>{ch.icon}</span> {ch.label}
            </span>
          ))}
        </motion.div>

        {/* Workflow tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="kd-wf-tabs-row"
          style={{ justifyContent: "center", marginBottom: "2rem" }}
        >
          {workflows.map((w, i) => (
            <button
              key={w.id}
              className={`kd-wf-tab-btn${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span>{w.icon}</span>
              {w.label}
            </button>
          ))}
        </motion.div>

        {/* Comparison panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="kd-wf-main"
            style={{ maxWidth: "64rem", margin: "0 auto" }}
          >
            {/* Manual side */}
            <div style={{
              background: "var(--cream)",
              border: "1px solid rgba(220,60,60,0.15)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#dc4a4a" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#dc4a4a" }}>
                  Manual process
                </span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600, color: "#dc4a4a", background: "rgba(220,60,60,0.08)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                  {wf.manual.time}
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                {wf.manual.steps.map((step, i) => (
                  <div key={i} className="kd-wf-step">
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, color: "rgba(220,60,60,0.4)", width: "1.25rem", textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>

              {/* Problems */}
              <div style={{ padding: "1rem", background: "rgba(220,60,60,0.04)", borderRadius: "0.75rem", border: "1px solid rgba(220,60,60,0.08)", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#dc4a4a", marginBottom: "0.625rem" }}>
                  What goes wrong
                </div>
                {wf.manual.problems.map((p, i) => (
                  <div key={i} className="kd-wf-problem">
                    <XIcon />
                    {p}
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "#dc4a4a", textAlign: "center" }}>
                {wf.manual.daily}
              </div>
            </div>

            {/* AI side */}
            <div style={{
              background: "var(--cream)",
              border: "1.5px solid rgba(58,138,98,0.25)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              boxShadow: "0 8px 32px rgba(58,138,98,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--green)" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)" }}>
                  AI-powered
                </span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600, color: "var(--green)", background: "rgba(58,138,98,0.08)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                  {wf.ai.time}
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                {wf.ai.steps.map((step, i) => (
                  <div key={i} className="kd-wf-step" style={{ color: "var(--dark)" }}>
                    <CheckIcon color="var(--green)" />
                    {step}
                  </div>
                ))}
              </div>

              <div style={{ padding: "1rem", background: "rgba(58,138,98,0.04)", borderRadius: "0.75rem", border: "1px solid rgba(58,138,98,0.1)" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--green)", textAlign: "center" }}>
                  {wf.ai.daily}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Total impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          style={{ maxWidth: "64rem", margin: "2.5rem auto 0" }}
        >
          <div style={{
            background: "var(--dark)",
            borderRadius: "1.25rem",
            padding: "2rem 2.5rem",
          }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--green3)", textAlign: "center", marginBottom: "1.5rem" }}>
              Total monthly impact
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "#dc4a4a", textDecoration: "line-through", opacity: 0.6 }}>3-4 admin staff</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>Before</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 12h14m-4-4l4 4-4 4" stroke="var(--green3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--green3)" }}>1 reviewer</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>After</div>
              </div>
              <div style={{ width: "1px", height: "2.5rem", background: "rgba(245,244,239,0.1)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "#f5f4ef" }}>R50-75k saved</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "rgba(245,244,239,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>Per month in salary alone</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Faster responses", value: "34x" },
                { label: "Fewer errors", value: "95%" },
                { label: "Missed follow-ups", value: "Zero" },
                { label: "Data stays local", value: "100%" },
                { label: "Works 24/7", value: "Always" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--green3)" }}>{stat.value}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.625rem", color: "rgba(245,244,239,0.35)", letterSpacing: "0.5px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "1.5rem",
            lineHeight: 1.7,
          }}
        >
          This is one AI system. Not five separate tools. It learns your rate cards, your clients, your staff. Every interaction is logged and auditable. Your data never leaves your building.
        </motion.p>
      </div>
    </section>
  );
}
