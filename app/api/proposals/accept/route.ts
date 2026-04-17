import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    proposalId,
    clientBusinessName,
    clientRegNumber,
    clientVatNumber,
    clientAddress,
    clientPoNumber,
    clientContactName,
    clientSignatureName,
  } = await request.json();

  if (!proposalId || !clientSignatureName?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify the proposal belongs to this user
  const admin = createAdminClient();
  const { data: proposal } = await admin
    .from("proposals")
    .select("id, user_id, status")
    .eq("id", proposalId)
    .single();

  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  if (proposal.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (proposal.status !== "sent") {
    return NextResponse.json({ error: "This proposal is no longer open for acceptance" }, { status: 409 });
  }

  // Get client IP for audit trail
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const { error } = await admin
    .from("proposals")
    .update({
      status: "accepted",
      client_business_name: clientBusinessName?.trim() || null,
      client_reg_number: clientRegNumber?.trim() || null,
      client_vat_number: clientVatNumber?.trim() || null,
      client_address: clientAddress?.trim() || null,
      client_po_number: clientPoNumber?.trim() || null,
      client_contact_name: clientContactName?.trim() || null,
      client_signature_name: clientSignatureName.trim(),
      accepted_at: new Date().toISOString(),
      accepted_ip: ip,
    })
    .eq("id", proposalId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
