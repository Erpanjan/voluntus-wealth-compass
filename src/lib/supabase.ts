
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use demo/fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required Supabase credentials
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey;

// If credentials are missing, log a more helpful error message
if (!hasSupabaseCredentials) {
  console.error(
    'Missing Supabase environment variables. To set up Supabase:\n' +
    '1. Create a .env file in your project root\n' +
    '2. Add these variables to your .env file:\n' +
    '   VITE_SUPABASE_URL=your-supabase-url\n' +
    '   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key\n' +
    '3. Restart your development server'
  );
}

// Create a dummy client for development if credentials are missing
// This will prevent the app from crashing, but authentication won't work
export const supabase = createClient(
  // Use demo URL or empty string if not available
  supabaseUrl || 'https://placeholder-supabase-url.supabase.co',
  // Use demo key or empty string if not available
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasSupabaseCredentials;
