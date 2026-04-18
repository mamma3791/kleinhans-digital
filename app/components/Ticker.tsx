"use client";
import { motion } from "framer-motion";

const items = [
  "AI WORKFLOWS", "CUSTOM SOFTWARE", "PROCESS AUTOMATION", "DATA PRIVACY",
  "DOCUMENT EXTRACTION", "INTELLIGENT WEBSITES", "LOCAL AI", "LEAD FUNNELS",
  "AI WORKFLOWS", "CUSTOM SOFTWARE", "PROCESS AUTOMATION", "DATA PRIVACY",
  "DOCUMENT EXTRACTION", "INTELLIGENT WEBSITES", "LOCAL AI", "LEAD FUNNELS",
];

export default function Ticker() {
  return (
    <div className="bg-[var(--dark)] py-4 overflow-hidden relative z-10">
      <div className="flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex gap-0 whitespace-nowrap will-change-transform"
        >
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 pr-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <span className="text-[var(--cream)]/40 text-xs font-semibold tracking-[3px]">{item}</span>
              <span className="text-[var(--green3)] text-sm">◆</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
