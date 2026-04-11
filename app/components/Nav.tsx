"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <style>{`
        .kd-nav-link {
          color: rgba(245,244,239,0.55);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .kd-nav-link:hover { color: var(--cream); background: rgba(255,255,255,0.06); }
        .kd-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .kd-nav-cta:hover { background: var(--green2); transform: scale(1.02); }
        .kd-nav-login {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          border: 1px solid rgba(245,244,239,0.2);
          color: rgba(245,244,239,0.7);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .kd-nav-login:hover { border-color: var(--green3); color: var(--green3); }
        .kd-mobile-link {
          display: block;
          color: rgba(245,244,239,0.65);
          font-family: var(--font-sans);
          font-size: 1.125rem;
          font-weight: 500;
          padding: 0.875rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .kd-mobile-link:hover { color: var(--cream); }
        @media (min-width: 768px) {
          .kd-hamburger { display: none !important; }
          .kd-desktop-nav { display: flex !important; }
          .kd-desktop-right { display: flex !important; }
        }
        @media (max-width: 767px) {
          .kd-desktop-nav { display: none !important; }
          .kd-desktop-right { display: none !important; }
          .kd-hamburger { display: flex !important; }
        }
      `}</style>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", justifyContent: "center",
          paddingTop: "1.25rem", paddingLeft: "1.5rem", paddingRight: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "1.5rem", padding: "0.625rem 1.25rem", borderRadius: "9999px",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            background: scrolled ? "rgba(26,36,32,0.92)" : "rgba(26,36,32,0.65)",
            border: scrolled ? "1px solid rgba(45,106,79,0.2)" : "1px solid rgba(255,255,255,0.05)",
            boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.25)" : "none",
            transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            width: "100%", maxWidth: "60rem",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-sans)", color: "var(--cream)", fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>
              Kleinhans<span style={{ color: "var(--green3)" }}>.</span>Digital
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="kd-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="kd-nav-link">{item.label}</a>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="kd-desktop-right" style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {user ? (
              <Link href="/dashboard" className="kd-nav-login">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="kd-nav-login">
                Sign in
              </Link>
            )}
            <a href="/configure" className="kd-nav-cta">Get a Quote</a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="kd-hamburger"
            style={{ display: "none", flexDirection: "column", gap: "5px", width: "1.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", height: "1px", background: "var(--cream)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
            <span style={{ display: "block", height: "1px", background: "var(--cream)", transition: "opacity 0.3s ease", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", height: "1px", background: "var(--cream)", transition: "transform 0.3s ease", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", top: "5.5rem", left: "1rem", right: "1rem", zIndex: 40, background: "var(--dark)", border: "1px solid rgba(45,106,79,0.2)", borderRadius: "1.25rem", padding: "1.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="kd-mobile-link" onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
            {user ? (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "block", marginTop: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--green3)", textDecoration: "none", padding: "0.5rem 0" }}>
                My Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: "block", marginTop: "0.5rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(245,244,239,0.5)", textDecoration: "none", padding: "0.5rem 0" }}>
                Sign in
              </Link>
            )}
            <a href="/configure" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1rem", background: "var(--green)", color: "var(--cream)", fontFamily: "var(--font-sans)", fontWeight: 600, padding: "0.875rem", borderRadius: "9999px", textDecoration: "none" }}>
              Get a Quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
