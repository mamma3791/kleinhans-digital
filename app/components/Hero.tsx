"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number };
    let particles: Particle[] = [];

    function init() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      particles = [];
      const count = Math.floor((W * H) / 9000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.6 + 0.4,
          opacity: Math.random() * 0.55 + 0.1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const mx = mouse.current.x;
      const my = mouse.current.y;
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const dx = p.x - mx; const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
        const glow = dist < 150 ? Math.min(p.opacity + 0.4 * (1 - dist / 150), 0.9) : p.opacity;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(61,122,94,${glow})`;
        ctx!.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 80) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(45,106,79,${0.14 * (1 - d / 80)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onResize = () => init();
    init(); draw();
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

const words = ["Your business", "deserves a website", "that actually", "works."];

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0f1c15",
        width: "100%",
      }}
    >
      <ParticleCanvas />

      {/* Glow overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,106,79,0.1) 0%, transparent 70%)"
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(45,106,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Content */}
      <div className="kd-container" style={{ position: "relative", zIndex: 10, paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "56rem" }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d7a5e" }} />
            <span style={{ color: "#3d7a5e", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase" }}>
              South African Digital Agency
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: "2rem" }}>
            {words.map((word, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 + i * 0.12 }}
                  className="text-hero"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: word === "works." ? "#3d7a5e" : "#f5f4ef",
                    fontStyle: word === "works." ? "italic" : "normal",
                    display: "block",
                  }}
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
            style={{
              color: "rgba(245,244,239,0.5)", fontSize: "1.1rem",
              maxWidth: "36rem", marginBottom: "3rem", lineHeight: 1.8, fontWeight: 300,
            }}
          >
            We build professional websites and digital systems that bring in enquiries, build trust, and grow with your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.15 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "5rem" }}
          >
            <Link
              href="#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#2d6a4f", color: "#f5f4ef",
                fontWeight: 600, padding: "0.875rem 1.75rem",
                borderRadius: "9999px", fontSize: "0.875rem",
                textDecoration: "none", transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1f4d39")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2d6a4f")}
            >
              Start a Project
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#work"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                border: "1.5px solid rgba(245,244,239,0.2)", color: "rgba(245,244,239,0.7)",
                fontWeight: 600, padding: "0.875rem 1.75rem",
                borderRadius: "9999px", fontSize: "0.875rem",
                textDecoration: "none", transition: "all 0.2s ease",
              }}
            >
              See Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {[
              { num: "6+", label: "Businesses launched" },
              { num: "14", label: "Day turnaround" },
              { num: "100%", label: "Custom built" },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: "1 1 120px", padding: "1rem 1.5rem",
                borderLeft: i > 0 ? "1px solid rgba(45,106,79,0.15)" : "none",
              }}>
                <div className="text-stat" style={{ fontFamily: "'DM Serif Display', serif", color: "#3d7a5e" }}>
                  {stat.num}
                </div>
                <div style={{ color: "rgba(245,244,239,0.4)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem"
        }}
      >
        <span style={{ color: "rgba(245,244,239,0.2)", fontSize: "0.625rem", letterSpacing: "4px", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: "2.5rem", background: "linear-gradient(to bottom, rgba(45,106,79,0.4), transparent)" }} />
      </motion.div>
    </section>
  );
}
