-- Demo seed data (run after schema + at least one auth user exists)
-- For presentation: jobs can also be loaded via app demo mode without this file.

INSERT INTO jobs (recruiter_id, title, description, location, employment_type, salary_min, salary_max, status)
SELECT
  r.id,
  v.title,
  v.description,
  v.location,
  v.employment_type,
  v.salary_min,
  v.salary_max,
  'open'::job_status
FROM recruiters r
CROSS JOIN (
  VALUES
    (
      'Senior Full Stack Engineer',
      'Build scalable hiring workflows with Next.js, PostgreSQL, and Supabase.',
      'Bengaluru, India',
      'full-time',
      1800000,
      2800000
    ),
    (
      'Product Designer',
      'Design recruiter and candidate experiences for a modern job portal.',
      'Remote',
      'full-time',
      1200000,
      2000000
    ),
    (
      'Data Analyst Intern',
      'Analyze application funnel metrics and produce hiring insights.',
      'Hyderabad, India',
      'internship',
      300000,
      500000
    )
) AS v(title, description, location, employment_type, salary_min, salary_max)
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1)
LIMIT 3;
