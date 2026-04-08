"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-6"
      >
        <div
          className={`nav-pill flex items-center justify-between gap-8 px-5 py-3 rounded-full transition-all duration-500 ${
            scrolled
              ? "bg-[var(--dark)]/90 border border-[var(--green)]/20 shadow-lg shadow-black/20"
              : "bg-[var(--dark)]/60 border border-white/5"
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--green)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif" }} className="text-[var(--cream)] font-semibold text-[15px] tracking-tight">
              Kleinhans<span className="text-[var(--green3)]">.</span>Digital
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--cream)]/60 hover:text-[var(--cream)] text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 bg-[var(--green)] hover:bg-[var(--green2)] text-[var(--cream)] text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:scale-[1.02]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Get a Quote
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 w-6"
            >
              <span className={`block h-px bg-[var(--cream)] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-px bg-[var(--cream)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-[var(--cream)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-[var(--dark)] border border-[var(--green)]/20 rounded-2xl p-6 shadow-2xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-[var(--cream)]/70 hover:text-[var(--cream)] text-lg font-medium py-3 border-b border-white/5"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center justify-center bg-[var(--green)] text-[var(--cream)] font-semibold py-3 rounded-full"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
