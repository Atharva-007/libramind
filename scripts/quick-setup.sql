-- Quick Fix Database Setup for LibraMind
-- Run this FIRST in your Supabase SQL Editor to fix immediate issues
-- 1. Create user_pdfs table (core PDF functionality)
CREATE TABLE IF NOT EXISTS user_pdfs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT,
    upload_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    file_size BIGINT,
    total_pages INTEGER DEFAULT 1,
    reading_progress JSONB DEFAULT '{"currentPage": 1, "lastRead": null}'::jsonb,
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- 2. Create chat tables (AI chat functionality)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    last_message TEXT DEFAULT '',
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- 3. Create bookmarks table (basic bookmarking)
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    book_title TEXT NOT NULL,
    book_author TEXT,
    book_cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Enable Row Level Security
ALTER TABLE user_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
-- 5. Create optimized RLS policies (performance optimized)
-- PDF policies
CREATE POLICY "Users can view their own PDFs" ON user_pdfs FOR
SELECT USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can insert their own PDFs" ON user_pdfs FOR
INSERT WITH CHECK (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can update their own PDFs" ON user_pdfs FOR
UPDATE USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can delete their own PDFs" ON user_pdfs FOR DELETE USING (
    (
        select auth.uid()
    ) = user_id
);
-- Chat session policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions FOR
SELECT USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions FOR
INSERT WITH CHECK (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can update their own chat sessions" ON chat_sessions FOR
UPDATE USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions FOR DELETE USING (
    (
        select auth.uid()
    ) = user_id
);
-- Chat message policies
CREATE POLICY "Users can view messages from their own chat sessions" ON chat_messages FOR
SELECT USING (
        (
            select auth.uid()
        ) IN (
            SELECT user_id
            FROM chat_sessions
            WHERE id = chat_session_id
        )
    );
CREATE POLICY "Users can insert messages to their own chat sessions" ON chat_messages FOR
INSERT WITH CHECK (
        (
            select auth.uid()
        ) IN (
            SELECT user_id
            FROM chat_sessions
            WHERE id = chat_session_id
        )
    );
-- Bookmark policies
CREATE POLICY "Users can view their own bookmarks" ON bookmarks FOR
SELECT USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks FOR
INSERT WITH CHECK (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can update their own bookmarks" ON bookmarks FOR
UPDATE USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks FOR DELETE USING (
    (
        select auth.uid()
    ) = user_id
);
-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_pdfs_user_id ON user_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pdfs_upload_date ON user_pdfs(upload_date);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
-- Success message
SELECT 'LibraMind core tables created successfully! You can now upload PDFs and use AI chat.' as setup_status;