"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function PostJobForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo: job posting simulated.");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in as a recruiter to post jobs.");

      const { data: recruiter } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!recruiter) throw new Error("Recruiter profile not found.");

      const { error } = await supabase.from("jobs").insert({
        recruiter_id: recruiter.id,
        title,
        description,
        location,
        status: "open",
      });

      if (error) throw error;
      setTitle("");
      setDescription("");
      setLocation("");
      toast.success("Job posted successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="interactive-card card-glow">
      <CardHeader>
        <CardTitle>Post a job</CardTitle>
        <CardDescription>Create a new open role on the marketplace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Publish job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
