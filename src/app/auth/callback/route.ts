import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDashboardPath } from "@/lib/auth";
import {
  formatAuthError,
  getRequestOrigin,
  requireSupabaseConfig,
} from "@/lib/supabase/config";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import type { UserRole } from "@/types/database";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = getRequestOrigin(request);
  const { searchParams } = requestUrl;

  const cookieStore = await cookies();

  // Collect cookies written during the auth exchange so we can attach them
  // to the final redirect response — built only once at the end.
  const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> =
    [];

  try {
    const { url, anonKey } = requireSupabaseConfig();

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Write to the cookie store so subsequent getAll() calls see them,
          // and buffer them for the final response.
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            pendingCookies.push({ name, value, options: options ?? {} });
          });
        },
      },
    });

    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return redirectWithError(origin, error.message);
      }
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (error) {
        return redirectWithError(origin, error.message);
      }
    } else {
      const errorDescription = searchParams.get("error_description");
      if (errorDescription) {
        return redirectWithError(origin, errorDescription);
      }
      return NextResponse.redirect(`${origin}/login`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    await ensureUserProfile(supabase, user);

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as UserRole | undefined) ?? "job_seeker";
    const destination = `${origin}${getDashboardPath(role)}`;

    // Build the final redirect response once, then attach all session cookies.
    const response = NextResponse.redirect(destination);
    for (const { name, value, options } of pendingCookies) {
      response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication callback failed.";
    return redirectWithError(origin, message);
  }
}

function redirectWithError(origin: string, message: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", formatAuthError(message));
  return NextResponse.redirect(url.toString());
}
