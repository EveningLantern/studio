import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid';


export function createSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}


export function createSupabaseAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        // Admin client should not need to manage cookies, but the library requires it.
        // These can be minimal implementations.
        get(name: string) {
          const cookieStore = cookies()
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieStore = cookies()
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This may fail in Server Actions, but it's okay.
          }
        },
        remove(name: string, options: CookieOptions) {
          const cookieStore = cookies()
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
             // This may fail in Server Actions, but it's okay.
          }
        },
      },
    }
  )
}
