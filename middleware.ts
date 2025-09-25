import { NextResponse, type NextRequest } from "next/server"
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { getSupabaseConfig } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const config = getSupabaseConfig()

  if (!config) {
    return response
  }

  const supabase = createSupabaseServerClient(config.url, config.anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/signup" &&
    request.nextUrl.pathname !== "/challenges"
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files in the public folder (e.g. images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
