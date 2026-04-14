import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.json();

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Webhook failure is non-critical — quote is already saved in Supabase
  }

  return NextResponse.json({ ok: true });
}
