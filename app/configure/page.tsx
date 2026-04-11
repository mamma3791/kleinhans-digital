"use client";
import { useState, useEffect, Suspense } from "react";
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
    includedAddons: [] as string[],
  },
  {
    id: "growth",
    name: "Growth",
    basePrice: 12000,
    monthly: 1200,
    desc: "Generate leads and track your performance.",
    features: ["Everything in Starter", "Social media integration", "Lead capture forms", "Google Analytics", "Looker Studio dashboard", "SEO reporting", "2 revisions/month"],
    includedAddons: ["seo_reporting", "lead_funnel"] as string[],
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 22000,
    monthly: 2200,
    desc: "Full digital presence with automation.",
    features: ["Everything in Growth", "Full lead funnel", "WhatsApp automation setup", "E-commerce integration", "Monthly strategy call", "Priority turnaround", "Monthly SEO reporting"],
    includedAddons: ["seo_reporting", "lead_funnel", "ecommerce"] as string[],
  },
];

const addons = [
  { id: "extra_pages", label: "Additional pages (per 5)", price: 2000, consultative: false },
  { id: "ecommerce", label: "E-commerce store", price: 5000, consultative: false },
  { id: "lead_funnel", label: "Lead funnel and landing page", price: 3000, consultative: false },
  { id: "seo_reporting", label: "Monthly SEO reporting and updates", price: 800, consultative: false },
  { id: "branding", label: "Branding and logo design", price: 0, consultative: true },
  { id: "whatsapp_bot", label: "WhatsApp chatbot", price: 0, consultative: true },
  { id: "google_ads", label: "Google Ads management", price: 0, consultative: true },
  { id: "photography", label: "Product or business photography", price: 0, consultative: true },
  { id: "multilocation", label: "Multi-location or franchise site", price: 0, consultative: true },
  { id: "copywriting", label: "Professional copywriting", price: 0, consultative: true },
  { id: "maintenance", label: "Ongoing maintenance and support retainer", price: 0, consultative: true },
];

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const initialTier = searchParams.get("tier") || "starter";
  const initialAddons = searchParams.get("addons")?.split(",").filter(Boolean) || [];
  const initialMessage = searchParams.get("message") || "";

  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialAddons);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Auto-tick included addons when tier changes — but only if user hasn't restored from URL
  useEffect(() => {
    if (initialAddons.length === 0) {
      const tier = tiers.find(t => t.id === selectedTier);
      if (tier) setSelectedAddons(tier.includedAddons);
    }
  }, [selectedTier]);

  const tier = tiers.find(t => t.id === selectedTier) || tiers[0];
  const isIncluded = (id: string) => tier.includedAddons.includes(id);

  const calcPrice = (overrideTier?: string, overrideAddons?: string[]) => {
    const t = tiers.find(x => x.id === (overrideTier || selectedTier)) || tiers[0];
    let base = t.basePrice;
    const monthly = t.monthly;
    let consultative = false;
    (overrideAddons || selectedAddons).forEach(id => {
      if (t.includedAddons.includes(id)) return;
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
    if (isIncluded(id)) return; // can't deselect included addons
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      const params = new URLSearchParams({
        tier: selectedTier,
        addons: selectedAddons.join(","),
        message: message,
        return: "configure",
      });
      router.push(`/login?${params.toString()}`);
      return;
    }
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
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", padding: "0.875rem 1.75rem", borderRadius: "9999px", textDecoration: "none" }}>
            Go to your dashboard
          </Link>
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
          width: 100%;
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
          transition: all 0.2s ease;
          background: var(--cream);
          margin-bottom: 0.5rem;
          width: 100%;
        }
        .kd-cfg-addon.selectable { cursor: pointer; }
        .kd-cfg-addon.selectable:hover { border-color: var(--green); background: rgba(58,138,98,0.03); }
        .kd-cfg-addon.active { border-color: var(--green); background: rgba(58,138,98,0.06); }
        .kd-cfg-addon.included { border-color: rgba(58,138,98,0.3); background: rgba(58,138,98,0.04); opacity: 0.8; cursor: default; }
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
        .kd-cfg-addon.active .kd-cfg-check,
        .kd-cfg-addon.included .kd-cfg-check {
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
          position: fixed; inset: 0;
          background: rgba(15,28,21,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 1.5rem;
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
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
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
          .kd-cfg-sticky { position: static !important; }
        }
        @media (max-width: 639px) {
          .kd-cfg-tiers { grid-template-columns: 1fr !important; }
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
          <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--green)", textDecoration: "none" }}>Dashboard</Link>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600, color: "var(--green)", background: "none", border: "none", cursor: "pointer" }}>
            Sign in
          </button>
        )}
      </nav>

      <div className="kd-container" style={{ padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.75rem" }}>
            Build your quote
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Configure your project.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.975rem", color: "var(--muted)", lineHeight: 1.7 }}>
            Select a base package and add extras. Included features are pre-selected. Your price updates in real time.
          </p>
        </div>

        <div className="kd-cfg-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>

          <div>
            {/* Tier selection */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              1. Choose your base package
            </h2>
            <div className="kd-cfg-tiers" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {tiers.map(t => (
                <button key={t.id} className={`kd-cfg-tier${selectedTier === t.id ? " active" : ""}`} onClick={() => setSelectedTier(t.id)}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: selectedTier === t.id ? "var(--green)" : "var(--muted)", marginBottom: "0.375rem" }}>
                    {selectedTier === t.id ? "Selected" : "Select"}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", color: "var(--dark)", marginBottom: "0.25rem" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", fontWeight: 600, color: "var(--green)", marginBottom: "0.25rem" }}>R{t.basePrice.toLocaleString()}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>+ R{t.monthly.toLocaleString()}/mo</div>
                </button>
              ))}
            </div>

            {/* Add-ons */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>
              2. Add extras
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Ticked items are included in your selected package.
            </p>
            {addons.map(addon => {
              const included = isIncluded(addon.id);
              const active = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  className={`kd-cfg-addon${active ? " active" : ""}${included ? " included" : " selectable"}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <div className="kd-cfg-check">
                    {active && (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--dark)", flex: 1, textAlign: "left" }}>
                    {addon.label}
                    {included && <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--green)", marginLeft: "0.5rem" }}>Included</span>}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 600, color: addon.consultative ? "var(--muted)" : included ? "var(--green)" : "var(--green)", flexShrink: 0 }}>
                    {addon.consultative ? "Consultative" : included ? "✓" : `+R${addon.price.toLocaleString()}`}
                  </span>
                </button>
              );
            })}

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

          {/* Summary */}
          <div className="kd-cfg-sticky" style={{ position: "sticky", top: "5rem" }}>
            <div style={{ background: "var(--dark)", borderRadius: "1.375rem", padding: "2rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1.25rem" }}>
                Your quote
              </p>

              <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--cream)" }}>{tier.name}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--cream)" }}>R{tier.basePrice.toLocaleString()}</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.4)" }}>Base package</span>
              </div>

              {/* Extra addons only (not included ones) */}
              {selectedAddons.filter(id => !isIncluded(id)).length > 0 && (
                <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  {selectedAddons.filter(id => !isIncluded(id)).map(id => {
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

              {/* Upgrade nudge */}
              {selectedTier === "starter" && base >= 10000 && (
                <div style={{ marginTop: "1rem", padding: "0.875rem", background: "rgba(93,191,136,0.1)", borderRadius: "0.75rem", border: "1px solid rgba(93,191,136,0.25)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green3)", lineHeight: 1.5, margin: 0 }}>
                    Your extras are pushing you close to Growth (R12,000) which includes more features for a similar price.
                    <button onClick={() => setSelectedTier("growth")} style={{ display: "block", marginTop: "0.5rem", background: "none", border: "none", color: "var(--green3)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                      Switch to Growth
                    </button>
                  </p>
                </div>
              )}
              {selectedTier === "growth" && base >= 18000 && (
                <div style={{ marginTop: "1rem", padding: "0.875rem", background: "rgba(93,191,136,0.1)", borderRadius: "0.75rem", border: "1px solid rgba(93,191,136,0.25)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--green3)", lineHeight: 1.5, margin: 0 }}>
                    Your extras are close to Pro (R22,000) which includes everything plus a monthly strategy call and priority turnaround.
                    <button onClick={() => setSelectedTier("pro")} style={{ display: "block", marginTop: "0.5rem", background: "none", border: "none", color: "var(--green3)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                      Switch to Pro
                    </button>
                  </p>
                </div>
              )}

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