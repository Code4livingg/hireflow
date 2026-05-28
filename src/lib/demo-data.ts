import type { Application, Job } from "@/types/database";

export const demoJobs: Job[] = [
  {
    id: "demo-1",
    recruiter_id: "demo-recruiter",
    title: "Senior Full Stack Engineer",
    description:
      "Build scalable hiring workflows with Next.js, PostgreSQL, and Supabase. Work on authentication, dashboards, and relational data models.",
    location: "Bengaluru, India",
    employment_type: "full-time",
    salary_min: 1800000,
    salary_max: 2800000,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_name: "Northstar Labs",
  },
  {
    id: "demo-2",
    recruiter_id: "demo-recruiter",
    title: "Product Designer",
    description:
      "Design recruiter and candidate experiences for a modern job portal with accessible, responsive UI patterns.",
    location: "Remote",
    employment_type: "full-time",
    salary_min: 1200000,
    salary_max: 2000000,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_name: "Cobalt Systems",
  },
  {
    id: "demo-3",
    recruiter_id: "demo-recruiter",
    title: "Data Analyst Intern",
    description:
      "Analyze application funnel metrics, build reports, and support DBMS coursework demonstrations.",
    location: "Hyderabad, India",
    employment_type: "internship",
    salary_min: 300000,
    salary_max: 500000,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_name: "SignalWorks",
  },
];

export const demoApplications: Application[] = [
  {
    id: "demo-app-1",
    job_id: "demo-1",
    job_seeker_id: "demo-seeker",
    status: "reviewing",
    cover_letter: "Excited to contribute to HireFlow.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    job_title: "Senior Full Stack Engineer",
  },
];
