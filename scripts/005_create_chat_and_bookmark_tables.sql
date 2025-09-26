-- Create table for chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    last_message TEXT DEFAULT '',
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- Create table for chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    message_type TEXT DEFAULT 'text' CHECK (
        message_type IN ('text', 'summary', 'book-recommendation')
    ),
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Create table for PDF bookmarks
CREATE TABLE IF NOT EXISTS pdf_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pdf_id TEXT REFERENCES user_pdfs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_bookmarks ENABLE ROW LEVEL SECURITY;
-- Create policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON chat_sessions FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);
-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their chat sessions" ON chat_messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.chat_session_id
                AND chat_sessions.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert messages to their chat sessions" ON chat_messages FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.chat_session_id
                AND chat_sessions.user_id = auth.uid()
        )
    );
-- Create policies for pdf_bookmarks
CREATE POLICY "Users can view their own PDF bookmarks" ON pdf_bookmarks FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own PDF bookmarks" ON pdf_bookmarks FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own PDF bookmarks" ON pdf_bookmarks FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own PDF bookmarks" ON pdf_bookmarks FOR DELETE USING (auth.uid() = user_id);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_pdf_id ON pdf_bookmarks(pdf_id);
CREATE INDEX IF NOT EXISTS idx_pdf_bookmarks_user_id ON pdf_bookmarks(user_id);