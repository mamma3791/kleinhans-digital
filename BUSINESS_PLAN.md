# Kleinhans Digital — Business Plan and Automation Roadmap

> Last updated: April 2026. Written against the live codebase state.

---

## PART 1 — Current State

### What exists

| System | Status | Notes |
|--------|--------|-------|
| Marketing site | Live | kleinhansdigital.co.za — Next.js, Vercel, fully SEO'd |
| Quote configurator | Live | `/configure` — inserts into `quotes` table, fires webhook |
| Client dashboard | Live | `/dashboard` — quotes, projects, invoices, messages, assets, profile |
| Admin panel | Live | `/admin` — view all quotes, approve → create project, update status |
| Supabase database | Live | 8 tables: profiles, quotes, projects, milestones, project_files, invoices, messages, assets |
| Google OAuth | Live | Popup flow via Supabase Auth |
| Make.com | Blank | Webhook URL may be dead — no scenarios exist |
| Payment processing | Not built | No gateway integrated — invoicing is manual |
| Proposal system | Not built | No templated proposals — done ad hoc |
| Contract/e-signature | Not built | No DocuSign/HelloSign equivalent |
| Automated onboarding | Not built | Client onboarding is manual after project creation |
| Reporting | Not built | No automated monthly reports to clients |

### What is manual right now

Every step from quote submission to delivery currently requires Jason to be personally present:

1. Client submits quote → Jason receives email notification (if webhook works) → Jason manually reviews
2. Jason decides whether to proceed → writes and sends a proposal by hand
3. Client approves → Jason manually sends a deposit invoice (no payment link)
4. Client pays → Jason manually marks invoice paid, creates project in admin panel
5. Jason does all project work
6. Jason manually sends deliverables, uploads assets, updates project progress
7. Jason sends completion invoice — again manually
8. Client pays → monthly retainer begins — Jason must manually bill each month

**Time cost estimate:** 2–4 hours of admin per client per month, not counting the actual work.

### What is broken or incomplete

- Make.com webhook has no scenarios — notifications are firing into a void
- No payment gateway — clients must pay via EFT and Jason must check his bank
- Admin panel email fallback uses `info@kleinhansdigital.co.za` but `ADMIN_USER_ID` env var should be set instead
- No client notification when their quote status changes in admin
- No automated monthly retainer reminder
- No proposal template — every proposal written from scratch

---

## PART 2 — Make.com Audit

All three webhook payloads route through `POST /api/quote-notify` to a single `MAKE_WEBHOOK_URL`. Make.com must use a **Router** to branch on the `type` field.

### Payload 1 — Contact form submission

**Fired from:** `app/components/Contact.tsx` (homepage contact form)
**When:** Visitor submits the contact form

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

**Note:** Web3Forms already emails this to info@kleinhansdigital.co.za. Make.com is secondary/CRM.

---

### Payload 2 — Quote submitted

**Fired from:** `app/configure/page.tsx` → `POST /api/quote-notify`
**When:** Authenticated user submits a quote from `/configure`

```json
{
  "type": "quote_submitted",
  "user_email": "client@example.com",
  "user_name": "Jane Smith",
  "tier": "growth",
  "addons": ["seo_reporting", "lead_funnel"],
  "base_price": 15000,
  "monthly_price": 1200,
  "message": "Need the site live before end of April."
}
```

---

### Payload 3 — Quote approved (project created)

**Fired from:** `app/api/admin/approve-quote/route.ts`
**When:** Jason clicks "Approve & start project" in the admin panel

```json
{
  "type": "quote_approved",
  "client_email": "client@example.com",
  "client_name": "Jane Smith",
  "tier": "growth",
  "project_name": "Jane Smith — Growth Package",
  "project_id": "uuid-here",
  "approved_at": "2026-04-15T09:00:00.000Z"
}
```

### Make.com scenarios to build (priority order)

**Scenario 1 — Inbound notification hub** *(build first, immediate value)*

Single webhook trigger → router on `type` field.

Branch A — `type = "quote_submitted"`:
- Send email to `info@kleinhansdigital.co.za`:
  - Subject: `New quote: [user_name] — [tier] package`
  - Body: name, email, tier, R[base_price] + R[monthly_price]/mo, add-ons list, their message, link to admin panel (`https://kleinhansdigital.co.za/admin`)
