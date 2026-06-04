"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SaveJobButtonProps = {
  compact?: boolean;
  className?: string;
  jobId: string;
};

export function SaveJobButton({ compact = false, className, jobId }: SaveJobButtonProps) {
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
    <Button
      type="button"
      variant="outline"
      size={compact ? "icon" : "default"}
      aria-label={compact ? "Save job" : undefined}
      title={compact ? "Save job" : undefined}
      onClick={handleSave}
      disabled={loading}
      className={cn(compact && "shrink-0", className)}
    >
      <Bookmark className="size-4" aria-hidden="true" />
      {compact ? <span className="sr-only">Save job</span> : loading ? "Saving..." : "Save job"}
    </Button>
  );
}
