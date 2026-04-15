import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import QuoteApprovedEmail from "@/emails/QuoteApprovedEmail";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function POST(request: Request) {
  // Auth check — must be admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = ADMIN_USER_ID
    ? user.id === ADMIN_USER_ID
    : user.email === "info@kleinhansdigital.co.za";

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { quoteId, action, newStatus, projectName, adminNotes } = body;

  if (!quoteId || !action) {
    return NextResponse.json({ error: "Missing quoteId or action" }, { status: 400 });
  }

  const admin = createAdminClient();

  // --- Update status only ---
  if (action === "update_status") {
    if (!newStatus) return NextResponse.json({ error: "Missing newStatus" }, { status: 400 });

    const { error } = await admin
      .from("quotes")
      .update({ status: newStatus, admin_notes: adminNotes ?? null })
      .eq("id", quoteId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // --- Approve quote → create project ---
  if (action === "approve") {
    // 1. Fetch the quote
    const { data: quote, error: qErr } = await admin
      .from("quotes")
      .select("user_id, tier, base_price, monthly_price")
      .eq("id", quoteId)
      .single();

    if (qErr || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const tierLabel = (quote.tier as string).charAt(0).toUpperCase() + (quote.tier as string).slice(1);
    const name = projectName || `${tierLabel} Package`;

    // 2. Create the project
    const { data: project, error: pErr } = await admin
      .from("projects")
      .insert({
        user_id: quote.user_id,
        name,
        description: adminNotes || null,
        status: "planning",
        progress: 0,
      })
      .select("id")
      .single();

    if (pErr || !project) {
      return NextResponse.json({ error: pErr?.message ?? "Failed to create project" }, { status: 500 });
    }

    // 3. Mark quote as in_progress
    await admin
      .from("quotes")
      .update({ status: "in_progress", admin_notes: adminNotes || null })
      .eq("id", quoteId);

    // 4. Email client to notify them the project is approved
    try {
      const { data: profile } = await admin
        .from("profiles")
        .select("full_name, email")
        .eq("id", quote.user_id)
        .single();

      const { data: authData } = await admin.auth.admin.getUserById(quote.user_id);
      const clientEmail = authData?.user?.email ?? profile?.email ?? "";
      const clientName = profile?.full_name ?? "";

      if (clientEmail) {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: clientEmail,
          subject: `Your Kleinhans Digital project is approved`,
          react: QuoteApprovedEmail({
            clientName,
            tier: quote.tier as string,
            projectName: name,
            basePrice: quote.base_price != null ? `R${Number(quote.base_price).toLocaleString("en-ZA")}` : undefined,
            monthlyPrice: quote.monthly_price != null && Number(quote.monthly_price) > 0
              ? `R${Number(quote.monthly_price).toLocaleString("en-ZA")}/mo`
              : undefined,
          }),
        });
      }
    } catch (err) {
      console.error("Resend error (approve-quote):", err);
      // Non-critical — project was still created
    }

    return NextResponse.json({ ok: true, projectId: project.id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
