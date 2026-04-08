"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--dark2)] py-16 border-t border-[var(--cream)]/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[var(--green)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9L9 2L16 9L9 16L2 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 5.5L12.5 9L9 12.5L5.5 9L9 5.5Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span className="text-[var(--cream)] font-semibold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Kleinhans<span className="text-[var(--green3)]">.</span>Digital
              </span>
            </Link>
            <p className="text-[var(--cream)]/30 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
              Custom websites for South African businesses. Built from scratch, mobile ready, SEO optimised.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[var(--cream)]/50 text-xs font-semibold tracking-[3px] uppercase mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Services</h4>
            <ul className="space-y-2">
              {["Web Design", "SEO Optimisation", "Branding & Identity", "E-Commerce", "WhatsApp Integration", "Google My Business"].map((s) => (
                <li key={s}>
                  <span className="text-[var(--cream)]/35 hover:text-[var(--cream)]/60 text-sm transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--cream)]/50 text-xs font-semibold tracking-[3px] uppercase mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@kleinhansdigital.co.za" className="text-[var(--cream)]/35 hover:text-[var(--cream)]/60 text-sm transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  info@kleinhansdigital.co.za
                </a>
              </li>
              <li>
                <a href="https://wa.me/27662410344" className="text-[var(--cream)]/35 hover:text-[var(--cream)]/60 text-sm transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  066 241 0344
                </a>
              </li>
              <li>
                <span className="text-[var(--cream)]/35 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Johannesburg, Gauteng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--cream)]/5">
          <p className="text-[var(--cream)]/20 text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
            &copy; {new Date().getFullYear()} LRWKleinhans (Pty) Ltd. Trading as Kleinhans Digital.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <span key={t} className="text-[var(--cream)]/20 hover:text-[var(--cream)]/40 text-xs transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
