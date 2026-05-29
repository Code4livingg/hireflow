import type { SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

/** Create public.users (+ role table) if the DB trigger did not run. */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  authUser: AuthUser,
): Promise<void> {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUser.id)
    .maybeSingle();

  if (existing) return;

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

  if (userError && !userError.message.includes("duplicate")) {
    console.error("[ensureUserProfile] users insert:", userError.message);
    return;
  }

  if (role === "recruiter") {
    await supabase.from("recruiters").insert({
      user_id: authUser.id,
      company_name: (meta.company_name as string | undefined) ?? "My Company",
    });
  } else if (role === "job_seeker") {
    await supabase.from("job_seekers").insert({
      user_id: authUser.id,
      headline: (meta.headline as string | undefined) ?? "Open to opportunities",
    });
  }
}
