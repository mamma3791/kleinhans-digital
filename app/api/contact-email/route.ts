import { NextResponse } from "next/server";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import ContactFormEmail from "@/emails/ContactFormEmail";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, business, email, phone, message, submitted_at } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const submittedAt = submitted_at
    ? new Date(submitted_at).toLocaleDateString("en-ZA", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-ZA", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: "info@kleinhansdigital.co.za",
      reply_to: email,
      subject: `New Contact — ${name}${business ? ` (${business})` : ""}`,
      react: ContactFormEmail({
        name: name as string,
        business: (business as string) || "",
        email: email as string,
        phone: (phone as string) || "",
        message: message as string,
        submittedAt,
      }),
    });
  } catch (err) {
    console.error("Resend error (contact-email):", err);
    // Return success anyway — we don't want to show the user an error
    // for an internal delivery issue
  }

  return NextResponse.json({ ok: true });
}
