import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  planning:    { bg: "rgba(232,161,0,0.12)",  color: "#e8a100", label: "Planning" },
  in_progress: { bg: "rgba(58,138,98,0.15)",  color: "#5dbf88", label: "In progress" },
  review:      { bg: "rgba(99,130,245,0.14)", color: "#99b3ff", label: "In review" },
  complete:    { bg: "rgba(93,191,136,0.1)",  color: "rgba(93,191,136,0.5)", label: "Complete" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: status };
  return <span className="kd-status" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, status, progress, start_date, target_date, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const all = projects ?? [];
  const active = all.filter(p => p.status !== "complete");
  const done = all.filter(p => p.status === "complete");

  return (
    <div className="kd-dash-page">
      <h1 className="kd-dash-title">Projects</h1>
      <p className="kd-dash-subtitle">Track the progress of your website projects.</p>

      {all.length === 0 ? (
        <div className="kd-dash-card kd-dash-empty">
          <p>No projects yet. Projects appear here once your quote is approved and work begins.</p>
          <Link href="/configure" className="kd-dash-btn">Get a quote</Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section style={{ marginBottom: "2.25rem" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "1rem" }}>
                Active ({active.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {active.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {done.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "1rem" }}>
                Completed ({done.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {done.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ProjectCard({ project }: {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number;
    start_date: string | null;
    target_date: string | null;
    created_at: string;
  };
}) {
  const targetDate = project.target_date ? new Date(project.target_date) : null;
  const isOverdue = targetDate && targetDate < new Date() && project.status !== "complete";

  return (
    <div className="kd-dash-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "var(--cream)", marginBottom: "0.25rem", lineHeight: 1.3 }}>
            {project.name}
          </h3>
          {project.description && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "rgba(245,244,239,0.4)", lineHeight: 1.55 }}>
              {project.description}
            </p>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)" }}>
            Progress
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: project.progress === 100 ? "rgba(93,191,136,0.55)" : "var(--green3)" }}>
            {project.progress}%
          </span>
        </div>
        <div className="kd-progress-track">
          <div className="kd-progress-fill" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Footer: dates + link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.125rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {project.start_date && (
            <div>
              <div className="kd-dash-label">Started</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "rgba(245,244,239,0.55)" }}>
                {new Date(project.start_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          )}
          {targetDate && (
            <div>
              <div className="kd-dash-label">Target</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: isOverdue ? "#f87171" : "rgba(245,244,239,0.55)" }}>
                {targetDate.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                {isOverdue && " (overdue)"}
              </div>
            </div>
          )}
        </div>
        <Link href={`/dashboard/projects/${project.id}`} className="kd-dash-btn-ghost">
          View details <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}
