import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
  const { bookId } = params
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 means no rows found
    console.error("[v0] Error fetching reading progress for book:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
