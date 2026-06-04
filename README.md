# HireFlow

A stable, presentation-ready recruiting platform built for a DBMS mini project.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn-style components
- Supabase (PostgreSQL + Auth)

## Quick start

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Supabase setup

1. Create a Supabase project
2. Copy `.env.example` to `.env.local` and add your keys
3. **Important:** `NEXT_PUBLIC_SUPABASE_URL` must be the project root only:
   - Correct: `https://YOUR_REF.supabase.co`
   - Wrong: `https://YOUR_REF.supabase.co/rest/v1` (causes auth errors)
4. In Supabase → **Authentication → URL Configuration**, set:
   - **Site URL:** `http://127.0.0.1:3000` (or your Vercel URL in production)
   - **Redirect URLs:**
     - `http://127.0.0.1:3000/auth/callback`
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_APP.vercel.app/auth/callback` (production)
5. If you see **"Invalid path specified in request URL"**, your `NEXT_PUBLIC_SUPABASE_URL` includes `/rest/v1` — remove it.
6. Run `supabase/schema.sql` in the SQL Editor
7. Optionally run `supabase/seed.sql` after creating a recruiter account

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/jobs` | Job listings |
| `/jobs/[id]` | Job details + apply/save |
| `/login` | Sign in |
| `/register` | Sign up (job seeker / recruiter) |
| `/profile` | User profile |
| `/dashboard/student` | Job seeker dashboard |
| `/dashboard/recruiter` | Recruiter dashboard |
| `/dashboard/admin` | Admin dashboard |

## Demo mode

Without Supabase env vars, the app runs in demo mode with sample jobs so localhost always loads for presentations.

To force Demo Mode locally, run the app without `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Public jobs, job details, student dashboard,
recruiter dashboard, and admin dashboard render from bundled demo data. Auth
forms remain visible but ask for Supabase configuration before sign-in or
registration.

## Screenshots

Use the following capture set for README assets, slide decks, and final project
submissions. Save images under `public/screenshots/` if you want them served by
the app.

| Screenshot | Route | What to capture |
|------------|-------|-----------------|
| `01-landing.png` | `/` | Hero, navigation, feature preview |
| `02-jobs-discovery.png` | `/jobs` | Search, filters, sort controls, upgraded job cards |
| `03-job-detail-match.png` | `/jobs/demo-1` | Match score, circular visualization, skill gap analysis |
| `04-student-dashboard.png` | `/dashboard/student` | Sidebar, stats, applications, recommended jobs |
| `05-recruiter-dashboard.png` | `/dashboard/recruiter` | Analytics, candidate ranking, post-job form |
| `06-admin-dashboard.png` | `/dashboard/admin` | Platform stats, charts, admin tables |
| `07-auth.png` | `/login` | Login screen and Supabase setup messaging |

Recommended viewport sizes:

- Desktop: `1440x1000`
- Mobile: `390x844`

Recommended command sequence before capturing:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000), switch the browser to the
target viewport, and capture the routes above.
