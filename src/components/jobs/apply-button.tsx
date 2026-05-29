"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type ApplyButtonProps = {
  jobId: string;
};

export function ApplyButton({ jobId }: ApplyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo: application recorded locally.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sign in to apply for jobs.");
        router.push("/login");
        return;
      }

      const { data: seeker } = await supabase
        .from("job_seekers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!seeker) {
        toast.error("Only job seeker accounts can apply.");
        return;
      }

      const { error } = await supabase.from("applications").insert({
        job_id: jobId,
        job_seeker_id: seeker.id,
        status: "pending",
      });

      if (error) throw error;
      toast.success("Application submitted successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not apply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleApply} disabled={loading}>
      {loading ? "Submitting..." : "Apply now"}
    </Button>
  );
}
