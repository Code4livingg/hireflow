import { demoJobs } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/types/database";

export async function getJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return demoJobs;

  const supabase = await createClient();
  if (!supabase) return demoJobs;

  const { data, error } = await supabase
    .from("jobs")
    .select("*, recruiters(company_name)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error || !data) return demoJobs;

  return data.map((row) => {
    const recruiters = row.recruiters as { company_name?: string } | null;
    return {
      id: row.id,
      recruiter_id: row.recruiter_id,
      title: row.title,
      description: row.description,
      location: row.location,
      employment_type: row.employment_type,
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      company_name: recruiters?.company_name,
    };
  });
}

export async function getJobById(id: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((job) => job.id === id) ?? null;
}
