/**
 * Supabase base URL must be the project root only, e.g.
 * https://YOUR_PROJECT_REF.supabase.co
 *
 * Do NOT include /rest/v1 — that causes auth requests to hit PostgREST
 * and return: "Invalid path specified in request URL" (PGRST125).
 */
export function getSupabaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    // Remove accidental API subpaths copied from the dashboard.
    if (url.pathname && url.pathname !== "/") {
      url.pathname = "/";
    }
    return url.origin;
  } catch {
    return raw
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/auth\/v1\/?$/i, "")
      .replace(/\/+$/, "");
  }
}

export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://127.0.0.1:3000";
}
