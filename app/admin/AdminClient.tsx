"use client";
import { useState } from "react";
import { STANDARD_TERMS } from "@/lib/proposal-terms";

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

const PROPOSAL_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  draft:    { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: "Draft" },
  sent:     { bg: "rgba(99,130,245,0.14)",  color: "#99b3ff",               label: "Awaiting client" },
  accepted: { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "Accepted" },
  declined: { bg: "rgba(220,60,60,0.14)",   color: "#f87171",               label: "Declined" },
  expired:  { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.3)", label: "Expired" },
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
  po_number?: string | null; proposal_id?: string | null;
};

type LineItem = { id: string; description: string; amount: string; type: "once_off" | "monthly" };

type Proposal = {
  id: string; user_id: string; quote_id: string | null;
  proposal_number: string; status: string; title: string;
  description: string | null; line_items: LineItem[];
  base_price: number | null; monthly_price: number | null;
  client_business_name: string | null; client_reg_number: string | null;
  client_vat_number: string | null; client_address: string | null;
  client_po_number: string | null; client_contact_name: string | null;
  client_signature_name: string | null; accepted_at: string | null;
  sent_at: string | null; expires_at: string | null; created_at: string;
};

type Props = {
  initialQuotes: Quote[];
  clients: Client[];
  invoices: Invoice[];
  proposals: Proposal[];
  nextInvoiceNumber: string;
  nextProposalNumber: string;
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

function newLineItem(): LineItem {
  return { id: Math.random().toString(36).slice(2), description: "", amount: "", type: "once_off" };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminClient({
  initialQuotes, clients, invoices, proposals: initialProposals,
  nextInvoiceNumber, nextProposalNumber,
}: Props) {
  const [tab, setTab] = useState<"quotes" | "proposals" | "clients" | "invoices">("quotes");
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>(invoices);
  const [allProposals, setAllProposals] = useState<Proposal[]>(initialProposals);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Quote approve modal ──
  const [approveModal, setApproveModal] = useState<{ quote: Quote } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [approveNotes, setApproveNotes] = useState("");

  // ── Invoice modal ──
  const [invoiceModal, setInvoiceModal] = useState<{ client: Client; proposalId?: string } | null>(null);
  const [invNumber, setInvNumber] = useState(nextInvoiceNumber);
  const [invDescription, setInvDescription] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invPoNumber, setInvPoNumber] = useState("");
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [invLoading, setInvLoading] = useState(false);
  const [invSuccess, setInvSuccess] = useState(false);
  const [invProposalId, setInvProposalId] = useState<string | undefined>();

  // ── Proposal builder modal ──
  const [proposalModal, setProposalModal] = useState<{ quote: Quote } | null>(null);
  const [propNumber, setPropNumber] = useState(nextProposalNumber);
  const [propTitle, setPropTitle] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propLineItems, setPropLineItems] = useState<LineItem[]>([newLineItem()]);
  const [propTerms, setPropTerms] = useState(STANDARD_TERMS);
  const [propExpiry, setPropExpiry] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [propLoading, setPropLoading] = useState(false);
  const [propSuccess, setPropSuccess] = useState(false);

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

  const openInvoiceModal = (client: Client, opts?: { proposalId?: string; description?: string; amount?: string; poNumber?: string }) => {
    setInvoiceModal({ client, proposalId: opts?.proposalId });
    setInvDescription(opts?.description ?? "");
    setInvAmount(opts?.amount ?? "");
    setInvPoNumber(opts?.poNumber ?? "");
    setInvProposalId(opts?.proposalId);
    setInvSuccess(false);
    const year = new Date().getFullYear();
    const count = allInvoices.filter(i => i.invoice_number?.startsWith(`INV-${year}-`)).length;
    setInvNumber(`INV-${year}-${(count + 1).toString().padStart(3, "0")}`);
    const d = new Date(); d.setDate(d.getDate() + 7);
    setInvDueDate(d.toISOString().split("T")[0]);
  };

  const quickFill = (type: "deposit" | "balance" | "retainer") => {
    if (!invoiceModal) return;
    const name = invoiceModal.client.business_name || invoiceModal.client.full_name || invoiceModal.client.user_email;
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
          ...(invProposalId ? { proposalId: invProposalId } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create invoice"); }
      else {
        setAllInvoices(prev => [{
          id: data.invoice.id, user_id: invoiceModal.client.user_id,
          invoice_number: invNumber, description: invDescription,
          amount: Number(invAmount), status: "sent", due_date: invDueDate,
          created_at: new Date().toISOString(), po_number: invPoNumber.trim() || null,
          proposal_id: invProposalId ?? null,
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

  // ── Proposal actions ───────────────────────────────────────────────────────

  const openProposalModal = (quote: Quote) => {
    const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
    const name = quote.profiles?.business_name || quote.profiles?.full_name || quote.user_email;
    setPropTitle(`${name} — ${tierLabel} Package`);
    setPropDescription("");
    setPropLineItems([newLineItem()]);
    setPropTerms(STANDARD_TERMS);
    setPropSuccess(false);
    const year = new Date().getFullYear();
    const count = allProposals.filter(p => p.proposal_number?.startsWith(`PROP-${year}-`)).length;
    setPropNumber(`PROP-${year}-${(count + 1).toString().padStart(3, "0")}`);
    const d = new Date(); d.setDate(d.getDate() + 14);
    setPropExpiry(d.toISOString().split("T")[0]);
    setProposalModal({ quote });
  };

  const updateLineItem = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
    setPropLineItems(prev => prev.map(li => li.id === id ? { ...li, [field]: value } : li));
  };

  const removeLineItem = (id: string) => {
    setPropLineItems(prev => prev.length > 1 ? prev.filter(li => li.id !== id) : prev);
  };

  const submitProposal = async () => {
    if (!proposalModal || !propTitle.trim() || propLineItems.every(li => !li.description.trim())) return;
    setPropLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/create-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: proposalModal.quote.user_id,
          quoteId: proposalModal.quote.id,
          proposalNumber: propNumber,
          title: propTitle,
          description: propDescription.trim() || null,
          lineItems: propLineItems.filter(li => li.description.trim()),
          terms: propTerms,
          expiresAt: propExpiry || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send proposal"); }
      else {
        const validItems = propLineItems.filter(li => li.description.trim());
        const base_price = validItems.filter(li => li.type === "once_off").reduce((s, li) => s + Number(li.amount || 0), 0);
        const monthly_price = validItems.filter(li => li.type === "monthly").reduce((s, li) => s + Number(li.amount || 0), 0);
        setAllProposals(prev => [{
          id: data.proposal.id, user_id: proposalModal.quote.user_id,
          quote_id: proposalModal.quote.id, proposal_number: propNumber,
          status: "sent", title: propTitle, description: propDescription || null,
          line_items: validItems, base_price: base_price || null, monthly_price: monthly_price || null,
          client_business_name: null, client_reg_number: null, client_vat_number: null,
          client_address: null, client_po_number: null, client_contact_name: null,
          client_signature_name: null, accepted_at: null, sent_at: new Date().toISOString(),
          expires_at: propExpiry || null, created_at: new Date().toISOString(),
        }, ...prev]);
        // Mark quote as proposal_sent
        setQuotes(qs => qs.map(q => q.id === proposalModal.quote.id ? { ...q, status: "proposal_sent" } : q));
        setPropSuccess(true);
      }
    } catch { setError("Network error"); }
    finally { setPropLoading(false); }
  };

  const generateInvoiceFromProposal = (proposal: Proposal) => {
    const client = clients.find(c => c.user_id === proposal.user_id);
    if (!client) return;
    openInvoiceModal(client, {
      proposalId: proposal.id,
      description: proposal.title,
      amount: proposal.base_price ? proposal.base_price.toString() : "",
      poNumber: proposal.client_po_number ?? "",
    });
  };

  // ── Computed ───────────────────────────────────────────────────────────────

  const propOnceOffTotal = propLineItems
    .filter(li => li.type === "once_off")
    .reduce((s, li) => s + Number(li.amount || 0), 0);
  const propMonthlyTotal = propLineItems
    .filter(li => li.type === "monthly")
    .reduce((s, li) => s + Number(li.amount || 0), 0);

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
        .adm-btn-amber  { background: rgba(232,161,0,0.12); color: #e8a100; border: 1px solid rgba(232,161,0,0.2); }
        .adm-btn-amber:hover:not(:disabled) { background: rgba(232,161,0,0.22); }
        .adm-btn-danger { background: rgba(220,60,60,0.12); color: #f87171; border: 1px solid rgba(220,60,60,0.2); }
        .adm-btn-danger:hover:not(:disabled) { background: rgba(220,60,60,0.2); }
        .adm-modal-bg { position: fixed; inset: 0; background: rgba(5,12,8,0.92); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 2rem 1rem; overflow-y: auto; }
        .adm-modal { background: #0f1c15; border: 1px solid rgba(245,244,239,0.1); border-radius: 1rem; padding: 2rem; width: 100%; max-width: 36rem; margin: auto; }
        .adm-modal-wide { max-width: 52rem; }
        .adm-input { width: 100%; background: rgba(245,244,239,0.05); border: 1px solid rgba(245,244,239,0.12); border-radius: 0.5rem; padding: 0.75rem 1rem; color: #f5f4ef; font-family: var(--font-sans); font-size: 0.875rem; box-sizing: border-box; outline: none; }
        .adm-input:focus { border-color: #5dbf88; }
        .adm-input-label { font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; color: rgba(245,244,239,0.5); display: block; margin-bottom: 0.5rem; }
        .adm-tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; background: rgba(245,244,239,0.04); border: 1px solid rgba(245,244,239,0.08); border-radius: 0.75rem; padding: 0.25rem; width: fit-content; flex-wrap: wrap; }
        .adm-tab { font-family: var(--font-sans); font-size: 0.8125rem; font-weight: 600; padding: 0.5rem 1.125rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.15s, color 0.15s; background: transparent; color: rgba(245,244,239,0.4); }
        .adm-tab.active { background: rgba(245,244,239,0.09); color: #f5f4ef; }
        .adm-tab:hover:not(.active) { color: rgba(245,244,239,0.7); }
        .adm-empty { text-align: center; padding: 4rem 2rem; font-family: var(--font-sans); font-size: 0.9rem; color: rgba(245,244,239,0.3); }
        .adm-li-row { display: grid; grid-template-columns: 1fr 7rem 8rem 2rem; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
        @media (max-width: 599px) { .adm-li-row { grid-template-columns: 1fr 1fr; gap: 0.4rem; } .adm-li-row .adm-li-type { grid-column: 1; } .adm-li-row .adm-li-rm { grid-column: 2; justify-self: end; } }
        @media (max-width: 767px) { .adm-page { padding: 1.5rem 1rem 3rem; } }
      `}</style>

      <div className="adm-page">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="adm-title" style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              Admin
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", textDecoration: "none", padding: "0.3rem 0.6rem", borderRadius: "0.375rem", border: "1px solid rgba(245,244,239,0.08)", transition: "color 0.15s" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View site
              </a>
            </h1>
            <p className="adm-sub" style={{ marginBottom: 0 }}>
              {quotes.length} quote{quotes.length !== 1 ? "s" : ""} · {allProposals.length} proposal{allProposals.length !== 1 ? "s" : ""} · {clients.length} client{clients.length !== 1 ? "s" : ""} · {allInvoices.length} invoice{allInvoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          <button className={`adm-tab${tab === "quotes" ? " active" : ""}`} onClick={() => setTab("quotes")}>
            Quotes {quotes.length > 0 && `(${quotes.length})`}
          </button>
          <button className={`adm-tab${tab === "proposals" ? " active" : ""}`} onClick={() => setTab("proposals")}>
            Proposals {allProposals.length > 0 && `(${allProposals.length})`}
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
              const linkedProposal = allProposals.find(p => p.quote_id === quote.id);

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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                      <Badge status={quote.status} map={QUOTE_STATUS} />
                      {linkedProposal && (
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.35)" }}>
                          Proposal: <span style={{ color: PROPOSAL_STATUS[linkedProposal.status]?.color ?? "rgba(245,244,239,0.5)" }}>{PROPOSAL_STATUS[linkedProposal.status]?.label ?? linkedProposal.status}</span>
                        </span>
                      )}
                    </div>
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
                    {/* Primary CTA: Send Proposal */}
                    {quote.status !== "in_progress" && quote.status !== "completed" && quote.status !== "declined" && !linkedProposal && (
                      <button className="adm-btn adm-btn-blue" disabled={isLoading} onClick={() => openProposalModal(quote)}>
                        Send proposal
                      </button>
                    )}
                    {linkedProposal?.status === "sent" && (
                      <button className="adm-btn adm-btn-ghost" disabled onClick={() => {}}>Proposal awaiting client</button>
                    )}
                    {linkedProposal?.status === "accepted" && (() => {
                      const c = clients.find(cl => cl.user_id === quote.user_id);
                      return (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#5dbf88", fontWeight: 600 }}>✓ Proposal accepted</span>
                          {c && (
                            <button className="adm-btn adm-btn-green" onClick={() => generateInvoiceFromProposal(linkedProposal)}>Generate invoice</button>
                          )}
                          {quote.status !== "in_progress" && quote.status !== "completed" && (
                            <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => openApproveModal(quote)}>{isLoading ? "Creating…" : "Create project"}</button>
                          )}
                        </div>
                      );
                    })()}
                    {/* Legacy status actions */}
                    {quote.status === "submitted" && (
                      <button className="adm-btn adm-btn-ghost" disabled={isLoading} onClick={() => updateStatus(quote.id, "reviewing")}>{isLoading ? "…" : "Mark reviewing"}</button>
                    )}
                    {/* Quick invoice from in-progress quote */}
                    {(quote.status === "in_progress" || quote.status === "approved") && (() => {
                      const c = clients.find(cl => cl.user_id === quote.user_id);
                      return c ? (
                        <button className="adm-btn adm-btn-ghost" onClick={() => openInvoiceModal(c)}>Create invoice</button>
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

        {/* ── PROPOSALS TAB ── */}
        {tab === "proposals" && (
          allProposals.length === 0 ? (
            <div className="adm-empty">No proposals yet. Send one from the Quotes tab.</div>
          ) : (
            <div>
              {/* Summary stats */}
              <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { label: "Awaiting client", count: allProposals.filter(p => p.status === "sent").length, color: "#99b3ff" },
                  { label: "Accepted", count: allProposals.filter(p => p.status === "accepted").length, color: "#5dbf88" },
                ].filter(s => s.count > 0).map(({ label, count, color }) => (
                  <div key={label} style={{ background: "rgba(245,244,239,0.04)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.875rem", padding: "1rem 1.5rem" }}>
                    <div className="adm-label">{label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.5rem", fontWeight: 600, color, lineHeight: 1 }}>{count}</div>
                  </div>
                ))}
              </div>

              {allProposals.map(prop => {
                const client = clients.find(c => c.user_id === prop.user_id);
                const clientName = client?.business_name || client?.full_name || client?.user_email || "—";
                const lineItems: LineItem[] = Array.isArray(prop.line_items) ? prop.line_items : [];
                const onceOff = lineItems.filter(li => li.type === "once_off").reduce((s, li) => s + Number(li.amount || 0), 0);
                const monthly = lineItems.filter(li => li.type === "monthly").reduce((s, li) => s + Number(li.amount || 0), 0);

                return (
                  <div key={prop.id} className="adm-card">
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.25)", marginBottom: "0.25rem" }}>{prop.proposal_number}</div>
                        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "#f5f4ef" }}>{prop.title}</div>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", marginTop: "0.15rem" }}>{clientName}</div>
                      </div>
                      <Badge status={prop.status} map={PROPOSAL_STATUS} />
                    </div>

                    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      {onceOff > 0 && <div><div className="adm-label">Once-off</div><div className="adm-val">R{onceOff.toLocaleString("en-ZA")}</div></div>}
                      {monthly > 0 && <div><div className="adm-label">Monthly</div><div className="adm-val">R{monthly.toLocaleString("en-ZA")}/mo</div></div>}
                      {prop.sent_at && <div><div className="adm-label">Sent</div><div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.6)" }}>{new Date(prop.sent_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</div></div>}
                      {prop.expires_at && prop.status === "sent" && <div><div className="adm-label">Expires</div><div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: new Date(prop.expires_at) < new Date() ? "#f87171" : "rgba(245,244,239,0.6)" }}>{new Date(prop.expires_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</div></div>}
                    </div>

                    {/* Accepted — show client's submitted details */}
                    {prop.status === "accepted" && (prop.client_business_name || prop.client_reg_number || prop.client_po_number) && (
                      <div style={{ background: "rgba(58,138,98,0.07)", border: "1px solid rgba(58,138,98,0.15)", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1rem" }}>
                        <div className="adm-label" style={{ marginBottom: "0.5rem", color: "#5dbf88" }}>Client details submitted</div>
                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                          {prop.client_business_name && <div><div className="adm-label">Business</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_business_name}</div></div>}
                          {prop.client_reg_number && <div><div className="adm-label">Reg No.</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_reg_number}</div></div>}
                          {prop.client_vat_number && <div><div className="adm-label">VAT No.</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_vat_number}</div></div>}
                          {prop.client_po_number && <div><div className="adm-label">PO No.</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_po_number}</div></div>}
                          {prop.client_address && <div><div className="adm-label">Address</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_address}</div></div>}
                          {prop.client_signature_name && <div><div className="adm-label">Signed by</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{prop.client_signature_name}</div></div>}
                          {prop.accepted_at && <div><div className="adm-label">Accepted at</div><div className="adm-val" style={{ fontSize: "0.85rem" }}>{new Date(prop.accepted_at).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div></div>}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(245,244,239,0.06)" }}>
                      <a href={`/dashboard/proposals/${prop.id}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost" style={{ fontSize: "0.8rem" }}>
                        View proposal
                      </a>
                      {prop.status === "accepted" && client && (
                        <button className="adm-btn adm-btn-green" onClick={() => generateInvoiceFromProposal(prop)}>
                          Generate invoice
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── CLIENTS TAB ── */}
        {tab === "clients" && (
          clients.length === 0 ? (
            <div className="adm-empty">No clients yet. Clients appear here after they sign up.</div>
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
                        {client.user_email}{client.phone ? ` · ${client.phone}` : ""}
                      </div>
                      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
                        <div><div className="adm-label">Projects</div><div className="adm-val">{client.project_count}</div></div>
                        <div><div className="adm-label">Invoices</div><div className="adm-val">{client.invoice_count}</div></div>
                        {outstanding > 0 && (
                          <div>
                            <div className="adm-label">Outstanding</div>
                            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 600, color: "#e8a100" }}>R{outstanding.toLocaleString("en-ZA")}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="adm-btn adm-btn-green" onClick={() => openInvoiceModal(client)}>+ New invoice</button>
                  </div>

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
              <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { label: "Outstanding", value: allInvoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0), color: "#e8a100" },
                  { label: "Total paid", value: allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0), color: "#5dbf88" },
                ].map(({ label, value, color }) => value > 0 && (
                  <div key={label} style={{ background: "rgba(245,244,239,0.04)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.875rem", padding: "1rem 1.5rem" }}>
                    <div className="adm-label">{label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.5rem", fontWeight: 600, color, lineHeight: 1 }}>R{value.toLocaleString("en-ZA")}</div>
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
                          {clientName}{inv.due_date ? ` · Due ${new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600, color: "#f5f4ef" }}>R{Number(inv.amount).toLocaleString("en-ZA")}</span>
                        <Badge status={inv.status} map={INVOICE_STATUS} />
                        <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}>View</a>
                        {(inv.status === "sent" || inv.status === "overdue") && (
                          <button className="adm-btn adm-btn-green" style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }} onClick={() => markPaid(inv.id)}>Mark paid</button>
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
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", marginBottom: "0.375rem" }}>Create project</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)", marginBottom: "1.5rem" }}>
              Creates a project in the client&apos;s dashboard and marks the quote as in progress.
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label className="adm-input-label">Project name</label>
              <input className="adm-input" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Acme — Growth Package" />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="adm-input-label">Notes (optional — shown to client)</label>
              <textarea className="adm-input" value={approveNotes} onChange={e => setApproveNotes(e.target.value)} rows={3} placeholder="e.g. Starting with homepage. Discovery call Thursday." style={{ resize: "vertical" }} />
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
                  {invProposalId && <span style={{ color: "#5dbf88" }}> · from proposal</span>}
                </p>

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
                  <input className="adm-input" value={invDescription} onChange={e => setInvDescription(e.target.value)} placeholder="e.g. 20% deposit — Acme Growth Package" />
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
                  <button className="adm-btn adm-btn-green" onClick={submitInvoice} disabled={invLoading || !invDescription.trim() || !invAmount || !invDueDate}>
                    {invLoading ? "Creating…" : "Create & send invoice"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PROPOSAL BUILDER MODAL ── */}
      {proposalModal && (
        <div className="adm-modal-bg" onClick={() => !propSuccess && setProposalModal(null)}>
          <div className={`adm-modal adm-modal-wide`} onClick={e => e.stopPropagation()}>
            {propSuccess ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "#3a8a62", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" stroke="white"/></svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", marginBottom: "0.5rem" }}>Proposal sent</h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.45)", marginBottom: "1.5rem" }}>
                  The client can now view and accept it from their dashboard.
                </p>
                <button className="adm-btn adm-btn-ghost" onClick={() => setProposalModal(null)} style={{ width: "100%", justifyContent: "center" }}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", margin: 0 }}>Send proposal</h2>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.35)", margin: "0.25rem 0 0" }}>
                      For {proposalModal.quote.profiles?.business_name || proposalModal.quote.profiles?.full_name || proposalModal.quote.user_email}
                    </p>
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)" }}>{propNumber}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="adm-input-label">Proposal title *</label>
                    <input className="adm-input" value={propTitle} onChange={e => setPropTitle(e.target.value)} placeholder="e.g. Growth Package — Acme Corp" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="adm-input-label">Scope description (optional — shown at top of proposal)</label>
                    <textarea className="adm-input" value={propDescription} onChange={e => setPropDescription(e.target.value)} rows={3} placeholder="Describe what's included…" style={{ resize: "vertical" }} />
                  </div>
                </div>

                {/* Line items */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                    <label className="adm-input-label" style={{ margin: 0 }}>Line items *</label>
                    <button className="adm-btn adm-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem" }} onClick={() => setPropLineItems(prev => [...prev, newLineItem()])}>+ Add line</button>
                  </div>

                  {/* Header row */}
                  <div className="adm-li-row" style={{ marginBottom: "0.25rem" }}>
                    <div className="adm-label" style={{ margin: 0 }}>Description</div>
                    <div className="adm-label" style={{ margin: 0 }}>Amount (R)</div>
                    <div className="adm-label adm-li-type" style={{ margin: 0 }}>Type</div>
                    <div />
                  </div>

                  {propLineItems.map(li => (
                    <div key={li.id} className="adm-li-row">
                      <input className="adm-input" value={li.description} onChange={e => updateLineItem(li.id, "description", e.target.value)} placeholder="e.g. Website design" />
                      <input className="adm-input" type="number" value={li.amount} onChange={e => updateLineItem(li.id, "amount", e.target.value)} placeholder="15000" min="0" />
                      <select className="adm-input adm-li-type" value={li.type} onChange={e => updateLineItem(li.id, "type", e.target.value as "once_off" | "monthly")} style={{ cursor: "pointer" }}>
                        <option value="once_off">Once-off</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <button className="adm-li-rm" onClick={() => removeLineItem(li.id)} style={{ background: "none", border: "none", color: "rgba(245,244,239,0.25)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.25rem" }}>×</button>
                    </div>
                  ))}

                  {(propOnceOffTotal > 0 || propMonthlyTotal > 0) && (
                    <div style={{ display: "flex", gap: "1.5rem", justifyContent: "flex-end", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(245,244,239,0.07)" }}>
                      {propOnceOffTotal > 0 && (
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f5f4ef" }}>
                          Once-off: <strong>R{propOnceOffTotal.toLocaleString("en-ZA")}</strong>
                        </div>
                      )}
                      {propMonthlyTotal > 0 && (
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f5f4ef" }}>
                          Monthly: <strong>R{propMonthlyTotal.toLocaleString("en-ZA")}/mo</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="adm-input-label">Expires on (optional)</label>
                    <input className="adm-input" type="date" value={propExpiry} onChange={e => setPropExpiry(e.target.value)} />
                  </div>
                  <div>
                    <label className="adm-input-label">Proposal number</label>
                    <input className="adm-input" value={propNumber} onChange={e => setPropNumber(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="adm-input-label">Terms &amp; Conditions (pre-filled — edit if needed)</label>
                  <textarea className="adm-input" value={propTerms} onChange={e => setPropTerms(e.target.value)} rows={8} style={{ resize: "vertical", fontSize: "0.75rem", lineHeight: 1.6, color: "rgba(245,244,239,0.55)" }} />
                </div>

                {error && (
                  <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#f87171" }}>{error}</div>
                )}

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button className="adm-btn adm-btn-ghost" onClick={() => setProposalModal(null)}>Cancel</button>
                  <button className="adm-btn adm-btn-blue" onClick={submitProposal} disabled={propLoading || !propTitle.trim() || propLineItems.every(li => !li.description.trim())}>
                    {propLoading ? "Sending…" : "Send proposal to client"}
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
