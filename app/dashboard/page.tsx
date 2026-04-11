"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Profile = { full_name: string; business_name: string; phone: string; email: string };
type Quote = { id: string; tier: string; addons: string[]; base_price: number; monthly_price: number; is_consultative: boolean; message: string; status: string; submitted_at: string };

const statusLabels: Record<string, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "#e8a100" },
  reviewing: { label: "Under review", color: "#3a8a62" },
  proposal_sent: { label: "Proposal sent", color: "#5dbf88" },
  in_progress: { label: "In progress", color: "#3a8a62" },
  completed: { label: "Completed", color: "#16a34a" },
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "quotes" | "settings">("overview");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/configure"); return; }

      const [{ data: profileData }, { data: quotesData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("quotes").select("*").eq("user_id", user.id).order("submitted_at", { ascending: false }),
      ]);

      setProfile(profileData);
      setQuotes(quotesData || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", fontSize: "0.9rem" }}>Loading your dashboard...</div>
      </div>
    );
  }

  const latestQuote = quotes[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream2)" }}>
      <style>{`
        .kd-dash-tab {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.625rem 1.25rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          background: none;
          color: var(--muted);
        }
        .kd-dash-tab.active {
          background: var(--dark);
          color: var(--cream);
        }
        .kd-dash-card {
          background: var(--cream);
          border-radius: 1.125rem;
          border: 1px solid rgba(45,106,79,0.1);
          padding: 1.75rem;
          margin-bottom: 1rem;
        }
        .kd-stat {
          background: var(--cream);
          border-radius: 1rem;
          border: 1px solid rgba(45,106,79,0.1);
          padding: 1.5rem;
          text-align: center;
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "var(--dark)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--cream)" }}>
            Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>{profile?.email}</span>
          <button onClick={handleSignOut} style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)", background: "none", border: "none", cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="kd-container" style={{ padding: "2.5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--dark)", marginBottom: "0.25rem" }}>
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
            </h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--muted)" }}>
              {profile?.business_name || "Your Kleinhans Digital dashboard"}
            </p>
          </div>
          <a href="/configure" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.75rem 1.5rem", borderRadius: "9999px", textDecoration: "none" }}>
            New quote
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.375rem", background: "rgba(45,106,79,0.06)", borderRadius: "9999px", padding: "0.25rem", marginBottom: "2rem", width: "fit-content" }}>
          {(["overview", "quotes", "settings"] as const).map(tab => (
            <button key={tab} className={`kd-dash-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Quotes submitted", value: quotes.length },
                { label: "Active projects", value: quotes.filter(q => q.status === "in_progress").length },
                { label: "Completed", value: quotes.filter(q => q.status === "completed").length },
              ].map(stat => (
                <div key={stat.label} className="kd-stat">
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: "var(--green)", lineHeight: 1, marginBottom: "0.375rem" }}>{stat.value}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Latest quote */}
            {latestQuote ? (
              <div className="kd-dash-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--dark)" }}>Latest quote</h2>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, padding: "0.375rem 0.875rem", borderRadius: "9999px", background: `${statusLabels[latestQuote.status]?.color}18`, color: statusLabels[latestQuote.status]?.color }}>
                    {statusLabels[latestQuote.status]?.label || latestQuote.status}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  {[
                    { label: "Package", value: latestQuote.tier.charAt(0).toUpperCase() + latestQuote.tier.slice(1) },
                    { label: "Once-off", value: latestQuote.is_consultative ? "Consultative" : `R${latestQuote.base_price.toLocaleString()}` },
                    { label: "Monthly", value: `R${latestQuote.monthly_price.toLocaleString()}/mo` },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.25rem" }}>{item.label}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600, color: "var(--dark)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kd-dash-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", marginBottom: "1.25rem" }}>No quotes yet. Start by configuring your project.</p>
                <a href="/configure" style={{ display: "inline-flex", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.75rem 1.5rem", borderRadius: "9999px", textDecoration: "none" }}>
                  Build your quote
                </a>
              </div>
            )}
          </div>
        )}

        {/* Quotes tab */}
        {activeTab === "quotes" && (
          <div>
            {quotes.length === 0 ? (
              <div className="kd-dash-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", marginBottom: "1.25rem" }}>No quotes submitted yet.</p>
                <a href="/configure" style={{ display: "inline-flex", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.75rem 1.5rem", borderRadius: "9999px", textDecoration: "none" }}>
                  Get a quote
                </a>
              </div>
            ) : quotes.map(quote => (
              <div key={quote.id} className="kd-dash-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--dark)" }}>
                        {quote.tier.charAt(0).toUpperCase() + quote.tier.slice(1)} package
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "9999px", background: `${statusLabels[quote.status]?.color}18`, color: statusLabels[quote.status]?.color }}>
                        {statusLabels[quote.status]?.label || quote.status}
                      </span>
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>
                      Submitted {new Date(quote.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "var(--dark)" }}>
                      {quote.is_consultative ? "Consultative" : `R${quote.base_price.toLocaleString()}`}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--green)" }}>
                      R{quote.monthly_price.toLocaleString()}/mo retainer
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <div className="kd-dash-card" style={{ maxWidth: "32rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--dark)", marginBottom: "1.5rem" }}>Your details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Full name", value: profile?.full_name || "" },
                { label: "Business name", value: profile?.business_name || "" },
                { label: "Phone", value: profile?.phone || "" },
                { label: "Email", value: profile?.email || "" },
              ].map(field => (
                <div key={field.label}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.25rem" }}>{field.label}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--dark)", padding: "0.875rem 1rem", background: "var(--cream2)", borderRadius: "0.75rem", border: "1px solid rgba(45,106,79,0.1)" }}>{field.value || "Not set"}</div>
                </div>
              ))}
              <a href="/onboarding" style={{ display: "inline-flex", justifyContent: "center", marginTop: "0.5rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.875rem", borderRadius: "0.75rem", textDecoration: "none" }}>
                Update details
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
