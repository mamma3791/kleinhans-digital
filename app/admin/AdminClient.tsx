"use client";
import { useState } from "react";

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth:  "Growth",
  pro:     "Pro",
};

const ADDON_LABELS: Record<string, string> = {
  extra_pages:   "Extra pages",
  ecommerce:     "E-commerce",
  lead_funnel:   "Lead funnel",
  seo_reporting: "SEO reporting",
  branding:      "Branding",
  whatsapp_bot:  "WhatsApp bot",
  google_ads:    "Google Ads",
  photography:   "Photography",
  multilocation: "Multi-location",
  copywriting:   "Copywriting",
  maintenance:   "Maintenance",
};

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  submitted:     { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.5)",  label: "Submitted" },
  reviewing:     { bg: "rgba(232,161,0,0.12)",   color: "#e8a100",               label: "Reviewing" },
  proposal_sent: { bg: "rgba(99,130,245,0.14)",  color: "#99b3ff",               label: "Proposal sent" },
  approved:      { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "Approved" },
  in_progress:   { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "In progress" },
  completed:     { bg: "rgba(93,191,136,0.1)",   color: "rgba(93,191,136,0.55)", label: "Completed" },
  declined:      { bg: "rgba(220,60,60,0.14)",   color: "#f87171",               label: "Declined" },
};

