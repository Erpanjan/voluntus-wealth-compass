
import { createClient } from '@supabase/supabase-js';

// The Supabase URL and anon key for "Voluntus Long-term Capital" project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-anon-key';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://missing-supabase-url.supabase.co' && 
         supabaseAnonKey !== 'missing-anon-key';
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Export auth for convenience
export const auth = supabase.auth;
