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

export type ContactFormEmailProps = {
  name: string;
  business: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

export default function ContactFormEmail({
  name,
  business,
  email,
  phone,
  message,
  submittedAt,
}: ContactFormEmailProps) {
  const replyLink = `mailto:${email}?subject=Re: Your enquiry — Kleinhans Digital`;

  return (
    <Html lang="en">
      <Head />
      <Preview>New contact from {name}{business ? ` — ${business}` : ""}</Preview>
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
                  <td style={{ textAlign: "right", paddingLeft: "40px", verticalAlign: "middle" }}>
                    <Text style={headerMeta}>Contact form</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Title */}
          <Section style={section}>
            <Heading style={h1}>New contact form submission</Heading>
            <Text style={mutedText}>{submittedAt}</Text>
          </Section>

          <Hr style={divider} />

          {/* Contact details */}
          <Section style={section}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                <tr>
                  <td style={detailBlock}>
                    <Text style={label}>NAME</Text>
                    <Text style={value}>{name}</Text>
                  </td>
                  <td style={detailBlock}>
                    <Text style={label}>BUSINESS</Text>
                    <Text style={value}>{business || "—"}</Text>
                  </td>
                </tr>
                <tr>
                  <td style={{ ...detailBlock, paddingTop: "16px" }}>
                    <Text style={label}>EMAIL</Text>
                    <Text style={value}>{email}</Text>
                  </td>
                  <td style={{ ...detailBlock, paddingTop: "16px" }}>
                    <Text style={label}>PHONE</Text>
                    <Text style={value}>{phone || "—"}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Message */}
          <Section style={section}>
            <Text style={label}>MESSAGE</Text>
            <Section style={messageBlock}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={{ ...section, paddingBottom: "36px", paddingTop: "28px" }}>
            <Button href={replyLink} style={ctaButton}>
              Reply to {name} →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Kleinhans Digital · info@kleinhansdigital.co.za · +27 66 241 0344
            </Text>
            <Text style={footerText}>Submitted via kleinhansdigital.co.za/contact</Text>
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
  fontSize: "15px",
  fontWeight: "500",
  margin: 0,
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

const detailBlock: React.CSSProperties = {
  verticalAlign: "top",
  width: "50%",
  paddingBottom: "4px",
};

const messageBlock: React.CSSProperties = {
  backgroundColor: "#0b1712",
  border: "1px solid #1e3028",
  borderRadius: "8px",
  padding: "16px 18px",
  marginTop: "4px",
};

const messageText: React.CSSProperties = {
  color: "#8a9e94",
  fontSize: "14px",
  lineHeight: "1.7",
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
