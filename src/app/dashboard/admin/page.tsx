import { AdminAnalytics } from "@/components/dashboard/admin-analytics";
import { AdminTables } from "@/components/dashboard/admin-tables";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAdminDashboardData } from "@/lib/admin-dashboard";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminDashboardPage() {
  if (isSupabaseConfigured()) {
    await requireRole(["admin"]);
  }

  const data = await getAdminDashboardData();

  return (
    <DashboardLayout
      role="admin"
      title="Admin dashboard"
      description="Platform health, moderation, and hiring operations overview."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total users"
          value={String(data.stats.totalUsers)}
          detail="Registered accounts"
          highlight
          tooltip="All platform users with profiles"
        />
        <StatCard label="Total jobs" value={String(data.stats.totalJobs)} detail="All listings" />
        <StatCard
          label="Applications"
          value={String(data.stats.totalApplications)}
          detail="Submitted applications"
        />
        <StatCard label="Recruiters" value={String(data.stats.recruiters)} detail="Hiring teams" />
        <StatCard label="Active jobs" value={String(data.stats.activeJobs)} detail="Open listings" />
      </div>

      <div className="mt-8">
        <AdminAnalytics charts={data.charts} />
      </div>

      <div className="mt-8">
        <AdminTables tables={data.tables} />
      </div>
    </DashboardLayout>
  );
}
