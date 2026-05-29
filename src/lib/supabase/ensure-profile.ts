import type { SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

/** Create public.users (+ role table) if the DB trigger did not run. */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  authUser: AuthUser,
): Promise<{ ok: boolean; error?: string }> {
  const { data: existing, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUser.id)
    .maybeSingle();

  if (selectError) {
    // Table doesn't exist or RLS is blocking — surface clearly instead of silently failing.
    console.error("[ensureUserProfile] users select:", selectError.message);
    return { ok: false, error: selectError.message };
  }

  if (existing) return { ok: true };

  const meta = authUser.user_metadata ?? {};
  const role = (meta.role as UserRole | undefined) ?? "job_seeker";
  const fullName =
    (meta.full_name as string | undefined) ??
    authUser.email?.split("@")[0] ??
    "User";

  const { error: userError } = await supabase.from("users").insert({
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: fullName,
    role,
  });

  if (userError) {
    if (!userError.message.includes("duplicate")) {
      console.error("[ensureUserProfile] users insert:", userError.message);
      return { ok: false, error: userError.message };
    }
    // Duplicate = another request already created it — that's fine.
  }

  if (role === "recruiter") {
    const { error: rErr } = await supabase.from("recruiters").insert({
      user_id: authUser.id,
      company_name: (meta.company_name as string | undefined) ?? "My Company",
    });
    if (rErr && !rErr.message.includes("duplicate")) {
      console.error("[ensureUserProfile] recruiters insert:", rErr.message);
    }
  } else if (role === "job_seeker") {
    const { error: sErr } = await supabase.from("job_seekers").insert({
      user_id: authUser.id,
      headline: (meta.headline as string | undefined) ?? "Open to opportunities",
    });
    if (sErr && !sErr.message.includes("duplicate")) {
      console.error("[ensureUserProfile] job_seekers insert:", sErr.message);
    }
  }

  return { ok: true };
}
