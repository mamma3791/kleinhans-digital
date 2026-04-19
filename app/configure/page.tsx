"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type TierType = "website" | "ai";

interface Tier {
  id: string;
  name: string;
  type: TierType;
  basePrice: number | null;
  monthly: number | null;
  desc: string;
  features: string[];
  includedAddons: string[];
  consultative: boolean;
}

const tiers: Tier[] = [
  {
    id: "intelligent_website",
    name: "Intelligent Website",
    type: "website",
    basePrice: 6500,
    monthly: 650,
    desc: "A website that qualifies leads, automates follow-ups, and reports on performance.",
    features: [
      "Custom-coded, mobile-first website",
      "AI-powered lead qualification forms",
      "Automated email follow-ups on enquiries",
      "WhatsApp click-to-chat with pre-filled messages",
      "Real-time analytics dashboard",
      "SEO optimised with schema markup",
      "Client portal with login",
      "SSL, hosting, backups, and maintenance",
    ],
    includedAddons: [],
    consultative: false,
  },
  {
    id: "ai_workflow",
    name: "AI Workflow",
    type: "ai",
    basePrice: 8000,
    monthly: 8000,
    desc: "We automate one of your manual, repetitive business processes with AI. The model runs locally on your premises.",
    features: [
      "Full workflow audit with your team",
      "Custom AI pipeline (document extraction, data processing, or admin automation)",
      "Integrates with your existing tools (email, WhatsApp, Sage, Xero, Excel)",
      "Local AI model deployed on your premises",
      "Review dashboard for human oversight",
      "Staff training and onboarding included",
      "POPIA compliant by design",
      "Monthly optimisation, monitoring, and support",
    ],
    includedAddons: [],
    consultative: true,
  },
  {
    id: "full_platform",
    name: "Full Platform",
    type: "ai",
    basePrice: 18000,
    monthly: 18000,
    desc: "Multiple AI workflows, a custom portal, automated reporting, and a website that drives it all.",
    features: [
      "Everything in AI Workflow",
      "Multiple automated processes",
      "Custom client or staff portal",
      "Automated invoicing and payment tracking",
      "Real-time reporting and anomaly alerts",
      "On-premise AI deployment with SLA",
      "Dedicated account manager",
      "Monthly strategy sessions for expansion",
    ],
    includedAddons: [],
    consultative: true,
  },
  {
    id: "custom_build",
    name: "Custom Build",
    type: "ai",
    basePrice: null,
    monthly: null,
    desc: "Internal tools, system integrations, chatbots, or a full product MVP. If you can describe it, we can build it.",
    features: [
      "Custom software development from scratch",
      "API integrations and data pipelines",
      "WhatsApp, Telegram, or web chatbots",
      "Legacy system modernisation",
      "Product MVP for startups",
      "E-commerce with AI-powered recommendations",
      "Ongoing retainer and support available",
    ],
    includedAddons: [],
    consultative: true,
  },
];

const websiteAddons = [
  { id: "extra_pages", label: "Additional pages (per 5)", price: 2000, consultative: false },
  { id: "ecommerce", label: "E-commerce store", price: 5000, consultative: false },
  { id: "lead_funnel", label: "Lead funnel and landing page", price: 3000, consultative: false },
  { id: "seo_reporting", label: "Monthly SEO reporting and updates", price: 800, consultative: false },
  { id: "branding", label: "Branding and logo design", price: 0, consultative: true },
  { id: "whatsapp_bot", label: "WhatsApp chatbot", price: 0, consultative: true },
  { id: "google_ads", label: "Google Ads management", price: 0, consultative: true },
  { id: "copywriting", label: "Professional copywriting", price: 0, consultative: true },
  { id: "maintenance", label: "Ongoing maintenance and support retainer", price: 0, consultative: true },
];

const aiAddons = [
  { id: "extra_workflow", label: "Additional AI workflow (per workflow)", price: 0, consultative: true },
  { id: "browser_automation", label: "Browser automation (AI operates your existing software)", price: 0, consultative: true },
  { id: "email_automation", label: "Email classification and auto-reply", price: 0, consultative: true },
  { id: "document_extraction", label: "Document scanning and data extraction (OCR + AI)", price: 0, consultative: true },
  { id: "whatsapp_integration", label: "WhatsApp integration", price: 0, consultative: true },
  { id: "client_portal", label: "Client-facing portal or dashboard", price: 0, consultative: true },
  { id: "reporting", label: "Automated reporting and alerts", price: 0, consultative: true },
  { id: "website_bundle", label: "Bundle with Intelligent Website", price: 6500, consultative: false },
];

