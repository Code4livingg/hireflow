export type UserRole = "job_seeker" | "recruiter" | "admin";
export type JobStatus = "open" | "closed" | "draft";
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "interview"
  | "offered"
  | "rejected"
  | "withdrawn";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  location: string | null;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  company_name?: string;
};

export type Application = {
  id: string;
  job_id: string;
  job_seeker_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  job_title?: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type DashboardStats = {
  label: string;
  value: string;
  detail: string;
};
