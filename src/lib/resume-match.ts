import { skillOptions } from "@/lib/job-discovery";
import type { ApplicationStatus, Job } from "@/types/database";

export type MatchStrength = {
  label: string;
  value: number;
  detail: string;
};

export type ResumeMatch = {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  userSkills: string[];
  recommendedSkills: string[];
  strengths: MatchStrength[];
};

export type RankedCandidate = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: ApplicationStatus;
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceLevel: string;
  educationMatch: number;
  resumeCompleteness: number;
};

const demoUserSkills = ["React", "Next.js", "TypeScript", "PostgreSQL", "SQL", "Accessibility"];

export { demoUserSkills };

const recommendedSkillMap: Record<string, string[]> = {
  "Next.js": ["Server Components", "Route Handlers"],
  React: ["State management", "Component testing"],
  PostgreSQL: ["Query optimization", "Indexes"],
  Supabase: ["Row Level Security", "Realtime subscriptions"],
  TypeScript: ["Advanced generics", "Schema validation"],
  Analytics: ["Funnel analysis", "Dashboard design"],
  Design: ["Design systems", "Interaction patterns"],
  Accessibility: ["WCAG audits", "Keyboard testing"],
  SQL: ["Window functions", "Data modeling"],
  Product: ["User research", "Prioritization"],
};

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function uniqueSkills(skills: string[]) {
  const seen = new Set<string>();

  return skills.filter((skill) => {
    const key = normalizeSkill(skill);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getRequiredSkills(job: Job) {
  const haystack = `${job.title} ${job.description}`.toLowerCase();
  const skills = skillOptions.filter((skill) => {
    const normalized = normalizeSkill(skill);
    return haystack.includes(normalized) || haystack.includes(normalized.replace(".", ""));
  });

  if (skills.length > 0) return uniqueSkills(skills);

  const title = job.title.toLowerCase();
  if (title.includes("design")) return ["Design", "Product", "Accessibility"];
  if (title.includes("data") || title.includes("analyst")) return ["SQL", "Analytics", "PostgreSQL"];
  return ["React", "TypeScript", "SQL"];
}

export function inferExperienceLevel(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes("intern")) return "Internship";
  if (normalized.includes("senior") || normalized.includes("lead") || normalized.includes("principal")) return "Senior";
  if (normalized.includes("junior") || normalized.includes("entry") || normalized.includes("graduate")) return "Entry";
  return "Mid";
}

export function calculateResumeMatch(
  job: Job,
  userSkills: string[] = demoUserSkills,
  profile: {
    educationMatch?: number;
    experienceMatch?: number;
    resumeCompleteness?: number;
  } = {}
): ResumeMatch {
  const requiredSkills = getRequiredSkills(job);
  const normalizedUserSkills = uniqueSkills(userSkills);
  const userSkillSet = new Set(normalizedUserSkills.map(normalizeSkill));
  const matchingSkills = requiredSkills.filter((skill) => userSkillSet.has(normalizeSkill(skill)));
  const missingSkills = requiredSkills.filter((skill) => !userSkillSet.has(normalizeSkill(skill)));
  const skillOverlap = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 0;
  const experienceMatch = profile.experienceMatch ?? (inferExperienceLevel(job.title) === "Senior" ? 0.78 : 0.86);
  const educationMatch = profile.educationMatch ?? 0.82;
  const resumeCompleteness = profile.resumeCompleteness ?? Math.min(1, 0.62 + normalizedUserSkills.length * 0.055);
  const score = clampScore(skillOverlap * 45 + experienceMatch * 20 + educationMatch * 15 + resumeCompleteness * 20);
  const recommendedSkills = uniqueSkills(
    missingSkills.flatMap((skill) => recommendedSkillMap[skill] ?? [skill]).slice(0, 5)
  );

  return {
    score,
    matchingSkills,
    missingSkills,
    requiredSkills,
    userSkills: normalizedUserSkills,
    recommendedSkills,
    strengths: [
      {
        label: "Skill overlap",
        value: clampScore(skillOverlap * 100),
        detail: `${matchingSkills.length}/${requiredSkills.length} required skills matched`,
      },
      {
        label: "Experience level",
        value: clampScore(experienceMatch * 100),
        detail: `${inferExperienceLevel(job.title)} role alignment`,
      },
      {
        label: "Education match",
        value: clampScore(educationMatch * 100),
        detail: "Estimated from profile and role requirements",
      },
      {
        label: "Resume completeness",
        value: clampScore(resumeCompleteness * 100),
        detail: "Based on skills, headline, and resume fields",
      },
    ],
  };
}
