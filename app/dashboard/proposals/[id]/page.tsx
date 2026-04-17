import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "../../components/DashboardShell";
import ProposalAcceptClient from "./ProposalAcceptClient";
import Link from "next/link";

type LineItem = { id?: string; description: string; amount: string; type: "once_off" | "monthly" };

const BIZ_NAME = process.env.BUSINESS_NAME ?? "Kleinhans Digital";

function fmt(n: number) {
  return `R\u00a0${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!proposal) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name")
    .eq("id", user.id)
    .single();

  const lineItems: LineItem[] = Array.isArray(proposal.line_items) ? proposal.line_items : [];
  const onceOffItems = lineItems.filter(li => li.type === "once_off");
  const monthlyItems = lineItems.filter(li => li.type === "monthly");
  const onceOffTotal = onceOffItems.reduce((s, li) => s + Number(li.amount || 0), 0);
  const monthlyTotal = monthlyItems.reduce((s, li) => s + Number(li.amount || 0), 0);

  const clientName = profile?.business_name || profile?.full_name || user.email;
  const isOpen = proposal.status === "sent";
  const isAccepted = proposal.status === "accepted";

  const sentDate = proposal.sent_at ? new Date(proposal.sent_at) : new Date(proposal.created_at);
  const expiryDate = proposal.expires_at ? new Date(proposal.expires_at) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  return (
    <DashboardShell userName={user.email ?? ""}>
      <style>{`
        .kd-prop-page { padding: 2rem 2rem 5rem; max-width: 54rem; }
        .kd-prop-doc {
          background: rgba(245,244,239,0.03);
          border: 1px solid rgba(245,244,239,0.09);
          border-radius: 1.25rem;
          padding: 3rem;
          font-family: var(--font-sans);
        }
        @media (max-width: 640px) {
          .kd-prop-page { padding: 1.5rem 1rem 4rem; }
          .kd-prop-doc { padding: 1.75rem 1.25rem; }
        }
        .kd-prop-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: rgba(245,244,239,0.3); margin-bottom: 0.35rem;
        }
        .kd-prop-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .kd-prop-table th {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(245,244,239,0.3); padding: 0 0 0.75rem; border-bottom: 1px solid rgba(245,244,239,0.1);
          text-align: left;
        }
        .kd-prop-table th:last-child { text-align: right; }
        .kd-prop-table td {
          padding: 0.875rem 0; border-bottom: 1px solid rgba(245,244,239,0.06);
          font-size: 0.9rem; color: rgba(245,244,239,0.75); vertical-align: top;
        }
        .kd-prop-table td:last-child { text-align: right; font-weight: 600; color: #f5f4ef; white-space: nowrap; }
        .kd-terms {
          background: rgba(245,244,239,0.02);
          border: 1px solid rgba(245,244,239,0.07);
          border-radius: 0.75rem;
          padding: 1.5rem;
          max-height: 20rem;
          overflow-y: auto;
          font-size: 0.78rem;
          line-height: 1.75;
          color: rgba(245,244,239,0.4);
          white-space: pre-wrap;
          margin: 1rem 0;
          scroll-behavior: smooth;
        }
        .kd-terms::-webkit-scrollbar { width: 4px; }
        .kd-terms::-webkit-scrollbar-track { background: transparent; }
        .kd-terms::-webkit-scrollbar-thumb { background: rgba(245,244,239,0.1); border-radius: 2px; }
      `}</style>

      <div className="kd-prop-page">
        {/* Back link */}
        <Link href="/dashboard/proposals" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.35)", textDecoration: "none", marginBottom: "1.5rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          All proposals
        </Link>

        {/* Status banner */}
        {isAccepted && (
          <div style={{ background: "rgba(58,138,98,0.1)", border: "1px solid rgba(93,191,136,0.2)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#5dbf88", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" stroke="#5dbf88"/></svg>
            Accepted on {proposal.accepted_at ? fmtDate(new Date(proposal.accepted_at)) : "—"} — we&apos;ll be in touch soon.
          </div>
        )}
        {!isOpen && !isAccepted && (
          <div style={{ background: "rgba(245,244,239,0.04)", border: "1px solid rgba(245,244,239,0.08)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.4)" }}>
            This proposal is no longer open ({proposal.status}).
          </div>
        )}
        {isOpen && isExpired && (
          <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.18)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#f87171" }}>
            This proposal expired on {fmtDate(expiryDate!)}. Please contact us to request an updated proposal.
          </div>
        )}

        {/* Document */}
        <div className="kd-prop-doc">

          {/* Proposal header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "#f5f4ef", marginBottom: "0.375rem" }}>{BIZ_NAME}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(245,244,239,0.35)" }}>info@kleinhansdigital.co.za</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase", color: "rgba(93,191,136,0.8)", marginBottom: "0.75rem" }}>
                Proposal
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(245,244,239,0.5)", lineHeight: 1.8 }}>
                <div><strong style={{ color: "#f5f4ef" }}>{proposal.proposal_number}</strong></div>
                <div>Date: <strong style={{ color: "#f5f4ef" }}>{fmtDate(sentDate)}</strong></div>
                {expiryDate && <div>Valid until: <strong style={{ color: isExpired ? "#f87171" : "#f5f4ef" }}>{fmtDate(expiryDate)}</strong></div>}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(245,244,239,0.1)", marginBottom: "2rem" }} />

          {/* Prepared for */}
          <div style={{ marginBottom: "2rem" }}>
            <div className="kd-prop-label">Prepared for</div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f5f4ef" }}>{clientName}</div>
            <div style={{ fontSize: "0.825rem", color: "rgba(245,244,239,0.4)" }}>{user.email}</div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "#f5f4ef", margin: "0 0 0.625rem" }}>{proposal.title}</h2>
            {proposal.description && (
              <p style={{ fontSize: "0.9rem", color: "rgba(245,244,239,0.6)", lineHeight: 1.7, margin: 0 }}>{proposal.description}</p>
            )}
          </div>

          {/* Line items */}
          {lineItems.length > 0 && (
            <>
              {onceOffItems.length > 0 && (
                <>
                  <div className="kd-prop-label" style={{ marginBottom: "0" }}>Once-off services</div>
                  <table className="kd-prop-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onceOffItems.map((li, i) => (
                        <tr key={li.id ?? i}>
                          <td>{li.description}</td>
                          <td>{fmt(Number(li.amount || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
                    <div style={{ minWidth: "14rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderTop: "2px solid rgba(245,244,239,0.12)", fontSize: "0.9375rem", fontWeight: 700, color: "#f5f4ef" }}>
                        <span>Total once-off</span>
                        <span>{fmt(onceOffTotal)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {monthlyItems.length > 0 && (
                <>
                  <div className="kd-prop-label" style={{ marginBottom: "0" }}>Monthly services</div>
                  <table className="kd-prop-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th style={{ textAlign: "right" }}>Per month</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyItems.map((li, i) => (
                        <tr key={li.id ?? i}>
                          <td>{li.description}</td>
                          <td>{fmt(Number(li.amount || 0))}/mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
                    <div style={{ minWidth: "14rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderTop: "2px solid rgba(245,244,239,0.12)", fontSize: "0.9375rem", fontWeight: 700, color: "#f5f4ef" }}>
                        <span>Monthly total</span>
                        <span>{fmt(monthlyTotal)}/mo</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Payment terms summary */}
          <div style={{ background: "rgba(58,138,98,0.07)", border: "1px solid rgba(93,191,136,0.12)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
            <div className="kd-prop-label" style={{ color: "rgba(93,191,136,0.6)", marginBottom: "0.625rem" }}>Payment terms</div>
            <ul style={{ margin: 0, padding: "0 0 0 1.125rem", fontSize: "0.875rem", color: "rgba(245,244,239,0.6)", lineHeight: 2 }}>
              {onceOffTotal > 0 && <>
                <li>20% deposit ({fmt(onceOffTotal * 0.2)}) due before work commences</li>
                <li>Balance ({fmt(onceOffTotal * 0.8)}) due upon project completion, before launch</li>
              </>}
              {monthlyTotal > 0 && <li>Monthly retainer of {fmt(monthlyTotal)} billed on the 1st of each month</li>}
              <li>Invoices payable within 7 days of issue</li>
              <li>All prices exclude VAT unless stated</li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          {proposal.terms && (
            <div style={{ marginBottom: "2rem" }}>
              <div className="kd-prop-label" style={{ marginBottom: "0.5rem" }}>Terms &amp; Conditions</div>
              <div className="kd-terms">{proposal.terms}</div>
            </div>
          )}

          {/* Acceptance form or accepted state */}
          {isOpen && !isExpired ? (
            <ProposalAcceptClient
              proposalId={proposal.id}
              prefillBusinessName={profile?.business_name ?? null}
            />
          ) : isAccepted ? (
            <div style={{ borderTop: "1px solid rgba(245,244,239,0.08)", paddingTop: "2rem" }}>
              <div className="kd-prop-label" style={{ marginBottom: "0.75rem", color: "rgba(93,191,136,0.6)" }}>Digital signature on record</div>
              <div style={{ fontStyle: "italic", fontSize: "1.125rem", color: "rgba(245,244,239,0.7)" }}>{proposal.client_signature_name}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(245,244,239,0.3)", marginTop: "0.25rem" }}>
                Accepted {proposal.accepted_at ? fmtDate(new Date(proposal.accepted_at)) : "—"}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}