- Send WhatsApp message to +27726340848 via WhatsApp Business API (or Twilio): `New quote from [user_name] — [tier] R[base_price]. Check admin panel.`

Branch B — `type = "quote_approved"`:
- Send email to the client (`client_email`):
  - Subject: `Your Kleinhans Digital project is approved — let's get started`
  - Body: congratulations, project name, link to their dashboard (`https://kleinhansdigital.co.za/dashboard`), what happens next, deposit invoice coming soon
- Send internal WhatsApp to Jason: `Project approved for [client_name] — [project_name]. Remember to send deposit invoice.`

Branch C — no `type` field (contact form):
- Add row to a Google Sheet or Notion database with name, business, email, phone, message, date
- Optionally send a WhatsApp ping to Jason (skip if Web3Forms already handles email)

---

**Scenario 2 — Deposit invoice reminder** *(build second)*

Trigger: Schedule — daily at 09:00 SAST
- Query Supabase REST API: fetch projects where `status = 'planning'` and `created_at < now() - interval '24 hours'`
- For each result: check if an invoice exists for that `user_id` with `status = 'sent'`
- If no invoice sent: send WhatsApp to Jason: `No deposit invoice sent yet for [project_name] (created yesterday). Create one in admin.`

---

**Scenario 3 — Monthly retainer reminder** *(build third)*

