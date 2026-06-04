import Link from "next/link";
import { Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ApplicationsTimeline } from "@/components/dashboard/applications-timeline";
import { StatCard } from "@/components/dashboard/stat-card";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getStudentApplications, requireRole } from "@/lib/auth";
import { demoJobs } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function StudentDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["job_seeker", "admin"]);
  }

  const applications = await getStudentApplications();

  const timelineItems = applications.map((app) => ({
    id: app.id,
    candidate: "You",
    job: app.job_title ?? "Job application",
    status: app.status,
    date: new Date(app.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <DashboardLayout
      role="student"
      title="Student dashboard"
      description="Track applications, saved jobs, and interview progress."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Applications"
          value={String(applications.length)}
          detail="Submitted roles"
          highlight
          tooltip="Total applications you've submitted"
        />
        <StatCard label="Saved jobs" value="3" detail="Bookmarked for later" />
        <StatCard label="Interviews" value="1" detail="Scheduled interviews" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Browse open roles and apply to start tracking your pipeline."
                actionLabel="Find jobs"
                actionHref="/jobs"
              />
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium">{app.job_title ?? "Job application"}</span>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <ApplicationsTimeline items={timelineItems.length > 0 ? timelineItems : undefined} />
      </div>

      <Card className="interactive-card mt-6">
        <CardHeader>
          <CardTitle>Recommended jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {demoJobs.slice(0, 3).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted hover:underline"
            >
              {job.title} — {job.company_name}
            </Link>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
