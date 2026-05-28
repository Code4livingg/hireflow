import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyButton } from "@/components/jobs/apply-button";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById } from "@/lib/jobs";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) notFound();

  return (
    <Container className="py-10">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link href="/jobs">← Back to jobs</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <p className="text-muted-foreground">{job.company_name ?? "HireFlow Partner"}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <p>Location: {job.location ?? "Remote"}</p>
            <p>Type: {job.employment_type ?? "full-time"}</p>
            <p>
              Salary:{" "}
              {job.salary_min && job.salary_max
                ? `₹${job.salary_min} – ₹${job.salary_max}`
                : "Not disclosed"}
            </p>
          </div>
          <p className="leading-7 text-foreground">{job.description}</p>
          <div className="flex flex-wrap gap-4">
            <ApplyButton jobId={job.id} />
            <SaveJobButton jobId={job.id} />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
