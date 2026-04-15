import { createClient } from "@/lib/supabase/server";

const CATEGORY_MAP: Record<string, { label: string; bg: string; color: string }> = {
  design:   { label: "Design",   bg: "rgba(149,76,233,0.12)", color: "#c084fc" },
  code:     { label: "Code",     bg: "rgba(99,130,245,0.14)", color: "#99b3ff" },
  document: { label: "Document", bg: "rgba(232,161,0,0.12)",  color: "#e8a100" },
  media:    { label: "Media",    bg: "rgba(58,138,98,0.15)",  color: "#5dbf88" },
  other:    { label: "Other",    bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.4)" },
};

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  design: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  document: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  media: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  other: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
};

function formatBytes(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: assets } = await supabase
    .from("assets")
    .select("id, name, description, file_url, file_type, file_size, category, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const all = assets ?? [];

  // Group by category
  const grouped = all.reduce<Record<string, typeof all>>((acc, asset) => {
    const cat = asset.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(asset);
    return acc;
  }, {});

  const categoryOrder = ["design", "code", "document", "media", "other"];

  return (
    <div className="kd-dash-page">
      <h1 className="kd-dash-title">Assets</h1>
      <p className="kd-dash-subtitle">All files, designs, and deliverables from your projects.</p>

      {all.length === 0 ? (
        <div className="kd-dash-card kd-dash-empty">
          <p>No assets yet. Completed deliverables from your project — design files, source code, documents — will be shared here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {categoryOrder
            .filter(cat => grouped[cat]?.length > 0)
            .map(category => {
              const catInfo = CATEGORY_MAP[category] ?? CATEGORY_MAP.other;
              const items = grouped[category];

              return (
                <section key={category}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                    <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)" }}>
                      {catInfo.label}
                    </h2>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.2)" }}>
                      {items.length}
                    </span>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
                    gap: "0.875rem",
                  }}>
                    {items.map(asset => (
                      <a
                        key={asset.id}
                        href={asset.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          className="kd-dash-card kd-asset-card"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.875rem",
                            cursor: "pointer",
                            transition: "border-color 0.15s, background 0.15s",
                            height: "100%",
                          }}
                        >
                          {/* Icon */}
                          <div style={{
                            width: "2.75rem", height: "2.75rem",
                            borderRadius: "0.625rem",
                            background: catInfo.bg,
                            color: catInfo.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {CATEGORY_ICONS[category] ?? CATEGORY_ICONS.other}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "var(--cream)", lineHeight: 1.35, marginBottom: "0.25rem" }}>
                              {asset.name}
                            </div>
                            {asset.description && (
                              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.775rem", color: "rgba(245,244,239,0.35)", lineHeight: 1.5, marginBottom: "0.375rem" }}>
                                {asset.description}
                              </div>
                            )}
                            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(245,244,239,0.22)" }}>
                              {asset.file_type ?? "File"}
                              {formatBytes(asset.file_size) ? ` · ${formatBytes(asset.file_size)}` : ""}
                              {" · "}
                              {new Date(asset.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>

                          {/* Download indicator */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: catInfo.color, fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500 }}>
                            <DownloadIcon />
                            Download
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}
      <style>{`
        a:hover .kd-asset-card {
          border-color: rgba(245,244,239,0.16) !important;
          background: rgba(245,244,239,0.07) !important;
        }
      `}</style>
    </div>
  );
}
