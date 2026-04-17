import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

const VALID_STATUSES = ["draft", "sent", "paid", "overdue"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = ADMIN_USER_ID
    ? user.id === ADMIN_USER_ID
    : user.email === "info@kleinhansdigital.co.za";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { invoiceId, status } = await request.json();
  if (!invoiceId || !status) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("invoices").update({ status }).eq("id", invoiceId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
