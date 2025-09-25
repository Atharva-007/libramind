CREATE TABLE reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  pages_read INT NOT NULL,
  total_pages INT,
  last_read_date TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading progress." ON reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress." ON reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress." ON reading_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress." ON reading_progress
  FOR DELETE USING (auth.uid() = user_id);
