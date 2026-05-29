"use server";

import { redirect } from "next/navigation";
import { getDashboardPath } from "@/lib/auth";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL in .env.local." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Could not connect to Supabase." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Please confirm your email first. Check your inbox, or disable email confirmation in Supabase for local testing.",
      };
    }
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/profile");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as UserRole | undefined) ?? "job_seeker";
  redirect(getDashboardPath(role));
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL in .env.local." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = (String(formData.get("role") ?? "job_seeker") as UserRole) || "job_seeker";
  const companyName = String(formData.get("companyName") ?? "").trim();

  if (!email || !password || !fullName) {
    return { error: "Name, email, and password are required." };
  }

  if (role === "recruiter" && !companyName) {
    return { error: "Company name is required for recruiter accounts." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Could not connect to Supabase." };

  const siteUrl = getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: fullName,
        role,
        company_name: role === "recruiter" ? companyName : undefined,
      },
    },
  });

  if (error) return { error: error.message };

  if (data.session) {
    redirect(getDashboardPath(role));
  }

  return {
    success:
      "Account created. Check your email to confirm, or sign in if confirmation is disabled in Supabase.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
