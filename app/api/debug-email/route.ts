import { NextResponse } from "next/server";
import { resend, FROM_ADDRESS } from "@/lib/resend";

// Temporary debug endpoint — hit GET /api/debug-email to test Resend
// Remove this file once emails are confirmed working
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      error: "RESEND_API_KEY environment variable is not set",
    }, { status: 500 });
  }

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: "info@kleinhansdigital.co.za",
    subject: "Resend test — Kleinhans Digital",
    html: "<p>This is a test email from the debug endpoint. If you received this, Resend is working correctly.</p>",
  });

  if (error) {
    return NextResponse.json({
      ok: false,
      error,
      from: FROM_ADDRESS,
      hint: error.message?.includes("domain")
        ? "Domain kleinhansdigital.co.za is not verified in Resend. Go to resend.com → Domains → Add domain, add the DNS records, then verify."
        : "Check your RESEND_API_KEY value in Vercel.",
    }, { status: 400 });
  }

  return NextResponse.json({ ok: true, emailId: data?.id, from: FROM_ADDRESS });
}
