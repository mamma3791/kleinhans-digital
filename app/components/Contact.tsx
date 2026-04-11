"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const MAKE_WEBHOOK = "https://hook.eu1.make.com/jr7gnafrkqbs40c7jd7rvj5vbu7p9vbn";
const TALLY_URL = "https://tally.so/r/LZJ5ej";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      business: data.get("business"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      tally_url: TALLY_URL,
      submitted_at: new Date().toISOString(),
    };

    try {
      // Send to Web3Forms for email delivery
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      // Fire to Make.com webhook (non-blocking — don't let this kill the form)
      fetch(MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      if (res.ok) { setStatus("success"); form.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" ref={ref} style={{ padding: "7rem 0", background: "var(--cream)" }}>
      <style>{`
        .kd-input {
          width: 100%;
          background: var(--cream2);
          border: 1px solid rgba(45,106,79,0.15);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          color: var(--dark);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .kd-input::placeholder { color: var(--muted); }
        .kd-input:focus { border-color: var(--green); }
        textarea.kd-input { resize: none; min-height: 7.5rem; }
        .kd-submit {
          width: 100%;
          background: var(--green);
          color: var(--cream);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 1rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .kd-submit:hover:not(:disabled) {
          background: var(--green2);
          transform: scale(1.01);
        }
        .kd-submit:disabled { opacity: 0.6; cursor: default; }
        .kd-contact-link {
          color: var(--dark);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .kd-contact-link:hover { color: var(--green); }
        .kd-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #25D366;
          color: white;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .kd-wa-btn:hover { background: #20bd5a; transform: scale(1.02); }
        @media (max-width: 1023px) {
          .kd-contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 639px) {
          .kd-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="kd-container">
        <div
          className="kd-contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}
        >
          {/* Left info */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--green)",
                marginBottom: "1.25rem",
              }}
            >
              Get in Touch
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "var(--dark)",
                marginBottom: "2.5rem",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Let&apos;s build something that works.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "2.5rem" }}
            >
              {[
                { label: "Email", value: "info@kleinhansdigital.co.za", href: "mailto:info@kleinhansdigital.co.za" },
                { label: "WhatsApp", value: "066 241 0344", href: "https://wa.me/27662410344" },
                { label: "Location", value: "Johannesburg, Gauteng", href: null },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid rgba(45,106,79,0.12)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    width: "5rem",
                    flexShrink: 0,
                  }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a href={item.href} className="kd-contact-link">{item.value}</a>
                  ) : (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: "var(--dark)" }}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>

            <motion.a
              href="https://wa.me/27662410344?text=Hi%20Kleinhans%20Digital%2C%20I%27d%20like%20to%20enquire%20about%20a%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="kd-wa-btn"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={{
              background: "var(--cream2)",
              borderRadius: "1.5rem",
              padding: "2.25rem",
              border: "1px solid rgba(45,106,79,0.12)",
            }}>
              <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.375rem",
                color: "var(--dark)",
                marginBottom: "1.75rem",
              }}>
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <input type="hidden" name="access_key" value="b24a2d57-dbe1-4e78-95ba-e7e877614684" />
                <input type="hidden" name="subject" value="New enquiry from kleinhansdigital.co.za" />

                <div className="kd-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <input className="kd-input" name="name" type="text" placeholder="Your name" required />
                  <input className="kd-input" name="business" type="text" placeholder="Business name" />
                </div>
                <input className="kd-input" name="email" type="email" placeholder="Email address" required />
                <input className="kd-input" name="phone" type="tel" placeholder="Phone number" />
                <textarea className="kd-input" name="message" placeholder="Tell us about your business and what you need..." required />

                <button type="submit" disabled={status === "loading"} className="kd-submit">
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#16a34a", textAlign: "center" }}>
                    Message sent. We will be in touch within 24 hours.
                  </p>
                )}
                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#dc2626", textAlign: "center" }}>
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
