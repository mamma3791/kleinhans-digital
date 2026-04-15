import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  planning:    { bg: "rgba(232,161,0,0.12)",  color: "#e8a100", label: "Planning" },
  in_progress: { bg: "rgba(58,138,98,0.15)",  color: "#5dbf88", label: "In progress" },
  review:      { bg: "rgba(99,130,245,0.14)", color: "#99b3ff", label: "In review" },
  complete:    { bg: "rgba(93,191,136,0.1)",  color: "rgba(93,191,136,0.55)", label: "Complete" },
  draft:       { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: "Draft" },
  sent:        { bg: "rgba(232,161,0,0.12)",  color: "#e8a100", label: "Sent" },
  paid:        { bg: "rgba(58,138,98,0.15)",  color: "#5dbf88", label: "Paid" },
  overdue:     { bg: "rgba(220,60,60,0.14)",  color: "#f87171", label: "Overdue" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: status };
  return (
    <span className="kd-status" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: projects },
    { data: invoices },
    { count: unread },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, business_name").eq("id", user!.id).single(),
    supabase.from("projects").select("id, name, status, progress, target_date").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("id, invoice_number, description, amount, status, due_date").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("user_id", user!.id).eq("sender", "agency").eq("read", false),
    supabase.from("messages").select("sender, content, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const allProjects = projects ?? [];
  const allInvoices = invoices ?? [];

  const activeProjects = allProjects.filter(p => p.status !== "complete").length;
  const pendingInvoices = allInvoices.filter(i => i.status === "sent" || i.status === "overdue");
  const pendingTotal = pendingInvoices.reduce((s, i) => s + Number(i.amount ?? 0), 0);
  const latestProject = allProjects[0];
  const latestInvoice = allInvoices[0];
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="kd-dash-page">

      {/* Welcome header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="kd-dash-title">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>
        <p className="kd-dash-subtitle">
          {profile?.business_name ?? "Your Kleinhans Digital client portal"}
        </p>
      </div>

      {/* Stats row */}
      <div className="kd-dash-stats">
        <div className="kd-stat-card">
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.75rem" }}>
            Active projects
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: "var(--green3)", lineHeight: 1 }}>
            {activeProjects}
          </div>
        </div>
        <div className="kd-stat-card">
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.75rem" }}>
            Outstanding
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: pendingTotal > 0 ? "#e8a100" : "rgba(245,244,239,0.3)", lineHeight: 1 }}>
            {pendingTotal > 0 ? `R${pendingTotal.toLocaleString("en-ZA")}` : "—"}
          </div>
        </div>
        <div className="kd-stat-card">
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.75rem" }}>
            Unread messages
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: (unread ?? 0) > 0 ? "var(--green3)" : "rgba(245,244,239,0.3)", lineHeight: 1 }}>
            {unread ?? 0}
          </div>
        </div>
      </div>

      {/* Two-column grid on desktop */}
      <div className="kd-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Latest project */}
        <div className="kd-dash-card kd-col-left">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.125rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.28)" }}>
              Current project
            </span>
            <Link href="/dashboard/projects" className="kd-dash-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
              All projects <ArrowIcon />
            </Link>
          </div>

          {latestProject ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1rem" }}>
                <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "var(--cream)", lineHeight: 1.3 }}>
                  {latestProject.name}
                </h2>
                <StatusBadge status={latestProject.status} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)" }}>Progress</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "var(--green3)" }}>
                    {latestProject.progress}%
                  </span>
                </div>
                <div className="kd-progress-track">
                  <div className="kd-progress-fill" style={{ width: `${latestProject.progress}%` }} />
                </div>
              </div>
              {latestProject.target_date && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.28)", marginTop: "0.875rem" }}>
                  Target: {new Date(latestProject.target_date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
              <Link href={`/dashboard/projects/${latestProject.id}`} className="kd-dash-btn-ghost" style={{ marginTop: "1.125rem" }}>
                View details <ArrowIcon />
              </Link>
            </>
          ) : (
            <div className="kd-dash-empty">
              <p>No projects yet. We&apos;ll create your first project once your quote is approved.</p>
              <Link href="/configure" className="kd-dash-btn">Get a quote</Link>
            </div>
          )}
        </div>

        {/* Latest invoice */}
        <div className="kd-dash-card kd-col-right">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.125rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.28)" }}>
              Latest invoice
            </span>
            <Link href="/dashboard/invoices" className="kd-dash-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
              All invoices <ArrowIcon />
            </Link>
          </div>

          {latestInvoice ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", marginBottom: "0.25rem" }}>
                    {latestInvoice.invoice_number}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "var(--cream)", lineHeight: 1.35 }}>
                    {latestInvoice.description}
                  </div>
                </div>
                <StatusBadge status={latestInvoice.status} />
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.875rem", color: "var(--cream)", lineHeight: 1, marginBottom: "0.75rem" }}>
                R{Number(latestInvoice.amount).toLocaleString("en-ZA")}
              </div>
              {latestInvoice.due_date && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.28)" }}>
                  Due: {new Date(latestInvoice.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </>
          ) : (
            <div className="kd-dash-empty">
              <p>No invoices yet. Your first invoice will appear here once your project is underway.</p>
            </div>
          )}
        </div>

        {/* Recent message */}
        {(recentMessages ?? []).length > 0 && (
          <div className="kd-dash-card kd-col-full">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.28)" }}>
                Latest message
                {(unread ?? 0) > 0 && (
                  <span style={{ marginLeft: "0.625rem", background: "var(--green)", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                    {unread} unread
                  </span>
                )}
              </span>
              <Link href="/dashboard/messages" className="kd-dash-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
                Open messages <ArrowIcon />
              </Link>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.6)", lineHeight: 1.65, fontStyle: "italic" }}>
              &ldquo;{recentMessages![0].content}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.25)", marginTop: "0.625rem" }}>
              {recentMessages![0].sender === "agency" ? "From Kleinhans Digital" : "You"} &middot;{" "}
              {new Date(recentMessages![0].created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
            </p>
          </div>
        )}
      </div>

      {/* Responsive override for the two-col grid */}
      <style>{`
        .kd-col-left  { grid-column: 1; }
        .kd-col-right { grid-column: 2; }
        .kd-col-full  { grid-column: 1 / -1; }
        @media (max-width: 639px) {
          .kd-overview-grid { grid-template-columns: 1fr !important; }
          .kd-col-left, .kd-col-right, .kd-col-full { grid-column: 1 !important; }
        }
      `}</style>
    </div>
  );
}
