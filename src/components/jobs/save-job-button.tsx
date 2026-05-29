"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type SaveJobButtonProps = {
  jobId: string;
};

export function SaveJobButton({ jobId }: SaveJobButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo: job saved locally.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Sign in to save jobs.");
        return;
      }

      const { data: seeker } = await supabase
        .from("job_seekers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!seeker) {
        toast.error("Only job seeker accounts can save jobs.");
        return;
      }

      const { error } = await supabase.from("saved_jobs").insert({
        job_id: jobId,
        job_seeker_id: seeker.id,
      });

      if (error) throw error;
      toast.success("Job saved to your list.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleSave} disabled={loading}>
      {loading ? "Saving..." : "Save job"}
    </Button>
  );
}
