"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDashboardPath } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import {
  formatAuthError,
  getSiteUrl,
  isSupabaseConfigured,
  requireSupabaseConfig,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function configErrorMessage(err: unknown): string {
  if (err instanceof SupabaseConfigError) return err.message;
  return "Supabase is not configured correctly.";
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL (root only, no /rest/v1) and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    requireSupabaseConfig();
  } catch (err) {
    return { error: configErrorMessage(err) };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Could not connect to Supabase." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: formatAuthError(error.message) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign-in succeeded but no session was created. Try again." };
  }

  await ensureUserProfile(supabase, user);

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
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL (root only, no /rest/v1) and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
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

  try {
    requireSupabaseConfig();
  } catch (err) {
    return { error: configErrorMessage(err) };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Could not connect to Supabase." };

  const siteUrl = getSiteUrl();
  const redirectTo = `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: fullName,
        role,
        company_name: role === "recruiter" ? companyName : undefined,
      },
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(getDashboardPath(role));
  }

  return {
    success:
      "Account created. Check your email to confirm, or sign in if email confirmation is disabled in Supabase.",
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
