import { NextResponse } from "next/server";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import QuoteSubmittedEmail from "@/emails/QuoteSubmittedEmail";

export async function POST(request: Request) {
  const body = await request.json();

  // Only handle quote_submitted payloads
  if (body.type !== "quote_submitted") {
    return NextResponse.json({ ok: true });
  }

  const { user_email, user_name, tier, addons, base_price, monthly_price, message } = body;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: "info@kleinhansdigital.co.za",
    subject: `New Quote — ${user_name || user_email} (${tier})`,
    react: QuoteSubmittedEmail({
      clientName: user_name || "",
      clientEmail: user_email || "",
      tier: tier || "",
      basePrice: base_price || "—",
      monthlyPrice: monthly_price || "—",
      addons: Array.isArray(addons) ? addons : [],
      message: message || "",
    }),
  });

  if (error) {
    // Log full error to Vercel Functions log — check there if emails aren't arriving
    console.error("[quote-notify] Resend send failed:", JSON.stringify(error));
  }

  // Always return ok — quote is already saved in Supabase regardless
  return NextResponse.json({ ok: true, emailSent: !error });
}
