"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type SaveJobButtonProps = {
  jobId: string;
};

export function SaveJobButton({ jobId }: SaveJobButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setMessage(null);

    try {
      if (!isSupabaseConfigured()) {
        setMessage("Demo mode: saved locally for presentation.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage("Sign in to save jobs.");
        return;
      }

      const { data: seeker } = await supabase
        .from("job_seekers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!seeker) {
        setMessage("Only job seeker accounts can save jobs.");
        return;
      }

      const { error } = await supabase.from("saved_jobs").insert({
        job_id: jobId,
        job_seeker_id: seeker.id,
      });

      if (error) throw error;
      setMessage("Job saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save job"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
