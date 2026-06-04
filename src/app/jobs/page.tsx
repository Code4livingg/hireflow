import { JobsDiscovery } from "@/components/jobs/jobs-discovery";
import { Container } from "@/components/layout/container";
import { getJobs } from "@/lib/jobs";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentProfileSkills } from "@/lib/resume-match-server";

export const metadata = {
  title: "Jobs",
};

export default async function JobsPage() {
  const [jobs, userSkills] = await Promise.all([getJobs(), getCurrentProfileSkills()]);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Open positions</h1>
        <p className="mt-2 text-muted-foreground">
          Browse roles from verified recruiters.{" "}
          {!isSupabaseConfigured() ? "Showing demo data until Supabase is connected." : ""}
        </p>
      </div>
      <JobsDiscovery jobs={jobs} userSkills={userSkills} />
    </Container>
  );
}
