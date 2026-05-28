"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type ApplyButtonProps = {
  jobId: string;
};

export function ApplyButton({ jobId }: ApplyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleApply() {
    setLoading(true);
    setMessage(null);

    try {
      if (!isSupabaseConfigured()) {
        setMessage("Demo mode: connect Supabase to submit real applications.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: seeker } = await supabase
        .from("job_seekers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!seeker) {
        setMessage("Only job seeker accounts can apply.");
        return;
      }

      const { error } = await supabase.from("applications").insert({
        job_id: jobId,
        job_seeker_id: seeker.id,
        status: "pending",
      });

      if (error) throw error;
      setMessage("Application submitted successfully.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not apply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleApply} disabled={loading}>
        {loading ? "Submitting..." : "Apply now"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
