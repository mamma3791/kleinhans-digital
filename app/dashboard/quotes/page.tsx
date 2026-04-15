import { createClient } from "@/lib/supabase/server";

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth:  "Growth",
  pro:     "Pro",
};

const ADDON_LABELS: Record<string, string> = {
  extra_pages:   "Additional pages",
  ecommerce:     "E-commerce store",
  lead_funnel:   "Lead funnel & landing page",
  seo_reporting: "Monthly SEO reporting",
  branding:      "Branding & logo design",
  whatsapp_bot:  "WhatsApp chatbot",
  google_ads:    "Google Ads management",
  photography:   "Photography",
  multilocation: "Multi-location site",
  copywriting:   "Copywriting",
  maintenance:   "Maintenance retainer",
};

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  submitted:      { bg: "rgba(245,244,239,0.07)", color: "rgba(245,244,239,0.5)",  label: "Submitted" },
  reviewing:      { bg: "rgba(232,161,0,0.12)",   color: "#e8a100",                label: "Under review" },
  proposal_sent:  { bg: "rgba(99,130,245,0.14)",  color: "#99b3ff",               label: "Proposal sent" },
  approved:       { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "Approved" },
  in_progress:    { bg: "rgba(58,138,98,0.15)",   color: "#5dbf88",               label: "In progress" },
  completed:      { bg: "rgba(93,191,136,0.1)",   color: "rgba(93,191,136,0.55)", label: "Completed" },
  declined:       { bg: "rgba(220,60,60,0.14)",   color: "#f87171",               label: "Declined" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.submitted;
  return (
    <span className="kd-status" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default async function QuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, tier, addons, base_price, monthly_price, is_consultative, message, status, submitted_at")
    .eq("user_id", user!.id)
    .order("submitted_at", { ascending: false });

  const all = quotes ?? [];

  return (
    <div className="kd-dash-page">
      <h1 className="kd-dash-title">Quotes</h1>
      <p className="kd-dash-subtitle">Your quote requests and their current status.</p>

      {all.length === 0 ? (
        <div className="kd-dash-card kd-dash-empty">
          <p>No quotes yet. Use the quote builder to get pricing for your project.</p>
          <a href="/configure" className="kd-dash-btn">Get a quote</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {all.map(quote => {
            const tierLabel = TIER_LABELS[quote.tier] ?? quote.tier;
            const addonList = (quote.addons as string[] ?? []).map(a => ADDON_LABELS[a] ?? a);

            return (
              <div key={quote.id} className="kd-dash-card">
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,239,0.3)", marginBottom: "0.375rem" }}>
                      {new Date(quote.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", color: "var(--cream)" }}>
                      {tierLabel} Package
                    </div>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>

                {/* Pricing */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  {quote.is_consultative ? (
                    <div>
                      <div className="kd-dash-label">Pricing</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "rgba(245,244,239,0.55)" }}>
                        Consultative — custom quote to follow
                      </div>
                    </div>
                  ) : (
                    <>
                      {quote.base_price != null && (
                        <div>
                          <div className="kd-dash-label">Once-off</div>
                          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--cream)", lineHeight: 1 }}>
                            R{Number(quote.base_price).toLocaleString("en-ZA")}
                          </div>
                        </div>
                      )}
                      {quote.monthly_price != null && Number(quote.monthly_price) > 0 && (
                        <div>
                          <div className="kd-dash-label">Monthly</div>
                          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "rgba(245,244,239,0.6)", lineHeight: 1 }}>
                            R{Number(quote.monthly_price).toLocaleString("en-ZA")}
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(245,244,239,0.3)", marginLeft: "0.25rem" }}>/mo</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Add-ons */}
                {addonList.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div className="kd-dash-label" style={{ marginBottom: "0.5rem" }}>Add-ons</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                      {addonList.map(label => (
                        <span
                          key={label}
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.75rem",
                            color: "rgba(245,244,239,0.5)",
                            background: "rgba(245,244,239,0.05)",
                            border: "1px solid rgba(245,244,239,0.1)",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.625rem",
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {quote.message && (
                  <div style={{
                    background: "rgba(245,244,239,0.03)",
                    border: "1px solid rgba(245,244,239,0.06)",
                    borderRadius: "0.625rem",
                    padding: "0.875rem 1rem",
                  }}>
                    <div className="kd-dash-label" style={{ marginBottom: "0.375rem" }}>Your note</div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.5)", lineHeight: 1.65, margin: 0 }}>
                      {quote.message}
                    </p>
                  </div>
                )}

                {/* Status explanation */}
                {quote.status === "submitted" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.3)", marginTop: "1rem", marginBottom: 0 }}>
                    We&apos;ve received your quote request and will be in touch within 1 business day.
                  </p>
                )}
                {quote.status === "reviewing" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.3)", marginTop: "1rem", marginBottom: 0 }}>
                    We&apos;re reviewing your requirements and preparing a detailed proposal.
                  </p>
                )}
                {quote.status === "proposal_sent" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "rgba(245,244,239,0.3)", marginTop: "1rem", marginBottom: 0 }}>
                    A proposal has been sent — check your inbox or the Messages section.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