const tierAliases: Record<string, string> = {
  "starter": "intelligent_website",
  "growth": "intelligent_website",
  "pro": "intelligent_website",
  "intelligent website": "intelligent_website",
  "ai workflow": "ai_workflow",
  "full platform": "full_platform",
  "custom build": "custom_build",
  "custom": "custom_build",
};

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const rawTier = searchParams.get("tier") || "intelligent_website";
  const resolvedTier = tierAliases[rawTier] || rawTier;
  const initialAddons = searchParams.get("addons")?.split(",").filter(Boolean) || [];
  const initialMessage = searchParams.get("message") || "";
  const autosubmit = searchParams.get("autosubmit");

  const [selectedTier, setSelectedTier] = useState(resolvedTier);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialAddons);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [submitted, setSubmitted] = useState(false);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && autosubmit === "1" && !hasAutoSubmitted.current && !submitted) {
      hasAutoSubmitted.current = true;
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const tier = tiers.find(t => t.id === selectedTier) || tiers[0];
  const addons = tier.type === "website" ? websiteAddons : aiAddons;
  const isIncluded = (id: string) => tier.includedAddons.includes(id);

  const calcPrice = () => {
    let base = tier.basePrice || 0;
    const monthly = tier.monthly || 0;
    let hasConsultative = tier.consultative;
    selectedAddons.forEach(id => {
      if (tier.includedAddons.includes(id)) return;
      const addon = addons.find(a => a.id === id);
      if (addon) {
        if (addon.consultative) { hasConsultative = true; }
        else { base += addon.price; }
      }
    });
    return { base, monthly, consultative: hasConsultative };
  };

  const { base, monthly, consultative } = calcPrice();

  const toggleAddon = (id: string) => {
    if (isIncluded(id)) return;
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
      await fetch("/api/quote-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote_submitted",
          user_email: user.email,
          user_name: user.user_metadata?.full_name,
          tier: selectedTier,
          addons: selectedAddons,
          base_price: consultative ? "Consultative" : `R${base.toLocaleString()}`,
          monthly_price: monthly ? `R${monthly.toLocaleString()}/mo` : "TBC",
          message,
        }),
      }).catch(() => {});
      setSubmitted(true);
    }
    setSubmitting(false);
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
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--dark)", marginBottom: "1rem" }}>
            {tier.consultative ? "Consultation request submitted." : "Quote submitted."}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            {tier.consultative
              ? "We will review your requirements and schedule a consultation within 24 hours to scope the project and confirm pricing."
              : "We will review your brief and be in touch within 24 hours to discuss next steps."
            }
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
        @media (max-width: 1023px) {
          .kd-cfg-layout { grid-template-columns: 1fr !important; }
          .kd-cfg-sticky { position: static !important; }
        }
        @media (max-width: 767px) {
          .kd-cfg-tiers { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 479px) {
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
          <Link href="/login" style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600, color: "var(--green)", textDecoration: "none" }}>
            Sign in
          </Link>
        )}
      </nav>

      <div className="kd-container" style={{ padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.75rem" }}>
            {tier.type === "ai" ? "Request a consultation" : "Build your quote"}
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            {tier.type === "ai" ? "Tell us what you need." : "Configure your project."}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.975rem", color: "var(--muted)", lineHeight: 1.7 }}>
            {tier.type === "ai"
              ? "Select your package, tell us about your workflows, and we will scope it properly in a consultation."
              : "Select a base package and add extras. Your price updates in real time."
            }
          </p>
        </div>

        <div className="kd-cfg-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>

          <div>
            {/* Tier selection */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              1. Choose your package
            </h2>
            <div className="kd-cfg-tiers" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "2.5rem" }}>
              {tiers.map(t => (
                <button
                  key={t.id}
                  className={`kd-cfg-tier${selectedTier === t.id ? " active" : ""}`}
                  onClick={() => { setSelectedTier(t.id); setSelectedAddons([]); }}
                >
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: selectedTier === t.id ? "var(--green)" : "var(--muted)", marginBottom: "0.375rem" }}>
                    {selectedTier === t.id ? "Selected" : t.type === "ai" ? "AI" : "Website"}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--dark)", marginBottom: "0.25rem" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600, color: "var(--green)", marginBottom: "0.25rem" }}>
                    {t.basePrice ? `From R${t.basePrice.toLocaleString()}` : "Let's scope it"}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>
                    {t.monthly ? (t.type === "ai" ? "per month" : `+ R${t.monthly.toLocaleString()}/mo`) : "Project based"}
                  </div>
                </button>
              ))}
            </div>

            {/* Features for selected tier */}
            <div style={{ marginBottom: "2.5rem", padding: "1.25rem 1.5rem", background: "rgba(58,138,98,0.03)", border: "1px solid rgba(58,138,98,0.1)", borderRadius: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.75rem" }}>
                What's included in {tier.name}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem 1.5rem" }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--green)" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>
              2. {tier.type === "ai" ? "What do you need automated?" : "Add extras"}
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1rem" }}>
              {tier.type === "ai"
                ? "Select everything that applies. This helps us scope the consultation."
                : "Ticked items are included in your selected package."
              }
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
                    {addon.consultative ? "Included in scope" : included ? "\u2713" : `+R${addon.price.toLocaleString()}`}
                  </span>
                </button>
              );
            })}

            {/* Message */}
            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
                3. {tier.type === "ai" ? "Tell us about your business" : "Anything else we should know?"}
              </h2>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={tier.type === "ai"
                  ? "Describe the manual processes you want automated, what software your team currently uses, how many staff are involved, and any specific pain points..."
                  : "Tell us about your business, your customers, your goals, or any specific requirements..."
                }
                style={{ width: "100%", minHeight: "8rem", background: "var(--cream2)", border: "1px solid rgba(45,106,79,0.15)", borderRadius: "0.875rem", padding: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--dark)", resize: "vertical", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="kd-cfg-sticky" style={{ position: "sticky", top: "5rem" }}>
            <div style={{ background: "var(--dark)", borderRadius: "1.375rem", padding: "2rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "var(--green3)", marginBottom: "1.25rem" }}>
                {tier.type === "ai" ? "Your request" : "Your quote"}
              </p>

              <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--cream)" }}>{tier.name}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--cream)" }}>
                    {tier.basePrice ? `R${tier.basePrice.toLocaleString()}` : "TBC"}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.4)" }}>
                  {tier.type === "ai" ? "Starting from" : "Base package"}
                </span>
              </div>

              {selectedAddons.filter(id => !isIncluded(id)).length > 0 && (
                <div style={{ borderBottom: "1px solid rgba(245,244,239,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  {selectedAddons.filter(id => !isIncluded(id)).map(id => {
                    const addon = addons.find(a => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.6)", flex: 1, paddingRight: "0.5rem" }}>{addon.label}</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: addon.consultative ? "rgba(245,244,239,0.4)" : "var(--green3)", flexShrink: 0 }}>
                          {addon.consultative ? "In scope" : `+R${addon.price.toLocaleString()}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                {tier.type === "ai" ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>Monthly from</span>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.625rem", color: "var(--cream)" }}>
                        {tier.monthly ? `R${tier.monthly.toLocaleString()}/mo` : "TBC"}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                      Final pricing confirmed after consultation based on the scope of automation required.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>Once-off total</span>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.625rem", color: "var(--cream)" }}>
                        {consultative ? "Consultative" : `R${base.toLocaleString()}`}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.5)" }}>Monthly retainer</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--green3)" }}>R{(monthly || 0).toLocaleString()}/mo</span>
                    </div>
                  </>
                )}
              </div>

              <button className="kd-cfg-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : user
                  ? (tier.type === "ai" ? "Request consultation" : "Submit my brief")
                  : (tier.type === "ai" ? "Request consultation" : "Get my quote")
                }
              </button>

              {!user && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.35)", textAlign: "center", marginTop: "0.75rem" }}>
                  You will be asked to sign in with Google to continue.
                </p>
              )}
            </div>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
              {tier.type === "ai"
                ? "No commitment required. We scope it first, you decide after."
                : "No payment required now. 50% deposit only once you approve the proposal."
              }
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
