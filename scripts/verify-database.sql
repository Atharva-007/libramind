-- Database Verification Script
-- Run this after the main setup to verify everything is working
-- Check if all tables exist
SELECT table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'bookmarks',
        'reading_challenges',
        'user_challenges',
        'reading_progress',
        'user_pdfs',
        'chat_sessions',
        'chat_messages',
        'pdf_bookmarks'
    )
ORDER BY table_name;
-- Check RLS status
SELECT tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'bookmarks',
        'reading_challenges',
        'user_challenges',
        'reading_progress',
        'user_pdfs',
        'chat_sessions',
        'chat_messages',
        'pdf_bookmarks'
    )
ORDER BY tablename;
-- Count policies per table
SELECT schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN (
        'bookmarks',
        'reading_challenges',
        'user_challenges',
        'reading_progress',
        'user_pdfs',
        'chat_sessions',
        'chat_messages',
        'pdf_bookmarks'
    )
GROUP BY schemaname,
    tablename
ORDER BY tablename;
-- Check indexes
SELECT schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN (
        'bookmarks',
        'reading_challenges',
        'user_challenges',
        'reading_progress',
        'user_pdfs',
        'chat_sessions',
        'chat_messages',
        'pdf_bookmarks'
    )
ORDER BY tablename,
    indexname;