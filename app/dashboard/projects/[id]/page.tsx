import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  planning:    { bg: "rgba(232,161,0,0.12)",  color: "#e8a100", label: "Planning" },
  in_progress: { bg: "rgba(58,138,98,0.15)",  color: "#5dbf88", label: "In progress" },
  review:      { bg: "rgba(99,130,245,0.14)", color: "#99b3ff", label: "In review" },
  complete:    { bg: "rgba(93,191,136,0.1)",  color: "rgba(93,191,136,0.5)", label: "Complete" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: project }, { data: milestones }, { data: files }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("milestones")
      .select("id, title, description, due_date, completed, completed_at")
      .eq("project_id", id)
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("project_files")
      .select("id, name, file_url, file_type, file_size, uploaded_by, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!project) notFound();

  const allMilestones = milestones ?? [];
  const completedCount = allMilestones.filter(m => m.completed).length;
  const s = STATUS_MAP[project.status] ?? { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)", label: project.status };

  return (
    <div className="kd-dash-page">

      {/* Back link */}
      <Link href="/dashboard/projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "rgba(245,244,239,0.35)", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.15s" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        All projects
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.875rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <h1 className="kd-dash-title" style={{ marginBottom: 0 }}>{project.name}</h1>
          <span className="kd-status" style={{ background: s.bg, color: s.color, marginTop: "0.375rem" }}>{s.label}</span>
        </div>
        {project.description && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.45)", lineHeight: 1.65, maxWidth: "42rem" }}>
            {project.description}
          </p>
        )}
      </div>

      {/* Key dates + progress */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.875rem", marginBottom: "2rem" }}>
        <div className="kd-stat-card">
          <div className="kd-dash-label">Progress</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--green3)", lineHeight: 1 }}>{project.progress}%</div>
          <div className="kd-progress-track" style={{ marginTop: "0.75rem" }}>
            <div className="kd-progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="kd-stat-card">
          <div className="kd-dash-label">Milestones</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--green3)", lineHeight: 1 }}>
            {completedCount}<span style={{ fontSize: "1rem", color: "rgba(245,244,239,0.3)" }}>/{allMilestones.length}</span>
          </div>
        </div>
        {project.start_date && (
          <div className="kd-stat-card">
            <div className="kd-dash-label">Started</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--cream)" }}>
              {new Date(project.start_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        )}
        {project.target_date && (
          <div className="kd-stat-card">
            <div className="kd-dash-label">Target date</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--cream)" }}>
              {new Date(project.target_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      {allMilestones.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "1rem" }}>
            Milestones
          </h2>
          <div className="kd-dash-card" style={{ padding: 0, overflow: "hidden" }}>
            {allMilestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "1rem",
                  padding: "1.125rem 1.5rem",
                  borderBottom: idx < allMilestones.length - 1 ? "1px solid rgba(245,244,239,0.06)" : "none",
                  opacity: milestone.completed ? 0.65 : 1,
                }}
              >
                {/* Checkbox visual */}
                <div style={{
                  width: "1.125rem", height: "1.125rem",
                  borderRadius: "50%", flexShrink: 0, marginTop: "0.125rem",
                  border: milestone.completed ? "none" : "1.5px solid rgba(245,244,239,0.2)",
                  background: milestone.completed ? "var(--green)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {milestone.completed && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9rem", color: "var(--cream)", marginBottom: "0.125rem", textDecoration: milestone.completed ? "line-through" : "none" }}>
                    {milestone.title}
                  </div>
                  {milestone.description && (
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.35)", lineHeight: 1.5 }}>
                      {milestone.description}
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  {milestone.completed && milestone.completed_at ? (
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green3)" }}>
                      Done {new Date(milestone.completed_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </div>
                  ) : milestone.due_date ? (
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.28)" }}>
                      Due {new Date(milestone.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      <div>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "1rem" }}>
          Files
        </h2>
        {(files ?? []).length === 0 ? (
          <div className="kd-dash-card">
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.3)", textAlign: "center", padding: "1.5rem 0" }}>
              No files attached yet. Files shared during the project will appear here.
            </p>
          </div>
        ) : (
          <div className="kd-dash-card" style={{ padding: 0, overflow: "hidden" }}>
            {(files ?? []).map((file, idx) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="kd-file-link"
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.5rem",
                  borderBottom: idx < (files ?? []).length - 1 ? "1px solid rgba(245,244,239,0.06)" : "none",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
              >
                <div style={{
                  width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem",
                  background: "rgba(245,244,239,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,244,239,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "var(--cream)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", marginTop: "0.1rem" }}>
                    {file.file_type ?? "File"}
                    {file.file_size ? ` · ${formatBytes(file.file_size)}` : ""}
                    {" · "}
                    {file.uploaded_by === "agency" ? "Shared by Kleinhans Digital" : "Uploaded by you"}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,244,239,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
      <style>{`.kd-file-link:hover { background: rgba(245,244,239,0.03); }`}</style>
    </div>
  );
}
