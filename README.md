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
3. Run `supabase/schema.sql` in the SQL Editor
4. Optionally run `supabase/seed.sql` after creating a recruiter account

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
