# Krevian Academy website

A responsive React + Vite website using Supabase for authentication and data storage. It is designed around the Krevian Academy identity:

- Deep purple: `#3D0247`
- Krevian gold: `#FFBF00`
- White: `#FFFFFF`
- Typography: Montserrat

## Included

- Public homepage and course catalogue
- Student application form
- Login
- Student dashboard and application tracking
- Admin dashboard, application review, student list and course catalogue
- Supabase SQL schema with row-level security policies
- Vercel-ready Vite project

## 1. Run locally

Install Node.js (LTS), then in this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## 2. Connect Supabase

1. Create a project at https://supabase.com.
2. Open **SQL Editor** in your Supabase project.
3. Paste and run `supabase/schema.sql`.
4. In **Project Settings → API**, copy the Project URL and anon/public key.
5. Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

6. In Supabase **Authentication → URL Configuration**, add your local and production website URLs to the allowed redirect URLs.
7. In **Authentication → Providers**, enable Email. Configure email confirmation to suit your launch process.

## 3. Create the first admin

1. Register a normal user account at `/signup` and confirm the email if email confirmation is enabled.
2. The profile row is created on first login.
3. Run this in Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_ADMIN_EMAIL';
```

4. Sign out and sign in again. The admin portal is available at `/admin`.

**Security note:** Never put a Supabase `service_role` key in this website or in a `VITE_` variable. Only use the anon/public key in the browser. Keep admin authorization in Supabase RLS policies.

## 4. Upload to GitHub

Create a new empty GitHub repository. Upload the contents of this folder (not the containing ZIP file), or use Git:

```bash
git init
git add .
git commit -m "Initial Krevian Academy website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/krevian-academy.git
git push -u origin main
```

Do not upload `.env`. It contains project configuration. The included `.gitignore` excludes it.

## 5. Deploy to Vercel

1. Sign in at https://vercel.com and import the GitHub repository.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Vercel Project → Settings → Environment Variables.
4. Deploy.
5. Add your custom domain under Vercel Project → Settings → Domains. Buy/renew the domain separately through a domain registrar.
6. Add the final Vercel domain to Supabase Authentication → URL Configuration.

## Important launch notes

- The site is a working frontend foundation, but it does not yet process payments, deliver course videos, send automated application emails, or provide a full lesson/LMS system.
- Course fees currently included from the academy planning conversation: Graphic Design ₦7,000, AI Video Creation ₦5,000 and Video Editing ₦15,000. Confirm these before publishing.
- Applications are submitted without payment. Add a verified payment provider and server-side payment verification before marking a student as paid/enrolled.
- Supabase must be configured before application storage, authentication and dashboards will work.
- For a production launch, test RLS policies with separate student and admin accounts before accepting real student data.

## Appearance, motion and mobile refresh

- The interface follows the visitor's device light/dark appearance by default.
- The theme control in the header cycles between device setting, dark mode and light mode. The selection is saved in the browser.
- Page sections and cards use restrained scroll-reveal motion and hover/tap feedback.
- Visitors who have enabled reduced motion on their device receive a reduced-motion experience.
- On touch devices, pull down from the top of the page and release to refresh.
