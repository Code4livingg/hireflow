"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDashboardPath } from "@/lib/auth";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/supabase/config";
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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!isSupabaseConfigured()) {
    const demoAccounts: Record<string, { role: string; path: string }> = {
      "seeker@demo.com": { role: "job_seeker", path: "/dashboard/student" },
      "student@demo.com": { role: "job_seeker", path: "/dashboard/student" },
      "recruiter@demo.com": { role: "recruiter", path: "/dashboard/recruiter" },
      "admin@demo.com": { role: "admin", path: "/dashboard/admin" },
    };

    const demo = demoAccounts[email.toLowerCase()];
    if (demo && password.length >= 6) {
      redirect(demo.path);
    }

    if (email.includes("@") && password.length >= 6) {
      redirect("/dashboard/student");
    }

    return { error: "Enter any valid email and a password (6+ chars) to explore the demo." };
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

  revalidatePath("/", "layout");
  redirect(getDashboardPath(role));
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = (String(formData.get("role") ?? "job_seeker") as UserRole) || "job_seeker";
  const companyName = String(formData.get("companyName") ?? "").trim();

  if (!email || !password || !fullName) {
    return { error: "Name, email, and password are required." };
  }

  if (!isSupabaseConfigured()) {
    const path =
      role === "recruiter"
        ? "/dashboard/recruiter"
        : role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/student";
    redirect(path);
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
    revalidatePath("/", "layout");
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
  revalidatePath("/", "layout");
  redirect("/login");
}
