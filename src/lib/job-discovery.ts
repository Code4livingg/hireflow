import type { Job } from "@/types/database";

export const skillOptions = [
  "Next.js",
  "React",
  "PostgreSQL",
  "Supabase",
  "TypeScript",
  "Analytics",
  "Design",
  "Accessibility",
  "SQL",
  "Product",
];

export type ExperienceLevel = "internship" | "entry" | "mid" | "senior";

export const experienceLabels: Record<ExperienceLevel, string> = {
  internship: "Internship",
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior",
};

export function formatSalaryRange(min: number | null, max: number | null) {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
  if (min) return `From ₹${(min / 100000).toFixed(1)}L`;
  return `Up to ₹${(max! / 100000).toFixed(1)}L`;
}

export function getJobSkills(job: Job) {
  const haystack = `${job.title} ${job.description}`.toLowerCase();

  return skillOptions.filter((skill) => {
    const normalizedSkill = skill.toLowerCase();
    return haystack.includes(normalizedSkill) || haystack.includes(normalizedSkill.replace(".", ""));
  });
}

export function getExperienceLevel(job: Job): ExperienceLevel {
  const text = `${job.title} ${job.description} ${job.employment_type ?? ""}`.toLowerCase();

  if (text.includes("intern")) return "internship";
  if (text.includes("senior") || text.includes("lead") || text.includes("principal")) return "senior";
  if (text.includes("junior") || text.includes("entry") || text.includes("graduate")) return "entry";
  return "mid";
}

export function isRemoteJob(job: Job) {
  return (job.location ?? "").toLowerCase().includes("remote");
}

export function getPostedTime(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const diffMs = Date.now() - created;

  if (!Number.isFinite(created) || diffMs < 0) return "Recently posted";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return minutes <= 1 ? "Just now" : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function getMatchScore(job: Job) {
  const scoreSeed = `${job.id}${job.title}${job.company_name ?? ""}`.split("").reduce((sum, char) => {
    return sum + char.charCodeAt(0);
  }, 0);

  return 72 + (scoreSeed % 24);
}
