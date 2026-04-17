import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function POST(request: Request) {
  // Auth — admin only
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = ADMIN_USER_ID
    ? user.id === ADMIN_USER_ID
    : user.email === "info@kleinhansdigital.co.za";

  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, description, amount, dueDate, invoiceNumber, poNumber } = await request.json();

  if (!userId || !description || !amount || !dueDate || !invoiceNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: invoice, error } = await admin
    .from("invoices")
    .insert({
      user_id: userId,
      invoice_number: invoiceNumber,
      description,
      amount: Number(amount),
      status: "sent",
      due_date: dueDate,
      ...(poNumber ? { po_number: poNumber } : {}),
    })
    .select("id, invoice_number")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, invoice });
}
