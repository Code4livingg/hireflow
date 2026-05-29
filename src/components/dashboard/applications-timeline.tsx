import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { mockApplicationsTimeline } from "@/lib/dashboard-mock-data";
import type { ApplicationStatus } from "@/types/database";
import { ClipboardList } from "lucide-react";

type TimelineItem = {
  id: string;
  candidate: string;
  job: string;
  status: ApplicationStatus;
  date: string;
};

type ApplicationsTimelineProps = {
  items?: TimelineItem[];
};

export function ApplicationsTimeline({ items = [...mockApplicationsTimeline] }: ApplicationsTimelineProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No applications yet"
        description="Applications will appear here as candidates apply to your roles."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <Card className="interactive-card">
      <CardHeader>
        <CardTitle>Recent applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-0 border-l border-border pl-6">
          {items.map((item, index) => (
            <li key={item.id} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[1.6rem] top-1 flex size-3 rounded-full border-2 border-background bg-primary" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{item.candidate}</p>
                  <p className="text-sm text-muted-foreground">{item.job}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ApplicationStatusBadge status={item.status} />
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              </div>
              {index < items.length - 1 ? null : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
