import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = ADMIN_USER_ID
    ? user.id === ADMIN_USER_ID
    : user.email === "info@kleinhansdigital.co.za";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, content } = await request.json();
  if (!userId || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Use service role to bypass RLS — admin inserts with sender='agency' for any user_id
  const admin = createAdminClient();
  const { data: message, error } = await admin
    .from("messages")
    .insert({
      user_id: userId,
      sender: "agency",
      content: content.trim(),
      read: false,
    })
    .select("id, sender, content, read, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, message });
}
