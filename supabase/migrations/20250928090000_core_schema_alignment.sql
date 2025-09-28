-- Align LibraMind core schema with application requirements and ensure compatibility with CLI migrations.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Ensure PDF bookmark support exists for the reader experience
CREATE TABLE IF NOT EXISTS pdf_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pdf_id TEXT REFERENCES user_pdfs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- Bring bookmarks metadata columns in line with application code expectations
ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS author TEXT,
    ADD COLUMN IF NOT EXISTS genre TEXT,
    ADD COLUMN IF NOT EXISTS cover_url TEXT;
-- Ensure optional storage data is available on PDFs
ALTER TABLE user_pdfs
ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS file_size BIGINT,
    ADD COLUMN IF NOT EXISTS total_pages INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS reading_progress JSONB DEFAULT '{"currentPage": 1, "lastRead": null}'::jsonb;
-- Helpful indexes (safe re-runs)
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_user_id ON pdf_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_pdf_id ON pdf_bookmarks(pdf_id);
-- Enforce RLS and policies for pdf_bookmarks
ALTER TABLE pdf_bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can update their own PDF bookmarks" ON pdf_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own PDF bookmarks" ON pdf_bookmarks;
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