"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600,
        padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none",
        background: "#3a8a62", color: "#f5f4ef", cursor: "pointer",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print / Save as PDF
    </button>
  );
}
