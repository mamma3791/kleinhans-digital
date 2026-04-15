# Make.com Integration — Kleinhans Digital

This document describes the webhook payloads sent from the Kleinhans Digital platform to Make.com, and explains how to configure the scenario.

---

## Environment Variable

```
MAKE_WEBHOOK_URL=https://hook.eu2.make.com/YOUR_WEBHOOK_ID
```

Set this in Vercel → Project Settings → Environment Variables. The webhook URL is obtained from Make.com when you create a "Custom webhook" trigger in your scenario.

---

## Webhook Payloads

All webhooks are fired from `app/api/quote-notify/route.ts` via a server-side `POST` request. The `MAKE_WEBHOOK_URL` env var must be set for any notifications to go through.

### 1. Quote Submitted

Fired when a user submits a quote from the `/configure` page.

```json
{
  "type": "quote_submitted",
  "user_email": "client@example.com",
  "user_name": "Jane Smith",
  "tier": "growth",
  "addons": ["seo_reporting", "lead_funnel"],
  "base_price": 15000,
  "monthly_price": 1200,
  "message": "We need the site launched before end of April."
}
```

| Field | Description |
|-------|-------------|
| `type` | Always `"quote_submitted"` for this trigger |
| `user_email` | Supabase auth email |
| `user_name` | Full name from profile |
| `tier` | One of `starter`, `growth`, `pro` |
| `addons` | Array of selected add-on IDs (may be empty) |
| `base_price` | Total once-off price in ZAR (null if consultative) |
| `monthly_price` | Monthly retainer in ZAR (null if consultative) |
| `message` | Optional note from the client |

### 2. Contact Form Submission

Fired when a visitor submits the contact form on the homepage.

```json
{
  "name": "John Doe",
  "business": "Acme Co",
  "email": "john@acme.co.za",
  "phone": "+27 82 123 4567",
  "message": "Interested in a quote for a 10-page site.",
  "tally_url": "https://tally.so/r/LZJ5ej",
  "submitted_at": "2026-04-15T09:00:00.000Z"
}
```

> Note: Contact form also sends email via Web3Forms (primary delivery). The Make.com webhook is a secondary notification — if it fails, the form submission is still received via Web3Forms.

---

## Suggested Make.com Scenario

> **Jason: fill this in once you've configured the scenario.**

Placeholder structure for what the scenario likely does (update as needed):

1. **Trigger:** Custom Webhook (receives POST)
2. **Router:** Branch on `type` field
   - `quote_submitted` → path A
   - *(no type field)* → path B (contact form)
3. **Path A — Quote notification:**
   - Send email to `jason@kleinhansdigital.co.za` with quote details
   - *(Optional)* Create a task in Notion / Trello / ClickUp
   - *(Optional)* Send WhatsApp message via Twilio or 360dialog
4. **Path B — Contact form notification:**
   - Send email or WhatsApp to Jason
   - *(Optional)* Add lead to CRM

---

## Admin Panel Webhook (Project Approval)

When Jason approves a quote in the admin panel (`/admin`), an optional webhook can be fired to notify the client. This is separate from the quote submission webhook and is triggered server-side from `app/api/admin/approve-quote/route.ts`.

Payload:
```json
{
  "type": "quote_approved",
  "client_email": "client@example.com",
  "client_name": "Jane Smith",
  "tier": "growth",
  "project_name": "Jane Smith — Growth Package",
  "approved_at": "2026-04-15T09:00:00.000Z"
}
```

---

## Testing the Webhook Locally

Make.com can only receive webhooks from publicly accessible URLs. To test locally:
1. Use [ngrok](https://ngrok.com/) to tunnel your local dev server
2. Set `MAKE_WEBHOOK_URL` to the ngrok tunnel URL in your `.env.local`
3. Submit a test quote from `/configure`
