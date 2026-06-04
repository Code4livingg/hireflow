# Presentation Guide

Use this guide to present HireFlow as a complete DBMS mini-project and product
prototype.

## Setup

Start with Demo Mode for the smoothest walkthrough:

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

If Supabase is configured, use seeded data and pre-created accounts for each
role. Keep one browser profile or incognito window per role to avoid session
mixups.

## Suggested Walkthrough

1. Landing page (`/`)
   Show HireFlow as a role-based hiring platform with job seekers, recruiters,
   and admins.

2. Job discovery (`/jobs`)
   Demonstrate search, filters, salary range, job type, experience level,
   location, skills, sorting, save buttons, remote badges, and match scores.

3. Job detail (`/jobs/demo-1`)
   Highlight the AI-inspired resume match score, circular progress indicator,
   matching skills, missing skills, strength indicators, and skill gap analysis.

4. Student dashboard (`/dashboard/student`)
   Show tracked applications, stats, timeline, recommendations, and sidebar
   navigation.

5. Recruiter dashboard (`/dashboard/recruiter`)
   Show recruiter analytics, activity, candidate ranking, and the post-job form.
   Explain that candidates are ranked by skill overlap, experience level,
   education match, and resume completeness.

6. Admin dashboard (`/dashboard/admin`)
   Show platform stats, user growth, application trends, jobs by category, user
   management, recruiter approvals, and job moderation.

7. Supabase-ready behavior
   Explain that Demo Mode uses bundled generated data, while configured
   Supabase mode uses actual auth, profiles, jobs, applications, and profile
   skills where available.

## Demo Talking Points

- The app remains presentation-safe without external services.
- Supabase is optional for local demos but supported for real auth and DBMS
  persistence.
- Role-specific dashboards share a responsive sidebar layout.
- Job discovery and resume matching use a consistent data contract across demo
  and Supabase modes.
- The admin dashboard provides operational oversight for users, jobs,
  applications, recruiters, and moderation.

## Backup Plan

If Supabase credentials or internet access are unavailable, remove or unset:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Restart the dev server. The app will switch to Demo Mode and all presentation
routes listed above will render from bundled sample data.

## Final Checks

Before presenting, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then manually open:

- `/`
- `/jobs`
- `/jobs/demo-1`
- `/dashboard/student`
- `/dashboard/recruiter`
- `/dashboard/admin`
- `/login`
- `/register`
