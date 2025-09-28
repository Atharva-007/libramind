-- Performance Optimized RLS Policies for LibraMind
-- This migration now also guarantees the core tables, indexes, and RLS configuration exist.
-- Ensure required extensions are available for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Core tables --------------------------------------------------------------
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
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    last_message TEXT DEFAULT '',
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    message_type TEXT DEFAULT 'text' CHECK (
        message_type IN ('text', 'summary', 'book-recommendation')
    ),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book_id TEXT NOT NULL,
    title TEXT,
    author TEXT,
    genre TEXT,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS pdf_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pdf_id TEXT REFERENCES user_pdfs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- Backfill optional metadata columns if legacy schema is present
ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS author TEXT,
    ADD COLUMN IF NOT EXISTS genre TEXT,
    ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE user_pdfs
ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS reading_progress JSONB DEFAULT '{"currentPage": 1, "lastRead": null}'::jsonb;
-- Helpful indexes ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_pdfs_user_id ON user_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pdfs_upload_date ON user_pdfs(upload_date);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_user_id ON pdf_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_pdf_id ON pdf_bookmarks(pdf_id);
-- Enable Row Level Security before defining policies ----------------------
ALTER TABLE IF EXISTS user_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pdf_bookmarks ENABLE ROW LEVEL SECURITY;
-- Drop existing policies (safe even if they do not exist) ------------------
DROP POLICY IF EXISTS "Users can view their own PDFs" ON user_pdfs;
DROP POLICY IF EXISTS "Users can insert their own PDFs" ON user_pdfs;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON user_pdfs;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON user_pdfs;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view messages from their own chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their own chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages from their own chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can view their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can update their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own PDF bookmarks" ON pdf_bookmarks;
-- Create optimized RLS policies using (select auth.uid()) pattern ----------
-- Optimized PDF policies
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
-- Optimized Chat session policies
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
-- Optimized Chat message policies
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
CREATE POLICY "Users can delete messages from their own chat sessions" ON chat_messages FOR DELETE USING (
    (
        select auth.uid()
    ) IN (
        SELECT user_id
        FROM chat_sessions
        WHERE id = chat_session_id
    )
);
-- Optimized Bookmark policies (reading list)
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
-- Optimized PDF bookmark policies (reader highlights)
CREATE POLICY "Users can view their own PDF bookmarks" ON pdf_bookmarks FOR
SELECT USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can insert their own PDF bookmarks" ON pdf_bookmarks FOR
INSERT WITH CHECK (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can update their own PDF bookmarks" ON pdf_bookmarks FOR
UPDATE USING (
        (
            select auth.uid()
        ) = user_id
    );
CREATE POLICY "Users can delete their own PDF bookmarks" ON pdf_bookmarks FOR DELETE USING (
    (
        select auth.uid()
    ) = user_id
);
-- Success message (optional)
-- SELECT 'RLS policies optimized successfully! Performance warnings should be resolved.' as optimization_status;