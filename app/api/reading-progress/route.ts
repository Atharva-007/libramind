import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { book_id, pages_read, total_pages } = await request.json()
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: user.id,
        book_id,
        pages_read,
        total_pages,
        last_read_date: new Date().toISOString(),
      },
      { onConflict: "user_id,book_id" },
    )
    .select()

  if (error) {
    console.error("[v0] Error logging reading progress:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET() {
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("reading_progress").select("*").eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching reading progress:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
