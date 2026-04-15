# Dashboard Database Schema — Kleinhans Digital

Run these SQL migrations in your Supabase SQL editor (Dashboard → SQL Editor → New query).

---

## 1. Extend `profiles` table

The `profiles` table likely already exists from the onboarding flow. Add missing columns if needed:

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS billing_address text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 2. `projects` table

```sql
CREATE TABLE IF NOT EXISTS public.projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  status        text NOT NULL DEFAULT 'planning'
                  CHECK (status IN ('planning', 'in_progress', 'review', 'complete')),
  progress      integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  start_date    date,
  target_date   date,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 3. `milestones` table

```sql
CREATE TABLE IF NOT EXISTS public.milestones (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title         text NOT NULL,
  description   text,
  due_date      date,
  completed     boolean NOT NULL DEFAULT false,
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milestones for own projects"
  ON public.milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = milestones.project_id
        AND projects.user_id = auth.uid()
    )
  );
```

---

## 4. `project_files` table

```sql
CREATE TABLE IF NOT EXISTS public.project_files (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name          text NOT NULL,
  file_url      text NOT NULL,
  file_type     text,
  file_size     bigint,
  uploaded_by   text NOT NULL DEFAULT 'agency'
                  CHECK (uploaded_by IN ('client', 'agency')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for own projects"
  ON public.project_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_files.project_id
        AND projects.user_id = auth.uid()
    )
  );
```

---

## 5. `invoices` table

```sql
CREATE TABLE IF NOT EXISTS public.invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number  text NOT NULL,
  description     text NOT NULL,
  amount          numeric(12, 2) NOT NULL,
  status          text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  due_date        date,
  paid_at         timestamptz,
  pdf_url         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 6. `messages` table

```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender      text NOT NULL CHECK (sender IN ('client', 'agency')),
  content     text NOT NULL,
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_user_id_created_at
  ON public.messages (user_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert client messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND sender = 'client');

CREATE POLICY "Users can mark own messages as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 7. `assets` table

```sql
CREATE TABLE IF NOT EXISTS public.assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id  uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  name        text NOT NULL,
  description text,
  file_url    text NOT NULL,
  file_type   text,
  file_size   bigint,
  category    text NOT NULL DEFAULT 'other'
                CHECK (category IN ('design', 'code', 'document', 'media', 'other')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON public.assets FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Sample data (for testing)

Replace `YOUR_USER_ID` with a real user UUID from your `auth.users` table.

```sql
-- Sample project
INSERT INTO public.projects (user_id, name, description, status, progress, start_date, target_date)
VALUES (
  'YOUR_USER_ID',
  'Kleinhans Digital Website',
  'Custom 5-page website with contact form, WhatsApp integration, and basic SEO setup.',
  'in_progress',
  65,
  current_date - interval '10 days',
  current_date + interval '4 days'
);

-- Sample milestones (use the project id from above)
INSERT INTO public.milestones (project_id, title, description, due_date, completed, completed_at)
VALUES
  ('<PROJECT_ID>', 'Discovery & wireframes', 'Sitemap approved, wireframes signed off', current_date - interval '8 days', true, current_date - interval '7 days'),
  ('<PROJECT_ID>', 'Design mockups', 'Desktop and mobile designs in Figma', current_date - interval '3 days', true, current_date - interval '2 days'),
  ('<PROJECT_ID>', 'Development', 'Next.js build, all pages, responsive', current_date + interval '2 days', false, null),
  ('<PROJECT_ID>', 'Content & SEO', 'Copy review, meta tags, sitemap', current_date + interval '3 days', false, null),
  ('<PROJECT_ID>', 'Go live', 'DNS cutover, SSL, Google Search Console', current_date + interval '4 days', false, null);

-- Sample invoice
INSERT INTO public.invoices (user_id, invoice_number, description, amount, status, due_date)
VALUES (
  'YOUR_USER_ID',
  'INV-2026-001',
  '50% deposit — Starter Website Package',
  3250.00,
  'paid',
  current_date - interval '5 days'
);

INSERT INTO public.invoices (user_id, invoice_number, description, amount, status, due_date)
VALUES (
  'YOUR_USER_ID',
  'INV-2026-002',
  'Balance due on completion — Starter Website Package',
  3250.00,
  'sent',
  current_date + interval '4 days'
);

-- Sample message from agency
INSERT INTO public.messages (user_id, sender, content, read)
VALUES (
  'YOUR_USER_ID',
  'agency',
  'Hi! Your project is progressing well — the design mockups are done and we''re heading into development. We''ll share the staging link by end of week. Let us know if you have any questions!',
  false
);
```
