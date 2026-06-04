"use client";

import { useMemo, useState } from "react";
import { Briefcase, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  experienceLabels,
  getExperienceLevel,
  getJobSkills,
  skillOptions,
  type ExperienceLevel,
} from "@/lib/job-discovery";
import { calculateResumeMatch } from "@/lib/resume-match";
import type { Job } from "@/types/database";

type SortOption = "relevance" | "newest" | "salary-high" | "salary-low";

type JobsDiscoveryProps = {
  jobs: Job[];
  userSkills?: string[];
};

function getEmploymentTypes(jobs: Job[]) {
  return Array.from(new Set(jobs.map((job) => job.employment_type ?? "full-time"))).sort();
}

function getLocations(jobs: Job[]) {
  return Array.from(new Set(jobs.map((job) => job.location ?? "Remote"))).sort();
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatEmploymentType(type: string) {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function JobsDiscovery({ jobs, userSkills }: JobsDiscoveryProps) {
  const [query, setQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState<ExperienceLevel | "all">("all");
  const [location, setLocation] = useState("all");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("relevance");

  const employmentTypes = useMemo(() => getEmploymentTypes(jobs), [jobs]);
  const locations = useMemo(() => getLocations(jobs), [jobs]);

  const filteredJobs = useMemo(() => {
    const search = normalize(query);
    const minimumSalary = Number(minSalary) || 0;
    const maximumSalary = Number(maxSalary) || Number.POSITIVE_INFINITY;

    return jobs
      .filter((job) => {
        const jobText = normalize(
          `${job.title} ${job.company_name ?? ""} ${job.description} ${job.location ?? ""} ${
            job.employment_type ?? ""
          } ${getJobSkills(job).join(" ")}`
        );
        const salaryFloor = job.salary_min ?? job.salary_max ?? 0;
        const salaryCeiling = job.salary_max ?? job.salary_min ?? Number.POSITIVE_INFINITY;
        const selectedSkills = skills.every((skill) => getJobSkills(job).includes(skill));

        return (
          (!search || jobText.includes(search)) &&
          (jobType === "all" || (job.employment_type ?? "full-time") === jobType) &&
          (experience === "all" || getExperienceLevel(job) === experience) &&
          (location === "all" || (job.location ?? "Remote") === location) &&
          salaryCeiling >= minimumSalary &&
          salaryFloor <= maximumSalary &&
          selectedSkills
        );
      })
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sort === "salary-high") return (b.salary_max ?? b.salary_min ?? 0) - (a.salary_max ?? a.salary_min ?? 0);
        if (sort === "salary-low") return (a.salary_min ?? a.salary_max ?? 0) - (b.salary_min ?? b.salary_max ?? 0);
        return calculateResumeMatch(b, userSkills).score - calculateResumeMatch(a, userSkills).score;
      });
  }, [experience, jobType, jobs, location, maxSalary, minSalary, query, skills, sort, userSkills]);

  const hasFilters =
    query ||
    jobType !== "all" ||
    experience !== "all" ||
    location !== "all" ||
    minSalary ||
    maxSalary ||
    skills.length > 0 ||
    sort !== "relevance";

  function resetFilters() {
    setQuery("");
    setJobType("all");
    setExperience("all");
    setLocation("all");
    setMinSalary("");
    setMaxSalary("");
    setSkills([]);
    setSort("relevance");
  }

  function toggleSkill(skill: string) {
    setSkills((current) =>
      current.includes(skill) ? current.filter((selected) => selected !== skill) : [...current, skill]
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No open jobs"
        description="Check back soon - recruiters are posting new roles."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="h-fit rounded-lg border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>
          {hasFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
              <X className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          ) : null}
        </div>

        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Role, company, skill"
                className="pl-9"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Job type</span>
            <select
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="all">All types</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {formatEmploymentType(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Experience level</span>
            <select
              value={experience}
              onChange={(event) => setExperience(event.target.value as ExperienceLevel | "all")}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="all">All levels</option>
              {Object.entries(experienceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Location</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="all">All locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Salary range</span>
            <div className="grid grid-cols-2 gap-2">
              <Input
                inputMode="numeric"
                min={0}
                type="number"
                value={minSalary}
                onChange={(event) => setMinSalary(event.target.value)}
                placeholder="Min"
              />
              <Input
                inputMode="numeric"
                min={0}
                type="number"
                value={maxSalary}
                onChange={(event) => setMaxSalary(event.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Skills</span>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => {
                const active = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              {filteredJobs.length} {filteredJobs.length === 1 ? "role" : "roles"} found
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Sorted by {sort.replace("-", " ")}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="relevance">Best match</option>
              <option value="newest">Newest</option>
              <option value="salary-high">Salary high to low</option>
              <option value="salary-low">Salary low to high</option>
            </select>
          </label>
        </div>

        {skills.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="muted">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}

        {filteredJobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching jobs"
            description="Adjust your filters or search terms to discover more roles."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} featured={index === 0 && sort === "relevance"} userSkills={userSkills} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
