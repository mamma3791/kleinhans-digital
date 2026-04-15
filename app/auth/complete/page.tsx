"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? "/dashboard";

  useEffect(() => {
    try {
      if (window.opener && !window.opener.closed) {
        // We're inside the OAuth popup — send the parent to the destination and close
        window.opener.location.href = next;
        window.close();
        return;
      }
    } catch {
      // window.opener exists but is cross-origin (shouldn't happen, but safe fallback)
    }
    // Not a popup (or close failed) — just navigate this window
    router.replace(next);
  }, [next]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--cream)",
    }}>
      <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", fontSize: "0.9rem" }}>
        Signing you in…
      </p>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
