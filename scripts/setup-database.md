# LibraMind Database Setup Guide

## Quick Setup (Recommended)

### Step 1: Run Complete Setup Script
Copy and paste the entire content of `scripts/complete-database-setup.sql` into your Supabase SQL Editor and run it. This will create all tables, indexes, and security policies in one go.

### Step 2: Create Storage Buckets
In your Supabase Dashboard:

1. **Go to Storage**
2. **Create "pdfs" bucket:**
   - Name: `pdfs`
   - Public: **OFF** (private bucket for PDF storage)
   - Click Create

3. **Create "book-covers" bucket:**
   - Name: `book-covers` 
   - Public: **ON** (for book cover images)
   - Click Create

### Step 3: Verify Setup
Run `scripts/verify-database.sql` in Supabase SQL Editor to confirm everything is working.

## What Gets Created

After setup, you'll have these tables:
- ✅ `bookmarks` - Save favorite books
- ✅ `reading_challenges` - Reading challenges and goals
- ✅ `user_challenges` - User participation in challenges
- ✅ `reading_progress` - Track reading progress
- ✅ `user_pdfs` - PDF uploads with AI summaries
- ✅ `chat_sessions` - AI chat conversations
- ✅ `chat_messages` - Individual chat messages
- ✅ `pdf_bookmarks` - Bookmarks within PDFs

All tables have:
- ✅ Row Level Security (RLS) enabled
- ✅ Proper access policies
- ✅ Performance indexes
- ✅ Foreign key constraints

## Manual Setup (Alternative)

If you prefer to run scripts individually:

1. `scripts/001_create_bookmarks_table.sql`
2. `scripts/002_create_reading_challenges_tables.sql`
3. `scripts/003_create_reading_progress_table.sql`
4. `scripts/004_create_user_pdfs_table.sql`
5. `scripts/005_create_chat_and_bookmark_tables.sql`
6. `scripts/006_add_storage_path_to_user_pdfs.sql`

## Troubleshooting

If you get errors:
- Make sure you're logged into Supabase as the project owner
- Check that your project has the required permissions
- Run the verification script to see what's missing
- Delete and recreate tables if there are conflicts

## Next Steps

After database setup:
1. Start your development server: `npm run dev`
2. Create a user account through the app
3. Test PDF upload functionality
4. Try the AI chat features