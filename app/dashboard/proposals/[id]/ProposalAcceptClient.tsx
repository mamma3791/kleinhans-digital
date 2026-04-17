"use client";
import { useState } from "react";

type LineItem = { id?: string; description: string; amount: string; type: "once_off" | "monthly" };

type Props = {
  proposalId: string;
  prefillBusinessName?: string | null;
};

export default function ProposalAcceptClient({ proposalId, prefillBusinessName }: Props) {
  const [bizName, setBizName]         = useState(prefillBusinessName ?? "");
  const [regNumber, setRegNumber]     = useState("");
  const [vatNumber, setVatNumber]     = useState("");
  const [address, setAddress]         = useState("");
  const [poNumber, setPoNumber]       = useState("");
  const [contactName, setContactName] = useState("");
  const [sigName, setSigName]         = useState("");
  const [agreed, setAgreed]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [done, setDone]               = useState(false);

  const handleSubmit = async () => {
    if (!sigName.trim() || !agreed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/proposals/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId,
          clientBusinessName: bizName,
          clientRegNumber: regNumber,
          clientVatNumber: vatNumber,
          clientAddress: address,
          clientPoNumber: poNumber,
          clientContactName: contactName,
          clientSignatureName: sigName,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong. Please try again."); }
      else { setDone(true); }
    } catch { setError("Network error. Please check your connection and try again."); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div style={{
        background: "rgba(58,138,98,0.08)", border: "1px solid rgba(93,191,136,0.25)",
        borderRadius: "1rem", padding: "2.5rem 2rem", textAlign: "center", margin: "2rem 0",
      }}>
        <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "#3a8a62", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" stroke="white"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "#f5f4ef", margin: "0 0 0.75rem" }}>
          Proposal accepted
        </h3>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.55)", lineHeight: 1.7, margin: "0 0 1.5rem", maxWidth: "28rem", marginLeft: "auto", marginRight: "auto" }}>
          Thank you — your acceptance has been recorded. We&apos;ll be in touch shortly to get your project underway.
          You&apos;ll receive an invoice once we&apos;ve confirmed your details.
        </p>
        <a href="/dashboard/messages" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600,
          padding: "0.65rem 1.25rem", borderRadius: "0.5rem",
          background: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.7)",
          border: "1px solid rgba(245,244,239,0.1)", textDecoration: "none",
        }}>
          Go to messages
        </a>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(245,244,239,0.05)", border: "1px solid rgba(245,244,239,0.12)",
    borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "#f5f4ef",
    fontFamily: "var(--font-sans)", fontSize: "0.875rem", boxSizing: "border-box", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600,
    color: "rgba(245,244,239,0.5)", display: "block", marginBottom: "0.5rem",
  };

  return (
    <div style={{ marginTop: "2.5rem" }}>
      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(245,244,239,0.08)", marginBottom: "2.5rem" }} />

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "#f5f4ef", margin: "0 0 0.5rem" }}>
        Your details
      </h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", margin: "0 0 1.75rem", lineHeight: 1.6 }}>
        These details will appear on your invoice. Fill in what applies — all fields except your signature are optional.
        If you need an official PO number added, enter it below.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={labelStyle}>Business / trading name</label>
          <input style={inputStyle} value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Acme (Pty) Ltd" />
        </div>
        <div>
          <label style={labelStyle}>Registration number</label>
          <input style={inputStyle} value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="2024/123456/07" />
        </div>
        <div>
          <label style={labelStyle}>VAT number (if applicable)</label>
          <input style={inputStyle} value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="4123456789" />
        </div>
        <div>
          <label style={labelStyle}>PO number (if required by your organisation)</label>
          <input style={inputStyle} value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="PO-12345" />
        </div>
        <div>
          <label style={labelStyle}>Contact name (for this project)</label>
          <input style={inputStyle} value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jane Smith" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Physical address (for invoice)</label>
          <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Road, Cape Town, 8001" />
        </div>
      </div>

      {/* T&Cs acceptance */}
      <div style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
          <div style={{ position: "relative", flexShrink: 0, marginTop: "0.1rem" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer", margin: 0 }}
            />
            <div style={{
              width: "1.25rem", height: "1.25rem", borderRadius: "0.25rem",
              background: agreed ? "#3a8a62" : "transparent",
              border: `2px solid ${agreed ? "#3a8a62" : "rgba(245,244,239,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s",
            }}>
              {agreed && (
                <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.65)", lineHeight: 1.6 }}>
            I confirm that I have read and agree to the Terms and Conditions set out in this proposal, and I accept this proposal on behalf of my organisation.
          </span>
        </label>
      </div>

      {/* Digital signature */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ ...labelStyle, color: "rgba(245,244,239,0.7)" }}>
          Digital signature — type your full name to sign *
        </label>
        <input
          style={{
            ...inputStyle,
            borderColor: sigName.trim() ? "rgba(93,191,136,0.4)" : "rgba(245,244,239,0.12)",
            fontStyle: sigName.trim() ? "italic" : "normal",
            fontSize: "1rem",
          }}
          value={sigName}
          onChange={e => setSigName(e.target.value)}
          placeholder="e.g. Jane Smith"
        />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", marginTop: "0.5rem" }}>
          By typing your name you agree that this constitutes your electronic signature and is legally binding under the Electronic Communications and Transactions Act 25 of 2002.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.5rem", padding: "0.875rem 1rem", marginBottom: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f87171" }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !sigName.trim() || !agreed}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600,
          padding: "0.875rem 1.75rem", borderRadius: "0.625rem", border: "none",
          background: !sigName.trim() || !agreed ? "rgba(58,138,98,0.3)" : "#3a8a62",
          color: "#f5f4ef", cursor: !sigName.trim() || !agreed ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1, transition: "background 0.15s",
        }}
      >
        {loading ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Accept proposal
          </>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
