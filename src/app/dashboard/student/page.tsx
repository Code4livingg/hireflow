import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentApplications, requireRole } from "@/lib/auth";
import { demoJobs } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function StudentDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["job_seeker", "admin"]);
  }

  const applications = await getStudentApplications();

  return (
    <DashboardShell
      title="Student dashboard"
      description="Track applications, saved jobs, and interview progress."
      links={[
        { href: "/jobs", label: "Browse jobs" },
        { href: "/profile", label: "Profile" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Applications" value={String(applications.length)} detail="Submitted roles" />
        <StatCard label="Saved jobs" value="—" detail="Use Save on job details" />
        <StatCard label="Interviews" value="0" detail="Scheduled interviews" />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{app.job_title ?? "Job application"}</span>
                <span className="capitalize text-muted-foreground">{app.status}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recommended jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {demoJobs.slice(0, 3).map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block text-sm hover:underline">
              {job.title} — {job.company_name}
            </Link>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
