import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { getJobs } from "@/lib/jobs";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["admin"]);
  }

  const jobs = await getJobs();

  return (
    <DashboardShell
      title="Admin dashboard"
      description="Platform health, moderation, and hiring operations overview."
      links={[
        { href: "/jobs", label: "Jobs" },
        { href: "/dashboard/recruiter", label: "Recruiter view" },
        { href: "/dashboard/student", label: "Student view" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total jobs" value={String(jobs.length)} detail="All listings" />
        <StatCard label="Users" value="—" detail="Registered accounts" />
        <StatCard label="Applications" value="—" detail="Platform-wide" />
        <StatCard label="Notifications" value="—" detail="Unread alerts" />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Moderation queue</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Admin tools for recruiter verification and fake job moderation can be extended here.
          Database tables and RLS policies are already prepared in <code>supabase/schema.sql</code>.
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
