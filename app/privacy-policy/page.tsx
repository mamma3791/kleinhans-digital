import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Kleinhans Digital. How we collect, use, and protect your personal information in compliance with POPIA.",
  alternates: { canonical: "https://kleinhansdigital.co.za/privacy-policy" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "14 April 2026";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{`
        .kd-legal-h2 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--dark);
          margin-top: 3rem;
          margin-bottom: 0.875rem;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .kd-legal-h3 {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--dark);
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .kd-legal-p {
          font-family: var(--font-sans);
          font-weight: 300;
          font-size: 0.9875rem;
          line-height: 1.85;
          color: var(--muted);
          margin-bottom: 1rem;
        }
        .kd-legal-ul {
          padding-left: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .kd-legal-ul li {
          font-family: var(--font-sans);
          font-weight: 300;
          font-size: 0.9875rem;
          line-height: 1.8;
          color: var(--muted);
          margin-bottom: 0.375rem;
        }
        .kd-legal-divider {
          border: none;
          border-top: 1px solid rgba(45,106,79,0.12);
          margin: 2rem 0;
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--cream)", borderBottom: "1px solid rgba(45,106,79,0.1)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--dark)" }}>
            Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
          </span>
        </Link>
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          Back to site
        </Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(45,106,79,0.12)" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "1rem" }}>
            Legal
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Privacy Policy
          </h1>
          <p className="kd-legal-p" style={{ marginBottom: 0 }}>
            Last updated: {LAST_UPDATED}. This policy applies to Kleinhans Digital, a trading name of <strong>LRWKleinhans (Pty) Ltd</strong>, registered in South Africa.
          </p>
        </div>

        {/* Section 1 */}
        <h2 className="kd-legal-h2" style={{ marginTop: 0 }}>1. Who We Are</h2>
        <p className="kd-legal-p">
          Kleinhans Digital is a web design and digital marketing studio based in Johannesburg, Gauteng, South Africa. We are registered under LRWKleinhans (Pty) Ltd and operate in compliance with the Protection of Personal Information Act, 2013 (<strong>POPIA</strong>), South Africa&apos;s primary data privacy legislation.
        </p>
        <p className="kd-legal-p">
          We act as the <strong>Responsible Party</strong> for personal information collected through this website. Our contact details for privacy matters are set out at the end of this policy.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 2 */}
        <h2 className="kd-legal-h2">2. Information We Collect</h2>
        <p className="kd-legal-p">
          We collect personal information only when necessary to provide our services or respond to your enquiries. The categories of information we collect are:
        </p>

        <h3 className="kd-legal-h3">Contact form submissions</h3>
        <p className="kd-legal-p">
          When you submit the contact form on our website, we collect your name, business name, email address, phone number, and the content of your message. This information is used solely to respond to your enquiry.
        </p>

        <h3 className="kd-legal-h3">Quote and account registration</h3>
        <p className="kd-legal-p">
          If you use the &ldquo;Get a Quote&rdquo; feature, we ask for your name, business name, phone number, and email address. This information is stored securely and used to prepare your project proposal and manage your account.
        </p>

        <h3 className="kd-legal-h3">Authentication</h3>
        <p className="kd-legal-p">
          If you sign in using Google OAuth, we receive your name and email address from Google. We do not receive your Google password or payment information. You may review Google&apos;s privacy policy for details on how they process your data.
        </p>

        <h3 className="kd-legal-h3">Usage data</h3>
        <p className="kd-legal-p">
          We may collect anonymised information about how visitors use our website, including pages viewed and time spent on site, through analytics tools. This data cannot be used to identify you individually.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 3 */}
        <h2 className="kd-legal-h2">3. How We Use Your Information</h2>
        <p className="kd-legal-p">We use your personal information for the following purposes:</p>
        <ul className="kd-legal-ul">
          <li>To respond to your enquiries and provide quotations for our services</li>
          <li>To manage your project and communicate progress updates</li>
          <li>To send you invoices and process payments</li>
          <li>To provide ongoing support and maintenance under your retainer agreement</li>
          <li>To send service-related communications (not marketing) where required</li>
          <li>To comply with our legal obligations under South African law</li>
        </ul>
        <p className="kd-legal-p">
          We will not sell, rent, or share your personal information with third parties for their marketing purposes. We will not send you unsolicited marketing communications without your explicit consent.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 4 */}
        <h2 className="kd-legal-h2">4. Data Storage and Security</h2>
        <p className="kd-legal-p">
          Your data is stored using <strong>Supabase</strong>, a secure cloud database platform with infrastructure hosted on Amazon Web Services. Supabase applies industry-standard encryption at rest and in transit. Access to your data is restricted to authorised personnel only.
        </p>
        <p className="kd-legal-p">
          While we implement reasonable technical and organisational measures to protect your information, no method of electronic storage is completely secure. We encourage you to contact us immediately if you believe your account has been compromised.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 5 */}
        <h2 className="kd-legal-h2">5. Third-Party Services</h2>
        <p className="kd-legal-p">We use the following third-party services in the operation of this website:</p>
        <ul className="kd-legal-ul">
          <li><strong>Supabase</strong> — authentication and database storage</li>
          <li><strong>Google OAuth</strong> — sign-in functionality</li>
          <li><strong>Web3Forms</strong> — contact form email delivery</li>
          <li><strong>Make.com (Integromat)</strong> — workflow automation for internal notifications when quotes are submitted</li>
          <li><strong>Google Fonts</strong> — font delivery</li>
          <li><strong>Microlink</strong> — website screenshot generation for our portfolio section</li>
        </ul>
        <p className="kd-legal-p">
          Each of these services has their own privacy policies. We encourage you to review them. We only share the minimum information required for each service to function.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 6 */}
        <h2 className="kd-legal-h2">6. Your Rights Under POPIA</h2>
        <p className="kd-legal-p">As a data subject under POPIA, you have the following rights:</p>
        <ul className="kd-legal-ul">
          <li><strong>Right of access</strong> — you may request a copy of the personal information we hold about you</li>
          <li><strong>Right to correction</strong> — you may request that inaccurate information be corrected</li>
          <li><strong>Right to deletion</strong> — you may request that we delete your personal information, subject to any legal retention obligations</li>
          <li><strong>Right to object</strong> — you may object to the processing of your personal information in certain circumstances</li>
          <li><strong>Right to complain</strong> — you have the right to lodge a complaint with the Information Regulator of South Africa</li>
        </ul>
        <p className="kd-legal-p">
          To exercise any of these rights, please contact us using the details below. We will respond within 30 days.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 7 */}
        <h2 className="kd-legal-h2">7. Cookies</h2>
        <p className="kd-legal-p">
          This website uses essential cookies required for authentication and session management. These cookies are strictly necessary for the website to function and cannot be disabled if you wish to use account features.
        </p>
        <p className="kd-legal-p">
          We do not use advertising or tracking cookies. If analytics are in use, they are configured to anonymise your IP address and do not create individual user profiles.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 8 */}
        <h2 className="kd-legal-h2">8. Data Retention</h2>
        <p className="kd-legal-p">
          We retain your personal information for as long as necessary to provide our services and meet our legal obligations:
        </p>
        <ul className="kd-legal-ul">
          <li>Account and quote data: retained for the duration of our business relationship and up to 5 years thereafter for financial record-keeping purposes</li>
          <li>Contact form submissions: retained for up to 2 years unless a project relationship begins</li>
          <li>Anonymised analytics data: retained indefinitely as it cannot identify individuals</li>
        </ul>
        <p className="kd-legal-p">
          You may request deletion of your account and associated data at any time by contacting us.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 9 */}
        <h2 className="kd-legal-h2">9. Changes to This Policy</h2>
        <p className="kd-legal-p">
          We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically. Continued use of our website after any changes constitutes acceptance of the updated policy.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 10 */}
        <h2 className="kd-legal-h2">10. Contact Us</h2>
        <p className="kd-legal-p">
          For any privacy-related queries, to exercise your rights, or to submit a complaint, please contact our Information Officer:
        </p>
        <ul className="kd-legal-ul">
          <li><strong>Company:</strong> LRWKleinhans (Pty) Ltd (trading as Kleinhans Digital)</li>
          <li><strong>Email:</strong> <a href="mailto:info@kleinhansdigital.co.za" style={{ color: "var(--green)" }}>info@kleinhansdigital.co.za</a></li>
          <li><strong>WhatsApp:</strong> <a href="https://wa.me/27662410344" style={{ color: "var(--green)" }}>+27 66 241 0344</a></li>
          <li><strong>Location:</strong> Johannesburg, Gauteng, South Africa</li>
        </ul>
        <p className="kd-legal-p">
          You also have the right to lodge a complaint with the <strong>Information Regulator of South Africa</strong>: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>www.justice.gov.za/inforeg</a>
        </p>

        {/* Footer links */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(45,106,79,0.12)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/terms-of-service" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--green)", textDecoration: "none" }}>
            Terms of Service →
          </Link>
          <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
