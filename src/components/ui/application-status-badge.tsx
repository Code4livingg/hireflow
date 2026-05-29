import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  interview: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  offered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  withdrawn: "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  reviewing: "Reviewing",
  interview: "Interview",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
