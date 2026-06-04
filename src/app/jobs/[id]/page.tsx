import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyButton } from "@/components/jobs/apply-button";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { Container } from "@/components/layout/container";
import { SkillGapAnalysis } from "@/components/match/skill-gap-analysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById } from "@/lib/jobs";
import { calculateResumeMatch } from "@/lib/resume-match";
import { getCurrentProfileSkills } from "@/lib/resume-match-server";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const [job, userSkills] = await Promise.all([getJobById(id), getCurrentProfileSkills()]);

  if (!job) notFound();
  const match = calculateResumeMatch(job, userSkills);

  return (
    <Container className="py-10">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link href="/jobs">← Back to jobs</Link>
      </Button>
      <Card className="interactive-card">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <p className="mt-1 text-muted-foreground">{job.company_name ?? "HireFlow Partner"}</p>
            </div>
            <Badge variant="success">{match.score}% resume match</Badge>
          </div>
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

      <div className="mt-8">
        <SkillGapAnalysis match={match} />
      </div>
    </Container>
  );
}
