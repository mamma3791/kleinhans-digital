import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Kleinhans Digital. Website design, development, and digital marketing service agreements for South African businesses.",
  alternates: { canonical: "https://kleinhansdigital.co.za/terms-of-service" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "14 April 2026";

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="kd-legal-p" style={{ marginBottom: 0 }}>
            Last updated: {LAST_UPDATED}. These terms apply to all services provided by <strong>LRWKleinhans (Pty) Ltd</strong>, trading as Kleinhans Digital, registered in South Africa.
          </p>
        </div>

        {/* Section 1 */}
        <h2 className="kd-legal-h2" style={{ marginTop: 0 }}>1. Agreement to Terms</h2>
        <p className="kd-legal-p">
          By engaging Kleinhans Digital for any service — whether via our website, email, WhatsApp, or verbal agreement — you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not proceed with any engagement.
        </p>
        <p className="kd-legal-p">
          These terms form a binding contract between you (the &ldquo;Client&rdquo;) and LRWKleinhans (Pty) Ltd (the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). All engagements are governed by South African law.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 2 */}
        <h2 className="kd-legal-h2">2. Services</h2>
        <p className="kd-legal-p">
          Kleinhans Digital provides web design, web development, SEO, branding, e-commerce, and digital marketing services. The specific scope of each engagement is confirmed in the project proposal we send you following your quote request.
        </p>
        <p className="kd-legal-p">
          We reserve the right to decline any project at our sole discretion. Submission of a quote request does not constitute a binding agreement. A binding agreement is only formed once you have accepted our written proposal and paid the required deposit.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 3 */}
        <h2 className="kd-legal-h2">3. Quotes and Proposals</h2>
        <p className="kd-legal-p">
          Quote estimates provided through our website configurator are indicative only. Final pricing is confirmed in a written proposal issued by us after reviewing your brief.
        </p>
        <p className="kd-legal-p">
          Proposals are valid for <strong>14 days</strong> from the date of issue. After this period, pricing may be subject to change. Once a proposal is accepted and a deposit received, the price is fixed for the agreed scope.
        </p>
        <p className="kd-legal-p">
          Changes to the agreed scope after project commencement may be subject to additional charges, which will be quoted and agreed in writing before any additional work begins.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 4 */}
        <h2 className="kd-legal-h2">4. Payment Terms</h2>
        <h3 className="kd-legal-h3">Once-off project fee</h3>
        <p className="kd-legal-p">
          All once-off project fees are payable in two instalments:
        </p>
        <ul className="kd-legal-ul">
          <li><strong>50% deposit</strong> is required before project work begins</li>
          <li><strong>50% balance</strong> is due on the day of site launch or handover</li>
        </ul>
        <p className="kd-legal-p">
          Work will not commence until the deposit has cleared. The site will not be made live or transferred to the Client until the balance has been paid in full.
        </p>

        <h3 className="kd-legal-h3">Monthly retainer</h3>
        <p className="kd-legal-p">
          Where a monthly retainer is included in your package, it becomes due from the launch date and is payable monthly in advance via EFT or debit order. The retainer covers hosting, SSL certificate, security updates, and the monthly maintenance allocation specified in your package.
        </p>
        <p className="kd-legal-p">
          Retainers must be maintained to keep your site live. Sites on accounts with outstanding retainer balances exceeding 30 days may be suspended pending payment. Sites on accounts exceeding 60 days overdue may be taken offline entirely, at our discretion.
        </p>

        <h3 className="kd-legal-h3">All prices</h3>
        <p className="kd-legal-p">
          All prices are quoted in South African Rand (ZAR) and <strong>exclude VAT</strong>. Where VAT is applicable, it will be added to your invoice at the prevailing rate.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 5 */}
        <h2 className="kd-legal-h2">5. Project Delivery</h2>
        <p className="kd-legal-p">
          Our target delivery timeframe for standard projects is <strong>14 days</strong> from the date the deposit is received and all required content is provided. This is a target, not a guarantee. Complex projects or delays in content provision may extend the timeline.
        </p>
        <p className="kd-legal-p">
          Delivery timelines are contingent on the Client providing all required materials (copy, images, brand assets, login credentials, etc.) promptly. Delays caused by late content provision will not extend our responsibility to deliver within the original target.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 6 */}
        <h2 className="kd-legal-h2">6. Client Responsibilities</h2>
        <p className="kd-legal-p">The Client is responsible for:</p>
        <ul className="kd-legal-ul">
          <li>Providing all required content, images, and brand assets in a timely manner</li>
          <li>Ensuring that any content provided does not infringe any third-party rights (copyright, trademarks, etc.)</li>
          <li>Providing timely feedback during the design review phase</li>
          <li>Ensuring that domain name registrations and third-party account credentials are accessible when required</li>
          <li>Keeping their account login credentials secure and not sharing them with unauthorised parties</li>
        </ul>

        <hr className="kd-legal-divider" />

        {/* Section 7 */}
        <h2 className="kd-legal-h2">7. Revisions</h2>
        <p className="kd-legal-p">
          Revisions included in your package are specified in your proposal. Minor content updates and design tweaks within the agreed scope are included. The following are generally not included in standard revision rounds:
        </p>
        <ul className="kd-legal-ul">
          <li>Complete redesigns or changes to the agreed concept direction</li>
          <li>Additional pages beyond the agreed scope</li>
          <li>Changes requested after final approval has been given</li>
          <li>Changes arising from the Client providing different requirements after project commencement</li>
        </ul>
        <p className="kd-legal-p">
          Out-of-scope revisions will be quoted separately and require written approval before commencement.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 8 */}
        <h2 className="kd-legal-h2">8. Intellectual Property</h2>
        <p className="kd-legal-p">
          Upon receipt of final payment, the Client receives full ownership of the website design and all custom assets created for the project, including graphics, copy, and code written specifically for the engagement.
        </p>
        <p className="kd-legal-p">
          We retain the right to display the completed work in our portfolio, on social media, and in marketing materials. If you require this right to be waived, please notify us in writing prior to project commencement.
        </p>
        <p className="kd-legal-p">
          Third-party assets, fonts, stock images, or software used in the project remain subject to their respective licences. We will disclose any significant third-party components used in your project.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 9 */}
        <h2 className="kd-legal-h2">9. Hosting and Maintenance</h2>
        <p className="kd-legal-p">
          Where hosting is included in your retainer, we will maintain uptime using our hosting infrastructure. We use reputable global CDN and hosting providers (currently Vercel, Cloudflare, and/or similar platforms). We cannot guarantee 100% uptime and are not liable for downtime caused by third-party infrastructure failures, force majeure events, or cyberattacks beyond our control.
        </p>
        <p className="kd-legal-p">
          Regular backups are performed as part of our hosting infrastructure. However, we recommend that clients maintain their own off-site backups for critical business data.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 10 */}
        <h2 className="kd-legal-h2">10. Cancellation</h2>
        <p className="kd-legal-p">
          Either party may cancel the project prior to completion with written notice. In the event of cancellation:
        </p>
        <ul className="kd-legal-ul">
          <li>The deposit is non-refundable if work has commenced</li>
          <li>You will be invoiced for work completed to the date of cancellation at our standard hourly rate, with any excess deposit applied as a credit</li>
          <li>Monthly retainers may be cancelled with 30 days&apos; written notice. Retainer cancellation will result in hosting services being terminated at the end of the notice period</li>
        </ul>

        <hr className="kd-legal-divider" />

        {/* Section 11 */}
        <h2 className="kd-legal-h2">11. Limitation of Liability</h2>
        <p className="kd-legal-p">
          To the maximum extent permitted by South African law, Kleinhans Digital shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, including but not limited to loss of revenue, business interruption, or data loss.
        </p>
        <p className="kd-legal-p">
          Our total liability to you for any claim arising from these terms shall not exceed the total fees paid by you to us in the 12 months prior to the claim.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 12 */}
        <h2 className="kd-legal-h2">12. Governing Law</h2>
        <p className="kd-legal-p">
          These Terms of Service are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the South African courts.
        </p>

        <hr className="kd-legal-divider" />

        {/* Section 13 */}
        <h2 className="kd-legal-h2">13. Contact</h2>
        <p className="kd-legal-p">
          For any questions regarding these Terms of Service, please contact us:
        </p>
        <ul className="kd-legal-ul">
          <li><strong>Company:</strong> LRWKleinhans (Pty) Ltd (trading as Kleinhans Digital)</li>
          <li><strong>Email:</strong> <a href="mailto:info@kleinhansdigital.co.za" style={{ color: "var(--green)" }}>info@kleinhansdigital.co.za</a></li>
          <li><strong>WhatsApp:</strong> <a href="https://wa.me/27662410344" style={{ color: "var(--green)" }}>+27 66 241 0344</a></li>
          <li><strong>Location:</strong> Johannesburg, Gauteng, South Africa</li>
        </ul>

        {/* Footer links */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(45,106,79,0.12)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/privacy-policy" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--green)", textDecoration: "none" }}>
            Privacy Policy →
          </Link>
          <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
