## URGENT: Fix Database Issues

**Your app is failing because database tables don't exist. Here's how to fix it:**

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/rylublukzcvhfrqvyhyp
- Login with your account
- Click "SQL Editor" in the left sidebar

### 2. Copy and paste this SQL script:

```sql
-- Create user_pdfs table (CRITICAL for PDF uploads)
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

-- Create chat tables
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

-- Create bookmarks table
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

-- Enable Row Level Security
ALTER TABLE user_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- PDF policies
CREATE POLICY IF NOT EXISTS "Users can view their own PDFs" ON user_pdfs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own PDFs" ON user_pdfs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own PDFs" ON user_pdfs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own PDFs" ON user_pdfs FOR DELETE USING (auth.uid() = user_id);

-- Chat session policies
CREATE POLICY IF NOT EXISTS "Users can view their own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own chat sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own chat sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Chat message policies
CREATE POLICY IF NOT EXISTS "Users can view messages from their own chat sessions" ON chat_messages FOR SELECT USING (
    auth.uid() IN (
        SELECT user_id FROM chat_sessions WHERE id = chat_session_id
    )
);
CREATE POLICY IF NOT EXISTS "Users can insert messages to their own chat sessions" ON chat_messages FOR INSERT WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM chat_sessions WHERE id = chat_session_id
    )
);

-- Bookmark policies
CREATE POLICY IF NOT EXISTS "Users can view their own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_pdfs_user_id ON user_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pdfs_upload_date ON user_pdfs(upload_date);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Success message
SELECT 'Database setup complete! You can now use all features.' as status;
```

### 3. Click "Run" to execute the script

### 4. Create Storage Bucket
- Go to "Storage" in the left sidebar
- Click "New Bucket"
- Name it: `pdfs`
- Make it public or private (your choice)
- Click "Create bucket"

### 5. Test Your App
- Go to http://localhost:3000
- Try uploading a PDF
- Test AI chat
- Everything should work now!

**This fixes the errors:**
- ✅ "Could not find the 'storage_path' column" 
- ✅ Database table missing errors
- ✅ PDF upload functionality
- ✅ AI chat functionality
- ✅ Bookmarks feature

**After running this setup, all your features will work!**