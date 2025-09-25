import { createServerClient } from "@/lib/supabase/server" // Changed import to createServerClient
import { NextResponse } from "next/server"
import { cookies } from "next/headers" // Added import for cookies

export async function GET() {
  const cookieStore = cookies() // Get cookieStore
  const { supabase } = createServerClient(cookieStore) // Updated createClient call to createServerClient

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("bookmarks").select("book_id").eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    data.map((b) => b.book_id),
    { status: 200 },
  )
}