type Quote = {
  id: string;
  user_id: string;
  tier: string;
  addons: string[];
  base_price: number | null;
  monthly_price: number | null;
  is_consultative: boolean;
  message: string | null;
  status: string;
  admin_notes: string | null;
  submitted_at: string;
  profiles: { full_name: string | null; business_name: string | null; phone: string | null } | null;
  user_email: string;
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.submitted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600,
      padding: "0.3rem 0.75rem", borderRadius: "9999px", letterSpacing: "0.01em",
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function AdminClient({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState<{ quote: Quote } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const updateStatus = async (quoteId: string, newStatus: string) => {
    setLoading(quoteId);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, action: "update_status", newStatus }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to update status");
      } else {
        setQuotes(qs => qs.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  };

  const openApproveModal = (quote: Quote) => {
    const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
    const clientName = quote.profiles?.business_name || quote.profiles?.full_name || quote.user_email;
    setProjectName(`${clientName} — ${tierLabel} Package`);
    setAdminNotes("");
    setApproveModal({ quote });
  };

  const confirmApprove = async () => {
    if (!approveModal) return;
    setLoading(approveModal.quote.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: approveModal.quote.id,
          action: "approve",
          projectName,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to approve");
      } else {
        setQuotes(qs => qs.map(q => q.id === approveModal.quote.id ? { ...q, status: "in_progress" } : q));
        setApproveModal(null);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>{`
        .adm-page { padding: 2.25rem 2rem 4rem; max-width: 70rem; margin: 0 auto; }
        .adm-title { font-family: var(--font-serif); font-size: clamp(1.5rem, 2.5vw, 2rem); color: var(--cream); margin-bottom: 0.375rem; }
        .adm-sub   { font-family: var(--font-sans); font-size: 0.875rem; color: rgba(245,244,239,0.4); margin-bottom: 2rem; }
        .adm-card  { background: rgba(245,244,239,0.04); border: 1px solid rgba(245,244,239,0.08); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; }
        .adm-label { font-family: var(--font-sans); font-size: 0.65rem; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(245,244,239,0.3); margin-bottom: 0.3rem; }
        .adm-val   { font-family: var(--font-sans); font-size: 0.9375rem; font-weight: 500; color: var(--cream); }
        .adm-btn   { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.15s, color 0.15s; }
        .adm-btn-green  { background: var(--green); color: var(--cream); }
        .adm-btn-green:hover { background: var(--green2); }
        .adm-btn-ghost  { background: rgba(245,244,239,0.07); color: rgba(245,244,239,0.6); border: 1px solid rgba(245,244,239,0.1); }
        .adm-btn-ghost:hover { background: rgba(245,244,239,0.11); color: var(--cream); }
        .adm-btn-danger { background: rgba(220,60,60,0.12); color: #f87171; border: 1px solid rgba(220,60,60,0.2); }
        .adm-btn-danger:hover { background: rgba(220,60,60,0.2); }
        .adm-modal-bg { position: fixed; inset: 0; background: rgba(10,20,15,0.85); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .adm-modal { background: #0f1c15; border: 1px solid rgba(245,244,239,0.1); border-radius: 1rem; padding: 2rem; width: 100%; max-width: 30rem; }
        .adm-input { width: 100%; background: rgba(245,244,239,0.05); border: 1px solid rgba(245,244,239,0.12); border-radius: 0.5rem; padding: 0.75rem 1rem; color: var(--cream); font-family: var(--font-sans); font-size: 0.875rem; box-sizing: border-box; outline: none; }
        .adm-input:focus { border-color: var(--green3); }
        @media (max-width: 767px) { .adm-page { padding: 1.5rem 1.125rem 3rem; } }
      `}</style>

      <div className="adm-page">
        <h1 className="adm-title">Admin</h1>
        <p className="adm-sub">All quote submissions across all clients.</p>

        {error && (
          <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f87171" }}>
            {error}
          </div>
        )}

        {quotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.3)" }}>
            No quotes yet.
          </div>
        ) : (
          quotes.map(quote => {
            const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
            const addonList = (quote.addons ?? []).map(a => ADDON_LABELS[a] ?? a);
            const clientName = quote.profiles?.business_name || quote.profiles?.full_name || "—";
            const isLoading = loading === quote.id;

            return (
              <div key={quote.id} className="adm-card">
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.25)", marginBottom: "0.25rem" }}>
                      {new Date(quote.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}
                      {new Date(quote.submitted_at).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "var(--cream)" }}>
                      {clientName}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", marginTop: "0.2rem" }}>
                      {quote.user_email} {quote.profiles?.phone ? `· ${quote.profiles.phone}` : ""}
                    </div>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>

                {/* Details grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div>
                    <div className="adm-label">Package</div>
                    <div className="adm-val">{tierLabel}</div>
                  </div>
                  {!quote.is_consultative && quote.base_price != null && (
                    <div>
                      <div className="adm-label">Once-off</div>
                      <div className="adm-val">R{Number(quote.base_price).toLocaleString("en-ZA")}</div>
                    </div>
                  )}
                  {!quote.is_consultative && quote.monthly_price != null && Number(quote.monthly_price) > 0 && (
                    <div>
                      <div className="adm-label">Monthly</div>
                      <div className="adm-val">R{Number(quote.monthly_price).toLocaleString("en-ZA")}/mo</div>
                    </div>
                  )}
                  {quote.is_consultative && (
                    <div>
                      <div className="adm-label">Pricing</div>
                      <div className="adm-val">Consultative</div>
                    </div>
                  )}
                </div>

                {addonList.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div className="adm-label" style={{ marginBottom: "0.375rem" }}>Add-ons</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {addonList.map(label => (
                        <span key={label} style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.5)", background: "rgba(245,244,239,0.05)", border: "1px solid rgba(245,244,239,0.09)", borderRadius: "0.375rem", padding: "0.2rem 0.5rem" }}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {quote.message && (
                  <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.06)", borderRadius: "0.5rem", padding: "0.75rem 0.875rem", marginBottom: "1.25rem" }}>
                    <div className="adm-label" style={{ marginBottom: "0.25rem" }}>Client note</div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.5)", lineHeight: 1.6, margin: 0 }}>
                      {quote.message}
                    </p>
                  </div>
                )}

                {quote.admin_notes && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div className="adm-label" style={{ marginBottom: "0.25rem" }}>Admin notes</div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                      {quote.admin_notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(245,244,239,0.06)" }}>
                  {quote.status === "submitted" && (
                    <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => updateStatus(quote.id, "reviewing")}>
                      {isLoading ? "…" : "Mark reviewing"}
                    </button>
                  )}
                  {(quote.status === "submitted" || quote.status === "reviewing") && (
                    <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => updateStatus(quote.id, "proposal_sent")}>
                      {isLoading ? "…" : "Mark proposal sent"}
                    </button>
                  )}
                  {quote.status !== "in_progress" && quote.status !== "completed" && quote.status !== "declined" && (
                    <button className="adm-btn adm-btn-green" disabled={isLoading} onClick={() => openApproveModal(quote)}>
                      {isLoading ? "Creating…" : "Approve & start project"}
                    </button>
                  )}
                  {quote.status !== "declined" && quote.status !== "completed" && (
                    <button className="adm-btn adm-btn-danger" disabled={isLoading} onClick={() => updateStatus(quote.id, "declined")}>
                      {isLoading ? "…" : "Decline"}
                    </button>
                  )}
                  {quote.status === "in_progress" && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.3)", alignSelf: "center" }}>
                      Project created — manage in dashboard
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Approve modal */}
      {approveModal && (
        <div className="adm-modal-bg" onClick={() => setApproveModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "var(--cream)", marginBottom: "0.375rem" }}>
              Approve & create project
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", marginBottom: "1.5rem" }}>
              This will create a new project in the client&apos;s dashboard and mark the quote as in progress.
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "rgba(245,244,239,0.5)", display: "block", marginBottom: "0.5rem" }}>
                Project name
              </label>
              <input
                className="adm-input"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Acme — Growth Package"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "rgba(245,244,239,0.5)", display: "block", marginBottom: "0.5rem" }}>
                Admin notes (optional — shown to client as project description)
              </label>
              <textarea
                className="adm-input"
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Starting with homepage and about page. Discovery call on Thursday."
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="adm-btn adm-btn-ghost" onClick={() => setApproveModal(null)}>
                Cancel
              </button>
              <button className="adm-btn adm-btn-green" onClick={confirmApprove} disabled={!projectName.trim()}>
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
