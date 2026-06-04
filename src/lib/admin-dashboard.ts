import { demoApplications, demoJobs } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, JobStatus, UserRole } from "@/types/database";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
};

export type AdminRecruiterRow = {
  id: string;
  company: string;
  contact: string;
  verified: boolean;
  joined: string;
};

export type AdminJobRow = {
  id: string;
  title: string;
  company: string;
  category: string;
  status: JobStatus;
  applications: number;
  posted: string;
};

export type AdminDashboardData = {
  stats: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    recruiters: number;
    activeJobs: number;
  };
  charts: {
    userGrowth: { month: string; users: number; recruiters: number }[];
    applications: { month: string; applications: number }[];
    jobsByCategory: { category: string; jobs: number }[];
  };
  tables: {
    users: AdminUserRow[];
    recruiters: AdminRecruiterRow[];
    jobs: AdminJobRow[];
  };
};

const demoUsers: AdminUserRow[] = [
  {
    id: "demo-user-1",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "job_seeker",
    joined: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-user-2",
    name: "Noah Chen",
    email: "noah@example.com",
    role: "job_seeker",
    joined: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-user-3",
    name: "Asha Menon",
    email: "asha@northstar.example",
    role: "recruiter",
    joined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-user-4",
    name: "Rohan Iyer",
    email: "rohan@signalworks.example",
    role: "recruiter",
    joined: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-user-5",
    name: "Admin User",
    email: "admin@hireflow.example",
    role: "admin",
    joined: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const demoRecruiters: AdminRecruiterRow[] = [
  {
    id: "demo-rec-1",
    company: "Northstar Labs",
    contact: "asha@northstar.example",
    verified: true,
    joined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-rec-2",
    company: "SignalWorks",
    contact: "rohan@signalworks.example",
    verified: false,
    joined: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-rec-3",
    company: "Cobalt Systems",
    contact: "talent@cobalt.example",
    verified: false,
    joined: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function monthLabel(date: Date) {
  return date.toLocaleDateString("en", { month: "short" });
}

function getRecentMonths() {
  const months: { month: string; monthIndex: number; year: number }[] = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({ month: monthLabel(date), monthIndex: date.getMonth(), year: date.getFullYear() });
  }

  return months;
}

function sameMonth(value: string, monthIndex: number, year: number) {
  const date = new Date(value);
  return date.getMonth() === monthIndex && date.getFullYear() === year;
}

function inferCategory(title: string) {
  const text = title.toLowerCase();
  if (text.includes("design")) return "Design";
  if (text.includes("data") || text.includes("analyst")) return "Data";
  if (text.includes("product")) return "Product";
  if (text.includes("recruit")) return "Recruiting";
  return "Engineering";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildDashboardData({
  applications,
  jobs,
  recruiters,
  users,
}: {
  applications: { id: string; job_id: string; created_at: string; status: ApplicationStatus }[];
  jobs: {
    id: string;
    title: string;
    company: string;
    status: JobStatus;
    created_at: string;
  }[];
  recruiters: AdminRecruiterRow[];
  users: AdminUserRow[];
}): AdminDashboardData {
  const months = getRecentMonths();
  const jobsByCategory = jobs.reduce<Record<string, number>>((acc, job) => {
    const category = inferCategory(job.title);
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  const jobApplicationCounts = applications.reduce<Record<string, number>>((acc, application) => {
    acc[application.job_id] = (acc[application.job_id] ?? 0) + 1;
    return acc;
  }, {});

  return {
    stats: {
      totalUsers: users.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      recruiters: recruiters.length,
      activeJobs: jobs.filter((job) => job.status === "open").length,
    },
    charts: {
      userGrowth: months.map(({ month, monthIndex, year }) => ({
        month,
        users: users.filter((user) => sameMonth(user.joined, monthIndex, year)).length,
        recruiters: recruiters.filter((recruiter) => sameMonth(recruiter.joined, monthIndex, year)).length,
      })),
      applications: months.map(({ month, monthIndex, year }) => ({
        month,
        applications: applications.filter((application) => sameMonth(application.created_at, monthIndex, year)).length,
      })),
      jobsByCategory: Object.entries(jobsByCategory).map(([category, count]) => ({
        category,
        jobs: count,
      })),
    },
    tables: {
      users: users.slice(0, 8),
      recruiters: recruiters.slice(0, 8),
      jobs: jobs
        .map((job) => ({
          ...job,
          category: inferCategory(job.title),
          applications: jobApplicationCounts[job.id] ?? 0,
          posted: formatDate(job.created_at),
        }))
        .slice(0, 8),
    },
  };
}

function getDemoAdminDashboardData() {
  const jobs = demoJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company_name ?? "HireFlow Partner",
    status: job.status,
    created_at: job.created_at,
  }));

  const applications = [
    ...demoApplications,
    {
      id: "demo-app-2",
      job_id: "demo-2",
      job_seeker_id: "demo-seeker-2",
      status: "interview" as ApplicationStatus,
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-app-3",
      job_id: "demo-1",
      job_seeker_id: "demo-seeker-3",
      status: "pending" as ApplicationStatus,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ].map((application) => ({
    id: application.id,
    job_id: application.job_id,
    created_at: application.created_at,
    status: application.status,
  }));

  return buildDashboardData({
    applications,
    jobs,
    recruiters: demoRecruiters,
    users: demoUsers,
  });
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  if (!isSupabaseConfigured()) return getDemoAdminDashboardData();

  const supabase = await createClient();
  if (!supabase) return getDemoAdminDashboardData();

  const [usersResult, recruitersResult, jobsResult, applicationsResult] = await Promise.all([
    supabase.from("users").select("id,email,full_name,role,created_at").order("created_at", { ascending: false }),
    supabase
      .from("recruiters")
      .select("id,company_name,verified,created_at,users(email)")
      .order("created_at", { ascending: false }),
    supabase
      .from("jobs")
      .select("id,title,status,created_at,recruiters(company_name)")
      .order("created_at", { ascending: false }),
    supabase.from("applications").select("id,job_id,status,created_at").order("created_at", { ascending: false }),
  ]);

  if (usersResult.error || recruitersResult.error || jobsResult.error || applicationsResult.error) {
    return getDemoAdminDashboardData();
  }

  const users = (usersResult.data ?? []).map((user) => ({
    id: user.id,
    name: user.full_name || "Unnamed user",
    email: user.email,
    role: user.role as UserRole,
    joined: user.created_at,
  }));

  const recruiters = (recruitersResult.data ?? []).map((row) => {
    const user = row.users as { email?: string } | null;
    return {
      id: row.id,
      company: row.company_name,
      contact: user?.email ?? "No contact",
      verified: row.verified,
      joined: row.created_at,
    };
  });

  const jobs = (jobsResult.data ?? []).map((row) => {
    const recruiter = row.recruiters as { company_name?: string } | null;
    return {
      id: row.id,
      title: row.title,
      company: recruiter?.company_name ?? "Unknown company",
      status: row.status as JobStatus,
      created_at: row.created_at,
    };
  });

  const applications = (applicationsResult.data ?? []).map((application) => ({
    id: application.id,
    job_id: application.job_id,
    status: application.status as ApplicationStatus,
    created_at: application.created_at,
  }));

  return buildDashboardData({ applications, jobs, recruiters, users });
}
