import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Note: The service_role key should be stored securely in environment variables
// and NOT be exposed on the client side. We will use the anon key here
// for client-side operations, and you should set up Row Level Security (RLS)
// in your Supabase project. For server-side operations, you'd use the secret key.
// I have used the provided publishable key.

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Placeholder for your secret key for server-side operations
// const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
