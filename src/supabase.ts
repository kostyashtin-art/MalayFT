import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    DP_SUPABASE_CONFIG?: {
      url?: string;
      publishableKey?: string;
      anonKey?: string;
    };
  }
}

type ViteEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

const browserConfig = window.DP_SUPABASE_CONFIG ?? {};
const env = (import.meta as ImportMeta & { env?: ViteEnv }).env ?? {};
const url = browserConfig.url || env.VITE_SUPABASE_URL || '';
const key = browserConfig.publishableKey || browserConfig.anonKey || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabaseConfigured = Boolean(url && key);
export const supabase = supabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
