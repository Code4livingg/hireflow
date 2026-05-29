/**
 * Single source of truth for Supabase connection settings.
 *
 * NEXT_PUBLIC_SUPABASE_URL must be the project root ONLY:
 *   https://YOUR_REF.supabase.co
 *
 * Common mistake (causes PGRST125 "Invalid path specified in request URL"):
 *   https://YOUR_REF.supabase.co/rest/v1
 */

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

/** Normalize dashboard / copy-paste mistakes into a valid GoTrue + PostgREST base URL. */
export function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return "";

  try {
    let url: URL;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      url = new URL(trimmed);
    } else if (trimmed.includes(".supabase.co")) {
      url = new URL(`https://${trimmed}`);
    } else {
      return trimmed
        .replace(/\/rest\/v1\/?$/i, "")
        .replace(/\/auth\/v1\/?$/i, "")
        .replace(/\/+$/, "");
    }

    // Strip API path segments — auth client appends /auth/v1 itself.
    url.pathname = "/";
    url.search = "";
    url.hash = "";

    return url.origin;
  } catch {
    return trimmed
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/auth\/v1\/?$/i, "")
      .replace(/\/+$/, "");
  }
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim().replace(/^["']|["']$/g, "");

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config) {
    throw new SupabaseConfigError(
      "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL (project root only, no /rest/v1) and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  if (!config.url.includes("supabase.co") && !config.url.includes("localhost")) {
    throw new SupabaseConfigError(
      `Invalid NEXT_PUBLIC_SUPABASE_URL "${config.url}". Use https://YOUR_REF.supabase.co`,
    );
  }

  return config;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function getSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, "")}`;
  }

  return "http://localhost:3000";
}

/** Use the incoming request host for post-auth redirects (avoids localhost vs 127.0.0.1 cookie mismatch). */
export function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const proto = forwardedProto ?? (forwardedHost.includes("localhost") ? "http" : "https");
    return `${proto}://${forwardedHost}`;
  }

  return url.origin;
}

/** Map PostgREST / misconfigured URL errors to a clear fix message. */
export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid path specified") || lower.includes("pgrst125")) {
    return (
      "Supabase URL is misconfigured. Set NEXT_PUBLIC_SUPABASE_URL to your project root only " +
      "(e.g. https://YOUR_REF.supabase.co) — remove /rest/v1 from the URL."
    );
  }

  if (lower.includes("email not confirmed")) {
    return (
      "Please confirm your email first, or disable “Confirm email” in Supabase → Authentication → Providers → Email for local testing."
    );
  }

  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  return message;
}
