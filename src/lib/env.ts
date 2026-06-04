export {
  formatAuthError,
  getRequestOrigin,
  getSiteUrl,
  getSupabaseConfig,
  isSupabaseConfigured,
  normalizeSupabaseUrl,
  requireSupabaseConfig,
  SupabaseConfigError,
} from "@/lib/supabase/config";

import { getSupabaseConfig, normalizeSupabaseUrl } from "@/lib/supabase/config";

export function getSupabaseUrl(): string {
  return getSupabaseConfig()?.url ?? normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
}

export function getSupabaseAnonKey(): string {
  return getSupabaseConfig()?.anonKey ?? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
}
