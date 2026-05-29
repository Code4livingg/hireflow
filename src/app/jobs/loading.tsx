import { Container } from "@/components/layout/container";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function JobsLoading() {
  return (
    <Container className="py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded-md skeleton-shimmer" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </Container>
  );
}
