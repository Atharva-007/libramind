import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = createServerClient()

        if (!supabase) {
            return NextResponse.json({
                error: 'Database configuration error',
                status: 'failed'
            }, { status: 500 })
        }

        // Test database connection by checking if tables exist
        const { data: tables, error: tablesError } = await supabase
            .from('user_pdfs')
            .select('count', { count: 'exact', head: true })

        if (tablesError) {
            return NextResponse.json({
                error: 'Database table error',
                details: tablesError.message,
                status: 'database_error'
            }, { status: 500 })
        }

        // Test if we can access chat_sessions table
        const { data: chatTables, error: chatError } = await supabase
            .from('chat_sessions')
            .select('count', { count: 'exact', head: true })

        if (chatError) {
            return NextResponse.json({
                error: 'Chat tables error',
                details: chatError.message,
                status: 'chat_error'
            }, { status: 500 })
        }

        // Test bookmarks table
        const { data: bookmarkTables, error: bookmarkError } = await supabase
            .from('bookmarks')
            .select('count', { count: 'exact', head: true })

        if (bookmarkError) {
            return NextResponse.json({
                error: 'Bookmarks table error',
                details: bookmarkError.message,
                status: 'bookmark_error'
            }, { status: 500 })
        }

        return NextResponse.json({
            status: 'success',
            message: 'All database tables are accessible!',
            tables: {
                user_pdfs: 'accessible',
                chat_sessions: 'accessible',
                bookmarks: 'accessible'
            },
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Database test error:', error)
        return NextResponse.json({
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            status: 'connection_failed'
        }, { status: 500 })
    }
}