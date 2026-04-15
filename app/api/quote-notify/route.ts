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

  try {
    await resend.emails.send({
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
  } catch (err) {
    console.error("Resend error (quote-notify):", err);
    // Non-critical — quote is already saved in Supabase
  }

  return NextResponse.json({ ok: true });
}
