import { createAdminClient } from "@/lib/supabase/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const admin = createAdminClient();

  // Fetch all quotes, newest first, joined with profile data
  const { data: quotes } = await admin
    .from("quotes")
    .select(`
      id, user_id, tier, addons, base_price, monthly_price,
      is_consultative, message, status, admin_notes, submitted_at,
      profiles ( full_name, business_name, phone )
    `)
    .order("submitted_at", { ascending: false });

  // Fetch emails from auth.users for each quote
  const quoteList = quotes ?? [];

  const quotesWithEmail = await Promise.all(
    quoteList.map(async (q) => {
      try {
        const { data } = await admin.auth.admin.getUserById(q.user_id);
        return {
          ...q,
          addons: (q.addons as string[]) ?? [],
          profiles: Array.isArray(q.profiles) ? q.profiles[0] ?? null : (q.profiles ?? null),
          user_email: data?.user?.email ?? "",
        };
      } catch {
        return {
          ...q,
          addons: (q.addons as string[]) ?? [],
          profiles: Array.isArray(q.profiles) ? q.profiles[0] ?? null : (q.profiles ?? null),
          user_email: "",
        };
      }
    })
  );

  return <AdminClient initialQuotes={quotesWithEmail} />;
}
