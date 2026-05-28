import { JobCard } from "@/components/jobs/job-card";
import { Container } from "@/components/layout/container";
import { getJobs } from "@/lib/jobs";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Jobs",
};

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Open positions</h1>
        <p className="mt-2 text-muted-foreground">
          Browse roles from verified recruiters.{" "}
          {!isSupabaseConfigured() ? "Showing demo data until Supabase is connected." : ""}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </Container>
  );
}
