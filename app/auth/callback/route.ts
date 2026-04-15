import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, business_name, phone")
          .eq("id", user.id)
          .single();

        // Bridge page detects popup vs full-page and handles the redirect correctly
        const bridgeUrl = `/auth/complete?next=${encodeURIComponent(next)}`;

        if (!profile || !profile.business_name || !profile.phone) {
          // New user — collect details first, then send through bridge
          const onboardingUrl = `/onboarding?next=${encodeURIComponent(bridgeUrl)}`;
          return NextResponse.redirect(`${origin}${onboardingUrl}`);
        }

        return NextResponse.redirect(`${origin}${bridgeUrl}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/configure?error=auth`);
}
