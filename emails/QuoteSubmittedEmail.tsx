import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const ADDON_LABELS: Record<string, string> = {
  extra_pages:   "Additional pages (per 5)",
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

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth:  "Growth",
  pro:     "Pro",
};

export type QuoteSubmittedEmailProps = {
  clientName: string;
  clientEmail: string;
  tier: string;
  basePrice: string;
  monthlyPrice: string;
  addons: string[];
  message: string;
};

export default function QuoteSubmittedEmail({
  clientName,
  clientEmail,
  tier,
  basePrice,
  monthlyPrice,
  addons,
  message,
}: QuoteSubmittedEmailProps) {
  const tierLabel = TIER_LABELS[tier] ?? tier;
  const addonLabels = addons.map(a => ADDON_LABELS[a] ?? a);
  const submittedAt = new Date().toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <Html lang="en">
      <Head />
      <Preview>New quote from {clientName} — {tierLabel} package</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td>
                    {/* Logo mark */}
                    <table style={{ display: "inline-table", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr>
                          <td style={logoBox}>
                            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ display: "block" }}>
                              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                            </svg>
                          </td>
                          <td style={{ paddingLeft: "10px", verticalAlign: "middle" }}>
                            <Text style={logoText}>
                              Kleinhans<span style={{ color: "#5dbf88" }}>.</span>Digital
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <Text style={headerMeta}>Admin notification</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Title */}
          <Section style={section}>
            <Heading style={h1}>New quote received</Heading>
            <Text style={mutedText}>{submittedAt}</Text>
          </Section>

          <Hr style={divider} />

          {/* Client info */}
          <Section style={section}>
            <Text style={label}>CLIENT</Text>
            <Text style={value}>{clientName || "—"}</Text>
            <Text style={mutedText}>{clientEmail}</Text>
          </Section>

          <Hr style={divider} />

          {/* Quote details */}
          <Section style={section}>
            <Text style={label}>PACKAGE</Text>
            <table style={{ borderCollapse: "collapse", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <td style={tierBadge}>{tierLabel}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                <tr>
                  <td style={priceBlock}>
                    <Text style={label}>ONCE-OFF</Text>
                    <Text style={priceText}>{basePrice}</Text>
                  </td>
                  <td style={priceBlock}>
                    <Text style={label}>MONTHLY</Text>
                    <Text style={priceText}>{monthlyPrice}</Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {addonLabels.length > 0 && (
              <>
                <Text style={label}>ADD-ONS</Text>
                {addonLabels.map(addon => (
                  <Text key={addon} style={addonItem}>· {addon}</Text>
                ))}
              </>
            )}
          </Section>

          {message && (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Text style={label}>CLIENT NOTE</Text>
                <Section style={messageBlock}>
                  <Text style={messageText}>{message}</Text>
                </Section>
              </Section>
            </>
          )}

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ ...section, textAlign: "center" as const, paddingBottom: "32px" }}>
            <Button href="https://kleinhansdigital.co.za/admin" style={ctaButton}>
              Review in Admin Panel →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Kleinhans Digital · info@kleinhansdigital.co.za · +27 66 241 0344
            </Text>
            <Text style={footerText}>This is an automated notification from your client portal.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#0a1510",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#0f1c15",
  border: "1px solid #1e3028",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#0b1712",
  borderBottom: "1px solid #1e3028",
  padding: "20px 28px",
};

const logoBox: React.CSSProperties = {
  backgroundColor: "#3a8a62",
  borderRadius: "7px",
  width: "30px",
  height: "30px",
  textAlign: "center",
  verticalAlign: "middle",
  padding: "8px",
};

const logoText: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "14px",
  fontWeight: "600",
  margin: 0,
  lineHeight: "1",
};

const headerMeta: React.CSSProperties = {
  color: "#4a6b58",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "2px",
  textTransform: "uppercase",
  margin: 0,
};

const section: React.CSSProperties = {
  padding: "24px 28px 0",
};

const h1: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 6px",
  lineHeight: "1.3",
};

const label: React.CSSProperties = {
  color: "#4a6b58",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  margin: "0 0 6px",
};

const value: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "17px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const mutedText: React.CSSProperties = {
  color: "#6b7c74",
  fontSize: "13px",
  margin: "0 0 4px",
};

const divider: React.CSSProperties = {
  borderColor: "#1e3028",
  borderStyle: "solid",
  borderWidth: "1px 0 0",
  margin: "24px 0 0",
};

const tierBadge: React.CSSProperties = {
  backgroundColor: "rgba(58,138,98,0.15)",
  color: "#5dbf88",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  padding: "5px 14px",
  borderRadius: "999px",
};

const priceBlock: React.CSSProperties = {
  paddingRight: "32px",
  paddingBottom: "8px",
  verticalAlign: "top",
};

const priceText: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0",
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const addonItem: React.CSSProperties = {
  color: "#8a9e94",
  fontSize: "13px",
  margin: "2px 0",
};

const messageBlock: React.CSSProperties = {
  backgroundColor: "#0b1712",
  border: "1px solid #1e3028",
  borderRadius: "8px",
  padding: "14px 16px",
  marginTop: "4px",
};

const messageText: React.CSSProperties = {
  color: "#8a9e94",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: 0,
  fontStyle: "italic",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#3a8a62",
  borderRadius: "999px",
  color: "#f5f4ef",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "14px 32px",
  textDecoration: "none",
  marginTop: "24px",
};

const footer: React.CSSProperties = {
  backgroundColor: "#0b1712",
  borderTop: "1px solid #1e3028",
  padding: "18px 28px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "#3a5244",
  fontSize: "11px",
  margin: "2px 0",
};
