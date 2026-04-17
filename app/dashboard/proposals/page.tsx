import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardShell from "../components/DashboardShell";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  sent:     { label: "Action required",  color: "#e8a100",               bg: "rgba(232,161,0,0.12)" },
  accepted: { label: "Accepted",         color: "#5dbf88",               bg: "rgba(58,138,98,0.15)" },
  declined: { label: "Declined",         color: "#f87171",               bg: "rgba(220,60,60,0.14)" },
  expired:  { label: "Expired",          color: "rgba(245,244,239,0.3)", bg: "rgba(245,244,239,0.07)" },
  draft:    { label: "Draft",            color: "rgba(245,244,239,0.4)", bg: "rgba(245,244,239,0.07)" },
};

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, proposal_number, status, title, base_price, monthly_price, sent_at, expires_at, accepted_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = proposals ?? [];
  const pending = list.filter(p => p.status === "sent");

  return (
    <DashboardShell userName={user.email ?? ""}>
      <style>{`
        .kd-section-title {
          font-family: var(--font-serif);
          font-size: clamp(1.375rem, 2vw, 1.75rem);
          color: var(--cream);
          margin-bottom: 0.5rem;
        }
        .kd-section-sub {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: rgba(245,244,239,0.4);
          margin-bottom: 2rem;
        }
        .kd-prop-card {
          background: rgba(245,244,239,0.04);
          border: 1px solid rgba(245,244,239,0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 0.875rem;
          text-decoration: none;
          display: block;
          transition: border-color 0.15s, background 0.15s;
        }
        .kd-prop-card:hover { border-color: rgba(245,244,239,0.16); background: rgba(245,244,239,0.06); }
        .kd-prop-card.pending { border-color: rgba(232,161,0,0.3); background: rgba(232,161,0,0.04); }
        .kd-prop-card.pending:hover { border-color: rgba(232,161,0,0.5); background: rgba(232,161,0,0.08); }
        .kd-empty { text-align: center; padding: 4rem 2rem; font-family: var(--font-sans); font-size: 0.9rem; color: rgba(245,244,239,0.3); }
      `}</style>

      <div style={{ padding: "2.25rem 2rem 4rem", maxWidth: "52rem" }}>
        <h1 className="kd-section-title">Proposals</h1>
        <p className="kd-section-sub">
          {pending.length > 0
            ? `${pending.length} proposal${pending.length !== 1 ? "s" : ""} awaiting your acceptance`
            : "Your proposals from Kleinhans Digital"}
        </p>

        {list.length === 0 ? (
          <div className="kd-empty">No proposals yet. We&apos;ll send one once we&apos;ve reviewed your quote.</div>
        ) : (
          list.map(p => {
            const s = STATUS_MAP[p.status] ?? STATUS_MAP["draft"];
            const isPending = p.status === "sent";
            return (
              <Link key={p.id} href={`/dashboard/proposals/${p.id}`} className={`kd-prop-card${isPending ? " pending" : ""}`}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,244,239,0.25)", marginBottom: "0.25rem" }}>
                      {p.proposal_number}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "var(--cream)", marginBottom: "0.4rem" }}>
                      {p.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.4)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                      {p.base_price != null && <span>R{Number(p.base_price).toLocaleString("en-ZA")} once-off</span>}
                      {p.monthly_price != null && Number(p.monthly_price) > 0 && <span>R{Number(p.monthly_price).toLocaleString("en-ZA")}/mo</span>}
                      {p.sent_at && <span>Sent {new Date(p.sent_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "9999px", background: s.bg, color: s.color, letterSpacing: "0.01em" }}>
                      {s.label}
                    </span>
                    {isPending && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#e8a100" }}>
                        Review &amp; accept →
                      </span>
                    )}
                    {p.expires_at && p.status === "sent" && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: new Date(p.expires_at) < new Date() ? "#f87171" : "rgba(245,244,239,0.3)" }}>
                        Expires {new Date(p.expires_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
