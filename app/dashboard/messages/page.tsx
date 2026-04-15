import { createClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender, content, read, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return (
    <MessagesClient
      initialMessages={(messages ?? []) as Array<{
        id: string;
        sender: "client" | "agency";
        content: string;
        read: boolean;
        created_at: string;
      }>}
      userId={user!.id}
    />
  );
}