Trigger: Schedule — 1st of each month, 08:00 SAST
- Query Supabase: fetch all invoices where `status = 'paid'` and `description` contains 'retainer' — get distinct `user_id` list (active retainer clients)
- For each active client: create a new invoice row in Supabase via REST API (copy previous month's amount), set `status = 'sent'`, `due_date = today + 7 days`
- Send email to each client via Gmail module: "Your monthly retainer invoice is ready — view it in your client dashboard"
- Send summary to Jason: `Monthly retainer invoices sent: [N] clients, total R[amount]`

---

**Scenario 4 — Client project update notification** *(build fourth)*

Trigger: Supabase webhook or scheduled check — when `projects.progress` or `projects.status` changes
- Send email to client: "Update on your project: [project_name] is now [status] — [progress]% complete"
- This requires a Supabase database webhook (Supabase → Webhooks → Insert/Update on `projects` table → Make.com URL)

---

**Scenario 5 — Payment confirmation** *(build when payment gateway is live)*

Trigger: PayFast / Peach Payments webhook
- On successful payment: update invoice status in Supabase to `paid`, set `paid_at`
- Send receipt email to client
- If it's a deposit: notify Jason to start project
- If it's a final payment: trigger delivery checklist

---

## PART 3 — Business Automation Roadmap

### Effort scale: S = half day, M = 1–2 days, L = 3–5 days, XL = 1–2 weeks

| Priority | What | Where | Effort | Unlocks |
|----------|------|--------|--------|---------|
| 1 | Build Make.com Scenario 1 (notifications) | Make.com | S | Jason hears about every lead immediately |
| 2 | Set ADMIN_USER_ID + SUPABASE_SERVICE_ROLE_KEY in Vercel | Vercel | S | Admin panel fully works |
| 3 | Proposal template in Canva/Notion, sent via email | Manual process | S | Consistent proposals, faster turnaround |
| 4 | Integrate PayFast (SA payment gateway) | Codebase | M | Clients pay online — removes biggest manual bottleneck |
| 5 | Auto-send deposit invoice on project approval | Codebase + Make.com | M | Removes manual invoice creation |
| 6 | Make.com Scenario 2 (deposit reminder) | Make.com | S | No more forgotten invoices |
| 7 | Contract e-signature (HelloSign or PandaDoc free tier) | Third party | S | Legal protection, professional |
| 8 | Make.com Scenario 3 (monthly retainer automation) | Make.com + Supabase | M | Retainer billing runs itself |
| 9 | Project update notifications to clients | Supabase webhooks + Make.com | M | Clients feel informed without Jason emailing |
| 10 | Onboarding checklist — auto-created milestones per tier | Codebase | M | Every project starts with the same structure |
| 11 | Monthly SEO report auto-generation | Looker Studio + Make.com | L | Retainer value is visible without manual reporting |
| 12 | Client satisfaction survey at project completion | Make.com + Tally | S | Testimonials and NPS captured automatically |
| 13 | Google Reviews follow-up | Make.com | S | Reputation building without thinking about it |
| 14 | Lead scoring in CRM (Notion or HubSpot free) | Make.com | M | Prioritise leads that are most likely to close |
| 15 | WhatsApp chatbot for website enquiries | Third party (360dialog/Twilio) | L | After-hours lead capture |

---

## PART 4 — The Ideal Fully Automated Client Journey

```
DISCOVERY
Visitor hits kleinhansdigital.co.za
→ Browses services, reads portfolio
→ Clicks "Get a quote" → /configure

QUOTE
Client selects tier and add-ons
→ Prompted to sign in with Google (1 click)
→ Quote saved to Supabase
→ Make.com: Jason gets WhatsApp + email notification immediately
→ Client sees quote in their dashboard with status "Submitted"

PROPOSAL (currently manual — target: semi-automated)
Jason reviews quote in /admin (2 minutes)
→ Clicks "Mark reviewing" → client status updates in dashboard
→ Jason sends templated proposal PDF (Canva/PandaDoc) via email
→ Jason updates quote status to "Proposal sent"
→ Make.com: client gets email "Your proposal is ready"

APPROVAL & DEPOSIT
Client accepts proposal → replies or signs e-contract
→ Jason clicks "Approve & start project" in admin
→ Make.com: client gets email with deposit invoice link (PayFast)
→ Client pays online (no EFT, no bank check)
→ PayFast webhook → invoice marked paid → Make.com notifies Jason

PROJECT KICKOFF (target: automated)
Payment confirmed →
→ Project status auto-changes to "in_progress"
→ Default milestone set created for the tier (Discovery, Design, Dev, Content, Launch)
→ Client gets welcome email with dashboard link and what to expect
→ WhatsApp message to client with Jason's number for direct contact

DELIVERY
Jason works, updates progress % in admin
→ Each status update → Make.com → client email notification
→ Milestones ticked off → client sees progress in real time
→ Assets uploaded → client notified

COMPLETION & FINAL INVOICE (target: automated)
Jason marks project "complete"
→ Completion invoice auto-created (50% balance)
→ Make.com: client email with payment link
→ Client pays online
→ Make.com: receipt sent, Jason notified
→ Client satisfaction survey sent automatically (Tally)
→ Google Review request sent 3 days later (Make.com scheduled)

RETAINER (fully automated)
1st of every month:
→ Make.com creates invoice in Supabase
→ Email to client with payment link
→ Client pays via PayFast recurring or manual link
→ Payment confirmed → Make.com → receipt

ANNUAL REVIEW (target: semi-automated)
Make.com: on 11-month anniversary of project completion
→ Email to client: "Your annual review is coming up — here's what we've achieved this year"
→ Looker Studio report auto-generated and linked
→ Upsell prompt: tier upgrade or new add-on
```

---

## PART 5 — Revenue Model and Pricing for Scale

### Current pricing (correct as of April 2026)

| Tier | Once-off | Monthly retainer |
|------|----------|-----------------|
| Starter | R6,500 | R650/mo |
| Growth | R12,000 | R1,200/mo |
| Pro | R22,000 | R2,200/mo |
| Custom | Consultative | Consultative |

### Unit economics per client (Starter example)

- Once-off revenue: R6,500 (split: R3,250 deposit + R3,250 on completion)
- Monthly retainer: R650 × 12 = R7,800/year
- Year 1 total: R14,300
- Year 2+ (retainer only): R7,800/year
- Client acquisition cost: near zero if all inbound via SEO

At 20 active retainer clients: R13,000/month base, independent of new sales.

### Scaling without proportional work increase

The key insight is that the monthly retainer is the business. One-time builds are client acquisition cost for retainers. The automation priority should be on making retainer delivery effortless:

1. **Reporting automation** — Looker Studio + Make.com. Currently manual. Once automated, each retainer client takes 30 min/month instead of 3 hours.
2. **Billing automation** — Make.com + PayFast. Once automated, retainer collection is zero-touch.
3. **Content updates** — Build a simple content update request form in the dashboard. Client submits a change request, it appears as a task, Jason addresses it in one batch per client per month.
4. **Subcontractor model** — When volume exceeds solo capacity, bring in a junior dev or designer. The documented systems (this plan, DASHBOARD_SCHEMA.md, the admin panel) mean handover takes hours, not weeks.

### Pricing evolution

**Now (solo, sub-10 clients):** Current pricing is correct for the market and positioning.

**12 months (10–20 clients):** Consider introducing a mid-tier retainer at R950/month that includes quarterly site updates. This increases average retainer value without proportional work.

**24 months (20–40 clients):** Introduce a white-label offering — resell Kleinhans Digital's build + infrastructure to other freelancers or small agencies under their own brand. Revenue per site without client acquisition.

**36 months (40+ clients or exit):** The business is sellable (see Part 7). Consider bringing on one full-time employee or partner, or selling the client book.

---

## PART 6 — 12 / 24 / 36 Month Projections

These are conservative estimates based on SA market conditions and solo operation.

### Month 12 target

**Clients:** 8–12 active retainer clients
**Once-off builds:** 2–3/month at average R10,000 = R20–30k/month once-off
**Retainer revenue:** 10 clients × R900 avg = R9,000/month
**Total MRR + once-off:** ~R30–40k/month
**Key milestone:** PayFast integrated, Make.com Scenarios 1–3 live, admin panel in daily use

### Month 24 target

**Clients:** 20–30 active retainer clients
**Once-off builds:** 3–4/month (some repeat clients upgrading)
**Retainer revenue:** 25 clients × R1,000 avg = R25,000/month
**Total MRR + once-off:** ~R65–80k/month
**Key milestone:** Monthly reporting automated, subcontractor relationship established for overflow, first international client (UK/AU)

### Month 36 target

**Clients:** 40–50 active retainer clients
**Retainer revenue:** 45 clients × R1,100 avg = ~R50,000/month
**Additional:** White-label revenue from 2–3 reseller partners
**Total MRR:** ~R60–70k/month
**Key milestone:** Business runs without Jason in every task. Documented SOP for every service. Employee or business partner in place.

---

## PART 7 — Making the Business Sellable

A buyer looks for four things: recurring revenue, systems, proof of delivery, and low key-person risk.

### What makes this valuable to a buyer

1. **Predictable MRR** — Retainer clients on rolling contracts are the single biggest value driver. Every client should be on a signed contract with a minimum 3-month notice period.

2. **Documented systems** — This codebase is a head start. The admin panel, DASHBOARD_SCHEMA.md, MAKE.md, and this plan are exactly what a buyer needs. Add SOPs for: client onboarding, monthly retainer delivery, how to update a client's site, how to handle a client complaint.

3. **Client portal stickiness** — The dashboard is a competitive moat. Clients with projects, invoices, assets, and messages in your system don't leave easily. A buyer inherits not just revenue but infrastructure.

4. **Proof of delivery** — Case studies, testimonials, live portfolio sites. Document the before/after for each portfolio client.

5. **Transferability** — The business must not depend on Jason personally. This means:
   - Signed contracts with clients, not verbal agreements
   - Email and communication via info@kleinhansdigital.co.za, not a personal address
   - Standard project naming conventions, not tribal knowledge
   - The admin panel and Make.com scenarios replace Jason's memory

### What to add before any sale

- Client contracts with 3-month minimum notice on retainers
- 12 months of consistent financial records (invoices, payments)
- Google Analytics showing organic traffic growth (proves SEO investment)
- SOPs written for the 5 most common tasks
- At least one other person who has successfully delivered a project using your systems

### Valuation model

Boutique web agencies in South Africa typically sell at 1.5–3× annual recurring revenue.

At R50,000/month MRR (Month 36 target): **R900k–R1.8m valuation range.**

The platform (this codebase, client portal, admin panel) adds a premium above a pure client-book sale because it's transferable infrastructure, not just relationships.

---

## PART 8 — Make.com Scenarios (Full Specification)

### How to set up

1. Log into Make.com
2. Create a new scenario for each one below
3. In each: add a **Custom webhook** trigger → copy the webhook URL → paste into Vercel as `MAKE_WEBHOOK_URL`
4. All 3 payload types share the same URL — use a **Router** module to branch

---

### Scenario 1: Inbound Notification Hub

**Trigger:** Custom Webhook (receives all 3 payload types)

**Module 2:** Router
- Branch 1: Filter — `type` equals `quote_submitted`
- Branch 2: Filter — `type` equals `quote_approved`
- Branch 3: Filter — `type` does not exist (contact form)

**Branch 1 — Quote submitted:**
- Module 3: Gmail → Send email
  - To: `info@kleinhansdigital.co.za`
  - Subject: `New quote: {{user_name}} — {{tier}} package`
  - Body (HTML):
    ```
    New quote from {{user_name}} ({{user_email}})
    Package: {{tier}}
    Once-off: R{{base_price}}  |  Monthly: R{{monthly_price}}/mo
    Add-ons: {{addons}}
    Message: {{message}}
    ---
    Review in admin: https://kleinhansdigital.co.za/admin
    ```
- Module 4: WhatsApp Business API (or Twilio) → Send message to +27726340848
  - `New quote from {{user_name}} — {{tier}} R{{base_price}}. Check admin: kleinhansdigital.co.za/admin`

**Branch 2 — Quote approved:**
- Module 3: Gmail → Send email to client
  - To: `{{client_email}}`
  - Subject: `Your project has been approved — let's get started`
  - Body:
    ```
    Hi {{client_name}},

    Great news — your {{tier}} project has been approved and is ready to kick off.

    Project name: {{project_name}}

    We'll be sending your deposit invoice shortly. Once that's settled, we'll begin immediately.

    You can track everything in your client portal:
    https://kleinhansdigital.co.za/dashboard

    Speak soon,
    Jason
    Kleinhans Digital
    ```
- Module 4: WhatsApp to +27726340848
  - `Project approved: {{project_name}} for {{client_name}}. Send deposit invoice.`

**Branch 3 — Contact form:**
- Module 3: Google Sheets → Add row (Sheet: "Leads")
  - Columns: Date, Name, Business, Email, Phone, Message
- Module 4 (optional): WhatsApp to +27726340848
  - `Contact form: {{name}} from {{business}} — {{email}}`

---

### Scenario 2: Deposit Invoice Reminder

**Trigger:** Schedule — every day at 09:00 (Africa/Johannesburg)

**Module 2:** HTTP → Make a request
- URL: `https://YOUR_SUPABASE_URL/rest/v1/projects?status=eq.planning&created_at=lt.{{formatDate(subtractDays(now, 1), "YYYY-MM-DD")}}&select=id,name,user_id,created_at`
- Headers: `apikey: YOUR_SUPABASE_ANON_KEY`, `Authorization: Bearer YOUR_SUPABASE_SERVICE_KEY`

**Module 3:** Iterator (loop over results)

**Module 4:** HTTP → Check for existing invoice
- URL: `https://YOUR_SUPABASE_URL/rest/v1/invoices?user_id=eq.{{user_id}}&status=eq.sent`

**Module 5:** Filter — invoices array is empty (no invoice sent yet)

**Module 6:** WhatsApp to +27726340848
- `Reminder: No deposit invoice sent for {{project_name}} (created yesterday). Create one in /admin.`

---

### Scenario 3: Monthly Retainer Billing

**Trigger:** Schedule — 1st of every month, 08:00 SAST

**Module 2:** HTTP → Fetch active retainer clients
- Query `invoices` where description contains 'retainer' and status = 'paid' → distinct user_ids

**Module 3:** Iterator

**Module 4:** HTTP → Create new invoice in Supabase (POST to `/rest/v1/invoices`)
- Fields: user_id, invoice_number (auto-generate), description: "Monthly retainer — [Month Year]", amount (from previous invoice), status: "sent", due_date: today + 7 days

**Module 5:** Gmail → Send invoice notification to client
- Subject: `Your monthly retainer invoice is ready`
- Body: amount due, due date, link to dashboard

**Module 6:** Gmail → Summary to `info@kleinhansdigital.co.za`
- `Monthly retainer invoices sent: N clients`

---

### Scenario 4: Project Update Notifications

**Trigger:** Supabase Database Webhook
- In Supabase: Database → Webhooks → Create new webhook
- Table: `projects`, Events: UPDATE
- URL: Make.com custom webhook URL for this scenario

**Module 2:** Filter — `status` or `progress` actually changed (compare old vs new values)

**Module 3:** HTTP → Fetch client email from Supabase profiles

**Module 4:** Gmail → Send to client
- Subject: `Update on {{project_name}}`
- Body: `Your project is now {{status}} — {{progress}}% complete. View details: https://kleinhansdigital.co.za/dashboard/projects/{{id}}`

---

## PART 9 — Is Make.com the right tool? Alternatives.

### Make.com — honest assessment

**Free tier:** 1,000 operations/month, 2 active scenarios. Enough to start.
**Paid tier:** From $9/month for 10,000 operations.
**Verdict:** Yes, Make.com is fine for this stage. It's visual, reliable, and has good Supabase and Gmail connectors. The free tier covers the first 6–12 months easily.

### Alternatives worth knowing

| Tool | Cost | Best for | Limitation |
|------|------|----------|------------|
| **n8n** | Free (self-hosted on a VPS) | Everything Make.com does, plus more control | Needs a server (~R100/month VPS on Hetzner) |
| **Zapier** | Free tier: 5 zaps, 100 tasks/month | Simple 2-step automations | Too expensive for complex workflows |
| **Activepieces** | Free (self-hosted) | Make.com alternative, open source | Less polished, smaller community |
| **Pipedream** | Free tier generous | Developer-friendly, code-first | More technical than Make.com |

**Recommendation:** Start with Make.com free tier. When monthly operations exceed 1,000 or you need a 3rd scenario, either upgrade ($9/month) or move to n8n self-hosted on a Hetzner VPS.

### Where to build AI agents — for free

This is the more interesting question. Options ranked by how much they cost right now:

**1. Vercel AI SDK + Claude API (inside this codebase)**
- You already have Next.js + Vercel. Adding AI to a route handler is 10 lines of code.
- Claude API has no free tier — but costs are tiny for low volume (< $1/month for a small-scale assistant)
- Best for: AI that lives inside the client portal (e.g. a "what's the status of my project?" chatbot, proposal draft generator, content suggestions)

**2. n8n self-hosted with AI nodes**
- n8n has built-in OpenAI/Anthropic nodes
- Self-host on Hetzner (~R100/month) → completely free for the automation itself, you only pay for API calls
- Best for: AI-assisted automations (e.g. "when a quote comes in, draft a personalised proposal and email it to Jason for review")

**3. Flowise (open source, self-hostable)**
- Visual LLM flow builder — like Make.com but for AI agents
- Deploy free on Railway or Render
- Best for: RAG chatbots (e.g. a chatbot trained on your portfolio and pricing that handles initial client enquiries)

**4. Make.com free tier + Claude API**
- Make.com has an HTTP module — point it at Anthropic's API
- 1,000 free operations/month includes AI calls
- Best for: Drafting proposal emails, summarising client messages, categorising enquiries

**5. Cursor/Claude Code style agents for internal use**
- You're already using Claude Code. For automating dev tasks (writing boilerplate, updating client sites), this is the most powerful option and it's already in your workflow.

### Recommended architecture

```
Client-facing AI (portal chatbot, content suggestions)
→ Vercel AI SDK + Claude API in the Next.js codebase

Business process automation (emails, invoices, notifications)
→ Make.com (start free, upgrade when needed)

Complex workflows + AI-assisted proposals
→ n8n self-hosted on Hetzner VPS when you hit Make.com limits

Internal tooling + dev automation
→ Claude Code (already using this)
```

---

## Summary — What to do in the next 30 days

1. **Add env vars in Vercel:** `ADMIN_USER_ID`, `SUPABASE_SERVICE_ROLE_KEY` → unlocks admin panel
2. **Build Make.com Scenario 1** (30 min) → immediate lead notifications
3. **Run the quotes table SQL in Supabase** → fixes dashboard quotes page
4. **Write one proposal template** (Canva or Google Docs) → stops every proposal being built from scratch
5. **Research PayFast integration** → the single biggest friction reducer for clients

Everything else in this plan can wait until those 5 things are done.
