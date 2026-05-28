import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { PostJobForm } from "@/components/jobs/post-job-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { getJobs } from "@/lib/jobs";
import { isSupabaseConfigured } from "@/lib/env";

export default async function RecruiterDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["recruiter", "admin"]);
  }

  const jobs = await getJobs();

  return (
    <DashboardShell
      title="Recruiter dashboard"
      description="Post jobs, review applicants, and monitor hiring pipeline."
      links={[
        { href: "/jobs", label: "Public job board" },
        { href: "/profile", label: "Profile" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Open jobs" value={String(jobs.length)} detail="Active listings" />
        <StatCard label="Applicants" value="—" detail="Across all roles" />
        <StatCard label="Interviews" value="0" detail="Scheduled this week" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PostJobForm />
        <Card>
          <CardHeader>
            <CardTitle>Your listings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {jobs.map((job) => (
              <p key={job.id}>
                {job.title} — <span className="text-muted-foreground">{job.status}</span>
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
