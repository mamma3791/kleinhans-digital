import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Kleinhans Digital",
  robots: { index: false, follow: false },
};

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Restrict to admin user only
  if (ADMIN_USER_ID && user.id !== ADMIN_USER_ID) {
    redirect("/dashboard");
  }

  // If no ADMIN_USER_ID env var is set, check email as fallback
  if (!ADMIN_USER_ID && user.email !== "jason@kleinhansdigital.co.za") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
