import { createAdminClient } from "@/lib/supabase/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const admin = createAdminClient();

  const [
    { data: quotes },
    { data: profiles },
    { data: invoices },
    { data: projects },
  ] = await Promise.all([
    admin
      .from("quotes")
      .select(`id, user_id, tier, addons, base_price, monthly_price, is_consultative, message, status, admin_notes, submitted_at, profiles ( full_name, business_name, phone )`)
      .order("submitted_at", { ascending: false }),
    admin
      .from("profiles")
      .select("id, full_name, business_name, phone, email"),
    admin
      .from("invoices")
      .select("id, user_id, invoice_number, description, amount, status, due_date, created_at, po_number")
      .order("created_at", { ascending: false }),
    admin
      .from("projects")
      .select("id, user_id, name, status, progress")
      .order("created_at", { ascending: false }),
  ]);

  // Resolve auth emails for all unique user IDs
  const profileList = profiles ?? [];
  const allUserIds = Array.from(new Set(profileList.map(p => p.id)));

  const emailMap: Record<string, string> = {};
  await Promise.all(
    allUserIds.map(async (uid) => {
      try {
        const { data } = await admin.auth.admin.getUserById(uid);
        if (data?.user?.email) emailMap[uid] = data.user.email;
      } catch { /* skip */ }
    })
  );

  // Build clients list
  const clients = profileList.map(p => ({
    user_id: p.id,
    full_name: p.full_name ?? null,
    business_name: p.business_name ?? null,
    phone: p.phone ?? null,
    user_email: emailMap[p.id] ?? p.email ?? "",
    invoice_count: (invoices ?? []).filter(i => i.user_id === p.id).length,
    project_count: (projects ?? []).filter(pr => pr.user_id === p.id).length,
  }));

  // Build quotes with emails
  const quoteList = quotes ?? [];
  const quotesWithEmail = quoteList.map(q => ({
    ...q,
    addons: (q.addons as string[]) ?? [],
    profiles: Array.isArray(q.profiles) ? q.profiles[0] ?? null : (q.profiles ?? null),
    user_email: emailMap[q.user_id] ?? "",
  }));

  // Next invoice number
  const invoiceList = invoices ?? [];
  const year = new Date().getFullYear();
  const yearInvoices = invoiceList.filter(i =>
    i.invoice_number?.startsWith(`INV-${year}-`)
  );
  const nextNum = (yearInvoices.length + 1).toString().padStart(3, "0");
  const nextInvoiceNumber = `INV-${year}-${nextNum}`;

  return (
    <AdminClient
      initialQuotes={quotesWithEmail}
      clients={clients}
      invoices={invoiceList}
      nextInvoiceNumber={nextInvoiceNumber}
    />
  );
}
