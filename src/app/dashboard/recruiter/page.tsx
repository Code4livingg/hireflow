import Link from "next/link";
import { CandidateRanking } from "@/components/dashboard/candidate-ranking";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ApplicationsTimeline } from "@/components/dashboard/applications-timeline";
import { RecruiterCharts } from "@/components/dashboard/recruiter-charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { PostJobForm } from "@/components/jobs/post-job-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth";
import { getJobs } from "@/lib/jobs";
import { isSupabaseConfigured } from "@/lib/env";
import { getRankedCandidates } from "@/lib/resume-match-server";
import { Briefcase } from "lucide-react";

export default async function RecruiterDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["recruiter", "admin"]);
  }

  const [jobs, rankedCandidates] = await Promise.all([getJobs(), getRankedCandidates()]);

  return (
    <DashboardLayout
      role="recruiter"
      title="Recruiter dashboard"
      description="Post jobs, review applicants, and monitor hiring pipeline."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open jobs"
          value={String(jobs.length)}
          detail="Active listings"
          highlight
          tooltip="Jobs currently visible on the board"
        />
        <StatCard label="Applicants" value="95" detail="Across all roles" />
        <StatCard label="Interviews" value="18" detail="Scheduled this week" />
      </div>

      <div className="mt-8">
        <RecruiterCharts />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <ApplicationsTimeline />
      </div>

      <div className="mt-8">
        <CandidateRanking candidates={rankedCandidates} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PostJobForm />
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle>Your listings</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs posted"
                description="Publish your first role to start receiving applications."
              />
            ) : (
              <ul className="space-y-2 text-sm">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/50"
                  >
                    <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">
                      {job.title}
                    </Link>
                    <span className="capitalize text-muted-foreground">{job.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
