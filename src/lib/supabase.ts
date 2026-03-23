import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

type SupabaseClientLike = {
  from: (...args: any[]) => {
    select: (...args: any[]) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
};

let supabaseClient: any;
if (!supabaseUrl || !supabaseAnonKey) {
  // If env isn't configured, keep the app running and fail gracefully on requests.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Fill .env.local to enable Supabase."
  );

  const safeClient: SupabaseClientLike = {
    from: () => ({
      select: async () => {
        return {
          data: [],
          error: { message: "Supabase is not configured (missing env vars)." },
        };
      },
    }),
  };

  supabaseClient = safeClient as any;
}

supabaseClient = supabaseClient ?? createClient(supabaseUrl, supabaseAnonKey);

export const supabase = supabaseClient;

