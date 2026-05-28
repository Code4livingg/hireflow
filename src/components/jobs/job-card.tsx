import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/types/database";

type JobCardProps = {
  job: Job;
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "Salary not disclosed";
  if (min && max) return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`;
  if (min) return `From ₹${(min / 100000).toFixed(1)}L`;
  return `Up to ₹${(max! / 100000).toFixed(1)}L`;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.company_name ?? "HireFlow Partner"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {job.location ?? "Remote"}
          </p>
          <p>{job.employment_type ?? "full-time"}</p>
          <p>{formatSalary(job.salary_min, job.salary_max)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
