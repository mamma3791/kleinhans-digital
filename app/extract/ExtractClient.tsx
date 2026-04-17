"use client";

import { useState, useRef } from "react";

type CargoItem = {
  description: string | null;
  quantity: string | null;
  weight_kg: string | null;
  dimensions: string | null;
};

type Extraction = {
  document_type: string | null;
  reference_numbers: string[];
  date: string | null;
  shipper: { name: string | null; address: string | null; contact: string | null };
  consignee: { name: string | null; address: string | null; contact: string | null };
  origin: string | null;
  destination: string | null;
  cargo: CargoItem[];
  total_weight_kg: string | null;
  total_packages: string | null;
  service_type: string | null;
  special_instructions: string | null;
  declared_value: string | null;
  currency: string | null;
  additional_fields: Record<string, unknown>;
  parse_error?: boolean;
  raw_response?: string;
};

export default function ExtractClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Extraction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0d", color: "#f5f4ef" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#3a8a62" strokeWidth="1.5" />
              <path d="M7 8h10M7 12h6M7 16h8" stroke="#3a8a62" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", margin: 0 }}>
              Document Extraction
            </h1>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", margin: 0 }}>
            Upload a logistics document — waybill, POD, shipping label, freight quote — and AI extracts every field.
          </p>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.25)", marginTop: "0.375rem" }}>
            Powered by Llama 4 Scout — same model deploys on-premise for data privacy
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Left — Upload */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(58,138,98,0.6)"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245,244,239,0.1)"; }}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(245,244,239,0.1)"; handleFile(e.dataTransfer.files[0]); }}
              onClick={() => inputRef.current?.click()}
              style={{
                border: "2px dashed rgba(245,244,239,0.1)",
                borderRadius: "1rem",
                padding: preview ? "0" : "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.15s",
                overflow: "hidden",
                background: "rgba(245,244,239,0.02)",
                minHeight: "16rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                style={{ display: "none" }}
              />
              {preview ? (
                <img src={preview} alt="Document preview" style={{ width: "100%", height: "auto", display: "block" }} />
              ) : (
                <div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 1rem" }}>
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="rgba(245,244,239,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke="rgba(245,244,239,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.5)", marginBottom: "0.375rem" }}>
                    Drop a document here or click to upload
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.25)" }}>
                    JPG, PNG, or PDF
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                onClick={handleExtract}
                disabled={!file || loading}
                style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  padding: "0.875rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: file && !loading ? "#3a8a62" : "rgba(58,138,98,0.2)",
                  color: file && !loading ? "#fff" : "rgba(255,255,255,0.3)",
                  cursor: file && !loading ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                {loading ? "Extracting..." : "Extract data"}
              </button>
              {(file || result) && (
                <button
                  onClick={reset}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    padding: "0.875rem 1.25rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(245,244,239,0.1)",
                    background: "transparent",
                    color: "rgba(245,244,239,0.5)",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {elapsed != null && (
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", marginTop: "0.625rem", textAlign: "center" }}>
                Processed in {(elapsed / 1000).toFixed(1)}s
              </div>
            )}
          </div>

          {/* Right — Results */}
          <div>
            {error && (
              <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.75rem", padding: "1rem 1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f87171" }}>
                {error}
              </div>
            )}

            {loading && (
              <div style={{ background: "rgba(58,138,98,0.06)", border: "1px solid rgba(58,138,98,0.15)", borderRadius: "1rem", padding: "3rem 2rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.5)", marginBottom: "0.375rem" }}>
                  Analysing document...
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.25)" }}>
                  Llama 4 Scout is reading every field
                </div>
              </div>
            )}

            {result && !result.parse_error && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Document type badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
                    padding: "0.3rem 0.75rem", borderRadius: "9999px",
                    background: "rgba(58,138,98,0.15)", color: "#5dbf88",
                    letterSpacing: "0.5px", textTransform: "uppercase",
                  }}>
                    {result.document_type ?? "document"}
                  </span>
                  {result.date && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)" }}>
                      {result.date}
                    </span>
                  )}
                </div>

                {/* Reference numbers */}
                {result.reference_numbers?.length > 0 && (
                  <FieldCard label="Reference Numbers" value={result.reference_numbers.join(", ")} />
                )}

                {/* Route */}
                {(result.origin || result.destination) && (
                  <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.625rem" }}>Route</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontFamily: "var(--font-sans)", fontSize: "0.9rem" }}>
                      <span style={{ color: "#f5f4ef" }}>{result.origin ?? "—"}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-4-4l4 4-4 4" stroke="#3a8a62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span style={{ color: "#f5f4ef" }}>{result.destination ?? "—"}</span>
                    </div>
                  </div>
                )}

                {/* Shipper */}
                {result.shipper?.name && (
                  <PartyCard label="Shipper" party={result.shipper} />
                )}

                {/* Consignee */}
                {result.consignee?.name && (
                  <PartyCard label="Consignee" party={result.consignee} />
                )}

                {/* Cargo */}
                {result.cargo?.length > 0 && result.cargo.some(c => c.description) && (
                  <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.625rem" }}>Cargo</div>
                    {result.cargo.map((c, i) => (
                      <div key={i} style={{ marginBottom: i < result.cargo.length - 1 ? "0.5rem" : 0, fontFamily: "var(--font-sans)", fontSize: "0.85rem" }}>
                        <div style={{ color: "#f5f4ef" }}>{c.description}</div>
                        <div style={{ fontSize: "0.78rem", color: "rgba(245,244,239,0.4)", display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                          {c.quantity && <span>Qty: {c.quantity}</span>}
                          {c.weight_kg && <span>Weight: {c.weight_kg} kg</span>}
                          {c.dimensions && <span>Dims: {c.dimensions}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary row */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {result.total_packages && <MiniCard label="Packages" value={result.total_packages} />}
                  {result.total_weight_kg && <MiniCard label="Total Weight" value={`${result.total_weight_kg} kg`} />}
                  {result.service_type && <MiniCard label="Service" value={result.service_type} />}
                  {result.declared_value && <MiniCard label="Value" value={`${result.currency ?? ""} ${result.declared_value}`} />}
                </div>

                {/* Special instructions */}
                {result.special_instructions && (
                  <FieldCard label="Special Instructions" value={result.special_instructions} />
                )}

                {/* Raw JSON toggle */}
                <details style={{ marginTop: "0.5rem" }}>
                  <summary style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", cursor: "pointer" }}>
                    View raw JSON
                  </summary>
                  <pre style={{
                    background: "rgba(245,244,239,0.03)",
                    border: "1px solid rgba(245,244,239,0.08)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    marginTop: "0.5rem",
                    fontSize: "0.72rem",
                    color: "rgba(245,244,239,0.5)",
                    overflow: "auto",
                    maxHeight: "20rem",
                    fontFamily: "monospace",
                  }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {result?.parse_error && (
              <div style={{ background: "rgba(232,161,0,0.08)", border: "1px solid rgba(232,161,0,0.2)", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#e8a100", marginBottom: "0.5rem" }}>
                  Model returned non-standard format — raw response:
                </div>
                <pre style={{ fontSize: "0.75rem", color: "rgba(245,244,239,0.5)", whiteSpace: "pre-wrap", margin: 0 }}>
                  {result.raw_response}
                </pre>
              </div>
            )}

            {!result && !loading && !error && (
              <div style={{ background: "rgba(245,244,239,0.02)", border: "1px solid rgba(245,244,239,0.06)", borderRadius: "1rem", padding: "3rem 2rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "rgba(245,244,239,0.25)" }}>
                  Upload a document to see extracted data here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.375rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f5f4ef" }}>{value}</div>
    </div>
  );
}

function PartyCard({ label, party }: { label: string; party: { name: string | null; address: string | null; contact: string | null } }) {
  return (
    <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.375rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f5f4ef" }}>{party.name}</div>
      {party.address && <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.45)", marginTop: "0.2rem" }}>{party.address}</div>}
      {party.contact && <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.45)", marginTop: "0.15rem" }}>{party.contact}</div>}
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, minWidth: "7rem", background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.25rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "#f5f4ef" }}>{value}</div>
    </div>
  );
}
