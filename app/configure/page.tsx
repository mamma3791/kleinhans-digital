"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const MAKE_WEBHOOK = "https://hook.eu1.make.com/jr7gnafrkqbs40c7jd7rvj5vbu7p9vbn";

const tiers = [
  {
    id: "starter",
    name: "Starter",
    basePrice: 6500,
    monthly: 650,
    desc: "Get online professionally from day one.",
    features: ["Up to 5 pages", "Mobile first design", "WhatsApp integration", "Contact form", "Google My Business setup", "SSL and hosting", "Basic SEO"],
  },
  {
    id: "growth",
    name: "Growth",
    basePrice: 12000,
    monthly: 1200,
    desc: "Generate leads and track performance.",
    features: ["Everything in Starter", "Social media integration", "Lead capture forms", "Google Analytics", "Looker Studio dashboard", "SEO reporting", "2 revisions/month"],
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 22000,
    monthly: 2200,
    desc: "Full digital presence with automation.",
    features: ["Everything in Growth", "Full lead funnel", "Google Ads management", "WhatsApp automation", "E-commerce", "Monthly strategy call", "Priority turnaround"],
  },
];

const addons = [
  { id: "extra_pages", label: "Additional pages (per 5)", price: 2000, consultative: false },
  { id: "ecommerce", label: "E-commerce store", price: 5000, consultative: false },
  { id: "branding", label: "Branding and logo design", price: 0, consultative: true },
  { id: "whatsapp_bot", label: "WhatsApp chatbot", price: 0, consultative: true },
  { id: "google_ads", label: "Google Ads setup and management", price: 2000, consultative: false },
  { id: "photography", label: "Product or business photography", price: 0, consultative: true },
  { id: "multilocation", label: "Multi-location or franchise site", price: 0, consultative: true },
];

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const initialTier = searchParams.get("tier") || "starter";
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowLogin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const tier = tiers.find(t => t.id === selectedTier) || tiers[0];

  const calcPrice = () => {
    let base = tier.basePrice;
    let monthly = tier.monthly;
    let consultative = false;
    selectedAddons.forEach(id => {
      const addon = addons.find(a => a.id === id);
      if (addon) {
        if (addon.consultative) { consultative = true; }
        else { base += addon.price; }
      }
    });
    return { base, monthly, consultative };
  };

  const { base, monthly, consultative } = calcPrice();

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) { setShowLogin(true); return; }
    setSubmitting(true);

    const { base, monthly, consultative } = calcPrice();

    const { error } = await supabase.from("quotes").insert({
      user_id: user.id,
      tier: selectedTier,
      addons: selectedAddons,
      base_price: base,
      monthly_price: monthly,
      is_consultative: consultative,
      message,
      status: "submitted",
    });

    if (!error) {
      await fetch(MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote_submitted",
          user_email: user.email,
          user_name: user.user_metadata?.full_name,
          tier: selectedTier,
          addons: selectedAddons,
          base_price: consultative ? "Consultative" : `R${base.toLocaleString()}`,
          monthly_price: `R${monthly.toLocaleString()}/mo`,
          message,
        }),
      }).catch(() => {});
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/configure`,
      },
    });
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "32rem" }}>
          <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--dark)", marginBottom: "1rem" }}>Quote submitted.</h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            We will review your brief and be in touch within 24 hours to discuss next steps.
          </p>
          <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.875rem 1.75rem", borderRadius: "9999px", textDecoration: "none" }}>
            Go to your dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{`
        .kd-cfg-tier {
          border: 1.5px solid rgba(45,106,79,0.15);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--cream);
          text-align: left;
        }
        .kd-cfg-tier:hover { border-color: var(--green); }
        .kd-cfg-tier.active { border-color: var(--green); background: rgba(58,138,98,0.05); }
        .kd-cfg-addon {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border: 1px solid rgba(45,106,79,0.12);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--cream);
          margin-bottom: 0.5rem;
        }
        .kd-cfg-addon:hover { border-color: var(--green); background: rgba(58,138,98,0.03); }
        .kd-cfg-addon.active { border-color: var(--green); background: rgba(58,138,98,0.06); }
        .kd-cfg-check {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0.375rem;
          border: 1.5px solid rgba(45,106,79,0.3);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .kd-cfg-addon.active .kd-cfg-check {
          background: var(--green);
          border-color: var(--green);
        }
        .kd-cfg-submit {
          width: 100%;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          padding: 1rem;
          border-radius: 0.875rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .kd-cfg-submit:hover { background: var(--green2); }
        .kd-cfg-submit:disabled { opacity: 0.6; cursor: default; }
        .kd-login-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,28,21,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
          backdrop-filter: blur(4px);
        }
        .kd-login-card {
          background: var(--cream);
          border-radius: 1.5rem;
          padding: 2.5rem;
          max-width: 28rem;
          width: 100%;
          text-align: center;
        }
        .kd-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          background: #fff;
          border: 1.5px solid rgba(26,36,32,0.15);
          border-radius: 0.75rem;
          padding: 0.875rem;
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--dark);
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          margin-top: 1.5rem;
        }
        .kd-google-btn:hover { border-color: var(--green); box-shadow: 0 2px 12px rgba(58,138,98,0.12); }
        @media (max-width: 1023px) {
          .kd-cfg-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--cream)", borderBottom: "1px solid rgba(45,106,79,0.1)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--dark)" }}>
            Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
          </span>
        </Link>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>{user.email}</span>
            <a href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--green)", textDecoration: "none" }}>Dashboard</a>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600, color: "var(--green)", background: "none", border: "none", cursor: "pointer" }}>
            Sign in
          </button>
        )}
      </nav>

      <div className="kd-container" style={{ padding: "3rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.75rem" }}>
            Build your quote
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Configure your project.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.975rem", color: "var(--muted)", lineHeight: 1.7 }}>
            Select a base package and add any extras you need. Your price updates in real time.
          </p>
        </div>

        <div className="kd-cfg-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>

          {/* Left — options */}
          <div>
            {/* Tier selection */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              1. Choose your base package
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {tiers.map(t => (
                <button key={t.id} className={`kd-cfg-tier${selectedTier === t.id ? " active" : ""}`} onClick={() => setSelectedTier(t.id)}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: selectedTier === t.id ? "var(--green)" : "var(--muted)", marginBottom: "0.375rem" }}>
                    {selectedTier === t.id ? "Selected" : "Select"}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "var(--dark)", marginBottom: "0.25rem" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.25rem", fontWeight: 600, color: "var(--green)", marginBottom: "0.375rem" }}>R{t.basePrice.toLocaleString()}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>+ R{t.monthly.toLocaleString()}/mo</div>
                </button>
              ))}
            </div>

            {/* Add-ons */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              2. Add extras (optional)
            </h2>
            {addons.map(addon => (
              <button key={addon.id} className={`kd-cfg-addon${selectedAddons.includes(addon.id) ? " active" : ""}`} onClick={() => toggleAddon(addon.id)} style={{ width: "100%" }}>
                <div className="kd-cfg-check">
                  {selectedAddons.includes(addon.id) && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--dark)", flex: 1, textAlign: "left" }}>{addon.label}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 600, color: addon.consultative ? "var(--muted)" : "var(--green)", flexShrink: 0 }}>
                  {addon.consultative ? "Consultative" : `+R${addon.price.toLocaleString()}`}
                </span>
              </button>
            ))}

            {/* Message */}
            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
                3. Anything else we should know?
              </h2>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell us about your business, your customers, your goals, or any specific requirements..."
                style={{ width: "100%", minHeight: "8rem", background: "var(--cream2)", border: "1px solid rgba(45,106,79,0.15)", borderRadius: "0.875rem", padding: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--dark)", resize: "vertical", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Right — summary */}
          <div style={{ position: "sticky", top: "5rem" }}>
            <div style={{ background: "var(--dark)", borderRadius: "1.375rem", padding: "2rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1.25rem" }}>
                Your quote
              </p>

              {/* Selected tier */}
              <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--cream)" }}>{tier.name}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--cream)" }}>R{tier.basePrice.toLocaleString()}</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.4)" }}>Base package</span>
              </div>

              {/* Selected addons */}
              {selectedAddons.length > 0 && (
                <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  {selectedAddons.map(id => {
                    const addon = addons.find(a => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.6)", flex: 1, paddingRight: "0.5rem" }}>{addon.label}</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: addon.consultative ? "rgba(245,244,239,0.4)" : "var(--green3)", flexShrink: 0 }}>
                          {addon.consultative ? "TBC" : `+R${addon.price.toLocaleString()}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>Once-off total</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.625rem", color: "var(--cream)" }}>
                    {consultative ? "Consultative" : `R${base.toLocaleString()}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>Monthly retainer</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--green3)" }}>R{monthly.toLocaleString()}/mo</span>
                </div>
                {consultative && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                    Some selections require a consultation to price accurately. We will confirm the full amount before any commitment.
                  </p>
                )}
              </div>

              <button className="kd-cfg-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : user ? "Submit my brief" : "Get my quote"}
              </button>

              {!user && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", textAlign: "center", marginTop: "0.75rem" }}>
                  You will be asked to sign in with Google to continue.
                </p>
              )}
            </div>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
              No payment required now. 50% deposit only once you approve the proposal.
            </p>
          </div>
        </div>
      </div>

      {/* Login overlay */}
      {showLogin && (
        <div className="kd-login-overlay" onClick={e => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div className="kd-login-card">
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.625rem", color: "var(--dark)", marginBottom: "0.625rem" }}>
              Almost there.
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
              Sign in with Google to submit your brief and track your project from your dashboard.
            </p>
            <button onClick={signInWithGoogle} className="kd-google-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={() => setShowLogin(false)} style={{ display: "block", margin: "1rem auto 0", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense>
      <ConfigureContent />
    </Suspense>
  );
}
