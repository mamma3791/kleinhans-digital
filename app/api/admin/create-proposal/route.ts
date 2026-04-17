import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

type LineItem = { description: string; amount: string; type: "once_off" | "monthly" };

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = ADMIN_USER_ID
    ? user.id === ADMIN_USER_ID
    : user.email === "info@kleinhansdigital.co.za";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, quoteId, proposalNumber, title, description, lineItems, terms, expiresAt } =
    await request.json();

  if (!userId || !proposalNumber || !title || !lineItems || !terms) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const items: LineItem[] = lineItems;
  const base_price = items
    .filter(i => i.type === "once_off")
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  const monthly_price = items
    .filter(i => i.type === "monthly")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const admin = createAdminClient();

  const { data: proposal, error } = await admin
    .from("proposals")
    .insert({
      user_id: userId,
      quote_id: quoteId ?? null,
      proposal_number: proposalNumber,
      status: "sent",
      title,
      description: description ?? null,
      line_items: items,
      base_price: base_price || null,
      monthly_price: monthly_price || null,
      terms,
      expires_at: expiresAt ?? null,
      sent_at: new Date().toISOString(),
    })
    .select("id, proposal_number")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, proposal });
}
