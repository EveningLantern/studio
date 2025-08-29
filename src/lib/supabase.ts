import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This is the public client, safe to be used in browser environments.
// It uses the anonymous key and respects your Row Level Security (RLS) policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Creates a new Supabase client for use in server-side contexts (Server Components, Server Actions, Route Handlers).
 * 
 * This function is cached to ensure that a new client is not created on every request.
 * It uses the service_role key, which bypasses Row Level Security.
 *
 * IMPORTANT: This client should NEVER be exposed to the client-side. It is for
 * trusted server-side operations only.
 *
 * @returns {SupabaseClient} A Supabase client with admin privileges.
 */
export const createSupabaseAdmin = cache(() => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. This is required for server-side admin operations.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // It is recommended to disable auto-refreshing sessions for server-side clients.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
});
