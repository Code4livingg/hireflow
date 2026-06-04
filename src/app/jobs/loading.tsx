import { Container } from "@/components/layout/container";
import { JobCardSkeleton } from "@/components/jobs/job-card";

export default function JobsLoading() {
  return (
    <Container className="py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded-md skeleton-shimmer" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="h-5 w-24 rounded-md skeleton-shimmer" />
          <div className="mt-5 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 h-20 rounded-lg border border-border bg-card skeleton-shimmer" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
