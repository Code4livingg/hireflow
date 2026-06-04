import Link from "next/link";
import { Building2, CalendarClock, IndianRupee, MapPin, Radar } from "lucide-react";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { MatchScore } from "@/components/match/match-score";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { formatSalaryRange, getJobSkills, getPostedTime, isRemoteJob } from "@/lib/job-discovery";
import { calculateResumeMatch } from "@/lib/resume-match";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/database";

type JobCardProps = {
  job: Job;
  featured?: boolean;
  userSkills?: string[];
};

export function JobCard({ job, featured, userSkills }: JobCardProps) {
  const skills = getJobSkills(job);
  const match = calculateResumeMatch(job, userSkills);
  const remote = isRemoteJob(job);

  return (
    <Card className={cn("job-card-hover flex h-full flex-col", featured && "card-glow")}>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/jobs/${job.id}`} className="flex min-w-0 gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <CardTitle className="line-clamp-2 text-base">{job.title}</CardTitle>
              <CardDescription className="mt-1 truncate">{job.company_name ?? "HireFlow Partner"}</CardDescription>
            </span>
          </Link>
          <SaveJobButton jobId={job.id} compact />
        </div>

        <div className="flex flex-wrap gap-2">
          <MatchScore score={match.score} variant="badge" />
          {remote ? (
            <Badge variant="muted" className="px-2.5 py-0.5 text-xs">
              <Radar className="size-3" aria-hidden="true" />
              Remote
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-muted-foreground">
        <div className="space-y-3">
          <p className="line-clamp-3 leading-6">{job.description}</p>

          <div className="grid gap-2">
            <p className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {job.location ?? "Remote"}
            </p>
            <Tooltip content="Estimated annual compensation">
              <p className="inline-flex cursor-default items-center gap-1.5">
                <IndianRupee className="size-4 shrink-0" aria-hidden="true" />
                {formatSalaryRange(job.salary_min, job.salary_max)}
              </p>
            </Tooltip>
            <p className="flex items-center gap-1.5">
              <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
              {getPostedTime(job.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="muted" className="px-2.5 py-0.5 text-xs capitalize">
            {job.employment_type ?? "full-time"}
          </Badge>
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="muted" className="px-2.5 py-0.5 text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
          View details
        </Link>
      </CardContent>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-11 rounded-lg skeleton-shimmer" />
          <div className="min-w-0 flex-1">
            <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />
            <div className="mt-2 h-4 w-1/2 rounded-md skeleton-shimmer" />
          </div>
          <div className="size-8 rounded-lg skeleton-shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full skeleton-shimmer" />
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-full rounded-md skeleton-shimmer" />
        <div className="mt-2 h-4 w-5/6 rounded-md skeleton-shimmer" />
        <div className="mt-6 h-4 w-2/3 rounded-md skeleton-shimmer" />
        <div className="mt-3 h-4 w-1/2 rounded-md skeleton-shimmer" />
      </CardContent>
    </Card>
  );
}
