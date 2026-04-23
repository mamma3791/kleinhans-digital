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

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth:  "Growth",
  pro:     "Pro",
};

export type QuoteApprovedEmailProps = {
  clientName: string;
  tier: string;
  projectName: string;
  basePrice?: string | null;
  monthlyPrice?: string | null;
  isConsultative?: boolean;
};

export default function QuoteApprovedEmail({
  clientName,
  tier,
  projectName,
  basePrice,
  monthlyPrice,
  isConsultative,
}: QuoteApprovedEmailProps) {
  const firstName = clientName?.split(" ")[0] || "there";
  const tierLabel = TIER_LABELS[tier] ?? tier;

  return (
    <Html lang="en">
      <Head />
      <Preview>Your {tierLabel} project is approved — let&apos;s get started</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={logoBox}>
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ display: "block" }}>
                      <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                    </svg>
                  </td>
                  <td style={{ paddingLeft: "10px", verticalAlign: "middle" }}>
                    <Text style={logoText}>Kleinhans<span style={{ color: "#5dbf88" }}>.</span>Digital</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            {/* Green tick */}
            <table style={{ marginBottom: "20px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={tickCircle}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ display: "block" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" stroke="white"/>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>

            <Heading style={h1}>
              Your project is approved{firstName ? `, ${firstName}` : ""}.
            </Heading>
            <Text style={heroSubtitle}>
              Great news — we&apos;re ready to kick off <strong style={{ color: "#f5f4ef" }}>{projectName}</strong>.
              Your deposit invoice is on its way and we&apos;ll begin as soon as it&apos;s settled.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Package summary */}
          <Section style={section}>
            <Text style={label}>YOUR PACKAGE</Text>
            <table style={{ borderCollapse: "collapse", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <td style={tierBadge}>{tierLabel}</td>
                </tr>
              </tbody>
            </table>

            {isConsultative ? (
              <Text style={mutedText}>Pricing will be confirmed in your proposal.</Text>
            ) : (
              <table style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    {basePrice && (
                      <td style={priceBlock}>
                        <Text style={label}>ONCE-OFF</Text>
                        <Text style={priceText}>{basePrice}</Text>
                      </td>
                    )}
                    {monthlyPrice && (
                      <td style={priceBlock}>
                        <Text style={label}>MONTHLY RETAINER</Text>
                        <Text style={priceText}>{monthlyPrice}</Text>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            )}
          </Section>

          <Hr style={divider} />

          {/* What happens next */}
          <Section style={section}>
            <Text style={label}>WHAT HAPPENS NEXT</Text>

            <table style={{ borderCollapse: "collapse", marginTop: "8px" }}>
              <tbody>
                <tr>
                  <td style={stepNum}><Text style={stepNumText}>1</Text></td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>Deposit invoice</Text>
                    <Text style={stepDesc}>We&apos;ll send your 50% deposit invoice shortly. Pay online or via EFT — details will be in the invoice.</Text>
                  </td>
                </tr>
                <tr><td colSpan={2} style={{ height: "16px" }} /></tr>
                <tr>
                  <td style={stepNum}><Text style={stepNumText}>2</Text></td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>Discovery call</Text>
                    <Text style={stepDesc}>Once your deposit is confirmed, we&apos;ll schedule a brief call to align on design direction and content.</Text>
                  </td>
                </tr>
                <tr><td colSpan={2} style={{ height: "16px" }} /></tr>
                <tr>
                  <td style={stepNum}><Text style={stepNumText}>3</Text></td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>We build, you track</Text>
                    <Text style={stepDesc}>Track progress, review milestones, and access all your assets in your client portal.</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* CTA */}
          <Section style={{ ...section, textAlign: "center" as const, paddingBottom: "36px", paddingTop: "28px" }}>
            <Button href="https://kleinhansdigital.co.za/dashboard" style={ctaButton}>
              View your client portal →
            </Button>
            <Text style={ctaCaption}>
              Track your project, view invoices, and send messages — all in one place.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Sign-off */}
          <Section style={{ padding: "24px 28px" }}>
            <Text style={signoff}>
              Looking forward to building something great together.
            </Text>
            <Text style={signoffName}>Jason Kleinhans</Text>
            <Text style={mutedText}>Kleinhans Digital</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or WhatsApp us at +27 72 634 0848
            </Text>
            <Text style={footerText}>
              info@kleinhansdigital.co.za · kleinhansdigital.co.za
            </Text>
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

const heroSection: React.CSSProperties = {
  padding: "36px 28px 28px",
};

const tickCircle: React.CSSProperties = {
  backgroundColor: "#3a8a62",
  borderRadius: "50%",
  width: "44px",
  height: "44px",
  textAlign: "center",
  verticalAlign: "middle",
  padding: "11px",
};

const h1: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 12px",
  lineHeight: "1.3",
};

const heroSubtitle: React.CSSProperties = {
  color: "#8a9e94",
  fontSize: "15px",
  lineHeight: "1.65",
  margin: 0,
};

const section: React.CSSProperties = {
  padding: "24px 28px 0",
};

const label: React.CSSProperties = {
  color: "#4a6b58",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  margin: "0 0 8px",
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
  paddingRight: "40px",
  paddingBottom: "4px",
  verticalAlign: "top",
};

const priceText: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "24px",
  fontWeight: "600",
  margin: 0,
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const stepNum: React.CSSProperties = {
  verticalAlign: "top",
  paddingRight: "14px",
  paddingTop: "2px",
};

const stepNumText: React.CSSProperties = {
  backgroundColor: "#1e3028",
  color: "#5dbf88",
  fontSize: "12px",
  fontWeight: "700",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  textAlign: "center",
  lineHeight: "26px",
  margin: 0,
  display: "block",
};

const stepContent: React.CSSProperties = {
  verticalAlign: "top",
};

const stepTitle: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const stepDesc: React.CSSProperties = {
  color: "#6b7c74",
  fontSize: "13px",
  lineHeight: "1.55",
  margin: 0,
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
};

const ctaCaption: React.CSSProperties = {
  color: "#4a6b58",
  fontSize: "12px",
  margin: "12px 0 0",
};

const signoff: React.CSSProperties = {
  color: "#8a9e94",
  fontSize: "14px",
  fontStyle: "italic",
  margin: "0 0 8px",
};

const signoffName: React.CSSProperties = {
  color: "#f5f4ef",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 2px",
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
