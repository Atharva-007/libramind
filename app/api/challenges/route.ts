import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const { data: challenges, error } = await supabase
    .from('reading_challenges')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(challenges, { status: 200 })
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })

  const { name, description, goal, start_date, end_date } = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('reading_challenges')
    .insert([{ name, description, goal, start_date, end_date }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data?.[0] || null, { status: 201 })
}
