"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Capture all params to restore after login
  const tier = searchParams.get("tier");
  const addons = searchParams.get("addons");
  const message = searchParams.get("message");
  const returnTo = searchParams.get("return");

  // Build the post-login redirect URL
  const buildReturnUrl = () => {
    if (returnTo === "configure") {
      const params = new URLSearchParams();
      if (tier) params.set("tier", tier);
      if (addons) params.set("addons", addons);
      if (message) params.set("message", message);
      params.set("autosubmit", "1");
      return `/configure?${params.toString()}`;
    }
    return "/dashboard";
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push(buildReturnUrl());
    });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const returnUrl = buildReturnUrl();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnUrl)}`;

    // Open Google OAuth in a popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      "",
      "google-signin",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (data?.url && popup) {
      popup.location.href = data.url;
      // Poll for popup close and check auth state
      const timer = setInterval(async () => {
        if (popup.closed) {
          clearInterval(timer);
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            router.push(buildReturnUrl());
          } else {
            setLoading(false);
          }
        }
      }, 500);
    } else {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .kd-login-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.875rem;
          width: 100%;
          background: #fff;
          border: 1.5px solid rgba(26,36,32,0.15);
          border-radius: 0.875rem;
          padding: 1rem;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          color: var(--dark);
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .kd-login-google:hover {
          border-color: var(--green);
          box-shadow: 0 4px 16px rgba(58,138,98,0.12);
          transform: translateY(-1px);
        }
        .kd-login-google:disabled { opacity: 0.6; cursor: default; transform: none; }
        .kd-login-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: var(--muted);
          font-family: var(--font-sans);
          font-size: 0.8rem;
        }
        .kd-login-divider::before,
        .kd-login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(45,106,79,0.12);
        }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(45,106,79,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        <Link href={returnTo === "configure" ? `/configure${tier ? `?tier=${tier}` : ""}` : "/"} style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          Back
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "26rem" }}>

          <div style={{ width: "4rem", height: "4rem", borderRadius: "1.125rem", background: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
            </svg>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--dark)", textAlign: "center", marginBottom: "0.625rem", letterSpacing: "-0.02em" }}>
            {returnTo === "configure" ? "Almost there." : "Welcome back."}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: "0.95rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            {returnTo === "configure"
              ? "Sign in with Google to submit your quote. Your selections will be saved."
              : "Sign in to your Kleinhans Digital account to track your project and manage your details."}
          </p>

          {returnTo === "configure" && tier && (
            <div style={{ background: "var(--cream2)", border: "1px solid rgba(45,106,79,0.15)", borderRadius: "0.875rem", padding: "0.875rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--green)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>
                Your <strong style={{ color: "var(--dark)" }}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</strong> quote is saved and will be submitted automatically after sign in.
              </span>
            </div>
          )}

          <button onClick={signInWithGoogle} disabled={loading} className="kd-login-google">
            {loading ? (
              <span style={{ fontFamily: "var(--font-sans)" }}>Redirecting to Google...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="kd-login-divider">New here?</div>

          <Link
            href="/configure"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              width: "100%", background: "var(--green)", color: "var(--cream)",
              fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600,
              padding: "1rem", borderRadius: "0.875rem", textDecoration: "none",
              transition: "background 0.2s ease", boxSizing: "border-box",
            }}
          >
            Get a quote and create an account
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginTop: "1.5rem", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <span style={{ color: "var(--green)" }}>Privacy Policy</span>
            {" "}and{" "}
            <span style={{ color: "var(--green)" }}>Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
