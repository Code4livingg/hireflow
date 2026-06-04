import { CheckCircle2, Clock, ShieldAlert, UsersRound } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardData } from "@/lib/admin-dashboard";
import type { ApplicationStatus, JobStatus, UserRole } from "@/types/database";

type AdminTablesProps = {
  tables: AdminDashboardData["tables"];
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  job_seeker: "Student",
  recruiter: "Recruiter",
};

const jobStatusStyles: Record<JobStatus, string> = {
  open: "success",
  closed: "muted",
  draft: "muted",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function moderationStatus(status: JobStatus): ApplicationStatus {
  if (status === "open") return "reviewing";
  if (status === "draft") return "pending";
  return "withdrawn";
}

export function AdminTables({ tables }: AdminTablesProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UsersRound className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle>User management</CardTitle>
          </div>
          <CardDescription>Recent platform accounts</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {tables.users.map((user) => (
                <tr key={user.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="py-3">
                    <Badge variant={user.role === "admin" ? "default" : "muted"}>{roleLabels[user.role]}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">{formatDate(user.joined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle>Recruiter approvals</CardTitle>
          </div>
          <CardDescription>Verification status for hiring teams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tables.recruiters.map((recruiter) => (
            <div
              key={recruiter.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{recruiter.company}</p>
                <p className="truncate text-xs text-muted-foreground">{recruiter.contact}</p>
              </div>
              <Badge variant={recruiter.verified ? "success" : "muted"}>
                {recruiter.verified ? "Verified" : "Pending"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle>Job moderation queue</CardTitle>
          </div>
          <CardDescription>Listings requiring review or status checks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tables.jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
                <Badge variant={jobStatusStyles[job.status] as "success" | "muted"}>{job.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{job.category}</span>
                <span>/</span>
                <span>{job.applications} applications</span>
                <span>/</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" aria-hidden="true" />
                  {job.posted}
                </span>
              </div>
              <div className="mt-3">
                <ApplicationStatusBadge status={moderationStatus(job.status)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
