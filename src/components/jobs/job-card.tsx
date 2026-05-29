import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import type { Job } from "@/types/database";
import { cn } from "@/lib/utils";

type JobCardProps = {
  job: Job;
  featured?: boolean;
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`;
  if (min) return `From ₹${(min / 100000).toFixed(1)}L`;
  return `Up to ₹${(max! / 100000).toFixed(1)}L`;
}

export function JobCard({ job, featured }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <Card
        className={cn(
          "job-card-hover h-full",
          featured && "card-glow",
        )}
      >
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.company_name ?? "HireFlow Partner"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {job.location ?? "Remote"}
          </p>
          <p>{job.employment_type ?? "full-time"}</p>
          <Tooltip content="Estimated annual compensation">
            <p className="inline-block cursor-default">{formatSalary(job.salary_min, job.salary_max)}</p>
          </Tooltip>
        </CardContent>
      </Card>
    </Link>
  );
}
