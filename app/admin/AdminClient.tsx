"use client";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  starter: "Starter", growth: "Growth", pro: "Pro",
};

const ADDON_LABELS: Record<string, string> = {
  extra_pages: "Extra pages", ecommerce: "E-commerce", lead_funnel: "Lead funnel",
  seo_reporting: "SEO reporting", branding: "Branding", whatsapp_bot: "WhatsApp bot",
  google_ads: "Google Ads", photography: "Photography", multilocation: "Multi-location",
  copywriting: "Copywriting", maintenance: "Maintenance",
};

const QUOTE_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  submitted:     { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.5)",  label: "Submitted" },
  reviewing:     { bg: "rgba(232,161,0,0.12)",   color: "#e8a100",               label: "Reviewing" },
  proposal_sent: { bg: "rgba(99,130,245,0.14)",  color: "#99b3ff",               label: "Proposal sent" },
  approved:      { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "Approved" },
  in_progress:   { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "In progress" },
  completed:     { bg: "rgba(93,191,136,0.1)",   color: "rgba(93,191,136,0.55)", label: "Completed" },
  declined:      { bg: "rgba(220,60,60,0.14)",   color: "#f87171",               label: "Declined" },
};

const INVOICE_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  draft:   { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: "Draft" },
  sent:    { bg: "rgba(232,161,0,0.12)",   color: "#e8a100",               label: "Sent" },
  paid:    { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "Paid" },
  overdue: { bg: "rgba(220,60,60,0.14)",   color: "#f87171",               label: "Overdue" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Quote = {
  id: string; user_id: string; tier: string; addons: string[];
  base_price: number | null; monthly_price: number | null;
  is_consultative: boolean; message: string | null; status: string;
  admin_notes: string | null; submitted_at: string;
  profiles: { full_name: string | null; business_name: string | null; phone: string | null } | null;
  user_email: string;
};

type Client = {
  user_id: string; full_name: string | null; business_name: string | null;
  phone: string | null; user_email: string;
  invoice_count: number; project_count: number;
};

type Invoice = {
  id: string; user_id: string; invoice_number: string;
  description: string; amount: number; status: string;
  due_date: string | null; created_at: string;
  po_number?: string | null;
};

type Props = {
  initialQuotes: Quote[];
  clients: Client[];
  invoices: Invoice[];
  nextInvoiceNumber: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ status, map }: { status: string; map: Record<string, { bg: string; color: string; label: string }> }) {
  const s = map[status] ?? { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", fontFamily: "var(--font-sans)",
      fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.75rem",
      borderRadius: "9999px", letterSpacing: "0.01em", background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminClient({ initialQuotes, clients, invoices, nextInvoiceNumber }: Props) {
  const [tab, setTab] = useState<"quotes" | "clients" | "invoices">("quotes");
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>(invoices);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quote approve modal
  const [approveModal, setApproveModal] = useState<{ quote: Quote } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [approveNotes, setApproveNotes] = useState("");

  // Invoice modal
  const [invoiceModal, setInvoiceModal] = useState<{ client: Client } | null>(null);
  const [invNumber, setInvNumber] = useState(nextInvoiceNumber);
  const [invDescription, setInvDescription] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invPoNumber, setInvPoNumber] = useState("");
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [invLoading, setInvLoading] = useState(false);
  const [invSuccess, setInvSuccess] = useState(false);

  // ── Quote actions ──────────────────────────────────────────────────────────

  const updateStatus = async (quoteId: string, newStatus: string) => {
    setLoading(quoteId);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, action: "update_status", newStatus }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); }
      else setQuotes(qs => qs.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
    } catch { setError("Network error"); }
    finally { setLoading(null); }
  };

  const openApproveModal = (quote: Quote) => {
    const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
    const name = quote.profiles?.business_name || quote.profiles?.full_name || quote.user_email;
    setProjectName(`${name} — ${tierLabel} Package`);
    setApproveNotes("");
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
        body: JSON.stringify({ quoteId: approveModal.quote.id, action: "approve", projectName, adminNotes: approveNotes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to approve"); }
      else {
        setQuotes(qs => qs.map(q => q.id === approveModal.quote.id ? { ...q, status: "in_progress" } : q));
        setApproveModal(null);
      }
    } catch { setError("Network error"); }
    finally { setLoading(null); }
  };

  // ── Invoice actions ────────────────────────────────────────────────────────

  const openInvoiceModal = (client: Client) => {
    setInvoiceModal({ client });
    setInvDescription("");
    setInvAmount("");
    setInvPoNumber("");
    setInvSuccess(false);
    // Recalculate next number based on current invoice list
    const year = new Date().getFullYear();
    const count = allInvoices.filter(i => i.invoice_number?.startsWith(`INV-${year}-`)).length;
    setInvNumber(`INV-${year}-${(count + 1).toString().padStart(3, "0")}`);
    const d = new Date(); d.setDate(d.getDate() + 7);
    setInvDueDate(d.toISOString().split("T")[0]);
  };

  const quickFill = (type: "deposit" | "balance" | "retainer") => {
    if (!invoiceModal) return;
    const client = invoiceModal.client;
    const name = client.business_name || client.full_name || client.user_email;
    if (type === "deposit")  setInvDescription(`20% deposit — ${name}`);
    if (type === "balance")  setInvDescription(`Balance due on completion — ${name}`);
    if (type === "retainer") setInvDescription(`Monthly retainer — ${name}`);
  };

  const submitInvoice = async () => {
    if (!invoiceModal || !invDescription.trim() || !invAmount || !invDueDate) return;
    setInvLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: invoiceModal.client.user_id,
          invoiceNumber: invNumber,
          description: invDescription,
          amount: invAmount,
          dueDate: invDueDate,
          ...(invPoNumber.trim() ? { poNumber: invPoNumber.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create invoice"); }
      else {
        // Add to local state so the invoices tab updates immediately
        setAllInvoices(prev => [{
          id: data.invoice.id,
          user_id: invoiceModal.client.user_id,
          invoice_number: invNumber,
          description: invDescription,
          amount: Number(invAmount),
          status: "sent",
          due_date: invDueDate,
          created_at: new Date().toISOString(),
          po_number: invPoNumber.trim() || null,
        }, ...prev]);
        setInvSuccess(true);
      }
    } catch { setError("Network error"); }
    finally { setInvLoading(false); }
  };

  const markPaid = async (invoiceId: string) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/update-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, status: "paid" }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to update"); }
      else setAllInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: "paid" } : i));
    } catch { setError("Network error"); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .adm-page  { padding: 2.25rem 2rem 4rem; max-width: 72rem; margin: 0 auto; }
        .adm-title { font-family: var(--font-serif); font-size: clamp(1.5rem, 2.5vw, 2rem); color: #f5f4ef; margin-bottom: 0.375rem; }
        .adm-sub   { font-family: var(--font-sans); font-size: 0.875rem; color: rgba(245,244,239,0.4); margin-bottom: 1.5rem; }
        .adm-card  { background: rgba(245,244,239,0.04); border: 1px solid rgba(245,244,239,0.08); border-radius: 1rem; padding: 1.5rem; margin-bottom: 0.875rem; }
        .adm-label { font-family: var(--font-sans); font-size: 0.65rem; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(245,244,239,0.3); margin-bottom: 0.3rem; }
        .adm-val   { font-family: var(--font-sans); font-size: 0.9375rem; font-weight: 500; color: #f5f4ef; }
        .adm-btn   { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.15s, color 0.15s; text-decoration: none; }
        .adm-btn:disabled { opacity: 0.5; cursor: default; }
        .adm-btn-green  { background: #3a8a62; color: #f5f4ef; }
        .adm-btn-green:hover:not(:disabled) { background: #2a6647; }
        .adm-btn-ghost  { background: rgba(245,244,239,0.07); color: rgba(245,244,239,0.6); border: 1px solid rgba(245,244,239,0.1); }
        .adm-btn-ghost:hover:not(:disabled) { background: rgba(245,244,239,0.11); color: #f5f4ef; }
        .adm-btn-blue   { background: rgba(99,130,245,0.15); color: #99b3ff; border: 1px solid rgba(99,130,245,0.2); }
        .adm-btn-blue:hover:not(:disabled) { background: rgba(99,130,245,0.25); }
        .adm-btn-danger { background: rgba(220,60,60,0.12); color: #f87171; border: 1px solid rgba(220,60,60,0.2); }
        .adm-btn-danger:hover:not(:disabled) { background: rgba(220,60,60,0.2); }
        .adm-modal-bg { position: fixed; inset: 0; background: rgba(5,12,8,0.9); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
        .adm-modal { background: #0f1c15; border: 1px solid rgba(245,244,239,0.1); border-radius: 1rem; padding: 2rem; width: 100%; max-width: 32rem; }
        .adm-input { width: 100%; background: rgba(245,244,239,0.05); border: 1px solid rgba(245,244,239,0.12); border-radius: 0.5rem; padding: 0.75rem 1rem; color: #f5f4ef; font-family: var(--font-sans); font-size: 0.875rem; box-sizing: border-box; outline: none; }
        .adm-input:focus { border-color: #5dbf88; }
        .adm-input-label { font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; color: rgba(245,244,239,0.5); display: block; margin-bottom: 0.5rem; }
        .adm-tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; background: rgba(245,244,239,0.04); border: 1px solid rgba(245,244,239,0.08); border-radius: 0.75rem; padding: 0.25rem; width: fit-content; }
        .adm-tab { font-family: var(--font-sans); font-size: 0.8125rem; font-weight: 600; padding: 0.5rem 1.125rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.15s, color 0.15s; background: transparent; color: rgba(245,244,239,0.4); }
        .adm-tab.active { background: rgba(245,244,239,0.09); color: #f5f4ef; }
        .adm-tab:hover:not(.active) { color: rgba(245,244,239,0.7); }
        .adm-empty { text-align: center; padding: 4rem 2rem; font-family: var(--font-sans); font-size: 0.9rem; color: rgba(245,244,239,0.3); }
        @media (max-width: 767px) { .adm-page { padding: 1.5rem 1rem 3rem; } }
      `}</style>

      <div className="adm-page">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="adm-title" style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              Admin
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", textDecoration: "none", padding: "0.3rem 0.6rem", borderRadius: "0.375rem", border: "1px solid rgba(245,244,239,0.08)", transition: "color 0.15s, border-color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#f5f4ef"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,244,239,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,239,0.3)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,244,239,0.08)"; }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View site
              </a>
            </h1>
            <p className="adm-sub" style={{ marginBottom: 0 }}>
              {quotes.length} quote{quotes.length !== 1 ? "s" : ""} · {clients.length} client{clients.length !== 1 ? "s" : ""} · {allInvoices.length} invoice{allInvoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          <button className={`adm-tab${tab === "quotes" ? " active" : ""}`} onClick={() => setTab("quotes")}>
            Quotes {quotes.length > 0 && `(${quotes.length})`}
          </button>
          <button className={`adm-tab${tab === "clients" ? " active" : ""}`} onClick={() => setTab("clients")}>
            Clients {clients.length > 0 && `(${clients.length})`}
          </button>
          <button className={`adm-tab${tab === "invoices" ? " active" : ""}`} onClick={() => setTab("invoices")}>
            Invoices {allInvoices.length > 0 && `(${allInvoices.length})`}
          </button>
        </div>

        {/* Error bar */}
        {error && (
          <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f87171" }}>
            {error} <button onClick={() => setError(null)} style={{ marginLeft: "0.75rem", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* ── QUOTES TAB ── */}
        {tab === "quotes" && (
          quotes.length === 0 ? (
            <div className="adm-empty">No quotes submitted yet.</div>
          ) : (
            quotes.map(quote => {
              const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
              const addonList = (quote.addons ?? []).map(a => ADDON_LABELS[a] ?? a);
              const clientName = quote.profiles?.business_name || quote.profiles?.full_name || "—";
              const isLoading = loading === quote.id;

              return (
                <div key={quote.id} className="adm-card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.25)", marginBottom: "0.25rem" }}>
                        {new Date(quote.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "#f5f4ef" }}>{clientName}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", marginTop: "0.2rem" }}>
                        {quote.user_email}{quote.profiles?.phone ? ` · ${quote.profiles.phone}` : ""}
                      </div>
                    </div>
                    <Badge status={quote.status} map={QUOTE_STATUS} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    <div><div className="adm-label">Package</div><div className="adm-val">{tierLabel}</div></div>
                    {!quote.is_consultative && quote.base_price != null && (
                      <div><div className="adm-label">Once-off</div><div className="adm-val">R{Number(quote.base_price).toLocaleString("en-ZA")}</div></div>
                    )}
                    {!quote.is_consultative && quote.monthly_price != null && Number(quote.monthly_price) > 0 && (
                      <div><div className="adm-label">Monthly</div><div className="adm-val">R{Number(quote.monthly_price).toLocaleString("en-ZA")}/mo</div></div>
                    )}
                    {quote.is_consultative && (
                      <div><div className="adm-label">Pricing</div><div className="adm-val">Consultative</div></div>
                    )}
                  </div>

                  {addonList.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div className="adm-label" style={{ marginBottom: "0.375rem" }}>Add-ons</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        {addonList.map(label => (
                          <span key={label} style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.5)", background: "rgba(245,244,239,0.05)", border: "1px solid rgba(245,244,239,0.09)", borderRadius: "0.375rem", padding: "0.2rem 0.5rem" }}>{label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {quote.message && (
                    <div style={{ background: "rgba(245,244,239,0.03)", border: "1px solid rgba(245,244,239,0.06)", borderRadius: "0.5rem", padding: "0.75rem 0.875rem", marginBottom: "1.25rem" }}>
                      <div className="adm-label" style={{ marginBottom: "0.25rem" }}>Client note</div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.5)", lineHeight: 1.6, margin: 0 }}>{quote.message}</p>
                    </div>
                  )}

                  {quote.admin_notes && (
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div className="adm-label" style={{ marginBottom: "0.25rem" }}>Admin notes</div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>{quote.admin_notes}</p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(245,244,239,0.06)" }}>
                    {quote.status === "submitted" && (
                      <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => updateStatus(quote.id, "reviewing")}>{isLoading ? "…" : "Mark reviewing"}</button>
                    )}
                    {(quote.status === "submitted" || quote.status === "reviewing") && (
                      <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => updateStatus(quote.id, "proposal_sent")}>{isLoading ? "…" : "Mark proposal sent"}</button>
                    )}
                    {quote.status !== "in_progress" && quote.status !== "completed" && quote.status !== "declined" && (
                      <button className="adm-btn adm-btn-green" disabled={isLoading} onClick={() => openApproveModal(quote)}>{isLoading ? "Creating…" : "Approve & start project"}</button>
                    )}
                    {/* Quick invoice from quote */}
                    {(quote.status === "in_progress" || quote.status === "approved") && (() => {
                      const c = clients.find(cl => cl.user_id === quote.user_id);
                      return c ? (
                        <button className="adm-btn adm-btn-blue" onClick={() => openInvoiceModal(c)}>Create invoice</button>
                      ) : null;
                    })()}
                    {quote.status !== "declined" && quote.status !== "completed" && (
                      <button className="adm-btn adm-btn-danger" disabled={isLoading} onClick={() => updateStatus(quote.id, "declined")}>{isLoading ? "…" : "Decline"}</button>
                    )}
                    {quote.status === "in_progress" && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", alignSelf: "center" }}>Project created</span>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* ── CLIENTS TAB ── */}
        {tab === "clients" && (
          clients.length === 0 ? (
            <div className="adm-empty">No clients yet. Clients appear here after they sign up and complete onboarding.</div>
          ) : (
            clients.map(client => {
              const displayName = client.business_name || client.full_name || client.user_email;
              const clientInvoices = allInvoices.filter(i => i.user_id === client.user_id);
              const outstanding = clientInvoices
                .filter(i => i.status === "sent" || i.status === "overdue")
                .reduce((s, i) => s + Number(i.amount), 0);

              return (
                <div key={client.user_id} className="adm-card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "#f5f4ef", marginBottom: "0.25rem" }}>{displayName}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)" }}>
                        {client.user_email}
                        {client.phone ? ` · ${client.phone}` : ""}
                      </div>

                      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
                        <div>
                          <div className="adm-label">Projects</div>
                          <div className="adm-val">{client.project_count}</div>
                        </div>
                        <div>
                          <div className="adm-label">Invoices</div>
                          <div className="adm-val">{client.invoice_count}</div>
                        </div>
                        {outstanding > 0 && (
                          <div>
                            <div className="adm-label">Outstanding</div>
                            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 600, color: "#e8a100" }}>
                              R{outstanding.toLocaleString("en-ZA")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button className="adm-btn adm-btn-green" onClick={() => openInvoiceModal(client)}>
                      + New invoice
                    </button>
                  </div>

                  {/* Recent invoices for this client */}
                  {clientInvoices.length > 0 && (
                    <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(245,244,239,0.06)" }}>
                      <div className="adm-label" style={{ marginBottom: "0.625rem" }}>Recent invoices</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {clientInvoices.slice(0, 3).map(inv => (
                          <div key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                            <div>
                              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", marginRight: "0.75rem" }}>{inv.invoice_number}</span>
                              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "rgba(245,244,239,0.6)" }}>{inv.description}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600, color: "#f5f4ef" }}>R{Number(inv.amount).toLocaleString("en-ZA")}</span>
                              <Badge status={inv.status} map={INVOICE_STATUS} />
                              <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost" style={{ fontSize: "0.7rem", padding: "0.25rem 0.55rem" }}>PDF</a>
                              {(inv.status === "sent" || inv.status === "overdue") && (
                                <button className="adm-btn adm-btn-green" style={{ fontSize: "0.7rem", padding: "0.25rem 0.55rem" }} onClick={() => markPaid(inv.id)}>Paid</button>
                              )}
                            </div>
                          </div>
                        ))}
                        {clientInvoices.length > 3 && (
                          <button className="adm-btn adm-btn-ghost" style={{ alignSelf: "flex-start", marginTop: "0.25rem", fontSize: "0.75rem" }} onClick={() => setTab("invoices")}>
                            View all {clientInvoices.length} invoices →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )
        )}

        {/* ── INVOICES TAB ── */}
        {tab === "invoices" && (
          allInvoices.length === 0 ? (
            <div className="adm-empty">No invoices yet. Create one from the Clients tab.</div>
          ) : (
            <div>
              {/* Summary */}
              <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { label: "Total sent", value: allInvoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0), color: "#e8a100" },
                  { label: "Total paid", value: allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0), color: "#5dbf88" },
                ].map(({ label, value, color }) => value > 0 && (
                  <div key={label} style={{ background: "rgba(245,244,239,0.04)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.875rem", padding: "1rem 1.5rem" }}>
                    <div className="adm-label">{label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.5rem", fontWeight: 600, color, lineHeight: 1 }}>
                      R{value.toLocaleString("en-ZA")}
                    </div>
                  </div>
                ))}
              </div>

              {allInvoices.map(inv => {
                const client = clients.find(c => c.user_id === inv.user_id);
                const clientName = client?.business_name || client?.full_name || client?.user_email || "—";
                return (
                  <div key={inv.id} className="adm-card" style={{ padding: "1.125rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", flexShrink: 0 }}>{inv.invoice_number}</span>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: "#f5f4ef" }}>{inv.description}</span>
                        </div>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.775rem", color: "rgba(245,244,239,0.35)" }}>
                          {clientName}
                          {inv.due_date ? ` · Due ${new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600, color: "#f5f4ef" }}>R{Number(inv.amount).toLocaleString("en-ZA")}</span>
                        <Badge status={inv.status} map={INVOICE_STATUS} />
                        <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}>
                          View
                        </a>
                        {(inv.status === "sent" || inv.status === "overdue") && (
                          <button className="adm-btn adm-btn-green" style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }} onClick={() => markPaid(inv.id)}>
                            Mark paid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ── APPROVE MODAL ── */}
      {approveModal && (
        <div className="adm-modal-bg" onClick={() => setApproveModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", marginBottom: "0.375rem" }}>Approve & create project</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", marginBottom: "1.5rem" }}>
              Creates a project in the client&apos;s dashboard and marks the quote as in progress.
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label className="adm-input-label">Project name</label>
              <input className="adm-input" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Acme — Growth Package" />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="adm-input-label">Notes (optional — shown to client as project description)</label>
              <textarea className="adm-input" value={approveNotes} onChange={e => setApproveNotes(e.target.value)} rows={3} placeholder="e.g. Starting with homepage and about. Discovery call Thursday." style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="adm-btn adm-btn-ghost" onClick={() => setApproveModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-green" onClick={confirmApprove} disabled={!projectName.trim() || loading !== null}>
                {loading ? "Creating…" : "Create project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INVOICE MODAL ── */}
      {invoiceModal && (
        <div className="adm-modal-bg" onClick={() => !invSuccess && setInvoiceModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            {invSuccess ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "#3a8a62", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" stroke="white"/></svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", marginBottom: "0.5rem" }}>Invoice sent</h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.45)", marginBottom: "1.5rem" }}>
                  {invNumber} is now visible in the client&apos;s dashboard.
                </p>
                <button className="adm-btn adm-btn-ghost" onClick={() => setInvoiceModal(null)} style={{ width: "100%", justifyContent: "center" }}>Close</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", marginBottom: "0.25rem" }}>New invoice</h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", marginBottom: "1.5rem" }}>
                  For {invoiceModal.client.business_name || invoiceModal.client.full_name || invoiceModal.client.user_email}
                </p>

                {/* Quick fill */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div className="adm-label" style={{ marginBottom: "0.5rem" }}>Quick fill</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {[
                      { key: "deposit" as const, label: "20% deposit" },
                      { key: "balance" as const, label: "Balance due" },
                      { key: "retainer" as const, label: "Monthly retainer" },
                    ].map(({ key, label }) => (
                      <button key={key} className="adm-btn adm-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }} onClick={() => quickFill(key)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="adm-input-label">Description *</label>
                  <input className="adm-input" value={invDescription} onChange={e => setInvDescription(e.target.value)} placeholder="e.g. 50% deposit — Acme Growth Package" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="adm-input-label">Amount (ZAR) *</label>
                    <input className="adm-input" type="number" value={invAmount} onChange={e => setInvAmount(e.target.value)} placeholder="6000" min="1" />
                  </div>
                  <div>
                    <label className="adm-input-label">Due date *</label>
                    <input className="adm-input" type="date" value={invDueDate} onChange={e => setInvDueDate(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="adm-input-label">Invoice number</label>
                    <input className="adm-input" value={invNumber} onChange={e => setInvNumber(e.target.value)} placeholder="INV-2026-001" />
                  </div>
                  <div>
                    <label className="adm-input-label">PO number (optional)</label>
                    <input className="adm-input" value={invPoNumber} onChange={e => setInvPoNumber(e.target.value)} placeholder="PO-12345" />
                  </div>
                </div>

                {error && (
                  <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#f87171" }}>{error}</div>
                )}

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={() => setInvoiceModal(null)}>Cancel</button>
                  <button
                    className="adm-btn adm-btn-green"
                    onClick={submitInvoice}
                    disabled={invLoading || !invDescription.trim() || !invAmount || !invDueDate}
                  >
                    {invLoading ? "Creating…" : "Create & send invoice"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
