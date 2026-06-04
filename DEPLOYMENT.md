# Deployment

HireFlow is a Next.js 16 App Router application with optional Supabase-backed
auth and data. It can run in Demo Mode without Supabase, or in production mode
with Supabase configured.

## Production Checklist

Run these checks before every deployment:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The app uses the standard Next.js production flow:

```bash
npm run build
npm run start
```

## Environment Variables

Demo Mode requires no Supabase variables. For a real deployment, configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=https://YOUR_DEPLOYED_APP_URL
```

Important Supabase URL rule:

- Use the project root URL only: `https://YOUR_PROJECT_REF.supabase.co`
- Do not use REST or auth paths such as `/rest/v1` or `/auth/v1`

`NEXT_PUBLIC_SITE_URL` is used for auth redirect links. On Vercel, it can be
omitted if `VERCEL_URL` is available, but setting it explicitly is clearer for
production.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Optionally run `supabase/seed.sql` after creating a recruiter account.
4. In Supabase Authentication URL Configuration, set:
   - Site URL: your deployed app URL
   - Redirect URL: `https://YOUR_DEPLOYED_APP_URL/auth/callback`
5. Add the environment variables above to your hosting provider.
6. Deploy and verify the routes listed below.

## Demo Mode Deployment

To deploy a demo-only build, leave Supabase env vars unset. The app will:

- Render public jobs from bundled demo data.
- Render job details and resume match analysis from demo calculations.
- Render student, recruiter, and admin dashboards without auth redirects.
- Show auth forms, but return setup guidance instead of attempting Supabase auth.
- Simulate apply, save, and post-job actions with toast feedback.

## Route Verification

Verify these routes after deployment:

| Route | Expected result in Demo Mode | Expected result with Supabase |
|-------|------------------------------|-------------------------------|
| `/` | Landing page renders | Landing page renders |
| `/jobs` | Demo job discovery renders | Open jobs render from Supabase, fallback to demo on query failure |
| `/jobs/demo-1` | Demo job detail and match analysis render | Job detail renders for existing job IDs |
| `/login` | Login form renders | Login form renders |
| `/register` | Register form renders | Register form renders |
| `/profile` | Demo setup message renders | Requires signed-in user |
| `/dashboard/student` | Demo dashboard renders | Requires job seeker or admin |
| `/dashboard/recruiter` | Demo dashboard renders | Requires recruiter or admin |
| `/dashboard/admin` | Demo dashboard renders | Requires admin |

## Hosting Notes

Vercel is the simplest deployment target for this app. Other Node.js-compatible
hosts also work as long as they support `npm run build` and `npm run start`.

For Supabase production deployments, verify the deployed domain matches the
Supabase auth Site URL and redirect URL exactly, including protocol.

## Troubleshooting

If auth fails with “Invalid path specified in request URL,” remove `/rest/v1`
from `NEXT_PUBLIC_SUPABASE_URL`.

If dashboard routes redirect to login in production, confirm Supabase env vars
are configured and the user has the required role in the `users` table.

If Demo Mode does not activate, confirm both Supabase public env vars are unset
for the running process.
