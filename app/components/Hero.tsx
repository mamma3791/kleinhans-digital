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
      const count = Math.floor((W * H) / 8000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.6 + 0.1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const glow = dist < 150 ? Math.min(p.opacity + 0.4 * (1 - dist / 150), 0.9) : p.opacity;
        ctx!.fillStyle = `rgba(61,122,94,${glow})`;
        ctx!.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 90) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(45,106,79,${0.15 * (1 - d / 90)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onResize = () => init();
    init();
    draw();
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const words = ["Your business", "deserves a website", "that actually", "works."];

export default function Hero() {
  const ease = "easeOut";

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0f1c15]">
      <ParticleCanvas />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,106,79,0.1) 0%, transparent 70%)" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(45,106,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d7a5e] animate-pulse" />
            <span className="text-[#3d7a5e] text-xs font-semibold tracking-[4px] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
              South African Digital Agency
            </span>
          </motion.div>

          {/* Headline words */}
          <div className="mb-8">
            {words.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease, delay: 0.5 + i * 0.12 }}
                  className="text-[clamp(3rem,6vw,5.5rem)] leading-[1.0] font-normal"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    letterSpacing: "-0.02em",
                    color: word === "works." ? "#3d7a5e" : "#f5f4ef",
                    fontStyle: word === "works." ? "italic" : "normal",
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
            transition={{ duration: 0.8, ease, delay: 1.0 }}
            className="text-[#f5f4ef]/50 text-lg max-w-xl mb-12 leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
          >
            We build professional websites and digital systems that bring in enquiries, build trust, and grow with your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.15 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4d39] text-[#f5f4ef] font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Start a Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-2 border border-[#f5f4ef]/20 hover:border-[#f5f4ef]/40 text-[#f5f4ef]/70 hover:text-[#f5f4ef] font-semibold px-7 py-3.5 rounded-full transition-all duration-300 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              See Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.3 }}
            className="flex flex-wrap gap-px"
          >
            {[
              { num: "6+", label: "Businesses launched" },
              { num: "14", label: "Day turnaround" },
              { num: "100%", label: "Custom built" },
            ].map((stat, i) => (
              <div key={i} className="flex-1 min-w-[120px] px-6 py-4 border-l border-[#2d6a4f]/15 first:border-l-0">
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] font-normal text-[#3d7a5e]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {stat.num}
                </div>
                <div className="text-[#f5f4ef]/40 text-xs tracking-wide mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#f5f4ef]/20 text-[10px] tracking-[4px] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#2d6a4f]/40 to-transparent" />
      </motion.div>
    </section>
  );
}
