"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function IconGrid() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function IconFolder() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconReceipt() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  );
}
function IconMessage() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconFiles() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  );
}
function IconQuote() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IconLogOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard",           label: "Overview",  icon: <IconGrid /> },
  { href: "/dashboard/quotes",    label: "Quotes",    icon: <IconQuote /> },
  { href: "/dashboard/projects",  label: "Projects",  icon: <IconFolder /> },
  { href: "/dashboard/invoices",  label: "Invoices",  icon: <IconReceipt /> },
  { href: "/dashboard/messages",  label: "Messages",  icon: <IconMessage /> },
  { href: "/dashboard/assets",    label: "Assets",    icon: <IconFiles /> },
  { href: "/dashboard/profile",   label: "Profile",   icon: <IconUser /> },
];

type Props = {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  unreadMessages: number;
};

export default function DashboardShell({ children, userName, userEmail, unreadMessages }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const currentLabel = NAV_ITEMS.find(n => isActive(n.href))?.label ?? "Dashboard";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <style>{`
        /* ---------- layout ---------- */
        .kd-dash-root {
          display: flex;
          min-height: 100vh;
          background: #111a16;
        }

        /* sidebar */
        .kd-dash-sidebar {
          width: 15rem;
          flex-shrink: 0;
          background: var(--dark2);
          border-right: 1px solid rgba(245,244,239,0.06);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* main */
        .kd-dash-main { flex: 1; min-width: 0; }

        /* mobile top bar — hidden on desktop */
        .kd-dash-topbar {
          display: none;
          background: var(--dark2);
          border-bottom: 1px solid rgba(245,244,239,0.06);
          padding: 0.875rem 1.25rem;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        /* mobile bottom nav — hidden on desktop */
        .kd-dash-bnav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 50;
          background: var(--dark2);
          border-top: 1px solid rgba(245,244,239,0.06);
          padding-bottom: max(0.375rem, env(safe-area-inset-bottom));
        }
        .kd-dash-bnav-inner {
          display: flex;
        }

        @media (max-width: 767px) {
          .kd-dash-sidebar  { display: none; }
          .kd-dash-topbar   { display: flex; }
          .kd-dash-bnav     { display: block; }
          .kd-dash-main     { padding-bottom: 5rem; }
        }

        /* ---------- sidebar nav items ---------- */
        .kd-snav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.25rem;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(245,244,239,0.4);
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          position: relative;
        }
        .kd-snav-item:hover {
          color: rgba(245,244,239,0.75);
          background: rgba(245,244,239,0.03);
        }
        .kd-snav-item.active {
          color: var(--green3);
          background: rgba(93,191,136,0.07);
          border-left-color: var(--green3);
        }

        /* ---------- bottom nav items ---------- */
        .kd-bnav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.55rem 0.25rem 0.35rem;
          font-family: var(--font-sans);
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(245,244,239,0.3);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .kd-bnav-item.active { color: var(--green3); }

        /* ---------- message badge ---------- */
        .kd-dash-msg-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.1rem;
          height: 1.1rem;
          padding: 0 0.25rem;
          background: var(--green);
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 700;
          border-radius: 9999px;
          margin-left: auto;
          line-height: 1;
        }
        .kd-dash-msg-dot {
          position: absolute;
          top: 0.3rem;
          right: 0.2rem;
          width: 0.45rem;
          height: 0.45rem;
          background: var(--green);
          border-radius: 50%;
          border: 1.5px solid var(--dark2);
        }

        /* ---------- shared page styles ---------- */
        .kd-dash-page {
          padding: 2.25rem 2rem 3rem;
        }
        @media (max-width: 767px) {
          .kd-dash-page { padding: 1.5rem 1.125rem 2rem; }
        }

        /* cards */
        .kd-dash-card {
          background: rgba(245,244,239,0.04);
          border: 1px solid rgba(245,244,239,0.08);
          border-radius: 1rem;
          padding: 1.5rem;
        }
        .kd-dash-card + .kd-dash-card { margin-top: 0.875rem; }

        /* status badges */
        .kd-status {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          letter-spacing: 0.01em;
        }

        /* section title */
        .kd-dash-title {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          color: var(--cream);
          margin-bottom: 0.375rem;
        }
        .kd-dash-subtitle {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: rgba(245,244,239,0.4);
          margin-bottom: 2rem;
        }

        /* stat cards */
        .kd-dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.875rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 599px) {
          .kd-dash-stats { grid-template-columns: 1fr 1fr; }
        }
        .kd-stat-card {
          background: rgba(245,244,239,0.04);
          border: 1px solid rgba(245,244,239,0.08);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
        }

        /* progress bar */
        .kd-progress-track {
          height: 0.3rem;
          background: rgba(245,244,239,0.1);
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 0.625rem;
        }
        .kd-progress-fill {
          height: 100%;
          background: var(--green3);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        /* empty state */
        .kd-dash-empty {
          text-align: center;
          padding: 3.5rem 2rem;
        }
        .kd-dash-empty p {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: rgba(245,244,239,0.35);
          margin-bottom: 1.25rem;
        }

        /* primary button */
        .kd-dash-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .kd-dash-btn:hover { background: var(--green2); }

        /* ghost button */
        .kd-dash-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(245,244,239,0.07);
          color: rgba(245,244,239,0.7);
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.625rem 1.125rem;
          border-radius: 0.625rem;
          text-decoration: none;
          border: 1px solid rgba(245,244,239,0.1);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .kd-dash-btn-ghost:hover {
          background: rgba(245,244,239,0.11);
          color: var(--cream);
        }

        /* label / metadata text */
        .kd-dash-label {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(245,244,239,0.3);
          margin-bottom: 0.3rem;
        }
        .kd-dash-value {
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--cream);
        }
      `}</style>

      <div className="kd-dash-root">

        {/* ── Desktop sidebar ── */}
        <aside className="kd-dash-sidebar">
          {/* Brand */}
          <div style={{ padding: "1.375rem 1.25rem 1.125rem", borderBottom: "1px solid rgba(245,244,239,0.06)" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
              <div style={{
                width: "1.875rem", height: "1.875rem", borderRadius: "0.5rem",
                background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", color: "var(--cream)" }}>
                Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
              </span>
            </Link>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "0.75rem",
              color: "rgba(245,244,239,0.28)", marginTop: "0.875rem", lineHeight: 1.45,
            }}>
              {userName || userEmail}
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ padding: "0.625rem 0", flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "3px", textTransform: "uppercase",
              color: "rgba(245,244,239,0.18)", padding: "0.625rem 1.25rem 0.625rem",
            }}>
              Client portal
            </p>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`kd-snav-item${isActive(item.href) ? " active" : ""}`}
              >
                {item.icon}
                {item.label}
                {item.href === "/dashboard/messages" && unreadMessages > 0 && (
                  <span className="kd-dash-msg-badge">{unreadMessages > 9 ? "9+" : unreadMessages}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(245,244,239,0.06)" }}>
            <button
              onClick={handleSignOut}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-sans)", fontSize: "0.8rem",
                color: "rgba(245,244,239,0.28)", background: "none",
                border: "none", cursor: "pointer", padding: "0.375rem 0",
                transition: "color 0.15s",
              }}
            >
              <IconLogOut />
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="kd-dash-main">
          {/* Mobile top bar */}
          <header className="kd-dash-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div style={{
                width: "1.625rem", height: "1.625rem", borderRadius: "0.4rem",
                background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="11" height="11" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--cream)" }}>
                {currentLabel}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "0.75rem",
                color: "rgba(245,244,239,0.3)", background: "none",
                border: "none", cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </header>

          {children}
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="kd-dash-bnav" aria-label="Mobile navigation">
        <div className="kd-dash-bnav-inner">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`kd-bnav-item${isActive(item.href) ? " active" : ""}`}
            >
              <span style={{ position: "relative" }}>
                {item.icon}
                {item.href === "/dashboard/messages" && unreadMessages > 0 && (
                  <span className="kd-dash-msg-dot" />
                )}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
