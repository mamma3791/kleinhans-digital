"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  billing_address: string;
};

export default function ProfileForm({
  initialProfile,
  userId,
}: {
  initialProfile: Profile;
  userId: string;
}) {
  const [form, setForm] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof Profile, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: form.full_name,
        business_name: form.business_name,
        phone: form.phone,
        billing_address: form.billing_address,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);
    if (dbError) {
      setError("Could not save your changes. Please try again.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const fields: { key: keyof Profile; label: string; type?: string; placeholder: string; readonly?: boolean; multiline?: boolean }[] = [
    { key: "full_name",      label: "Full name",         placeholder: "Jane Smith" },
    { key: "business_name",  label: "Business name",     placeholder: "Smith & Co." },
    { key: "phone",          label: "Phone number",      type: "tel", placeholder: "+27 00 000 0000" },
    { key: "email",          label: "Email address",     type: "email", placeholder: "you@example.com", readonly: true },
    { key: "billing_address", label: "Billing address",  placeholder: "123 Main St, Johannesburg, 2000", multiline: true },
  ];

  return (
    <>
      <style>{`
        .kd-profile-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .kd-profile-label {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(245,244,239,0.3);
        }
        .kd-profile-input {
          background: rgba(245,244,239,0.05);
          border: 1px solid rgba(245,244,239,0.1);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          color: var(--cream);
          outline: none;
          width: 100%;
          transition: border-color 0.15s;
        }
        .kd-profile-input:focus {
          border-color: rgba(93,191,136,0.4);
        }
        .kd-profile-input:read-only {
          opacity: 0.45;
          cursor: default;
        }
        .kd-profile-input::placeholder {
          color: rgba(245,244,239,0.2);
        }
        textarea.kd-profile-input {
          resize: vertical;
          min-height: 6rem;
          line-height: 1.55;
        }
      `}</style>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {fields.map(field => (
          <div key={field.key} className="kd-profile-field">
            <label className="kd-profile-label" htmlFor={`profile-${field.key}`}>
              {field.label}
              {field.readonly && (
                <span style={{ marginLeft: "0.5rem", fontSize: "0.6rem", color: "rgba(245,244,239,0.2)", textTransform: "none", letterSpacing: 0 }}>
                  (managed by your login)
                </span>
              )}
            </label>
            {field.multiline ? (
              <textarea
                id={`profile-${field.key}`}
                className="kd-profile-input"
                value={form[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                readOnly={field.readonly}
              />
            ) : (
              <input
                id={`profile-${field.key}`}
                type={field.type ?? "text"}
                className="kd-profile-input"
                value={form[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                readOnly={field.readonly}
              />
            )}
          </div>
        ))}

        {error && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#f87171" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingTop: "0.375rem" }}>
          <button
            type="submit"
            className="kd-dash-btn"
            disabled={saving}
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--green3)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Saved
            </span>
          )}
        </div>
      </form>
    </>
  );
}
