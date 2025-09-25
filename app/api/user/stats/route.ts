import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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

    // Get user's reading stats
    const { data: readingProgress } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", user.id)

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)

    // Calculate stats
    const totalPagesRead = readingProgress?.reduce((sum: number, book: any) => sum + (book.pages_read || 0), 0) || 0
    const booksInProgress = readingProgress?.filter((book: any) => book.pages_read > 0 && book.pages_read < book.total_pages).length || 0
    const booksCompleted = readingProgress?.filter((book: any) => book.pages_read >= book.total_pages).length || 0
    const totalBookmarks = bookmarks?.length || 0

    // Calculate reading streak (simplified - in real app, would check daily reading)
    const readingStreak = readingProgress?.length ? Math.min(readingProgress.length, 30) : 0

    const stats = {
        booksRead: booksCompleted,
        booksInProgress,
        pagesRead: totalPagesRead,
        bookmarked: totalBookmarks,
        readingStreak,
        totalBooks: readingProgress?.length || 0,
        averageRating: 4.2, // Would calculate from actual ratings
        user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Reader'
        }
    }

    return NextResponse.json(stats)
}