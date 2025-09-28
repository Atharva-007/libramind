-- Performance Optimized RLS Policies for LibraMind
-- This script fixes the auth_rls_initplan warnings by optimizing auth.uid() calls
-- Run this in Supabase SQL Editor to optimize existing RLS policies
-- Drop existing policies first
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
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;
-- Create optimized RLS policies using (select auth.uid()) pattern
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
-- Optimized Bookmark policies
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
-- Success message
SELECT 'RLS policies optimized successfully! Performance warnings should be resolved.' as optimization_status;