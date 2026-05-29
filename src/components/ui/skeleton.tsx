import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} {...props} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border p-6">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-1/3" />
      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="rounded-xl border border-border p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-16" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonStat };
