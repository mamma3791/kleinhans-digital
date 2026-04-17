import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExtractClient from "./ExtractClient";

export const metadata = { title: "Document Extraction" };

export default async function ExtractPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <ExtractClient />;
}
