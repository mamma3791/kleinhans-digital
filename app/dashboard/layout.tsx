import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "./components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("sender", "agency")
      .eq("read", false),
  ]);

  return (
    <DashboardShell
      userName={profile?.full_name ?? ""}
      userEmail={user.email ?? ""}
      unreadMessages={unreadMessages ?? 0}
    >
      {children}
    </DashboardShell>
  );
}
