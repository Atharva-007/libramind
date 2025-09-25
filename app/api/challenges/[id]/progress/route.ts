import { createServerClient } from "@/lib/supabase/server" // Changed import to createServerClient
import { NextResponse } from "next/server"
import { cookies } from "next/headers" // Added import for cookies

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const challenge_id = params.id
  const { books_read } = await request.json()
  const cookieStore = cookies() // Get cookieStore
  const { supabase } = createServerClient(cookieStore) // Updated createClient call to createServerClient

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("user_challenges")
    .update({ books_read: books_read })
    .eq("user_id", user.id)
    .eq("challenge_id", challenge_id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 200 })
}
