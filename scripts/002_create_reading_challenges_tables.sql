CREATE TABLE IF NOT EXISTS reading_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  goal INT NOT NULL, -- e.g., number of books to read
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE reading_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reading challenges." ON reading_challenges
  FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES reading_challenges(id) ON DELETE CASCADE NOT NULL,
  books_read INT DEFAULT 0,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenge progress." ON user_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges." ON user_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their challenge progress." ON user_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can leave challenges." ON user_challenges
  FOR DELETE USING (auth.uid() = user_id);
