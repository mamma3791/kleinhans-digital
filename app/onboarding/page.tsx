"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const next = searchParams.get("next") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/configure"); return; }
      if (user.user_metadata?.full_name) setFullName(user.user_metadata.full_name);
      if (user.email) {}
    });
  }, []);

  const handleSave = async () => {
    if (!fullName.trim() || !businessName.trim() || !phone.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/configure"); return; }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
      business_name: businessName.trim(),
      phone: phone.trim(),
      email: user.email,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) { setError("Something went wrong. Please try again."); setSaving(false); return; }
    router.push(next);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(45,106,79,0.1)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--dark)" }}>
            Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
          </span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.875rem" }}>
            One quick step
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", color: "var(--dark)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Tell us about yourself.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            This helps us personalise your experience. You can update these details anytime from your dashboard.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Your full name", value: fullName, setter: setFullName, placeholder: "Jason Kleinhans", type: "text" },
              { label: "Business name", value: businessName, setter: setBusinessName, placeholder: "Kleinhans Digital", type: "text" },
              { label: "Phone / WhatsApp", value: phone, setter: setPhone, placeholder: "066 241 0344", type: "tel" },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 500, color: "var(--dark)", display: "block", marginBottom: "0.375rem" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  style={{ width: "100%", background: "var(--cream2)", border: "1px solid rgba(45,106,79,0.15)", borderRadius: "0.75rem", padding: "0.875rem 1rem", fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--dark)", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            {error && (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#dc2626" }}>{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 600, padding: "1rem", borderRadius: "0.875rem", border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, marginTop: "0.5rem", transition: "background 0.2s ease" }}
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
