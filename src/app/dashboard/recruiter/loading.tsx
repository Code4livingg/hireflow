import { Container } from "@/components/layout/container";
import { SkeletonStat } from "@/components/ui/skeleton";

export default function RecruiterDashboardLoading() {
  return (
    <Container className="py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-64 rounded-md skeleton-shimmer" />
        <div className="h-4 w-96 rounded-md skeleton-shimmer" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-xl border border-border skeleton-shimmer" />
        <div className="h-72 rounded-xl border border-border skeleton-shimmer" />
      </div>
    </Container>
  );
}
