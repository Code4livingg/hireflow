import { redirect } from "next/navigation";
import { demoApplications } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Application, User, UserRole } from "@/types/database";

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  return profile as User | null;
}

export async function requireUser(redirectTo = "/login") {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireRole(roles: UserRole[], redirectTo = "/login") {
  const user = await requireUser(redirectTo);
  if (!roles.includes(user.role)) {
    redirect("/");
  }
  return user;
}

export function getDashboardPath(role: UserRole) {
  switch (role) {
    case "recruiter":
      return "/dashboard/recruiter";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/dashboard/student";
  }
}

export async function getStudentApplications() {
  if (!isSupabaseConfigured()) return demoApplications;

  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data: seeker } = await supabase
    .from("job_seekers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seeker) return [];

  const { data } = await supabase
    .from("applications")
    .select("*, jobs(title)")
    .eq("job_seeker_id", seeker.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const record = row as Application & { jobs?: { title?: string } };
    return {
      id: record.id,
      job_id: record.job_id,
      job_seeker_id: record.job_seeker_id,
      status: record.status,
      cover_letter: record.cover_letter,
      created_at: record.created_at,
      updated_at: record.updated_at,
      job_title: record.jobs?.title,
    };
  });
}
