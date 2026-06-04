import { demoJobs } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import {
  calculateResumeMatch,
  demoUserSkills,
  inferExperienceLevel,
  type RankedCandidate,
} from "@/lib/resume-match";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, Job } from "@/types/database";

export async function getCurrentProfileSkills() {
  if (!isSupabaseConfigured()) return demoUserSkills;

  const supabase = await createClient();
  if (!supabase) return demoUserSkills;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return demoUserSkills;

  const { data, error } = await supabase
    .from("job_seekers")
    .select("skills")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return demoUserSkills;
  const profile = data as { skills?: string[] | null };
  return profile.skills && profile.skills.length > 0 ? profile.skills : demoUserSkills;
}

function demoCandidateRows(): RankedCandidate[] {
  const candidates = [
    {
      id: "candidate-1",
      name: "Priya Sharma",
      email: "priya@example.com",
      skills: ["React", "Next.js", "TypeScript", "PostgreSQL", "Supabase"],
      job: demoJobs[0],
      resumeCompleteness: 0.96,
      educationMatch: 0.88,
    },
    {
      id: "candidate-2",
      name: "Noah Chen",
      email: "noah@example.com",
      skills: ["Design", "Product", "Accessibility", "React"],
      job: demoJobs[1],
      resumeCompleteness: 0.9,
      educationMatch: 0.84,
    },
    {
      id: "candidate-3",
      name: "Leah Martin",
      email: "leah@example.com",
      skills: ["SQL", "Analytics", "PostgreSQL"],
      job: demoJobs[2],
      resumeCompleteness: 0.74,
      educationMatch: 0.78,
    },
  ];

  return candidates
    .map((candidate) => {
      const match = calculateResumeMatch(candidate.job, candidate.skills, {
        educationMatch: candidate.educationMatch,
        resumeCompleteness: candidate.resumeCompleteness,
      });

      return {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        jobTitle: candidate.job.title,
        status: "reviewing" as ApplicationStatus,
        score: match.score,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
        experienceLevel: inferExperienceLevel(candidate.job.title),
        educationMatch: match.strengths.find((strength) => strength.label === "Education match")?.value ?? 0,
        resumeCompleteness:
          match.strengths.find((strength) => strength.label === "Resume completeness")?.value ?? 0,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getRankedCandidates(): Promise<RankedCandidate[]> {
  if (!isSupabaseConfigured()) return demoCandidateRows();

  const supabase = await createClient();
  if (!supabase) return demoCandidateRows();

  const { data, error } = await supabase
    .from("applications")
    .select(
      "id,status,created_at,jobs(id,title,description,location,employment_type,salary_min,salary_max,status,created_at,updated_at,recruiters(company_name)),job_seekers(id,headline,resume_url,skills,users(full_name,email))"
    )
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data) return demoCandidateRows();

  return data
    .map((row) => {
      const record = row as unknown as {
        id: string;
        status: ApplicationStatus;
        jobs?:
          | (Omit<Job, "recruiter_id" | "company_name"> & {
              recruiters?: { company_name?: string } | { company_name?: string }[] | null;
            })
          | (Omit<Job, "recruiter_id" | "company_name"> & {
              recruiters?: { company_name?: string } | { company_name?: string }[] | null;
            })[]
          | null;
        job_seekers?:
          | {
              headline?: string | null;
              resume_url?: string | null;
              skills?: string[] | null;
              users?:
                | { full_name?: string | null; email?: string | null }
                | { full_name?: string | null; email?: string | null }[]
                | null;
            }
          | {
              headline?: string | null;
              resume_url?: string | null;
              skills?: string[] | null;
              users?:
                | { full_name?: string | null; email?: string | null }
                | { full_name?: string | null; email?: string | null }[]
                | null;
            }[]
          | null;
      };
      const job = firstRelation(record.jobs);
      const seeker = firstRelation(record.job_seekers);
      const profileUser = firstRelation(seeker?.users);
      if (!job) return null;

      const skills = seeker?.skills && seeker.skills.length > 0 ? seeker.skills : demoUserSkills;
      const resumeCompleteness =
        (skills.length > 0 ? 0.45 : 0) + (seeker?.headline ? 0.25 : 0) + (seeker?.resume_url ? 0.3 : 0);
      const match = calculateResumeMatch(
        {
          ...job,
          recruiter_id: "recruiter",
          company_name: firstRelation(job.recruiters)?.company_name,
        },
        skills,
        {
          educationMatch: 0.8,
          resumeCompleteness: Math.max(0.55, resumeCompleteness),
        }
      );

      return {
        id: record.id,
        name: profileUser?.full_name || "Candidate",
        email: profileUser?.email || "No email",
        jobTitle: job.title,
        status: record.status,
        score: match.score,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
        experienceLevel: inferExperienceLevel(job.title),
        educationMatch: match.strengths.find((strength) => strength.label === "Education match")?.value ?? 0,
        resumeCompleteness:
          match.strengths.find((strength) => strength.label === "Resume completeness")?.value ?? 0,
      };
    })
    .filter((candidate): candidate is RankedCandidate => Boolean(candidate))
    .sort((a, b) => b.score - a.score);
}
