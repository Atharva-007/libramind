import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

interface SupabaseConfig {
  url: string
  anonKey: string
}

let hasLoggedMissingConfig = false

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (!hasLoggedMissingConfig) {
      console.warn(
        "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Auth features will be disabled.",
      )
      hasLoggedMissingConfig = true
    }
    return null
  }

  return { url, anonKey }
}

export function createServerClient(): SupabaseClient | null {
  const config = getSupabaseConfig()
  if (!config) {
    return null
  }

  const cookieStore = cookies()

  return createSupabaseServerClient(config.url, config.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
