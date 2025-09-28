-- LibraMind Complete Database Setup
-- Run this script in your Supabase SQL Editor
-- ============================================================================
-- STEP 1: Create Core Tables
-- ============================================================================
-- 1. Bookmarks Table
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
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_book_id_idx ON bookmarks(book_id);
-- 2. Reading Challenges Tables
CREATE TABLE IF NOT EXISTS reading_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_books INTEGER NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES reading_challenges(id) ON DELETE CASCADE,
    books_completed INTEGER DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);
CREATE INDEX IF NOT EXISTS user_challenges_user_id_idx ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS user_challenges_challenge_id_idx ON user_challenges(challenge_id);
-- 3. Reading Progress Table
CREATE TABLE IF NOT EXISTS reading_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    book_title TEXT NOT NULL,
    book_author TEXT,
    book_cover_url TEXT,
    total_pages INTEGER,
    current_page INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    status TEXT CHECK (
        status IN ('not_started', 'reading', 'completed', 'paused')
    ) DEFAULT 'not_started',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);
CREATE INDEX IF NOT EXISTS reading_progress_user_id_idx ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS reading_progress_status_idx ON reading_progress(status);
-- ============================================================================
-- STEP 2: Create PDF and Chat Tables (LibraMind Pro Features)
-- ============================================================================
-- 4. User PDFs Table (for PDF upload and AI processing)
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
-- 5. Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    last_message TEXT DEFAULT '',
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- 6. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- 7. PDF Bookmarks Table (for PDF reading features)
CREATE TABLE IF NOT EXISTS pdf_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pdf_id TEXT REFERENCES user_pdfs(id) ON DELETE CASCADE NOT NULL,
    page_number INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pdfs_user_id ON user_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pdfs_upload_date ON user_pdfs(upload_date);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_user_id ON pdf_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_pdf_id ON pdf_bookmarks(pdf_id);
-- ============================================================================
-- STEP 3: Enable Row Level Security (RLS)
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_bookmarks ENABLE ROW LEVEL SECURITY;
-- ============================================================================
-- STEP 4: Create RLS Policies
-- ============================================================================
-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON bookmarks FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookmarks" ON bookmarks FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);
-- Reading challenges policies
CREATE POLICY "Users can view public challenges" ON reading_challenges FOR
SELECT USING (
        is_public = true
        OR auth.uid() = created_by
    );
CREATE POLICY "Users can create challenges" ON reading_challenges FOR
INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own challenges" ON reading_challenges FOR
UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own challenges" ON reading_challenges FOR DELETE USING (auth.uid() = created_by);
-- User challenges policies
CREATE POLICY "Users can view their own challenge participation" ON user_challenges FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join challenges" ON user_challenges FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenge progress" ON user_challenges FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own challenge participation" ON user_challenges FOR DELETE USING (auth.uid() = user_id);
-- Reading progress policies
CREATE POLICY "Users can view their own reading progress" ON reading_progress FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reading progress" ON reading_progress FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reading progress" ON reading_progress FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reading progress" ON reading_progress FOR DELETE USING (auth.uid() = user_id);
-- PDF policies
CREATE POLICY "Users can view their own PDFs" ON user_pdfs FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own PDFs" ON user_pdfs FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own PDFs" ON user_pdfs FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own PDFs" ON user_pdfs FOR DELETE USING (auth.uid() = user_id);
-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON chat_sessions FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);
-- Chat messages policies (users can only access messages from their own chat sessions)
CREATE POLICY "Users can view messages from their own chat sessions" ON chat_messages FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM chat_sessions
            WHERE id = chat_session_id
        )
    );
CREATE POLICY "Users can insert messages to their own chat sessions" ON chat_messages FOR
INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id
            FROM chat_sessions
            WHERE id = chat_session_id
        )
    );
CREATE POLICY "Users can update messages in their own chat sessions" ON chat_messages FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM chat_sessions
            WHERE id = chat_session_id
        )
    );
CREATE POLICY "Users can delete messages from their own chat sessions" ON chat_messages FOR DELETE USING (
    auth.uid() IN (
        SELECT user_id
        FROM chat_sessions
        WHERE id = chat_session_id
    )
);
-- PDF bookmarks policies
CREATE POLICY "Users can view their own PDF bookmarks" ON pdf_bookmarks FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own PDF bookmarks" ON pdf_bookmarks FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own PDF bookmarks" ON pdf_bookmarks FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own PDF bookmarks" ON pdf_bookmarks FOR DELETE USING (auth.uid() = user_id);
-- ============================================================================
-- STEP 5: Insert Sample Data (Optional)
-- ============================================================================
-- Sample reading challenges (only if none exist)
INSERT INTO reading_challenges (
        title,
        description,
        target_books,
        start_date,
        end_date,
        created_by,
        is_public
    )
SELECT '2024 Reading Challenge',
    'Read 12 books in 2024 - one book per month!',
    12,
    '2024-01-01'::date,
    '2024-12-31'::date,
    (
        SELECT id
        FROM auth.users
        LIMIT 1
    ), true
WHERE NOT EXISTS (
        SELECT 1
        FROM reading_challenges
        WHERE title = '2024 Reading Challenge'
    );
INSERT INTO reading_challenges (
        title,
        description,
        target_books,
        start_date,
        end_date,
        created_by,
        is_public
    )
SELECT 'Classic Literature Challenge',
    'Explore the greatest works of literature from around the world.',
    6,
    '2024-01-01'::date,
    '2024-06-30'::date,
    (
        SELECT id
        FROM auth.users
        LIMIT 1
    ), true
WHERE NOT EXISTS (
        SELECT 1
        FROM reading_challenges
        WHERE title = 'Classic Literature Challenge'
    );
-- Success message
DO $$ BEGIN RAISE NOTICE 'LibraMind database setup completed successfully!';
RAISE NOTICE 'Created tables: bookmarks, reading_challenges, user_challenges, reading_progress, user_pdfs, chat_sessions, chat_messages, pdf_bookmarks';
RAISE NOTICE 'Enabled Row Level Security on all tables';
RAISE NOTICE 'Created appropriate policies for data access';
RAISE NOTICE 'Your LibraMind application is ready to use!';
END $$;