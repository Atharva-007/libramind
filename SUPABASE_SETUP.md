# Supabase Database Setup Guide

## CRITICAL: Run This Setup First!

Your application is failing because the database tables don't exist yet. Follow these steps:

## Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in and select your project: **rylublukzcvhfrqvyhyp**
3. Click on "SQL Editor" in the left sidebar

## Step 2: Run Database Setup Script
1. In the SQL Editor, paste the contents of `scripts/quick-setup.sql`
2. Click "Run" to execute the script
3. You should see: "LibraMind core tables created successfully!"

## Step 3: Verify Tables Created
Run this query to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- bookmarks
- chat_messages  
- chat_sessions
- user_pdfs

## Step 4: Test the Application
1. Go to http://localhost:3000
2. Try uploading a PDF - it should now work!
3. Test AI chat functionality
4. Check library view for uploaded PDFs

## Common Issues

### Issue: "Could not find the 'storage_path' column"
**Solution:** You haven't run the database setup script yet. Run `quick-setup.sql` in Supabase SQL Editor.

### Issue: AI summary not working
**Solution:** 
1. Check your `GOOGLE_GEMINI_API_KEY` in `.env.local`
2. Test AI endpoint: http://localhost:3000/api/test-ai
3. Make sure you have billing enabled on Google AI Studio

### Issue: S3 storage not working
**Solution:** 
1. Check your S3 credentials in `.env.local`
2. Make sure the "pdfs" bucket exists in Supabase Storage
3. Go to Storage > Settings and verify S3 gateway is enabled

## Next Steps After Setup
1. **Create Storage Bucket:**
   - Go to Storage in Supabase dashboard
   - Create a bucket named "pdfs"
   - Set it to public if you want direct PDF access

2. **Enable RLS Policies:**
   - All tables have Row Level Security enabled
   - Policies are automatically created for user isolation

3. **Test All Features:**
   - PDF upload with AI summary
   - Chat with AI about PDFs
   - View uploaded PDFs in library
   - Bookmark functionality

## Environment Variables Reference
Make sure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rylublukzcvhfrqvyhyp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
S3_ENDPOINT=https://rylublukzcvhfrqvyhyp.storage.supabase.co/storage/v1/s3
S3_BUCKET=pdfs
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
```

## Troubleshooting
If you're still having issues:
1. Check browser developer console for errors
2. Check terminal logs for detailed error messages
3. Verify all environment variables are set correctly
4. Make sure you're authenticated in the app