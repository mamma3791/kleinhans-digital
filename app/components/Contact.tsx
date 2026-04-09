"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) { setStatus("success"); form.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const inputClass = "w-full bg-[var(--cream2)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-[var(--dark)] placeholder-[var(--muted)] text-sm focus:outline-none focus:border-[var(--green)] transition-colors duration-200";

  return (
    <section id="contact" className="py-32 bg-[var(--cream)]" ref={ref}>
      <div className="kd-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold tracking-[4px] uppercase text-[var(--green)] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Get in Touch
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2rem,4vw,3.5rem)] text-[var(--dark)] mb-8 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
            >
              Let's build something that works.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-10"
            >
              {[
                { label: "Email", value: "info@kleinhansdigital.co.za", href: "mailto:info@kleinhansdigital.co.za" },
                { label: "WhatsApp", value: "066 241 0344", href: "https://wa.me/27662410344" },
                { label: "Location", value: "Johannesburg, Gauteng", href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-4 border-b border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)] uppercase tracking-[2px] w-20 flex-shrink-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a href={item.href} className="text-[var(--dark)] hover:text-[var(--green)] transition-colors text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[var(--dark)] text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>{item.value}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/27662410344?text=Hi%20Kleinhans%20Digital%2C%20I%27d%20like%20to%20enquire%20about%20a%20website."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 rounded-full text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-[var(--cream2)] rounded-3xl p-8 border border-[var(--border)]">
              <h3 className="text-xl text-[var(--dark)] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="access_key" value="b24a2d57-dbe1-4e78-95ba-e7e877614684" />
                <input type="hidden" name="subject" value="New enquiry from kleinhansdigital.co.za" />
                <div className="grid grid-cols-2 gap-4">
                  <input style={{ fontFamily: "'Outfit', sans-serif" }} className={inputClass} name="name" type="text" placeholder="Your name" required />
                  <input style={{ fontFamily: "'Outfit', sans-serif" }} className={inputClass} name="business" type="text" placeholder="Business name" />
                </div>
                <input style={{ fontFamily: "'Outfit', sans-serif" }} className={inputClass} name="email" type="email" placeholder="Email address" required />
                <input style={{ fontFamily: "'Outfit', sans-serif" }} className={inputClass} name="phone" type="tel" placeholder="Phone number" />
                <textarea style={{ fontFamily: "'Outfit', sans-serif" }} className={`${inputClass} min-h-[120px] resize-none`} name="message" placeholder="Tell us about your business and what you need..." required />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[var(--green)] hover:bg-[var(--green2)] disabled:opacity-60 text-[var(--cream)] font-semibold py-4 rounded-xl text-sm transition-all duration-300 hover:scale-[1.01]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                {status === "success" && (
                  <p className="text-green-600 text-sm text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Message sent. We will be in touch within 24 hours.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Something went wrong. Please try WhatsApp instead.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
