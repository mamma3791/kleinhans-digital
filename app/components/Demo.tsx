"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

type Extraction = {
  document_type?: string;
  reference_numbers?: string[];
  origin?: string;
  destination?: string;
  shipper?: { name?: string; address?: string };
  consignee?: { name?: string; address?: string };
  cargo?: { description?: string; quantity?: string; weight_kg?: string }[];
  total_weight_kg?: string;
  total_packages?: string;
  special_instructions?: string;
  [key: string]: unknown;
};

export default function Demo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Extraction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    setElapsed(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function handleExtract() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const start = Date.now();
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      setElapsed(Date.now() - start);
      if (!res.ok) {
        setError(data.error || "Extraction failed");
      } else {
        setResult(data.extracted);
      }
    } catch (err) {
      setElapsed(Date.now() - start);
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setElapsed(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const fields = result
    ? Object.entries(result).filter(
        ([k, v]) =>
          v != null &&
          v !== "" &&
          k !== "additional_fields" &&
          k !== "parse_error" &&
          k !== "raw_response" &&
          k !== "currency"
      )
    : [];

  return (
    <section id="demo" ref={ref} style={{ padding: "6rem 0", background: "var(--dark)", borderTop: "1px solid rgba(245,244,239,0.07)" }}>
      <style>{`
        .kd-demo-drop {
          border: 2px dashed rgba(93,191,136,0.2);
          border-radius: 1rem;
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
          min-height: 14rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(245,244,239,0.02);
        }
        .kd-demo-drop:hover, .kd-demo-drop.dragover {
          border-color: rgba(93,191,136,0.5);
          background: rgba(93,191,136,0.04);
        }
        .kd-demo-btn {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.875rem 2rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .kd-demo-btn:hover:not(:disabled) { transform: scale(1.02); }
        .kd-demo-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .kd-demo-field {
          padding: 0.625rem 0;
          border-bottom: 1px solid rgba(245,244,239,0.06);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }
        .kd-demo-field:last-child { border-bottom: none; }
        @media (max-width: 767px) {
          .kd-demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="kd-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1rem" }}
          >
            Live Demo
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--cream)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}
          >
            See it in action.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.7, color: "rgba(245,244,239,0.4)", maxWidth: "34rem", margin: "0 auto" }}
          >
            Upload any logistics document, invoice, or business paperwork. Our AI extracts every field in seconds. Try it right now.
          </motion.p>
        </div>

        {/* Demo area */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "1.5rem", padding: "2rem", maxWidth: "56rem", margin: "0 auto" }}
        >
          <div className="kd-demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Left: upload */}
            <div>
              <div
                className="kd-demo-drop"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove("dragover"); }}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => inputRef.current?.click()}
                style={preview ? { padding: 0 } : { padding: "2rem" }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  style={{ display: "none" }}
                />
                {preview ? (
                  <img src={preview} alt="Document preview" style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.75rem" }} />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 1rem" }}>
                      <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="rgba(93,191,136,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke="rgba(93,191,136,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.5)", marginBottom: "0.375rem" }}>
                      Drop a document here or click to upload
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.2)" }}>
                      Waybill, invoice, quote, POD, or any business document
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  className="kd-demo-btn"
                  onClick={handleExtract}
                  disabled={!file || loading}
                  style={{ flex: 1, background: file && !loading ? "var(--green)" : "rgba(58,138,98,0.2)", color: file && !loading ? "#fff" : "rgba(255,255,255,0.3)" }}
                >
                  {loading ? "Extracting..." : "Extract data"}
                </button>
                {(file || result) && (
                  <button
                    className="kd-demo-btn"
                    onClick={reset}
                    style={{ background: "transparent", border: "1px solid rgba(245,244,239,0.1)", color: "rgba(245,244,239,0.5)" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {elapsed != null && (
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(93,191,136,0.6)", marginTop: "0.625rem", textAlign: "center" }}>
                  Processed in {(elapsed / 1000).toFixed(1)}s
                </div>
              )}
            </div>

            {/* Right: results */}
            <div>
              {error && (
                <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.75rem", padding: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#f87171" }}>
                  {error}
                </div>
              )}

              {loading && (
                <div style={{ background: "rgba(58,138,98,0.06)", border: "1px solid rgba(58,138,98,0.15)", borderRadius: "1rem", padding: "3rem 2rem", textAlign: "center" }}>
                  <div style={{ width: "2rem", height: "2rem", border: "2px solid rgba(93,191,136,0.2)", borderTopColor: "var(--green3)", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 0.8s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.5)" }}>
                    AI is reading your document...
                  </div>
                </div>
              )}

              {result && fields.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#5dbf88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "#5dbf88" }}>
                      {fields.length} fields extracted
                    </span>
                  </div>

                  <div style={{ background: "rgba(245,244,239,0.02)", border: "1px solid rgba(245,244,239,0.06)", borderRadius: "0.75rem", padding: "0.5rem 1rem", maxHeight: "22rem", overflowY: "auto" }}>
                    {fields.map(([key, value]) => (
                      <div key={key} className="kd-demo-field">
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", flexShrink: 0, paddingTop: "0.1rem" }}>
                          {key.replace(/_/g, " ")}
                        </span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#f5f4ef", textAlign: "right", wordBreak: "break-word" }}>
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(58,138,98,0.06)", border: "1px solid rgba(58,138,98,0.12)", borderRadius: "0.625rem" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", margin: 0, lineHeight: 1.6 }}>
                      This runs on Llama 4 Scout, the same open-source model we deploy on your premises. Your production data never leaves your building.
                    </p>
                  </div>
                </div>
              )}

              {!result && !loading && !error && (
                <div style={{ background: "rgba(245,244,239,0.02)", border: "1px solid rgba(245,244,239,0.06)", borderRadius: "1rem", padding: "3rem 2rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "14rem" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "1rem" }}>
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(245,244,239,0.12)" strokeWidth="1.5" />
                    <path d="M7 8h10M7 12h6M7 16h8" stroke="rgba(245,244,239,0.12)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "rgba(245,244,239,0.2)" }}>
                    Extracted data will appear here
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}
        >
          {[
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Data encrypted in transit" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "POPIA compliant" },
            { icon: "M5 12h14M12 5l7 7-7 7", label: "Same model runs on your premises" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d={item.icon} stroke="rgba(93,191,136,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function formatValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (typeof value[0] === "string") return value.join(", ");
    return value
      .map((item) => {
        if (typeof item === "object" && item != null) {
          return Object.values(item).filter(Boolean).join(" / ");
        }
        return String(item);
      })
      .join("; ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v != null && v !== "")
      .map(([, v]) => String(v))
      .join(", ");
  }
  return String(value);
}
