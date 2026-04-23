import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  draft:   { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: "Draft" },
  sent:    { bg: "rgba(232,161,0,0.12)",   color: "#e8a100", label: "Sent" },
  paid:    { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88", label: "Paid" },
  overdue: { bg: "rgba(220,60,60,0.14)",   color: "#f87171", label: "Overdue" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return <span className="kd-status" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, description, amount, status, due_date, paid_at, pdf_url, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const all = invoices ?? [];
  const outstanding = all.filter(i => i.status === "sent" || i.status === "overdue");
  const totalOutstanding = outstanding.reduce((s, i) => s + Number(i.amount ?? 0), 0);
  const totalPaid = all
    .filter(i => i.status === "paid")
    .reduce((s, i) => s + Number(i.amount ?? 0), 0);

  return (
    <div className="kd-dash-page">
      <h1 className="kd-dash-title">Invoices</h1>
      <p className="kd-dash-subtitle">A record of all invoices for your projects.</p>

      {all.length === 0 ? (
        <div className="kd-dash-card kd-dash-empty">
          <p>No invoices yet. Your first invoice will appear here once your project is underway.</p>
          <Link href="/configure" className="kd-dash-btn">Get a quote</Link>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "2rem" }}>
            <div className="kd-stat-card">
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.75rem" }}>
                Outstanding
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: totalOutstanding > 0 ? "#e8a100" : "rgba(245,244,239,0.25)", lineHeight: 1 }}>
                {totalOutstanding > 0 ? `R${totalOutstanding.toLocaleString("en-ZA")}` : "—"}
              </div>
            </div>
            <div className="kd-stat-card">
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.75rem" }}>
                Total paid
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: totalPaid > 0 ? "var(--green3)" : "rgba(245,244,239,0.25)", lineHeight: 1 }}>
                {totalPaid > 0 ? `R${totalPaid.toLocaleString("en-ZA")}` : "—"}
              </div>
            </div>
          </div>

          {/* Invoice list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {all.map(invoice => {
              const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
              const isOverdueDisplay = invoice.status === "overdue" || (dueDate && dueDate < new Date() && invoice.status === "sent");

              return (
                <div key={invoice.id} className="kd-dash-card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", marginBottom: "0.25rem" }}>
                        {invoice.invoice_number}
                        <span style={{ margin: "0 0.5rem", opacity: 0.3 }}>·</span>
                        {new Date(invoice.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "var(--cream)", lineHeight: 1.35 }}>
                        {invoice.description}
                      </h3>
                    </div>
                    <StatusBadge status={isOverdueDisplay ? "overdue" : invoice.status} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--cream)", lineHeight: 1 }}>
                        R{Number(invoice.amount).toLocaleString("en-ZA")}
                      </div>
                      {dueDate && invoice.status !== "paid" && (
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: isOverdueDisplay ? "#f87171" : "rgba(245,244,239,0.3)", marginTop: "0.3rem" }}>
                          {isOverdueDisplay ? "Overdue — was due" : "Due"}{" "}
                          {dueDate.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                      )}
                      {invoice.status === "paid" && invoice.paid_at && (
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green3)", marginTop: "0.3rem" }}>
                          Paid {new Date(invoice.paid_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="kd-dash-btn-ghost"
                        >
                          <DownloadIcon />
                          Download PDF
                        </a>
                      )}
                      {(invoice.status === "sent" || isOverdueDisplay) && (
                        <a
                          href={`https://wa.me/27726340848?text=${encodeURIComponent(`Hi, I'd like to pay invoice ${invoice.invoice_number} (R${Number(invoice.amount).toLocaleString("en-ZA")}). What are the payment details?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="kd-dash-btn"
                          style={{ fontSize: "0.8125rem", padding: "0.625rem 1.125rem" }}
                        >
                          Pay via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 479px) {
          .kd-inv-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
