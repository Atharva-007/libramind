import { createServerClient } from "@/lib/supabase/server" // Changed import to createServerClient
import { NextResponse } from "next/server"
import { cookies } from "next/headers" // Added import for cookies

export async function GET() {
  const cookieStore = cookies() // Get cookieStore
  const { supabase } = createServerClient(cookieStore) // Updated createClient call to createServerClient

  const { data: challenges, error } = await supabase
    .from("reading_challenges")
    .select("*")
    .order("start_date", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(challenges, { status: 200 })
}

export async function POST(request: Request) {
  const { name, description, goal, start_date, end_date } = await request.json()
  const cookieStore = cookies() // Get cookieStore
  const { supabase } = createServerClient(cookieStore) // Updated createClient call to createServerClient

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For now, only authenticated users can create challenges.
  // In a real app, this would be restricted to admin users.
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("reading_challenges")
    .insert([{ name, description, goal, start_date, end_date }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
