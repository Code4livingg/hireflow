import { NextResponse } from "next/server";
import { getDashboardPath } from "@/lib/auth";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${siteUrl}/login?error=supabase_not_configured`);
  }

  if (!code) {
    const errorDescription = searchParams.get("error_description");
    if (errorDescription) {
      return NextResponse.redirect(
        `${siteUrl}/login?error=${encodeURIComponent(errorDescription)}`,
      );
    }
    return NextResponse.redirect(`${siteUrl}/login`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${siteUrl}/login?error=supabase_client_failed`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as UserRole | undefined) ?? "job_seeker";
    return NextResponse.redirect(`${siteUrl}${getDashboardPath(role)}`);
  }

  return NextResponse.redirect(`${siteUrl}${next}`);
}
