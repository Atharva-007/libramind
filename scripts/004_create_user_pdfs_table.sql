-- Create table for storing user PDF documents
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
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE user_pdfs ENABLE ROW LEVEL SECURITY;
-- Create policies
CREATE POLICY "Users can view their own PDFs" ON user_pdfs FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own PDFs" ON user_pdfs FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own PDFs" ON user_pdfs FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own PDFs" ON user_pdfs FOR DELETE USING (auth.uid() = user_id);
-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_pdfs_user_id ON user_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pdfs_upload_date ON user_pdfs(upload_date);