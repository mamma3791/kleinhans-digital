import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import PrintButton from "./PrintButton";

// ─── Business details — set these in Vercel env vars ──────────────────────────
const BIZ = {
  name:        process.env.BUSINESS_NAME         ?? "Kleinhans Digital",
  reg:         process.env.BUSINESS_REG_NUMBER   ?? "",
  vat:         process.env.BUSINESS_VAT_NUMBER   ?? "",
  address:     process.env.BUSINESS_ADDRESS      ?? "",
  email:       "info@kleinhansdigital.co.za",
  phone:       process.env.BUSINESS_PHONE        ?? "",
  bankName:    process.env.BUSINESS_BANK_NAME    ?? "",
  bankAccount: process.env.BUSINESS_BANK_ACCOUNT ?? "",
  bankType:    process.env.BUSINESS_BANK_TYPE    ?? "Cheque / Current",
  bankBranch:  process.env.BUSINESS_BANK_BRANCH  ?? "",
};

function fmt(n: number) {
  return `R\u00a0${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: invoice } = await admin
    .from("invoices")
    .select("id, user_id, invoice_number, description, amount, status, due_date, created_at, po_number")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, business_name, phone, email")
    .eq("id", invoice.user_id)
    .single();

  let userEmail = profile?.email ?? "";
  try {
    const { data } = await admin.auth.admin.getUserById(invoice.user_id);
    if (data?.user?.email) userEmail = data.user.email;
  } catch { /* skip */ }

  const clientName = profile?.business_name || profile?.full_name || userEmail;
  const issueDate  = new Date(invoice.created_at);
  const dueDate    = invoice.due_date ? new Date(invoice.due_date + "T00:00:00") : null;

  // VAT — only shown if BUSINESS_VAT_NUMBER is set
  const hasVat   = !!BIZ.vat;
  const total    = Number(invoice.amount);
  const subtotal = hasVat ? total / 1.15 : total;
  const vatAmt   = hasVat ? total - subtotal : 0;

  const hasBanking = BIZ.bankName || BIZ.bankAccount;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        .inv-wrap {
          min-height: 100vh;
          background: #0a1510;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Toolbar — hidden when printing */
        .inv-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 56rem;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .inv-back {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 500;
          color: rgba(245,244,239,0.45); text-decoration: none;
          transition: color 0.15s;
        }
        .inv-back:hover { color: #f5f4ef; }

        /* The printable document */
        .inv-doc {
          background: #fff;
          color: #111;
          width: 100%;
          max-width: 56rem;
          border-radius: 0.75rem;
          padding: 3.5rem 4rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .inv-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .inv-biz-name {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          color: #0a1510;
          letter-spacing: -0.01em;
          margin: 0 0 0.5rem;
        }
        .inv-biz-detail { font-size: 0.8rem; color: #555; margin: 0.15rem 0; }

        .inv-title-block { text-align: right; }
        .inv-title {
          font-family: var(--font-sans); font-size: 2rem; font-weight: 700;
          letter-spacing: 4px; text-transform: uppercase; color: #3a8a62;
          margin: 0 0 1rem;
        }
        .inv-meta { font-size: 0.825rem; color: #444; }
        .inv-meta strong { color: #111; font-weight: 600; }

        .inv-divider { border: none; border-top: 2px solid #e8ede9; margin: 2rem 0; }
        .inv-divider-thin { border: none; border-top: 1px solid #e8ede9; margin: 1rem 0; }

        .inv-section-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #3a8a62; margin-bottom: 0.5rem;
        }
        .inv-client-name { font-weight: 600; font-size: 1rem; color: #111; margin-bottom: 0.2rem; }
        .inv-client-detail { font-size: 0.825rem; color: #555; }

        /* Line items table */
        .inv-table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
        .inv-table thead th {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: #666; padding: 0 0 0.75rem; border-bottom: 2px solid #e8ede9; text-align: left;
        }
        .inv-table thead th:last-child { text-align: right; }
        .inv-table tbody td {
          padding: 1rem 0; border-bottom: 1px solid #e8ede9;
          font-size: 0.9rem; color: #222; vertical-align: top;
        }
        .inv-table tbody td:last-child { text-align: right; font-weight: 600; white-space: nowrap; }

        /* Totals */
        .inv-totals { display: flex; justify-content: flex-end; margin-top: 0.5rem; }
        .inv-totals-inner { min-width: 18rem; }
        .inv-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.4rem 0; font-size: 0.875rem; color: #444;
        }
        .inv-total-row.grand {
          border-top: 2px solid #0a1510; margin-top: 0.5rem; padding-top: 0.875rem;
          font-size: 1.1rem; font-weight: 700; color: #0a1510;
        }

        /* Banking details */
        .inv-banking { background: #f5f8f6; border-radius: 0.5rem; padding: 1.5rem; margin-top: 2.5rem; }
        .inv-banking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 2rem; margin-top: 0.75rem; }
        .inv-banking-item {}
        .inv-banking-key { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888; }
        .inv-banking-val { font-size: 0.875rem; font-weight: 600; color: #111; }

        /* Footer note */
        .inv-footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e8ede9; font-size: 0.775rem; color: #888; }

        /* Status pill on document */
        .inv-status-pill {
          display: inline-flex; align-items: center;
          font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.75rem;
          border-radius: 9999px; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .status-sent    { background: rgba(232,161,0,0.12);  color: #9a6800; }
        .status-paid    { background: rgba(58,138,98,0.12);  color: #1f6e40; }
        .status-overdue { background: rgba(220,60,60,0.1);   color: #b91c1c; }
        .status-draft   { background: rgba(0,0,0,0.06);      color: #666; }

        @media print {
          @page { margin: 1.5cm; }
          body  { background: white !important; }
          .inv-toolbar { display: none !important; }
          .inv-wrap    { background: white !important; padding: 0 !important; }
          .inv-doc     { border-radius: 0 !important; padding: 0 !important; box-shadow: none !important; max-width: none !important; }
          .inv-status-pill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .inv-banking { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        @media (max-width: 640px) {
          .inv-doc { padding: 2rem 1.5rem; }
          .inv-head { flex-direction: column; }
          .inv-title-block { text-align: left; }
          .inv-banking-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="inv-wrap">
        {/* Toolbar */}
        <div className="inv-toolbar no-print">
          <Link href="/admin" className="inv-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to admin
          </Link>
          <PrintButton />
        </div>

        {/* Document */}
        <div className="inv-doc">
          {/* Header */}
          <div className="inv-head">
            <div>
              <h1 className="inv-biz-name">{BIZ.name}</h1>
              {BIZ.address && <p className="inv-biz-detail">{BIZ.address}</p>}
              <p className="inv-biz-detail">{BIZ.email}{BIZ.phone ? ` · ${BIZ.phone}` : ""}</p>
              {BIZ.reg && <p className="inv-biz-detail">Reg No: {BIZ.reg}</p>}
              {BIZ.vat && <p className="inv-biz-detail">VAT No: {BIZ.vat}</p>}
            </div>

            <div className="inv-title-block">
              <h2 className="inv-title">Invoice</h2>
              <div className="inv-meta">
                <div><strong>{invoice.invoice_number}</strong></div>
                <div style={{ marginTop: "0.5rem" }}>Date issued: <strong>{fmtDate(issueDate)}</strong></div>
                {dueDate && <div>Due date: <strong>{fmtDate(dueDate)}</strong></div>}
                {invoice.po_number && <div>PO Number: <strong>{invoice.po_number}</strong></div>}
                <div style={{ marginTop: "0.75rem" }}>
                  <span className={`inv-status-pill status-${invoice.status}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="inv-divider" />

          {/* Bill to */}
          <div>
            <div className="inv-section-label">Bill to</div>
            <div className="inv-client-name">{clientName}</div>
            {profile?.full_name && profile.business_name && (
              <div className="inv-client-detail">{profile.full_name}</div>
            )}
            {userEmail && <div className="inv-client-detail">{userEmail}</div>}
            {profile?.phone && <div className="inv-client-detail">{profile.phone}</div>}
          </div>

          {/* Line items */}
          <table className="inv-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.description}</td>
                <td>{fmt(hasVat ? subtotal : total)}{hasVat ? "" : ""}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="inv-totals">
            <div className="inv-totals-inner">
              {hasVat && (
                <>
                  <div className="inv-total-row">
                    <span>Subtotal (excl. VAT)</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="inv-total-row">
                    <span>VAT (15%)</span>
                    <span>{fmt(vatAmt)}</span>
                  </div>
                </>
              )}
              <div className="inv-total-row grand">
                <span>Total {hasVat ? "(incl. VAT)" : ""}</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Banking details */}
          {hasBanking && (
            <div className="inv-banking">
              <div className="inv-section-label">Payment details — EFT</div>
              <div className="inv-banking-grid">
                {BIZ.bankName && (
                  <div className="inv-banking-item">
                    <div className="inv-banking-key">Bank</div>
                    <div className="inv-banking-val">{BIZ.bankName}</div>
                  </div>
                )}
                {BIZ.bankAccount && (
                  <div className="inv-banking-item">
                    <div className="inv-banking-key">Account number</div>
                    <div className="inv-banking-val">{BIZ.bankAccount}</div>
                  </div>
                )}
                {BIZ.bankType && (
                  <div className="inv-banking-item">
                    <div className="inv-banking-key">Account type</div>
                    <div className="inv-banking-val">{BIZ.bankType}</div>
                  </div>
                )}
                {BIZ.bankBranch && (
                  <div className="inv-banking-item">
                    <div className="inv-banking-key">Branch code</div>
                    <div className="inv-banking-val">{BIZ.bankBranch}</div>
                  </div>
                )}
                <div className="inv-banking-item">
                  <div className="inv-banking-key">Reference</div>
                  <div className="inv-banking-val">{invoice.invoice_number}</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="inv-footer">
            <p style={{ margin: "0 0 0.5rem" }}>
              Thank you for your business. Please use <strong>{invoice.invoice_number}</strong> as your payment reference.
            </p>
            {dueDate && (
              <p style={{ margin: 0 }}>Payment is due by <strong>{fmtDate(dueDate)}</strong>. Late payments may be subject to interest.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
